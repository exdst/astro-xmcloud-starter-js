'use client';

import { useState, useRef, useEffect, type JSX } from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { ChevronRight } from 'lucide-react';
import useVisibility from '@/hooks/useVisibility';
import React from 'react';

interface SI { src: string; alt: string; }
interface SL { href: string; text: string; target: string; }

interface FeatureData {
  id: string; featureTagLine: string; featureHeading: string; featureDescription: string;
  featureIcon: SI; featureImage: SI; featureLink1: SL; featureLink2: SL;
}

interface SectionData {
  heading: string; tagLine: string; body: string; image: SI; link1: SL; link2: SL;
}

interface Props {
  variant: string; styles: string; renderingId: string;
  sectionData: SectionData; features: FeatureData[]; isEditing: boolean;
}

const Img = ({ img, className }: { img: SI; className?: string }) =>
  img.src ? <img src={img.src} alt={img.alt} className={className} loading="lazy" /> : null;

const BtnLink = ({ link, className }: { link: SL; className?: string }) =>
  link.href ? <a href={link.href} target={link.target || undefined} className={className || 'inline-flex items-center justify-center whitespace-nowrap rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground'}>{link.text}</a> : null;

const BtnLinkOutline = ({ link, className }: { link: SL; className?: string }) =>
  link.href ? <a href={link.href} target={link.target || undefined} className={className || 'inline-flex items-center px-0 text-sm font-medium underline-offset-4 hover:underline'}>{link.text}</a> : null;

const Buttons = ({ link1, link2 }: { link1: SL; link2: SL }) => (
  <div className="flex flex-wrap gap-6 mt-4">
    <BtnLink link={link1} />
    <BtnLinkOutline link={link2} />
  </div>
);

const MSCardBtns = ({ link1 }: { link1: SL }) => (
  <div className="flex flex-wrap items-center gap-6 mt-4">
    {link1.href && (
      <a href={link1.href} className="flex items-center gap-2 text-sm font-bold">
        <span className="p-2 bg-black rounded-md"><ChevronRight className="h-5 w-5 text-white" /></span>
        {link1.text}
      </a>
    )}
  </div>
);

type FBType = 'simple' | 'horizontal' | 'oneLiner' | 'extended' | 'extendedLarge' | 'withBackgroundImageSm' | 'withBackgroundImageLg' | 'MSCardSmall' | 'MSCardSmallIcon';

