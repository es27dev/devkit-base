import { Suspense, lazy } from "react";
import { Routes, Route } from "react-router-dom";

import { NavigationHeader } from "@/components/blocks/navigation-header/navigation-header";
import { Footer } from "@/components/blocks/footer/footer";
import { ErrorBoundary } from "@/components/base/error-boundary";
import { PageAnchorProvider } from "@/shared/contexts/page-anchor-context";
import { cn } from "@/shared/lib/utils";

// Lazy load page components for code splitting
const Main = lazy(() => import("@/pages/Main").then(m => ({ default: m.Main })));
const About = lazy(() => import("@/pages/About").then(m => ({ default: m.About })));
const Career = lazy(() => import("@/pages/Career").then(m => ({ default: m.Career })));
const Sales = lazy(() => import("@/pages/Sales").then(m => ({ default: m.Sales })));
const NotFound = lazy(() => import("@/pages/NotFound").then(m => ({ default: m.NotFound })));

const devTailwind = {
  WebScreen: "min-h-screen flex flex-col bg-background",
  WebHeader: "sticky top-0 z-50 w-full bg-gray-100", // sticky header
  WebMain: "w-full flex flex-col flex-1 bg-gray-100", // volle Breite
  WebContent:
    "max-w-[1400px]  overflow-auto border-2 w-full flex-1 flex flex-col mx-auto p-4 sm:p-6 lg:p-8", // begrenzter Inhalt
};

function App() {
  return (
    <ErrorBoundary>
      <PageAnchorProvider>
        <div className={cn(devTailwind.WebScreen)}>
          <header className={cn(devTailwind.WebHeader)}>
            <NavigationHeader />
          </header>
          <main className={cn(devTailwind.WebMain)}>
            <div className={cn(devTailwind.WebContent)}>
              <Suspense fallback={
                <div className="flex items-center justify-center min-h-[400px]">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                </div>
              }>
                <Routes>
                  <Route path="/" element={<Main />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/career" element={<Career />} />
                  <Route path="/sales" element={<Sales />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </Suspense>
            </div>
          </main>
          <Footer />
        </div>
      </PageAnchorProvider>
    </ErrorBoundary>
  );
}

export default App;

// <Routes>
//       <Route path="/" element={<Navigate to="/home" />} />
//       <Route path="/home" element={<Home />} />
//       <Route path="/mehr-erfahren" element={<About />} />
//       <Route path="/karriere" element={<Career />} />
//       <Route path="/vertrieb" element={<Sales />} />
//     </Routes>
