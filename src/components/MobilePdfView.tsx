export function MobilePdfView() {
  return (
    <div className="h-[2160px] w-[1300px] mx-auto bg-background">
      {/* Header */}
      <header className="h-40 mb-6 bg-white border-2 border-foreground rounded-lg flex items-center justify-center">
        <h1 className="text-5xl font-semibold">Header</h1>
      </header>

      {/* PDF Viewer Area */}
      <div className="h-[1620px] mb-6 bg-gray-100 border-2 border-foreground rounded-lg flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          {/* PDF Icon Placeholder */}
          <div className="w-24 h-24 bg-gray-300 rounded flex items-center justify-center">
            <svg
              className="w-12 h-12 text-gray-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
              />
            </svg>
          </div>
          <span className="text-muted-foreground">PDF Viewer</span>
        </div>
      </div>

      {/* Tools Footer */}
      <footer className="h-40 bg-white border-2 border-foreground rounded-lg flex items-center justify-center">
        <button className="text-5xl font-semibold">Tools</button>
      </footer>
    </div>
  );
}
