import { useState } from "react";
import { cn } from "@/utils";

const devTailwind = {
  ScreenMain: "h-screen overflow-hidden grid grid-rows-[auto_1fr] p-3",
  Header: "border-2 p-3 mb-3",
  MainGrid:
    "grid grid-cols-1 sm:grid-cols-[2fr_7fr] gap-3 h-full min-h-0 overflow-hidden",
  Gallery: "h-full sm:block border rounded-lg overflow-auto p-3",
  Main: "h-full min-h-0 sm:block rounded-lg overflow-hidden",
  ResizablePanelGroup: "h-full w-full rounded-lg border-2",
};

function App() {
  const [count, setCount] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  return (
    <div className={devTailwind.ScreenMain}>
      <header className={devTailwind.Header}>
        <div className="flex items-center justify-center">
          <h1 className="text-2xl font-semibold">Navigation Header</h1>
        </div>
      </header>
      {/* Grid#Main  */}
      <div className={devTailwind.MainGrid}>
        <div className={cn(devTailwind.Gallery, selected ? "hidden" : "block")}>
          <div className="text-muted-foreground">Gallery Container</div>
        </div>
        <main className={cn(devTailwind.Main, selected ? "block" : "hidden")}>
          <div className="h-full w-full border-2 rounded-lg flex items-center justify-center">
            <span className="text-muted-foreground">Main Content Area</span>
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;
