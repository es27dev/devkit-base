//###--------------------------------------------------------IMPORTS-----------------------------------------------------------------------##
//#region IMPORTS
//#region Core/Libs

//  React Core
import { useEffect, useRef } from "react";

//  External Libraries
import { useTranslation } from "react-i18next";
//#endregion

//#region Components

//Components - base (shadcn)
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/base/card";

//Components - blocks (reusable UI)

//Components - features (business logic)

//#endregion

//#region Icons
//#endregion

//#region Local Module (in-feature-only-ordered-by-hierachie)
//#endregion

//#endregion
//###--------------------------------------------------------IMPORTS-----------------------------------------------------------------------##

//###--------------------------------------------------------INTERFACE-----------------------------------------------------------------------##
//#region Interfaces
// Function Parameters
interface CardTransformParams {
  rotateX: number;
  rotateY: number;
  scale: number;
}

// Data/Entities
export interface ServiceItem {
  selectedItemValue: string;
  itemName: string;
  description: string;
  imageUrl: string;
}

// Component Props
interface ProductCardProps {
  selectedItemValue: string;
  imageUrl: string;
  sheetTrigger?: React.ReactNode;
}
//#endregion
//###--------------------------------------------------------INTERFACE-----------------------------------------------------------------------##

export function ProductCard({
  imageUrl,
  sheetTrigger,
  selectedItemValue,
}: ProductCardProps) {
  //###-------------------------COMPONENT LOGIC-----------------------------##
  //#region COMPONENT LOGIC

  //#region Hooks
  const cardRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const animationFrameRef = useRef<number | undefined>(undefined);
  const lastMousePosition = useRef({ x: 0, y: 0 });
  //#endregion

  //#region Translations
  const { t } = useTranslation();
  const serviceItemList = t("feature.services", {
    returnObjects: true,
  }) as ServiceItem[];
  //#endregion

  //#region  Data Loading
  //#endregion

  //#region Early Returns
  //#endregion

  //#region Computed Data
  const currentServiceItem = serviceItemList.find(
    (item) => item.selectedItemValue === selectedItemValue
  );

  const name = currentServiceItem?.itemName || "";
  const description = currentServiceItem?.description || "";

  //#endregion

  //#region Event Handlers
  //#endregion

  //#region Effects
  useEffect(() => {
    const card = cardRef.current;
    const image = imageRef.current;

    if (!card || !image) return;

    let rect: DOMRect;
    let centerX: number;
    let centerY: number;

    const updateCardTransform = (mouseX: number, mouseY: number) => {
      if (!rect) {
        rect = card.getBoundingClientRect();
        centerX = rect.left + rect.width / 2;
        centerY = rect.top + rect.height / 2;
      }

      const relativeX = mouseX - centerX;
      const relativeY = mouseY - centerY;

      const cardTransform: CardTransformParams = {
        rotateX: -relativeY * 0.035,
        rotateY: relativeX * 0.035,
        scale: 1.025,
      };

      const imageTransform: CardTransformParams = {
        rotateX: -relativeY * 0.025,
        rotateY: relativeX * 0.025,
        scale: 1.05,
      };

      return { cardTransform, imageTransform };
    };

    const animate = () => {
      const { cardTransform, imageTransform } = updateCardTransform(
        lastMousePosition.current.x,
        lastMousePosition.current.y
      );

      card.style.transform = `perspective(1000px) rotateX(${cardTransform.rotateX}deg) rotateY(${cardTransform.rotateY}deg) scale3d(${cardTransform.scale}, ${cardTransform.scale}, ${cardTransform.scale})`;
      card.style.boxShadow = "0 10px 35px rgba(0, 0, 0, 0.2)";

      image.style.transform = `perspective(1000px) rotateX(${imageTransform.rotateX}deg) rotateY(${imageTransform.rotateY}deg) scale3d(${imageTransform.scale}, ${imageTransform.scale}, ${imageTransform.scale})`;

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    const handleMouseMove = (e: MouseEvent) => {
      lastMousePosition.current = { x: e.clientX, y: e.clientY };
    };

    const handleMouseEnter = () => {
      card.style.transition = "transform 0.2s ease, box-shadow 0.2s ease";
      image.style.transition = "transform 0.2s ease";
      animate();
    };

    const handleMouseLeave = () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }

      card.style.transform =
        "perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)";
      card.style.boxShadow = "none";
      card.style.transition = "transform 0.5s ease, box-shadow 0.5s ease";

      image.style.transform =
        "perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)";
      image.style.transition = "transform 0.5s ease";
    };

    card.addEventListener("mouseenter", handleMouseEnter);
    card.addEventListener("mousemove", handleMouseMove);
    card.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }

      card.removeEventListener("mouseenter", handleMouseEnter);
      card.removeEventListener("mousemove", handleMouseMove);
      card.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);
  //#endregion

  //#endregion
  //###-------------------------COMPONENT LOGIC-----------------------------##

  //###-------------------------RETURN-----------------------------##
  //#region RETURN
  return (
    <Card ref={cardRef} className="max-w-md">
      <CardHeader>
        <CardTitle>{name}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6 text-sm">
        <img
          ref={imageRef}
          src={imageUrl}
          alt="Banner"
          className="aspect-video w-full rounded-md object-cover"
          width={500}
          height={500}
        />
        <p>{description}</p>

        {sheetTrigger && (
          <div className="w-full flex flex-row items-center justify-center">
            {sheetTrigger}
          </div>
        )}
      </CardContent>
    </Card>
  );
  //#endregion
  //###-------------------------RETURN-----------------------------##
}
