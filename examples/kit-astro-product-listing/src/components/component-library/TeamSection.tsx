'use client';

import { type JSX, type ReactNode } from 'react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';

interface SI { src: string; alt: string; }
interface SL { href: string; text: string; target: string; }

interface TMData {
  id: string; image: SI; fullName: string; jobTitle: string; description: string;
  facebook: SL; instagram: SL; linkedIn: SL; twitterX: SL;
}

interface SecData {
  tagLine: string; heading: string; text: string; heading2: string; text2: string; link: SL;
}

interface Props { variant: string; styles: string; sectionData: SecData; members: TMData[]; }

const Img = ({ img, className }: { img: SI; className?: string }) =>
  img.src ? <img src={img.src} alt={img.alt} className={className} loading="lazy" /> : null;

const BtnLink = ({ link }: { link: SL }) =>
  link.href ? <a href={link.href} className="inline-flex items-center justify-center whitespace-nowrap rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground mt-8">{link.text}</a> : null;

const SocialIcon = ({ link, label, svg }: { link: SL; label: string; svg: string }) => {
  const valid = link.href && link.href !== '#' && !link.href.startsWith('http://#');
  const icon = <span className="w-5 h-5 inline-block" dangerouslySetInnerHTML={{ __html: svg }} />;
  return valid ? <a href={link.href} aria-label={label}>{icon}</a> : <span role="img" aria-label={label}>{icon}</span>;
};

const fbSvg = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" fill="currentColor"><path d="M512 256C512 114.6 397.4 0 256 0S0 114.6 0 256c0 120 82.7 220.8 194.2 248.5V330.3h-58.5V256h58.5v-56.6c0-57.7 34.4-89.6 87-89.6 25.2 0 51.5 4.5 51.5 4.5v56.8H304c-28.5 0-37.4 17.7-37.4 35.8V256h64l-10.2 74.3h-53.8v174.2C429.3 476.8 512 376 512 256z"/></svg>';
const igSvg = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" fill="currentColor"><path d="M224.1 141c-63.6 0-114.9 51.3-114.9 114.9s51.3 114.9 114.9 114.9S339 319.5 339 255.9 287.7 141 224.1 141zm0 189.6c-41.1 0-74.7-33.5-74.7-74.7s33.5-74.7 74.7-74.7 74.7 33.5 74.7 74.7-33.6 74.7-74.7 74.7zm146.4-194.3c0 14.9-12 26.8-26.8 26.8-14.9 0-26.8-12-26.8-26.8s12-26.8 26.8-26.8 26.8 12 26.8 26.8zm76.1 27.2c-1.7-35.9-9.9-67.7-36.2-93.9-26.2-26.2-58-34.4-93.9-36.2-37-2.1-147.9-2.1-184.9 0-35.8 1.7-67.6 9.9-93.9 36.1s-34.4 58-36.2 93.9c-2.1 37-2.1 147.9 0 184.9 1.7 35.9 9.9 67.7 36.2 93.9s58 34.4 93.9 36.2c37 2.1 147.9 2.1 184.9 0 35.9-1.7 67.7-9.9 93.9-36.2 26.2-26.2 34.4-58 36.2-93.9 2.1-37 2.1-147.8 0-184.8zM398.8 388c-7.8 19.6-22.9 34.7-42.6 42.6-29.5 11.7-99.5 9-132.1 9s-102.7 2.6-132.1-9c-19.6-7.8-34.7-22.9-42.6-42.6-11.7-29.5-9-99.5-9-132.1s-2.6-102.7 9-132.1c7.8-19.6 22.9-34.7 42.6-42.6 29.5-11.7 99.5-9 132.1-9s102.7-2.6 132.1 9c19.6 7.8 34.7 22.9 42.6 42.6 11.7 29.5 9 99.5 9 132.1s2.7 102.7-9 132.1z"/></svg>';
const liSvg = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" fill="currentColor"><path d="M100.3 448H7.4V148.9h92.9zM53.8 108.1C24.1 108.1 0 83.5 0 53.8a53.8 53.8 0 01107.6 0c0 29.7-24.1 54.3-53.8 54.3zM447.9 448h-92.7V302.4c0-34.7-.7-79.2-48.3-79.2-48.3 0-55.7 37.7-55.7 76.7V448h-92.8V148.9h89.1v40.8h1.3c12.4-23.5 42.7-48.3 87.9-48.3 94 0 111.3 61.9 111.3 142.3V448z"/></svg>';
const twSvg = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" fill="currentColor"><path d="M389.2 48h70.6L305.6 224.2 487 464H345L233.7 318.6 106.5 464H35.8L200.7 275.5 26.8 48H172.4L272.9 180.9 389.2 48zM364.4 421.8h39.1L151.1 88h-42L364.4 421.8z"/></svg>';

type ImgType = 'circle' | 'square' | 'rectangle';
type MemType = 'simple' | 'horizontal';

const TMImage = ({ image, type, className = '' }: { image: SI; type: ImgType; className?: string }) => {
  const cls = type === 'circle' ? `inline-block object-cover rounded-full ${className}` : type === 'rectangle' ? `inline-block w-full object-cover aspect-3/2 ${className}` : `inline-block w-full object-cover aspect-square ${className}`;
  return <Img img={image} className={cls} />;
};

