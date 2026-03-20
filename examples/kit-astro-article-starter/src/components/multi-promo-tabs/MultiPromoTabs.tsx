import { useState } from "react";

interface PromoItem {
  id: string;
  title: string;
  description: string;
  image?: string;
  link?: {
    href: string;
    text: string;
  };
}

interface TabData {
  id: string;
  label: string;
  items: PromoItem[];
}

interface MultiPromoTabsProps {
  tabs: TabData[];
  title?: string;
}

export function Default({ tabs, title }: MultiPromoTabsProps) {
  const [activeTab, setActiveTab] = useState(0);

  if (!tabs || tabs.length === 0) {
    return <div className="text-center text-gray-500">No content available</div>;
  }

  const currentTab = tabs[activeTab];

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-8">
      {title && (
        <h2 className="text-3xl font-bold text-center mb-8">{title}</h2>
      )}

      <div className="border-b border-gray-200 mb-8">
        <nav className="flex gap-0 -mb-px" role="tablist" aria-label="Promo tabs">
          {tabs.map((tab, index) => (
            <button
              key={tab.id}
              role="tab"
              aria-selected={index === activeTab}
              aria-controls={`tabpanel-${tab.id}`}
              onClick={() => setActiveTab(index)}
              className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
                index === activeTab
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      <div
        id={`tabpanel-${currentTab.id}`}
        role="tabpanel"
        aria-labelledby={`tab-${currentTab.id}`}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {currentTab.items.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
            >
              {item.image && (
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-48 object-cover"
                />
              )}
              <div className="p-6">
                <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
                <p className="text-gray-600 text-sm mb-4">{item.description}</p>
                {item.link && (
                  <a
                    href={item.link.href}
                    className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                  >
                    {item.link.text || "Learn more"}
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
