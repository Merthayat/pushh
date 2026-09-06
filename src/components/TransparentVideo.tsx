import React, { useEffect, useRef, useState } from 'react';

interface TransparentVideoProps {
  src: string;
  fallbackImg?: string;
  alt: string;
  isPaused?: boolean;
  className?: string;
}

export const TransparentVideo: React.FC<TransparentVideoProps> = ({
  src,
  fallbackImg,
  alt,
  isPaused = false,
  className = ''
}) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isVideoReady, setIsVideoReady] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;

    let animId: number;
    let isMounted = true;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return;

    video.muted = true;
    video.defaultMuted = true;
    video.playsInline = true;

    const notifyReady = () => {
      if (!isMounted) return;
      setIsVideoReady(true);
      if (!isPaused) {
        video.play().catch(() => {});
      }
    };

    const handleEnded = () => {
      if (!isMounted) return;
      video.currentTime = 0;
      if (!isPaused) {
        video.play().catch(() => {});
      }
    };

    video.addEventListener('loadeddata', notifyReady);
    video.addEventListener('canplay', notifyReady);
    video.addEventListener('canplaythrough', notifyReady);
    video.addEventListener('playing', notifyReady);
    video.addEventListener('ended', handleEnded);

    // Initial check in case already loaded from cache
    if (video.readyState >= 2) {
      notifyReady();
    }

    // Frame processing loop to remove black background
    const renderLoop = () => {
      if (!isMounted) return;

      if (video.readyState >= 2 && !video.paused && !video.ended) {
        const w = canvas.width;
        const h = canvas.height;
        ctx.clearRect(0, 0, w, h);
        ctx.drawImage(video, 0, 0, w, h);

        try {
          const imgData = ctx.getImageData(0, 0, w, h);
          const data = imgData.data;
          const len = data.length;

          for (let i = 0; i < len; i += 4) {
            const r = data[i];
            const g = data[i + 1];
            const b = data[i + 2];

            // Black keying with smooth edge feathering
            if (r < 25 && g < 25 && b < 25) {
              data[i + 3] = 0;
            } else if (r < 45 && g < 45 && b < 45) {
              const maxC = Math.max(r, g, b);
              data[i + 3] = Math.round(((maxC - 25) / 20) * 255);
            }
          }

          ctx.putImageData(imgData, 0, 0);
        } catch {
          // Fallback if canvas read fails
        }
      }

      animId = requestAnimationFrame(renderLoop);
    };

    animId = requestAnimationFrame(renderLoop);

    return () => {
      isMounted = false;
      cancelAnimationFrame(animId);
      video.removeEventListener('loadeddata', notifyReady);
      video.removeEventListener('canplay', notifyReady);
      video.removeEventListener('canplaythrough', notifyReady);
      video.removeEventListener('playing', notifyReady);
      video.removeEventListener('ended', handleEnded);
    };
  }, [isPaused]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    if (isPaused) {
      video.pause();
    } else {
      video.play().catch(() => {});
    }
  }, [isPaused]);

  return (
    <div className={`relative flex items-center justify-center overflow-hidden ${className}`}>
      {/* Hidden Video Source */}
      <video
        ref={videoRef}
        src={src}
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        className="absolute inset-0 w-full h-full object-contain opacity-0 pointer-events-none"
      />

      {/* Primary Transparent Canvas with Chroma Keyed Alpha */}
      <canvas
        ref={canvasRef}
        width={360}
        height={640}
        className="w-full h-full object-contain pointer-events-none filter drop-shadow-[0_4px_10px_rgba(0,0,0,0.7)]"
      />

      {/* Fallback Static Image while loading */}
      {!isVideoReady && fallbackImg && (
        <img
          src={fallbackImg}
          alt={alt}
          className="absolute inset-0 w-full h-full object-contain filter drop-shadow-md animate-pulse pointer-events-none"
        />
      )}
    </div>
  );
};
