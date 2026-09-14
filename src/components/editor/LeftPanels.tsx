import { useEffect, useMemo, useState } from "react";
import { Search, Upload, Type as TypeIcon, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { Chips, ColorRow, Section, SliderRow } from "@/components/editor/controls";
import { makeImage, makeShape, makeText } from "@/lib/editor/defaults";
import { useEditor } from "@/lib/editor/store";
import type { ShapeKind, TextLayer } from "@/lib/editor/types";
import { FANCY_STYLES } from "@/lib/fancy-text";
import {
  FONT_CATEGORIES,
  GOOGLE_FONTS,
  fileToDataUrl,
  loadGoogleFont,
  readCustomFonts,
  registerCustomFont,
  saveCustomFonts,
  type CustomFont,
} from "@/lib/fonts";
import { SYMBOL_CATEGORIES } from "@/lib/symbols";
import { cn } from "@/lib/utils";

function PanelShell({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="flex h-full flex-col">
      <div className="border-b border-border/60 px-4 py-3">
        <h2 className="text-sm font-semibold tracking-tight">{title}</h2>
      </div>
      <div className="min-h-0 flex-1 overflow-y-auto">{children}</div>
    </div>
  );
}

export function TextPanel() {
  const { selected, addLayer, updateLayer, doc } = useEditor();
  const text = selected?.type === "text" ? (selected as TextLayer) : null;
  const [draft, setDraft] = useState("");

  return (
    <PanelShell title="Text">
      <Section title="Add text">
        <textarea
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          rows={3}
          placeholder="Type something…"
          className="w-full resize-none rounded-lg border border-border bg-input/40 p-3 text-sm outline-none focus:border-primary"
        />
        <button
          type="button"
          onClick={() => {
            addLayer(makeText(draft.trim() || "Your text", doc.width / 2, doc.height / 2));
            setDraft("");
          }}
          className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-3 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90"
        >
          <TypeIcon className="h-4 w-4" /> Add text layer
        </button>
      </Section>

      {text && (
        <>
          <Section title="Edit selected">
            <textarea
              value={text.text}
              onChange={(e) => updateLayer(text.id, { text: e.target.value }, false)}
              rows={3}
              className="w-full resize-none rounded-lg border border-border bg-input/40 p-3 text-sm outline-none focus:border-primary"
            />
            <Chips
              value={text.align}
              onChange={(v) => updateLayer(text.id, { align: v })}
              options={[
                { value: "left", label: "Left" },
                { value: "center", label: "Center" },
                { value: "right", label: "Right" },
              ]}
            />
            <Chips
              value={text.uppercase ? "upper" : "normal"}
              onChange={(v) => updateLayer(text.id, { uppercase: v === "upper" })}
              options={[
                { value: "normal", label: "Normal case" },
                { value: "upper", label: "UPPERCASE" },
              ]}
            />
          </Section>
          <Section title="Typography">
            <SliderRow
              label="Size"
              value={text.fontSize}
              min={8}
              max={520}
              onChange={(v) => updateLayer(text.id, { fontSize: v }, false)}
            />
            <SliderRow
              label="Weight"
              value={text.fontWeight}
              min={100}
              max={900}
              step={100}
              onChange={(v) => updateLayer(text.id, { fontWeight: v }, false)}
            />
            <SliderRow
              label="Letter spacing"
              value={text.letterSpacing}
              min={-40}
              max={120}
              onChange={(v) => updateLayer(text.id, { letterSpacing: v }, false)}
            />
            <SliderRow
              label="Line height"
              value={text.lineHeight}
              min={0.6}
              max={3}
              step={0.05}
              onChange={(v) => updateLayer(text.id, { lineHeight: v }, false)}
            />
          </Section>
          <Section title="Fancy text">
            <div className="grid grid-cols-2 gap-1.5">
              {FANCY_STYLES.map((style) => (
                <button
                  key={style.id}
                  type="button"
                  onClick={() => updateLayer(text.id, { text: style.transform(text.text) })}
                  className="truncate rounded-md border border-border bg-card px-2 py-1.5 text-left text-[11px] hover:border-primary/60"
                  title={style.label}
                >
                  {style.transform("Abc 123")}
                </button>
              ))}
            </div>
          </Section>
        </>
      )}
    </PanelShell>
  );
}

export function FontsPanel() {
  const { selected, updateLayer } = useEditor();
  const text = selected?.type === "text" ? (selected as TextLayer) : null;
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<string>("All");
  const [custom, setCustom] = useState<CustomFont[]>([]);

  useEffect(() => {
    const fonts = readCustomFonts();
    setCustom(fonts);
    fonts.forEach((f) => void registerCustomFont(f));
  }, []);

  const list = useMemo(() => {
    const all = [
      ...custom.map((c) => ({ family: c.family, category: "Custom" })),
      ...GOOGLE_FONTS,
    ];
    return all.filter(
      (f) =>
        (category === "All" || f.category === category) &&
        f.family.toLowerCase().includes(query.trim().toLowerCase()),
    );
  }, [custom, category, query]);

  useEffect(() => {
    list.slice(0, 40).forEach((f) => {
      if (f.category !== "Custom") void loadGoogleFont(f.family);
    });
  }, [list]);

  const onUpload = async (files: FileList | null) => {
    if (!files) return;
    const next = [...custom];
    for (const file of Array.from(files)) {
      const family = file.name.replace(/\.(ttf|otf|woff2?|TTF|OTF|WOFF2?)$/, "");
      const dataUrl = await fileToDataUrl(file);
      const font = { family, dataUrl };
      await registerCustomFont(font);
      next.unshift(font);
    }
    setCustom(next);
    saveCustomFonts(next);
    toast.success("Font imported", { description: "Ab yeh fonts list mein available hai." });
  };

  return (
    <PanelShell title="Fonts">
      <Section title="Search">
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={`Search ${GOOGLE_FONTS.length + custom.length} fonts`}
            className="w-full rounded-lg border border-border bg-input/40 py-2 pl-9 pr-3 text-sm outline-none focus:border-primary"
          />
        </div>
        <div className="flex flex-wrap gap-1.5">
          {FONT_CATEGORIES.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setCategory(c)}
              className={cn(
                "rounded-full border px-2.5 py-1 text-[11px]",
                category === c
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-card text-muted-foreground hover:text-foreground",
              )}
            >
              {c}
            </button>
          ))}
        </div>
        <label className="flex cursor-pointer items-center justify-center gap-2 rounded-lg border border-dashed border-border px-3 py-2 text-xs text-muted-foreground hover:border-primary/60 hover:text-foreground">
          <Upload className="h-4 w-4" /> Import .ttf / .otf / .woff
          <input
            type="file"
            accept=".ttf,.otf,.woff,.woff2"
            multiple
            className="hidden"
            onChange={(e) => void onUpload(e.target.files)}
          />
        </label>
      </Section>
      <div className="px-2 pb-6">
        {!text && (
          <p className="px-2 py-3 text-xs text-muted-foreground">
            Pehle koi text layer select karein, phir font choose karein.
          </p>
        )}
        {list.map((f) => (
          <button
            key={f.family}
            type="button"
            onClick={async () => {
              if (f.category !== "Custom") await loadGoogleFont(f.family);
              if (text) updateLayer(text.id, { fontFamily: f.family });
            }}
            onMouseEnter={() => f.category !== "Custom" && void loadGoogleFont(f.family)}
            className={cn(
              "flex w-full items-center justify-between gap-3 rounded-lg px-3 py-2.5 text-left hover:bg-accent/60",
              text?.fontFamily === f.family && "bg-primary/15 ring-1 ring-primary/50",
            )}
          >
            <span className="truncate text-lg" style={{ fontFamily: `"${f.family}", sans-serif` }}>
              {f.family}
            </span>
            <span className="shrink-0 text-[10px] uppercase tracking-wide text-muted-foreground">
              {f.category}
            </span>
          </button>
        ))}
        {list.length === 0 && (
          <p className="px-3 py-6 text-center text-xs text-muted-foreground">No fonts found.</p>
        )}
      </div>
    </PanelShell>
  );
}

