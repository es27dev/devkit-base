import { useState } from "react";
import { Viewer, Worker, SpecialZoomLevel } from "@react-pdf-viewer/core";
import { defaultLayoutPlugin } from "@react-pdf-viewer/default-layout";
import { ToolbarSlot } from "@react-pdf-viewer/toolbar";
import "@react-pdf-viewer/core/lib/styles/index.css";
import "@react-pdf-viewer/default-layout/lib/styles/index.css";
import {
  ChevronLeft,
  ChevronRight,
  ZoomIn as ZoomInIcon,
  ZoomOut as ZoomOutIcon,
  Download as DownloadIcon,
  Printer,
  ScanEye,
} from "lucide-react";

import { Button } from "@/components/base/button";
import { FileText, Bookmark, Paperclip } from "lucide-react";

interface PdfToolbarProps {
  toolbarSlot: ToolbarSlot;
  autoZoom: boolean;
  onAutoZoomToggle: () => void;
  onJumpToPage: (page: number) => void;
}

export const PdfToolbar = ({
  toolbarSlot,
  autoZoom,
  onAutoZoomToggle,
  onJumpToPage,
}: PdfToolbarProps) => {
  const [isEditingPage, setIsEditingPage] = useState(false);
  const [pageInput, setPageInput] = useState("");
  const [isEditingZoom, setIsEditingZoom] = useState(false);
  const [zoomInput, setZoomInput] = useState("");

  const {
    GoToPreviousPage,
    CurrentPageLabel,
    NumberOfPages,
    GoToNextPage,
    ZoomIn,
    ZoomOut,
    Zoom,
    Download,
    Print,
  } = toolbarSlot;

  return (
    <div className="w-full items-center gap-2 py-2 px-2 flex flex-row justify-between">
      {/* #Dev_PageNav_Div */}
      <div className="flex flex-1 justify-start gap-1">
        <GoToPreviousPage>
          {(props) => (
            <Button
              variant="outline"
              size="sm"
              onClick={props.onClick}
              disabled={props.isDisabled}
              className="h-8 w-8 p-0"
            >
              <ChevronLeft className="h-3 w-3" />
            </Button>
          )}
        </GoToPreviousPage>

        <CurrentPageLabel>
          {(props) => (
            <NumberOfPages>
              {(propsPages) => (
                <>
                  {!isEditingPage ? (
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-8 px-3"
                      onClick={() => {
                        setIsEditingPage(true);
                        setPageInput(String(props.currentPage + 1));
                      }}
                    >
                      {props.currentPage + 1} / {propsPages.numberOfPages}
                    </Button>
                  ) : (
                    <input
                      type="number"
                      min={1}
                      max={propsPages.numberOfPages}
                      value={pageInput}
                      autoFocus
                      onChange={(e) => setPageInput(e.target.value)}
                      onBlur={() => {
                        const page = parseInt(pageInput);
                        const targetPage =
                          page > propsPages.numberOfPages
                            ? propsPages.numberOfPages
                            : page >= 1
                            ? page
                            : props.currentPage + 1;
                        onJumpToPage(targetPage - 1);
                        setIsEditingPage(false);
                      }}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          const page = parseInt(pageInput);
                          const targetPage =
                            page > propsPages.numberOfPages
                              ? propsPages.numberOfPages
                              : page >= 1
                              ? page
                              : props.currentPage + 1;
                          onJumpToPage(targetPage - 1);
                          setIsEditingPage(false);
                        }
                      }}
                      className="h-8 w-16 px-2 text-center text-sm border rounded-md [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    />
                  )}
                </>
              )}
            </NumberOfPages>
          )}
        </CurrentPageLabel>

        <GoToNextPage>
          {(props) => (
            <Button
              variant="outline"
              size="sm"
              onClick={props.onClick}
              disabled={props.isDisabled}
              className="h-8 w-8 p-0"
            >
              <ChevronRight className="h-3 w-3" />
            </Button>
          )}
        </GoToNextPage>
      </div>

      {/* Seperator */}
      <div className="mx-2 h-6 w-px bg-border" />

      {/* #Dev_Zoom_Div */}
      <div className="flex flex-1 justify-center items-center gap-1">
        {/* Auto-Zoom Toggle */}
        <Button
          variant="default"
          size={autoZoom ? "icon" : "sm"}
          onClick={onAutoZoomToggle}
          className={`h-8 px-3 border-2 ${
            autoZoom
              ? "border-green-700 bg-background text-green-700 font-bold bg-green-200"
              : "border-red-700 bg-background text-red-700 font-bold bg-red-200"
          }`}
        >
          <ScanEye />
          {autoZoom ? "" : "Autozoom"}
        </Button>

        {/* Zoom Controls (only in manual mode) */}

        {autoZoom ? (
          <>
            <ZoomOut>
              {(props) => (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={props.onClick}
                  className="h-8 w-8 p-0"
                >
                  <ZoomOutIcon className="h-3 w-3" />
                </Button>
              )}
            </ZoomOut>

            <Zoom>
              {(props) => (
                <>
                  {!isEditingZoom ? (
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-8 px-3"
                      onClick={() => {
                        setIsEditingZoom(true);
                        setZoomInput(String(Math.round(props.scale * 100)));
                      }}
                    >
                      {Math.round(props.scale * 100)}%
                    </Button>
                  ) : (
                    <input
                      type="number"
                      min={10}
                      max={300}
                      value={zoomInput}
                      autoFocus
                      onChange={(e) => setZoomInput(e.target.value)}
                      onBlur={() => {
                        const zoom = parseInt(zoomInput);
                        const targetZoom = zoom > 300 ? 300 : zoom < 10 ? 10 : zoom;
                        props.onZoom(targetZoom / 100);
                        setIsEditingZoom(false);
                      }}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          const zoom = parseInt(zoomInput);
                          const targetZoom = zoom > 300 ? 300 : zoom < 10 ? 10 : zoom;
                          props.onZoom(targetZoom / 100);
                          setIsEditingZoom(false);
                        }
                      }}
                      className="h-8 w-16 px-2 text-center text-sm border rounded-md [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    />
                  )}
                </>
              )}
            </Zoom>

            <ZoomIn>
              {(props) => (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={props.onClick}
                  className="h-8 w-8 p-0"
                >
                  <ZoomInIcon className="h-3 w-3" />
                </Button>
              )}
            </ZoomIn>
          </>
        ) : (
          <Zoom>
            {(props) => (
              <span className="text-xs font-medium min-w-[50px] text-center">
                {Math.round(props.scale * 100)}%
              </span>
            )}
          </Zoom>
        )}
      </div>

      {/* Seperator */}
      <div className="mx-2 h-6 w-px bg-border" />

      {/* Actions */}
      <div className="flex flex-1 justify-end items-center gap-1">
        {" "}
        <Download>
          {(props) => (
            <Button
              variant="outline"
              size="sm"
              onClick={props.onClick}
              className="h-8 w-8 p-0"
            >
              <DownloadIcon className="h-3 w-3" />
            </Button>
          )}
        </Download>
        <Print>
          {(props) => (
            <Button
              variant="outline"
              size="sm"
              onClick={props.onClick}
              className="h-8 w-8 p-0"
            >
              <Printer className="h-3 w-3" />
            </Button>
          )}
        </Print>
      </div>
    </div>
  );
};

