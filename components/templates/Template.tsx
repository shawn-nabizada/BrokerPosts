import type { RefObject } from "react";
import type { Broker, Kind, LayoutId, StyleId } from "@/types";
import {
  ClassiqueTemplate,
  ModerneTemplate,
  EditorialTemplate,
  type StyleProps,
} from "./styles";

const STYLE_COMPONENTS: Record<StyleId, (p: StyleProps) => React.ReactNode> = {
  classic: ClassiqueTemplate,
  modern: ModerneTemplate,
  editorial: EditorialTemplate,
};

/** Renders a 1080×1080 post canvas for a given style + layout. */
export function Template({
  styleId,
  layoutId,
  photos,
  count,
  broker,
  kind,
}: {
  styleId: StyleId;
  layoutId: LayoutId;
  photos: (string | null)[];
  count: number;
  broker: Broker | null;
  kind: Kind;
}) {
  const Comp = STYLE_COMPONENTS[styleId];
  if (!Comp) return null;
  // Pad photos so PhotoGrid always sees `count` slots.
  const safePhotos: (string | null)[] = photos.slice(0, count);
  while (safePhotos.length < count) safePhotos.push(null);
  return (
    <Comp
      photos={safePhotos}
      count={count}
      layoutId={layoutId}
      broker={broker}
      kind={kind}
    />
  );
}

/** Scaled wrapper for the 1080×1080 canvas; `captureRef` targets the full-size node. */
export function TemplatePreview({
  scale = 0.45,
  children,
  captureRef,
}: {
  scale?: number;
  children: React.ReactNode;
  captureRef?: RefObject<HTMLDivElement | null>;
}) {
  return (
    <div
      style={{
        width: 1080 * scale,
        height: 1080 * scale,
        position: "relative",
        background: "#000",
        boxShadow: "0 8px 30px rgba(15,26,46,0.18)",
        overflow: "hidden",
      }}
    >
      <div
        ref={captureRef}
        style={{
          width: 1080,
          height: 1080,
          transform: `scale(${scale})`,
          transformOrigin: "top left",
        }}
      >
        {children}
      </div>
    </div>
  );
}
