import type {
  DrawLayer,
  EditorDoc,
  FillStyle,
  ImageLayer,
  ShapeKind,
  ShapeLayer,
  TextLayer,
} from "./types";

export const uid = () => Math.random().toString(36).slice(2, 10);

export const solidFill = (color: string): FillStyle => ({
  type: "solid",
  color,
  color2: "#ff7a18",
  angle: 90,
});

export const emptyDoc = (): EditorDoc => ({
  width: 1080,
  height: 1080,
  background: {
    type: "gradient",
    color: "#101014",
    color2: "#2a2136",
    angle: 135,
  },
  layers: [],
});

export const makeText = (text = "Your text", x = 540, y = 540): TextLayer => ({
  id: uid(),
  name: text.slice(0, 18) || "Text",
  type: "text",
  x,
  y,
  rotation: 0,
  opacity: 1,
  visible: true,
  locked: false,
  text,
  fontFamily: "Anton",
  fontSize: 140,
  fontWeight: 400,
  italic: false,
  uppercase: false,
  letterSpacing: 0,
  lineHeight: 1.1,
  align: "center",
  curve: 0,
  fill: { type: "gradient", color: "#ffd166", color2: "#ff5f6d", angle: 90 },
  stroke: { enabled: false, color: "#000000", width: 6 },
  shadow: { enabled: true, color: "#000000cc", blur: 24, dx: 0, dy: 10 },
  glow: { enabled: false, color: "#7dd3fc", blur: 40 },
  threeD: { enabled: false, depth: 12, color: "#3b2f4a", angle: 45 },
  emboss: { enabled: false, strength: 4 },
});

export const makeShape = (shape: ShapeKind, x = 540, y = 540): ShapeLayer => ({
  id: uid(),
  name: shape,
  type: "shape",
  x,
  y,
  rotation: 0,
  opacity: 1,
  visible: true,
  locked: false,
  shape,
  width: 320,
  height: 320,
  radius: 24,
  fill: solidFill("#ff7a18"),
  stroke: { enabled: false, color: "#ffffff", width: 6 },
  shadow: { enabled: false, color: "#000000aa", blur: 30, dx: 0, dy: 12 },
  glow: { enabled: false, color: "#ff7a18", blur: 40 },
});

export const makeImage = (
  src: string,
  width: number,
  height: number,
  x = 540,
  y = 540,
): ImageLayer => ({
  id: uid(),
  name: "Image",
  type: "image",
  x,
  y,
  rotation: 0,
  opacity: 1,
  visible: true,
  locked: false,
  src,
  width,
  height,
  radius: 0,
  filters: {
    brightness: 100,
    contrast: 100,
    saturate: 100,
    blur: 0,
    grayscale: 0,
    sepia: 0,
    hueRotate: 0,
  },
  shadow: { enabled: false, color: "#000000aa", blur: 30, dx: 0, dy: 12 },
  stroke: { enabled: false, color: "#ffffff", width: 8 },
});

export const makeDraw = (): DrawLayer => ({
  id: uid(),
  name: "Drawing",
  type: "draw",
  x: 0,
  y: 0,
  rotation: 0,
  opacity: 1,
  visible: true,
  locked: false,
  strokes: [],
});
