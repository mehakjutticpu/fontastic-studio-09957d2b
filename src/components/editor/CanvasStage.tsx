import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";

import { makeDraw } from "@/lib/editor/defaults";
import { layerBounds, renderDoc } from "@/lib/editor/render";
import { useEditor } from "@/lib/editor/store";
import type { DrawLayer, Layer } from "@/lib/editor/types";

type Props = {
  zoom: number;
  tool: "select" | "draw" | "erase";
  brushColor: string;
  brushSize: number;
  onFitScale?: (s: number) => void;
};

type Drag =
  | { kind: "move"; id: string; dx: number; dy: number }
  | { kind: "scale"; id: string; startDist: number; startW: number; startH: number; startFont: number }
  | { kind: "rotate"; id: string; startAngle: number; startRotation: number }
  | { kind: "stroke"; id: string }
  | null;

export function CanvasStage({ zoom, tool, brushColor, brushSize, onFitScale }: Props) {
  const { doc, selectedId, select, updateLayer, setDoc, addLayer } = useEditor();
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const dragRef = useRef<Drag>(null);
  const [fit, setFit] = useState(0.5);
  const [, forceRender] = useState(0);

  const scale = fit * zoom;

  useLayoutEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const compute = () => {
      const pad = 48;
      const w = el.clientWidth - pad;
      const h = el.clientHeight - pad;
      const next = Math.max(0.05, Math.min(w / doc.width, h / doc.height));
      setFit(next);
      onFitScale?.(next);
    };
    compute();
    const ro = new ResizeObserver(compute);
    ro.observe(el);
    return () => ro.disconnect();
  }, [doc.width, doc.height, onFitScale]);

  const paint = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    canvas.width = doc.width;
    canvas.height = doc.height;
    renderDoc(ctx, doc, () => forceRender((v) => v + 1));

    const layer = doc.layers.find((l) => l.id === selectedId);
    if (!layer || layer.type === "draw") return;
    const { w, h } = layerBounds(ctx, layer);
    const pad = 10 / scale;
    ctx.save();
    ctx.translate(layer.x, layer.y);
    ctx.rotate((layer.rotation * Math.PI) / 180);
    ctx.strokeStyle = "#ff7a18";
    ctx.lineWidth = 1.5 / scale;
    ctx.setLineDash([6 / scale, 4 / scale]);
    ctx.strokeRect(-w / 2 - pad, -h / 2 - pad, w + pad * 2, h + pad * 2);
    ctx.setLineDash([]);
    const hs = 9 / scale;
    ctx.fillStyle = "#ff7a18";
    ctx.fillRect(w / 2 + pad - hs / 2, h / 2 + pad - hs / 2, hs, hs);
    ctx.beginPath();
    ctx.moveTo(0, -h / 2 - pad);
    ctx.lineTo(0, -h / 2 - pad - 28 / scale);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(0, -h / 2 - pad - 30 / scale, hs * 0.7, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }, [doc, selectedId, scale]);

  useEffect(() => {
    paint();
  }, [paint]);

  const toDoc = (e: React.PointerEvent) => {
    const rect = canvasRef.current!.getBoundingClientRect();
    return {
      x: ((e.clientX - rect.left) / rect.width) * doc.width,
      y: ((e.clientY - rect.top) / rect.height) * doc.height,
    };
  };

  const hitTest = (p: { x: number; y: number }): Layer | null => {
    const ctx = canvasRef.current?.getContext("2d");
    if (!ctx) return null;
    for (let i = doc.layers.length - 1; i >= 0; i--) {
      const layer = doc.layers[i]!;
      if (!layer.visible || layer.locked || layer.type === "draw") continue;
      const { w, h } = layerBounds(ctx, layer);
      const rad = (-layer.rotation * Math.PI) / 180;
      const dx = p.x - layer.x;
      const dy = p.y - layer.y;
      const lx = dx * Math.cos(rad) - dy * Math.sin(rad);
      const ly = dx * Math.sin(rad) + dy * Math.cos(rad);
      if (Math.abs(lx) <= w / 2 + 12 && Math.abs(ly) <= h / 2 + 12) return layer;
    }
    return null;
  };

  const handlesFor = (layer: Layer) => {
    const ctx = canvasRef.current?.getContext("2d");
    if (!ctx || layer.type === "draw") return null;
    const { w, h } = layerBounds(ctx, layer);
    const pad = 10 / scale;
    const rad = (layer.rotation * Math.PI) / 180;
    const rot = (x: number, y: number) => ({
      x: layer.x + x * Math.cos(rad) - y * Math.sin(rad),
      y: layer.y + x * Math.sin(rad) + y * Math.cos(rad),
    });
    return {
      w,
      h,
      scaleHandle: rot(w / 2 + pad, h / 2 + pad),
      rotateHandle: rot(0, -h / 2 - pad - 30 / scale),
    };
  };

  const onPointerDown = (e: React.PointerEvent) => {
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    const p = toDoc(e);

    if (tool === "draw" || tool === "erase") {
      const existing = doc.layers.find(
        (l): l is DrawLayer => l.type === "draw" && l.id === selectedId,
      );
      const target =
        existing ?? [...doc.layers].reverse().find((l): l is DrawLayer => l.type === "draw");
      if (tool === "erase") {
        if (!target) return;
        dragRef.current = { kind: "stroke", id: target.id };
        eraseAt(target.id, p);
        return;
      }
      let id = target?.id;
      if (!target) {
        const layer = makeDraw();
        id = layer.id;
        addLayer(layer);
      }
      setDoc(
        (d) => ({
          ...d,
          layers: d.layers.map((l) =>
            l.id === id && l.type === "draw"
              ? { ...l, strokes: [...l.strokes, { color: brushColor, width: brushSize, points: [p] }] }
              : l,
          ),
        }),
        true,
      );
      dragRef.current = { kind: "stroke", id: id! };
      return;
    }

    const selected = doc.layers.find((l) => l.id === selectedId);
    if (selected) {
      const h = handlesFor(selected);
      const near = (pt: { x: number; y: number }) =>
        Math.hypot(pt.x - p.x, pt.y - p.y) < 16 / scale;
      if (h && near(h.rotateHandle)) {
        dragRef.current = {
          kind: "rotate",
          id: selected.id,
          startAngle: Math.atan2(p.y - selected.y, p.x - selected.x),
          startRotation: selected.rotation,
        };
        return;
      }
      if (h && near(h.scaleHandle)) {
        dragRef.current = {
          kind: "scale",
          id: selected.id,
          startDist: Math.hypot(p.x - selected.x, p.y - selected.y),
          startW: "width" in selected ? selected.width : h.w,
          startH: "height" in selected ? selected.height : h.h,
          startFont: selected.type === "text" ? selected.fontSize : 0,
        };
        return;
      }
    }

    const hit = hitTest(p);
    select(hit?.id ?? null);
    if (hit) dragRef.current = { kind: "move", id: hit.id, dx: p.x - hit.x, dy: p.y - hit.y };
  };

  const eraseAt = (id: string, p: { x: number; y: number }) => {
    setDoc(
      (d) => ({
        ...d,
        layers: d.layers.map((l) =>
          l.id === id && l.type === "draw"
            ? {
                ...l,
                strokes: l.strokes.filter(
                  (s) => !s.points.some((pt) => Math.hypot(pt.x - p.x, pt.y - p.y) < brushSize),
                ),
              }
            : l,
        ),
      }),
      false,
    );
  };

  const onPointerMove = (e: React.PointerEvent) => {
    const drag = dragRef.current;
    if (!drag) return;
    const p = toDoc(e);
    if (drag.kind === "move") {
      updateLayer(drag.id, { x: p.x - drag.dx, y: p.y - drag.dy }, false);
    } else if (drag.kind === "rotate") {
      const layer = doc.layers.find((l) => l.id === drag.id);
      if (!layer) return;
      const angle = Math.atan2(p.y - layer.y, p.x - layer.x);
      const deg = drag.startRotation + ((angle - drag.startAngle) * 180) / Math.PI;
      updateLayer(drag.id, { rotation: Math.round(deg) }, false);
    } else if (drag.kind === "scale") {
      const layer = doc.layers.find((l) => l.id === drag.id);
      if (!layer) return;
      const dist = Math.hypot(p.x - layer.x, p.y - layer.y);
      const ratio = Math.max(0.05, dist / Math.max(1, drag.startDist));
      if (layer.type === "text") {
        updateLayer(drag.id, { fontSize: Math.max(8, Math.round(drag.startFont * ratio)) }, false);
      } else if (layer.type === "shape" || layer.type === "image") {
        updateLayer(
          drag.id,
          {
            width: Math.max(10, Math.round(drag.startW * ratio)),
            height: Math.max(10, Math.round(drag.startH * ratio)),
          },
          false,
        );
      }
    } else if (drag.kind === "stroke") {
      if (tool === "erase") {
        eraseAt(drag.id, p);
        return;
      }
      setDoc(
        (d) => ({
          ...d,
          layers: d.layers.map((l) => {
            if (l.id !== drag.id || l.type !== "draw") return l;
            const strokes = [...l.strokes];
            const last = strokes[strokes.length - 1];
            if (!last) return l;
            strokes[strokes.length - 1] = { ...last, points: [...last.points, p] };
            return { ...l, strokes };
          }),
        }),
        false,
      );
    }
  };

  const onPointerUp = () => {
    dragRef.current = null;
  };

  const checker =
    "repeating-conic-gradient(rgba(255,255,255,0.08) 0% 25%, transparent 0% 50%) 50% / 24px 24px";

  return (
    <div
      ref={wrapRef}
      className="relative flex h-full w-full items-center justify-center overflow-auto bg-[radial-gradient(circle_at_50%_0%,color-mix(in_oklch,var(--primary)_12%,transparent),transparent_60%)] p-6"
    >
      <div
        className="relative shadow-[0_30px_80px_-20px_rgba(0,0,0,0.8)] ring-1 ring-border/70"
        style={{
          width: doc.width * scale,
          height: doc.height * scale,
          background: doc.background.type === "transparent" ? checker : undefined,
        }}
      >
        <canvas
          ref={canvasRef}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
          className="h-full w-full touch-none"
          style={{ cursor: tool === "select" ? "default" : "crosshair" }}
        />
      </div>
    </div>
  );
}
