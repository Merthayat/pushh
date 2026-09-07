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

// Global Concurrency Manager: Aynı anda en fazla 2 video oynatılsın
const MAX_CONCURRENT_VIDEOS = 2;
const activeVideoElements = new Set<HTMLVideoElement>();

function registerActiveVideo(video: HTMLVideoElement) {
  if (activeVideoElements.has(video)) return;
  if (activeVideoElements.size >= MAX_CONCURRENT_VIDEOS) {
    const oldest = activeVideoElements.values().next().value;
    if (oldest && oldest !== video) {
      try {
        oldest.pause();
      } catch {}
      activeVideoElements.delete(oldest);
    }
  }
  activeVideoElements.add(video);
}

function unregisterActiveVideo(video: HTMLVideoElement) {
  activeVideoElements.delete(video);
}

// WebGL Shaders
const VERTEX_SHADER_SRC = `
attribute vec2 a_position;
attribute vec2 a_texCoord;
varying vec2 v_texCoord;
void main() {
  gl_Position = vec4(a_position, 0.0, 1.0);
  v_texCoord = a_texCoord;
}
`;

const FRAGMENT_SHADER_SRC = `
precision mediump float;
uniform sampler2D u_image;
uniform int u_keyMode;
varying vec2 v_texCoord;

void main() {
  vec4 color = texture2D(u_image, v_texCoord);
  float r = color.r;
  float g = color.g;
  float b = color.b;

  // 1: Green screen
  if (u_keyMode == 1) {
    float maxRB = max(r, b);
    float diff = g - maxRB;
    if (g > 0.14 && g > r * 0.95 && g > b * 0.95 && (diff > 0.04 || (g > 0.28 && g - r > 0.05 && g - b > 0.05))) {
      if (diff > 0.05) {
        discard;
      } else if (diff > 0.01) {
        float alpha = 1.0 - ((diff - 0.01) / 0.04);
        gl_FragColor = vec4(r, maxRB, b, color.a * clamp(alpha, 0.0, 1.0));
        return;
      }
    }
  }
  // 2: Black background
  else if (u_keyMode == 2) {
    float maxRGB = max(max(r, g), b);
    if (maxRGB <= 0.08) {
      discard;
    } else if (maxRGB < 0.16) {
      float alpha = (maxRGB - 0.08) / 0.08;
      gl_FragColor = vec4(r, g, b, color.a * clamp(alpha, 0.0, 1.0));
      return;
    }
  }
  // 3: sad.mp4
  else if (u_keyMode == 3) {
    float maxRGB = max(max(r, g), b);
    float minRGB = min(min(r, g), b);
    float diff = maxRGB - minRGB;
    bool isEyeWhite = minRGB > 0.96;
    bool isRedClothing = (r - g > 0.14) && (r - b > 0.14);
    bool isGoldenFur = r > 0.47 && g > 0.25 && (r - b > 0.18) && (g - b > 0.07) && (r - g < 0.24);

    if (!isEyeWhite && !isRedClothing && !isGoldenFur) {
      if ((minRGB >= 0.20 && maxRGB <= 0.97 && diff <= 0.19 && (r - b) <= 0.19 && (g - b) <= 0.13) ||
          (minRGB >= 0.16 && maxRGB <= 0.92 && diff <= 0.14)) {
        discard;
      }
    }
  }
  // 4: aa.mp4
  else if (u_keyMode == 4) {
    if (r > 0.59 && g > 0.39 && b < 0.39 && (r - b > 0.31) && (g - b > 0.16)) {
      float diffRB = r - b;
      if (diffRB > 0.35) {
        discard;
      } else {
        float alpha = (0.35 - diffRB) / 0.04;
        gl_FragColor = vec4(r, g, b, color.a * clamp(alpha, 0.0, 1.0));
        return;
      }
    }
  }

  gl_FragColor = color;
}
`;

function createShader(gl: WebGLRenderingContext, type: number, source: string) {
  const shader = gl.createShader(type);
  if (!shader) return null;
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    gl.deleteShader(shader);
    return null;
  }
  return shader;
}

