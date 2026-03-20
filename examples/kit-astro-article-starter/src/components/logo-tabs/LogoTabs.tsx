import { useState, useCallback } from "react";

interface LogoTabItem {
  id: string;
  label: string;
  logo?: string;
  title: string;
  description: string;
  backgroundImage?: string;
}

interface LogoTabsProps {
  items: LogoTabItem[];
  title?: string;
}

export function Default({ items, title }: LogoTabsProps) {
  const [activeTab, setActiveTab] = useState(0);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "ArrowRight") {
        setActiveTab((prev) => (prev === items.length - 1 ? 0 : prev + 1));
      } else if (e.key === "ArrowLeft") {
        setActiveTab((prev) => (prev === 0 ? items.length - 1 : prev - 1));
      } else if (e.key === "Home") {
        setActiveTab(0);
      } else if (e.key === "End") {
        setActiveTab(items.length - 1);
      }
    },
    [items.length]
  );

  if (!items || items.length === 0) {
    return <div className="text-center text-gray-500">No content available</div>;
  }

  const current = items[activeTab];

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-8">
      {title && (
        <h2 className="text-3xl font-bold text-center mb-8">{title}</h2>
      )}

      <div className="relative rounded-xl overflow-hidden min-h-[400px]">
        {current.backgroundImage && (
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${current.backgroundImage})` }}
          >
            <div className="absolute inset-0 bg-black/50" />
          </div>
        )}

        <div className="relative z-10 p-8 md:p-12">
          <div
            className="flex flex-wrap gap-4 mb-8 justify-center"
            role="tablist"
            aria-label="Logo tabs"
            onKeyDown={handleKeyDown}
          >
            {items.map((item, index) => (
              <button
                key={item.id}
                role="tab"
                aria-selected={index === activeTab}
                aria-controls={`logo-tabpanel-${item.id}`}
                tabIndex={index === activeTab ? 0 : -1}
                onClick={() => setActiveTab(index)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                  index === activeTab
                    ? "bg-white text-gray-900 shadow-lg"
                    : "bg-white/20 text-white hover:bg-white/30"
                }`}
              >
                {item.logo && (
                  <img
                    src={item.logo}
                    alt=""
                    className="w-6 h-6 object-contain"
                  />
                )}
                <span className="text-sm font-medium">{item.label}</span>
              </button>
            ))}
          </div>

          <div
            id={`logo-tabpanel-${current.id}`}
            role="tabpanel"
            className="text-center"
          >
            <h3
              className={`text-2xl md:text-3xl font-bold mb-4 ${
                current.backgroundImage ? "text-white" : "text-gray-900"
              }`}
            >
              {current.title}
            </h3>
            <p
              className={`text-lg max-w-2xl mx-auto ${
                current.backgroundImage ? "text-gray-200" : "text-gray-600"
              }`}
            >
              {current.description}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
