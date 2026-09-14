export type FillStyle = {
  type: "solid" | "gradient";
  color: string;
  color2: string;
  angle: number;
};

export type StrokeStyle = {
  enabled: boolean;
  color: string;
  width: number;
};

export type ShadowStyle = {
  enabled: boolean;
  color: string;
  blur: number;
  dx: number;
  dy: number;
};

export type GlowStyle = {
  enabled: boolean;
  color: string;
  blur: number;
};

export type ThreeDStyle = {
  enabled: boolean;
  depth: number;
  color: string;
  angle: number;
};

export type EmbossStyle = {
  enabled: boolean;
  strength: number;
};

export type ImageFilters = {
  brightness: number;
  contrast: number;
  saturate: number;
  blur: number;
  grayscale: number;
  sepia: number;
  hueRotate: number;
};

export type BaseLayer = {
  id: string;
  name: string;
  x: number;
  y: number;
  rotation: number;
  opacity: number;
  visible: boolean;
  locked: boolean;
};

export type TextLayer = BaseLayer & {
  type: "text";
  text: string;
  fontFamily: string;
  fontSize: number;
  fontWeight: number;
  italic: boolean;
  uppercase: boolean;
  letterSpacing: number;
  lineHeight: number;
  align: "left" | "center" | "right";
  curve: number;
  fill: FillStyle;
  stroke: StrokeStyle;
  shadow: ShadowStyle;
  glow: GlowStyle;
  threeD: ThreeDStyle;
  emboss: EmbossStyle;
};

export type ShapeKind =
  | "rect"
  | "ellipse"
  | "triangle"
  | "star"
  | "heart"
  | "hexagon"
  | "diamond"
  | "arrow";

export type ShapeLayer = BaseLayer & {
  type: "shape";
  shape: ShapeKind;
  width: number;
  height: number;
  radius: number;
  fill: FillStyle;
  stroke: StrokeStyle;
  shadow: ShadowStyle;
  glow: GlowStyle;
};

export type ImageLayer = BaseLayer & {
  type: "image";
  src: string;
  width: number;
  height: number;
  radius: number;
  filters: ImageFilters;
  shadow: ShadowStyle;
  stroke: StrokeStyle;
};

export type DrawStroke = {
  color: string;
  width: number;
  points: { x: number; y: number }[];
};

export type DrawLayer = BaseLayer & {
  type: "draw";
  strokes: DrawStroke[];
};

export type Layer = TextLayer | ShapeLayer | ImageLayer | DrawLayer;

export type CanvasBackground = {
  type: "solid" | "gradient" | "transparent" | "image";
  color: string;
  color2: string;
  angle: number;
  src?: string;
};

export type EditorDoc = {
  width: number;
  height: number;
  background: CanvasBackground;
  layers: Layer[];
};

export type ToolId =
  | "text"
  | "fonts"
  | "shapes"
  | "image"
  | "symbols"
  | "draw"
  | "erase"
  | "background"
  | "layers";