const TMCard = ({ tm, type, imageType, centered }: { tm: TMData; type: MemType; imageType: ImgType; centered?: boolean }) => {
  const socials = (
    <div className={`flex ${centered ? 'justify-center' : ''} gap-4 mt-6`}>
      <SocialIcon link={tm.facebook} label="Facebook" svg={fbSvg} />
      <SocialIcon link={tm.instagram} label="Instagram" svg={igSvg} />
      <SocialIcon link={tm.linkedIn} label="LinkedIn" svg={liSvg} />
      <SocialIcon link={tm.twitterX} label="X (Twitter)" svg={twSvg} />
    </div>
  );

  if (type === 'horizontal') return (
    <div className="flex items-start gap-12">
      <TMImage image={tm.image} type={imageType} className="shrink-0 max-w-1/3" />
      <div><h3 className="text-lg font-bold">{tm.fullName}</h3><p className="text-lg mb-4">{tm.jobTitle}</p>{tm.description && <div dangerouslySetInnerHTML={{ __html: tm.description }} />}{socials}</div>
    </div>
  );

  return (
    <div className={centered ? 'text-center' : ''}>
      <TMImage image={tm.image} type={imageType} />
      <h3 className="text-lg font-bold mt-6">{tm.fullName}</h3><p className="text-lg mb-4">{tm.jobTitle}</p>
      {tm.description && <div dangerouslySetInnerHTML={{ __html: tm.description }} />}{socials}
    </div>
  );
};

const Vertical = ({ d, members, styles, columns, centered, mt, it, mc, children }: {
  d: SecData; members: TMData[]; styles: string; columns: number; centered?: boolean;
  mt: MemType; it: ImgType; mc?: boolean; children?: ReactNode;
}) => (
  <section className={`py-24 px-4 ${styles}`} data-class-change><div className="container mx-auto">
    <div className={centered ? 'max-w-3xl mx-auto text-center' : ''}>{d.tagLine && <p className="font-semibold mb-4">{d.tagLine}</p>}<h2 className="text-5xl font-bold mb-6">{d.heading}</h2>{d.text && <div className="text-lg" dangerouslySetInnerHTML={{ __html: d.text }} />}</div>
    <div className={`grid ${columns !== 1 ? `md:grid-cols-2 lg:grid-cols-${columns}` : ''} ${columns === 2 ? 'gap-16' : 'gap-x-8 gap-y-16'} my-20`}>{children || members.map((tm) => <TMCard key={tm.id} tm={tm} type={mt} imageType={it} centered={mc} />)}</div>
    <div className={centered ? 'max-w-3xl mx-auto text-center' : ''}><h3 className="text-3xl font-bold mb-4">{d.heading2}</h3>{d.text2 && <div className="text-lg" dangerouslySetInnerHTML={{ __html: d.text2 }} />}<BtnLink link={d.link} /></div>
  </div></section>
);

const Horizontal = ({ d, members, styles, columns, mt, it }: {
  d: SecData; members: TMData[]; styles: string; columns: number; mt: MemType; it: ImgType;
}) => (
  <section className={`py-24 px-4 ${styles}`} data-class-change><div className="container mx-auto">
    <div className={`grid md:grid-cols-${columns + 1} gap-x-16 gap-y-12`}>
      <div>{d.tagLine && <p className="font-semibold mb-4">{d.tagLine}</p>}<h2 className="text-5xl font-bold mb-6">{d.heading}</h2>{d.text && <div className="text-lg" dangerouslySetInnerHTML={{ __html: d.text }} />}<BtnLink link={d.link} /></div>
      <div className={`grid md:grid-cols-${columns} gap-8 md:col-span-${columns}`}>{members.map((tm) => <TMCard key={tm.id} tm={tm} type={mt} imageType={it} />)}</div>
    </div>
  </div></section>
);

export const TeamSectionIsland = (props: Props): JSX.Element => {
  const { variant, styles, sectionData: d, members } = props;

  const cfg: Record<string, any> = {
    Default:       { l: 'v', c: 3, ct: true, mt: 'simple', it: 'circle', mc: true },
    TeamSection1:  { l: 'v', c: 3, ct: true, mt: 'simple', it: 'rectangle', mc: true },
    TeamSection2:  { l: 'v', c: 4, ct: true, mt: 'simple', it: 'circle' },
    TeamSection3:  { l: 'v', c: 4, ct: true, mt: 'simple', it: 'square' },
    TeamSection4:  { l: 'v', c: 2, ct: true, mt: 'horizontal', it: 'circle' },
    TeamSection5:  { l: 'v', c: 2, ct: true, mt: 'horizontal', it: 'square' },
    TeamSection6:  { l: 'h', c: 2, mt: 'simple', it: 'circle' },
    TeamSection7:  { l: 'h', c: 2, mt: 'simple', it: 'rectangle' },
    TeamSection8:  { l: 'h', c: 1, mt: 'horizontal', it: 'circle' },
    TeamSection9:  { l: 'h', c: 1, mt: 'horizontal', it: 'square' },
    TeamSection10: { l: 'car', c: 1, mt: 'simple', it: 'circle' },
    TeamSection11: { l: 'car', c: 1, mt: 'simple', it: 'square' },
  };

  const c = cfg[variant] || cfg['Default'];

  if (c.l === 'h') return <Horizontal d={d} members={members} styles={styles} columns={c.c} mt={c.mt} it={c.it} />;

  if (c.l === 'car') return (
    <Vertical d={d} members={members} styles={styles} columns={c.c} centered mt={c.mt} it={c.it}>
      <Carousel><CarouselContent className="pb-16">{members.map((tm) => (<CarouselItem key={tm.id} className="md:basis-1/2 lg:basis-1/3"><TMCard tm={tm} type={c.mt} imageType={c.it} /></CarouselItem>))}</CarouselContent><div className="absolute bottom-0 right-0 flex items-center gap-2"><CarouselPrevious className="relative inset-0 translate-0" /><CarouselNext className="relative inset-0 translate-0" /></div></Carousel>
    </Vertical>
  );

  return <Vertical d={d} members={members} styles={styles} columns={c.c} centered={c.ct} mt={c.mt} it={c.it} mc={c.mc} />;
};
