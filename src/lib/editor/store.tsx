import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";

import { emptyDoc, makeText, uid } from "./defaults";
import type { EditorDoc, Layer } from "./types";

type EditorContextValue = {
  doc: EditorDoc;
  selectedId: string | null;
  selected: Layer | null;
  canUndo: boolean;
  canRedo: boolean;
  select: (id: string | null) => void;
  setDoc: (next: EditorDoc | ((d: EditorDoc) => EditorDoc), history?: boolean) => void;
  addLayer: (layer: Layer) => void;
  updateLayer: (id: string, patch: Partial<Layer> | ((l: Layer) => Layer), history?: boolean) => void;
  removeLayer: (id: string) => void;
  duplicateLayer: (id: string) => void;
  reorder: (id: string, direction: "up" | "down" | "front" | "back") => void;
  undo: () => void;
  redo: () => void;
  reset: () => void;
};

const EditorContext = createContext<EditorContextValue | null>(null);

function starterDoc(): EditorDoc {
  const doc = emptyDoc();
  const headline = makeText("FONTASTIC", 540, 470);
  const sub = makeText("STUDIO", 540, 640);
  sub.fontFamily = "Bebas Neue";
  sub.fontSize = 84;
  sub.letterSpacing = 26;
  sub.fill = { type: "solid", color: "#ffffff", color2: "#ffffff", angle: 90 };
  sub.shadow = { enabled: false, color: "#000000", blur: 0, dx: 0, dy: 0 };
  doc.layers = [headline, sub];
  return doc;
}

export function EditorProvider({ children }: { children: ReactNode }) {
  const [doc, setDocState] = useState<EditorDoc>(starterDoc);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const past = useRef<EditorDoc[]>([]);
  const future = useRef<EditorDoc[]>([]);
  const [version, setVersion] = useState(0);

  const bump = () => setVersion((v) => v + 1);

  const setDoc = useCallback(
    (next: EditorDoc | ((d: EditorDoc) => EditorDoc), history = true) => {
      setDocState((current) => {
        if (history) {
          past.current = [...past.current.slice(-59), current];
          future.current = [];
        }
        return typeof next === "function" ? (next as (d: EditorDoc) => EditorDoc)(current) : next;
      });
      bump();
    },
    [],
  );

  const addLayer = useCallback(
    (layer: Layer) => {
      setDoc((d) => ({ ...d, layers: [...d.layers, layer] }));
      setSelectedId(layer.id);
    },
    [setDoc],
  );

  const updateLayer = useCallback<EditorContextValue["updateLayer"]>(
    (id, patch, history = true) => {
      setDoc(
        (d) => ({
          ...d,
          layers: d.layers.map((l) =>
            l.id === id
              ? typeof patch === "function"
                ? patch(l)
                : ({ ...l, ...patch } as Layer)
              : l,
          ),
        }),
        history,
      );
    },
    [setDoc],
  );

  const removeLayer = useCallback(
    (id: string) => {
      setDoc((d) => ({ ...d, layers: d.layers.filter((l) => l.id !== id) }));
      setSelectedId((cur) => (cur === id ? null : cur));
    },
    [setDoc],
  );

  const duplicateLayer = useCallback(
    (id: string) => {
      let newId = "";
      setDoc((d) => {
        const layer = d.layers.find((l) => l.id === id);
        if (!layer) return d;
        newId = uid();
        const copy = { ...layer, id: newId, x: layer.x + 30, y: layer.y + 30 } as Layer;
        const index = d.layers.findIndex((l) => l.id === id);
        const layers = [...d.layers];
        layers.splice(index + 1, 0, copy);
        return { ...d, layers };
      });
      if (newId) setSelectedId(newId);
    },
    [setDoc],
  );

  const reorder = useCallback<EditorContextValue["reorder"]>(
    (id, direction) => {
      setDoc((d) => {
        const index = d.layers.findIndex((l) => l.id === id);
        if (index < 0) return d;
        const layers = [...d.layers];
        const [layer] = layers.splice(index, 1);
        if (!layer) return d;
        const target =
          direction === "up"
            ? Math.min(layers.length, index + 1)
            : direction === "down"
              ? Math.max(0, index - 1)
              : direction === "front"
                ? layers.length
                : 0;
        layers.splice(target, 0, layer);
        return { ...d, layers };
      });
    },
    [setDoc],
  );

  const undo = useCallback(() => {
    setDocState((current) => {
      const prev = past.current.pop();
      if (!prev) return current;
      future.current = [current, ...future.current.slice(0, 59)];
      return prev;
    });
    bump();
  }, []);

  const redo = useCallback(() => {
    setDocState((current) => {
      const [next, ...rest] = future.current;
      if (!next) return current;
      future.current = rest;
      past.current = [...past.current, current];
      return next;
    });
    bump();
  }, []);

  const reset = useCallback(() => {
    setDoc(emptyDoc());
    setSelectedId(null);
  }, [setDoc]);

  const value = useMemo<EditorContextValue>(
    () => ({
      doc,
      selectedId,
      selected: doc.layers.find((l) => l.id === selectedId) ?? null,
      canUndo: past.current.length > 0,
      canRedo: future.current.length > 0,
      select: setSelectedId,
      setDoc,
      addLayer,
      updateLayer,
      removeLayer,
      duplicateLayer,
      reorder,
      undo,
      redo,
      reset,
    }),
    // version keeps canUndo/canRedo fresh
    [doc, selectedId, version, setDoc, addLayer, updateLayer, removeLayer, duplicateLayer, reorder, undo, redo, reset],
  );

  return <EditorContext.Provider value={value}>{children}</EditorContext.Provider>;
}

export function useEditor() {
  const ctx = useContext(EditorContext);
  if (!ctx) throw new Error("useEditor must be used inside EditorProvider");
  return ctx;
}
