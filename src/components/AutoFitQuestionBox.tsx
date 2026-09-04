import React, { useRef, useLayoutEffect, useState, useEffect, useCallback } from 'react';

interface AutoFitQuestionBoxProps {
  questionHTML?: string;
  questionText?: string;
  mode?: 1 | 2 | 3;
  className?: string;
}

export const AutoFitQuestionBox: React.FC<AutoFitQuestionBoxProps> = ({
  questionHTML,
  questionText,
  mode = 1,
  className = '',
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const measureRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState<number>(1);
  const [isReady, setIsReady] = useState<boolean>(false);

  const calculateScale = useCallback(() => {
    const container = containerRef.current;
    const measureEl = measureRef.current;
    if (!container || !measureEl) return;

    const availWidth = container.clientWidth;
    const availHeight = container.clientHeight;

    if (availWidth <= 0 || availHeight <= 0) return;

    // Measure natural (unscaled) content dimensions
    const naturalWidth = measureEl.scrollWidth || measureEl.offsetWidth;
    const naturalHeight = measureEl.scrollHeight || measureEl.offsetHeight;

    if (naturalWidth <= 0 || naturalHeight <= 0) return;

    // Add safe breathing margin depending on player mode
    const marginX = mode === 3 ? 8 : mode === 2 ? 12 : 16;
    const marginY = mode === 3 ? 4 : mode === 2 ? 8 : 12;

    const targetAvailW = Math.max(10, availWidth - marginX);
    const targetAvailH = Math.max(10, availHeight - marginY);

    const scaleX = targetAvailW / naturalWidth;
    const scaleY = targetAvailH / naturalHeight;

    // Minimum scale required so that neither width nor height overflows
    let computedScale = Math.min(scaleX, scaleY);

    // If it fits and there is surplus space, allow enlarging (so small items aren't tiny)
    // Max scale ceiling per player mode to prevent pixelation:
    const maxEnlargeScale = mode === 1 ? 1.5 : mode === 2 ? 1.35 : 1.25;
    const minShrinkScale = mode === 3 ? 0.5 : mode === 2 ? 0.55 : 0.6;

    if (computedScale > 1) {
      computedScale = Math.min(computedScale, maxEnlargeScale);
    } else {
      // It's overflowing: shrink as much as needed, down to minShrinkScale
      computedScale = Math.max(minShrinkScale, computedScale * 0.97);
    }

    // Round to 3 decimals to prevent micro-oscillations
    const rounded = Math.round(computedScale * 1000) / 1000;
    setScale(rounded);
    setIsReady(true);
  }, [mode]);

  // Recalculate whenever question, mode, or resize happens
  useLayoutEffect(() => {
    calculateScale();
  }, [questionHTML, questionText, mode, calculateScale]);

  useEffect(() => {
    const container = containerRef.current;
    const measureEl = measureRef.current;
    if (!container) return;

    // ResizeObserver on container to adapt smoothly to screen or split changes
    const ro = new ResizeObserver(() => {
      calculateScale();
    });
    ro.observe(container);
    if (measureEl) ro.observe(measureEl);

    // Watch for image loads inside questionHTML to recalculate once image sizes are known
    if (measureEl) {
      const imgs = measureEl.querySelectorAll('img');
      imgs.forEach((img) => {
        if (!img.complete) {
          img.addEventListener('load', calculateScale);
          img.addEventListener('error', calculateScale);
        }
      });
    }

    // Extra fallback delay for SVGs/fonts/tables rendering
    const timer = setTimeout(calculateScale, 60);

    return () => {
      ro.disconnect();
      clearTimeout(timer);
    };
  }, [calculateScale, questionHTML, questionText]);

  // Responsive font size baseline based on mode (scaled smoothly by AutoFitQuestionBox)
  const fontClass = mode === 1
    ? 'text-lg xs:text-xl sm:text-2xl md:text-3xl'
    : mode === 2
    ? 'text-base xs:text-lg sm:text-xl'
    : 'text-sm xs:text-base sm:text-lg';

  return (
    <div
      ref={containerRef}
      className="w-full h-full flex items-center justify-center overflow-hidden min-h-0 relative select-none"
    >
      <div
        ref={measureRef}
        style={{
          transform: `scale(${scale})`,
          transformOrigin: 'center center',
          opacity: isReady ? 1 : 0.95,
        }}
        className={`w-full max-w-full flex flex-col items-center justify-center text-center transition-transform duration-100 ease-out will-change-transform ${className}`}
      >
        {questionHTML ? (
          <div
            dangerouslySetInnerHTML={{ __html: questionHTML }}
            className={`question-visual-box multi-player-${mode} w-full flex flex-col items-center justify-center font-black tracking-wide leading-snug drop-shadow-[0_4px_12px_rgba(0,0,0,0.95)] [text-shadow:0_2px_4px_#000] text-white ${fontClass}`}
          />
        ) : (
          <div
            className={`my-auto font-black text-white tracking-wide leading-snug drop-shadow-[0_4px_12px_rgba(0,0,0,0.95)] [text-shadow:_0_2px_6px_#000,_0_4px_14px_rgba(0,0,0,0.9)] px-2 py-1 max-w-full text-center ${fontClass}`}
          >
            {questionText}
          </div>
        )}
      </div>
    </div>
  );
};
export default AutoFitQuestionBox;