const FeatureBox = React.forwardRef<HTMLDivElement, { f: FeatureData; type: FBType; withLinks?: boolean; centered?: boolean; className?: string; style?: React.CSSProperties }>(
  (props, ref) => {
    const { f, type, withLinks, centered, className = '', style } = props;
    const links = withLinks ? <Buttons link1={f.featureLink1} link2={f.featureLink2} /> : null;

    switch (type) {
      case 'horizontal':
        return (<div className={`flex gap-4 items-start ${className}`}><Img img={f.featureIcon} className="shrink-0 w-[30px] h-[30px]" /><div><h3 className="text-xl font-bold mb-4">{f.featureHeading}</h3><p>{f.featureDescription}</p>{links}</div></div>);
      case 'oneLiner':
        return (<div className={className}><div className="flex gap-4 items-start"><Img img={f.featureIcon} className="w-5 h-5" /><h3>{f.featureDescription}</h3></div>{links}</div>);
      case 'extended':
        return (<div className={`${centered ? 'flex flex-col items-center text-center' : ''} ${className}`}><Img img={f.featureIcon} className="mb-4 w-12 h-12" /><h3 className="text-4xl font-bold mb-6">{f.featureHeading}</h3><p className="mb-6">{f.featureDescription}</p>{links}</div>);
      case 'extendedLarge':
        return (<div className={className}><Img img={f.featureImage} className="aspect-3/2 w-full object-cover mb-4" /><p className="font-semibold mb-4">{f.featureTagLine}</p><h3 className="text-4xl font-bold mb-6">{f.featureHeading}</h3><p className="mb-6">{f.featureDescription}</p>{links}</div>);
      case 'withBackgroundImageSm':
        return (<div className={`relative flex flex-col justify-center p-8 text-white ${className}`}><Img img={f.featureImage} className="absolute w-full h-full object-cover inset-0 brightness-50 z-10" /><div className="relative z-20"><Img img={f.featureIcon} className="inline-block mb-4 w-12 h-12" /><h3 className="text-3xl font-bold mb-4">{f.featureHeading}</h3><p>{f.featureDescription}</p>{links}</div></div>);
      case 'withBackgroundImageLg':
        return (<div className={`relative flex flex-col justify-center p-12 text-white ${className}`}><Img img={f.featureImage} className="absolute w-full h-full object-cover inset-0 brightness-50 z-10" /><div className="relative z-20"><Img img={f.featureIcon} className="inline-block mb-6 w-12 h-12" /><h3 className="text-4xl font-bold mb-6">{f.featureHeading}</h3><p className="mb-6">{f.featureDescription}</p>{links}</div></div>);
      case 'MSCardSmall':
        return (<div className={`group flex flex-col p-2 rounded-3xl bg-white shadow-md transition-all hover:shadow-lg ${className}`} style={style} ref={ref}><div className="w-full h-full rounded-2xl overflow-hidden mb-4"><Img img={f.featureImage} className="w-full aspect-7/3 object-cover rounded-2xl transition-transform duration-1000 ease-in-out group-hover:scale-115" /></div><div className="flex flex-col basis-full p-4"><p className="font-semibold text-xs mb-2">{f.featureTagLine}</p><h3 className="text-xl font-medium mb-4">{f.featureHeading}</h3><p className="text-base mb-6">{f.featureDescription}</p><div className="mt-auto"><MSCardBtns link1={f.featureLink1} /></div></div></div>);
      case 'MSCardSmallIcon':
        return (<div className={`flex flex-col p-2 rounded-3xl bg-white shadow-md transition-all hover:shadow-lg ${className}`} style={style} ref={ref}><div className="self-start border p-3 m-4 mb-0 rounded-md"><Img img={f.featureIcon} className="aspect-square w-6 object-contain" /></div><div className="flex flex-col basis-full p-4"><p className="font-semibold text-xs mb-2">{f.featureTagLine}</p><h3 className="text-xl font-medium mb-4">{f.featureHeading}</h3><div className="mt-auto"><MSCardBtns link1={f.featureLink1} /></div></div></div>);
      default:
        return (<div className={`${centered ? 'flex flex-col items-center text-center' : ''} ${className}`}><Img img={f.featureIcon} className="mb-4 w-12 h-12" /><h3 className="text-xl font-bold mb-4">{f.featureHeading}</h3><p>{f.featureDescription}</p>{links}</div>);
    }
  }
);
FeatureBox.displayName = 'FeatureBox';

const SideBySide = ({ d, features, ft, styles }: { d: SectionData; features: FeatureData[]; ft: FBType; styles: string }) => {
  const gc = ft === 'oneLiner' ? 'grid gap-y-4' : 'grid md:grid-cols-2 gap-x-8 gap-y-12';
  return (<section className={`py-24 px-4 ${styles}`} data-class-change><div className="container mx-auto"><div className="grid md:grid-cols-2 items-center gap-x-20 gap-y-12"><div>{d.tagLine && <p className="font-semibold mb-4">{d.tagLine}</p>}<h2 className="text-5xl font-bold mb-6">{d.heading}</h2>{d.body && <div className="text-lg" dangerouslySetInnerHTML={{ __html: d.body }} />}<div className={`${gc} my-8`}>{features.map((f) => <FeatureBox key={f.id} f={f} type={ft} />)}</div><Buttons link1={d.link1} link2={d.link2} /></div><div><Img img={d.image} className="aspect-square object-cover" /></div></div></div></section>);
};

const TwoColHeader = ({ d, features, ft, styles }: { d: SectionData; features: FeatureData[]; ft: FBType; styles: string }) => {
  const gc = ft === 'oneLiner' ? 'grid gap-y-4' : 'grid md:grid-cols-2 gap-x-8 gap-y-12';
  return (<section className={`py-24 px-4 ${styles}`} data-class-change><div className="container mx-auto"><div className="grid md:grid-cols-2 gap-x-20 gap-y-4"><div>{d.tagLine && <p className="font-semibold mb-4">{d.tagLine}</p>}<h2 className="text-5xl font-bold">{d.heading}</h2></div><div>{d.body && <div className="text-lg" dangerouslySetInnerHTML={{ __html: d.body }} />}<div className={`${gc} my-8`}>{features.map((f) => <FeatureBox key={f.id} f={f} type={ft} />)}</div><Buttons link1={d.link1} link2={d.link2} /></div></div><Img img={d.image} className="w-full aspect-16/9 object-cover mt-20" /></div></section>);
};

