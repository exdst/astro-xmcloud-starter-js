import type React from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

// Shared types
export interface ProductItem {
  productName: string;
  productThumbnail: string;
  productThumbnailAlt: string;
  productBasePrice: string;
  productFeatureTitle: string;
  productFeatureText: string;
  productDrivingRange: string;
  url: string;
}

export interface ProductListingIslandProps {
  variant: string;
  title: string;
  products: ProductItem[];
  viewAllLinkHref: string;
  viewAllLinkText: string;
  styles?: string;
  dictionary?: {
    drivingRange: string;
    seeFullSpecs: string;
    price: string;
  };
}

function useMatchMedia(query: string): boolean {
  const [matches, setMatches] = useState(false);
  if (typeof window !== "undefined") {
    const mql = window.matchMedia(query);
    if (mql.matches !== matches) {
      // This is intentionally synchronous for SSR compat
    }
  }
  return matches;
}

// --- Card Spotlight Wrapper ---
function CardSpotlightWrapper({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn("rounded-default duration-400 bg-secondary group relative self-stretch transition-all", className)} data-component="CardSpotlight">
      <div className="relative z-[2] flex h-full w-full transition-all duration-300">
        {children}
      </div>
    </div>
  );
}

// --- Product Card ---
function ProductListingCard({
  product,
  viewAllLinkHref,
  viewAllLinkText,
  dictionary,
}: {
  product: ProductItem;
  viewAllLinkHref: string;
  viewAllLinkText: string;
  dictionary: ProductListingIslandProps["dictionary"];
}) {
  const d = dictionary || { drivingRange: "Driving Range", seeFullSpecs: "See Full Specs", price: "Starting at" };

  return (
    <CardSpotlightWrapper className="h-full w-full">
    <article className="@md:px-12 @md:py-12 font-heading relative z-10 flex w-full flex-col gap-8 px-6 py-10" data-component="ProductListingCard">
      <div className="relative overflow-hidden">
        {product.productThumbnail && (
          <img src={product.productThumbnail} alt={product.productThumbnailAlt} className="mx-auto" />
        )}
      </div>

      <div className="space-y-6">
        <div className="space-y-2">
          <h3 className="text-secondary-foreground text-2xl font-semibold">{product.productName}</h3>
          {product.productBasePrice && (
            <p className="text-muted-foreground text-base font-light">
              {d.price} {product.productBasePrice}
            </p>
          )}
        </div>

        <div className="border-muted-foreground border-t pt-4">
          <h4 className="text-secondary-foreground font-regular text-xl mb-2">{product.productFeatureTitle}</h4>
          <p className="text-muted-foreground text-sm font-light whitespace-pre-line">{product.productFeatureText}</p>
        </div>

        <div className="border-muted-foreground border-t pt-4">
          <h4 className="text-secondary-foreground font-regular text-xl">{product.productDrivingRange}</h4>
          <p className="text-muted-foreground text-sm font-light">{d.drivingRange}</p>
        </div>

        <div className="space-y-2 pt-2">
          {viewAllLinkHref && (
            <Button className="w-full" asChild>
              <a href={viewAllLinkHref}>{viewAllLinkText}</a>
            </Button>
          )}
          {product.url && (
            <Button variant="outline" className="w-full bg-transparent" asChild>
              <a href={product.url}>{d.seeFullSpecs}</a>
            </Button>
          )}
        </div>
      </div>
    </article>
    </CardSpotlightWrapper>
  );
}

