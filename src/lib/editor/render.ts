import type {
  CanvasBackground,
  DrawLayer,
  EditorDoc,
  FillStyle,
  ImageLayer,
  Layer,
  ShapeLayer,
  TextLayer,
} from "./types";

const imageCache = new Map<string, HTMLImageElement>();

export function getImage(src: string, onLoad?: () => void): HTMLImageElement | null {
  if (typeof window === "undefined") return null;
  const cached = imageCache.get(src);
  if (cached) return cached.complete ? cached : null;
  const img = new Image();
  img.crossOrigin = "anonymous";
  img.onload = () => onLoad?.();
  img.src = src;
  imageCache.set(src, img);
  return null;
}

function makeFill(
  ctx: CanvasRenderingContext2D,
  fill: FillStyle,
  w: number,
  h: number,
): string | CanvasGradient {
  if (fill.type === "solid") return fill.color;
  const rad = ((fill.angle - 90) * Math.PI) / 180;
  const len = Math.max(w, h) / 2;
  const dx = Math.cos(rad) * len;
  const dy = Math.sin(rad) * len;
  const g = ctx.createLinearGradient(-dx, -dy, dx, dy);
  g.addColorStop(0, fill.color);
  g.addColorStop(1, fill.color2);
  return g;
}

export function textLines(layer: TextLayer) {
  const raw = layer.uppercase ? layer.text.toUpperCase() : layer.text;
  return raw.split("\n");
}

export function fontString(layer: TextLayer) {
  return `${layer.italic ? "italic " : ""}${layer.fontWeight} ${layer.fontSize}px "${layer.fontFamily}", sans-serif`;
}

export function measureText(ctx: CanvasRenderingContext2D, layer: TextLayer) {
  ctx.save();
  ctx.font = fontString(layer);
  const lines = textLines(layer);
  const widths = lines.map(
    (l) => ctx.measureText(l).width + Math.max(0, l.length - 1) * layer.letterSpacing,
  );
  ctx.restore();
  const width = Math.max(1, ...widths);
  const lineH = layer.fontSize * layer.lineHeight;
  const height = Math.max(lineH, lines.length * lineH);
  return { width, height, widths, lineH, lines };
}

function drawLineWithSpacing(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  spacing: number,
  mode: "fill" | "stroke",
) {
  if (!spacing) {
    if (mode === "fill") ctx.fillText(text, x, y);
    else ctx.strokeText(text, x, y);
    return;
  }
  let cursor = x;
  for (const ch of Array.from(text)) {
    if (mode === "fill") ctx.fillText(ch, cursor, y);
    else ctx.strokeText(ch, cursor, y);
    cursor += ctx.measureText(ch).width + spacing;
  }
}

function drawText(ctx: CanvasRenderingContext2D, layer: TextLayer) {
  const { widths, lineH, lines, width, height } = measureText(ctx, layer);
  ctx.font = fontString(layer);
  ctx.textBaseline = "middle";
  ctx.textAlign = "left";

  const startY = -height / 2 + lineH / 2;

  const lineX = (i: number) => {
    const w = widths[i] ?? 0;
    if (layer.align === "left") return -width / 2;
    if (layer.align === "right") return width / 2 - w;
    return -w / 2;
  };

  // 3D extrude
  if (layer.threeD.enabled && layer.threeD.depth > 0) {
    const rad = (layer.threeD.angle * Math.PI) / 180;
    ctx.save();
    ctx.fillStyle = layer.threeD.color;
    for (let d = layer.threeD.depth; d > 0; d--) {
      const ox = Math.cos(rad) * d;
      const oy = Math.sin(rad) * d;
      lines.forEach((line, i) => {
        drawLineWithSpacing(ctx, line, lineX(i) + ox, startY + i * lineH + oy, layer.letterSpacing, "fill");
      });
    }
    ctx.restore();
  }

  // glow
  if (layer.glow.enabled) {
    ctx.save();
    ctx.shadowColor = layer.glow.color;
    ctx.shadowBlur = layer.glow.blur;
    ctx.fillStyle = layer.glow.color;
    for (let i = 0; i < 3; i++) {
      lines.forEach((line, li) => {
        drawLineWithSpacing(ctx, line, lineX(li), startY + li * lineH, layer.letterSpacing, "fill");
      });
    }
    ctx.restore();
  }

  ctx.save();
  if (layer.shadow.enabled) {
    ctx.shadowColor = layer.shadow.color;
    ctx.shadowBlur = layer.shadow.blur;
    ctx.shadowOffsetX = layer.shadow.dx;
    ctx.shadowOffsetY = layer.shadow.dy;
  }

  if (layer.emboss.enabled) {
    const s = layer.emboss.strength;
    ctx.save();
    ctx.fillStyle = "rgba(255,255,255,0.55)";
    lines.forEach((line, i) =>
      drawLineWithSpacing(ctx, line, lineX(i) - s, startY + i * lineH - s, layer.letterSpacing, "fill"),
    );
    ctx.fillStyle = "rgba(0,0,0,0.55)";
    lines.forEach((line, i) =>
      drawLineWithSpacing(ctx, line, lineX(i) + s, startY + i * lineH + s, layer.letterSpacing, "fill"),
    );
    ctx.restore();
  }

  ctx.fillStyle = makeFill(ctx, layer.fill, width, height);
  lines.forEach((line, i) =>
    drawLineWithSpacing(ctx, line, lineX(i), startY + i * lineH, layer.letterSpacing, "fill"),
  );
  ctx.restore();

  if (layer.stroke.enabled && layer.stroke.width > 0) {
    ctx.save();
    ctx.lineJoin = "round";
    ctx.miterLimit = 2;
    ctx.strokeStyle = layer.stroke.color;
    ctx.lineWidth = layer.stroke.width;
    lines.forEach((line, i) =>
      drawLineWithSpacing(ctx, line, lineX(i), startY + i * lineH, layer.letterSpacing, "stroke"),
    );
    ctx.restore();
  }
}

