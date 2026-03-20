import { useState, useCallback } from "react";

interface TestimonialItem {
  id: string;
  quote: string;
  author: string;
  role?: string;
  image?: string;
}

interface TestimonialCarouselProps {
  items: TestimonialItem[];
  title?: string;
}

export function Default({ items, title }: TestimonialCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const goToPrevious = useCallback(() => {
    setCurrentIndex((prev) => (prev === 0 ? items.length - 1 : prev - 1));
  }, [items.length]);

  const goToNext = useCallback(() => {
    setCurrentIndex((prev) => (prev === items.length - 1 ? 0 : prev + 1));
  }, [items.length]);

  if (!items || items.length === 0) {
    return <div className="text-center text-gray-500">No testimonials available</div>;
  }

  const current = items[currentIndex];

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-8">
      {title && (
        <h2 className="text-3xl font-bold text-center mb-8">{title}</h2>
      )}

      <div className="relative">
        <div className="overflow-hidden rounded-lg bg-white shadow-lg p-8 md:p-12">
          <blockquote className="text-center">
            <svg
              className="w-8 h-8 mx-auto mb-4 text-gray-300"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983z" />
            </svg>
            <p className="text-lg md:text-xl text-gray-700 mb-6 italic">
              {current.quote}
            </p>
            <div className="flex items-center justify-center gap-4">
              {current.image && (
                <img
                  src={current.image}
                  alt={current.author}
                  className="w-12 h-12 rounded-full object-cover"
                />
              )}
              <div>
                <cite className="not-italic font-semibold text-gray-900">
                  {current.author}
                </cite>
                {current.role && (
                  <p className="text-sm text-gray-500">{current.role}</p>
                )}
              </div>
            </div>
          </blockquote>
        </div>

        {items.length > 1 && (
          <>
            <button
              onClick={goToPrevious}
              className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 bg-white shadow-md rounded-full p-2 hover:bg-gray-50 transition-colors"
              aria-label="Previous testimonial"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={goToNext}
              className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 bg-white shadow-md rounded-full p-2 hover:bg-gray-50 transition-colors"
              aria-label="Next testimonial"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </>
        )}
      </div>

      {items.length > 1 && (
        <div className="flex justify-center gap-2 mt-6">
          {items.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-2.5 h-2.5 rounded-full transition-colors ${
                index === currentIndex ? "bg-gray-800" : "bg-gray-300"
              }`}
              aria-label={`Go to testimonial ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
