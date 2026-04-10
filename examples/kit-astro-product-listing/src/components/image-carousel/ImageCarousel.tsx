import { useState, useRef, useEffect, useId } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import { cn } from "@/lib/utils";
import { m } from "framer-motion";

// Shared types
export interface ImageCarouselSlide {
  image: string;
  imageAlt: string;
  imageWidth?: number;
  imageHeight?: number;
  backgroundText: string;
  linkHref: string;
  linkText: string;
}

export interface ImageCarouselIslandProps {
  variant: string;
  title: string;
  slides: ImageCarouselSlide[];
  styles?: string;
}

function useMatchMedia(query: string): boolean {
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

// --- Default variant ---
function ImageCarouselDefault({ title, slides, styles = "" }: Omit<ImageCarouselIslandProps, "variant">) {
  const containerClasses =
    "@container group bg-primary text-primary-foreground relative flex w-full flex-col items-center justify-center py-[99px]";
  const titleClasses =
    "font-heading @md:text-7xl mx-auto max-w-[760px] text-pretty px-4 text-5xl text-box-trim-bottom-baseline";
  const carouselContentClasses = "-ml-[100px] h-full items-stretch";
  const carouselItemClasses =
    "@md:basis-4/5 @lg:basis-2/3 pointer-events-none flex h-full basis-full flex-col justify-stretch pl-[100px] @md:max-w-1/2 mx-auto";
  const slideContentClasses = "@md:px-25 h-full w-full transform-gpu px-6 transition-all ease-in-out";
  const backgroundTextWrapperClasses =
    "flex h-full w-full items-center justify-center transition-all duration-700 ease-in-out";
  const backgroundTextClasses =
    "bg-primary-gradient text-fill-transparent text-[100px] @md:text-40-clamp bg-clip-text font-bold leading-none text-transparent";
  const mainImageClasses = "relative z-0 h-auto w-full max-w-[860px] mx-auto";
  const controlsWrapperClasses = "mt-8 flex items-center gap-4";

  const [currentIndex, setCurrentIndex] = useState(0);
  const [api, setApi] = useState<any>(null);
  const slideshowId = useId();
  const isReducedMotion = useMatchMedia("(prefers-reduced-motion: reduce)");
  const liveRegionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (liveRegionRef.current && api && slides.length > 0) {
      liveRegionRef.current.textContent = `Showing slide ${currentIndex + 1} of ${slides.length}: ${slides[currentIndex].backgroundText}.`;
    }
  }, [currentIndex, slides, api]);

  useEffect(() => {
    if (!api) return;
    api.on("select", () => setCurrentIndex(api.selectedScrollSnap()));
    setCurrentIndex(api.selectedScrollSnap());
  }, [api]);

  const hasPagesPositionStyles = styles ? styles.includes("position-") : false;

  return (
    <div
      className={cn(containerClasses, {
        "position-center": !hasPagesPositionStyles,
        [styles]: styles,
      })}
      data-component="ImageCarouselDefault"
    >
      <div className="w-full space-y-4 px-4 group-[.position-center]:text-center group-[.position-right]:text-right">
        <h2 className={titleClasses}>{title}</h2>
      </div>

      <div ref={liveRegionRef} className="sr-only" aria-live="polite" aria-atomic="true" />

      <div className="w-full" data-component-part="carousel wrapper">
        <Carousel
          setApi={setApi}
          opts={{ align: "center", loop: true, skipSnaps: false, containScroll: "trimSnaps" }}
          className="w-full overflow-visible"
          aria-labelledby={`${slideshowId}-title`}
        >
          <div id={`${slideshowId}-title`} className="sr-only">
            Slideshow, {currentIndex + 1} of {slides.length}
          </div>
          <CarouselContent className={carouselContentClasses}>
            {slides.map((slide, index) => (
              <CarouselItem
                key={index}
                className={carouselItemClasses}
                role="group"
                aria-roledescription="slide"
                aria-label={`${slide.backgroundText || ""}, ${index === currentIndex ? "current slide" : ""}`}
                tabIndex={index === currentIndex ? 0 : -1}
              >
                <div className={`${slideContentClasses} ${index === currentIndex ? "scale-100" : "scale-95"}`}>
                  {slide.backgroundText && (
                    <div
                      className={backgroundTextWrapperClasses}
                      style={{
                        opacity: index === currentIndex ? 1 : 0,
                        filter: index === currentIndex ? "blur(0px)" : "blur(10px)",
                        transform: index === currentIndex ? "scale(1)" : "scale(0.3)",
                        transitionDelay: "200ms",
                      }}
                    >
                      <p className={backgroundTextClasses}>{slide.backgroundText}</p>
                    </div>
                  )}
                </div>
                {slide.image && (
                  <img
                    src={slide.image}
                    alt={slide.imageAlt}
                    width={slide.imageWidth}
                    height={slide.imageHeight}
                    style={{ width: '100%', height: 'auto' }}
                    className={mainImageClasses}
                    loading="lazy"
                  />
                )}
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </div>

      <div className={controlsWrapperClasses} role="group" aria-label="Slideshow controls">
        <Button variant="secondary" size="icon" onClick={() => api?.scrollPrev()} aria-label="Previous slide">
          <ChevronLeft className="h-6 w-6" />
        </Button>
        {slides[currentIndex]?.linkHref && (
          <Button variant="secondary" asChild>
            <a href={slides[currentIndex].linkHref}>{slides[currentIndex].linkText}</a>
          </Button>
        )}
        <Button variant="secondary" size="icon" onClick={() => api?.scrollNext()} aria-label="Next slide">
          <ChevronRight className="h-6 w-6" />
        </Button>
      </div>
      <div className="sr-only">Use left and right arrow keys to navigate between slides.</div>
    </div>
  );
}

// --- FullBleed variant ---
function ImageCarouselFullBleed({ title, slides, styles = "" }: Omit<ImageCarouselIslandProps, "variant">) {
  const containerClasses = "@container group bg-primary grid w-full grid-cols-1 gap-9";
  const [currentIndex, setCurrentIndex] = useState(0);
  const [api, setApi] = useState<any>(null);
  const slideshowId = useId();
  const isReducedMotion = useMatchMedia("(prefers-reduced-motion: reduce)");
  const liveRegionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (liveRegionRef.current && api && slides.length > 0) {
      liveRegionRef.current.textContent = `Showing slide ${currentIndex + 1} of ${slides.length}`;
    }
  }, [currentIndex, slides, api]);

  useEffect(() => {
    if (!api) return;
    api.on("select", () => setCurrentIndex(api.selectedScrollSnap()));
    setCurrentIndex(api.selectedScrollSnap());
  }, [api]);

  const hasPagesPositionStyles = styles ? styles.includes("position-") : false;

  return (
    <div
      className={cn(containerClasses, { "position-left": !hasPagesPositionStyles, [styles]: styles })}
      data-class-change
      data-component="ImageCarouselFullBleed"
    >
      <div className="mx-auto w-full max-w-screen-2xl px-4">
        <div className="@md:flex-row flex w-full flex-col items-end justify-between">
          <h2 className="font-heading text-pretty px-4 font-light leading-none tracking-normal antialiased">{title}</h2>
          <div className="@md:mt-0 mt-8 flex items-center justify-center">
            {slides[currentIndex]?.linkHref && (
              <Button variant="secondary" asChild className="mb-6">
                <a href={slides[currentIndex].linkHref}>{slides[currentIndex].linkText}</a>
              </Button>
            )}
          </div>
        </div>
      </div>

      <div ref={liveRegionRef} className="sr-only" aria-live="polite" aria-atomic="true" />

      <div className="relative w-full">
        <Carousel
          setApi={setApi}
          opts={{ align: "center", loop: true, skipSnaps: false, containScroll: false }}
          className="w-full overflow-visible"
          aria-labelledby={`${slideshowId}-title`}
        >
          <div id={`${slideshowId}-title`} className="sr-only">
            Slideshow, {currentIndex + 1} of {slides.length}
          </div>
          <CarouselContent className="!ml-0 h-full items-stretch">
            {slides.map((slide, index) => (
              <CarouselItem key={index} className="pointer-events-none max-w-screen-2xl p-0 pl-0" role="group" aria-roledescription="slide" tabIndex={index === currentIndex ? 0 : -1}>
                <div className="relative flex justify-center">
                  <div className="w-full">
                    {slide.image && <img src={slide.image} alt={slide.imageAlt} className="relative z-0 h-auto w-full object-cover" loading="lazy" />}
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
        <div className="absolute left-0 top-1/2 flex w-full">
          <div className="relative mx-auto w-full max-w-screen-2xl">
            <Button variant="default" size="icon" onClick={() => api?.scrollPrev()} aria-label="Previous slide" className="border-1 border-primary-foreground absolute top-1/2 z-20 -translate-y-1/2 left-4 -ms-4">
              <ChevronLeft className="h-6 w-6" />
            </Button>
            <Button variant="default" size="icon" onClick={() => api?.scrollNext()} aria-label="Next slide" className="border-1 border-primary-foreground absolute top-1/2 z-20 -translate-y-1/2 right-4 -me-4">
              <ChevronRight className="h-6 w-6" />
            </Button>
          </div>
        </div>
      </div>
      <div className="sr-only">Use left and right arrow keys to navigate between slides.</div>
    </div>
  );
}

// --- LeftRightPreview variant ---
function ImageCarouselLeftRightPreview({ title, slides, styles = "" }: Omit<ImageCarouselIslandProps, "variant">) {
  const containerClasses = "@container bg-background text-foreground group relative flex w-full flex-col items-center justify-center py-[99px]";
  const [currentIndex, setCurrentIndex] = useState(0);
  const [api, setApi] = useState<any>(null);
  const slideshowId = useId();
  const liveRegionRef = useRef<HTMLDivElement>(null);

  const slidesLength = slides.length;
  const prevIndex = currentIndex === 0 ? slidesLength - 1 : currentIndex - 1;
  const nextIndex = currentIndex === slidesLength - 1 ? 0 : currentIndex + 1;

  useEffect(() => {
    if (liveRegionRef.current && api && slides.length > 0) {
      liveRegionRef.current.textContent = `Showing slide ${currentIndex + 1} of ${slides.length}`;
    }
  }, [currentIndex, slides, api]);

  useEffect(() => {
    if (!api) return;
    api.on("select", () => setCurrentIndex(api.selectedScrollSnap()));
    setCurrentIndex(api.selectedScrollSnap());
  }, [api]);

  const hasPagesPositionStyles = styles ? styles.includes("position-") : false;

  return (
    <div
      className={cn(containerClasses, { "position-center": !hasPagesPositionStyles, [styles]: styles })}
      role="region"
      data-component="ImageCarouselLeftRightPreview"
    >
      <div className="mb-16 w-full space-y-4 px-4">
        <h2 className="font-heading @md:text-7xl mx-auto max-w-[760px] text-pretty px-4 text-5xl font-light leading-none tracking-normal antialiased group-[.position-left]:text-left group-[.position-center]:text-center group-[.position-right]:text-right">
          {title}
        </h2>
      </div>

      <div ref={liveRegionRef} className="sr-only" aria-live="polite" aria-atomic="true" />

      <div className="relative mx-auto w-full max-w-screen-xl px-4">
        <button className="absolute top-1/2 z-10 hidden w-1/6 -translate-y-1/2 transform opacity-70 transition-opacity hover:opacity-100 md:block left-0" onClick={() => api?.scrollPrev()} aria-label="Previous slide">
          {slides[prevIndex]?.image && <img src={slides[prevIndex].image} alt={slides[prevIndex].imageAlt} className="relative h-auto w-full cursor-pointer" loading="lazy" />}
        </button>

        <Carousel
          setApi={setApi}
          opts={{ align: "center", loop: true, skipSnaps: false, containScroll: "trimSnaps" }}
          className="w-full overflow-visible"
          aria-labelledby={`${slideshowId}-title`}
        >
          <div id={`${slideshowId}-title`} className="sr-only">{currentIndex + 1} of {slides.length}</div>
          <CarouselContent className="h-full items-stretch">
            {slides.map((slide, index) => (
              <CarouselItem key={index} className="pointer-events-none flex h-full basis-full flex-col justify-stretch md:basis-2/3" role="group" aria-roledescription="slide" tabIndex={index === currentIndex ? 0 : -1} style={{ opacity: index === currentIndex ? 1 : 0 }}>
                <div className="relative">
                  {slide.image && <img src={slide.image} alt={slide.imageAlt} className="relative z-0 h-auto w-full" loading="lazy" />}
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>

        <button className="absolute top-1/2 z-10 hidden w-1/6 -translate-y-1/2 transform opacity-70 transition-opacity hover:opacity-100 md:block right-0" onClick={() => api?.scrollNext()} aria-label="Next slide">
          {slides[nextIndex]?.image && <img src={slides[nextIndex].image} alt={slides[nextIndex].imageAlt} className="relative h-auto w-full cursor-pointer" loading="lazy" />}
        </button>
      </div>

      <div className="mt-8 flex items-center gap-4" role="group" aria-label="Slideshow controls">
        <Button variant="default" size="icon" onClick={() => api?.scrollPrev()} aria-label="Previous slide">
          <ChevronLeft className="h-6 w-6" />
        </Button>
        {slides[currentIndex]?.linkHref && (
          <Button variant="default" asChild>
            <a href={slides[currentIndex].linkHref}>{slides[currentIndex].linkText}</a>
          </Button>
        )}
        <Button variant="default" size="icon" onClick={() => api?.scrollNext()} aria-label="Next slide">
          <ChevronRight className="h-6 w-6" />
        </Button>
      </div>
      <div className="sr-only">Use left and right arrow keys to navigate between slides.</div>
    </div>
  );
}

// --- FeaturedImageLeft variant ---
function ImageCarouselFeaturedImageLeft({ title, slides, styles = "" }: Omit<ImageCarouselIslandProps, "variant">) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [slideOrder, setSlideOrder] = useState<number[]>([]);
  const [nextSlideIndex, setNextSlideIndex] = useState<number | null>(null);
  const liveRegionRef = useRef<HTMLDivElement>(null);
  const isReducedMotion = useMatchMedia("(prefers-reduced-motion: reduce)");

  useEffect(() => {
    if (slides.length > 0) {
      setSlideOrder(Array.from({ length: slides.length }, (_, i) => i));
    }
  }, [slides]);

  useEffect(() => {
    if (liveRegionRef.current && slides.length > 0) {
      liveRegionRef.current.textContent = `Showing slide ${activeIndex + 1} of ${slides.length}`;
    }
  }, [activeIndex, slides]);

  const handleNext = () => {
    if (isAnimating || slides.length <= 1) return;
    setIsAnimating(true);
    setNextSlideIndex(1);
    setActiveIndex((prev) => (prev + 1) % slides.length);
    setTimeout(() => {
      setSlideOrder((prev) => {
        const newOrder = [...prev];
        const first = newOrder.shift() as number;
        newOrder.push(first);
        return newOrder;
      });
      setNextSlideIndex(null);
      setIsAnimating(false);
    }, isReducedMotion ? 0 : 600);
  };

  const hasPagesPositionStyles = styles ? styles.includes("position-") : false;

  return (
    <div
      className={cn(
        "@container bg-background text-foreground group relative flex w-full flex-col items-center justify-center overflow-hidden py-[60px]",
        { "position-left": !hasPagesPositionStyles, [styles]: styles }
      )}
      role="region"
      aria-roledescription="carousel"
      data-component="ImageCarouselFeaturedImageLeft"
    >
      <div ref={liveRegionRef} className="sr-only" aria-live="polite" aria-atomic="true" />
      <div className="mx-auto w-full max-w-screen-2xl">
        <div className="@md:flex-row @md:justify-between flex w-full flex-col items-end justify-start">
          <h2 className="font-heading @md:text-7xl max-w-[760px] text-pretty text-5xl font-light leading-none tracking-normal antialiased">
            {title}
          </h2>
          <div className="@md:mt-0 @md:justify-center mt-8 flex w-full items-center justify-start @md:w-auto">
            {slideOrder.length > 0 && slides[slideOrder[nextSlideIndex === 1 ? 1 : 0]]?.linkHref && (
              <Button variant="default" asChild className="mb-6">
                <a href={slides[slideOrder[nextSlideIndex === 1 ? 1 : 0]].linkHref}>
                  {slides[slideOrder[nextSlideIndex === 1 ? 1 : 0]].linkText}
                </a>
              </Button>
            )}
          </div>
        </div>
      </div>

      <div className="h-full w-full py-6">
        <div className="mx-auto w-full max-w-screen-2xl">
          <div className="mb-6 flex overflow-visible h-[532px] items-end">
            <div data-component="slide deck" className="relative flex h-full w-full items-end overflow-visible">
              {slideOrder.length > 0 && (
                <div className="absolute inset-0 flex">
                  {slideOrder.map((slideIndex, position) => {
                    const isActive = position === 0;
                    const isNext = nextSlideIndex !== null && position === nextSlideIndex;
                    const zIndex = isNext ? 20 : isActive ? 10 : 5 - position;
                    const width = isActive || isNext ? 941 : 333;
                    const height = isActive || isNext ? 526 : 186;
                    const leftPosition = isActive ? 0 : 941 + (position - 1) * 333;
                    const topPosition = isActive ? 0 : 526 - 186;

                    return (
                      <m.div
                        key={`slide-${slideIndex}`}
                        className="absolute flex-shrink-0"
                        style={{ zIndex }}
                        initial={false}
                        animate={{ width, height, left: leftPosition, top: topPosition, scale: 1 }}
                        transition={{ duration: isReducedMotion ? 0 : isAnimating ? 0.6 : 0, ease: "easeInOut" }}
                        role="group"
                        aria-roledescription="slide"
                        aria-label={`${isActive || isNext ? "Current slide" : "Slide"} ${slideIndex + 1} of ${slides.length}`}
                      >
                        <div className="relative overflow-hidden shadow-lg h-full w-full">
                          {slides[slideIndex].image && (
                            <img src={slides[slideIndex].image} alt={slides[slideIndex].imageAlt} className="object-cover h-full w-full" loading="lazy" />
                          )}
                        </div>
                      </m.div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
          <div className="@md:mt-8 mt-4 flex justify-center">
            <Button onClick={handleNext} variant="outline" disabled={isAnimating || slides.length <= 1}>
              Next Image
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

// --- PreviewBelow variant ---
function ImageCarouselPreviewBelow({ title, slides, styles = "" }: Omit<ImageCarouselIslandProps, "variant">) {
  const containerClasses = "@container bg-background text-foreground group relative flex w-full flex-col items-center justify-center py-[99px]";
  const [currentIndex, setCurrentIndex] = useState(0);
  const [mainApi, setMainApi] = useState<any>(null);
  const [thumbApi, setThumbApi] = useState<any>(null);
  const slideshowId = useId();
  const liveRegionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (liveRegionRef.current && mainApi && slides.length > 0) {
      liveRegionRef.current.textContent = `Showing slide ${currentIndex + 1} of ${slides.length}`;
    }
  }, [currentIndex, slides, mainApi]);

  useEffect(() => {
    if (!mainApi) return;
    mainApi.on("select", () => {
      const index = mainApi.selectedScrollSnap();
      setCurrentIndex(index);
      if (thumbApi) thumbApi.scrollTo(index);
    });
    setCurrentIndex(mainApi.selectedScrollSnap());
  }, [mainApi, thumbApi]);

  const handleThumbnailClick = (index: number) => {
    if (mainApi) mainApi.scrollTo(index);
  };

  const hasPagesPositionStyles = styles ? styles.includes("position-") : false;

  return (
    <div className={cn(containerClasses, { "position-center": !hasPagesPositionStyles, [styles]: styles })} role="region" data-component="ImageCarouselPreviewBelow">
      <div className="mb-4 w-full space-y-4 px-4">
        <h2 className="font-heading @md:text-7xl mx-auto max-w-[760px] text-pretty px-4 text-5xl font-light leading-none tracking-normal antialiased group-[.position-left]:text-left group-[.position-center]:text-center group-[.position-right]:text-right">
          {title}
        </h2>
      </div>
      <div className="mb-12 flex justify-center">
        {slides[currentIndex]?.linkHref && (
          <Button variant="default" asChild>
            <a href={slides[currentIndex].linkHref}>{slides[currentIndex].linkText}</a>
          </Button>
        )}
      </div>

      <div ref={liveRegionRef} className="sr-only" aria-live="polite" aria-atomic="true" />

      <div className="relative mx-auto w-full max-w-screen-xl px-4">
        <Carousel
          setApi={setMainApi}
          opts={{ align: "center", loop: true, skipSnaps: false, containScroll: "trimSnaps" }}
          className="w-full overflow-visible"
          aria-labelledby={`${slideshowId}-title`}
        >
          <div id={`${slideshowId}-title`} className="sr-only">{currentIndex + 1} of {slides.length}</div>
          <CarouselContent className="h-full items-stretch">
            {slides.map((slide, index) => (
              <CarouselItem key={index} className="pointer-events-none flex h-full basis-full flex-col justify-stretch" role="group" aria-roledescription="slide" tabIndex={index === currentIndex ? 0 : -1} style={{ opacity: index === currentIndex ? 1 : 0 }}>
                <div className="relative">
                  {slide.image && <img src={slide.image} alt={slide.imageAlt} className="relative z-0 h-auto w-full" loading="lazy" />}
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </div>

      <div className="px-4 mt-4 @md:mt-0 @md:px-0 flex items-center justify-center gap-2 @md:gap-4 max-w-screen-xl mx-auto @md:-translate-y-1/2">
        <Button variant="default" size="icon" onClick={() => { mainApi?.scrollPrev(); thumbApi?.scrollPrev(); }} aria-label="Previous slide">
          <ChevronLeft className="h-6 w-6" />
        </Button>
        <Carousel
          setApi={setThumbApi}
          opts={{ align: "start", loop: true, dragFree: true, slidesToScroll: 1 }}
          className="w-full max-w-[390px]"
        >
          <CarouselContent className="-ml-2">
            {slides.map((slide, index) => (
              <CarouselItem key={index} className="basis-1/2 pl-2">
                <button onClick={() => handleThumbnailClick(index)} tabIndex={0} aria-label={`Go to slide ${index + 1}`} aria-current={index === currentIndex ? "true" : "false"}>
                  {slide.image && <img src={slide.image} alt={slide.imageAlt} className="h-auto w-full transition-all border-2 border-transparent" loading="lazy" />}
                </button>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
        <Button variant="default" size="icon" onClick={() => { mainApi?.scrollNext(); thumbApi?.scrollNext(); }} aria-label="Next slide">
          <ChevronRight className="h-6 w-6" />
        </Button>
      </div>
      <div className="sr-only">Use left and right arrow keys to navigate between slides.</div>
    </div>
  );
}

// --- Thumbnails variant ---
function ImageCarouselThumbnails({ title, slides, styles = "" }: Omit<ImageCarouselIslandProps, "variant">) {
  const containerClasses = "@container bg-primary text-primary-foreground group relative flex w-full flex-col items-center justify-center py-16";
  const [currentIndex, setCurrentIndex] = useState(0);
  const [api, setApi] = useState<any>(null);
  const [thumbnailApi, setThumbnailApi] = useState<any>(null);
  const slideshowId = useId();
  const liveRegionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (liveRegionRef.current && api && slides.length > 0) {
      liveRegionRef.current.textContent = `Showing slide ${currentIndex + 1} of ${slides.length}: ${slides[currentIndex].backgroundText}.`;
    }
  }, [currentIndex, slides, api]);

  useEffect(() => {
    if (!api) return;
    api.on("select", () => {
      const index = api.selectedScrollSnap();
      setCurrentIndex(index);
      if (thumbnailApi) thumbnailApi.scrollTo(index);
    });
    setCurrentIndex(api.selectedScrollSnap());
  }, [api, thumbnailApi]);

  const handleThumbnailClick = (index: number) => {
    if (api) api.scrollTo(index);
  };

  return (
    <div className={containerClasses} role="region" aria-roledescription="carousel" data-component="ImageCarouselThumbnails">
      <div className="mb-12 w-full space-y-4 px-4 group-[.position-center]:text-center group-[.position-right]:text-right">
        <h2 className="font-heading @md:text-6xl mx-auto max-w-[760px] text-pretty px-4 text-4xl font-light leading-none tracking-normal antialiased">{title}</h2>
      </div>

      <div ref={liveRegionRef} className="sr-only" aria-live="polite" aria-atomic="true" />

      <div className="w-full max-w-screen-xl mx-auto px-4">
        <div className="relative">
          <Carousel
            setApi={setApi}
            opts={{ align: "center", loop: true, skipSnaps: false, containScroll: "trimSnaps" }}
            className="mb-4 w-full"
            aria-labelledby={`${slideshowId}-title`}
          >
            <div id={`${slideshowId}-title`} className="sr-only">Slideshow, {currentIndex + 1} of {slides.length}</div>
            <CarouselContent className="h-full items-stretch">
              {slides.map((slide, index) => (
                <CarouselItem key={index} className="pointer-events-none flex h-full basis-full flex-col justify-stretch" role="group" aria-roledescription="slide" tabIndex={index === currentIndex ? 0 : -1}>
                  <div className="relative">
                    {slide.image && <img src={slide.image} alt={slide.imageAlt} className="relative z-0 h-auto w-full rounded-lg overflow-hidden" loading="lazy" />}
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6" style={{ opacity: index === currentIndex ? 1 : 0 }}>
                      <p className="text-foreground text-4xl font-bold leading-none md:text-5xl">{slide.backgroundText}</p>
                    </div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <Button variant="secondary" size="icon" onClick={() => api?.scrollPrev()} aria-label="Previous slide" className="absolute top-1/2 transform -translate-y-1/2 z-10 left-4">
              <ChevronLeft className="h-6 w-6" />
            </Button>
            <Button variant="secondary" size="icon" onClick={() => api?.scrollNext()} aria-label="Next slide" className="absolute top-1/2 transform -translate-y-1/2 z-10 right-4">
              <ChevronRight className="h-6 w-6" />
            </Button>
          </Carousel>

          <Carousel
            setApi={setThumbnailApi}
            opts={{ align: "start", loop: true, dragFree: true, containScroll: "trimSnaps" }}
            className="w-full"
          >
            <CarouselContent className="-ml-2 md:-ml-4">
              {slides.map((slide, index) => (
                <CarouselItem key={index} className="basis-1/3 cursor-pointer pl-2 md:basis-1/5 md:pl-4" onClick={() => handleThumbnailClick(index)}>
                  <div className={`rounded-default transition-all ${index === currentIndex ? "border-primary-foreground scale-105" : "border-transparent opacity-60"}`}>
                    {slide.image && <img src={slide.image} alt={slide.imageAlt} className="h-auto w-full aspect-video object-contain" loading="lazy" />}
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
        </div>
      </div>

      <div className="mt-8 flex items-center justify-center">
        {slides[currentIndex]?.linkHref && (
          <Button variant="secondary" asChild>
            <a href={slides[currentIndex].linkHref}>{slides[currentIndex].linkText}</a>
          </Button>
        )}
      </div>
      <div className="sr-only">Use left and right arrow keys to navigate between slides.</div>
    </div>
  );
}

// --- EditMode variant (simple stacked list) ---
function ImageCarouselEditMode({ title, slides }: Omit<ImageCarouselIslandProps, "variant">) {
  return (
    <div className="@container bg-primary group text-primary-foreground relative flex w-full flex-col items-center justify-center py-[99px]" data-component="ImageCarouselEditMode">
      <div className="mb-8 w-full space-y-4 text-center">
        <h2 className="font-heading @md:text-5xl mx-auto max-w-[760px] text-pretty text-3xl font-light leading-none tracking-normal antialiased">{title}</h2>
      </div>
      <div className="mx-auto max-w-screen-xl space-y-6">
        <h3 className="border-primary-foreground/20 border-b pb-2 text-xl font-medium">Carousel Items:</h3>
        {slides.map((slide, index) => (
          <div key={index} className="overflow-hidden border-0 bg-transparent">
            <div className="flex flex-col items-stretch gap-4 p-4 md:flex-row">
              <div className="flex-shrink-0 md:w-1/3">
                {slide.image && <img src={slide.image} alt={slide.imageAlt} className="relative z-0 h-auto w-full overflow-hidden rounded-md" loading="lazy" />}
              </div>
              <div className="flex flex-col items-center justify-center md:w-1/3">
                <p className="bg-light-gradient text-fill-transparent bg-clip-text text-9xl font-bold leading-none text-transparent">{slide.backgroundText}</p>
              </div>
              <div className="flex flex-col items-center justify-center md:w-1/3">
                {slide.linkHref && (
                  <a href={slide.linkHref} className="inline-flex items-center justify-center rounded-md border px-4 py-2">{slide.linkText}</a>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// --- Main dispatcher ---
export function ImageCarouselIsland(props: ImageCarouselIslandProps) {
  const { variant, ...rest } = props;
  switch (variant) {
    case "FullBleed":
      return <ImageCarouselFullBleed {...rest} />;
    case "LeftRightPreview":
      return <ImageCarouselLeftRightPreview {...rest} />;
    case "FeaturedImageLeft":
      return <ImageCarouselFeaturedImageLeft {...rest} />;
    case "PreviewBelow":
      return <ImageCarouselPreviewBelow {...rest} />;
    case "Thumbnails":
      return <ImageCarouselThumbnails {...rest} />;
    case "EditMode":
      return <ImageCarouselEditMode {...rest} />;
    case "Default":
    default:
      return <ImageCarouselDefault {...rest} />;
  }
}