// --- Default variant ---
function ProductListingDefault(props: Omit<ProductListingIslandProps, "variant">) {
  const { title, products, viewAllLinkHref, viewAllLinkText, styles = "", dictionary } = props;
  const [activeCard, setActiveCard] = useState<string | null>(null);

  const getCardClasses = (productId: string) =>
    cn(
      "transition-all duration-500 ease-in-out",
      activeCard !== null && activeCard !== productId ? "opacity-50 scale-95 blur-[2px]" : "",
      activeCard === productId ? "scale-105 z-10" : ""
    );

  const visibleProducts = products.slice(0, 3);
  const leftColumnProducts = visibleProducts.slice(0, 1);
  const rightColumnProducts = visibleProducts.slice(1);

  return (
    <section
      className={cn("@container transform-gpu border-b-2 border-t-2 [.border-b-2+&]:border-t-0", { [styles]: styles })}
      aria-labelledby="product-listing-heading"
    >
      <div className="@md:px-6 @md:py-20 @lg:py-28 mx-auto max-w-screen-xl px-4 py-12">
        <div className="@md:grid-cols-2 @md:gap-[68px] grid grid-cols-1 gap-[40px]">
          <div className="@md:col-span-1">
            <div className="mb-16">
              <h2 id="product-listing-heading" className="@md:text-6xl @lg:text-7xl w-full text-pretty text-8xl font-light tracking-tight antialiased">
                {title}
              </h2>
            </div>
            {leftColumnProducts.length > 0 && (
              <div className="flex flex-col gap-[60px]">
                {leftColumnProducts.map((product, index) => (
                  <div
                    key={`left-${index}`}
                    className={getCardClasses(`left-${index}`)}
                    onMouseEnter={() => setActiveCard(`left-${index}`)}
                    onMouseLeave={() => setActiveCard(null)}
                    onFocus={() => setActiveCard(`left-${index}`)}
                    onBlur={() => setActiveCard(null)}
                  >
                    <ProductListingCard product={product} viewAllLinkHref={viewAllLinkHref} viewAllLinkText={viewAllLinkText} dictionary={dictionary} />
                  </div>
                ))}
              </div>
            )}
          </div>
          {rightColumnProducts.length > 0 && (
            <div className="@md:col-span-1 @md:pt-16">
              <div className="flex flex-col gap-[60px]">
                {rightColumnProducts.map((product, index) => (
                  <div
                    key={`right-${index}`}
                    className={getCardClasses(`right-${index}`)}
                    onMouseEnter={() => setActiveCard(`right-${index}`)}
                    onMouseLeave={() => setActiveCard(null)}
                    onFocus={() => setActiveCard(`right-${index}`)}
                    onBlur={() => setActiveCard(null)}
                  >
                    <ProductListingCard product={product} viewAllLinkHref={viewAllLinkHref} viewAllLinkText={viewAllLinkText} dictionary={dictionary} />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

// --- ThreeUp variant ---
function ProductListingThreeUp(props: Omit<ProductListingIslandProps, "variant">) {
  const { title, products, viewAllLinkHref, viewAllLinkText, styles = "", dictionary } = props;
  const [activeCard, setActiveCard] = useState<string | null>(null);

  const getCardClasses = (productId: string) =>
    cn(
      "transition-all duration-500 ease-in-out h-full",
      activeCard !== null && activeCard !== productId ? "opacity-50 scale-95 blur-[2px]" : "",
      activeCard === productId ? "scale-105 z-10" : ""
    );

  return (
    <section
      className={cn("@container @md:px-6 mx-auto max-w-screen-xl border-b-2 border-t-2 py-12 [.border-b-2+&]:border-t-0", { [styles]: styles })}
      data-component="ProductListingThreeUp"
      aria-labelledby="product-listing-threeup-heading"
    >
      <div className="mb-12 flex flex-col items-start justify-between">
        <h2 id="product-listing-threeup-heading" className="w-full text-pretty text-5xl font-light tracking-tight antialiased">
          {title}
        </h2>
      </div>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {products.map((product, index) => (
          <div
            key={`product-${index}`}
            className={getCardClasses(`product-${index}`)}
            onMouseEnter={() => setActiveCard(`product-${index}`)}
            onMouseLeave={() => setActiveCard(null)}
            onFocus={() => setActiveCard(`product-${index}`)}
            onBlur={() => setActiveCard(null)}
          >
            <ProductListingCard product={product} viewAllLinkHref={viewAllLinkHref} viewAllLinkText={viewAllLinkText} dictionary={dictionary} />
          </div>
        ))}
      </div>
    </section>
  );
}

// --- Slider variant ---
function ProductListingSlider(props: Omit<ProductListingIslandProps, "variant">) {
  const { title, products, viewAllLinkHref, viewAllLinkText, styles = "", dictionary } = props;
  const [activeCard, setActiveCard] = useState<string | null>(null);

  const getCardClasses = (productId: string) =>
    cn(
      "transition-all duration-500 ease-in-out h-full",
      activeCard !== null && activeCard !== productId ? "opacity-50 scale-95 blur-[2px]" : "",
      activeCard === productId ? "scale-102 z-10" : ""
    );

  return (
    <section
      className={cn("@container transform-gpu border-b-2 border-t-2 [.border-b-2+&]:border-t-0", { [styles]: styles })}
      aria-labelledby="product-listing-slider-heading"
    >
      <div className="@md:py-20 @lg:py-28 py-12">
        <div className="@xl:px-0 @md:pb-0 mx-auto max-w-screen-xl px-0 pb-10 [&:not(.px-4_&):not(.px-6_&):not(.px-8_&):not(.px-10_&)]:px-6">
          <div>
            <h2 id="product-listing-slider-heading" className={cn("@md:w-1/2 w-full")}>{title}</h2>
          </div>
        </div>
        <div className="flex gap-6 overflow-x-auto px-6 pb-4">
          {products.map((product, index) => (
            <div
              key={`product-${index}`}
              className={cn("max-w-[546px] flex-shrink-0", getCardClasses(`product-${index}`))}
              onMouseEnter={() => setActiveCard(`product-${index}`)}
              onMouseLeave={() => setActiveCard(null)}
              onFocus={() => setActiveCard(`product-${index}`)}
              onBlur={() => setActiveCard(null)}
            >
              <ProductListingCard product={product} viewAllLinkHref={viewAllLinkHref} viewAllLinkText={viewAllLinkText} dictionary={dictionary} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// --- Card variant (same as Default for now) ---
function ProductListingCardVariant(props: Omit<ProductListingIslandProps, "variant">) {
  return <ProductListingDefault {...props} />;
}

// --- Main dispatcher ---
export function ProductListingIsland(props: ProductListingIslandProps) {
  const { variant, ...rest } = props;
  switch (variant) {
    case "ThreeUp":
      return <ProductListingThreeUp {...rest} />;
    case "Slider":
      return <ProductListingSlider {...rest} />;
    case "Card":
      return <ProductListingCardVariant {...rest} />;
    case "Default":
    default:
      return <ProductListingDefault {...rest} />;
  }
}
