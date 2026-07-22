"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { io, Socket } from "socket.io-client";

export interface ParticipantMediaState {
  socketId: string;
  userId: string;
  name: string;
  role: string;
  isHost: boolean;
  audioEnabled: boolean;
  videoEnabled: boolean;
  isScreenSharing: boolean;
  isHandRaised: boolean;
  isSpeaking: boolean;
  stream?: MediaStream | null;
}

export interface ChatMessage {
  id: string;
  senderSocketId: string;
  senderName: string;
  text: string;
  fileUrl?: string;
  timestamp: string;
}

export interface FloatingReaction {
  id: string;
  senderName: string;
  emoji: string;
}

const STUN_SERVERS = {
  iceServers: [
    { urls: "stun:stun.l.google.com:19302" },
    { urls: "stun:stun1.l.google.com:19302" },
  ],
};

export function useNoventraMeet(meetingCode: string, user: { id: string; name: string; role?: string } | null) {
  const socketRef = useRef<Socket | null>(null);
  const peersRef = useRef<Map<string, RTCPeerConnection>>(new Map());
  const localStreamRef = useRef<MediaStream | null>(null);
  const screenStreamRef = useRef<MediaStream | null>(null);

  // Connection & Room state
  const [inWaitingRoom, setInWaitingRoom] = useState(false);
  const [isAdmitted, setIsAdmitted] = useState(false);
  const [isHost, setIsHost] = useState(false);
  const [waitingUsers, setWaitingUsers] = useState<any[]>([]);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Media Controls State
  const [micEnabled, setMicEnabled] = useState(true);
  const [cameraEnabled, setCameraEnabled] = useState(true);
  const [screenSharing, setScreenSharing] = useState(false);
  const [backgroundBlur, setBackgroundBlur] = useState(false);
  const [handRaised, setHandRaised] = useState(false);
  const [pinnedSocketId, setPinnedSocketId] = useState<string | null>(null);

  // Active Streams & Participants
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [participants, setParticipants] = useState<ParticipantMediaState[]>([]);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [reactions, setReactions] = useState<FloatingReaction[]>([]);
  const [unreadChatCount, setUnreadChatCount] = useState(0);

  const getApiUrl = () => (process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000").replace(/\/$/, "");

  // Initialize Local Media Stream
  const initLocalStream = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: { ideal: 1280 }, height: { ideal: 720 } },
        audio: { echoCancellation: true, noiseSuppression: true },
      });
      localStreamRef.current = stream;
      setLocalStream(stream);
      return stream;
    } catch (err) {
      console.warn("Media permission denied or camera unavailable:", err);
      return null;
    }
  };

  // Connect to Socket signaling server
  useEffect(() => {
    if (!meetingCode || !user) return;

    const apiUrl = getApiUrl();
    const socket = io(apiUrl, {
      transports: ["websocket", "polling"],
      withCredentials: true,
    });
    socketRef.current = socket;

    socket.on("connect", async () => {
      console.log("[Meet] Socket connected:", socket.id);
      const stream = localStreamRef.current || (await initLocalStream());
      
      socket.emit("join-meeting", {
        meetingCode,
        userId: user.id,
        name: user.name,
        isHost: false,
      });
    });

    socket.on("joined-admitted", async ({ isHost, admittedUsers }) => {
      setIsAdmitted(true);
      setInWaitingRoom(false);
      setIsHost(isHost);

      const parsed: ParticipantMediaState[] = admittedUsers
        .filter((u: any) => u.socketId !== socket.id && u.userId !== user?.id)
        .map((u: any) => ({
          socketId: u.socketId,
          userId: u.userId,
          name: u.name,
          role: u.role,
          isHost: u.isHost,
          audioEnabled: true,
          videoEnabled: true,
          isScreenSharing: false,
          isHandRaised: false,
          isSpeaking: false,
        }));
      setParticipants(parsed);

      // Create WebRTC offer for existing peers
      for (const u of admittedUsers) {
        if (u.socketId !== socket.id && u.userId !== user?.id) {
          createPeerOffer(u.socketId, socket);
        }
      }
    });

    socket.on("waiting-room", () => {
      setInWaitingRoom(true);
      setIsAdmitted(false);
    });

    socket.on("waiting-list-update", (waitingList: any[]) => {
      setWaitingUsers(waitingList);
    });

    socket.on("user-joined", ({ socketId, userId, name, role, isHost: hostFlag }) => {
      if (socketId === socket.id || userId === user?.id) return;
      setParticipants((prev) => {
        if (prev.some((p) => p.socketId === socketId || p.userId === userId)) return prev;
        return [
          ...prev,
          {
            socketId,
            userId,
            name,
            role,
            isHost: hostFlag,
            audioEnabled: true,
            videoEnabled: true,
            isScreenSharing: false,
            isHandRaised: false,
            isSpeaking: false,
          },
        ];
      });
    });

    socket.on("signal-received", async ({ senderSocketId, signal }) => {
      handleSignalReceived(senderSocketId, signal, socket);
    });

    socket.on("user-media-toggled", ({ socketId, audioEnabled, videoEnabled, isScreenSharing }) => {
      setParticipants((prev) =>
        prev.map((p) =>
          p.socketId === socketId ? { ...p, audioEnabled, videoEnabled, isScreenSharing } : p
        )
      );
    });

    socket.on("chat-message-received", (msg: ChatMessage) => {
      setChatMessages((prev) => [...prev, msg]);
      setUnreadChatCount((count) => count + 1);
    });

    socket.on("emoji-reaction-received", ({ senderName, emoji }) => {
      const rx: FloatingReaction = { id: `rx-${Date.now()}-${Math.random()}`, senderName, emoji };
      setReactions((prev) => [...prev, rx]);
      setTimeout(() => {
        setReactions((prev) => prev.filter((r) => r.id !== rx.id));
      }, 4000);
    });

    socket.on("user-hand-toggled", ({ socketId, isHandRaised }) => {
      setParticipants((prev) =>
        prev.map((p) => (p.socketId === socketId ? { ...p, isHandRaised } : p))
      );
    });

    socket.on("user-left", ({ socketId }) => {
      setParticipants((prev) => prev.filter((p) => p.socketId !== socketId));
      if (peersRef.current.has(socketId)) {
        peersRef.current.get(socketId)?.close();
        peersRef.current.delete(socketId);
      }
    });

    socket.on("user-rejected", () => {
      setErrorMsg("The host declined your request to join the meeting.");
      setInWaitingRoom(false);
    });

    socket.on("meeting-error", (err: string) => {
      setErrorMsg(err);
    });

    return () => {
      socket.disconnect();
      peersRef.current.forEach((pc) => pc.close());
      peersRef.current.clear();
    };
  }, [meetingCode, user?.id]);

  // Create Peer Connection & Offer
  const createPeerOffer = async (targetSocketId: string, socket: Socket) => {
    const pc = new RTCPeerConnection(STUN_SERVERS);
    peersRef.current.set(targetSocketId, pc);

    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach((track) => {
        pc.addTrack(track, localStreamRef.current!);
      });
    }

    pc.onicecandidate = (event) => {
      if (event.candidate) {
        socket.emit("send-signal", {
          targetSocketId,
          signal: { candidate: event.candidate },
        });
      }
    };

    pc.ontrack = (event) => {
      const stream = event.streams[0];
      setParticipants((prev) =>
        prev.map((p) => (p.socketId === targetSocketId ? { ...p, stream } : p))
      );
    };

    const offer = await pc.createOffer();
    await pc.setLocalDescription(offer);

    socket.emit("send-signal", {
      targetSocketId,
      signal: { sdp: pc.localDescription },
    });
  };

  // Handle Received Signals (Offer, Answer, ICE)
  const handleSignalReceived = async (senderSocketId: string, signal: any, socket: Socket) => {
    let pc = peersRef.current.get(senderSocketId);

    if (!pc) {
      pc = new RTCPeerConnection(STUN_SERVERS);
      peersRef.current.set(senderSocketId, pc);

      if (localStreamRef.current) {
        localStreamRef.current.getTracks().forEach((track) => {
          pc!.addTrack(track, localStreamRef.current!);
        });
      }

      pc.onicecandidate = (event) => {
        if (event.candidate) {
          socket.emit("send-signal", {
            targetSocketId: senderSocketId,
            signal: { candidate: event.candidate },
          });
        }
      };

      pc.ontrack = (event) => {
        const stream = event.streams[0];
        setParticipants((prev) =>
          prev.map((p) => (p.socketId === senderSocketId ? { ...p, stream } : p))
        );
      };
    }

    if (signal.sdp) {
      await pc.setRemoteDescription(new RTCSessionDescription(signal.sdp));
      if (signal.sdp.type === "offer") {
        const answer = await pc.createAnswer();
        await pc.setLocalDescription(answer);
        socket.emit("send-signal", {
          targetSocketId: senderSocketId,
          signal: { sdp: pc.localDescription },
        });
      }
    } else if (signal.candidate) {
      await pc.addIceCandidate(new RTCIceCandidate(signal.candidate));
    }
  };

  // Media Controls Actions
  const toggleMic = () => {
    if (localStreamRef.current) {
      const audioTracks = localStreamRef.current.getAudioTracks();
      audioTracks.forEach((t) => (t.enabled = !micEnabled));
    }
    const next = !micEnabled;
    setMicEnabled(next);
    socketRef.current?.emit("toggle-media", {
      meetingCode,
      audioEnabled: next,
      videoEnabled: cameraEnabled,
      isScreenSharing: screenSharing,
    });
  };

  const toggleCamera = () => {
    if (localStreamRef.current) {
      const videoTracks = localStreamRef.current.getVideoTracks();
      videoTracks.forEach((t) => (t.enabled = !cameraEnabled));
    }
    const next = !cameraEnabled;
    setCameraEnabled(next);
    socketRef.current?.emit("toggle-media", {
      meetingCode,
      audioEnabled: micEnabled,
      videoEnabled: next,
      isScreenSharing: screenSharing,
    });
  };

  const toggleScreenShare = async () => {
    if (screenSharing) {
      if (screenStreamRef.current) {
        screenStreamRef.current.getTracks().forEach((t) => t.stop());
        screenStreamRef.current = null;
      }
      setScreenSharing(false);
      socketRef.current?.emit("toggle-media", {
        meetingCode,
        audioEnabled: micEnabled,
        videoEnabled: cameraEnabled,
        isScreenSharing: false,
      });
    } else {
      try {
        const screenStream = await navigator.mediaDevices.getDisplayMedia({ video: true });
        screenStreamRef.current = screenStream;
        setScreenSharing(true);

        socketRef.current?.emit("toggle-media", {
          meetingCode,
          audioEnabled: micEnabled,
          videoEnabled: cameraEnabled,
          isScreenSharing: true,
        });

        screenStream.getVideoTracks()[0].onended = () => {
          setScreenSharing(false);
          socketRef.current?.emit("toggle-media", {
            meetingCode,
            audioEnabled: micEnabled,
            videoEnabled: cameraEnabled,
            isScreenSharing: false,
          });
        };
      } catch (err) {
        console.warn("Screen share cancelled:", err);
      }
    }
  };

  const toggleRaiseHand = () => {
    const next = !handRaised;
    setHandRaised(next);
    socketRef.current?.emit("raise-hand", { meetingCode, isHandRaised: next });
  };

  const sendEmojiReaction = (emoji: string) => {
    socketRef.current?.emit("emoji-reaction", { meetingCode, emoji });
  };

  const sendChatMessage = (text: string, fileUrl?: string) => {
    socketRef.current?.emit("chat-message", { meetingCode, text, fileUrl });
  };

  const admitUser = (guestSocketId: string) => {
    socketRef.current?.emit("admit-user", { meetingCode, guestSocketId });
  };

  const rejectUser = (guestSocketId: string) => {
    socketRef.current?.emit("reject-user", { meetingCode, guestSocketId });
  };

  return {
    inWaitingRoom,
    isAdmitted,
    isHost,
    waitingUsers,
    errorMsg,
    micEnabled,
    cameraEnabled,
    screenSharing,
    backgroundBlur,
    handRaised,
    pinnedSocketId,
    localStream,
    participants,
    chatMessages,
    reactions,
    unreadChatCount,
    setUnreadChatCount,
    setBackgroundBlur,
    setPinnedSocketId,
    initLocalStream,
    toggleMic,
    toggleCamera,
    toggleScreenShare,
    toggleRaiseHand,
    sendEmojiReaction,
    sendChatMessage,
    admitUser,
    rejectUser,
  };
}
