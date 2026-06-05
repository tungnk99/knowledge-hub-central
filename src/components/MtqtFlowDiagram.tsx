import { Maximize2, X, ZoomIn, ZoomOut } from "lucide-react";
import { useCallback, useState } from "react";

import { MTQT_FLOW_IMAGE } from "@/lib/mtqt-assets";
import { cn } from "@/lib/utils";

interface Props {
  className?: string;
  compact?: boolean;
}

export function MtqtFlowDiagram({ className, compact }: Props) {
  const [lightbox, setLightbox] = useState(false);
  const [zoom, setZoom] = useState(1);

  const zoomIn = useCallback(() => setZoom((z) => Math.min(z + 0.25, 3)), []);
  const zoomOut = useCallback(() => setZoom((z) => Math.max(z - 0.25, 0.5)), []);

  return (
    <>
      <div className={cn("rounded-xl border bg-card", className)}>
        <div className="flex flex-wrap items-center justify-between gap-2 border-b px-4 py-3">
          <div>
            <h2 className="text-sm font-semibold">Sơ đồ quy trình chính thức (Swimlane)</h2>
            {!compact && (
              <p className="text-xs text-muted-foreground">
                Trích từ MTQT 07-QT/CLOUD/HDCV/FCI — Customer · Sales · AI Lab · Delivery · Product
              </p>
            )}
          </div>
          <button
            type="button"
            onClick={() => {
              setZoom(1);
              setLightbox(true);
            }}
            className="inline-flex items-center gap-1.5 rounded-md border bg-background px-3 py-1.5 text-xs font-medium hover:bg-accent"
          >
            <Maximize2 className="h-3.5 w-3.5" />
            Phóng to
          </button>
        </div>

        <div className="overflow-x-auto bg-white p-3">
          <button
            type="button"
            onClick={() => {
              setZoom(1);
              setLightbox(true);
            }}
            className="block w-full min-w-[720px] cursor-zoom-in"
            title="Bấm để phóng to sơ đồ"
          >
            <img
              src={MTQT_FLOW_IMAGE}
              alt="Sơ đồ quy trình tư vấn FPT AI — 6 giai đoạn, swimlane Customer Sales AI Lab Delivery Product"
              className="w-full rounded-md border shadow-sm"
              loading="lazy"
            />
          </button>
        </div>
      </div>

      {lightbox && (
        <div
          className="fixed inset-0 z-50 flex flex-col bg-black/85"
          role="dialog"
          aria-modal
          aria-label="Sơ đồ quy trình phóng to"
        >
          <div className="flex items-center justify-between gap-2 px-4 py-3 text-white">
            <span className="text-sm font-medium">Sơ đồ quy trình MTQT — cuộn & zoom</span>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={zoomOut}
                className="rounded-md p-2 hover:bg-white/10"
                title="Thu nhỏ"
              >
                <ZoomOut className="h-5 w-5" />
              </button>
              <span className="min-w-[3rem] text-center text-xs">{Math.round(zoom * 100)}%</span>
              <button
                type="button"
                onClick={zoomIn}
                className="rounded-md p-2 hover:bg-white/10"
                title="Phóng to"
              >
                <ZoomIn className="h-5 w-5" />
              </button>
              <button
                type="button"
                onClick={() => setLightbox(false)}
                className="ml-2 rounded-md p-2 hover:bg-white/10"
                title="Đóng"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>
          <div className="flex-1 overflow-auto p-4">
            <img
              src={MTQT_FLOW_IMAGE}
              alt="Sơ đồ quy trình MTQT phóng to"
              style={{ width: `${zoom * 100}%`, maxWidth: "none" }}
              className="mx-auto block"
              draggable={false}
            />
          </div>
        </div>
      )}
    </>
  );
}
