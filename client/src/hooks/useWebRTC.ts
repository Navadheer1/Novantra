"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { io, Socket } from "socket.io-client";

interface Participant {
  socketId: string;
  userId: string;
  name: string;
  role: string;
  isHost: boolean;
}

export interface RemoteStreamInfo {
  socketId: string;
  name: string;
  stream: MediaStream;
  audioEnabled: boolean;
  videoEnabled: boolean;
  isScreenSharing: boolean;
}

const ICE_SERVERS = {
  iceServers: [
    { urls: "stun:stun.l.google.com:19302" },
    { urls: "stun:stun1.l.google.com:19302" },
    { urls: "stun:stun2.l.google.com:19302" }
  ]
};

export function useWebRTC(meetingCode: string, userId: string, initialName: string, isHostUser: boolean) {
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [remoteStreams, setRemoteStreams] = useState<RemoteStreamInfo[]>([]);
  const [admittedUsers, setAdmittedUsers] = useState<Participant[]>([]);
  const [waitingUsers, setWaitingUsers] = useState<Participant[]>([]);
  const [joinStatus, setJoinStatus] = useState<"idle" | "waiting" | "rejected" | "full" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");
  
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [videoEnabled, setVideoEnabled] = useState(true);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [mySocketId, setMySocketId] = useState<string | null>(null);

  const socketRef = useRef<Socket | null>(null);
  const peersRef = useRef<Map<string, RTCPeerConnection>>(new Map()); // socketId -> RTCPeerConnection
  const localStreamRef = useRef<MediaStream | null>(null);
  const screenStreamRef = useRef<MediaStream | null>(null);

  // Audio/video tracks enabled states refs to keep socket callbacks up-to-date
  const audioEnabledRef = useRef(true);
  const videoEnabledRef = useRef(true);

  useEffect(() => {
    audioEnabledRef.current = audioEnabled;
  }, [audioEnabled]);

  useEffect(() => {
    videoEnabledRef.current = videoEnabled;
  }, [videoEnabled]);

  // Clean up all connections on unmount
  const cleanUp = useCallback(() => {
    console.log("[useWebRTC] Cleaning up all connections");
    
    if (socketRef.current) {
      socketRef.current.disconnect();
      socketRef.current = null;
    }

    peersRef.current.forEach((peer) => {
      peer.close();
    });
    peersRef.current.clear();

    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach((track) => track.stop());
      localStreamRef.current = null;
    }

    if (screenStreamRef.current) {
      screenStreamRef.current.getTracks().forEach((track) => track.stop());
      screenStreamRef.current = null;
    }

    setLocalStream(null);
    setRemoteStreams([]);
    setAdmittedUsers([]);
    setWaitingUsers([]);
  }, []);

  // Initialize peer connection for a remote socket
  const createPeerConnection = useCallback((peerSocketId: string, participantName: string, sendOffer: boolean) => {
    console.log(`[useWebRTC] Creating PeerConnection for ${participantName} (${peerSocketId}), sendOffer: ${sendOffer}`);
    
    const pc = new RTCPeerConnection(ICE_SERVERS);
    peersRef.current.set(peerSocketId, pc);

    // Add local tracks to peer connection
    const currentStream = screenStreamRef.current || localStreamRef.current;
    if (currentStream) {
      currentStream.getTracks().forEach((track) => {
        pc.addTrack(track, currentStream);
      });
    }

    // ICE Candidate handler
    pc.onicecandidate = (event) => {
      if (event.candidate && socketRef.current) {
        socketRef.current.emit("send-signal", {
          targetSocketId: peerSocketId,
          signal: { type: "candidate", candidate: event.candidate }
        });
      }
    };

    // Track handler - receive remote stream
    pc.ontrack = (event) => {
      console.log(`[useWebRTC] Received remote track from ${peerSocketId}`);
      const remoteStream = event.streams[0];
      
      setRemoteStreams((prev) => {
        const exists = prev.find((s) => s.socketId === peerSocketId);
        if (exists) {
          return prev.map((s) =>
            s.socketId === peerSocketId ? { ...s, stream: remoteStream } : s
          );
        }
        return [
          ...prev,
          {
            socketId: peerSocketId,
            name: participantName,
            stream: remoteStream,
            audioEnabled: true,
            videoEnabled: true,
            isScreenSharing: false
          }
        ];
      });
    };

    pc.onconnectionstatechange = () => {
      console.log(`[useWebRTC] Connection state change with ${peerSocketId}: ${pc.connectionState}`);
      if (pc.connectionState === "disconnected" || pc.connectionState === "failed" || pc.connectionState === "closed") {
        removePeer(peerSocketId);
      }
    };

    // If we are responsible for sending the offer
    if (sendOffer) {
      pc.onnegotiationneeded = async () => {
        try {
          console.log(`[useWebRTC] Negotiation needed with ${peerSocketId}, creating offer`);
          const offer = await pc.createOffer();
          await pc.setLocalDescription(offer);
          if (socketRef.current) {
            socketRef.current.emit("send-signal", {
              targetSocketId: peerSocketId,
              signal: { type: "offer", offer }
            });
          }
        } catch (err) {
          console.error("Error creating WebRTC offer:", err);
        }
      };
    }

    return pc;
  }, []);

  const removePeer = useCallback((peerSocketId: string) => {
    const pc = peersRef.current.get(peerSocketId);
    if (pc) {
      pc.close();
      peersRef.current.delete(peerSocketId);
    }
    setRemoteStreams((prev) => prev.filter((s) => s.socketId !== peerSocketId));
  }, []);

  // Host Admits a User
  const admitUser = useCallback((guestSocketId: string) => {
    if (socketRef.current && isHostUser) {
      socketRef.current.emit("admit-user", { meetingCode, guestSocketId });
    }
  }, [meetingCode, isHostUser]);

  // Host Rejects a User
  const rejectUser = useCallback((guestSocketId: string) => {
    if (socketRef.current && isHostUser) {
      socketRef.current.emit("reject-user", { meetingCode, guestSocketId });
    }
  }, [meetingCode, isHostUser]);

  // Join Meeting Socket Connection
  const joinMeeting = useCallback(async (audioOn: boolean, videoOn: boolean) => {
    try {
      setJoinStatus("waiting");
      setAudioEnabled(audioOn);
      setVideoEnabled(videoOn);
      
      // Get local camera stream
      const stream = await navigator.mediaDevices.getUserMedia({
        video: videoOn,
        audio: audioOn
      });
      
      localStreamRef.current = stream;
      setLocalStream(stream);

      // Connect socket
      const socketUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
      const socket = io(socketUrl);
      socketRef.current = socket;

      socket.on("connect", () => {
        console.log("[useWebRTC] Connected to signaling server, socket id:", socket.id);
        
        // Emit join meeting
        socket.emit("join-meeting", {
          meetingCode,
          userId,
          name: initialName,
          isHost: isHostUser
        });
      });

      // Waiting room event
      socket.on("waiting-room", () => {
        setJoinStatus("waiting");
      });

      // Admitted event
      socket.on("joined-admitted", ({ participantId, admittedUsers: users }) => {
        console.log("[useWebRTC] Successfully admitted to meeting.");
        setMySocketId(participantId);
        setAdmittedUsers(users);
        setJoinStatus("idle"); // idle means meeting active / lobby bypassed

        // Send initial media state to room
        socket.emit("toggle-media", {
          meetingCode,
          audioEnabled: audioOn,
          videoEnabled: videoOn,
          isScreenSharing: false
        });
      });

      // User full event
      socket.on("meeting-full", (msg) => {
        setJoinStatus("full");
        setErrorMessage(msg);
        cleanUp();
      });

      // User rejected event
      socket.on("user-rejected", () => {
        setJoinStatus("rejected");
        cleanUp();
      });

      // Meeting error event
      socket.on("meeting-error", (msg) => {
        setJoinStatus("error");
        setErrorMessage(msg);
        cleanUp();
      });

      // Host receives waiting list updates
      socket.on("waiting-list-update", (waitingList: Participant[]) => {
        setWaitingUsers(waitingList);
      });

      // Other user joined -> Initiate connection
      socket.on("user-joined", ({ socketId, name, role, isHost }) => {
        console.log(`[useWebRTC] New user joined room: ${name} (${socketId})`);
        
        // Update admitted list
        setAdmittedUsers((prev) => {
          if (prev.some(u => u.socketId === socketId)) return prev;
          return [...prev, { socketId, userId: "", name, role, isHost }];
        });

        // We make the offer to the new joiner
        createPeerConnection(socketId, name, true);
      });

      // WebRTC Signal received
      socket.on("signal-received", async ({ senderSocketId, signal }) => {
        let pc = peersRef.current.get(senderSocketId);

        // Find sender details
        const senderInfo = admittedUsers.find(u => u.socketId === senderSocketId);
        const senderName = senderInfo ? senderInfo.name : "Participant";

        if (!pc) {
          // If we don't have a peer connection yet, create one (and we are NOT the offerer here)
          pc = createPeerConnection(senderSocketId, senderName, false);
        }

        try {
          if (signal.type === "offer") {
            console.log(`[useWebRTC] Handling offer from ${senderSocketId}`);
            await pc.setRemoteDescription(new RTCSessionDescription(signal.offer));
            const answer = await pc.createAnswer();
            await pc.setLocalDescription(answer);
            socket.emit("send-signal", {
              targetSocketId: senderSocketId,
              signal: { type: "answer", answer }
            });
          } else if (signal.type === "answer") {
            console.log(`[useWebRTC] Handling answer from ${senderSocketId}`);
            await pc.setRemoteDescription(new RTCSessionDescription(signal.answer));
          } else if (signal.type === "candidate") {
            console.log(`[useWebRTC] Adding ICE candidate from ${senderSocketId}`);
            await pc.addIceCandidate(new RTCIceCandidate(signal.candidate));
          }
        } catch (err) {
          console.error("Error handling WebRTC signal:", err);
        }
      });

      // Remote User toggled media status
      socket.on("user-media-toggled", ({ socketId, audioEnabled, videoEnabled, isScreenSharing }) => {
        setRemoteStreams((prev) =>
          prev.map((s) =>
            s.socketId === socketId
              ? { ...s, audioEnabled, videoEnabled, isScreenSharing }
              : s
          )
        );
      });

      // Remote User left
      socket.on("user-left", ({ socketId, name }) => {
        console.log(`[useWebRTC] User left: ${name} (${socketId})`);
        removePeer(socketId);
        setAdmittedUsers((prev) => prev.filter((u) => u.socketId !== socketId));
      });

    } catch (err: any) {
      console.error("[useWebRTC] Error joining meeting:", err);
      setJoinStatus("error");
      setErrorMessage(err?.message || "Failed to access microphone or camera.");
    }
  }, [meetingCode, userId, initialName, isHostUser, createPeerConnection, removePeer, cleanUp, admittedUsers]);

  // Toggle local microphone track
  const toggleAudio = useCallback(() => {
    const nextState = !audioEnabled;
    setAudioEnabled(nextState);
    if (localStreamRef.current) {
      const audioTrack = localStreamRef.current.getAudioTracks()[0];
      if (audioTrack) audioTrack.enabled = nextState;
    }
    if (socketRef.current) {
      socketRef.current.emit("toggle-media", {
        meetingCode,
        audioEnabled: nextState,
        videoEnabled: videoEnabledRef.current,
        isScreenSharing
      });
    }
  }, [audioEnabled, meetingCode, isScreenSharing]);

  // Toggle local camera track
  const toggleVideo = useCallback(() => {
    const nextState = !videoEnabled;
    setVideoEnabled(nextState);
    if (localStreamRef.current) {
      const videoTrack = localStreamRef.current.getVideoTracks()[0];
      if (videoTrack) videoTrack.enabled = nextState;
    }
    if (socketRef.current) {
      socketRef.current.emit("toggle-media", {
        meetingCode,
        audioEnabled: audioEnabledRef.current,
        videoEnabled: nextState,
        isScreenSharing
      });
    }
  }, [videoEnabled, meetingCode, isScreenSharing]);

  // Toggle local screen sharing track
  const toggleScreenShare = useCallback(async () => {
    if (isScreenSharing) {
      // Stop screen sharing
      if (screenStreamRef.current) {
        screenStreamRef.current.getTracks().forEach((track) => track.stop());
        screenStreamRef.current = null;
      }
      
      // Swap track back to camera on all peer connections
      const cameraVideoTrack = localStreamRef.current?.getVideoTracks()[0];
      if (cameraVideoTrack) {
        cameraVideoTrack.enabled = videoEnabled;
        peersRef.current.forEach((pc) => {
          const sender = pc.getSenders().find((s) => s.track?.kind === "video");
          if (sender) {
            sender.replaceTrack(cameraVideoTrack);
          }
        });
      }
      
      setIsScreenSharing(false);
      if (socketRef.current) {
        socketRef.current.emit("toggle-media", {
          meetingCode,
          audioEnabled: audioEnabledRef.current,
          videoEnabled: videoEnabledRef.current,
          isScreenSharing: false
        });
      }
    } else {
      // Start screen sharing
      try {
        const screenStream = await navigator.mediaDevices.getDisplayMedia({
          video: true
        });
        screenStreamRef.current = screenStream;

        const screenVideoTrack = screenStream.getVideoTracks()[0];
        
        // Swap track to screen on all peer connections
        peersRef.current.forEach((pc) => {
          const sender = pc.getSenders().find((s) => s.track?.kind === "video");
          if (sender) {
            sender.replaceTrack(screenVideoTrack);
          }
        });

        // Handle when screen sharing is ended via browser bar
        screenVideoTrack.onended = () => {
          toggleScreenShare(); // turn off screen sharing
        };

        setIsScreenSharing(true);
        if (socketRef.current) {
          socketRef.current.emit("toggle-media", {
            meetingCode,
            audioEnabled: audioEnabledRef.current,
            videoEnabled: videoEnabledRef.current,
            isScreenSharing: true
          });
        }
      } catch (err) {
        console.error("Error sharing screen:", err);
      }
    }
  }, [isScreenSharing, videoEnabled, meetingCode]);

  // Leave meeting manually
  const leaveMeeting = useCallback(() => {
    cleanUp();
    window.location.href = "/dashboard";
  }, [cleanUp]);

  useEffect(() => {
    return () => {
      cleanUp();
    };
  }, [cleanUp]);

  return {
    localStream,
    remoteStreams,
    admittedUsers,
    waitingUsers,
    joinStatus,
    errorMessage,
    audioEnabled,
    videoEnabled,
    isScreenSharing,
    mySocketId,
    toggleAudio,
    toggleVideo,
    toggleScreenShare,
    admitUser,
    rejectUser,
    leaveMeeting,
    joinMeeting
  };
}
