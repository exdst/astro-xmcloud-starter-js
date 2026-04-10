import { useState, useEffect } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

interface ColorData {
  id: string;
  displayName: string;
  value: string;
}

interface ProductImageData {
  id: string;
  url: string;
}

interface ProductPageHeaderSTProps {
  styles: string;
  productName: string;
  description: string;
  price: string;
  colors: ColorData[];
  images: ProductImageData[];
  warrantyLinkHref: string;
  warrantyLinkText: string;
  shippingLinkHref: string;
  shippingLinkText: string;
}

export function ProductPageHeaderSTIsland(props: ProductPageHeaderSTProps) {
  const [selectedColor, setSelectedColor] = useState<ColorData | null>(null);

  useEffect(() => {
    if (!selectedColor && props.colors?.length > 0) {
      setSelectedColor(props.colors[0]);
    }
  }, [props.colors, selectedColor]);

  const images = props.images ?? [];
  const productImages = images.length === 2 ? [...images, ...images] : images;

  return (
    <section
      className={`relative flex flex-col lg:justify-end lg:items-end lg:pt-12 lg:min-h-[50rem] overflow-hidden ${props.styles}`}
      data-class-change
    >
      <div className="lg:absolute inset-0 z-10 h-128 lg:h-full **:h-full">
        <Carousel opts={{ loop: true, align: "start" }} className="relative">
          <CarouselContent fullWidth>
            {productImages.map((image) => (
              <CarouselItem
                key={image.id}
                className={`bg-cover bg-center ${
                  productImages.length === 1
                    ? "w-full"
                    : "basis-[calc(100%-3.5rem)] lg:basis-1/2"
                }`}
                style={{ backgroundImage: `url(${image.url})` }}
              />
            ))}
          </CarouselContent>
          <div className="absolute bottom-6 lg:bottom-14 left-0 !h-10 w-full lg:w-1/2 flex items-center justify-center gap-2">
            <CarouselPrevious className="static inset-0 translate-0 h-10 w-10 bg-secondary hover:bg-secondary-hover border-0 disabled:hidden" />
            <CarouselNext className="static inset-0 translate-0 h-10 w-10 bg-secondary hover:bg-secondary-hover border-0 disabled:hidden" />
          </div>
        </Carousel>
      </div>

      <div className="relative flex flex-col gap-6 p-10 lg:w-1/3 lg:max-w-md bg-white z-20">
        <h1 className="text-2xl">{props.productName}</h1>
        <p className="text-sm">{props.description}</p>
        <p className="border-t border-b border-border font-(family-name:--font-accent) font-medium text-base py-6">
          {props.price}
        </p>

        <div className="flex items-center gap-4">
          <div className="flex gap-3">
            {props.colors?.map((color) => {
              const isSelected = selectedColor?.id === color?.id;
              return (
                <div
                  key={color.id}
                  onClick={() => setSelectedColor(color)}
                  className="relative w-9 h-9 rounded-full cursor-pointer border"
                  style={{ borderColor: isSelected ? color.value : "#ffffff00" }}
                >
                  <div
                    className="absolute inset-[2px] rounded-full"
                    style={{ backgroundColor: color.value }}
                  />
                </div>
              );
            })}
          </div>
          {selectedColor && (
            <span className="text-sm font-(family-name:--font-accent) font-medium">
              {selectedColor.displayName}
            </span>
          )}
        </div>

        <button className="btn btn-primary btn-sharp cursor-pointer">Add to cart</button>

        <div className="flex flex-col items-start gap-4 border-t border-border pt-6 text-sm">
          {props.warrantyLinkHref && (
            <a href={props.warrantyLinkHref} className="flex items-center gap-2">
              {props.warrantyLinkText}
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
            </a>
          )}
          {props.shippingLinkHref && (
            <a href={props.shippingLinkHref} className="flex items-center gap-2">
              {props.shippingLinkText}
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
            </a>
          )}
        </div>
      </div>
    </section>
  );
}
