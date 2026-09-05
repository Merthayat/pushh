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

    const currentScale = scale > 0 ? scale : 1;

    // Measure natural (unscaled) content dimensions across measureEl and its descendants
    let trueNaturalWidth = measureEl.scrollWidth || measureEl.offsetWidth;
    let trueNaturalHeight = measureEl.scrollHeight || measureEl.offsetHeight;

    // Check all child elements to detect any wide formula banners, sequence rows, or tables
    const allChildren = measureEl.querySelectorAll('*');
    allChildren.forEach((child) => {
      const el = child as HTMLElement;
      const scrollW = el.scrollWidth || 0;
      const offsetW = el.offsetWidth || 0;
      const rect = el.getBoundingClientRect();
      const unscaledW = rect.width / currentScale;
      const unscaledH = rect.height / currentScale;

      const w = Math.max(scrollW, offsetW, unscaledW);
      if (w > trueNaturalWidth) {
        trueNaturalWidth = w;
      }

      const scrollH = el.scrollHeight || 0;
      const offsetH = el.offsetHeight || 0;
      const h = Math.max(scrollH, offsetH, unscaledH);
      if (h > trueNaturalHeight) {
        trueNaturalHeight = h;
      }
    });

    if (trueNaturalWidth <= 0 || trueNaturalHeight <= 0) return;

    // Margins based on user instruction:
    // Mode 3: Use right up to the frame borders ("çerçevelerin çizgisine kadar kullan")
    const marginX = mode === 3 ? 2 : mode === 2 ? 6 : 10;
    const marginY = mode === 3 ? 2 : mode === 2 ? 4 : 8;

    const targetAvailW = Math.max(10, availWidth - marginX);
    const targetAvailH = Math.max(10, availHeight - marginY);

    const scaleX = targetAvailW / trueNaturalWidth;
    const scaleY = targetAvailH / trueNaturalHeight;

    // Scale required so that neither width nor height overflows the card frame
    let computedScale = Math.min(scaleX, scaleY);

    // User directive: In multiplayer (mode 2 & 3), keep font size consistent across player groups
    // Avoid wildly enlarging simple questions while shrinking adjacent players
    const maxEnlargeScale = mode === 1 ? 1.35 : mode === 2 ? 1.1 : 1.05;
    const minShrinkScale = mode === 3 ? 0.6 : mode === 2 ? 0.55 : 0.6;

    if (computedScale > 1.02) {
      // Content has surplus room: gently enlarge if allowed, but keep player groups consistent
      computedScale = Math.min(computedScale, maxEnlargeScale);
    } else if (computedScale >= 0.88) {
      // Comfortably fits natural size: do NOT shrink! Keep at 100% for uniform readability
      computedScale = 1;
    } else {
      // Content overflows the frame: shrink gracefully down to minShrinkScale
      computedScale = Math.max(minShrinkScale, computedScale * 0.985);
    }

    // Round to 3 decimals to avoid subpixel fluttering
    const rounded = Math.round(computedScale * 1000) / 1000;
    setScale(rounded);
    setIsReady(true);
  }, [mode, scale]);

  // Recalculate whenever question, mode, or layout changes
  useLayoutEffect(() => {
    calculateScale();
  }, [questionHTML, questionText, mode]);

  useEffect(() => {
    const container = containerRef.current;
    const measureEl = measureRef.current;
    if (!container) return;

    // ResizeObserver on container and content
    const ro = new ResizeObserver(() => {
      calculateScale();
    });
    ro.observe(container);
    if (measureEl) ro.observe(measureEl);

    // Watch for images loading
    if (measureEl) {
      const imgs = measureEl.querySelectorAll('img');
      imgs.forEach((img) => {
        if (!img.complete) {
          img.addEventListener('load', calculateScale);
          img.addEventListener('error', calculateScale);
        }
      });
    }

    const timer = setTimeout(calculateScale, 50);

    return () => {
      ro.disconnect();
      clearTimeout(timer);
    };
  }, [calculateScale, questionHTML, questionText]);

  // Responsive font size baseline based on mode
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
