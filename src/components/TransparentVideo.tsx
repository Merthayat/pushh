import React, { useEffect, useRef, useState } from 'react';

interface TransparentVideoProps {
  src: string;
  fallbackImg?: string;
  alt: string;
  isPaused?: boolean;
  className?: string;
}

// WebGL Shaders: Siyah arka planı GPU seviyesinde (sıfır CPU yükü ile) temizler
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
varying vec2 v_texCoord;

void main() {
  vec4 color = texture2D(u_image, v_texCoord);
  float maxRGB = max(max(color.r, color.g), color.b);

  // Siyah arka planı GPU donanımında kesme
  if (maxRGB <= 0.08) {
    discard;
  }
  // Yumuşak kenar geçişi (feathering)
  else if (maxRGB < 0.18) {
    float alpha = (maxRGB - 0.08) / 0.10;
    gl_FragColor = vec4(color.rgb, color.a * clamp(alpha, 0.0, 1.0));
  } else {
    gl_FragColor = color;
  }
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

export const TransparentVideo: React.FC<TransparentVideoProps> = ({
  src,
  fallbackImg,
  alt,
  isPaused = false,
  className = ''
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isVideoReady, setIsVideoReady] = useState(false);

  // Görünürlük takibi (IntersectionObserver & Page Visibility API)
  const isVisibleRef = useRef<boolean>(true);
  const isPausedRef = useRef<boolean>(isPaused);
  isPausedRef.current = isPaused;

  useEffect(() => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!video || !canvas || !container) return;

    let animId: number;
    let isMounted = true;
    let lastRenderTime = 0;

    video.muted = true;
    video.defaultMuted = true;
    video.playsInline = true;
    video.setAttribute('playsinline', 'true');
    video.setAttribute('webkit-playsinline', 'true');

    // 1. WebGL (GPU) Başlatma
    let gl: WebGLRenderingContext | null = null;
    let glProgram: WebGLProgram | null = null;
    let glTexture: WebGLTexture | null = null;

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

    // 2. 2D Canvas Fallback Context (Yalnızca WebGL desteklenmezse)
    const ctx2D = !gl ? canvas.getContext('2d', { willReadFrequently: true }) : null;

    const renderFrame = () => {
      if (!video || !canvas || video.readyState < 2) return;
      const vWidth = video.videoWidth || 360;
      const vHeight = video.videoHeight || 640;

      // Boyutlandırma: WebGL modunda 360p, 2D fallback modunda CPU'yu yormamak için maks 180p
      const maxDim = gl ? 360 : 180;
      const scale = Math.min(1, maxDim / Math.max(vWidth, vHeight));
      const targetW = Math.max(1, Math.round(vWidth * scale));
      const targetH = Math.max(1, Math.round(vHeight * scale));

      if (canvas.width !== targetW || canvas.height !== targetH) {
        canvas.width = targetW;
        canvas.height = targetH;
      }

      // 1. WebGL (GPU) Yolu - Sıfır CPU döngüsü
      if (gl && glProgram && glTexture) {
        gl.viewport(0, 0, targetW, targetH);
        gl.useProgram(glProgram);
        gl.bindTexture(gl.TEXTURE_2D, glTexture);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, video);
        gl.drawArrays(gl.TRIANGLES, 0, 6);
        return;
      }

      // 2. 2D Fallback Yolu (Düşük çözünürlüklü ve hafifletilmiş)
      if (ctx2D) {
        ctx2D.drawImage(video, 0, 0, targetW, targetH);
        try {
          const imgData = ctx2D.getImageData(0, 0, targetW, targetH);
          const data = imgData.data;
          const len = data.length;

          for (let i = 0; i < len; i += 4) {
            const r = data[i];
            const g = data[i + 1];
            const b = data[i + 2];
            const maxC = Math.max(r, g, b);

            if (maxC < 25) {
              data[i + 3] = 0;
            } else if (maxC < 45) {
              data[i + 3] = Math.round(((maxC - 25) / 20) * 255);
            }
          }
          ctx2D.putImageData(imgData, 0, 0);
        } catch {}
      }
    };

    const processLoop = (timestamp: number) => {
      if (!isMounted) return;

      // Sadece görünür durumdayken, duraklatılmamışken ve video oynarken render yap
      if (
        isVisibleRef.current &&
        !document.hidden &&
        !isPausedRef.current &&
        video &&
        !video.paused &&
        !video.ended &&
        video.readyState >= 2
      ) {
        // Akıllı tahta CPU/GPU optimizasyonu: 30 FPS hız limiti (her karede boşa dönmeyi engeller)
        const frameInterval = gl ? 33 : 48; // WebGL için 30 FPS, 2D fallback için 20 FPS
        if (!lastRenderTime || timestamp - lastRenderTime >= frameInterval) {
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

    const notifyReady = () => {
      if (!isMounted) return;
      setIsVideoReady(true);
      if (!isPausedRef.current && isVisibleRef.current && !document.hidden) {
        video.play().catch(() => {});
      }
    };

    const handleEnded = () => {
      if (!isMounted) return;
      video.currentTime = 0;
      if (!isPausedRef.current && isVisibleRef.current && !document.hidden) {
        video.play().catch(() => {});
      }
    };

    video.addEventListener('loadeddata', notifyReady);
    video.addEventListener('canplay', notifyReady);
    video.addEventListener('playing', notifyReady);
    video.addEventListener('ended', handleEnded);

    if (video.readyState >= 2) {
      notifyReady();
    }

    // IntersectionObserver: Görünür değilken videoyu duraklat ve render döngüsünü askıya al
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const isIntersecting = entry.isIntersecting;
          isVisibleRef.current = isIntersecting;

          if (!isIntersecting) {
            if (video && !video.paused) {
              video.pause();
            }
          } else {
            if (video && !isPausedRef.current && !document.hidden && video.paused) {
              video.play().catch(() => {});
            }
          }
        });
      },
      { threshold: 0.05 }
    );
    observer.observe(container);

    // Page Visibility API: Tarayıcı sekmesi arka plana atıldığında CPU/GPU tüketimini sıfırla
    const handleVisibilityChange = () => {
      if (document.hidden) {
        isVisibleRef.current = false;
        if (video && !video.paused) {
          video.pause();
        }
      } else {
        isVisibleRef.current = true;
        if (video && !isPausedRef.current && video.paused) {
          video.play().catch(() => {});
        }
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    animId = requestAnimationFrame(processLoop);

    return () => {
      isMounted = false;
      cancelAnimationFrame(animId);
      observer.disconnect();
      document.removeEventListener('visibilitychange', handleVisibilityChange);

      if (video) {
        video.removeEventListener('loadeddata', notifyReady);
        video.removeEventListener('canplay', notifyReady);
        video.removeEventListener('playing', notifyReady);
        video.removeEventListener('ended', handleEnded);
        video.pause();
      }
    };
  }, [src]);

  // Duraklatma (isPaused) değiştiğinde videoyu anında tepki verdir
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    if (isPaused) {
      video.pause();
    } else if (isVisibleRef.current && !document.hidden) {
      video.play().catch(() => {});
    }
  }, [isPaused]);

  return (
    <div ref={containerRef} className={`relative flex items-center justify-center overflow-hidden ${className}`}>
      {/* Gizli Kaynak Video */}
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

      {/* WebGL ile Hızlandırılmış Şeffaf Canvas */}
      <canvas
        ref={canvasRef}
        width={360}
        height={640}
        className="w-full h-full object-contain pointer-events-none"
      />

      {/* Yüklenirken veya Desteklenmediğinde Yedek Görsel */}
      {!isVideoReady && fallbackImg && (
        <img
          src={fallbackImg}
          alt={alt}
          className="absolute inset-0 w-full h-full object-contain pointer-events-none"
        />
      )}
    </div>
  );
};
