'use client';

import { useState, useMemo, type JSX } from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { generateFAQPageSchema } from '@/lib/structured-data/schema';

interface SerializedImage { src: string; alt: string; }
interface SerializedLink { href: string; text: string; target: string; }

interface QuestionData { id: string; question: string; answer: string; image: SerializedImage; }
interface SectionData { heading: string; text: string; heading2: string; text2: string; link: SerializedLink; }

interface FAQProps {
  variant: string;
  styles: string;
  sectionData: SectionData;
  questions: QuestionData[];
  isEditing: boolean;
}

const Img = ({ img, className }: { img: SerializedImage; className?: string }) =>
  img.src ? <img src={img.src} alt={img.alt} className={className} loading="lazy" /> : null;

const BtnLink = ({ link, className }: { link: SerializedLink; className?: string }) =>
  link.href ? <a href={link.href} className={className || "inline-flex items-center justify-center whitespace-nowrap rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground mt-8"}>{link.text}</a> : null;

const QuestionAccordionItem = ({ q, type, className }: { q: QuestionData; type: 'bordered' | 'boxed' | 'simple'; className?: string }) => {
  if (type === 'bordered') return (
    <AccordionItem value={q.id} className={`border-gray-300 first:border-t ${className || ''}`}>
      <AccordionTrigger className="flex-row-reverse justify-end py-6 px-2 text-base cursor-pointer">{q.question}</AccordionTrigger>
      <AccordionContent className="text-base pb-6 ps-10"><div dangerouslySetInnerHTML={{ __html: q.answer }} /></AccordionContent>
    </AccordionItem>
  );
  if (type === 'boxed') return (
    <AccordionItem value={q.id} className={`border last:border ${className || ''}`}>
      <AccordionTrigger className="px-8">{q.question}</AccordionTrigger>
      <AccordionContent className="px-8"><div dangerouslySetInnerHTML={{ __html: q.answer }} /></AccordionContent>
    </AccordionItem>
  );
  return (
    <AccordionItem value={q.id} className={className}>
      <AccordionTrigger>{q.question}</AccordionTrigger>
      <AccordionContent><div dangerouslySetInnerHTML={{ __html: q.answer }} /></AccordionContent>
    </AccordionItem>
  );
};

const QuestionItem = ({ q, type, showIcon }: { q: QuestionData; type: 'simple' | 'bordered' | 'centered'; showIcon?: boolean }) => {
  if (type === 'bordered') return (
    <div className="grid md:grid-cols-2 gap-4 border-t pt-6 pb-12">
      <h3 className="text-lg font-bold mb-4">{q.question}</h3>
      <div dangerouslySetInnerHTML={{ __html: q.answer }} />
    </div>
  );
  if (type === 'centered') return (
    <div className="text-center">
      <Img img={q.image} className="object-contain mx-auto mb-6 w-[50px] h-[50px]" />
      <h3 className="text-lg font-bold mb-4">{q.question}</h3>
      <div dangerouslySetInnerHTML={{ __html: q.answer }} />
    </div>
  );
  return (
    <div>
      {showIcon && <Img img={q.image} className="object-contain mb-6 w-[50px] h-[50px]" />}
      <h3 className="text-lg font-bold mb-4">{q.question}</h3>
      <div dangerouslySetInnerHTML={{ __html: q.answer }} />
    </div>
  );
};

const BottomSection = ({ data }: { data: SectionData }) => (
  <div className="text-center">
    <h3 className="text-3xl font-bold mb-4">{data.heading2}</h3>
    {data.text2 && <div className="text-lg" dangerouslySetInnerHTML={{ __html: data.text2 }} />}
    <BtnLink link={data.link} />
  </div>
);