function shapePath(ctx: CanvasRenderingContext2D, layer: ShapeLayer) {
  const w = layer.width;
  const h = layer.height;
  const hw = w / 2;
  const hh = h / 2;
  ctx.beginPath();
  switch (layer.shape) {
    case "rect": {
      const r = Math.min(layer.radius, hw, hh);
      ctx.roundRect(-hw, -hh, w, h, r);
      break;
    }
    case "ellipse":
      ctx.ellipse(0, 0, hw, hh, 0, 0, Math.PI * 2);
      break;
    case "triangle":
      ctx.moveTo(0, -hh);
      ctx.lineTo(hw, hh);
      ctx.lineTo(-hw, hh);
      ctx.closePath();
      break;
    case "diamond":
      ctx.moveTo(0, -hh);
      ctx.lineTo(hw, 0);
      ctx.lineTo(0, hh);
      ctx.lineTo(-hw, 0);
      ctx.closePath();
      break;
    case "hexagon": {
      for (let i = 0; i < 6; i++) {
        const a = (Math.PI / 3) * i - Math.PI / 2;
        const px = Math.cos(a) * hw;
        const py = Math.sin(a) * hh;
        i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
      }
      ctx.closePath();
      break;
    }
    case "star": {
      const spikes = 5;
      for (let i = 0; i < spikes * 2; i++) {
        const r = i % 2 === 0 ? 1 : 0.45;
        const a = (Math.PI / spikes) * i - Math.PI / 2;
        const px = Math.cos(a) * hw * r;
        const py = Math.sin(a) * hh * r;
        i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
      }
      ctx.closePath();
      break;
    }
    case "heart": {
      ctx.moveTo(0, hh * 0.75);
      ctx.bezierCurveTo(-hw * 1.4, -hh * 0.2, -hw * 0.5, -hh * 1.2, 0, -hh * 0.4);
      ctx.bezierCurveTo(hw * 0.5, -hh * 1.2, hw * 1.4, -hh * 0.2, 0, hh * 0.75);
      ctx.closePath();
      break;
    }
    case "arrow": {
      ctx.moveTo(-hw, -hh * 0.35);
      ctx.lineTo(hw * 0.25, -hh * 0.35);
      ctx.lineTo(hw * 0.25, -hh);
      ctx.lineTo(hw, 0);
      ctx.lineTo(hw * 0.25, hh);
      ctx.lineTo(hw * 0.25, hh * 0.35);
      ctx.lineTo(-hw, hh * 0.35);
      ctx.closePath();
      break;
    }
  }
}

function drawShape(ctx: CanvasRenderingContext2D, layer: ShapeLayer) {
  ctx.save();
  if (layer.glow.enabled) {
    ctx.shadowColor = layer.glow.color;
    ctx.shadowBlur = layer.glow.blur;
  } else if (layer.shadow.enabled) {
    ctx.shadowColor = layer.shadow.color;
    ctx.shadowBlur = layer.shadow.blur;
    ctx.shadowOffsetX = layer.shadow.dx;
    ctx.shadowOffsetY = layer.shadow.dy;
  }
  shapePath(ctx, layer);
  ctx.fillStyle = makeFill(ctx, layer.fill, layer.width, layer.height);
  ctx.fill();
  ctx.restore();
  if (layer.stroke.enabled && layer.stroke.width > 0) {
    shapePath(ctx, layer);
    ctx.strokeStyle = layer.stroke.color;
    ctx.lineWidth = layer.stroke.width;
    ctx.stroke();
  }
}

function filterString(f: ImageLayer["filters"]) {
  return [
    `brightness(${f.brightness}%)`,
    `contrast(${f.contrast}%)`,
    `saturate(${f.saturate}%)`,
    `blur(${f.blur}px)`,
    `grayscale(${f.grayscale}%)`,
    `sepia(${f.sepia}%)`,
    `hue-rotate(${f.hueRotate}deg)`,
  ].join(" ");
}

