import { Server, Socket } from 'socket.io';

// Map of userId -> Set of socketIds
const userSockets = new Map<string, Set<string>>();
// Map of socketId -> userId
const socketUser = new Map<string, string>();
// Map of userId -> status (ONLINE, AWAY, DND, IDLE)
const userPresence = new Map<string, string>();
// Map of userId -> lastActive timestamp
const userLastSeen = new Map<string, number>();

export function registerMessageHandlers(io: Server) {
  io.on('connection', (socket: Socket) => {
    
    // User registers their chat presence
    socket.on('join-chat', ({ userId }) => {
      if (!userId) return;
      
      console.log(`[Socket] User ${userId} joined chat from socket ${socket.id}`);
      
      // Register socket
      if (!userSockets.has(userId)) {
        userSockets.set(userId, new Set());
      }
      userSockets.get(userId)!.add(socket.id);
      socketUser.set(socket.id, userId);
      
      // Default presence to ONLINE
      userPresence.set(userId, 'ONLINE');
      userLastSeen.set(userId, Date.now());

      // Broadcast presence change
      io.emit('presence-update', {
        userId,
        status: 'ONLINE',
        lastSeen: Date.now()
      });

      // Send the current list of online users to the joining socket
      const onlineUsersList = Array.from(userPresence.entries()).map(([id, status]) => ({
        userId: id,
        status,
        lastSeen: userLastSeen.get(id) || Date.now()
      }));
      socket.emit('online-users-list', onlineUsersList);
    });

    // Handle presence state updates (AWAY, DND, IDLE, ONLINE)
    socket.on('presence-status-change', ({ userId, status }) => {
      if (!userId || !status) return;
      userPresence.set(userId, status);
      userLastSeen.set(userId, Date.now());
      
      io.emit('presence-update', {
        userId,
        status,
        lastSeen: Date.now()
      });
    });

    // Handle typing events
    socket.on('typing-start', ({ senderId, receiverId }) => {
      console.log(`[Socket] ${senderId} started typing to ${receiverId}`);
      const receiverSockets = userSockets.get(receiverId);
      if (receiverSockets) {
        receiverSockets.forEach(socketId => {
          io.to(socketId).emit('typing-start', { senderId });
        });
      }
    });

    socket.on('typing-stop', ({ senderId, receiverId }) => {
      console.log(`[Socket] ${senderId} stopped typing to ${receiverId}`);
      const receiverSockets = userSockets.get(receiverId);
      if (receiverSockets) {
        receiverSockets.forEach(socketId => {
          io.to(socketId).emit('typing-stop', { senderId });
        });
      }
    });

    // Handle voice recording status
    socket.on('recording-start', ({ senderId, receiverId }) => {
      const receiverSockets = userSockets.get(receiverId);
      if (receiverSockets) {
        receiverSockets.forEach(socketId => {
          io.to(socketId).emit('recording-start', { senderId });
        });
      }
    });

    socket.on('recording-stop', ({ senderId, receiverId }) => {
      const receiverSockets = userSockets.get(receiverId);
      if (receiverSockets) {
        receiverSockets.forEach(socketId => {
          io.to(socketId).emit('recording-stop', { senderId });
        });
      }
    });

    // Handle file uploading status
    socket.on('uploading-start', ({ senderId, receiverId }) => {
      const receiverSockets = userSockets.get(receiverId);
      if (receiverSockets) {
        receiverSockets.forEach(socketId => {
          io.to(socketId).emit('uploading-start', { senderId });
        });
      }
    });

    socket.on('uploading-stop', ({ senderId, receiverId }) => {
      const receiverSockets = userSockets.get(receiverId);
      if (receiverSockets) {
        receiverSockets.forEach(socketId => {
          io.to(socketId).emit('uploading-stop', { senderId });
        });
      }
    });

    // Broadcast messages to the receiver sockets in real-time
    socket.on('message-sent', (message) => {
      const { senderId, receiverId } = message;
      console.log(`[Socket] New message sent from ${senderId} to ${receiverId}`);
      
      // Deliver to receiver
      const receiverSockets = userSockets.get(receiverId);
      if (receiverSockets) {
        receiverSockets.forEach(socketId => {
          io.to(socketId).emit('message-received', message);
        });
      }
      
      // Sync other tabs of the sender
      const senderSockets = userSockets.get(senderId);
      if (senderSockets) {
        senderSockets.forEach(socketId => {
          if (socketId !== socket.id) {
            io.to(socketId).emit('message-received', message);
          }
        });
      }
    });

    // Handle reactions
    socket.on('reaction-toggle', ({ senderId, receiverId, messageId, emoji, isAdded }) => {
      console.log(`[Socket] Reaction ${isAdded ? 'added' : 'removed'} by ${senderId} on message ${messageId}: ${emoji}`);
      const receiverSockets = userSockets.get(receiverId);
      if (receiverSockets) {
        receiverSockets.forEach(socketId => {
          io.to(socketId).emit('reaction-update', { messageId, senderId, emoji, isAdded });
        });
      }
    });

    // Read receipts
    socket.on('message-seen', ({ senderId, receiverId, messageId }) => {
      const receiverSockets = userSockets.get(receiverId);
      if (receiverSockets) {
        receiverSockets.forEach(socketId => {
          io.to(socketId).emit('message-seen', { messageId, senderId });
        });
      }
    });

    // Disconnect
    socket.on('disconnect', () => {
      const userId = socketUser.get(socket.id);
      if (userId) {
        const sockets = userSockets.get(userId);
        if (sockets) {
          sockets.delete(socket.id);
          if (sockets.size === 0) {
            userSockets.delete(userId);
            userPresence.delete(userId);
            userLastSeen.set(userId, Date.now());
            
            // Broadcast offline state
            io.emit('presence-update', {
              userId,
              status: 'OFFLINE',
              lastSeen: Date.now()
            });
            console.log(`[Socket] User ${userId} is now offline.`);
          }
        }
        socketUser.delete(socket.id);
      }
      console.log(`User disconnected: ${socket.id}`);
    });
  });
}
