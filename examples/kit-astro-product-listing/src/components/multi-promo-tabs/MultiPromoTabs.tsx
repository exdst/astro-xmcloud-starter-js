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
  image1?: string;
  image2?: string;
  link1?: { href: string; text: string };
  link2?: { href: string; text: string };
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
    <div className="@container bg-primary @md:p-12 @md:my-16 my-8 w-full">
      {title && (
        <h2 className="text-primary-foreground @md:text-6xl font-heading @sm:text-5xl -ml-1 mb-8 max-w-[20ch] text-pretty text-4xl font-normal leading-[1.1333] tracking-tighter md:max-w-[17.5ch]">
          {title}
        </h2>
      )}

      {/* Tab buttons */}
      <div className="flex gap-2">
        {tabs.map((tab, index) => (
          <button
            key={tab.id}
            role="tab"
            aria-selected={index === activeTab}
            aria-controls={`tabpanel-${tab.id}`}
            onClick={() => setActiveTab(index)}
            className={`font-body rounded-md border border-accent px-4 py-2 text-base font-normal transition-all duration-300 ${
              index === activeTab
                ? "bg-accent text-accent-foreground hover:bg-accent/90"
                : "bg-transparent text-white hover:bg-accent hover:text-accent-foreground"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab content - 2 column image grid */}
      <div
        id={`tabpanel-${currentTab.id}`}
        role="tabpanel"
        aria-labelledby={`tab-${currentTab.id}`}
      >
        <div className="@md:grid-cols-2 @md:my-16 my-8 grid grid-cols-1 gap-6">
          {currentTab.image1 && (
            <div
              className="group/card1 relative block cursor-pointer overflow-hidden rounded-2xl"
              onClick={() => {
                if (currentTab.link1?.href) {
                  window.location.href = currentTab.link1.href;
                }
              }}
            >
              <div className="flex h-full w-full overflow-hidden">
                <img
                  src={currentTab.image1}
                  alt=""
                  className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover/card1:scale-105"
                />
              </div>
              {currentTab.link1?.href && (
                <a
                  href={currentTab.link1.href}
                  className="bg-popover text-popover-foreground font-body absolute bottom-4 left-4 flex items-center gap-2 rounded-lg px-4 py-2 backdrop-blur-sm transition-all duration-500 group-hover/card1:translate-x-2"
                >
                  {currentTab.link1.text}
                  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="7" y1="17" x2="17" y2="7" />
                    <polyline points="7 7 17 7 17 17" />
                  </svg>
                </a>
              )}
            </div>
          )}
          {currentTab.image2 && (
            <div
              className="group/card2 relative block cursor-pointer overflow-hidden rounded-2xl"
              onClick={() => {
                if (currentTab.link2?.href) {
                  window.location.href = currentTab.link2.href;
                }
              }}
            >
              <div className="flex h-full w-full overflow-hidden">
                <img
                  src={currentTab.image2}
                  alt=""
                  className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover/card2:scale-105"
                />
              </div>
              {currentTab.link2?.href && (
                <a
                  href={currentTab.link2.href}
                  className="bg-popover text-popover-foreground font-body absolute bottom-4 left-4 flex items-center gap-2 rounded-lg px-4 py-2 backdrop-blur-sm transition-all duration-500 group-hover/card2:translate-x-2"
                >
                  {currentTab.link2.text}
                  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="7" y1="17" x2="17" y2="7" />
                    <polyline points="7 7 17 7 17 17" />
                  </svg>
                </a>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
