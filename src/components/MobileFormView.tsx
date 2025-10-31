export function MobileFormView() {
  return (
    <div className="h-[2160px] w-[1300px] mx-auto bg-background">
      {/* Header */}
      <header className="h-40 mb-6 bg-white border-2 border-foreground rounded-lg flex items-center justify-center">
        <h1 className="text-5xl font-semibold">Header</h1>
      </header>

      {/* Form Frame */}
      <div className="h-[1620px] bg-white border-2 border-foreground rounded-lg p-10 overflow-auto">
        {/* Header/Target Form Section */}
        <div className="mb-6 p-4 border-2 border-foreground rounded-lg">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm">Header/Target Form</span>
            <div className="flex gap-2">
              <button className="px-3 py-1 border border-foreground rounded text-xs">
                Button 1
              </button>
              <button className="px-3 py-1 border border-foreground rounded text-xs">
                Button 2
              </button>
            </div>
          </div>
        </div>

        {/* Selected Item */}
        <div className="mb-4">
          <div className="text-sm mb-2">Selected Item</div>
        </div>

        {/* Form Input 1 */}
        <div className="h-20 mb-4 border-2 border-foreground rounded-lg flex items-center px-4">
          <div className="flex-1 flex items-center gap-4">
            <span className="text-sm text-muted-foreground">Input Field 1</span>
            <div className="ml-auto w-8 h-8 border border-foreground rounded-full flex items-center justify-center">
              ⊙
            </div>
          </div>
        </div>

        {/* Form Input 2 */}
        <div className="h-20 border-2 border-foreground rounded-lg flex items-center px-4">
          <div className="flex-1 flex items-center gap-4">
            <span className="text-sm text-muted-foreground">Input Field 2</span>
            <div className="ml-auto w-8 h-8 border border-foreground rounded-full flex items-center justify-center">
              ⊙
            </div>
          </div>
        </div>
      </div>

      {/* Tools Footer */}
      <footer className="h-40 mt-6 bg-white border-2 border-foreground rounded-lg flex items-center justify-center">
        <button className="text-5xl font-semibold">Tools</button>
      </footer>
    </div>
  );
}
