"use client";

import { useState } from "react";
import type { Broker } from "@/types";
import { EMPTY_BROKER } from "@/types";
import { Icon } from "@/components/Icon";
import { persistImage } from "@/lib/images";
import { Field, TextInput } from "./fields";
import { PhotoCropPicker, ImagePicker } from "./pickers";

export function ProfileModal({
  userId,
  initial,
  onSaved,
  onClose,
  mode = "first",
}: {
  userId: string;
  initial: Broker | null;
  onSaved: (b: Broker) => void;
  onClose?: () => void;
  mode?: "first" | "edit";
}) {
  const [b, setB] = useState<Broker>(initial || EMPTY_BROKER);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const set =
    <K extends keyof Broker>(k: K) =>
    (v: Broker[K]) =>
      setB((prev) => ({ ...prev, [k]: v }));

  const canSave = Boolean(b.name?.trim() && b.email?.trim() && b.phone?.trim());

  const save = async () => {
    if (!canSave || saving) return;
    setSaving(true);
    setError(null);
    try {
      // Upload any freshly-picked images to Blob, keep existing URLs as-is.
      const [photo, logo] = await Promise.all([
        persistImage(userId, "photo", b.photo),
        persistImage(userId, "logo", b.logo),
      ]);
      const next: Broker = { ...b, photo, logo };

      const res = await fetch("/api/profile", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(next),
      });
      if (!res.ok) {
        const data = (await res.json().catch(() => ({}))) as { error?: string };
        throw new Error(data.error || `HTTP ${res.status}`);
      }
      const { profile } = (await res.json()) as { profile: Broker };
      onSaved(profile);
    } catch (e) {
      setError(
        "L'enregistrement a échoué. Vérifiez votre connexion et réessayez.",
      );
      console.error("Profile save failed", e);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(14,30,71,0.55)",
        zIndex: 60,
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "center",
        padding: "48px 20px",
        overflow: "auto",
        backdropFilter: "blur(8px)",
      }}
      onClick={mode === "edit" && onClose ? onClose : undefined}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: 720, width: "100%" }}
      >
        <div style={{ marginBottom: 28, textAlign: "center" }}>
          <div
            style={{
              fontFamily: "var(--sans)",
              fontSize: 11,
              fontWeight: 600,
              textTransform: "uppercase",
              letterSpacing: "0.32em",
              color: "var(--accent)",
              marginBottom: 14,
            }}
          >
            {mode === "first" ? "Bienvenue · Une seule fois" : "Modifier le profil"}
          </div>
          <h1
            style={{
              fontFamily: "var(--serif)",
              fontSize: 44,
              fontWeight: 600,
              letterSpacing: "-0.02em",
              margin: 0,
              color: "#fff",
              lineHeight: 1.05,
              textShadow: "0 2px 20px rgba(0,0,0,0.25)",
            }}
          >
            {mode === "first" ? (
              <>
                Bienvenue.{" "}
                <em style={{ color: "#A9C2DF" }}>Préparons votre profil.</em>
              </>
            ) : (
              <>Votre profil de courtier</>
            )}
          </h1>
        </div>

        <div
          style={{
            background: "#fff",
            borderRadius: 12,
            padding: "36px 40px",
            boxShadow: "0 1px 0 rgba(14,30,71,0.04), 0 24px 60px rgba(14,30,71,0.25)",
            border: "1px solid var(--line-soft)",
          }}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "200px minmax(0, 1fr)",
              gap: 32,
              alignItems: "start",
              marginBottom: 28,
            }}
          >
            <PhotoCropPicker
              photo={b.photo}
              crop={b.photoCrop}
              onChangePhoto={set("photo")}
              onChangeCrop={set("photoCrop")}
              size={180}
            />
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "minmax(0, 1fr)",
                gap: 16,
                minWidth: 0,
              }}
            >
              <Field label="Nom complet">
                <TextInput value={b.name} onChange={set("name")} placeholder="Marie Dubois" />
              </Field>
              <Field
                label="Titre professionnel"
                hint="Apparaît sous votre nom sur chaque publication"
              >
                <TextInput
                  value={b.title}
                  onChange={set("title")}
                  placeholder="Courtier immobilier"
                />
              </Field>
              <Field label="Téléphone">
                <TextInput
                  value={b.phone}
                  onChange={set("phone")}
                  placeholder="514 555-0123"
                  type="tel"
                />
              </Field>
              <Field label="Courriel">
                <TextInput
                  value={b.email}
                  onChange={set("email")}
                  placeholder="marie@agence.qc"
                  type="email"
                />
              </Field>
              <div
                style={{
                  fontFamily: "var(--sans)",
                  fontSize: 12,
                  color: "var(--muted)",
                  fontStyle: "italic",
                  lineHeight: 1.5,
                  padding: "4px 0",
                }}
              >
                Astuce : glissez votre photo pour la cadrer et utilisez le curseur
                (ou la molette) pour zoomer.
              </div>
            </div>
          </div>

          <div style={{ height: 1, background: "var(--line-soft)", margin: "8px 0 28px" }} />

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "minmax(0, 1fr) 200px",
              gap: 28,
              alignItems: "start",
            }}
          >
            <Field
              label="Nom de l'agence / courtage"
              hint="Affiché dans la légende uniquement — les publications utilisent seulement le logo"
            >
              <TextInput
                value={b.agency}
                onChange={set("agency")}
                placeholder="Maison & Cie · Courtage immobilier"
              />
            </Field>
            <ImagePicker
              label="Logo de l'agence"
              value={b.logo}
              onChange={set("logo")}
              hint="PNG transparent idéal"
              height={92}
            />
          </div>

          {error ? (
            <div
              style={{
                marginTop: 20,
                padding: "10px 14px",
                background: "rgba(155,58,47,0.08)",
                border: "1px solid rgba(155,58,47,0.3)",
                borderRadius: 6,
                color: "#9B3A2F",
                fontFamily: "var(--sans)",
                fontSize: 13,
              }}
            >
              {error}
            </div>
          ) : null}

          <div
            style={{
              marginTop: 32,
              display: "flex",
              justifyContent: "flex-end",
              gap: 10,
              alignItems: "center",
            }}
          >
            {mode === "edit" && onClose ? (
              <button
                type="button"
                onClick={onClose}
                style={{
                  background: "transparent",
                  border: "none",
                  color: "var(--muted)",
                  fontFamily: "var(--sans)",
                  fontSize: 14,
                  padding: "12px 16px",
                  cursor: "pointer",
                }}
              >
                Annuler
              </button>
            ) : null}
            <button
              type="button"
              onClick={save}
              disabled={!canSave || saving}
              style={{
                background: canSave ? "var(--ink)" : "rgba(14,30,71,0.2)",
                color: "#E6EEF6",
                border: "none",
                borderRadius: 6,
                padding: "14px 28px",
                fontFamily: "var(--sans)",
                fontSize: 14,
                fontWeight: 600,
                letterSpacing: "0.04em",
                cursor: canSave && !saving ? "pointer" : "not-allowed",
                display: "flex",
                alignItems: "center",
                gap: 10,
                transition: "all 0.15s ease",
                opacity: saving ? 0.7 : 1,
              }}
            >
              {saving
                ? "Enregistrement…"
                : mode === "first"
                  ? "Continuer"
                  : "Enregistrer"}
              {!saving ? <Icon name="arrowRight" size={16} stroke={2} /> : null}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