const SHAPES: { kind: ShapeKind; label: string }[] = [
  { kind: "rect", label: "Rectangle" },
  { kind: "ellipse", label: "Ellipse" },
  { kind: "triangle", label: "Triangle" },
  { kind: "diamond", label: "Diamond" },
  { kind: "hexagon", label: "Hexagon" },
  { kind: "star", label: "Star" },
  { kind: "heart", label: "Heart" },
  { kind: "arrow", label: "Arrow" },
];

export function ShapesPanel() {
  const { addLayer, doc } = useEditor();
  return (
    <PanelShell title="Shapes">
      <Section title="Insert">
        <div className="grid grid-cols-3 gap-2">
          {SHAPES.map((s) => (
            <button
              key={s.kind}
              type="button"
              onClick={() => addLayer(makeShape(s.kind, doc.width / 2, doc.height / 2))}
              className="rounded-lg border border-border bg-card px-2 py-3 text-[11px] hover:border-primary/60"
            >
              {s.label}
            </button>
          ))}
        </div>
      </Section>
    </PanelShell>
  );
}

export function ImagePanel() {
  const { addLayer, doc, setDoc } = useEditor();

  const addFile = async (file: File, asBackground: boolean) => {
    const dataUrl = await fileToDataUrl(file);
    if (asBackground) {
      setDoc((d) => ({ ...d, background: { ...d.background, type: "image", src: dataUrl } }));
      return;
    }
    const img = new Image();
    img.onload = () => {
      const max = doc.width * 0.7;
      const ratio = Math.min(max / img.width, max / img.height, 1);
      addLayer(
        makeImage(dataUrl, img.width * ratio, img.height * ratio, doc.width / 2, doc.height / 2),
      );
    };
    img.src = dataUrl;
  };

  return (
    <PanelShell title="Image">
      <Section title="Upload">
        <label className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-border px-4 py-8 text-xs text-muted-foreground hover:border-primary/60 hover:text-foreground">
          <Upload className="h-5 w-5" /> Add image layer
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => e.target.files?.[0] && void addFile(e.target.files[0], false)}
          />
        </label>
        <label className="flex cursor-pointer items-center justify-center gap-2 rounded-lg border border-border px-3 py-2 text-xs text-muted-foreground hover:border-primary/60 hover:text-foreground">
          Use as background
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => e.target.files?.[0] && void addFile(e.target.files[0], true)}
          />
        </label>
      </Section>
    </PanelShell>
  );
}

