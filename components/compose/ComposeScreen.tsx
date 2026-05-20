"use client";

import { useEffect, useState } from "react";
import { signOut } from "next-auth/react";
import type { Broker } from "@/types";
import { Icon } from "@/components/Icon";
import { PhotoStrip, PHOTO_MIN, PHOTO_MAX } from "./PhotoStrip";
import { KindSelector } from "./KindSelector";
import { TemplateGallery } from "./TemplateGallery";
import { FocusPanel } from "./FocusPanel";
import type { Kind, StyleId, LayoutId } from "@/types";

function SectionLabel({
  index,
  title,
  hint,
  complete,
}: {
  index: number;
  title: string;
  hint?: string;
  complete?: boolean;
}) {
  return (
    <div style={{ display: "flex", alignItems: "baseline", gap: 14, marginBottom: 16 }}>
      <span
        style={{
          fontFamily: "var(--mono)",
          fontSize: 11,
          letterSpacing: "0.16em",
          color: complete ? "var(--accent)" : "var(--muted)",
          fontWeight: 600,
          minWidth: 22,
        }}
      >
        {String(index).padStart(2, "0")}
      </span>
      <h2
        style={{
          fontFamily: "var(--serif)",
          fontSize: 26,
          fontWeight: 600,
          margin: 0,
          color: "var(--ink)",
          letterSpacing: "-0.01em",
          lineHeight: 1.1,
        }}
      >
        {title}
      </h2>
      {hint ? (
        <span
          style={{
            fontFamily: "var(--sans)",
            fontSize: 13,
            color: "var(--muted)",
            fontStyle: "italic",
          }}
        >
          — {hint}
        </span>
      ) : null}
    </div>
  );
}

function ComposeHeader({
  broker,
  onEditBroker,
}: {
  broker: Broker;
  onEditBroker: () => void;
}) {
  return (
    <header
      style={{
        borderBottom: "1px solid var(--line-soft)",
        background: "rgba(220, 230, 240, 0.85)",
        backdropFilter: "blur(10px)",
        position: "sticky",
        top: 0,
        zIndex: 10,
      }}
    >
      <div
        style={{
          maxWidth: 1180,
          margin: "0 auto",
          padding: "16px 32px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: 8,
              background: "var(--ink)",
              color: "#E6EEF6",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Icon name="logo" size={18} stroke={2} />
          </div>
          <div>
            <div
              style={{
                fontFamily: "var(--serif)",
                fontSize: 19,
                fontWeight: 600,
                lineHeight: 1,
                letterSpacing: "-0.01em",
              }}
            >
              BrokerPosts
            </div>
            <div
              style={{
                fontFamily: "var(--mono)",
                fontSize: 9,
                letterSpacing: "0.24em",
                color: "var(--muted)",
                marginTop: 2,
                textTransform: "uppercase",
              }}
            >
              Atelier de publications
            </div>
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <button
            type="button"
            onClick={onEditBroker}
            style={{
              background: "#fff",
              border: "1px solid var(--line-soft)",
              borderRadius: 999,
              padding: "6px 14px 6px 6px",
              display: "flex",
              alignItems: "center",
              gap: 10,
              cursor: "pointer",
              fontFamily: "var(--sans)",
              fontSize: 13,
              color: "var(--ink)",
            }}
          >
            <div
              style={{
                width: 28,
                height: 28,
                borderRadius: "50%",
                overflow: "hidden",
                background: "#C9D6E5",
                flexShrink: 0,
              }}
            >
              {broker?.photo ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={broker.photo}
                  alt=""
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    transform: `translate(${(broker.photoCrop?.x || 0) * 100}%, ${(broker.photoCrop?.y || 0) * 100}%) scale(${broker.photoCrop?.zoom || 1})`,
                    transformOrigin: "center center",
                  }}
                />
              ) : (
                <div
                  style={{
                    width: "100%",
                    height: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "var(--muted)",
                  }}
                >
                  <Icon name="user" size={14} />
                </div>
              )}
            </div>
            <span style={{ fontWeight: 500 }}>{broker?.name || "Profil"}</span>
            <Icon name="edit" size={13} stroke={1.8} style={{ opacity: 0.5 }} />
          </button>
          <button
            type="button"
            onClick={() => signOut()}
            title="Se déconnecter"
            style={{
              background: "transparent",
              border: "1px solid var(--line-soft)",
              borderRadius: 999,
              padding: "8px 14px",
              cursor: "pointer",
              fontFamily: "var(--sans)",
              fontSize: 13,
              color: "var(--muted)",
            }}
          >
            Déconnexion
          </button>
        </div>
      </div>
    </header>
  );
}

