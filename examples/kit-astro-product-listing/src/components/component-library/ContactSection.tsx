'use client';

import { useState, type JSX } from 'react';

interface SerializedImage { src: string; alt: string; }
interface SerializedLink { href: string; text: string; target: string; }

interface ContactData {
  id: string;
  image: SerializedImage;
  heading: string;
  description: string;
  contactLink: SerializedLink;
  buttonLink: SerializedLink;
}

interface SectionData {
  tagLine: string;
  heading: string;
  body: string;
  image: SerializedImage;
}

interface ContactSectionProps {
  variant: string;
  styles: string;
  sectionData: SectionData;
  contacts: ContactData[];
  isEditing: boolean;
}

const Img = ({ img, className }: { img: SerializedImage; className?: string }) =>
  img.src ? <img src={img.src} alt={img.alt} className={className} loading="lazy" /> : null;

const ContactCardImage = ({ contact, size }: { contact: ContactData; size: 'sm' | 'md' | 'lg' }) => {
  const cls = size === 'sm' ? 'w-6 h-6' : size === 'lg' ? 'w-full' : 'w-12 h-12';
  const imgCls = size === 'lg' ? 'w-full h-full aspect-[3/2] object-cover' : 'w-full h-full object-contain';
  return <div className={cls}><Img img={contact.image} className={imgCls} /></div>;
};

const ContactCard = ({ contact: c, type, centered, isEditing }: { contact: ContactData; type: 'sm' | 'md' | 'lg' | 'horizontal' | 'noImage'; centered?: boolean; isEditing: boolean }) => {
  const buttons = (
    <>
      {c.contactLink.href && <a href={c.contactLink.href} className="underline">{c.contactLink.text}</a>}
      {(c.buttonLink.href || isEditing) && (
        <a href={c.buttonLink.href} className="inline-flex items-center px-0 text-sm font-medium hover:underline">
          {c.buttonLink.text} &rsaquo;
        </a>
      )}
    </>
  );

  const align = centered ? 'items-center text-center' : 'items-start';
  const justifyGrid = centered ? 'justify-items-center' : 'justify-items-start';

  switch (type) {
    case 'sm':
      return (
        <div className={`basis-full flex flex-col ${align}`}>
          <ContactCardImage contact={c} size="sm" />
          <h3 className="text-xl font-bold mt-4 mb-2">{c.heading}</h3>
          {c.description && <p className="mb-2">{c.description}</p>}
          <div className={`grid gap-2 ${justifyGrid}`}>{buttons}</div>
        </div>
      );
    case 'lg':
      return (
        <div className={`basis-full flex flex-col ${align}`}>
          <ContactCardImage contact={c} size="lg" />
          <h3 className="text-4xl font-bold mt-8 mb-4">{c.heading}</h3>
          {c.description && <p className="mb-6">{c.description}</p>}
          <div className={`grid gap-2 ${justifyGrid}`}>{buttons}</div>
        </div>
      );
    case 'horizontal':
      return (
        <div className="basis-full flex gap-4 items-start">
          <ContactCardImage contact={c} size="sm" />
          <div className="flex flex-col items-start">
            <h3 className="text-xl font-bold mb-2">{c.heading}</h3>
            {c.description && <p className="mb-2">{c.description}</p>}
            <div className="grid gap-2 justify-items-start">{buttons}</div>
          </div>
        </div>
      );
    case 'noImage':
      return (
        <div className="flex flex-col items-start">
          <h3 className="text-2xl font-bold mb-2">{c.heading}</h3>
          {c.description && <p className="mb-2">{c.description}</p>}
          <div className="grid gap-2 justify-items-start">{buttons}</div>
        </div>
      );
    default:
      return (
        <div className={`basis-full flex flex-col ${align}`}>
          <ContactCardImage contact={c} size="md" />
          <h3 className="text-3xl font-bold mt-6 mb-4">{c.heading}</h3>
          {c.description && <p className="mb-6">{c.description}</p>}
          <div className={`grid gap-4 ${justifyGrid}`}>{buttons}</div>
        </div>
      );
  }
};

const SectionHeader = ({ data, centered }: { data: SectionData; centered?: boolean }) => (
  <div className={`max-w-3xl ${centered ? 'mx-auto text-center' : ''}`}>
    {data.tagLine && <p className="font-semibold mb-4">{data.tagLine}</p>}
    <h2 className="text-5xl font-bold mb-4">{data.heading}</h2>
    {data.body && <div className="text-lg" dangerouslySetInnerHTML={{ __html: data.body }} />}
  </div>
);

