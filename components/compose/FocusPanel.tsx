"use client";

import { useEffect, useRef, useState } from "react";
import * as htmlToImage from "html-to-image";
import type { Broker, Kind, LayoutId, StyleId } from "@/types";
import { Icon } from "@/components/Icon";
import { Template, TemplatePreview } from "@/components/templates/Template";
import { STYLE_META, LAYOUT_META } from "@/components/templates/meta";
import { generateCaption } from "@/lib/captions";

export function FocusPanel({
  styleId,
  layoutId,
  photos,
  count,
  broker,
  kind,
  onClose,
}: {
  styleId: StyleId;
  layoutId: LayoutId;
  photos: string[];
  count: number;
  broker: Broker | null;
  kind: Kind;
  onClose: () => void;
}) {
  const captureRef = useRef<HTMLDivElement>(null);
  const [downloading, setDownloading] = useState(false);
  const [captionCopied, setCaptionCopied] = useState(false);

  const caption = generateCaption({ kind, styleId, broker });

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const onDownload = async () => {
    if (!captureRef.current) return;
    setDownloading(true);
    try {
      await new Promise((r) => requestAnimationFrame(r));
      const dataUrl = await htmlToImage.toPng(captureRef.current, {
        width: 1080,
        height: 1080,
        pixelRatio: 1,
        cacheBust: true,
        style: { transform: "none" },
      });
      const link = document.createElement("a");
      const tag = `${kind}_${STYLE_META[styleId].label}_${LAYOUT_META[layoutId].label}`
        .toLowerCase()
        .replace(/[^a-z0-9_-]/g, "");
      link.download = `publimo_${tag}.png`;
      link.href = dataUrl;
      link.click();
    } catch (e) {
      console.error("Download failed", e);
      alert("Le téléchargement a échoué. Réessayez.");
    }
    setDownloading(false);
  };

  const onCopy = async () => {
    try {
      await navigator.clipboard.writeText(caption.full);
      setCaptionCopied(true);
      setTimeout(() => setCaptionCopied(false), 1800);
    } catch (e) {
      console.warn(e);
    }
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(14,30,71,0.55)",
        zIndex: 50,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 32,
        backdropFilter: "blur(8px)",
      }}
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "#DCE6F0",
          borderRadius: 14,
          maxWidth: 1200,
          width: "100%",
          maxHeight: "calc(100vh - 64px)",
          overflow: "hidden",
          display: "grid",
          gridTemplateColumns: "minmax(0,1fr) 420px",
          boxShadow: "0 24px 80px rgba(0,0,0,0.3)",
        }}
      >
        <div
          style={{
            padding: 36,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            background: "#C9D6E5",
            position: "relative",
            overflow: "auto",
          }}
        >
          <div
            style={{
              fontFamily: "var(--mono)",
              fontSize: 10,
              letterSpacing: "0.32em",
              color: "var(--ink)",
              opacity: 0.6,
              marginBottom: 16,
              textTransform: "uppercase",
            }}
          >
            Aperçu · 1080 × 1080
          </div>
          <TemplatePreview scale={0.5} captureRef={captureRef}>
            <Template
              styleId={styleId}
              layoutId={layoutId}
              photos={photos}
              count={count}
              broker={broker}
              kind={kind}
            />
          </TemplatePreview>
        </div>

        <div
          style={{
            padding: "32px 32px 28px",
            display: "flex",
            flexDirection: "column",
            background: "#fff",
            overflow: "auto",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: 18,
            }}
          >
            <div>
              <div
                style={{
                  fontFamily: "var(--mono)",
                  fontSize: 10,
                  letterSpacing: "0.32em",
                  color: "var(--accent)",
                  fontWeight: 600,
                  textTransform: "uppercase",
                }}
              >
                {kind === "vendu" ? "Publication · Vendu" : "Publication · Acheté"}
              </div>
              <div
                style={{
                  fontFamily: "var(--serif)",
                  fontSize: 28,
                  fontWeight: 600,
                  marginTop: 4,
                  letterSpacing: "-0.01em",
                  color: "var(--ink)",
                }}
              >
                {STYLE_META[styleId].label} · {LAYOUT_META[layoutId].label}
              </div>
            </div>
            <button
              type="button"
              onClick={onClose}
              style={{
                background: "transparent",
                border: "1px solid var(--line)",
                width: 34,
                height: 34,
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                color: "var(--ink)",
              }}
              aria-label="Fermer"
            >
              <Icon name="x" size={16} stroke={2} />
            </button>
          </div>

          <div
            style={{
              fontFamily: "var(--sans)",
              fontSize: 11,
              fontWeight: 600,
              textTransform: "uppercase",
              letterSpacing: "0.18em",
              color: "var(--muted)",
              marginBottom: 8,
            }}
          >
            Légende française
          </div>
          <div
            style={{
              background: "#E6EEF6",
              border: "1px solid var(--line-soft)",
              borderRadius: 8,
              padding: "16px 16px",
              fontFamily: "var(--sans)",
              fontSize: 13.5,
              lineHeight: 1.6,
              color: "var(--ink)",
              whiteSpace: "pre-wrap",
              flex: 1,
              minHeight: 240,
              marginBottom: 14,
              overflow: "auto",
            }}
          >
            {caption.full}
          </div>

          <div style={{ display: "flex", gap: 10 }}>
            <button
              type="button"
              onClick={onCopy}
              style={{
                background: captionCopied ? "var(--accent)" : "#fff",
                color: captionCopied ? "#E6EEF6" : "var(--ink)",
                border: `1px solid ${captionCopied ? "var(--accent)" : "var(--line)"}`,
                borderRadius: 6,
                padding: "12px 16px",
                fontFamily: "var(--sans)",
                fontSize: 13,
                fontWeight: 600,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: 8,
                transition: "all 0.15s ease",
                flex: "0 0 auto",
              }}
            >
              <Icon name={captionCopied ? "check" : "copy"} size={14} stroke={2} />
              {captionCopied ? "Copié !" : "Copier la légende"}
            </button>
            <button
              type="button"
              onClick={onDownload}
              disabled={downloading}
              style={{
                background: "var(--ink)",
                color: "#E6EEF6",
                border: "none",
                borderRadius: 6,
                padding: "12px 18px",
                fontFamily: "var(--sans)",
                fontSize: 13,
                fontWeight: 600,
                cursor: downloading ? "wait" : "pointer",
                display: "flex",
                alignItems: "center",
                gap: 8,
                flex: 1,
                justifyContent: "center",
                opacity: downloading ? 0.7 : 1,
              }}
            >
              <Icon name="download" size={14} stroke={2} />
              {downloading ? "Génération…" : "Télécharger PNG"}
            </button>
          </div>

          <div
            style={{
              marginTop: 16,
              fontFamily: "var(--sans)",
              fontSize: 11,
              color: "var(--muted)",
              fontStyle: "italic",
              textAlign: "center",
              lineHeight: 1.5,
            }}
          >
            Format 1080 × 1080 · idéal pour Instagram et Facebook
          </div>
        </div>
      </div>
    </div>
  );
}
