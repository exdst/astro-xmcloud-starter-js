import { useEffect, useRef, useState } from "react";

interface HeroSTProps {
  variant: string;
  styles: string;
  eyebrow: string;
  title: string;
  image1Src: string;
  image1Alt: string;
  link1Href: string;
  link1Text: string;
  link2Href: string;
  link2Text: string;
}

function hasValidLink(href: string | undefined): boolean {
  return !!(href && href !== "#" && !href.startsWith("http://#"));
}

function HeroLink({
  href,
  text,
  className,
  ariaLabel,
}: {
  href: string;
  text: string;
  className: string;
  ariaLabel?: string;
}) {
  if (hasValidLink(href)) {
    return (
      <a href={href} className={className} aria-label={ariaLabel}>
        {text}
      </a>
    );
  }
  if (!text?.trim()) return null;
  return <span className={className}>{text}</span>;
}

function useContainerOffsets() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [offsets, setOffsets] = useState({ left: 0, right: 0 });

  useEffect(() => {
    const updateOffsets = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setOffsets({
          left: rect.left,
          right: document.documentElement.clientWidth - rect.right,
        });
      }
    };
    updateOffsets();
    window.addEventListener("resize", updateOffsets);
    return () => window.removeEventListener("resize", updateOffsets);
  }, []);

  return { containerRef, leftOffset: offsets.left, rightOffset: offsets.right };
}

function DefaultVariant(props: HeroSTProps) {
  const { containerRef, rightOffset } = useContainerOffsets();
  const linkAriaLabel = props.title ? `Learn more about ${props.title}` : undefined;

  return (
    <section
      className={`relative flex items-center border-8 lg:border-16 border-background ${props.styles}`}
      data-class-change
    >
      <div className="absolute inset-0 z-10">
        <img src={props.image1Src} alt={props.image1Alt} className="w-full h-full object-cover" />
      </div>
      <div className="relative lg:container w-full lg:flex mx-auto z-20" ref={containerRef}>
        <div className="flex flex-col justify-center mt-10 lg:mt-0 lg:w-2/3 lg:min-h-[50rem] px-4 py-8 lg:p-8 backdrop-blur-[20px] bg-[linear-gradient(136deg,_rgba(255,255,255,0.21)_2.61%,_rgba(255,255,255,0.42)_73.95%)]">
          <div className="lg:max-w-3xl">
            <h1 className="text-primary text-xl lg:text-3xl pb-4 uppercase">{props.eyebrow}</h1>
            <h1 className="text-4xl lg:text-7xl uppercase">{props.title}</h1>
            <div className="mt-8">
              <HeroLink href={props.link1Href} text={props.link1Text} className="btn btn-primary mr-4" ariaLabel={linkAriaLabel} />
              <HeroLink href={props.link2Href} text={props.link2Text} className="btn btn-secondary" ariaLabel={linkAriaLabel} />
            </div>
          </div>
        </div>
        <div className="lg:absolute top-0 bottom-0 left-2/3" style={{ right: `-${rightOffset - 16}px` }}>
          <img src={props.image1Src} alt={props.image1Alt} className="aspect-7/4 lg:aspect-auto w-full h-full object-cover" />
        </div>
      </div>
    </section>
  );
}

function RightVariant(props: HeroSTProps) {
  const { containerRef, leftOffset } = useContainerOffsets();
  const linkAriaLabel = props.title ? `Learn more about ${props.title}` : undefined;

  return (
    <section
      className={`relative flex items-center border-8 lg:border-16 border-background ${props.styles}`}
      data-class-change
    >
      <div className="absolute inset-0 z-10">
        <img src={props.image1Src} alt={props.image1Alt} className="w-full h-full object-cover" />
      </div>
      <div className="relative lg:container w-full lg:flex lg:flex-row-reverse mx-auto z-20" ref={containerRef}>
        <div className="flex flex-col justify-center mt-10 lg:mt-0 lg:w-2/3 lg:min-h-[50rem] px-4 py-8 lg:p-8 backdrop-blur-[20px] bg-[linear-gradient(136deg,_rgba(255,255,255,0.21)_2.61%,_rgba(255,255,255,0.42)_73.95%)]">
          <div className="lg:max-w-3xl lg:ml-auto text-right">
            <h1 className="text-primary text-xl lg:text-3xl pb-4 uppercase">{props.eyebrow}</h1>
            <h1 className="text-4xl lg:text-7xl uppercase">{props.title}</h1>
            <div className="mt-8">
              <HeroLink href={props.link1Href} text={props.link1Text} className="btn btn-primary mr-4" ariaLabel={linkAriaLabel} />
              <HeroLink href={props.link2Href} text={props.link2Text} className="btn btn-secondary" ariaLabel={linkAriaLabel} />
            </div>
          </div>
        </div>
        <div className="lg:absolute top-0 bottom-0 right-2/3" style={{ left: `-${leftOffset - 16}px` }}>
          <img src={props.image1Src} alt={props.image1Alt} className="aspect-7/4 lg:aspect-auto w-full h-full object-cover" />
        </div>
      </div>
    </section>
  );
}