function createProgram(gl: WebGLRenderingContext, vertexShader: WebGLShader, fragmentShader: WebGLShader) {
  const program = gl.createProgram();
  if (!program) return null;
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    gl.deleteProgram(program);
    return null;
  }
  return program;
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
  const containerRef = useRef<HTMLDivElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(muted);
  const [aspectRatio, setAspectRatio] = useState<number | null>(null);

  // IntersectionObserver görünürlük takibi
  const isVisibleRef = useRef<boolean>(true);
  const shouldPlayRef = useRef<boolean>(autoPlay);

  // Key modu render döngüsü dışarısında tek seferde tespit edilir (her pikselde tekrar string araması yapılmaz)
  const keyMode = React.useMemo(() => {
    if (!enableChromaKey) return 0;
    const lower = src.toLowerCase();
    if (lower.includes('sad.mp4')) return 3;
    if (lower.includes('aa.mp4')) return 4;
    return 1; // Standart green-screen + black fallback
  }, [src, enableChromaKey]);

  useEffect(() => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!video || !canvas || !container) return;

    video.muted = true;
    video.defaultMuted = true;
    video.setAttribute('playsinline', 'true');
    video.setAttribute('webkit-playsinline', 'true');

    let animId: number;
    let isMounted = true;
    let lastRenderTime = 0;

    // WebGL başlatmayı dene
    let gl: WebGLRenderingContext | null = null;
    let glProgram: WebGLProgram | null = null;
    let glTexture: WebGLTexture | null = null;
    let uKeyModeLoc: WebGLUniformLocation | null = null;

    try {
      gl = canvas.getContext('webgl', { premultipliedAlpha: false, alpha: true }) ||
           (canvas.getContext('experimental-webgl', { premultipliedAlpha: false, alpha: true }) as WebGLRenderingContext | null);

      if (gl) {
        const vs = createShader(gl, gl.VERTEX_SHADER, VERTEX_SHADER_SRC);
        const fs = createShader(gl, gl.FRAGMENT_SHADER, FRAGMENT_SHADER_SRC);
        if (vs && fs) {
          glProgram = createProgram(gl, vs, fs);
          if (glProgram) {
            gl.useProgram(glProgram);

            // Buffer oluştur
            const positionBuffer = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
            // 2 üçgen (tam ekran quad)
            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
              -1, -1,  0, 1,
               1, -1,  1, 1,
              -1,  1,  0, 0,
              -1,  1,  0, 0,
               1, -1,  1, 1,
               1,  1,  1, 0,
            ]), gl.STATIC_DRAW);

            const aPositionLoc = gl.getAttribLocation(glProgram, 'a_position');
            const aTexCoordLoc = gl.getAttribLocation(glProgram, 'a_texCoord');
            uKeyModeLoc = gl.getUniformLocation(glProgram, 'u_keyMode');

            gl.enableVertexAttribArray(aPositionLoc);
            gl.vertexAttribPointer(aPositionLoc, 2, gl.FLOAT, false, 16, 0);

            gl.enableVertexAttribArray(aTexCoordLoc);
            gl.vertexAttribPointer(aTexCoordLoc, 2, gl.FLOAT, false, 16, 8);

            glTexture = gl.createTexture();
            gl.bindTexture(gl.TEXTURE_2D, glTexture);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
          }
        }
      }
    } catch {
      gl = null;
    }

    // 2D Canvas Fallback Context (WebGL başarısız olursa)
    const ctx2D = !gl ? canvas.getContext('2d', { willReadFrequently: true }) : null;

    const renderFrame = () => {
      if (!video || !canvas || video.readyState < 2) return;
      const vWidth = video.videoWidth;
      const vHeight = video.videoHeight;
      if (vWidth <= 0 || vHeight <= 0) return;

      // Akıllı tahta çözünürlük optimizasyonu: WebGL'de doğrudan video boyutunu, 2D fallback'te maks 360p kullan
      const maxRes = gl ? 640 : 360;
      const scale = Math.min(1, maxRes / Math.max(vWidth, vHeight));
      const targetW = Math.max(1, Math.round(vWidth * scale));
      const targetH = Math.max(1, Math.round(vHeight * scale));

      if (canvas.width !== targetW || canvas.height !== targetH) {
        canvas.width = targetW;
        canvas.height = targetH;
        setAspectRatio(vWidth / vHeight);
      }

      // 1. WebGL (GPU) Render Yolu (Sıfır CPU piksel döngüsü)
      if (gl && glProgram && glTexture) {
        gl.viewport(0, 0, targetW, targetH);
        gl.useProgram(glProgram);
        if (uKeyModeLoc) {
          gl.uniform1i(uKeyModeLoc, keyMode);
        }

        gl.bindTexture(gl.TEXTURE_2D, glTexture);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, video);
        gl.drawArrays(gl.TRIANGLES, 0, 6);
        return;
      }

      // 2. 2D Canvas (CPU) Optimize Edilmiş Fallback Yolu
      if (ctx2D) {
        ctx2D.drawImage(video, 0, 0, targetW, targetH);
        if (enableChromaKey) {
          const frame = ctx2D.getImageData(0, 0, targetW, targetH);
          const data = frame.data;
          const l = data.length;

          // Döngü içinde ASLA src.includes kontrolü yok! Doğrudan önceden hesaplanan keyMode kullanılıyor.
          if (keyMode === 3) {
            // sad.mp4
            for (let i = 0; i < l; i += 4) {
              const r = data[i];
              const g = data[i + 1];
              const b = data[i + 2];
              const maxRGB = Math.max(r, g, b);
              const minRGB = Math.min(r, g, b);
              const diff = maxRGB - minRGB;
              const isEyeWhite = minRGB > 245;
              const isRedClothing = (r - g > 35) && (r - b > 35);
              const isGoldenFur = r > 120 && g > 65 && (r - b > 45) && (g - b > 18) && (r - g < 60);

              if (!isEyeWhite && !isRedClothing && !isGoldenFur) {
                if ((minRGB >= 50 && maxRGB <= 248 && diff <= 48 && (r - b) <= 48 && (g - b) <= 32) ||
                    (minRGB >= 40 && maxRGB <= 235 && diff <= 35)) {
                  data[i + 3] = 0;
                }
              }
            }
          } else if (keyMode === 4) {
            // aa.mp4
            for (let i = 0; i < l; i += 4) {
              const r = data[i];
              const g = data[i + 1];
              const b = data[i + 2];
              if (r > 150 && g > 100 && b < 100 && (r - b > 80) && (g - b > 40)) {
                const diffRB = r - b;
                if (diffRB > 90) {
                  data[i + 3] = 0;
                } else {
                  const alphaRatio = (90 - diffRB) / 10;
                  data[i + 3] = Math.floor(Math.max(0, Math.min(1, alphaRatio)) * 255);
                }
              }
            }
          } else {
            // Standart green-screen + dark background
            for (let i = 0; i < l; i += 4) {
              const r = data[i];
              const g = data[i + 1];
              const b = data[i + 2];

              if (g > 35 && g > r * 0.95 && g > b * 0.95 && (g - Math.max(r, b) > 10 || (g > 70 && g - r > 12 && g - b > 12))) {
                const maxRB = Math.max(r, b);
                const diff = g - maxRB;
                if (diff > 12) {
                  data[i + 3] = 0;
                } else if (diff > 2) {
                  const alphaRatio = 1 - ((diff - 2) / 10);
                  data[i + 3] = Math.floor(Math.max(0, Math.min(1, alphaRatio)) * 255);
                  data[i + 1] = maxRB;
                }
              } else if (r < 35 && g < 35 && b < 35) {
                const maxRGB = Math.max(r, g, b);
                if (maxRGB <= 20) {
                  data[i + 3] = 0;
                } else {
                  const alphaRatio = (maxRGB - 20) / 15;
                  data[i + 3] = Math.floor(Math.min(1, Math.max(0, alphaRatio)) * 255);
                }
              }
            }
          }
          ctx2D.putImageData(frame, 0, 0);
        }
      }
    };

    const processLoop = (timestamp: number) => {
      if (!isMounted) return;

      // Ekranda görünmüyorsa veya video duraklatılmışsa işlem yapma
      if (isVisibleRef.current && video && !video.paused && !video.ended && video.readyState >= 2) {
        // Maksimum 30 FPS hız limiti ile kare çiz (gereksiz GPU/CPU ısınmasını önler)
        if (!lastRenderTime || timestamp - lastRenderTime >= 32) {
          lastRenderTime = timestamp;
          try {
            renderFrame();
          } catch {}
        }
      }

      if (isMounted) {
        animId = requestAnimationFrame(processLoop);
      }
    };

    // IntersectionObserver: Ekranda olmayan videoları duraklat
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const isIntersecting = entry.isIntersecting;
          isVisibleRef.current = isIntersecting;

          if (!isIntersecting) {
            // Ekranda değil, duraklat ve concurrency listesinden çıkar
            if (video && !video.paused) {
              video.pause();
              unregisterActiveVideo(video);
            }
          } else {
            // Ekrana geri girdi, eğer çalması gerekiyorsa başlat
            if (video && shouldPlayRef.current && video.paused) {
              registerActiveVideo(video);
              video.play().catch(() => {});
            }
          }
        });
      },
      { threshold: 0.05 }
    );

    observer.observe(container);

    const handlePlay = () => {
      setIsPlaying(true);
      registerActiveVideo(video);
    };

    const handlePause = () => {
      setIsPlaying(false);
      unregisterActiveVideo(video);
    };

    const handleEnded = () => {
      setIsPlaying(false);
      unregisterActiveVideo(video);
      if (onEnded) onEnded();
    };

    const handleLoadedData = () => {
      if (video.videoWidth && video.videoHeight) {
        setAspectRatio(video.videoWidth / video.videoHeight);
      }
      renderFrame();
    };

    video.addEventListener('play', handlePlay);
    video.addEventListener('pause', handlePause);
    video.addEventListener('ended', handleEnded);
    video.addEventListener('loadeddata', handleLoadedData);

    animId = requestAnimationFrame(processLoop);

    if (autoPlay) {
      shouldPlayRef.current = true;
      registerActiveVideo(video);
      video.play().catch(() => {});
    }

    return () => {
      isMounted = false;
      cancelAnimationFrame(animId);
      observer.disconnect();
      unregisterActiveVideo(video);
      if (video) {
        video.removeEventListener('play', handlePlay);
        video.removeEventListener('pause', handlePause);
        video.removeEventListener('ended', handleEnded);
        video.removeEventListener('loadeddata', handleLoadedData);
      }
    };
  }, [src, enableChromaKey, autoPlay, keyMode, onEnded]);

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) {
      shouldPlayRef.current = true;
      registerActiveVideo(video);
      video.play();
    } else {
      shouldPlayRef.current = false;
      video.pause();
      unregisterActiveVideo(video);
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
      ref={containerRef}
      className={`relative flex items-center justify-center overflow-hidden group ${className}`}
      style={aspectRatio ? { aspectRatio: `${aspectRatio}` } : undefined}
    >
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
        style={{
          position: 'fixed',
          top: -9999,
          left: -9999,
          width: 1,
          height: 1,
          opacity: 0,
          pointerEvents: 'none',
          zIndex: -100,
        }}
      />

      <canvas
        ref={canvasRef}
        onClick={togglePlay}
        style={aspectRatio ? { aspectRatio: `${aspectRatio}` } : undefined}
        className="w-full h-full object-contain block drop-shadow-[0_6px_16px_rgba(0,0,0,0.4)] cursor-pointer"
      />

      {showControls && (
        <div className="absolute bottom-2 right-2 z-30 flex items-center gap-1.5 opacity-80 group-hover:opacity-100 transition-opacity bg-slate-900/90 p-1.5 rounded-xl border border-white/30 text-white text-xs">
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
