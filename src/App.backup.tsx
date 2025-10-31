import { useState } from "react";

//Utils
import { cn } from "@/utils";

//ShadeCn
import { Button } from "@/components/base/button";

//Eigene-Components
import { NavigationHeader } from "@/components/NavigationHeader";
import { PdfViewer } from "@/components/PdfViewer";
import { InvoiceForm } from "@/components/form/InvoiceForm";
//Resizable
import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from "@/components/base/resizable";

export function ResizablePanelMain() {
  return (
    <ResizablePanelGroup
      direction="horizontal"
      className={devTailwind.ResizablePanelGroup}
    >
      <ResizablePanel defaultSize={40} minSize={25}>
        <div className="flex h-full overflow-auto p-1 bg-background">
          <InvoiceForm />
        </div>
      </ResizablePanel>
      <ResizableHandle withHandle />
      <ResizablePanel defaultSize={60} minSize={45}>
        <div className="h-full w-full">
          <PdfViewer />
        </div>
      </ResizablePanel>
    </ResizablePanelGroup>
  );
}

const devTailwind = {
  ScreenMain: "h-screen overflow-hidden grid grid-rows-[auto_1fr] p-3",
  Header: "border-2 p-3 mb-3",
  MainGrid:
    "grid grid-cols-1 sm:grid-cols-[2fr_7fr] gap-3 h-full min-h-0 overflow-hidden",
  Gallery: "h-full sm:block border rounded-lg overflow-auto p-3",
  Main: "h-full min-h-0 sm:block rounded-lg overflow-hidden",
  ResizablePanelGroup: "h-full w-full rounded-lg border-2",
};
//<ResizableHandleDemo className="flex flex-1" /> <ResizableHandleDemo />{" "}
//<ResizableHandleDemo />

function App() {
  const [count, setCount] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  return (
    <div className={devTailwind.ScreenMain}>
      <div className={devTailwind.Header}>
        <NavigationHeader />
      </div>
      {/* Grid#Main  */}
      <div className={devTailwind.MainGrid}>
        <div className={cn(devTailwind.Gallery, selected ? "hidden" : "block")}>
          Gallery
        </div>
        <div className={cn(devTailwind.Main, selected ? "block" : "hidden")}>
          <ResizablePanelMain></ResizablePanelMain>
        </div>
      </div>
    </div>
  );
}

export default App;
