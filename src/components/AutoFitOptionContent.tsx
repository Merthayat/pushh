import React, { useRef, useLayoutEffect, useState, useEffect } from 'react';

interface AutoFitOptionContentProps {
  opt: string | number;
  displayOpt: string | number;
  isGrade4?: boolean;
  mode?: 1 | 2 | 3;
  fallbackFontClass?: string;
}

export const AutoFitOptionContent: React.FC<AutoFitOptionContentProps> = ({
  opt,
  displayOpt,
  isGrade4 = false,
  mode = 1,
  fallbackFontClass = '',
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState<number>(1);

  const isHTML = typeof displayOpt === 'string' && displayOpt.includes('<');

  // Compute adaptive base font class based on character count and content type
  const baseFontClass = React.useMemo(() => {
    const clean = String(opt ?? '').replace(/<[^>]*>/g, '').trim();
    const len = clean.length;
    const isFraction = clean.includes('/') || (typeof displayOpt === 'string' && displayOpt.includes('inline-flex flex-col'));

    if (isFraction) {
      if (mode === 1) return "text-xl sm:text-2xl md:text-3xl lg:text-4xl font-black";
      if (mode === 2) return "text-lg sm:text-xl md:text-2xl lg:text-3xl font-black";
      return "text-base sm:text-lg md:text-xl font-black";
    }

    if (mode === 1) {
      if (len <= 3) return "text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black";
      if (len <= 6) return "text-xl sm:text-2xl md:text-3xl lg:text-4xl font-black";
      if (len <= 12) return "text-lg sm:text-xl md:text-2xl lg:text-3xl font-extrabold";
      if (len <= 20) return "text-base sm:text-lg md:text-xl lg:text-2xl font-bold";
      return "text-sm sm:text-base md:text-lg lg:text-xl font-bold";
    }

    if (mode === 2) {
      if (len <= 3) return "text-xl sm:text-2xl md:text-3xl lg:text-4xl font-black";
      if (len <= 6) return "text-lg sm:text-xl md:text-2xl lg:text-3xl font-black";
      if (len <= 12) return "text-base sm:text-lg md:text-xl lg:text-2xl font-extrabold";
      if (len <= 20) return "text-sm sm:text-base md:text-lg font-bold";
      return "text-xs sm:text-sm md:text-base font-bold";
    }

    // mode === 3
    if (len <= 3) return "text-lg sm:text-xl md:text-2xl font-black";
    if (len <= 6) return "text-base sm:text-lg md:text-xl font-black";
    if (len <= 12) return "text-sm sm:text-base md:text-lg font-extrabold";
    if (len <= 20) return "text-xs sm:text-sm md:text-base font-bold";
    return "text-[11px] sm:text-xs md:text-sm font-bold";
  }, [opt, displayOpt, mode]);

  const updateScale = React.useCallback(() => {
    const container = containerRef.current;
    const content = contentRef.current;
    if (!container || !content) return;

    // Temporarily reset transform to measure natural size
    content.style.transform = 'none';

    const availW = container.clientWidth;
    const availH = container.clientHeight;
    if (availW <= 0 || availH <= 0) return;

    const naturalW = content.scrollWidth || content.offsetWidth;
    const naturalH = content.scrollHeight || content.offsetHeight;
    if (naturalW <= 0 || naturalH <= 0) return;

    // Target available dimensions with small protective padding
    const targetW = availW - 6;
    const targetH = availH - 4;

    const scaleW = targetW / naturalW;
    const scaleH = targetH / naturalH;
    let s = Math.min(scaleW, scaleH);

    // If s > 1, short numbers/text expand to fill the button nicely (up to 1.35x)
    // If s < 1, long text shrinks so it never overflows (down to 0.70x minimum)
    if (s > 1.0) {
      s = Math.min(s, 1.35);
    } else {
      s = Math.max(s, 0.70);
    }

    setScale(s);
  }, []);

  useLayoutEffect(() => {
    updateScale();
  }, [updateScale, opt, displayOpt, baseFontClass]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const ro = new ResizeObserver(() => {
      updateScale();
    });
    ro.observe(container);

    return () => ro.disconnect();
  }, [updateScale]);

  return (
    <div
      ref={containerRef}
      className="relative z-10 w-full h-full flex items-center justify-center overflow-hidden px-1.5 py-0.5 pointer-events-none select-none"
    >
      <div
        ref={contentRef}
        style={{
          transform: scale !== 1 ? `scale(${scale})` : undefined,
          transformOrigin: 'center center',
          transition: 'transform 0.05s ease-out',
        }}
        className={`w-full max-w-full flex items-center justify-center text-center font-black text-white leading-tight ${
          isHTML ? '' : `${baseFontClass} [text-shadow:_0_1px_3px_#000]`
        }`}
        {...(isHTML
          ? { dangerouslySetInnerHTML: { __html: displayOpt as string } }
          : { children: displayOpt })}
      />
    </div>
  );
};
