import { Button } from "../../base/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTrigger,
} from "@/components/base/sheet";
import { ImageGallery } from "./image-gallery";
import { SheetProductContent } from "./sheet-product-content";
import {
  ProductFeatureProvider,
  useProductFeature,
} from "./product-feature-context";

interface ProductShowcaseProps {
  className?: string;
  orientation?: "vertical" | "horizontal";
}
export function ProductShowcase({ className }: ProductShowcaseProps) {
  return (
    <ProductFeatureProvider>
      <ProductShowcaseContent />
    </ProductFeatureProvider>
  );
}

function ProductShowcaseContent() {
  const { setSelectedKey } = useProductFeature();
  const sheetTrigger = (value: string) => (
    <SheetTrigger asChild onClick={() => setSelectedKey(value)}>
      <Button>Leistungsdetails</Button>
    </SheetTrigger>
  );

  return (
    <Sheet>
      <div className="flex flex-col lg:hidden">
        <ImageGallery sheetTrigger={sheetTrigger} orientation="vertical" />

        <SheetContent side="bottom">
          <SheetHeader></SheetHeader>
          <div className="h-[90vh]">
            <SheetProductContent />
          </div>
        </SheetContent>
      </div>

      <div className="hidden h-[550px] lg:flex flex-row gap-2  items-center ">
        <ImageGallery className="w-1/2" orientation="horizontal" />

        <div className="h-full w-1/2">
          <SheetProductContent />
        </div>
      </div>
    </Sheet>
  );
}