export const ContactSectionIsland = (props: ContactSectionProps): JSX.Element => {
  const { variant, styles, sectionData, contacts, isEditing } = props;
  const [activeTab, setActiveTab] = useState(contacts[0]?.id || '');

  if (variant === 'ContactSection1') {
    return (
      <section className={`py-24 px-4 ${styles}`} data-class-change>
        <div className="container mx-auto">
          <SectionHeader data={sectionData} centered />
          <div className="flex flex-col md:flex-row gap-x-8 gap-y-12 mt-20">
            {contacts.map((c) => <ContactCard key={c.id} contact={c} type="md" centered isEditing={isEditing} />)}
          </div>
        </div>
      </section>
    );
  }

  if (variant === 'ContactSection2') {
    return (
      <section className={`py-24 px-4 ${styles}`} data-class-change>
        <div className="container mx-auto">
          <SectionHeader data={sectionData} />
          <div className="grid md:grid-cols-3 gap-x-20 gap-y-12 mt-20">
            <div className="flex flex-col gap-x-8 gap-y-12">
              {contacts.map((c) => <ContactCard key={c.id} contact={c} type="sm" isEditing={isEditing} />)}
            </div>
            <div className="relative md:col-span-2 min-h-80">
              <Img img={sectionData.image} className="absolute inset-0 w-full h-full object-cover" />
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (variant === 'ContactSection3') {
    return (
      <section className={`py-24 px-4 ${styles}`} data-class-change>
        <div className="container mx-auto">
          <div className="grid md:grid-cols-5 gap-x-12 gap-y-20">
            <div className="max-w-3xl md:col-span-3">
              {sectionData.tagLine && <p className="font-semibold mb-4">{sectionData.tagLine}</p>}
              <h2 className="text-5xl font-bold mb-4">{sectionData.heading}</h2>
              {sectionData.body && <div className="text-lg" dangerouslySetInnerHTML={{ __html: sectionData.body }} />}
            </div>
            <div className="flex flex-col gap-x-8 gap-y-12 md:col-span-2">
              {contacts.map((c) => <ContactCard key={c.id} contact={c} type="horizontal" isEditing={isEditing} />)}
            </div>
          </div>
          <Img img={sectionData.image} className="w-full h-full aspect-16/9 object-cover mt-20" />
        </div>
      </section>
    );
  }

  if (variant === 'ContactSection4') {
    return (
      <section className={`py-24 px-4 ${styles}`} data-class-change>
        <div className="container mx-auto">
          <SectionHeader data={sectionData} />
          <div className="flex flex-col md:flex-row gap-x-8 gap-y-12 mt-20">
            {contacts.map((c) => <ContactCard key={c.id} contact={c} type="lg" isEditing={isEditing} />)}
          </div>
        </div>
      </section>
    );
  }

  if (variant === 'ContactSection5') {
    return (
      <section className={`py-24 px-4 ${styles}`} data-class-change>
        <div className="container mx-auto">
          <SectionHeader data={sectionData} centered />
          <div className="flex flex-col md:flex-row gap-x-8 gap-y-12 mt-20">
            {contacts.map((c) => <ContactCard key={c.id} contact={c} type="lg" centered isEditing={isEditing} />)}
          </div>
        </div>
      </section>
    );
  }

  if (variant === 'ContactSection6') {
    return (
      <section className={`py-24 px-4 ${styles}`} data-class-change>
        <div className="container mx-auto">
          <SectionHeader data={sectionData} />
          <div className="grid md:grid-cols-3 gap-8 mt-20">
            <div className="grid gap-10">
              {contacts.map((c) => (
                <div
                  key={c.id}
                  onClick={() => setActiveTab(c.id)}
                  className={`ps-8 cursor-pointer border-s-2 ${activeTab !== c.id ? 'border-transparent' : ''}`}
                >
                  <ContactCard contact={c} type="noImage" isEditing={isEditing} />
                </div>
              ))}
            </div>
            <div className="relative md:col-span-2 min-h-80">
              {contacts.map((c) => (
                <div key={c.id} className={`absolute inset-0 transition-opacity duration-300 ${activeTab !== c.id ? 'opacity-0' : 'opacity-100'}`}>
                  <Img img={c.image} className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  // Default
  return (
    <section className={`py-24 px-4 ${styles}`} data-class-change>
      <div className="container mx-auto">
        <SectionHeader data={sectionData} />
        <div className="flex flex-col md:flex-row gap-x-8 gap-y-12 mt-20">
          {contacts.map((c) => <ContactCard key={c.id} contact={c} type="md" isEditing={isEditing} />)}
        </div>
      </div>
    </section>
  );
};
