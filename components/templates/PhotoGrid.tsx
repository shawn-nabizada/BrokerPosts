import type { CSSProperties } from "react";
import type { LayoutId } from "@/types";
import { LAYOUT_GRIDS } from "./meta";

const CELLS = ["a", "b", "c", "d", "e"] as const;

function PhotoPlaceholder({ label }: { label: string }) {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background:
          "repeating-linear-gradient(135deg, rgba(255,255,255,0.04) 0 12px, rgba(255,255,255,0.08) 12px 24px), #2a2a2a",
        color: "rgba(255,255,255,0.6)",
        fontFamily: "var(--mono)",
        fontSize: 14,
        letterSpacing: "0.06em",
        textTransform: "uppercase",
      }}
    >
      {label}
    </div>
  );
}

export function PhotoGrid({
  photos,
  count,
  layout,
  gap = 6,
  style = {},
}: {
  photos: (string | null)[];
  count: number;
  layout: LayoutId;
  gap?: number;
  style?: CSSProperties;
}) {
  const conf = LAYOUT_GRIDS[layout][count];
  const cells = CELLS.slice(0, count);
  return (
    <div
      style={{
        display: "grid",
        gridTemplateAreas: conf.areas,
        gridTemplateColumns: conf.cols,
        gridTemplateRows: conf.rows,
        gap: `${gap}px`,
        width: "100%",
        height: "100%",
        overflow: "hidden",
        ...style,
      }}
    >
      {cells.map((c, i) => (
        <div
          key={c}
          style={{
            gridArea: c,
            overflow: "hidden",
            background: "#1a1a1a",
            position: "relative",
          }}
        >
          {photos[i] ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={photos[i] as string}
              alt=""
              crossOrigin="anonymous"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                display: "block",
              }}
            />
          ) : (
            <PhotoPlaceholder label={`Photo ${i + 1}`} />
          )}
        </div>
      ))}
    </div>
  );
}
