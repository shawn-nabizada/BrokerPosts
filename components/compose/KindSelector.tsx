"use client";

import type { Kind } from "@/types";
import { Icon, type IconName } from "@/components/Icon";

const OPTS: { id: Kind; label: string; sub: string; icon: IconName }[] = [
  { id: "vendu", label: "VENDU", sub: "Propriété vendue", icon: "key" },
  { id: "achete", label: "ACHETÉ", sub: "Propriété achetée", icon: "sparkle" },
];

export function KindSelector({
  kind,
  setKind,
}: {
  kind: Kind;
  setKind: (k: Kind) => void;
}) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
      {OPTS.map((o) => {
        const active = kind === o.id;
        return (
          <button
            key={o.id}
            type="button"
            onClick={() => setKind(o.id)}
            style={{
              background: active ? "var(--ink)" : "#fff",
              color: active ? "#E6EEF6" : "var(--ink)",
              border: active ? "1px solid var(--ink)" : "1px solid var(--line)",
              borderRadius: 10,
              padding: "18px 22px",
              fontFamily: "var(--sans)",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: 16,
              transition: "all 0.15s ease",
              textAlign: "left",
            }}
          >
            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: "50%",
                background: active ? "var(--accent)" : "rgba(26,74,138,0.1)",
                color: active ? "#E6EEF6" : "var(--accent)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <Icon name={o.icon} size={18} stroke={2} />
            </div>
            <div style={{ flex: 1 }}>
              <div
                style={{
                  fontSize: 18,
                  fontWeight: 700,
                  letterSpacing: "0.04em",
                  lineHeight: 1,
                }}
              >
                {o.label}
              </div>
              <div
                style={{
                  fontSize: 12,
                  marginTop: 4,
                  opacity: 0.6,
                  fontStyle: "italic",
                  fontFamily: "var(--serif)",
                }}
              >
                {o.sub}
              </div>
            </div>
            <div
              style={{
                width: 18,
                height: 18,
                borderRadius: "50%",
                border: `1.5px solid ${active ? "#E6EEF6" : "var(--line)"}`,
                background: active ? "#E6EEF6" : "transparent",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {active ? (
                <Icon name="check" size={11} stroke={3} style={{ color: "var(--ink)" }} />
              ) : null}
            </div>
          </button>
        );
      })}
    </div>
  );
}
