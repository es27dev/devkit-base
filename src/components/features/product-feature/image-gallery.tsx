//###--------------------------------------------------------IMPORTS-----------------------------------------------------------------------##
//#region IMPORTS
//#region Core/Libs

//  React Core
import { useEffect, useState } from "react";

//  External Libraries
import { useTranslation } from "react-i18next";
//#endregion

//#region Components

//Components - base (shadcn)
import { Button } from "../../base/button";

//Components - blocks (reusable UI)

//Components - features (business logic)

//#endregion

//#region Icons
import { ArrowDown, ArrowLeft, ArrowRight, ArrowUp } from "lucide-react";
//#endregion

//#region Local Module (in-feature-only-ordered-by-hierachie)
import { ServiceItem } from "./product-card";
import { useProductFeature } from "./product-feature-context";
import { ProductCard } from "./product-feature";
//#endregion

//#endregion
//###--------------------------------------------------------IMPORTS-----------------------------------------------------------------------##

//###--------------------------------------------------------INTERFACE-----------------------------------------------------------------------##
//#region Interfaces
// Function Parameters

// Data/Entities

// Component Props
interface ImageGalleryProps {
  className?: string;
  orientation?: "vertical" | "horizontal";
  sheetTrigger?: (value: string) => React.ReactNode;
}
//#endregion
//###--------------------------------------------------------INTERFACE-----------------------------------------------------------------------##

export function ImageGallery({
  className,
  orientation = "horizontal",
  sheetTrigger,
}: ImageGalleryProps) {
  //###-------------------------COMPONENT LOGIC-----------------------------##
  //#region COMPONENT LOGIC

  //#region Hooks
  const [index, setIndex] = useState(0);
  const { setSelectedKey } = useProductFeature();
  //#endregion

  //#region Translations
  const { t } = useTranslation();
  const items = t("feature.services", { returnObjects: true }) as ServiceItem[];
  //#endregion

  //#region Data Loading
  //#endregion

  //#region Early Returns
  //#endregion

  //#region Computed Data
  //#endregion

  //#region Event Handlers
  const next = () =>
    setIndex((i) => {
      const length = items.length;
      if (i === 0) {
        return i + 1;
      } else if (i === length - 1) {
        return i;
      } else {
        return i + 1;
      }
    });

  const prev = () =>
    setIndex((i) => {
      const length = items.length;
      if (i === 0) {
        return i;
      } else if (i === length - 1) {
        return i - 1;
      } else {
        return i - 1;
      }
    });
  //#endregion

  //#region Effects
  useEffect(() => {
    setSelectedKey(items[index].selectedItemValue);
  }, [index, items, setSelectedKey]);
  //#endregion

  //#endregion
  //###-------------------------COMPONENT LOGIC-----------------------------##

  //###-------------------------RETURN-----------------------------##
  //#region RETURN
  return (
    <div className={className}>
      <div
        className={`flex-1 ${
          orientation === "horizontal" ? "flex flex-row" : "flex flex-col"
        } w-auto items-center gap-3`}
      >
        {orientation === "horizontal" ? (
          <>
            <Button onClick={prev} className="w-auto">
              <ArrowLeft size={16} />
            </Button>
            <ProductCard
              imageUrl={items[index].imageUrl}
              sheetTrigger={sheetTrigger?.(items[index].selectedItemValue)}
              selectedItemValue={items[index].selectedItemValue}
            />
            <Button onClick={next} className="w-auto">
              {" "}
              <ArrowRight size={16} />
            </Button>
          </>
        ) : (
          <>
            <Button onClick={prev} className="w-auto">
              <ArrowUp size={16} />
            </Button>
            <ProductCard
              imageUrl={items[index].imageUrl}
              sheetTrigger={sheetTrigger?.(items[index].selectedItemValue)}
              selectedItemValue={items[index].selectedItemValue}
            />
            <Button onClick={next} className="w-auto">
              {" "}
              <ArrowDown size={16} />
            </Button>
          </>
        )}
      </div>
    </div>
  );
  //#endregion
  //###-------------------------RETURN-----------------------------##
}
