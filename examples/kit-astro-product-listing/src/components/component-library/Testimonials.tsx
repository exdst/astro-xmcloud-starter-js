'use client';

import { type JSX } from 'react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface SI { src: string; alt: string; }
interface SL { href: string; text: string; target: string; }

interface TData {
  id: string; caseStudyLink: SL; customerName: string; customerCompany: string;
  customerIcon: SI; testimonialBody: string; testimonialIcon: SI; testimonialRating: string;
}

interface Props {
  variant: string; styles: string; sectionData: { title: string; tagLine: string };
  testimonials: TData[]; isEditing: boolean;
}

const Img = ({ img, className }: { img: SI; className?: string }) =>
  img.src ? <img src={img.src} alt={img.alt} className={className} loading="lazy" /> : null;

const StarRating = ({ rating: r, isEditing }: { rating: string; isEditing: boolean }) => {
  const n = Math.min(Number(r) || 0, 5);
  return (
    <div className="flex gap-1 mb-6">
      {Array.from({ length: n }, (_, i) => <span key={`f${i}`} className="text-yellow-500">&#9733;</span>)}
      {Array.from({ length: 5 - n }, (_, i) => <span key={`e${i}`} className="text-gray-300">&#9734;</span>)}
      {isEditing && <span className="ml-2 text-sm">{r}</span>}
    </div>
  );
};

type CT = 'simple' | 'centered' | 'boxed' | 'large';

const TCard = ({ t, type, withRating, withLogo, className = '', isEditing }: {
  t: TData; type: CT; withRating?: boolean; withLogo?: boolean; className?: string; isEditing: boolean;
}) => {
  const header = withRating ? <StarRating rating={t.testimonialRating} isEditing={isEditing} />
    : withLogo ? <div className="h-12 mb-12"><Img img={t.testimonialIcon} className="h-full w-auto object-contain" /></div> : null;

  const author = (
    <>
      {type !== 'large' && <div className="shrink-0 w-12 h-12 rounded-full overflow-hidden"><Img img={t.customerIcon} className="w-full h-full object-cover" /></div>}
      <div><div className="font-semibold">{t.customerName}</div><div>{t.customerCompany}</div></div>
    </>
  );

  const authorCard = withRating && withLogo ? (
    <div className="flex mt-auto gap-4"><div className="flex items-center gap-4">{author}</div><div className="h-12 border-s ps-4"><Img img={t.testimonialIcon} className="h-full w-auto object-contain" /></div></div>
  ) : (
    <div className={`flex gap-4 mt-auto ${type === 'centered' ? 'flex-col items-center text-center' : ''}`}>{author}</div>
  );

  const caseLink = t.caseStudyLink.href ? (
    <a href={t.caseStudyLink.href} className={`inline-flex items-center text-sm font-medium underline-offset-4 hover:underline mt-6 ${type === 'centered' ? '' : 'self-start px-0'}`}>
      {t.caseStudyLink.text} &rarr;
    </a>
  ) : null;

  switch (type) {
    case 'boxed':
      return (<div className={`flex flex-col border p-8 ${className}`}>{header}<blockquote className="text-lg mb-6" dangerouslySetInnerHTML={{ __html: t.testimonialBody }} />{authorCard}{caseLink}</div>);
    case 'centered':
      return (<div className={`flex flex-col items-center max-w-3xl mx-auto ${className}`}>{header}<blockquote className="text-xl font-bold mb-12 text-center" dangerouslySetInnerHTML={{ __html: t.testimonialBody }} />{authorCard}{caseLink}</div>);
    case 'large':
      return (<div className={`grid md:grid-cols-2 items-center gap-x-20 gap-y-12 ${className}`}><div><Img img={t.customerIcon} className="w-full aspect-square object-cover" /></div><div>{header}<blockquote className="text-xl font-bold mb-6" dangerouslySetInnerHTML={{ __html: t.testimonialBody }} />{authorCard}{caseLink}</div></div>);
    default:
      return (<div className={`flex flex-col ${className}`}>{header}<blockquote className="text-xl font-bold mb-6" dangerouslySetInnerHTML={{ __html: t.testimonialBody }} />{authorCard}{caseLink}</div>);
  }
};

const Header = ({ d, centered }: { d: { title: string; tagLine: string }; centered?: boolean }) => (
  <div className={`max-w-3xl mb-20 ${centered ? 'mx-auto text-center' : ''}`}>
    <h2 className="text-5xl font-bold mb-6">{d.title}</h2>
    <p className="text-lg">{d.tagLine}</p>
  </div>
);

export const TestimonialsIsland = ({ variant: v, styles, sectionData: d, testimonials: ts, isEditing }: Props): JSX.Element => {
  if (v === 'Default') return (<section className={`py-24 px-4 ${styles}`} data-class-change><div className="container mx-auto"><Header d={d} centered /><div className="flex flex-col md:flex-row gap-x-12 gap-y-20">{ts.map((t) => <TCard key={t.id} t={t} type="centered" withLogo className="flex-1" isEditing={isEditing} />)}</div></div></section>);

  if (v === 'Testimonials1') return (<section className={`py-24 px-4 ${styles}`} data-class-change><div className="container mx-auto"><Header d={d} centered /><div className="max-w-5xl mx-auto px-12"><Carousel opts={{ loop: true }} className="w-full"><CarouselContent>{ts.map((t) => <CarouselItem key={t.id}><TCard t={t} type="centered" withLogo withRating isEditing={isEditing} /></CarouselItem>)}</CarouselContent><CarouselPrevious className="disabled:hidden" /><CarouselNext className="disabled:hidden" /></Carousel></div></div></section>);

  if (v === 'Testimonials2') return (<section className={`py-24 px-4 ${styles}`} data-class-change><div className="container mx-auto"><Header d={d} /><Carousel opts={{ align: 'start', loop: true }} className="w-full"><CarouselContent>{ts.map((t) => <CarouselItem key={t.id} className="pr-4 md:basis-1/2"><TCard t={t} type="simple" withLogo withRating isEditing={isEditing} /></CarouselItem>)}</CarouselContent><div className="flex items-center gap-2 mt-8"><CarouselPrevious className="static translate-0 disabled:hidden" /><CarouselNext className="static translate-0 disabled:hidden" /></div></Carousel></div></section>);

  if (v === 'Testimonials3') return (<section className={`py-24 px-4 ${styles}`} data-class-change><div className="container mx-auto"><div className="grid md:grid-cols-2 items-center gap-12 md:gap-20"><div className="md:mb-16"><h2 className="text-5xl font-bold mb-6">{d.title}</h2><p className="text-lg">{d.tagLine}</p></div><Carousel opts={{ align: 'start', loop: true }} className="w-full"><CarouselContent>{ts.map((t) => <CarouselItem key={t.id} className="pr-2 md:basis-3/4"><TCard t={t} type="boxed" withLogo className="h-full" isEditing={isEditing} /></CarouselItem>)}</CarouselContent><div className="flex items-center gap-2 mt-8"><CarouselPrevious className="static translate-0" /><CarouselNext className="static translate-0" /></div></Carousel></div></div></section>);

  if (v === 'Testimonials4') return (<section className={`py-24 px-4 ${styles}`} data-class-change><div className="container mx-auto"><div className="grid md:grid-cols-2 items-center gap-12 md:gap-20"><div className="md:mb-16"><h2 className="text-5xl font-bold mb-6">{d.title}</h2><p className="text-lg">{d.tagLine}</p></div><Carousel opts={{ align: 'start', loop: true }} className="w-full"><CarouselContent>{ts.map((t) => <CarouselItem key={t.id}><TCard t={t} type="boxed" withRating isEditing={isEditing} /></CarouselItem>)}</CarouselContent><div className="flex items-center justify-end gap-2 mt-8"><CarouselPrevious className="static translate-0 disabled:hidden" /><CarouselNext className="static translate-0 disabled:hidden" /></div></Carousel></div></div></section>);

  if (v === 'Testimonials5') return (<section className={`py-24 px-4 ${styles}`} data-class-change><div className="container mx-auto"><Header d={d} /><Carousel opts={{ align: 'start', loop: true }} className="w-full"><CarouselContent>{ts.map((t) => <CarouselItem key={t.id}><TCard t={t} type="large" withLogo withRating isEditing={isEditing} /></CarouselItem>)}</CarouselContent><div className="flex items-center justify-end gap-2 mt-8"><CarouselPrevious className="static translate-0 disabled:hidden" /><CarouselNext className="static translate-0 disabled:hidden" /></div></Carousel></div></section>);

  if (v === 'Testimonials6') return (<section className={`py-24 px-4 ${styles}`} data-class-change><div className="container mx-auto"><Header d={d} centered /><div className="md:columns-3 gap-8">{ts.map((t) => <TCard key={t.id} t={t} type="boxed" withRating className="mb-8" isEditing={isEditing} />)}</div></div></section>);

  if (v === 'Testimonials7') return (<section className={`py-24 px-4 ${styles}`} data-class-change><div className="container mx-auto"><Header d={d} centered /><div className="flex flex-col md:flex-row gap-x-12 gap-y-20">{ts.map((t) => <TCard key={t.id} t={t} type="boxed" withRating className="flex-1" isEditing={isEditing} />)}</div></div></section>);

  if (v === 'Testimonials8') return (<section className={`py-24 px-4 ${styles}`} data-class-change><div className="container mx-auto"><Header d={d} /><Carousel opts={{ align: 'start', loop: true }} className="w-full"><CarouselContent>{ts.map((t) => <CarouselItem key={t.id} className="md:basis-1/2"><TCard t={t} type="boxed" withLogo withRating className="h-full" isEditing={isEditing} /></CarouselItem>)}</CarouselContent><div className="flex items-center justify-end gap-2 mt-8"><CarouselPrevious className="static translate-0 disabled:hidden" /><CarouselNext className="static translate-0 disabled:hidden" /></div></Carousel></div></section>);

  if (v === 'Testimonials9') return (<section className={`py-24 px-4 ${styles}`} data-class-change><div className="container mx-auto"><Header d={d} centered /><Tabs defaultValue={ts[0]?.id} className="mt-20"><TabsList>{ts.map((t) => <TabsTrigger value={t.id} key={t.id}><Img img={t.testimonialIcon} className="object-contain h-8" /></TabsTrigger>)}</TabsList>{ts.map((t) => <TabsContent value={t.id} key={t.id} className="py-16"><TCard t={t} type="centered" withRating isEditing={isEditing} /></TabsContent>)}</Tabs></div></section>);

  // Fallback
  return (<section className={`py-24 px-4 ${styles}`} data-class-change><div className="container mx-auto"><Header d={d} centered /><div className="flex flex-col md:flex-row gap-x-12 gap-y-20">{ts.map((t) => <TCard key={t.id} t={t} type="centered" withLogo className="flex-1" isEditing={isEditing} />)}</div></div></section>);
};
