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

    // Check horizontal flex containers or multi-child rows for true physical span
    const flexContainers = measureEl.querySelectorAll('.flex-nowrap, [class*="flex-nowrap"], .flex');
    flexContainers.forEach((containerEl) => {
      const children = Array.from(containerEl.children).filter(
        c => (c as HTMLElement).offsetWidth > 0 || (c as HTMLElement).getBoundingClientRect().width > 0
      );
      if (children.length > 1) {
        const firstRect = children[0].getBoundingClientRect();
        const lastRect = children[children.length - 1].getBoundingClientRect();
        const rowSpan = (lastRect.right - firstRect.left) / currentScale;
        if (rowSpan > trueNaturalWidth) {
          trueNaturalWidth = rowSpan;
        }
      }
    });

    // Explicitly measure nowrap banners, halat boxes, and formula items to guarantee accurate span
    const nowrapElements = measureEl.querySelectorAll('.halat-islem-box, .formula-box, .whitespace-nowrap, [class*="whitespace-nowrap"], [style*="nowrap"]');
    nowrapElements.forEach((el) => {
      const htmlEl = el as HTMLElement;
      const scrollW = htmlEl.scrollWidth || 0;
      const offsetW = htmlEl.offsetWidth || 0;
      const rect = htmlEl.getBoundingClientRect();
      const unscaledW = rect.width / currentScale;
      const trueW = Math.max(scrollW, offsetW, unscaledW);
      if (trueW > trueNaturalWidth) {
        trueNaturalWidth = trueW;
      }
    });

    if (trueNaturalWidth <= 0 || trueNaturalHeight <= 0) return;

    // Detect if content has full-width image container (such as uzamsal iliskiler)
    const hasFullWidthImage = !!measureEl.querySelector('[data-full-width="true"], .uzamsal-soru-container');

    // Margins based on user instruction:
    // Mode 3: Use right up to the frame borders ("çerçevelerin çizgisine kadar kullan")
    const marginX = hasFullWidthImage ? 0 : (mode === 3 ? 2 : mode === 2 ? 6 : 10);
    const marginY = hasFullWidthImage ? 0 : (mode === 3 ? 2 : mode === 2 ? 4 : 8);

    const targetAvailW = Math.max(10, availWidth - marginX);
    const targetAvailH = Math.max(10, availHeight - marginY);

    const scaleX = targetAvailW / trueNaturalWidth;
    const scaleY = targetAvailH / trueNaturalHeight;

    // For full-width image questions, let flexbox naturally fill 100% height and width
    if (hasFullWidthImage) {
      setScale(1);
      setIsReady(true);
      return;
    }

    // Scale required so that neither width nor height overflows the card frame
    let computedScale = Math.min(scaleX, scaleY);

    // User directive: In multiplayer (mode 2 & 3), keep font size consistent across player groups
    // Avoid wildly enlarging simple questions while shrinking adjacent players
    const maxEnlargeScale = mode === 1 ? 1.35 : mode === 2 ? 1.1 : 1.05;
    const minShrinkScale = mode === 3 ? 0.45 : mode === 2 ? 0.5 : 0.55;

    if (computedScale > 1.02) {
      // Content has surplus room: gently enlarge if allowed, but keep player groups consistent
      computedScale = Math.min(computedScale, maxEnlargeScale);
    } else if (computedScale >= 0.99) {
      // Fits natural size comfortably without any overflow: keep at 100% natural size
      computedScale = 1;
    } else {
      // Content overflows the frame (computedScale < 0.99): shrink gracefully so it never spills past borders
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

  // Detect if question contains a full-width/full-height visual container (like uzamsal iliskiler)
  const isFullImageQuestion = Boolean(
    questionHTML && (questionHTML.includes('uzamsal-soru-container') || questionHTML.includes('data-full-width="true"'))
  );

  return (
    <div
      ref={containerRef}
      className={`w-full h-full flex ${isFullImageQuestion ? 'flex-col justify-between' : 'items-center justify-center'} overflow-hidden min-h-0 relative select-none`}
    >
      <div
        ref={measureRef}
        style={{
          transform: isFullImageQuestion ? 'none' : `scale(${scale})`,
          transformOrigin: 'center center',
          opacity: isReady ? 1 : 0.95,
        }}
        className={`w-full max-w-full ${isFullImageQuestion ? 'h-full flex flex-col justify-between' : 'flex flex-col items-center justify-center'} text-center transition-transform duration-100 ease-out will-change-transform ${className}`}
      >
        {questionHTML ? (
          <div
            dangerouslySetInnerHTML={{ __html: questionHTML }}
            className={`question-visual-box multi-player-${mode} w-full ${isFullImageQuestion ? 'h-full flex flex-col justify-between' : 'flex flex-col items-center justify-center'} font-black tracking-wide leading-snug drop-shadow-[0_4px_12px_rgba(0,0,0,0.95)] [text-shadow:0_2px_4px_#000] text-white ${fontClass}`}
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
