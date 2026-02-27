'use client';

import React, { useEffect, useRef } from 'react';
import videojs from 'video.js';
import 'video.js/dist/video-js.css';

interface VideoPlayerProps {
  options: any;
  onReady?: (player: any) => void;
}

export const VideoPlayer = ({ options, onReady }: VideoPlayerProps) => {
  const videoRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<any>(null);

  useEffect(() => {
    if (typeof window === 'undefined' || !videoRef.current) return;

    if (!playerRef.current) {
      const videoElement = document.createElement('video-js');
      videoElement.classList.add('vjs-big-play-centered');
      
      // Đảm bảo video và ảnh poster bên trong luôn ở chế độ contain (hiện khoảng đen)
      videoElement.style.width = '100%';
      videoElement.style.height = '100%';
      
      videoRef.current.appendChild(videoElement);

      const player = (playerRef.current = videojs(videoElement, {
        ...options,
        fill: true,
        fluid: false,
      }, () => {
        onReady && onReady(player);
      }));
    } else {
      const player = playerRef.current;
      player.autoplay(options.autoplay);
      player.src(options.sources);
      if (options.poster) player.poster(options.poster);
    }
  }, [options, videoRef]);

  useEffect(() => {
    return () => {
      const player = playerRef.current;
      if (player && !player.isDisposed()) {
        player.dispose();
        playerRef.current = null;
      }
    };
  }, []);

  return (
    <div data-vjs-player className="w-full h-full bg-black flex items-center justify-center">
      {/* Thêm style để ép ảnh poster hiển thị ở chế độ contain */}
      <style jsx global>{`
        .vjs-poster {
          background-size: contain !important;
          background-color: black !important;
        }
        .video-js video {
          object-fit: contain !important;
        }
      `}</style>
      <div ref={videoRef} className="w-full h-full" />
    </div>
  );
};

export default VideoPlayer;