function CenteredVariant(props: HeroSTProps) {
  const { containerRef, rightOffset } = useContainerOffsets();
  const linkAriaLabel = props.title ? `Learn more about ${props.title}` : undefined;

  return (
    <section
      className={`relative flex items-center border-8 lg:border-16 border-background ${props.styles}`}
      data-class-change
    >
      <div className="absolute inset-0 z-10">
        <img src={props.image1Src} alt={props.image1Alt} className="w-full h-full object-cover" />
      </div>
      <div className="relative lg:container w-full lg:flex mx-auto z-20" ref={containerRef}>
        <div className="lg:relative lg:left-1/6 flex flex-col justify-center mt-10 lg:mt-0 lg:w-2/3 lg:min-h-[50rem] px-4 py-8 lg:p-8 backdrop-blur-[20px] bg-[linear-gradient(136deg,_rgba(255,255,255,0.21)_2.61%,_rgba(255,255,255,0.42)_73.95%)]">
          <div className="lg:max-w-3xl lg:mx-auto text-center">
            <h1 className="text-primary text-xl lg:text-3xl pb-4 uppercase">{props.eyebrow}</h1>
            <h1 className="text-4xl lg:text-7xl uppercase">{props.title}</h1>
            <div className="mt-8">
              <HeroLink href={props.link1Href} text={props.link1Text} className="btn btn-primary mr-4" ariaLabel={linkAriaLabel} />
              <HeroLink href={props.link2Href} text={props.link2Text} className="btn btn-secondary" ariaLabel={linkAriaLabel} />
            </div>
          </div>
        </div>
        <div className="lg:absolute top-0 bottom-0 left-5/6" style={{ right: `-${rightOffset - 16}px` }}>
          <img src={props.image1Src} alt={props.image1Alt} className="aspect-7/4 lg:aspect-auto w-full h-full object-cover" />
        </div>
      </div>
    </section>
  );
}

function SplitScreenVariant(props: HeroSTProps) {
  const linkAriaLabel = props.title ? `Learn more about ${props.title}` : undefined;

  return (
    <section
      className={`relative bg-primary border-8 lg:border-16 border-background ${props.styles}`}
      data-class-change
    >
      <div className="flex flex-col lg:flex-row lg:min-h-[50rem]">
        <div className="p-8 lg:basis-full lg:self-center lg:p-14">
          <h1 className="text-xl lg:text-3xl pb-4 uppercase">{props.eyebrow}</h1>
          <h1 className="text-4xl lg:text-6xl uppercase">{props.title}</h1>
          <div className="mt-8">
            <HeroLink href={props.link1Href} text={props.link1Text} className="btn btn-secondary mr-4" ariaLabel={linkAriaLabel} />
            <HeroLink href={props.link2Href} text={props.link2Text} className="btn btn-secondary" ariaLabel={linkAriaLabel} />
          </div>
        </div>
        <div className="relative aspect-3/2 lg:basis-full lg:aspect-auto">
          <img src={props.image1Src} alt={props.image1Alt} className="absolute inset-0 w-full h-full object-cover" />
          <div className="relative h-full backdrop-blur-[20px] bg-[linear-gradient(136deg,_rgba(255,255,255,0.21)_2.61%,_rgba(255,255,255,0.42)_73.95%)] z-20">
            <div className="absolute inset-8 lg:inset-14">
              <img src={props.image1Src} alt={props.image1Alt} className="absolute inset-0 w-full h-full object-cover" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function StackedVariant(props: HeroSTProps) {
  const linkAriaLabel = props.title ? `Learn more about ${props.title}` : undefined;

  return (
    <section
      className={`relative flex flex-col bg-primary lg:flex-row lg:items-center lg:min-h-[50rem] lg:bg-transparent ${props.styles}`}
      data-class-change
    >
      <div className="container px-4 mx-auto">
        <div className="relative lg:w-1/2 px-6 py-12 bg-primary z-20">
          <h1 className="text-xl lg:text-3xl pb-4 uppercase">{props.eyebrow}</h1>
          <h1 className="text-4xl lg:text-6xl uppercase">{props.title}</h1>
          <div className="mt-8">
            <HeroLink href={props.link1Href} text={props.link1Text} className="btn btn-secondary mr-4" ariaLabel={linkAriaLabel} />
            <HeroLink href={props.link2Href} text={props.link2Text} className="btn btn-secondary" ariaLabel={linkAriaLabel} />
          </div>
        </div>
      </div>
      <div className="relative aspect-3/2 lg:absolute lg:aspect-auto inset-0 flex z-10">
        <div className="relative w-1/3">
          <img src={props.image1Src} alt={props.image1Alt} className="absolute w-full h-full inset-0 object-cover" />
        </div>
        <div className="relative w-2/3">
          <img src={props.image1Src} alt={props.image1Alt} className="absolute w-full h-full inset-0 object-cover z-10" />
          <div className="absolute inset-0 backdrop-blur-[20px] bg-[linear-gradient(136deg,_rgba(255,255,255,0.21)_2.61%,_rgba(255,255,255,0.42)_73.95%)] z-20">
            <img src={props.image1Src} alt={props.image1Alt} className="absolute w-[calc(100%-5rem)] h-full left-20 top-0 right-0 bottom-0 object-cover" />
          </div>
        </div>
      </div>
    </section>
  );
}

const variants: Record<string, React.FC<HeroSTProps>> = {
  Default: DefaultVariant,
  Right: RightVariant,
  Centered: CenteredVariant,
  SplitScreen: SplitScreenVariant,
  Stacked: StackedVariant,
};

export function HeroSTIsland(props: HeroSTProps) {
  const Component = variants[props.variant] || DefaultVariant;
  return <Component {...props} />;
}