function drawImageLayer(
  ctx: CanvasRenderingContext2D,
  layer: ImageLayer,
  onLoad?: () => void,
) {
  const img = getImage(layer.src, onLoad);
  if (!img) return;
  ctx.save();
  if (layer.shadow.enabled) {
    ctx.shadowColor = layer.shadow.color;
    ctx.shadowBlur = layer.shadow.blur;
    ctx.shadowOffsetX = layer.shadow.dx;
    ctx.shadowOffsetY = layer.shadow.dy;
  }
  ctx.filter = filterString(layer.filters);
  const w = layer.width;
  const h = layer.height;
  if (layer.radius > 0) {
    ctx.beginPath();
    ctx.roundRect(-w / 2, -h / 2, w, h, Math.min(layer.radius, w / 2, h / 2));
    ctx.clip();
  }
  ctx.drawImage(img, -w / 2, -h / 2, w, h);
  ctx.restore();
  if (layer.stroke.enabled && layer.stroke.width > 0) {
    ctx.save();
    ctx.beginPath();
    ctx.roundRect(-w / 2, -h / 2, w, h, Math.min(layer.radius, w / 2, h / 2));
    ctx.strokeStyle = layer.stroke.color;
    ctx.lineWidth = layer.stroke.width;
    ctx.stroke();
    ctx.restore();
  }
}

function drawDrawing(ctx: CanvasRenderingContext2D, layer: DrawLayer) {
  ctx.save();
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  for (const stroke of layer.strokes) {
    if (stroke.points.length === 0) continue;
    ctx.beginPath();
    ctx.strokeStyle = stroke.color;
    ctx.lineWidth = stroke.width;
    const [first, ...rest] = stroke.points;
    ctx.moveTo(first!.x, first!.y);
    for (const p of rest) ctx.lineTo(p.x, p.y);
    if (rest.length === 0) ctx.lineTo(first!.x + 0.01, first!.y);
    ctx.stroke();
  }
  ctx.restore();
}

export function layerBounds(ctx: CanvasRenderingContext2D, layer: Layer) {
  if (layer.type === "text") {
    const m = measureText(ctx, layer);
    return { w: m.width, h: m.height };
  }
  if (layer.type === "shape" || layer.type === "image") {
    return { w: layer.width, h: layer.height };
  }
  return { w: 0, h: 0 };
}

export function drawLayer(
  ctx: CanvasRenderingContext2D,
  layer: Layer,
  onLoad?: () => void,
) {
  if (!layer.visible) return;
  ctx.save();
  ctx.globalAlpha = layer.opacity;
  if (layer.type !== "draw") {
    ctx.translate(layer.x, layer.y);
    ctx.rotate((layer.rotation * Math.PI) / 180);
  }
  switch (layer.type) {
    case "text":
      drawText(ctx, layer);
      break;
    case "shape":
      drawShape(ctx, layer);
      break;
    case "image":
      drawImageLayer(ctx, layer, onLoad);
      break;
    case "draw":
      drawDrawing(ctx, layer);
      break;
  }
  ctx.restore();
}

function drawBackground(
  ctx: CanvasRenderingContext2D,
  bg: CanvasBackground,
  w: number,
  h: number,
  onLoad?: () => void,
) {
  if (bg.type === "transparent") return;
  if (bg.type === "image" && bg.src) {
    const img = getImage(bg.src, onLoad);
    if (img) {
      const scale = Math.max(w / img.width, h / img.height);
      const dw = img.width * scale;
      const dh = img.height * scale;
      ctx.drawImage(img, (w - dw) / 2, (h - dh) / 2, dw, dh);
      return;
    }
  }
  if (bg.type === "gradient") {
    const rad = ((bg.angle - 90) * Math.PI) / 180;
    const len = Math.max(w, h) / 2;
    const g = ctx.createLinearGradient(
      w / 2 - Math.cos(rad) * len,
      h / 2 - Math.sin(rad) * len,
      w / 2 + Math.cos(rad) * len,
      h / 2 + Math.sin(rad) * len,
    );
    g.addColorStop(0, bg.color);
    g.addColorStop(1, bg.color2);
    ctx.fillStyle = g;
  } else {
    ctx.fillStyle = bg.color;
  }
  ctx.fillRect(0, 0, w, h);
}

export function renderDoc(
  ctx: CanvasRenderingContext2D,
  doc: EditorDoc,
  onLoad?: () => void,
) {
  ctx.clearRect(0, 0, doc.width, doc.height);
  drawBackground(ctx, doc.background, doc.width, doc.height, onLoad);
  for (const layer of doc.layers) drawLayer(ctx, layer, onLoad);
}

export function exportCanvas(doc: EditorDoc, scale = 1, type = "image/png", quality = 0.95) {
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(doc.width * scale);
  canvas.height = Math.round(doc.height * scale);
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;
  ctx.scale(scale, scale);
  if (type === "image/jpeg" && doc.background.type === "transparent") {
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, doc.width, doc.height);
  }
  renderDoc(ctx, doc);
  return canvas.toDataURL(type, quality);
}