export function SymbolsPanel() {
  const { selected, updateLayer, addLayer, doc } = useEditor();
  const [category, setCategory] = useState(SYMBOL_CATEGORIES[0]!.id);
  const active = SYMBOL_CATEGORIES.find((c) => c.id === category)!;

  const insert = (symbol: string) => {
    if (selected?.type === "text") {
      updateLayer(selected.id, { text: selected.text + symbol });
    } else {
      const layer = makeText(symbol, doc.width / 2, doc.height / 2);
      layer.fontFamily = "Inter";
      addLayer(layer);
    }
  };

  return (
    <PanelShell title="Symbols">
      <Section title="Categories">
        <div className="flex flex-wrap gap-1.5">
          {SYMBOL_CATEGORIES.map((c) => (
            <button
              key={c.id}
              type="button"
              onClick={() => setCategory(c.id)}
              className={cn(
                "rounded-full border px-2.5 py-1 text-[11px]",
                category === c.id
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-card text-muted-foreground hover:text-foreground",
              )}
            >
              {c.label}
            </button>
          ))}
        </div>
      </Section>
      <div className="grid grid-cols-7 gap-1 p-3">
        {active.symbols.map((s, i) => (
          <button
            key={`${s}-${i}`}
            type="button"
            onClick={() => insert(s)}
            className="aspect-square rounded-md border border-border/60 bg-card text-lg hover:border-primary/60"
          >
            {s}
          </button>
        ))}
      </div>
    </PanelShell>
  );
}

