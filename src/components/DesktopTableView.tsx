export function DesktopTableView() {
  return (
    <div className="h-screen w-full bg-background p-6">
      {/* Header */}
      <header className="h-40 mb-6 bg-white border-2 border-foreground rounded-lg flex items-center justify-center">
        <h1 className="text-5xl font-semibold">Header</h1>
      </header>

      {/* Main Container */}
      <div className="h-[calc(100vh-280px)] bg-yellow-100 border-2 border-foreground rounded-lg p-8">
        {/* Table */}
        <div className="w-full h-full bg-white border-2 border-foreground rounded-lg overflow-hidden">
          {/* Table Header */}
          <div className="grid grid-cols-4 gap-4 p-4 border-b-2 border-foreground bg-gray-50">
            <div className="font-semibold">Produkt</div>
            <div className="font-semibold">Kategorie</div>
            <div className="font-semibold">Status</div>
            <div className="font-semibold text-right">Preis</div>
          </div>

          {/* Table Rows */}
          <div className="divide-y divide-gray-200">
            {/* Row 1 */}
            <div className="grid grid-cols-4 gap-4 p-4 hover:bg-gray-50 cursor-pointer">
              <div>React Components</div>
              <div>Software</div>
              <div>
                <span className="px-3 py-1 bg-gray-400 text-white rounded text-sm">
                  Verfügbar
                </span>
              </div>
              <div className="text-right">€99.00</div>
            </div>

            {/* Row 2 */}
            <div className="grid grid-cols-4 gap-4 p-4 hover:bg-gray-50 cursor-pointer">
              <div>UI Design Kit</div>
              <div>Design</div>
              <div>
                <span className="px-3 py-1 bg-gray-400 text-white rounded text-sm">
                  Verfügbar
                </span>
              </div>
              <div className="text-right">€149.00</div>
            </div>

            {/* Row 3 */}
            <div className="grid grid-cols-4 gap-4 p-4 hover:bg-gray-50 cursor-pointer">
              <div>Icon Pack</div>
              <div>Assets</div>
              <div>
                <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded text-sm">
                  Ausverkauft
                </span>
              </div>
              <div className="text-right">€29.00</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
