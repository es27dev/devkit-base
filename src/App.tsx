import { Routes, Route, Navigate } from "react-router-dom";

import Navbar from "@/components/base/navbar/navbar";
import Home from "@/pages/Home";
import About from "@/pages/About";
import Career from "@/pages/Career";
import Sales from "@/pages/Sales";

import { cn } from "@/utils";

const devTailwind = {
  WebScreen: "min-h-screen grid grid-rows-[auto_1fr] bg-background",
  WebMain: "w-full max-w-[1400px] mx-auto p-4 sm:p-6 lg:p-8 overflow-auto",
};

function App() {
  return (
    <div className={cn(devTailwind.WebScreen)}>
      <Navbar />
      <main className={cn(devTailwind.WebMain)}>
        <Routes>
          <Route path="/" element={<Navigate to="/home" />} />
          <Route path="/home" element={<Home />} />
          <Route path="/mehr-erfahren" element={<About />} />
          <Route path="/karriere" element={<Career />} />
          <Route path="/vertrieb" element={<Sales />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