export function DrawPanel({
  color,
  size,
  onColor,
  onSize,
  mode,
  onMode,
}: {
  color: string;
  size: number;
  onColor: (c: string) => void;
  onSize: (s: number) => void;
  mode: "draw" | "erase";
  onMode: (m: "draw" | "erase") => void;
}) {
  return (
    <PanelShell title={mode === "draw" ? "Draw" : "Erase"}>
      <Section title="Brush">
        <Chips
          value={mode}
          onChange={onMode}
          options={[
            { value: "draw", label: "Draw" },
            { value: "erase", label: "Erase" },
          ]}
        />
        <ColorRow label="Color" value={color} onChange={onColor} />
        <SliderRow label="Size" value={size} min={1} max={120} onChange={onSize} suffix="px" />
        <p className="text-[11px] text-muted-foreground">
          Canvas par drag karein. Eraser nazdeeki strokes hata deta hai.
        </p>
      </Section>
    </PanelShell>
  );
}

export function BackgroundPanel() {
  const { doc, setDoc } = useEditor();
  const bg = doc.background;
  const patch = (p: Partial<typeof bg>) => setDoc((d) => ({ ...d, background: { ...d.background, ...p } }));

  const presets = [
    ["#0f0c29", "#302b63"],
    ["#ff512f", "#dd2476"],
    ["#11998e", "#38ef7d"],
    ["#fc466b", "#3f5efb"],
    ["#f7971e", "#ffd200"],
    ["#000000", "#434343"],
  ];

  return (
    <PanelShell title="Background">
      <Section title="Type">
        <Chips
          value={bg.type}
          onChange={(v) => patch({ type: v })}
          options={[
            { value: "solid", label: "Solid" },
            { value: "gradient", label: "Gradient" },
            { value: "image", label: "Image" },
            { value: "transparent", label: "None" },
          ]}
        />
        {bg.type !== "transparent" && bg.type !== "image" && (
          <>
            <ColorRow label="Color" value={bg.color} onChange={(v) => patch({ color: v })} />
            {bg.type === "gradient" && (
              <>
                <ColorRow label="Color 2" value={bg.color2} onChange={(v) => patch({ color2: v })} />
                <SliderRow
                  label="Angle"
                  value={bg.angle}
                  min={0}
                  max={360}
                  suffix="°"
                  onChange={(v) => patch({ angle: v })}
                />
              </>
            )}
          </>
        )}
        {bg.type === "image" && (
          <p className="text-[11px] text-muted-foreground">
            Image panel se background image upload karein.
          </p>
        )}
      </Section>
      <Section title="Presets">
        <div className="grid grid-cols-3 gap-2">
          {presets.map(([a, b]) => (
            <button
              key={a}
              type="button"
              onClick={() => patch({ type: "gradient", color: a!, color2: b!, angle: 135 })}
              className="h-12 rounded-lg border border-border"
              style={{ background: `linear-gradient(135deg, ${a}, ${b})` }}
              aria-label={`Preset ${a}`}
            />
          ))}
        </div>
      </Section>
      <Section title="Canvas size">
        <div className="grid grid-cols-2 gap-2">
          {[
            { w: 1080, h: 1080, label: "Square 1:1" },
            { w: 1080, h: 1350, label: "Portrait 4:5" },
            { w: 1080, h: 1920, label: "Story 9:16" },
            { w: 1920, h: 1080, label: "Wide 16:9" },
          ].map((s) => (
            <button
              key={s.label}
              type="button"
              onClick={() => setDoc((d) => ({ ...d, width: s.w, height: s.h }))}
              className={cn(
                "rounded-lg border border-border bg-card px-2 py-2 text-[11px] hover:border-primary/60",
                doc.width === s.w && doc.height === s.h && "border-primary text-primary",
              )}
            >
              {s.label}
            </button>
          ))}
        </div>
      </Section>
      <Section title="Danger zone">
        <button
          type="button"
          onClick={() => setDoc((d) => ({ ...d, layers: [] }))}
          className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-destructive/50 px-3 py-2 text-xs text-destructive hover:bg-destructive/10"
        >
          <Trash2 className="h-4 w-4" /> Clear all layers
        </button>
      </Section>
    </PanelShell>
  );
}
