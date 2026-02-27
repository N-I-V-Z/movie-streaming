'use client';

import React, { useEffect, useRef } from 'react';
import videojs from 'video.js';
import 'video.js/dist/video-js.css';

interface VideoPlayerProps {
  options: any;
  onReady?: (player: any) => void;
}

export const VideoPlayer = (props: VideoPlayerProps) => {
  const videoRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<any>(null);
  const { options, onReady } = props;

  useEffect(() => {
    // Chỉ khởi tạo khi videoRef tồn tại
    if (!playerRef.current) {
      const videoElement = document.createElement('video-js');
      videoElement.classList.add('vjs-big-play-centered');
      videoRef.current?.appendChild(videoElement);

      const player = (playerRef.current = videojs(videoElement, options, () => {
        onReady && onReady(player);
      }));
    } else {
      const player = playerRef.current;
      player.autoplay(options.autoplay);
      player.src(options.sources);
    }
  }, [options, videoRef, onReady]);

  // Hủy player khi component unmount
  useEffect(() => {
    const player = playerRef.current;
    return () => {
      if (player && !player.isDisposed()) {
        player.dispose();
        playerRef.current = null;
      }
    };
  }, [playerRef]);

  return (
    <div data-vjs-player className="w-full aspect-video rounded-xl overflow-hidden shadow-2xl">
      <div ref={videoRef} className="w-full h-full" />
    </div>
  );
};

export default VideoPlayer;
