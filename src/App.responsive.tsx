import { useState } from "react";
import { cn } from "@/utils";

// Responsive Tailwind Classes
const layout = {
  // Screen
  screen: "h-screen overflow-hidden grid grid-rows-[auto_1fr] p-3 bg-background",
  header: "border-2 border-foreground p-4 mb-3 rounded-lg bg-white",

  // Main Grid: Mobile (stack) / Desktop (columns)
  mainGrid: "grid gap-3 h-full min-h-0 overflow-hidden grid-rows-[1fr] lg:grid-rows-none lg:grid-cols-[2fr_7fr]",

  // Gallery/Table Container
  galleryContainer: "h-full border-2 border-foreground rounded-lg overflow-auto p-3 bg-white lg:block",

  // Main Content (Form + PDF)
  mainContent: "h-full border-2 border-foreground rounded-lg overflow-hidden hidden lg:block",

  // Mobile: Full screen states
  mobileGallery: "block lg:hidden",
  mobileForm: "hidden", // wird bei selected=true angezeigt
  mobilePdf: "hidden",

  // Desktop: Resizable Panel
  resizableArea: "h-full w-full grid grid-cols-[2fr_3fr] gap-3",
  formPanel: "h-full border-2 border-foreground rounded-lg overflow-auto p-4 bg-green-50",
  pdfPanel: "h-full border-2 border-foreground rounded-lg overflow-hidden bg-blue-100 flex items-center justify-center",

  // Table
  table: "w-full",
  tableHeader: "grid grid-cols-4 gap-4 p-4 border-b-2 border-foreground bg-gray-50 font-semibold",
  tableRow: "grid grid-cols-4 gap-4 p-4 hover:bg-gray-50 cursor-pointer border-b",

  // Mobile List
  mobileList: "space-y-3",
  mobileListItem: "p-4 border-2 border-foreground rounded-lg hover:bg-gray-50 cursor-pointer",
};

