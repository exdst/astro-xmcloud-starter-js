import { ChevronLeft, ChevronRight, Pause, Play } from "lucide-react";
import { useEffect, useMemo, useRef, useState, type JSX } from "react";
import { Button } from "@/components/ui/button";
import { AnimatePresence, m } from "framer-motion";
import { cn } from "@/lib/utils";

interface SlideData {
  id: string;
  title: string;
  bodyText: string;
  slideImage: string;
  slideImageAlt: string;
  callToAction: {
    href: string;
    text: string;
    target: string;
  } | null;
}

interface CarouselProps {
  slides: SlideData[];
  title: string;
  tagLine: string;
  styles?: string;
}

function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);
  useEffect(() => {
    const mql = window.matchMedia(query);
    setMatches(mql.matches);
    const handler = (e: MediaQueryListEvent) => setMatches(e.matches);
    mql.addEventListener("change", handler);
    return () => mql.removeEventListener("change", handler);
  }, [query]);
  return matches;
}

export function Default({ slides, title, tagLine, styles = "" }: CarouselProps): JSX.Element {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isFocused, setIsFocused] = useState(false);
  const [direction, setDirection] = useState(0);
  const carouselRef = useRef<HTMLDivElement>(null);
  const slideRefs = useRef<(HTMLDivElement | null)[]>([]);
  const prefersReducedMotion = useMediaQuery("(prefers-reduced-motion: reduce)");

  useEffect(() => {
    if (!isPlaying || isFocused) return;
    const interval = setInterval(() => {
      goToNextSlide();
    }, 15000);
    return () => clearInterval(interval);
  }, [isPlaying, currentSlide, isFocused]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!carouselRef.current?.contains(document.activeElement)) return;
      switch (e.key) {
        case "ArrowLeft":
          e.preventDefault();
          goToPrevSlide();
          break;
        case "ArrowRight":
          e.preventDefault();
          goToNextSlide();
          break;
        case "Home":
          e.preventDefault();
          goToSlide(0, currentSlide > 0 ? -1 : 0);
          break;
        case "End":
          e.preventDefault();
          goToSlide(slides.length - 1, currentSlide < slides.length - 1 ? 1 : 0);
          break;
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentSlide]);

  const goToSlide = (index: number, dir: number) => {
    setDirection(dir);
    setCurrentSlide(index);
  };

  const goToNextSlide = () => {
    const newIndex = (currentSlide + 1) % slides.length;
    goToSlide(newIndex, 1);
  };

  const goToPrevSlide = () => {
    const newIndex = (currentSlide - 1 + slides.length) % slides.length;
    goToSlide(newIndex, -1);
  };

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? "100%" : "-100%",
      opacity: 1,
    }),
    center: { x: 0, opacity: 1 },
    exit: (direction: number) => ({
      x: direction < 0 ? "100%" : "-100%",
      opacity: 1,
    }),
  };

  const fadeVariants = {
    enter: { opacity: 0 },
    center: { opacity: 1 },
    exit: { opacity: 0 },
  };

  const variants = prefersReducedMotion ? fadeVariants : slideVariants;

  return (
    <div
      ref={carouselRef}
      className={`relative w-full ${styles}`}
      data-class-change
      aria-roledescription="carousel"
      aria-label="Carousel"
      onFocus={() => setIsFocused(true)}
      onBlur={() => setIsFocused(false)}
    >
      <div className="relative w-full overflow-hidden bg-white" style={{ height: "500px" }}>
        <AnimatePresence initial={false} custom={direction} mode="sync">
          <m.div
            key={currentSlide}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: "spring", stiffness: 100, damping: 20, duration: 0.8 },
              opacity: { duration: 0.5 },
            }}
            className="absolute left-0 top-0 h-full w-full"
          >
            <div
              ref={(el) => { slideRefs.current[currentSlide] = el; }}
              className="relative h-full w-full"
              aria-roledescription="slide"
              aria-label={`Slide ${currentSlide + 1} of ${slides.length}: ${slides[currentSlide].title}`}
              tabIndex={0}
              role="group"
            >
              <div className="absolute inset-0 h-full w-full">
                {slides[currentSlide].slideImage && (
                  <img
                    src={slides[currentSlide].slideImage}
                    alt={slides[currentSlide].slideImageAlt}
                    className="h-full w-full object-cover"
                    loading="lazy"
                  />
                )}
              </div>

              <div className="absolute inset-0 bg-gradient-to-r from-black/10 to-black/40" aria-hidden="true" />

              <div className="absolute inset-y-0 right-0 flex w-full items-center justify-end md:w-1/2 lg:w-2/5">
                <m.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3, duration: 0.7 }}
                  className="p-8 md:p-10"
                >
                  <h2 className="mb-4 text-3xl font-bold">{slides[currentSlide].title}</h2>
                  <p className="mb-6">{slides[currentSlide].bodyText}</p>
                  {slides[currentSlide].callToAction && (
                    <Button size="lg" className="bold py-3 text-lg" asChild>
                      <a
                        href={slides[currentSlide].callToAction!.href}
                        target={slides[currentSlide].callToAction!.target || undefined}
                        className="inline-flex items-center py-2 text-lg"
                      >
                        {slides[currentSlide].callToAction!.text}
                      </a>
                    </Button>
                  )}
                </m.div>
              </div>
            </div>
          </m.div>
        </AnimatePresence>
      </div>

      <div className="flex items-center justify-center gap-4 bg-white py-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={togglePlayPause}
          aria-label={isPlaying ? "Pause carousel" : "Play carousel"}
          className="h-8 w-8 rounded-full bg-gray-100 text-gray-700 hover:bg-gray-200"
        >
          {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
        </Button>

        <Button
          variant="ghost"
          size="icon"
          onClick={goToPrevSlide}
          aria-label="Previous slide"
          className="h-8 w-8 rounded-full bg-gray-100 text-gray-700 hover:bg-gray-200"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>

        <div className="flex gap-2" role="tablist" aria-label="Slide selection">
          {slides.map((_, index) => (
            <button
              key={`indicator-${index}`}
              onClick={() => goToSlide(index, index > currentSlide ? 1 : -1)}
              aria-label={`Go to slide ${index + 1}`}
              aria-selected={currentSlide === index}
              role="tab"
              className={cn(
                "h-2 w-2 rounded-full transition-all",
                currentSlide === index ? "bg-gray-900" : "bg-gray-400 hover:bg-gray-600"
              )}
            />
          ))}
        </div>

        <Button
          variant="ghost"
          size="icon"
          onClick={goToNextSlide}
          aria-label="Next slide"
          className="h-8 w-8 rounded-full bg-gray-100 text-gray-700 hover:bg-gray-200"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
