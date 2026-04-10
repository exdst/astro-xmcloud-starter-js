'use client';

import { type JSX } from 'react';
import useVisibility from '@/hooks/useVisibility';

interface SI { src: string; alt: string; }
interface SL { href: string; text: string; target: string; }

interface HeaderFields {
  Tagline: string; Heading: string; Body: string; Link1: SL; Link2: SL; Image: SI; FormDisclaimer: string;
}

interface Props { variant: string; styles: string; fields: HeaderFields; isEditing: boolean; }

const Img = ({ img, className }: { img: SI; className?: string }) =>
  img.src ? <img src={img.src} alt={img.alt} className={className} loading="lazy" /> : null;

const BtnLink = ({ link, variant: v }: { link: SL; variant?: 'primary' | 'outline' | 'secondary' }) => {
  if (!link.href) return null;
  const cls = v === 'outline'
    ? 'inline-flex items-center justify-center whitespace-nowrap rounded-md border border-input bg-background px-4 py-2 text-sm font-medium ring-offset-background transition-colors hover:bg-accent hover:text-accent-foreground'
    : 'inline-flex items-center justify-center whitespace-nowrap rounded-md bg-secondary px-4 py-2 text-sm font-medium text-secondary-foreground ring-offset-background transition-colors hover:bg-secondary/80';
  return <a href={link.href} target={link.target || undefined} className={cls}>{link.text}</a>;
};

const HeaderTemplate = ({ fields: f, styles, centered, withColumns, withBackgroundImage, withForm }: {
  fields: HeaderFields; styles: string; centered?: boolean; withColumns?: boolean; withBackgroundImage?: boolean; withForm?: boolean;
}) => {
  const [isVisible, domRef] = useVisibility();

  return (
    <section className={`relative py-24 px-4 ${styles}`} data-class-change>
      {withBackgroundImage && <div className="absolute inset-0 h-full w-full z-1"><Img img={f.Image} className="h-full w-full object-cover brightness-50" /></div>}
      <div className={`container mx-auto ${withBackgroundImage ? 'relative text-white z-2' : ''}`}>
        <div className={`${withColumns ? 'grid gap-x-12 lg:grid-cols-2' : 'max-w-3xl flex flex-col'} ${centered ? 'mx-auto items-center text-center max-w-4xl' : ''} fade-section fade-up ${isVisible ? 'is-visible' : ''}`} ref={domRef}>
          <div>
            {f.Tagline && <p className="text-xs font-semibold tracking-widest uppercase mb-4">{f.Tagline}</p>}
            <h1 className="text-5xl font-medium mb-6">{f.Heading}</h1>
          </div>
          <div>
            {f.Body && <div className="text-base" dangerouslySetInnerHTML={{ __html: f.Body }} />}
            {withForm ? (
              <div className={`flex w-full ${centered ? 'justify-center' : ''} gap-2 mt-8`}>
                <div className="max-w-[30rem]">
                  <div className="flex gap-4">
                    <input type="email" placeholder="Enter your email" className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring" />
                    <button type="submit" className="inline-flex items-center justify-center whitespace-nowrap rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground">Subscribe</button>
                  </div>
                  {f.FormDisclaimer && <div className="text-xs mt-3" dangerouslySetInnerHTML={{ __html: f.FormDisclaimer }} />}
                </div>
              </div>
            ) : (
              <div className={`flex ${centered ? 'justify-center' : ''} gap-4 mt-8`}>
                <BtnLink link={f.Link1} variant="secondary" />
                <BtnLink link={f.Link2} variant="outline" />
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export const HeaderIsland = (props: Props): JSX.Element => {
  const { variant, styles, fields: f } = props;

  const cfg: Record<string, any> = {
    Default: {}, Header1: { centered: true }, Header2: { withColumns: true },
    Header3: { withBackgroundImage: true }, Header4: { centered: true, withBackgroundImage: true },
    Header5: { withColumns: true, withBackgroundImage: true }, Header6: { withForm: true },
    Header7: { centered: true, withForm: true }, Header8: { withColumns: true, withForm: true },
  };

  if (variant === 'Header9') {
    const [isVisible, domRef] = useVisibility();
    return (
      <section className={`py-24 px-4 ${styles}`} data-class-change>
        <div className="container mx-auto">
          <div className={`grid gap-4 items-center lg:grid-cols-2 fade-section fade-up ${isVisible ? 'is-visible' : ''}`} ref={domRef}>
            <div>
              {f.Tagline && <p className="text-xs font-semibold tracking-widest uppercase mb-4">{f.Tagline}</p>}
              <h1 className="text-6xl font-medium mb-6">{f.Heading}</h1>
              {f.Body && <div className="text-lg" dangerouslySetInnerHTML={{ __html: f.Body }} />}
              <div className="flex gap-4 mt-8"><BtnLink link={f.Link1} variant="secondary" /><BtnLink link={f.Link2} variant="outline" /></div>
            </div>
            <div><div className="backdrop-blur-lg p-6 rounded-2xl"><Img img={f.Image} className="w-full h-auto rounded-2xl" /></div></div>
          </div>
        </div>
      </section>
    );
  }

  if (variant === 'Header10') {
    return (
      <section className={`relative py-24 px-4 ${styles}`} data-class-change>
        <div className="container mx-auto">
          <div className="max-w-3xl">
            {f.Tagline && <p className="text-xs font-semibold tracking-widest uppercase mb-4">{f.Tagline}</p>}
            <h2 className="text-4xl font-bold mb-6">{f.Heading}</h2>
            {f.Body && <div className="text-base" dangerouslySetInnerHTML={{ __html: f.Body }} />}
            <div className="flex gap-4 mt-8">
              {f.Link1.href && <a href={f.Link1.href} className="flex items-center gap-2 text-base text-primary font-medium">{f.Link1.text} &rsaquo;</a>}
            </div>
          </div>
        </div>
      </section>
    );
  }

  return <HeaderTemplate fields={f} styles={styles} {...(cfg[variant] || {})} />;
};