function AppResponsive() {
  const [selected, setSelected] = useState<number | null>(null);
  const [view, setView] = useState<"gallery" | "form" | "pdf">("gallery");

  return (
    <div className={layout.screen}>
      {/* Header */}
      <header className={layout.header}>
        <div className="flex items-center justify-center">
          <h1 className="text-2xl font-semibold">Header</h1>
        </div>
      </header>

      {/* Main Grid */}
      <div className={layout.mainGrid}>
        {/* Gallery/Table Container */}
        <div className={cn(
          layout.galleryContainer,
          selected && "hidden lg:block"
        )}>
          {/* Desktop: Table View */}
          <div className="hidden lg:block">
            <table className={layout.table}>
              <thead>
                <div className={layout.tableHeader}>
                  <div>Produkt</div>
                  <div>Kategorie</div>
                  <div>Status</div>
                  <div className="text-right">Preis</div>
                </div>
              </thead>
              <tbody>
                <div
                  className={layout.tableRow}
                  onClick={() => setSelected(1)}
                >
                  <div>React Components</div>
                  <div>Software</div>
                  <div>
                    <span className="px-3 py-1 bg-gray-400 text-white rounded text-sm">
                      Verfügbar
                    </span>
                  </div>
                  <div className="text-right">€99.00</div>
                </div>
                <div
                  className={layout.tableRow}
                  onClick={() => setSelected(2)}
                >
                  <div>UI Design Kit</div>
                  <div>Design</div>
                  <div>
                    <span className="px-3 py-1 bg-gray-400 text-white rounded text-sm">
                      Verfügbar
                    </span>
                  </div>
                  <div className="text-right">€149.00</div>
                </div>
                <div
                  className={layout.tableRow}
                  onClick={() => setSelected(3)}
                >
                  <div>Icon Pack</div>
                  <div>Assets</div>
                  <div>
                    <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded text-sm">
                      Ausverkauft
                    </span>
                  </div>
                  <div className="text-right">€29.00</div>
                </div>
              </tbody>
            </table>
          </div>

          {/* Mobile: List View */}
          <div className="lg:hidden">
            <div className={layout.mobileList}>
              <div
                className={layout.mobileListItem}
                onClick={() => {
                  setSelected(1);
                  setView("form");
                }}
              >
                <div className="font-semibold mb-2">React Components</div>
                <div className="text-sm text-muted-foreground">Software • €99.00</div>
              </div>
              <div
                className={layout.mobileListItem}
                onClick={() => {
                  setSelected(2);
                  setView("form");
                }}
              >
                <div className="font-semibold mb-2">UI Design Kit</div>
                <div className="text-sm text-muted-foreground">Design • €149.00</div>
              </div>
              <div
                className={layout.mobileListItem}
                onClick={() => {
                  setSelected(3);
                  setView("form");
                }}
              >
                <div className="font-semibold mb-2">Icon Pack</div>
                <div className="text-sm text-muted-foreground">Assets • €29.00</div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content (Desktop: Always visible | Mobile: Conditional) */}
        <div className={cn(
          layout.mainContent,
          selected && "block"
        )}>
          {/* Desktop: Resizable Panel Area */}
          <div className="hidden lg:grid h-full lg:grid-cols-[2fr_3fr] gap-3">
            {/* Form Panel */}
            <div className={layout.formPanel}>
              <div className="mb-4">
                <h3 className="text-lg font-semibold mb-2">Selected Item</h3>
                <p className="text-sm text-muted-foreground">Item #{selected}</p>
              </div>
              <div className="space-y-3">
                <div className="p-3 border-2 border-foreground rounded">
                  <div className="text-sm mb-2">Field Label</div>
                  <div className="h-10 bg-white rounded border"></div>
                </div>
                <div className="p-3 border-2 border-foreground rounded">
                  <div className="text-sm mb-2">Field Label</div>
                  <div className="h-10 bg-white rounded border"></div>
                </div>
              </div>
            </div>

            {/* PDF Panel */}
            <div className={layout.pdfPanel}>
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-2 bg-gray-300 rounded flex items-center justify-center">
                  <svg className="w-8 h-8 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                </div>
                <span className="text-muted-foreground">PDF Viewer</span>
              </div>
            </div>
          </div>

          {/* Mobile: Form or PDF View */}
          <div className="lg:hidden h-full flex flex-col">
            {view === "form" && (
              <div className="flex-1 p-4 overflow-auto">
                <button
                  onClick={() => setView("gallery")}
                  className="mb-4 px-4 py-2 border rounded"
                >
                  ← Back
                </button>
                <div className="mb-4">
                  <h3 className="text-lg font-semibold mb-2">Selected Item</h3>
                  <p className="text-sm text-muted-foreground">Item #{selected}</p>
                </div>
                <div className="space-y-3">
                  <div className="p-3 border-2 rounded">
                    <div className="text-sm mb-2">Field Label</div>
                    <div className="h-10 bg-white rounded border"></div>
                  </div>
                  <div className="p-3 border-2 rounded">
                    <div className="text-sm mb-2">Field Label</div>
                    <div className="h-10 bg-white rounded border"></div>
                  </div>
                </div>
              </div>
            )}

            {view === "pdf" && (
              <div className="flex-1 flex flex-col items-center justify-center bg-gray-100">
                <button
                  onClick={() => setView("form")}
                  className="absolute top-4 left-4 px-4 py-2 border rounded bg-white"
                >
                  ← Back
                </button>
                <div className="text-center">
                  <div className="w-16 h-16 mx-auto mb-2 bg-gray-300 rounded flex items-center justify-center">
                    <svg className="w-8 h-8 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <span className="text-muted-foreground">PDF Viewer</span>
                </div>
              </div>
            )}

            {/* Mobile Footer/Tools */}
            <div className="p-4 border-t-2 bg-white">
              <button
                onClick={() => setView(view === "form" ? "pdf" : "form")}
                className="w-full py-3 border-2 rounded font-semibold"
              >
                {view === "form" ? "View PDF →" : "View Form →"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AppResponsive;
