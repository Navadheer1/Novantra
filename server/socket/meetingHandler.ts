import { Server, Socket } from 'socket.io';
import { prisma } from '../index';

interface Participant {
  socketId: string;
  userId: string;
  name: string;
  role: string;
  isHost: boolean;
}

interface RoomState {
  meetingCode: string;
  hostFounderId: string;
  admittedParticipants: Map<string, Participant>; // socketId -> Participant
  waitingParticipants: Map<string, Participant>;  // socketId -> Participant
}

const activeRooms = new Map<string, RoomState>();

export function registerMeetingHandlers(io: Server) {
  io.on('connection', (socket: Socket) => {
    
    // User requests to join meeting
    socket.on('join-meeting', async ({ meetingCode, userId, name, isHost }) => {
      try {
        console.log(`[Meeting] join-meeting requested by ${name} (${userId}) for room ${meetingCode}. Host status: ${isHost}`);
        
        // Find meeting in database to verify existence and host
        const meeting = await prisma.meeting.findUnique({
          where: { meetingCode, status: 'ACTIVE' }
        });

        // Initialize room state if not exists (support DB rooms and instant/dynamic rooms)
        if (!activeRooms.has(meetingCode)) {
          activeRooms.set(meetingCode, {
            meetingCode,
            hostFounderId: meeting?.hostFounderId || userId,
            admittedParticipants: new Map(),
            waitingParticipants: new Map(),
          });
        }
        
        const room = activeRooms.get(meetingCode)!;
        
        // Find user details in DB
        const dbUser = await prisma.user.findUnique({ where: { id: userId } });
        const actualHost = (dbUser && dbUser.id === room.hostFounderId) || isHost || room.admittedParticipants.size === 0;

        const participantInfo: Participant = {
          socketId: socket.id,
          userId,
          name: name || (dbUser ? dbUser.name : 'Guest'),
          role: (dbUser && dbUser.role) ? dbUser.role : 'USER',
          isHost: !!actualHost
        };

        if (actualHost) {
          // Hosts bypass waiting room, admitted immediately
          room.admittedParticipants.set(socket.id, participantInfo);
          socket.join(meetingCode);
          socket.join(`${meetingCode}-admitted`);
          
          socket.emit('joined-admitted', {
            participantId: socket.id,
            isHost: true,
            admittedUsers: Array.from(room.admittedParticipants.values())
          });
          
          // Notify other admitted users
          socket.to(`${meetingCode}-admitted`).emit('user-joined', {
            socketId: socket.id,
            userId,
            name: participantInfo.name,
            role: participantInfo.role,
            isHost: true
          });
          
          // Send waiting room list to the host
          socket.emit('waiting-list-update', Array.from(room.waitingParticipants.values()));
          
          console.log(`[Meeting] Host ${participantInfo.name} joined room ${meetingCode}`);
        } else {
          // Guests enter waiting room
          // Check limit: maximum 6 admitted participants allowed (1 host + 5 guests)
          const currentAdmittedCount = room.admittedParticipants.size;
          if (currentAdmittedCount >= 6) {
            socket.emit('meeting-full', 'This meeting is full. The MVP supports up to 6 participants.');
            console.log(`[Meeting] Room ${meetingCode} full. Denying entry to ${participantInfo.name}`);
            return;
          }

          // Put guest in waiting list
          room.waitingParticipants.set(socket.id, participantInfo);
          socket.join(meetingCode);
          socket.emit('waiting-room', { msg: 'Waiting for the host to admit you...' });
          
          // Notify the host(s) that someone is waiting
          const hosts = Array.from(room.admittedParticipants.values()).filter(p => p.isHost);
          for (const host of hosts) {
            io.to(host.socketId).emit('waiting-list-update', Array.from(room.waitingParticipants.values()));
          }
          
          console.log(`[Meeting] Guest ${participantInfo.name} placed in waiting room for room ${meetingCode}`);
        }
      } catch (err) {
        console.error('[Meeting] Error during join-meeting:', err);
        socket.emit('meeting-error', 'An internal server error occurred.');
      }
    });

    // Host admits a guest
    socket.on('admit-user', async ({ meetingCode, guestSocketId }) => {
      try {
        const room = activeRooms.get(meetingCode);
        if (!room) return;

        // Verify that the sender is actually the host
        const sender = room.admittedParticipants.get(socket.id);
        if (!sender || !sender.isHost) {
          socket.emit('meeting-error', 'Only hosts can admit participants.');
          return;
        }

        const guest = room.waitingParticipants.get(guestSocketId);
        if (!guest) {
          socket.emit('meeting-error', 'Participant not found in waiting room.');
          return;
        }

        // Check limit again: maximum 6 admitted participants allowed
        if (room.admittedParticipants.size >= 6) {
          socket.emit('meeting-error', 'Meeting is full. The MVP supports up to 6 participants.');
          return;
        }

        // Move from waiting to admitted
        room.waitingParticipants.delete(guestSocketId);
        room.admittedParticipants.set(guestSocketId, guest);

        // Notify all hosts of updated waiting list
        const hosts = Array.from(room.admittedParticipants.values()).filter(p => p.isHost);
        for (const host of hosts) {
          io.to(host.socketId).emit('waiting-list-update', Array.from(room.waitingParticipants.values()));
        }

        // Target guest socket
        const guestSocket = io.sockets.sockets.get(guestSocketId);
        if (guestSocket) {
          guestSocket.join(`${meetingCode}-admitted`);
          guestSocket.emit('joined-admitted', {
            participantId: guestSocketId,
            isHost: false,
            admittedUsers: Array.from(room.admittedParticipants.values())
          });
        }

        // Broadcast to other admitted participants that guest joined
        io.to(`${meetingCode}-admitted`).emit('user-joined', {
          socketId: guestSocketId,
          userId: guest.userId,
          name: guest.name,
          role: guest.role,
          isHost: false
        });

        console.log(`[Meeting] Host admitted guest ${guest.name} (${guestSocketId}) to room ${meetingCode}`);
      } catch (err) {
        console.error('[Meeting] Error during admit-user:', err);
      }
    });

    // Host rejects a guest
    socket.on('reject-user', async ({ meetingCode, guestSocketId }) => {
      try {
        const room = activeRooms.get(meetingCode);
        if (!room) return;

        // Verify host
        const sender = room.admittedParticipants.get(socket.id);
        if (!sender || !sender.isHost) {
          socket.emit('meeting-error', 'Only hosts can reject participants.');
          return;
        }

        const guest = room.waitingParticipants.get(guestSocketId);
        if (!guest) return;

        // Remove from waiting
        room.waitingParticipants.delete(guestSocketId);

        // Notify all hosts of updated waiting list
        const hosts = Array.from(room.admittedParticipants.values()).filter(p => p.isHost);
        for (const host of hosts) {
          io.to(host.socketId).emit('waiting-list-update', Array.from(room.waitingParticipants.values()));
        }

        // Tell guest they were rejected
        io.to(guestSocketId).emit('user-rejected');
        
        console.log(`[Meeting] Host rejected guest ${guest.name} (${guestSocketId}) from room ${meetingCode}`);
      } catch (err) {
        console.error('[Meeting] Error during reject-user:', err);
      }
    });

    // WebRTC Signaling: Forward signals between peers
    socket.on('send-signal', ({ targetSocketId, signal }) => {
      io.to(targetSocketId).emit('signal-received', {
        senderSocketId: socket.id,
        signal
      });
    });

    // Media toggle sync (audio/video/screen state changes)
    socket.on('toggle-media', ({ meetingCode, audioEnabled, videoEnabled, isScreenSharing }) => {
      const room = activeRooms.get(meetingCode);
      if (!room) return;

      const participant = room.admittedParticipants.get(socket.id);
      if (participant) {
        socket.to(`${meetingCode}-admitted`).emit('user-media-toggled', {
          socketId: socket.id,
          audioEnabled,
          videoEnabled,
          isScreenSharing
        });
      }
    });

    // In-meeting Chat message
    socket.on('chat-message', ({ meetingCode, text, fileUrl }) => {
      const room = activeRooms.get(meetingCode);
      if (!room) return;

      const sender = room.admittedParticipants.get(socket.id);
      if (sender) {
        io.to(`${meetingCode}-admitted`).emit('chat-message-received', {
          id: `msg-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
          senderSocketId: socket.id,
          senderName: sender.name,
          text,
          fileUrl,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        });
      }
    });

    // Emoji reaction floating broadcast
    socket.on('emoji-reaction', ({ meetingCode, emoji }) => {
      const room = activeRooms.get(meetingCode);
      if (!room) return;

      const sender = room.admittedParticipants.get(socket.id);
      if (sender) {
        io.to(`${meetingCode}-admitted`).emit('emoji-reaction-received', {
          senderSocketId: socket.id,
          senderName: sender.name,
          emoji
        });
      }
    });

    // Raise / lower hand status
    socket.on('raise-hand', ({ meetingCode, isHandRaised }) => {
      const room = activeRooms.get(meetingCode);
      if (!room) return;

      const sender = room.admittedParticipants.get(socket.id);
      if (sender) {
        io.to(`${meetingCode}-admitted`).emit('user-hand-toggled', {
          socketId: socket.id,
          senderName: sender.name,
          isHandRaised
        });
      }
    });

    // Handle user disconnect
    socket.on('disconnect', () => {
      console.log(`[Meeting] Socket disconnected: ${socket.id}`);
      
      // Look up if user was in any active room
      for (const [meetingCode, room] of activeRooms.entries()) {
        if (room.admittedParticipants.has(socket.id)) {
          const participant = room.admittedParticipants.get(socket.id)!;
          room.admittedParticipants.delete(socket.id);
          
          // Notify other participants
          io.to(`${meetingCode}-admitted`).emit('user-left', {
            socketId: socket.id,
            name: participant.name
          });
          
          console.log(`[Meeting] Admitted user ${participant.name} (${socket.id}) left room ${meetingCode}`);

          // If room is empty now, delete it from memory
          if (room.admittedParticipants.size === 0 && room.waitingParticipants.size === 0) {
            activeRooms.delete(meetingCode);
            console.log(`[Meeting] Room ${meetingCode} is now empty and has been cleaned up.`);
          }
          break;
        } else if (room.waitingParticipants.has(socket.id)) {
          const participant = room.waitingParticipants.get(socket.id)!;
          room.waitingParticipants.delete(socket.id);
          
          // Notify host(s)
          const hosts = Array.from(room.admittedParticipants.values()).filter(p => p.isHost);
          for (const host of hosts) {
            io.to(host.socketId).emit('waiting-list-update', Array.from(room.waitingParticipants.values()));
          }
          
          console.log(`[Meeting] Waiting user ${participant.name} (${socket.id}) disconnected from room ${meetingCode}`);
          
          if (room.admittedParticipants.size === 0 && room.waitingParticipants.size === 0) {
            activeRooms.delete(meetingCode);
          }
          break;
        }
      }
    });
  });
}
