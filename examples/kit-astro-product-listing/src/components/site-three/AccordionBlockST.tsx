import { useMemo } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface AccordionItemData {
  id: string;
  heading: string;
  description: string;
}

interface AccordionBlockSTProps {
  variant: string;
  styles: string;
  heading: string;
  description: string;
  linkHref: string;
  linkText: string;
  items: AccordionItemData[];
}

function hasValidLink(href: string | undefined): boolean {
  return !!(href && href !== "#" && !href.startsWith("http://#"));
}

const AccordionBlockItem = ({ id, heading, description }: AccordionItemData) => (
  <AccordionItem value={id} className="border-border mb-10">
    <AccordionTrigger>
      <h3 className="text-base">{heading}</h3>
    </AccordionTrigger>
    <AccordionContent>
      <div dangerouslySetInnerHTML={{ __html: description }} />
    </AccordionContent>
  </AccordionItem>
);

const CtaBar = ({
  description,
  linkHref,
  linkText,
}: {
  description: string;
  linkHref: string;
  linkText: string;
}) => (
  <div className="flex flex-col lg:flex-row lg:justify-between items-start lg:items-center gap-6 self-center lg:col-start-2 p-5 bg-primary">
    <p className="text-sm">{description}</p>
    {hasValidLink(linkHref) ? (
      <a href={linkHref} className="btn btn-secondary btn-sharp">
        {linkText}
      </a>
    ) : linkText ? (
      <span className="btn btn-secondary btn-sharp inline-block">{linkText}</span>
    ) : null}
  </div>
);

function DefaultVariant({ styles, heading, description, linkHref, linkText, items }: AccordionBlockSTProps) {
  return (
    <section className={`relative py-20 overflow-hidden ${styles}`} data-class-change>
      <span className="absolute top-1/3 -left-1/3 w-screen h-64 bg-primary opacity-50 blur-[400px] rotate-15 z-10"></span>
      <div className="relative container mx-auto px-4 z-20">
        <div className="grid lg:grid-cols-2 gap-12">
          <h2 className="text-2xl lg:text-5xl">{heading}</h2>
          <div>
            <Accordion type="multiple" className="w-full mb-12">
              {items.map((item) => (
                <AccordionBlockItem key={item.id} {...item} />
              ))}
            </Accordion>
            <CtaBar description={description} linkHref={linkHref} linkText={linkText} />
          </div>
        </div>
      </div>
    </section>
  );
}

function TwoColumnVariant({ styles, heading, description, linkHref, linkText, items }: AccordionBlockSTProps) {
  return (
    <section className={`relative py-20 overflow-hidden ${styles}`} data-class-change>
      <span className="absolute top-1/3 -left-1/3 w-screen h-64 bg-primary opacity-50 blur-[400px] rotate-15 z-10"></span>
      <div className="relative container mx-auto px-4 z-20">
        <h2 className="text-2xl lg:text-5xl">{heading}</h2>
        <Accordion type="multiple" className="w-full grid lg:grid-cols-2 gap-x-12 my-12">
          {items.map((item) => (
            <AccordionBlockItem key={item.id} {...item} />
          ))}
        </Accordion>
        <div className="grid lg:grid-cols-2 gap-x-12">
          <CtaBar description={description} linkHref={linkHref} linkText={linkText} />
        </div>
      </div>
    </section>
  );
}

function VerticalVariant({ styles, heading, description, linkHref, linkText, items }: AccordionBlockSTProps) {
  return (
    <section className={`relative py-20 overflow-hidden ${styles}`} data-class-change>
      <span className="absolute -top-20 w-screen h-64 bg-primary opacity-50 blur-[400px] z-10"></span>
      <div className="relative container mx-auto px-4 z-20">
        <div className="flex flex-col gap-12 max-w-3xl mx-auto">
          <h2 className="text-2xl lg:text-5xl text-center">{heading}</h2>
          <Accordion type="multiple" className="w-full">
            {items.map((item) => (
              <AccordionBlockItem key={item.id} {...item} />
            ))}
          </Accordion>
          <CtaBar description={description} linkHref={linkHref} linkText={linkText} />
        </div>
      </div>
    </section>
  );
}

function BoxedAccordionVariant({ styles, heading, description, linkHref, linkText, items }: AccordionBlockSTProps) {
  return (
    <section className={`bg-primary py-20 ${styles}`} data-class-change>
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl lg:text-5xl">{heading}</h2>
        </div>
        <div className="flex flex-col gap-12 max-w-3xl mx-auto bg-white p-4 lg:p-12 mt-12 shadow-2xl">
          <Accordion type="multiple" className="w-full">
            {items.map((item) => (
              <AccordionBlockItem key={item.id} {...item} />
            ))}
          </Accordion>
          <CtaBar description={description} linkHref={linkHref} linkText={linkText} />
        </div>
      </div>
    </section>
  );
}

function BoxedContentVariant({ styles, heading, description, linkHref, linkText, items }: AccordionBlockSTProps) {
  return (
    <section className={`bg-gradient py-20 ${styles}`} data-class-change>
      <div className="container mx-auto px-4">
        <div className="bg-white p-4 lg:p-12 shadow-2xl">
          <div className="flex flex-col gap-12 max-w-5xl mx-auto">
            <h2 className="text-2xl lg:text-5xl max-w-2xl">{heading}</h2>
            <Accordion type="multiple" className="w-full">
              {items.map((item) => (
                <AccordionBlockItem key={item.id} {...item} />
              ))}
            </Accordion>
            <CtaBar description={description} linkHref={linkHref} linkText={linkText} />
          </div>
        </div>
      </div>
    </section>
  );
}

const variants: Record<string, React.FC<AccordionBlockSTProps>> = {
  Default: DefaultVariant,
  TwoColumn: TwoColumnVariant,
  Vertical: VerticalVariant,
  BoxedAccordion: BoxedAccordionVariant,
  BoxedContent: BoxedContentVariant,
};

export function AccordionBlockSTIsland(props: AccordionBlockSTProps) {
  const Component = variants[props.variant] || DefaultVariant;
  return <Component {...props} />;
}
