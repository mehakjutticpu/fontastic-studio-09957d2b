import { ChevronDown, ChevronUp, Copy, Eye, EyeOff, Lock, Trash2, Unlock } from "lucide-react";

import { useEditor } from "@/lib/editor/store";
import { cn } from "@/lib/utils";

export function LayersPanel() {
  const { doc, selectedId, select, updateLayer, removeLayer, duplicateLayer, reorder } = useEditor();
  const layers = [...doc.layers].reverse();

  return (
    <div className="flex h-full flex-col">
      <div className="border-b border-border/60 px-4 py-3">
        <h2 className="text-sm font-semibold tracking-tight">Layers</h2>
      </div>
      <div className="min-h-0 flex-1 space-y-1 overflow-y-auto p-2">
        {layers.length === 0 && (
          <p className="px-3 py-6 text-center text-xs text-muted-foreground">
            Abhi koi layer nahi. Text, shape ya image add karein.
          </p>
        )}
        {layers.map((layer) => (
          <div
            key={layer.id}
            onClick={() => select(layer.id)}
            className={cn(
              "group cursor-pointer rounded-lg border border-transparent px-2.5 py-2 hover:bg-accent/50",
              selectedId === layer.id && "border-primary/50 bg-primary/10",
            )}
          >
            <div className="flex items-center gap-2">
              <span className="truncate text-xs font-medium">
                {layer.type === "text" ? layer.text.slice(0, 22) || "Text" : layer.name}
              </span>
              <span className="ml-auto text-[10px] uppercase tracking-wide text-muted-foreground">
                {layer.type}
              </span>
            </div>
            <div className="mt-1.5 flex items-center gap-1">
              <button
                type="button"
                title="Visibility"
                onClick={(e) => {
                  e.stopPropagation();
                  updateLayer(layer.id, { visible: !layer.visible });
                }}
                className="rounded p-1 text-muted-foreground hover:text-foreground"
              >
                {layer.visible ? <Eye className="h-3.5 w-3.5" /> : <EyeOff className="h-3.5 w-3.5" />}
              </button>
              <button
                type="button"
                title="Lock"
                onClick={(e) => {
                  e.stopPropagation();
                  updateLayer(layer.id, { locked: !layer.locked });
                }}
                className="rounded p-1 text-muted-foreground hover:text-foreground"
              >
                {layer.locked ? <Lock className="h-3.5 w-3.5" /> : <Unlock className="h-3.5 w-3.5" />}
              </button>
              <button
                type="button"
                title="Bring forward"
                onClick={(e) => {
                  e.stopPropagation();
                  reorder(layer.id, "up");
                }}
                className="rounded p-1 text-muted-foreground hover:text-foreground"
              >
                <ChevronUp className="h-3.5 w-3.5" />
              </button>
              <button
                type="button"
                title="Send backward"
                onClick={(e) => {
                  e.stopPropagation();
                  reorder(layer.id, "down");
                }}
                className="rounded p-1 text-muted-foreground hover:text-foreground"
              >
                <ChevronDown className="h-3.5 w-3.5" />
              </button>
              <button
                type="button"
                title="Duplicate"
                onClick={(e) => {
                  e.stopPropagation();
                  duplicateLayer(layer.id);
                }}
                className="rounded p-1 text-muted-foreground hover:text-foreground"
              >
                <Copy className="h-3.5 w-3.5" />
              </button>
              <button
                type="button"
                title="Delete"
                onClick={(e) => {
                  e.stopPropagation();
                  removeLayer(layer.id);
                }}
                className="ml-auto rounded p-1 text-muted-foreground hover:text-destructive"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