export function PdfViewer() {
  const [autoZoom, setAutoZoom] = useState(true);

  const defaultLayoutPluginInstance = defaultLayoutPlugin({
    renderToolbar: (Toolbar) => (
      <Toolbar>
        {(props) => (
          <PdfToolbar
            toolbarSlot={props}
            autoZoom={autoZoom}
            onAutoZoomToggle={() => setAutoZoom(!autoZoom)}
            onJumpToPage={(page) => {
              defaultLayoutPluginInstance.toolbarPluginInstance.pageNavigationPluginInstance.jumpToPage(page);
            }}
          />
        )}
      </Toolbar>
    ),
    sidebarTabs: (defaultTabs) => [
      {
        ...defaultTabs[0],
        icon: <FileText className="h-4 w-4" />,
      },
      {
        ...defaultTabs[1],
        icon: <Bookmark className="h-4 w-4" />,
      },
      {
        ...defaultTabs[2],
        icon: <Paperclip className="h-4 w-4" />,
      },
    ],
  });

  return (
    <div style={{ height: "100%", width: "100%" }}>
      <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js">
        {" "}
        <Viewer
          fileUrl="/Anleitung MFA.pdf"
          plugins={[defaultLayoutPluginInstance]}
          defaultScale={autoZoom ? SpecialZoomLevel.PageWidth : undefined}
          theme="dark"
        />
      </Worker>
    </div>
  );
}
