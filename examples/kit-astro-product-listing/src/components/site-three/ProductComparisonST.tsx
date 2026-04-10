import { useMemo } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

interface ProductData {
  id: string;
  imageSrc: string;
  imageAlt: string;
  name: string;
  price: string;
  ampPower: string;
  specs: string[];
  url: string;
}

interface ProductComparisonSTProps {
  styles: string;
  title: string;
  products: ProductData[];
  showButton: boolean;
}

export function ProductComparisonSTIsland({ styles, title, products, showButton }: ProductComparisonSTProps) {
  return (
    <section className={`relative ${styles}`} data-class-change>
      <div className="container mx-auto px-4">
        <h2 className="max-w-3xl mx-auto text-center text-2xl lg:text-5xl uppercase mb-16">
          {title}
        </h2>

        <Carousel opts={{ loop: true }} className="relative text-center">
          <CarouselContent className="-ml-10">
            {products.map((product) => {
              const basis = products.length < 3 ? products.length : 3;
              return (
                <CarouselItem key={product.id} className={`basis-full lg:basis-1/${basis} pl-10`}>
                  <div className="grid gap-4">
                    <div className="px-10">
                      {product.imageSrc && (
                        <img
                          src={product.imageSrc}
                          alt={product.imageAlt}
                          className="aspect-square w-full h-full object-contain max-w-2xs mx-auto"
                        />
                      )}
                    </div>
                    <h3 className="text-xl lg:text-2xl mt-8 mb-3">{product.name}</h3>
                    <p className="text-xl lg:text-2xl">{product.price}</p>
                    {showButton && (
                      <a href={product.url} className="btn btn-primary mt-3 justify-self-center">
                        Buy Now
                      </a>
                    )}
                    <hr className="border-border my-10" />
                    <p className="text-lg lg:text-xl font-medium">{product.ampPower}</p>
                    {product.specs.map((spec, i) => (
                      <p key={`${product.id}-${i}`} className="text-sm lg:text-base">
                        {spec}
                      </p>
                    ))}
                  </div>
                </CarouselItem>
              );
            })}
          </CarouselContent>
          <CarouselPrevious className="disabled:hidden left-0 h-10 w-10 bg-secondary hover:bg-secondary-hover border-0" />
          <CarouselNext className="disabled:hidden right-0 h-10 w-10 bg-secondary hover:bg-secondary-hover border-0" />
        </Carousel>
      </div>
    </section>
  );
}
