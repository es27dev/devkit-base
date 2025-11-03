import { Routes, Route, Navigate } from "react-router-dom";

import Navbar from "@/components/base/navbar/navbar";
import Home from "@/pages/Home";
import About from "@/pages/About";
import Career from "@/pages/Career";
import Sales from "@/pages/Sales";

import { cn } from "@/shared/lib/utils";

const devTailwind = {
  WebScreen: "min-h-screen grid grid-rows-[auto_1fr] bg-background",
  WebHeader: "w-full bg-gray-100", // volle Breite
  WebMain: "w-full flex flex-col flex-1 bg-gray-100", // volle Breite
  WebContent:
    "max-w-[1400px]  overflow-auto border-2 w-full flex-1 flex flex-col mx-auto p-4 sm:p-6 lg:p-8", // begrenzter Inhalt
};

function App() {
  return (
    <div className={cn(devTailwind.WebScreen)}>
      <header className={cn(devTailwind.WebHeader)}>
        <Navbar />
      </header>
      <main className={cn(devTailwind.WebMain)}>
        <div className={cn(devTailwind.WebContent)}>
          <Routes>
            <Route path="/" element={<Navigate to="/home" />} />
            <Route path="/home" element={<Home />} />
            <Route path="/mehr-erfahren" element={<About />} />
            <Route path="/karriere" element={<Career />} />
            <Route path="/vertrieb" element={<Sales />} />
          </Routes>
        </div>
      </main>
    </div>
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