export const FeaturesSectionIsland = (props: Props): JSX.Element => {
  const { variant, styles, renderingId: id, sectionData: d, features, isEditing } = props;
  const [activeTab, setActiveTab] = useState(features[0]?.id || '');
  const [isVisibleText, textRef] = useVisibility();
  const [isVisibleGrid, gridRef] = useVisibility();

  const typeMap: Record<string, FBType> = { Default: 'simple', FeaturesSection1: 'horizontal', FeaturesSection2: 'oneLiner', FeaturesSection3: 'simple', FeaturesSection4: 'horizontal', FeaturesSection5: 'oneLiner' };

  if (['Default', 'FeaturesSection1', 'FeaturesSection2'].includes(variant))
    return <SideBySide d={d} features={features} ft={typeMap[variant]} styles={styles} />;

  if (['FeaturesSection3', 'FeaturesSection4', 'FeaturesSection5'].includes(variant))
    return <TwoColHeader d={d} features={features} ft={typeMap[variant]} styles={styles} />;

  if (variant === 'FeaturesSection6') return (
    <section className={`py-24 px-4 ${styles}`} data-class-change><div className="container mx-auto"><div className="grid md:grid-cols-2 gap-x-20 gap-y-4"><div>{d.tagLine && <p className="font-semibold mb-4">{d.tagLine}</p>}<h2 className="text-5xl font-bold mb-6">{d.heading}</h2>{d.body && <div className="text-lg mb-8" dangerouslySetInnerHTML={{ __html: d.body }} />}<Buttons link1={d.link1} link2={d.link2} /></div><div><div className="grid gap-y-4">{features.map((f, i) => (<div className="flex gap-8 py-10" key={f.id}><div className="shrink-0 relative"><Img img={f.featureIcon} className="shrink-0 w-10 h-10" />{i !== features.length - 1 && <span className="absolute top-18 bottom-0 left-[calc(50%-1px)] w-[2px] h-full bg-black"></span>}</div><div><h3 className="text-xl font-bold mb-4">{f.featureHeading}</h3><p>{f.featureDescription}</p></div></div>))}</div></div></div></div></section>);

  if (variant === 'FeaturesSection7' || variant === 'FeaturesSection8') {
    const t: FBType = variant === 'FeaturesSection7' ? 'extended' : 'extendedLarge';
    return (<section className={`py-24 px-4 ${styles}`} data-class-change><div className="container mx-auto"><div className="grid md:grid-cols-2 gap-16">{features.map((f) => <FeatureBox key={f.id} f={f} type={t} withLinks />)}</div></div></section>);
  }

  if (variant === 'FeaturesSection9' || variant === 'FeaturesSection10') {
    const t: FBType = variant === 'FeaturesSection9' ? 'simple' : 'horizontal';
    const gc = variant === 'FeaturesSection9' ? 'grid md:grid-cols-2 gap-x-8 gap-y-12' : 'grid gap-x-8 gap-y-12';
    return (<section className={`py-24 px-4 ${styles}`} data-class-change><div className="container mx-auto"><div className="grid md:grid-cols-2 gap-x-20 gap-y-12"><div><Img img={d.image} className="w-full h-full object-cover" /></div><div className={`${gc} py-8`}>{features.map((f) => <FeatureBox key={f.id} f={f} type={t} withLinks />)}</div></div></div></section>);
  }

  if (variant === 'FeaturesSection11') return (
    <section className={`py-24 px-4 ${styles}`} data-class-change><div className="container mx-auto"><div className="max-w-3xl mx-auto text-center">{d.tagLine && <p className="font-semibold mb-4">{d.tagLine}</p>}<h2 className="text-5xl font-bold mb-6">{d.heading}</h2>{d.body && <div className="text-lg" dangerouslySetInnerHTML={{ __html: d.body }} />}</div><div className="grid grid-flow-dense md:grid-cols-3 gap-x-20 gap-y-12 my-12"><Img img={d.image} className="w-full h-full object-cover md:row-span-2 md:col-start-2" />{features.map((f) => <FeatureBox key={f.id} f={f} type="simple" centered className="my-4" />)}</div><div className="flex justify-center"><Buttons link1={d.link1} link2={d.link2} /></div></div></section>);

  if (variant === 'FeaturesSection12') return (
    <section className={`py-24 px-4 ${styles}`} data-class-change><div className="container mx-auto"><div className="grid md:grid-cols-2 gap-x-20 gap-y-12"><div>{d.tagLine && <p className="font-semibold mb-4">{d.tagLine}</p>}<h2 className="text-5xl font-bold mb-6">{d.heading}</h2>{d.body && <div className="text-lg" dangerouslySetInnerHTML={{ __html: d.body }} />}<div className="grid my-8">{features.map((f) => (<div key={f.id} onClick={() => setActiveTab(f.id)} className={`ps-6 py-4 cursor-pointer border-s-2 ${activeTab !== f.id ? 'border-transparent' : ''}`}><h3 className="text-2xl font-bold mb-2">{f.featureHeading}</h3><p>{f.featureDescription}</p></div>))}</div><Buttons link1={d.link1} link2={d.link2} /></div><div className="relative min-h-80">{features.map((f) => (<div key={f.id} className={`absolute inset-0 transition-opacity duration-300 ${activeTab !== f.id ? 'opacity-0' : 'opacity-100'}`}><Img img={f.featureImage} className="w-full h-full object-cover" /></div>))}</div></div></div></section>);

  if (variant === 'FeaturesSection13') return (
    <section className={`py-24 px-4 ${styles}`} data-class-change><div className="container mx-auto"><div className="max-w-3xl mx-auto text-center">{d.tagLine && <p className="font-semibold mb-4">{d.tagLine}</p>}<h2 className="text-5xl font-bold mb-6">{d.heading}</h2>{d.body && <div className="text-lg mb-6" dangerouslySetInnerHTML={{ __html: d.body }} />}<div className="flex justify-center"><Buttons link1={d.link1} link2={d.link2} /></div></div><div className="grid md:grid-cols-2 items-center gap-x-20 gap-y-12 mt-20"><div className="relative aspect-square">{features.map((f) => (<div key={f.id} className={`absolute inset-0 transition-opacity duration-300 ${activeTab !== f.id ? 'opacity-0' : 'opacity-100'}`}><Img img={f.featureImage} className="absolute inset-0 w-full h-full object-cover" /></div>))}</div><Accordion type="single" defaultValue={features[0]?.id} className="grid my-8">{features.map((f) => (<AccordionItem value={f.id} key={f.id} onClick={() => setActiveTab(f.id)} className={`py-4 ${activeTab !== f.id ? 'opacity-25' : ''}`}><AccordionTrigger className="cursor-pointer hover:no-underline"><div className="flex gap-6"><Img img={f.featureIcon} className="shrink-0 w-8 h-8" /><h3 className="text-3xl font-bold mb-2">{f.featureHeading}</h3></div></AccordionTrigger><AccordionContent><p className="ps-14">{f.featureDescription}</p></AccordionContent></AccordionItem>))}</Accordion></div></div></section>);

  if (variant === 'FeaturesSection14') return (
    <section className={`py-24 px-4 ${styles}`} data-class-change><div className="container mx-auto"><div className="max-w-3xl mx-auto text-center">{d.tagLine && <p className="font-semibold mb-4">{d.tagLine}</p>}<h2 className="text-5xl font-bold mb-6">{d.heading}</h2>{d.body && <div className="text-lg mb-6" dangerouslySetInnerHTML={{ __html: d.body }} />}<div className="flex justify-center"><Buttons link1={d.link1} link2={d.link2} /></div></div><div className="flex flex-col md:flex-row gap-8 mt-12">{features.map((f) => <FeatureBox key={f.id} f={f} type={features.length < 3 ? 'withBackgroundImageLg' : 'withBackgroundImageSm'} withLinks />)}</div></div></section>);

  if (variant === 'FeaturesSection15') return (
    <section className={`py-24 px-4 ${styles}`} data-class-change><div className="container mx-auto"><div className="max-w-3xl mx-auto text-center">{d.tagLine && <p className="font-semibold mb-4">{d.tagLine}</p>}<h2 className="text-5xl font-bold mb-6">{d.heading}</h2>{d.body && <div className="text-lg mb-6" dangerouslySetInnerHTML={{ __html: d.body }} />}<div className="flex justify-center"><Buttons link1={d.link1} link2={d.link2} /></div></div><div className="grid grid-flow-dense gap-8 md:grid-cols-4 mt-12">{features.map((f, i) => <FeatureBox key={f.id} f={f} type={i === 0 || i === 3 ? 'withBackgroundImageLg' : 'withBackgroundImageSm'} withLinks className={`${i === 0 ? 'md:col-span-2 md:row-span-2' : ''} ${i === 3 ? 'md:col-span-2' : ''}`} />)}</div></div></section>);

  if (variant === 'FeaturesSection16') return (
    <section className={`py-24 px-4 ${styles}`} data-class-change><div className="container mx-auto"><div className="flex flex-col md:flex-row gap-8"><div className="relative basis-[150%] p-12"><Img img={d.image} className="absolute inset-0 w-full h-full object-cover brightness-50 z-10" /><div className="relative h-full flex flex-col justify-center max-w-2xl mx-auto text-white text-center z-20">{d.tagLine && <p className="font-semibold mb-4">{d.tagLine}</p>}<h2 className="text-5xl font-bold mb-6">{d.heading}</h2>{d.body && <div className="text-lg mb-6" dangerouslySetInnerHTML={{ __html: d.body }} />}<div className="flex justify-center"><Buttons link1={d.link1} link2={d.link2} /></div></div></div><div className="grid gap-8 basis-[100%]">{features.map((f) => <FeatureBox key={f.id} f={f} type="extended" centered withLinks className="border p-8" />)}</div></div></div></section>);

  if (variant === 'FeaturesSection17') return (
    <section className={`py-24 px-4 ${styles}`} data-class-change><div className="container mx-auto"><div className="max-w-3xl">{d.tagLine && <p className="font-semibold mb-4">{d.tagLine}</p>}<h2 className="text-5xl font-bold mb-6">{d.heading}</h2>{d.body && <div className="text-lg mb-6" dangerouslySetInnerHTML={{ __html: d.body }} />}<Buttons link1={d.link1} link2={d.link2} /></div><Tabs defaultValue={features[0]?.id} className="grid md:grid-cols-3 mt-20"><TabsList className="md:flex-col">{features.map((f) => (<TabsTrigger value={f.id} key={f.id} className="md:border-b-0 md:last:border-b md:data-[state=active]:border-b-inherit md:border-e md:data-[state=active]:border-e-transparent"><p className="text-xl font-bold">{f.featureTagLine}</p></TabsTrigger>))}</TabsList>{features.map((f) => (<TabsContent value={f.id} key={f.id} className="md:border-t md:border-s-0 md:col-span-2 md:p-16"><div className="max-w-2xl"><Img img={f.featureIcon} className="mb-4 w-[50px] h-[50px]" /><h3 className="text-4xl font-bold mb-6">{f.featureHeading}</h3><p className="mb-6">{f.featureDescription}</p><Buttons link1={f.featureLink1} link2={f.featureLink2} /></div></TabsContent>))}</Tabs></div></section>);

  if (variant === 'FeaturesSection18') return (
    <section className={`py-24 px-4 ${styles}`} data-class-change><div className="container mx-auto"><div className="max-w-3xl">{d.tagLine && <p className="font-semibold mb-4">{d.tagLine}</p>}<h2 className="text-5xl font-bold mb-6">{d.heading}</h2>{d.body && <div className="text-lg mb-6" dangerouslySetInnerHTML={{ __html: d.body }} />}<Buttons link1={d.link1} link2={d.link2} /></div><Tabs defaultValue={features[0]?.id} className="mt-20"><TabsList>{features.map((f) => <TabsTrigger value={f.id} key={f.id}><p className="text-xl font-bold">{f.featureTagLine}</p></TabsTrigger>)}</TabsList>{features.map((f) => (<TabsContent value={f.id} key={f.id}><div className="grid md:grid-cols-2 items-center gap-8"><div><Img img={f.featureIcon} className="mb-4 w-[50px] h-[50px]" /><h3 className="text-4xl font-bold mb-6">{f.featureHeading}</h3><p className="mb-6">{f.featureDescription}</p><Buttons link1={f.featureLink1} link2={f.featureLink2} /></div><div><Img img={f.featureImage} className="w-full mb-4" /></div></div></TabsContent>))}</Tabs></div></section>);

  if (variant === 'FeaturesSection19') return (
    <section className={`py-24 px-4 ${styles}`} data-class-change><div className="container mx-auto"><div className="max-w-3xl">{d.tagLine && <p className="font-semibold mb-4">{d.tagLine}</p>}<h2 className="text-5xl font-bold mb-6">{d.heading}</h2>{d.body && <div className="text-lg mb-6" dangerouslySetInnerHTML={{ __html: d.body }} />}<Buttons link1={d.link1} link2={d.link2} /></div><Accordion type="single" defaultValue={features[0]?.id} className="flex flex-col md:flex-row mt-20">{features.map((f) => (<AccordionItem value={f.id} key={f.id} className="flex flex-col md:flex-row border border-b-0 md:border-b md:border-e-0 md:last:border-e last:border-b md:data-[state=open]:basis-full"><AccordionTrigger className="px-10 py-8 cursor-pointer hover:no-underline"><div className="flex md:flex-col items-center gap-6 w-full md:h-full"><Img img={f.featureIcon} className="shrink-0 md:mb-auto w-6 h-6" /><p className="text-2xl font-bold mx-auto md:mx-0 md:[writing-mode:vertical-rl] md:rotate-180">{f.featureTagLine}</p></div></AccordionTrigger><AccordionContent className="w-full px-10 py-12"><div className="max-w-2xl"><h3 className="text-4xl font-bold mb-6">{f.featureHeading}</h3><p>{f.featureDescription}</p><Img img={f.featureImage} className="mt-10 max-w-full" /></div></AccordionContent></AccordionItem>))}</Accordion></div></section>);

  if (variant === 'FeaturesSection20') return (
    <section className={`py-12 px-4 ${styles}`} data-class-change><div className="container mx-auto"><ul className="flex flex-wrap justify-center gap-8">{features.map((f) => (<li className="flex flex-col items-center gap-4" key={f.id}><Img img={f.featureIcon} className="w-10 h-10" />{f.featureLink1.href && <a href={f.featureLink1.href} className="text-base text-primary font-medium underline text-center">{f.featureLink1.text}</a>}</li>))}</ul></div></section>);

  if (variant === 'FeaturesSection21') return (
    <section className={`py-24 px-4 ${styles}`} id={id || undefined} data-class-change><div className="container mx-auto"><div className={`fade-section fade-up ${isVisibleText ? 'is-visible' : ''}`} ref={textRef}>{d.tagLine && <p className="text-xs font-semibold tracking-widest uppercase mb-4">{d.tagLine}</p>}<h2 className="text-5xl font-medium">{d.heading}</h2></div><div className={`grid md:grid-cols-3 items-center gap-x-4 gap-y-12 mt-4 fade-section fade-up ${isVisibleGrid ? 'is-visible' : ''}`} ref={gridRef}><Accordion type="single" defaultValue={features[0]?.id} className="grid my-8">{features.map((f) => (<AccordionItem value={f.id} key={f.id} onClick={() => setActiveTab(f.id)} className="relative py-4 ms-12"><span className={`absolute top-0 bottom-0 -left-12 w-[2px] bg-black transition-all duration-300 ${activeTab === f.id ? 'opacity-100' : 'opacity-0'}`}></span><AccordionTrigger className="cursor-pointer hover:no-underline"><h3 className="text-xl font-semibold mb-2">{f.featureHeading}</h3></AccordionTrigger><AccordionContent><p className="text-base">{f.featureDescription}</p></AccordionContent></AccordionItem>))}</Accordion><div className="relative aspect-3/2 md:col-span-2">{features.map((f) => (<div key={f.id} className={`absolute inset-0 transition-opacity duration-300 ${activeTab !== f.id ? 'opacity-0' : 'opacity-100'}`}><Img img={f.featureImage} className="absolute inset-0 w-full h-full object-contain" /></div>))}</div></div></div></section>);

  if (variant === 'FeaturesSection22') {
    const [first, ...rest] = features;
    return (<section className={`py-24 px-4 ${styles}`} id={id || undefined} data-class-change><div className="container mx-auto"><div className="grid md:grid-cols-3 gap-y-8 gap-x-4">{first && (<div className="md:col-span-3 grid md:grid-cols-2 gap-8 p-2 rounded-3xl bg-white shadow-md transition-all hover:shadow-lg"><div className="flex flex-col p-4"><p className="font-semibold text-xs mb-auto">{first.featureTagLine}</p><h3 className="text-3xl font-medium mb-6 mt-4">{first.featureHeading}</h3><p className="text-base mb-4">{first.featureDescription}</p><div className="mt-auto"><BtnLink link={first.featureLink1} className="inline-flex items-center justify-center whitespace-nowrap rounded-md bg-secondary px-4 py-2 text-sm font-medium text-secondary-foreground mr-2" /><BtnLinkOutline link={first.featureLink2} /></div></div><Img img={first.featureImage} className="w-full h-auto rounded-2xl" /></div>)}{rest.map((f) => <FeatureBox key={f.id} f={f} type="MSCardSmall" />)}</div></div></section>);
  }

  if (variant === 'FeaturesSection23' || variant === 'FeaturesSection24') {
    const cardType: FBType = variant === 'FeaturesSection23' ? 'MSCardSmall' : 'MSCardSmallIcon';
    return (<section className={`py-24 ${styles}`} id={id || undefined} data-class-change><div className="container px-4 pb-4 mx-auto"><div className="flex flex-wrap justify-between"><div className={`fade-section fade-up ${isVisibleText ? 'is-visible' : ''}`} ref={textRef}>{d.tagLine && <p className="text-xs font-semibold tracking-widest uppercase mb-4">{d.tagLine}</p>}<h2 className="text-5xl font-medium mb-6">{d.heading}</h2></div><div><BtnLink link={d.link1} className="inline-flex items-center justify-center whitespace-nowrap rounded-md border border-input bg-background px-4 py-2 text-sm font-medium" /></div></div></div><div className="overflow-hidden" ref={gridRef}><Carousel className="container mx-auto"><CarouselContent className="px-4">{features.map((f, i) => (<CarouselItem key={f.id} className="md:basis-1/2 lg:basis-1/3"><FeatureBox f={f} type={cardType} className={`h-full fade-section fade-side ${isVisibleGrid ? 'is-visible' : ''}`} style={!isEditing ? { transform: `translateX(${i * 200}px)` } : {}} /></CarouselItem>))}</CarouselContent><div className="static flex items-center gap-2 px-4 pt-8"><CarouselPrevious className="static inset-0 translate-0 border-black w-12 h-12 bg-transparent hover:bg-transparent hover:text-black" /><CarouselNext className="static inset-0 translate-0 border-black w-12 h-12 bg-transparent hover:bg-transparent hover:text-black" /></div></Carousel></div></section>);
  }

  if (variant === 'FeaturesSection25') return (
    <section className={`py-24 px-4 ${styles}`} data-class-change><div className="container mx-auto bg-[#FFF8F3]"><div className="grid lg:grid-cols-3 gap-x-20 gap-y-4 px-16 py-12"><div className="max-w-[20rem]">{d.tagLine && <p className="font-semibold mb-4">{d.tagLine}</p>}<h2 className="text-3xl font-semibold">{d.heading}</h2>{d.body && <div className="text-lg mb-8" dangerouslySetInnerHTML={{ __html: d.body }} />}{d.link1.href && <a href={d.link1.href} className="flex items-center gap-2 text-base text-primary font-medium">{d.link1.text} &rsaquo;</a>}</div><div className="md:col-span-2"><ul className="grid md:grid-cols-4 gap-x-8 gap-y-12 my-8">{features.map((f) => (<li className="flex flex-col items-center gap-4" key={f.id}><Img img={f.featureIcon} className="w-[30px] h-[30px]" /><h3 className="text-sm font-semibold text-center">{f.featureHeading}</h3></li>))}</ul></div></div></div></section>);

  return <SideBySide d={d} features={features} ft="simple" styles={styles} />;
};
