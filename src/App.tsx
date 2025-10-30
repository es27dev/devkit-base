import { useState } from "react";

import { Button } from "@/components/base/button";
import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from "@/components/base/resizable";

export function ResizableHandleDemo() {
  return (
    <ResizablePanelGroup
      direction="horizontal"
      className="min-h-[200px] max-w-md rounded-lg border md:min-w-[450px]"
    >
      <ResizablePanel defaultSize={40}>
        <div className="flex h-full items-center justify-center p-6">
          <span className="font-semibold">Formular</span>
        </div>
      </ResizablePanel>
      <ResizableHandle withHandle />
      <ResizablePanel defaultSize={60}>
        <div className="flex h-full items-center justify-center p-6">
          <span className="font-semibold">PDF-Preview</span>
        </div>
      </ResizablePanel>
    </ResizablePanelGroup>
  );
}

//<ResizableHandleDemo className="flex flex-1" /> <ResizableHandleDemo />{" "}
//<ResizableHandleDemo />

function App() {
  const [count, setCount] = useState(0);

  return (
    <div className="h-screen w-full border-2 border-green-500 grid grid-rows-[20%_80%]">
      <div className="border-2 border-yellow-500">Header</div>
      <div className="w-full border-2 border-red-500 grid grid-cols-3">
        <div className="h-full border-2 border-blue-500">LeftCol</div>
        <div className="h-full border-2 border-blue-500">CenterCol</div>
        <div className="h-full border-2 border-blue-500">RightCol</div>
      </div>
    </div>
  );
}

export default App;
