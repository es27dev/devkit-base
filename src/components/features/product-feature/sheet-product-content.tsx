// React Core
import { useState } from "react";

// External Libraries
import { useTranslation } from "react-i18next";
import { ArrowLeft, ArrowRight } from "lucide-react";

// Base Components (shadcn/ui)
import { Button } from "@/components/base/button";

// Feature Components
// (none)

// Local Module
import { useProductFeature } from "./product-feature-context";

interface TabData {
  title: string;
  description: string[];
  details: { [key: string]: string };
}

export function SheetProductContent({}) {
  // 1. Hooks
  const { t } = useTranslation();
  const { selectedKey } = useProductFeature();
  const [activeTab, setActiveTab] = useState("1");

  // 2. Data Loading
  const featureData = t(`feature.featureDetail.${selectedKey}`, {
    returnObjects: true,
  }) as Record<string, TabData>;

  // 3. Early Returns (Validation)
  if (!featureData || Object.keys(featureData).length === 0) {
    return <div className="p-4">Keine Daten für "{selectedKey}" verfügbar</div>;
  }

  // 4. Derived State (Data Transformation)
  const tabContent = Object.keys(featureData)
    .filter((tabKey) => featureData[tabKey]?.title)
    .map((tabKey, index) => ({
      value: String(index + 1),
      key: tabKey,
      label: featureData[tabKey].title,
    }));

  if (tabContent.length === 0) {
    return <div className="p-4">Keine Tabs mit Titel gefunden</div>;
  }

  const currentIndex = tabContent.findIndex((t) => t.value === activeTab);
  const currentTab = tabContent.find((t) => t.value === activeTab)!;
  const tabKey = currentTab.key;

  // 5. Event Handlers
  const goToNext = () => {
    if (currentIndex < tabContent.length - 1) {
      setActiveTab(tabContent[currentIndex + 1].value);
    }
  };

  const goToPrev = () => {
    if (currentIndex > 0) {
      setActiveTab(tabContent[currentIndex - 1].value);
    }
  };

  // 6. Render

  return (
    <div className={`flex flex-col h-full w-full`}>
      <h1 className="font-semibold text-sm px-4 py-2">
        {featureData[tabKey].title}
      </h1>
      <div className="flex-1 space-y-4 px-4 overflow-y-auto">
        {featureData[tabKey].description.map((desc, idx) => (
          <span key={idx} className="text-sm block">
            {desc}
          </span>
        ))}

        <ul className="space-y-1 p-4 ">
          {Object.entries(featureData[tabKey].details).map(
            ([detailKey, detail]) => (
              <li key={detailKey} className="flex gap-2">
                <span>•</span>
                <span>{detail}</span>
              </li>
            )
          )}
        </ul>
      </div>
      <div className="h-16 p-2 w-full bg-background grid grid-cols-[auto_auto_1fr] items-center gap-2 px-4 border-t shrink-0">
        <Button
          onClick={goToPrev}
          disabled={currentIndex === 0}
          variant="ghost"
          className="justify-self-start"
          size="sm"
        >
          <ArrowLeft size={16} />
        </Button>
        <span className="text-xs text-center text-muted-foreground">
          {currentIndex + 1} / {tabContent.length}
        </span>
        <Button
          onClick={goToNext}
          disabled={currentIndex === tabContent.length - 1}
          variant="ghost"
          className="justify-self-end whitespace-normal text-right h-auto"
          size="sm"
        >
          <span className="line-clamp-3">
            {currentIndex < tabContent.length - 1 &&
              tabContent[currentIndex + 1].label}
          </span>
          <ArrowRight size={16} className="shrink-0" />
        </Button>
      </div>
    </div>
  );
}
