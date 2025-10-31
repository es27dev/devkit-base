export function MobileGallerySelect() {
  return (
    <div className="h-[2160px] w-[1300px] mx-auto p-6 bg-background">
      {/* Header */}
      <header className="h-40 mb-6 bg-white border-2 border-foreground rounded-lg flex items-center justify-center">
        <h1 className="text-5xl font-semibold">Header</h1>
      </header>

      {/* Invoice Gallery Container */}
      <div className="h-[1778px] bg-white border-2 border-foreground rounded-lg p-10 overflow-auto">
        {/* Gallery Item 1 */}
        <div className="h-48 mb-8 border-2 border-foreground rounded-lg"></div>

        {/* Gallery Item 2 */}
        <div className="h-48 border-2 border-foreground rounded-lg"></div>
      </div>
    </div>
  );
}
