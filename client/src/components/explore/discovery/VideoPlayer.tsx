"use client";

import React, { useRef, useState, useEffect } from "react";
import { Play, Pause, Volume2, VolumeX, Maximize, Minimize, Settings, Subtitles, Laptop, RefreshCw } from "lucide-react";

interface VideoPlayerProps {
  src: string;
  thumbnailUrl: string;
  autoplay?: boolean;
  onEnded?: () => void;
  transcript?: string; // Optional transcript to sync mock subtitles
}

export default function VideoPlayer({ src, thumbnailUrl, autoplay = false, onEnded, transcript }: VideoPlayerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const [isPlaying, setIsPlaying] = useState(autoplay);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.8);
  const [isMuted, setIsMuted] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [showSpeedMenu, setShowSpeedMenu] = useState(false);
  const [showSubtitles, setShowSubtitles] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [currentSubtitle, setCurrentSubtitle] = useState("");

  // Subtitle synchronization logic
  useEffect(() => {
    if (!showSubtitles || !transcript) {
      setCurrentSubtitle("");
      return;
    }

    // Simplistic subtitle parser for our transcript format (e.g. [0:00] Text. [2:30] Next text.)
    const parsedSubtitles: { time: number; text: string }[] = [];
    const regex = /\[(\d+):(\d+)\]\s*([^\[]+)/g;
    let match;
    while ((match = regex.exec(transcript)) !== null) {
      const minutes = parseInt(match[1]);
      const seconds = parseInt(match[2]);
      const totalSeconds = minutes * 60 + seconds;
      parsedSubtitles.push({ time: totalSeconds, text: match[3].trim() });
    }

    // Find the active subtitle
    const active = parsedSubtitles
      .filter((sub) => currentTime >= sub.time)
      .pop();

    if (active) {
      setCurrentSubtitle(active.text);
    } else {
      setCurrentSubtitle("");
    }
  }, [currentTime, showSubtitles, transcript]);

  // Autoplay handler
  useEffect(() => {
    if (autoplay && videoRef.current) {
      videoRef.current.play().catch(() => {
        // Autoplay blocked by browser
        setIsPlaying(false);
      });
    }
  }, [autoplay, src]);

  // Keyboard shortcut listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore key events when the user is typing in forms/comment boxes
      if (
        document.activeElement?.tagName === "INPUT" ||
        document.activeElement?.tagName === "TEXTAREA" ||
        document.activeElement?.getAttribute("contenteditable") === "true"
      ) {
        return;
      }

      switch (e.key.toLowerCase()) {
        case " ":
          e.preventDefault();
          togglePlay();
          break;
        case "f":
          e.preventDefault();
          toggleFullscreen();
          break;
        case "m":
          e.preventDefault();
          toggleMute();
          break;
        case "arrowright":
          e.preventDefault();
          seekForward();
          break;
        case "arrowleft":
          e.preventDefault();
          seekBackward();
          break;
        default:
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isPlaying, isMuted]);

  // Sync fullscreen state when exiting fullscreen via Escape key
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, []);

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play().catch((err) => console.log(err));
      setIsPlaying(true);
    }
  };

  const handleTimeUpdate = () => {
    if (!videoRef.current) return;
    setCurrentTime(videoRef.current.currentTime);
  };

  const handleLoadedMetadata = () => {
    if (!videoRef.current) return;
    setDuration(videoRef.current.duration);
  };

  const handleVideoEnded = () => {
    setIsPlaying(false);
    if (onEnded) onEnded();
  };

  const handleTimelineChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!videoRef.current) return;
    const newTime = parseFloat(e.target.value);
    videoRef.current.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!videoRef.current) return;
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    videoRef.current.volume = newVolume;
    setIsMuted(newVolume === 0);
    videoRef.current.muted = newVolume === 0;
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    const nextMute = !isMuted;
    setIsMuted(nextMute);
    videoRef.current.muted = nextMute;
    if (!nextMute && volume === 0) {
      setVolume(0.5);
      videoRef.current.volume = 0.5;
    }
  };

  const changeSpeed = (rate: number) => {
    if (!videoRef.current) return;
    videoRef.current.playbackRate = rate;
    setPlaybackRate(rate);
    setShowSpeedMenu(false);
  };

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!isFullscreen) {
      if (containerRef.current.requestFullscreen) {
        containerRef.current.requestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  };

  const triggerPictureInPicture = async () => {
    if (!videoRef.current) return;
    try {
      if (document.pictureInPictureElement) {
        await document.exitPictureInPicture();
      } else {
        await videoRef.current.requestPictureInPicture();
      }
    } catch (error) {
      console.error("Picture in Picture error", error);
    }
  };

  const seekForward = () => {
    if (!videoRef.current) return;
    videoRef.current.currentTime = Math.min(videoRef.current.currentTime + 10, duration);
  };

  const seekBackward = () => {
    if (!videoRef.current) return;
    videoRef.current.currentTime = Math.max(videoRef.current.currentTime - 10, 0);
  };

  const formatTime = (time: number) => {
    if (isNaN(time)) return "00:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    const pad = (val: number) => (val < 10 ? `0${val}` : val);
    return `${pad(minutes)}:${pad(seconds)}`;
  };

  return (
    <div
      ref={containerRef}
      className={`relative group bg-black select-none overflow-hidden rounded-2xl border border-neutral-800 transition-all duration-300 w-full aspect-video ${
        isFullscreen ? "h-screen w-screen border-none rounded-none" : ""
      }`}
    >
      <video
        ref={videoRef}
        src={src}
        poster={thumbnailUrl}
        onClick={togglePlay}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={handleVideoEnded}
        className="w-full h-full object-contain cursor-pointer"
        playsInline
      />

      {/* Subtitles Overlay */}
      {showSubtitles && currentSubtitle && (
        <div className="absolute bottom-16 left-1/2 -translate-x-1/2 bg-black/85 text-white px-4 py-2 rounded text-base sm:text-lg font-medium text-center max-w-[80%] pointer-events-none transition-all duration-150 z-20">
          {currentSubtitle}
        </div>
      )}

      {/* Controls Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/0 to-black/35 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4 z-10">
        
        {/* Timeline Progress Scrubbing */}
        <div className="flex items-center space-x-2 w-full mb-3">
          <span className="text-xs text-neutral-300 font-semibold">{formatTime(currentTime)}</span>
          <input
            type="range"
            min={0}
            max={duration || 100}
            step={0.1}
            value={currentTime}
            onChange={handleTimelineChange}
            className="flex-1 accent-white bg-white/20 h-1 rounded-lg appearance-none cursor-pointer focus:outline-none transition-all duration-150 hover:h-1.5"
          />
          <span className="text-xs text-neutral-300 font-semibold">{formatTime(duration)}</span>
        </div>

        {/* Buttons Control Panel */}
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center space-x-4">
            
            {/* Play/Pause */}
            <button onClick={togglePlay} className="text-white hover:text-neutral-300 transition focus:outline-none">
              {isPlaying ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current" />}
            </button>

            {/* Volume Panel */}
            <div className="flex items-center space-x-2 group/volume">
              <button onClick={toggleMute} className="text-white hover:text-neutral-300 transition focus:outline-none">
                {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
              </button>
              <input
                type="range"
                min={0}
                max={1}
                step={0.05}
                value={isMuted ? 0 : volume}
                onChange={handleVolumeChange}
                className="w-0 group-hover/volume:w-16 h-1 bg-white/20 accent-white rounded appearance-none cursor-pointer focus:outline-none transition-all duration-300"
              />
            </div>
          </div>

          <div className="flex items-center space-x-4">
            
            {/* Subtitles Button */}
            {transcript && (
              <button
                onClick={() => setShowSubtitles(!showSubtitles)}
                className={`transition focus:outline-none ${
                  showSubtitles ? "text-primary hover:text-primary-foreground" : "text-white hover:text-neutral-300"
                }`}
                title="Toggle Subtitles"
              >
                <Subtitles className="w-5 h-5" />
              </button>
            )}

            {/* Playback Speed Menu */}
            <div className="relative">
              <button
                onClick={() => setShowSpeedMenu(!showSpeedMenu)}
                className="text-white hover:text-neutral-300 transition text-xs font-semibold px-2 py-1 border border-white/20 rounded hover:bg-white/10 focus:outline-none"
              >
                {playbackRate}x
              </button>

              {showSpeedMenu && (
                <div className="absolute bottom-full right-0 mb-2 bg-neutral-900 border border-neutral-800 rounded-lg py-1 w-20 shadow-2xl z-30">
                  {[0.5, 1, 1.25, 1.5, 2].map((rate) => (
                    <button
                      key={rate}
                      onClick={() => changeSpeed(rate)}
                      className={`block w-full text-left px-3 py-1.5 text-xs text-white hover:bg-neutral-800 transition ${
                        playbackRate === rate ? "text-primary font-bold" : ""
                      }`}
                    >
                      {rate}x
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Picture in Picture */}
            <button onClick={triggerPictureInPicture} className="text-white hover:text-neutral-300 transition focus:outline-none" title="Picture in Picture">
              <Laptop className="w-5 h-5" />
            </button>

            {/* Fullscreen toggle */}
            <button onClick={toggleFullscreen} className="text-white hover:text-neutral-300 transition focus:outline-none">
              {isFullscreen ? <Minimize className="w-5 h-5" /> : <Maximize className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
