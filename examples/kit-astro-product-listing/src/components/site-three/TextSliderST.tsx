import { useEffect, useRef, useState } from "react";

interface TextSliderSTProps {
  styles: string;
  text: string;
  isEditing: boolean;
}

export function TextSliderSTIsland({ styles, text, isEditing }: TextSliderSTProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const measureRef = useRef<HTMLHeadingElement>(null);
  const [repeatCount, setRepeatCount] = useState(1);
  const [ready, setReady] = useState(false);

  const phrase = text || "No text in field";

  useEffect(() => {
    if (isEditing) return;

    const calculateRepeats = () => {
      if (!measureRef.current || !containerRef.current) return;

      const phraseWidth = measureRef.current.offsetWidth;
      const containerWidth = containerRef.current.offsetWidth;

      if (phraseWidth === 0 || containerWidth === 0) return;

      const minTotalWidth = containerWidth * 4;
      const neededRepeats = Math.ceil(minTotalWidth / phraseWidth);
      setRepeatCount(neededRepeats);
      setReady(true);
    };

    const waitForFontsAndLayout = async () => {
      if (document.fonts && document.fonts.ready) {
        await document.fonts.ready;
      }
      requestAnimationFrame(() => {
        calculateRepeats();
      });
    };

    waitForFontsAndLayout();
    window.addEventListener("resize", calculateRepeats);

    return () => window.removeEventListener("resize", calculateRepeats);
  }, [phrase, isEditing]);

  return (
    <div
      ref={containerRef}
      className={`relative w-full h-18 lg:h-34 whitespace-nowrap overflow-hidden ${styles}`}
      data-class-change
    >
      {/* Hidden measure element */}
      <h2
        ref={measureRef}
        className="absolute top-0 invisible whitespace-nowrap uppercase text-3xl lg:text-7xl"
      >
        {phrase}
      </h2>
      {(ready || isEditing) && (
        <div
          className="flex absolute top-1/2 -translate-y-1/2 animate-marquee will-change-transform whitespace-nowrap uppercase"
          style={{
            animationDuration: `${(
              Array(repeatCount).fill(phrase).join("").length / 5
            ).toFixed(2)}s`,
          }}
        >
          <h2 className="text-3xl lg:text-7xl">
            {Array(repeatCount)
              .fill("")
              .map((_el, i) => (
                <span
                  key={i}
                  className="font-[inherit] [.bg-gradient-secondary_&:nth-child(4n-3)]:text-white [.bg-gradient-secondary_&:nth-child(4n-2)]:text-white"
                >
                  {phrase}
                  <span className="font-[inherit] text-primary">. </span>
                </span>
              ))}
          </h2>
        </div>
      )}
    </div>
  );
}