export function ComposeScreen({
  broker,
  onEditBroker,
}: {
  broker: Broker;
  onEditBroker: () => void;
}) {
  const [photos, setPhotos] = useState<string[]>([]);
  const [kind, setKind] = useState<Kind>("vendu");
  const [selected, setSelected] = useState<string | null>(null);
  const [focused, setFocused] = useState<string | null>(null);

  const count = photos.length;
  const canShowTemplates = count >= PHOTO_MIN;

  useEffect(() => {
    if (!canShowTemplates) setSelected(null);
  }, [canShowTemplates]);

  const focusStyle = (focused ? focused.split("-")[0] : null) as StyleId | null;
  const focusLayout = (focused ? focused.split("-")[1] : null) as LayoutId | null;

  return (
    <div style={{ minHeight: "100vh", paddingBottom: 64 }}>
      <ComposeHeader broker={broker} onEditBroker={onEditBroker} />

      <div style={{ maxWidth: 1180, margin: "0 auto", padding: "36px 32px 0" }}>
        <div style={{ marginBottom: 36 }}>
          <div
            style={{
              fontFamily: "var(--mono)",
              fontSize: 11,
              letterSpacing: "0.32em",
              color: "var(--accent)",
              fontWeight: 600,
              textTransform: "uppercase",
              marginBottom: 12,
            }}
          >
            Nouvelle publication
          </div>
          <h1
            style={{
              fontFamily: "var(--serif)",
              fontSize: 52,
              fontWeight: 600,
              margin: 0,
              color: "var(--ink)",
              letterSpacing: "-0.02em",
              lineHeight: 1.05,
              maxWidth: 760,
            }}
          >
            Créez une publication{" "}
            <em style={{ color: "var(--accent)" }}>prête à publier.</em>
          </h1>
        </div>

        <section style={{ marginBottom: 44 }}>
          <SectionLabel
            index={1}
            title="Ajoutez 3 à 5 photos"
            hint="640 × 480 idéal · glissez pour réordonner"
            complete={canShowTemplates}
          />
          <PhotoStrip photos={photos} setPhotos={setPhotos} max={PHOTO_MAX} />
        </section>

        <section style={{ marginBottom: 44 }}>
          <SectionLabel
            index={2}
            title="Vendu ou Acheté ?"
            hint="Détermine le ton de la publication"
            complete={!!kind}
          />
          <KindSelector kind={kind} setKind={setKind} />
        </section>

        <section>
          <SectionLabel
            index={3}
            title="Choisissez un modèle"
            hint={
              canShowTemplates
                ? "3 styles × 3 dispositions — survolez pour explorer"
                : `Ajoutez au moins ${PHOTO_MIN} photos pour voir les modèles`
            }
            complete={!!selected}
          />
          {canShowTemplates ? (
            <TemplateGallery
              photos={photos}
              count={count}
              broker={broker}
              kind={kind}
              selected={selected}
              setSelected={(id) => {
                setSelected(id);
                setFocused(id);
              }}
            />
          ) : (
            <div
              style={{
                background: "#fff",
                border: "1px dashed var(--line)",
                borderRadius: 12,
                padding: "60px 24px",
                textAlign: "center",
                color: "var(--muted)",
                fontFamily: "var(--serif)",
                fontStyle: "italic",
                fontSize: 18,
              }}
            >
              Les 9 modèles apparaîtront ici dès que vous aurez ajouté vos photos.
            </div>
          )}
        </section>
      </div>

      {focused && focusStyle && focusLayout ? (
        <FocusPanel
          styleId={focusStyle}
          layoutId={focusLayout}
          photos={photos}
          count={count}
          broker={broker}
          kind={kind}
          onClose={() => setFocused(null)}
        />
      ) : null}
    </div>
  );
}
