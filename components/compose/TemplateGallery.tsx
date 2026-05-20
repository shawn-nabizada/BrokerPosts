"use client";

import type { Broker, Kind, LayoutId, StyleId } from "@/types";
import { Template } from "@/components/templates/Template";
import {
  STYLE_IDS,
  LAYOUT_IDS,
  STYLE_META,
  LAYOUT_META,
} from "@/components/templates/meta";

function TemplateCard({
  styleId,
  layoutId,
  photos,
  count,
  broker,
  kind,
  active,
  onClick,
}: {
  styleId: StyleId;
  layoutId: LayoutId;
  photos: string[];
  count: number;
  broker: Broker | null;
  kind: Kind;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        background: "transparent",
        border: "none",
        padding: 0,
        cursor: "pointer",
        display: "flex",
        flexDirection: "column",
        gap: 10,
        textAlign: "left",
      }}
    >
      <div
        style={{
          width: 1080 * 0.2,
          height: 1080 * 0.2,
          position: "relative",
          overflow: "hidden",
          borderRadius: 4,
          outline: active ? "3px solid var(--accent)" : "1px solid var(--line-soft)",
          outlineOffset: active ? 2 : 0,
          transition: "outline 0.15s ease",
          background: "#000",
        }}
      >
        <div
          style={{
            width: 1080,
            height: 1080,
            transform: "scale(0.2)",
            transformOrigin: "top left",
            pointerEvents: "none",
          }}
        >
          <Template
            styleId={styleId}
            layoutId={layoutId}
            photos={photos}
            count={count}
            broker={broker}
            kind={kind}
          />
        </div>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <span
          style={{
            fontFamily: "var(--serif)",
            fontSize: 14,
            fontWeight: 600,
            color: active ? "var(--accent)" : "var(--ink)",
            letterSpacing: "-0.005em",
          }}
        >
          {STYLE_META[styleId].label} · {LAYOUT_META[layoutId].label}
        </span>
        <span
          style={{
            fontFamily: "var(--sans)",
            fontSize: 11,
            color: "var(--muted)",
            fontStyle: "italic",
          }}
        >
          {LAYOUT_META[layoutId].desc}
        </span>
      </div>
    </button>
  );
}

export function TemplateGallery({
  photos,
  count,
  broker,
  kind,
  selected,
  setSelected,
}: {
  photos: string[];
  count: number;
  broker: Broker | null;
  kind: Kind;
  selected: string | null;
  setSelected: (id: string) => void;
}) {
  return (
    <div>
      {STYLE_IDS.map((styleId) => (
        <div key={styleId} style={{ marginBottom: 32 }}>
          <div
            style={{
              display: "flex",
              alignItems: "baseline",
              gap: 10,
              marginBottom: 14,
              paddingBottom: 8,
              borderBottom: "1px solid var(--line-soft)",
            }}
          >
            <span
              style={{
                fontFamily: "var(--serif)",
                fontSize: 22,
                fontWeight: 600,
                color: "var(--ink)",
              }}
            >
              {STYLE_META[styleId].label}
            </span>
            <span
              style={{
                fontFamily: "var(--sans)",
                fontSize: 12,
                color: "var(--muted)",
                fontStyle: "italic",
              }}
            >
              {STYLE_META[styleId].desc}
            </span>
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, max-content)",
              gap: 24,
            }}
          >
            {LAYOUT_IDS.map((layoutId) => {
              const id = `${styleId}-${layoutId}`;
              return (
                <TemplateCard
                  key={id}
                  styleId={styleId}
                  layoutId={layoutId}
                  photos={photos}
                  count={count}
                  broker={broker}
                  kind={kind}
                  active={selected === id}
                  onClick={() => setSelected(id)}
                />
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
