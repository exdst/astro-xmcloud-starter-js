'use client';

import { useEffect, useMemo, useState, type JSX } from 'react';
import {
  Carousel,
  type CarouselApi,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';

interface SI { src: string; alt: string; }
interface SL { href: string; text: string; target: string; }

interface ProductData {
  id: string; productImage: SI; productTagLine: string; productLink: SL;
  productDescription: string; productPrice: string; productDiscountedPrice: string;
}

interface Props {
  styles: string; renderingId: string;
  sectionData: { heading: string; link: SL };
  products: ProductData[];
}

function useSlidesToScroll() {
  const [n, setN] = useState(1);
  useEffect(() => {
    const calc = () => setN(window.innerWidth < 640 ? 1 : window.innerWidth < 1024 ? 2 : 4);
    calc();
    window.addEventListener('resize', calc);
    return () => window.removeEventListener('resize', calc);
  }, []);
  return n;
}

export const ProductsSectionIsland = (props: Props): JSX.Element => {
  const { styles, renderingId, sectionData: d, products } = props;
  const slidesToScroll = useSlidesToScroll();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [api, setApi] = useState<CarouselApi>();

  useEffect(() => {
    if (!api) return;
    const onSelect = () => setCurrentSlide(api.selectedScrollSnap());
    api.on('select', onSelect);
    onSelect();
    return () => { api.off('select', onSelect); };
  }, [api]);

  const start = currentSlide * slidesToScroll + 1;
  const end = Math.min(start + slidesToScroll - 1, products.length);

  const paddedItems = useMemo(() => {
    const r = products.length % slidesToScroll;
    return r === 0 ? products : [...products, ...Array(slidesToScroll - r).fill(null)];
  }, [products, slidesToScroll]);

  return (
    <section className={`py-24 ${styles}`} id={renderingId || undefined} data-class-change>
      <div className="container px-4 mx-auto">
        <div className="mb-8">
          <h2 className="text-4xl font-medium mb-4">{d.heading}</h2>
          <div className="flex gap-8">
            <p className="text-base">Showing {start} through {end} of {products.length} items</p>
            {d.link.href && <a href={d.link.href} className="flex items-center gap-2 text-base text-primary font-medium">{d.link.text} &rsaquo;</a>}
          </div>
        </div>
        <Carousel setApi={setApi} opts={{ align: 'start', slidesToScroll }} className="container relative px-12 mx-auto">
          <CarouselContent className="py-4 -ml-0">
            {paddedItems.map((p: ProductData | null, i: number) => (
              <CarouselItem key={p?.id || i} className="pl-2 pr-2 md:basis-1/2 lg:basis-1/4">
                {p ? (
                  <div className="flex flex-col items-start justify-end h-full shadow-md pointer">
                    {p.productImage.src && <img src={p.productImage.src} alt={p.productImage.alt} className="w-full h-auto object-cover" loading="lazy" />}
                    <div className="flex-1 relative pt-4 px-6">
                      {p.productTagLine && <div className="inline-block text-base font-bold px-2 py-1 mb-2 bg-[#ffb900]">{p.productTagLine}</div>}
                      <h3 className="mb-2 text-base font-bold text-primary underline">
                        {p.productLink.href ? <a href={p.productLink.href}>{p.productLink.text}</a> : p.productLink.text}
                      </h3>
                      <div className="text-base mb-4">
                        <span>From</span>{' '}
                        <span className={p.productDiscountedPrice ? 'opacity-70 line-through' : 'font-bold'}>{p.productPrice}</span>{' '}
                        {p.productDiscountedPrice && <span className="font-bold">{p.productDiscountedPrice}</span>}
                      </div>
                      <p className="text-base mb-4">{p.productDescription}</p>
                    </div>
                  </div>
                ) : <div className="opacity-0"></div>}
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="left-0 border-transparent bg-transparent shadow-none" />
          <CarouselNext className="right-0 border-transparent bg-transparent shadow-none" />
        </Carousel>
      </div>
    </section>
  );
};