export const FAQIsland = (props: FAQProps): JSX.Element => {
  const { variant, styles, sectionData, questions } = props;
  const itemIds = questions.map((q) => q.id);
  const [openItems, setOpenItems] = useState<string[]>([]);

  const faqSchema = useMemo(() => {
    const faqs = questions.map((q) => ({ question: q.question, answer: q.answer }));
    return generateFAQPageSchema(faqs);
  }, [questions]);

  const schemaScript = faqSchema ? <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} /> : null;

  if (variant === 'FAQ1') {
    return (
      <section className={`py-24 px-4 ${styles}`} data-class-change>
        {schemaScript}
        <div className="container mx-auto">
          <h2 className="text-3xl font-semibold mb-6">{sectionData.heading}</h2>
          <div className="flex gap-4 mb-6 text-base font-semibold">
            <button onClick={() => setOpenItems(itemIds)} disabled={openItems.length === itemIds.length} className={`px-2 ${openItems.length === itemIds.length ? 'opacity-40 cursor-not-allowed' : 'text-primary underline cursor-pointer'}`}>Expand All</button>|
            <button onClick={() => setOpenItems([])} disabled={openItems.length === 0} className={`px-2 ${openItems.length === 0 ? 'opacity-40 cursor-not-allowed' : 'text-primary underline cursor-pointer'}`}>Collapse All</button>
          </div>
          <Accordion type="multiple" value={openItems} onValueChange={setOpenItems} className="w-full">
            {questions.map((q) => <QuestionAccordionItem key={q.id} q={q} type="bordered" />)}
          </Accordion>
        </div>
      </section>
    );
  }

  if (variant === 'FAQ2') return (
    <section className={`py-24 px-4 ${styles}`} data-class-change>{schemaScript}
      <div className="container mx-auto"><div className="grid gap-x-20 gap-y-12 md:grid-cols-2">
        <div><h2 className="text-5xl font-bold mb-6">{sectionData.heading}</h2>{sectionData.text && <div className="text-lg" dangerouslySetInnerHTML={{ __html: sectionData.text }} />}<BtnLink link={sectionData.link} /></div>
        <div><Accordion type="multiple" className="w-full grid gap-4">{questions.map((q) => <QuestionAccordionItem key={q.id} q={q} type="boxed" />)}</Accordion></div>
      </div></div></section>);

  if (variant === 'FAQ3') return (
    <section className={`py-24 px-4 ${styles}`} data-class-change>{schemaScript}
      <div className="container mx-auto"><div className="max-w-3xl mx-auto text-center"><h2 className="text-5xl font-bold mb-6">{sectionData.heading}</h2>{sectionData.text && <div className="text-lg" dangerouslySetInnerHTML={{ __html: sectionData.text }} />}</div>
        <div className="grid md:grid-cols-2 gap-4 items-start my-20">
          <Accordion type="multiple" className="w-full grid gap-4">{questions.filter((_, i) => i % 2 === 0).map((q) => <QuestionAccordionItem key={q.id} q={q} type="boxed" />)}</Accordion>
          <Accordion type="multiple" className="w-full grid gap-4">{questions.filter((_, i) => i % 2 !== 0).map((q) => <QuestionAccordionItem key={q.id} q={q} type="boxed" />)}</Accordion>
        </div><div className="max-w-3xl mx-auto"><BottomSection data={sectionData} /></div></div></section>);

  if (variant === 'FAQ4') return (
    <section className={`py-24 px-4 ${styles}`} data-class-change>{schemaScript}
      <div className="container mx-auto"><div className="max-w-3xl mx-auto"><div className="text-center"><h2 className="text-5xl font-bold mb-6">{sectionData.heading}</h2>{sectionData.text && <div className="text-lg" dangerouslySetInnerHTML={{ __html: sectionData.text }} />}</div>
        <div className="grid gap-12 my-20">{questions.map((q) => <QuestionItem key={q.id} q={q} type="simple" />)}</div><BottomSection data={sectionData} /></div></div></section>);

  if (variant === 'FAQ5') return (
    <section className={`py-24 px-4 ${styles}`} data-class-change>{schemaScript}
      <div className="container mx-auto"><div className="grid gap-x-20 gap-y-12 md:grid-cols-2">
        <div><h2 className="text-5xl font-bold mb-6">{sectionData.heading}</h2>{sectionData.text && <div className="text-lg" dangerouslySetInnerHTML={{ __html: sectionData.text }} />}<BtnLink link={sectionData.link} /></div>
        <div><div className="grid gap-12">{questions.map((q) => <QuestionItem key={q.id} q={q} type="simple" />)}</div></div>
      </div></div></section>);

  if (variant === 'FAQ6') return (
    <section className={`py-24 px-4 ${styles}`} data-class-change>{schemaScript}
      <div className="container mx-auto"><div className="max-w-3xl"><h2 className="text-5xl font-bold mb-6">{sectionData.heading}</h2>{sectionData.text && <div className="text-lg" dangerouslySetInnerHTML={{ __html: sectionData.text }} />}</div>
        <div className="my-20">{questions.map((q) => <QuestionItem key={q.id} q={q} type="bordered" />)}</div>
        <div className="max-w-3xl"><h3 className="text-3xl font-bold mb-4">{sectionData.heading2}</h3>{sectionData.text2 && <div className="text-lg" dangerouslySetInnerHTML={{ __html: sectionData.text2 }} />}<BtnLink link={sectionData.link} /></div></div></section>);

  if (variant === 'FAQ7') return (
    <section className={`py-24 px-4 ${styles}`} data-class-change>{schemaScript}
      <div className="container mx-auto"><div className="max-w-3xl"><h2 className="text-5xl font-bold mb-6">{sectionData.heading}</h2>{sectionData.text && <div className="text-lg" dangerouslySetInnerHTML={{ __html: sectionData.text }} />}</div>
        <div className="grid md:grid-cols-2 gap-16 my-20">{questions.map((q) => <QuestionItem key={q.id} q={q} type="simple" showIcon />)}</div>
        <div className="max-w-3xl"><h3 className="text-3xl font-bold mb-4">{sectionData.heading2}</h3>{sectionData.text2 && <div className="text-lg" dangerouslySetInnerHTML={{ __html: sectionData.text2 }} />}<BtnLink link={sectionData.link} /></div></div></section>);

  if (variant === 'FAQ8') return (
    <section className={`py-24 px-4 ${styles}`} data-class-change>{schemaScript}
      <div className="container mx-auto"><div className="max-w-3xl"><h2 className="text-5xl font-bold mb-6">{sectionData.heading}</h2>{sectionData.text && <div className="text-lg" dangerouslySetInnerHTML={{ __html: sectionData.text }} />}</div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-16 my-20">{questions.map((q) => <QuestionItem key={q.id} q={q} type="centered" />)}</div>
        <div className="max-w-3xl"><h3 className="text-3xl font-bold mb-4">{sectionData.heading2}</h3>{sectionData.text2 && <div className="text-lg" dangerouslySetInnerHTML={{ __html: sectionData.text2 }} />}<BtnLink link={sectionData.link} /></div></div></section>);

  // Default
  return (
    <section className={`py-24 px-4 ${styles}`} data-class-change>{schemaScript}
      <div className="container mx-auto"><div className="max-w-3xl mx-auto"><div className="text-center"><h2 className="text-5xl font-bold mb-6">{sectionData.heading}</h2>{sectionData.text && <div className="text-lg" dangerouslySetInnerHTML={{ __html: sectionData.text }} />}</div>
        <Accordion type="multiple" className="w-full my-20">{questions.map((q) => <QuestionAccordionItem key={q.id} q={q} type="bordered" />)}</Accordion>
        <BottomSection data={sectionData} /></div></div></section>);
};
