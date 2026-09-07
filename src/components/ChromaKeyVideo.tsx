import React, { useEffect, useRef, useState } from 'react';

interface ChromaKeyVideoProps {
  src: string;
  autoPlay?: boolean;
  loop?: boolean;
  muted?: boolean;
  className?: string;
  enableChromaKey?: boolean;
  onEnded?: () => void;
  showControls?: boolean;
}

export const ChromaKeyVideo: React.FC<ChromaKeyVideoProps> = ({
  src,
  autoPlay = true,
  loop = true,
  muted = false,
  className = '',
  enableChromaKey = true,
  onEnded,
  showControls = false,
}) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(muted);
  const [hasError, setHasError] = useState(false);
  const [aspectRatio, setAspectRatio] = useState<number | null>(null);

  useEffect(() => {
    setHasError(false);
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;

    // Force inline playing and muted on DOM element for iOS / Android autoplay
    video.muted = true;
    video.defaultMuted = true;
    video.setAttribute('playsinline', 'true');
    video.setAttribute('webkit-playsinline', 'true');

    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return;

    let animId: number;
    let isMounted = true;
    let lastRenderTime = 0;

    const renderSingleFrame = () => {
      if (!video || !canvas || !ctx || video.readyState < 2) return;
      try {
        const vWidth = video.videoWidth;
        const vHeight = video.videoHeight;
        if (vWidth > 0 && vHeight > 0) {
          // Akıllı tahtalar ve düşük donanımlı cihazlar için işlem çözünürlüğünü maks 360p ile sınırla
          const scale = Math.min(1, 360 / vWidth);
          const targetW = Math.max(1, Math.round(vWidth * scale));
          const targetH = Math.max(1, Math.round(vHeight * scale));

          if (canvas.width !== targetW || canvas.height !== targetH) {
            canvas.width = targetW;
            canvas.height = targetH;
            setAspectRatio(vWidth / vHeight);
          }
          ctx.drawImage(video, 0, 0, targetW, targetH);
          if (enableChromaKey) {
            const frame = ctx.getImageData(0, 0, targetW, targetH);
            const l = frame.data.length;
            for (let i = 0; i < l; i += 4) {
              const r = frame.data[i];
              const g = frame.data[i + 1];
              const b = frame.data[i + 2];

              // Green Screen Keying (e.g. for try2.mp4, mask22.mp4, and standard green screens)
              if (g > 35 && g > r * 0.95 && g > b * 0.95 && (g - Math.max(r, b) > 10 || (g > 70 && g - r > 12 && g - b > 12))) {
                const maxRB = Math.max(r, b);
                const diff = g - maxRB;
                if (diff > 12) {
                  frame.data[i + 3] = 0;
                } else if (diff > 2) {
                  const alphaRatio = 1 - ((diff - 2) / 10);
                  frame.data[i + 3] = Math.floor(Math.max(0, Math.min(1, alphaRatio)) * 255);
                  frame.data[i + 1] = maxRB;
                }
              }
              // Black Background Keying
              else if (r < 35 && g < 35 && b < 35) {
                const maxRGB = Math.max(r, g, b);
                if (maxRGB <= 20) {
                  frame.data[i + 3] = 0;
                } else {
                  const alphaRatio = (maxRGB - 20) / 15;
                  frame.data[i + 3] = Math.floor(Math.min(1, Math.max(0, alphaRatio)) * 255);
                }
              }
              // Studio Wall Keying for sad.mp4
              else if (src.includes('sad.mp4')) {
                const maxRGB = Math.max(r, g, b);
                const minRGB = Math.min(r, g, b);
                const diff = maxRGB - minRGB;
                const isEyeWhite = minRGB > 245;
                const isRedClothing = (r - g > 35) && (r - b > 35);
                const isGoldenFur = r > 120 && g > 65 && (r - b > 45) && (g - b > 18) && (r - g < 60);

                if (!isEyeWhite && !isRedClothing && !isGoldenFur) {
                  if ((minRGB >= 50 && maxRGB <= 248 && diff <= 48 && (r - b) <= 48 && (g - b) <= 32) ||
                      (minRGB >= 40 && maxRGB <= 235 && diff <= 35)) {
                    frame.data[i + 3] = 0;
                  }
                }
              }
              // Studio Keying for aa.mp4
              else if (src.includes('aa.mp4')) {
                if (r > 150 && g > 100 && b < 100 && (r - b > 80) && (g - b > 40)) {
                  const diffRB = r - b;
                  if (diffRB > 90) {
                    frame.data[i + 3] = 0;
                  } else {
                    const alphaRatio = (90 - diffRB) / 10;
                    frame.data[i + 3] = Math.floor(Math.max(0, Math.min(1, alphaRatio)) * 255);
                  }
                }
              }
            }
            ctx.putImageData(frame, 0, 0);
          }
        }
      } catch (err) {
        console.warn('ChromaKey frame processing error:', err);
      }
    };

    const processFrame = (timestamp: number) => {
      if (!isMounted) return;

      // Sadece video oynarken ve hazır olduğunda, maks ~30 FPS ile işle
      if (video && !video.paused && !video.ended && video.readyState >= 2) {
        if (!lastRenderTime || timestamp - lastRenderTime >= 32) {
          lastRenderTime = timestamp;
          renderSingleFrame();
        }
      }

      if (isMounted) {
        animId = requestAnimationFrame(processFrame);
      }
    };

    const handleLoadedData = () => {
      if (video.videoWidth && video.videoHeight) {
        setAspectRatio(video.videoWidth / video.videoHeight);
      }
      renderSingleFrame();
    };

    const handlePlay = () => {
      setIsPlaying(true);
      if (!animId) {
        animId = requestAnimationFrame(processFrame);
      }
    };

    const handleEnded = () => {
      setIsPlaying(false);
      if (onEnded) onEnded();
    };

    video.addEventListener('loadeddata', handleLoadedData);
    video.addEventListener('loadedmetadata', handleLoadedData);
    video.addEventListener('canplay', handleLoadedData);
    video.addEventListener('play', handlePlay);
    video.addEventListener('ended', handleEnded);

    // Initial frame process start
    animId = requestAnimationFrame(processFrame);

    // AutoPlay handler with gesture unlock for mobile
    if (autoPlay) {
      const attemptPlay = () => {
        if (!video) return;
        video.muted = true;
        video.play().then(() => {
          setIsPlaying(true);
        }).catch(() => {
          // Retry muted play
          video.muted = true;
          video.play().catch(() => {});
        });
      };

      attemptPlay();

      const handleUserGesture = () => {
        if (video && video.paused) {
          video.muted = true;
          video.play().then(() => setIsPlaying(true)).catch(() => {});
        }
      };
      window.addEventListener('touchstart', handleUserGesture, { passive: true });
      window.addEventListener('click', handleUserGesture, { passive: true });

      return () => {
        isMounted = false;
        cancelAnimationFrame(animId);
        if (video) {
          video.removeEventListener('loadeddata', handleLoadedData);
          video.removeEventListener('loadedmetadata', handleLoadedData);
          video.removeEventListener('canplay', handleLoadedData);
          video.removeEventListener('play', handlePlay);
          video.removeEventListener('ended', handleEnded);
        }
        window.removeEventListener('touchstart', handleUserGesture);
        window.removeEventListener('click', handleUserGesture);
      };
    }

    return () => {
      isMounted = false;
      cancelAnimationFrame(animId);
      if (video) {
        video.removeEventListener('loadeddata', handleLoadedData);
        video.removeEventListener('loadedmetadata', handleLoadedData);
        video.removeEventListener('canplay', handleLoadedData);
        video.removeEventListener('play', handlePlay);
        video.removeEventListener('ended', handleEnded);
      }
    };
  }, [src, enableChromaKey, loop, autoPlay, onEnded]);

  // Do not return null on error so the video tag itself can render as fallback

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) {
      video.play();
    } else {
      video.pause();
      setIsPlaying(false);
    }
  };

  const toggleMute = () => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = !video.muted;
    setIsMuted(video.muted);
  };

  return (
    <div 
      className={`relative flex items-center justify-center overflow-hidden group ${className}`}
      style={aspectRatio ? { aspectRatio: `${aspectRatio}` } : undefined}
    >
      {/* Source Video Element - strictly positioned offscreen so native mobile video controls/placeholders never appear */}
      <video
        ref={videoRef}
        src={src}
        autoPlay={autoPlay}
        loop={loop}
        muted={isMuted}
        playsInline
        // @ts-ignore
        webkit-playsinline="true"
        // @ts-ignore
        x5-playsinline="true"
        disablePictureInPicture
        controls={false}
        onError={() => setHasError(true)}
        style={{
          position: 'fixed',
          top: -9999,
          left: -9999,
          width: 1,
          height: 1,
          opacity: 0,
          pointerEvents: 'none',
          zIndex: -100
        }}
      />

      {/* Transparent Render Canvas */}
      <canvas
        ref={canvasRef}
        onClick={togglePlay}
        style={aspectRatio ? { aspectRatio: `${aspectRatio}` } : undefined}
        className="w-full h-full object-contain block drop-shadow-[0_10px_25px_rgba(0,0,0,0.5)] cursor-pointer"
      />

      {/* Minimal Overlay Video Controls */}
      {showControls && (
        <div className="absolute bottom-2 right-2 z-30 flex items-center gap-1.5 opacity-80 group-hover:opacity-100 transition-opacity bg-slate-900/80 backdrop-blur-md p-1.5 rounded-xl border border-white/30 text-white text-xs">
          <button
            onClick={togglePlay}
            className="p-1 hover:bg-white/20 rounded-lg transition-colors cursor-pointer"
            title={isPlaying ? 'Duraklat' : 'Oynat'}
          >
            {isPlaying ? '⏸️' : '▶️'}
          </button>
          <button
            onClick={toggleMute}
            className="p-1 hover:bg-white/20 rounded-lg transition-colors cursor-pointer"
            title={isMuted ? 'Sesi Aç' : 'Sesi Kapat'}
          >
            {isMuted ? '🔇' : '🔊'}
          </button>
        </div>
      )}
    </div>
  );
};

