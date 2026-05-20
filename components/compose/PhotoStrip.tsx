"use client";

import { useRef, useState } from "react";
import { Icon } from "@/components/Icon";
import { fileToDataURL } from "@/lib/images";

export const PHOTO_MIN = 3;
export const PHOTO_MAX = 5;

export function PhotoStrip({
  photos,
  setPhotos,
  max,
}: {
  photos: string[];
  setPhotos: (p: string[]) => void;
  max: number;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);
  const [dragFromIdx, setDragFromIdx] = useState<number | null>(null);
  const [dragOverIdx, setDragOverIdx] = useState<number | null>(null);

  const handleFiles = async (files: FileList) => {
    const arr = Array.from(files).filter((f) => f.type.startsWith("image/"));
    const slots = max - photos.length;
    const incoming = arr.slice(0, slots);
    const urls = await Promise.all(incoming.map(fileToDataURL));
    setPhotos([...photos, ...urls]);
  };

  const onFileDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files?.length) handleFiles(e.dataTransfer.files);
  };

  const removeAt = (i: number) => {
    const next = photos.slice();
    next.splice(i, 1);
    setPhotos(next);
  };

  const onSlotDrop = (i: number) => (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (dragFromIdx === null || dragFromIdx === i) {
      setDragFromIdx(null);
      setDragOverIdx(null);
      return;
    }
    const next = photos.slice();
    const [moved] = next.splice(dragFromIdx, 1);
    next.splice(i, 0, moved);
    setPhotos(next);
    setDragFromIdx(null);
    setDragOverIdx(null);
  };

  return (
    <div>
      <div
        onDragOver={(e) => {
          e.preventDefault();
          if (dragFromIdx === null) setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={onFileDrop}
        style={{
          background: dragOver ? "rgba(26,74,138,0.08)" : "#fff",
          border: dragOver
            ? "1.5px dashed var(--accent)"
            : "1px solid var(--line-soft)",
          borderRadius: 12,
          padding: 20,
          transition: "all 0.15s ease",
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: `repeat(${max}, 1fr)`,
            gap: 12,
          }}
        >
          {Array.from({ length: max }).map((_, i) => {
            const photo = photos[i];
            const isAddSlot = !photo && i === photos.length;
            const isDropTarget = dragOverIdx === i && dragFromIdx !== null;
            return (
              <div
                key={i}
                draggable={!!photo}
                onDragStart={
                  photo
                    ? (e) => {
                        setDragFromIdx(i);
                        e.dataTransfer.effectAllowed = "move";
                      }
                    : undefined
                }
                onDragOver={
                  photo || isDropTarget
                    ? (e) => {
                        e.preventDefault();
                        if (dragFromIdx !== null) setDragOverIdx(i);
                      }
                    : undefined
                }
                onDrop={onSlotDrop(i)}
                onDragEnd={() => {
                  setDragFromIdx(null);
                  setDragOverIdx(null);
                }}
                onClick={isAddSlot ? () => inputRef.current?.click() : undefined}
                style={{
                  aspectRatio: "4 / 3",
                  borderRadius: 8,
                  overflow: "hidden",
                  position: "relative",
                  background: photo
                    ? "#1a1a1a"
                    : isAddSlot
                      ? "rgba(14,30,71,0.04)"
                      : "transparent",
                  border: photo
                    ? isDropTarget
                      ? "2px solid var(--accent)"
                      : "1px solid var(--line-soft)"
                    : isAddSlot
                      ? "1.5px dashed var(--line)"
                      : "1.5px dashed rgba(14,30,71,0.08)",
                  cursor: photo ? "grab" : isAddSlot ? "pointer" : "default",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  transition: "all 0.15s ease",
                  opacity: dragFromIdx === i ? 0.4 : 1,
                }}
              >
                {photo ? (
                  <>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={photo}
                      alt=""
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        display: "block",
                        pointerEvents: "none",
                      }}
                    />
                    <div
                      style={{
                        position: "absolute",
                        top: 6,
                        left: 6,
                        background: "rgba(0,0,0,0.7)",
                        color: "#fff",
                        fontFamily: "var(--mono)",
                        fontSize: 10,
                        letterSpacing: "0.08em",
                        padding: "3px 7px",
                        borderRadius: 4,
                        fontWeight: 600,
                      }}
                    >
                      {String.fromCharCode(65 + i)}
                    </div>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeAt(i);
                      }}
                      style={{
                        position: "absolute",
                        top: 6,
                        right: 6,
                        width: 22,
                        height: 22,
                        borderRadius: "50%",
                        background: "rgba(0,0,0,0.7)",
                        color: "#fff",
                        border: "none",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        cursor: "pointer",
                      }}
                      aria-label="Retirer la photo"
                    >
                      <Icon name="x" size={12} stroke={2.5} />
                    </button>
                  </>
                ) : isAddSlot ? (
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      gap: 6,
                      color: "var(--muted)",
                      fontFamily: "var(--sans)",
                      fontSize: 12,
                    }}
                  >
                    <Icon name="plus" size={20} stroke={1.8} />
                    <span>Ajouter</span>
                  </div>
                ) : null}
              </div>
            );
          })}
        </div>

        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple
          style={{ display: "none" }}
          onChange={(e) => e.target.files && handleFiles(e.target.files)}
        />

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginTop: 16,
            paddingTop: 14,
            borderTop: "1px solid var(--line-soft)",
          }}
        >
          <span style={{ fontFamily: "var(--sans)", fontSize: 13, color: "var(--muted)" }}>
            {photos.length} / {max} photos
            {photos.length >= 2 ? (
              <span style={{ marginLeft: 12, fontSize: 12, fontStyle: "italic" }}>
                · glissez pour réordonner
              </span>
            ) : null}
          </span>
          <div style={{ display: "flex", gap: 8 }}>
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              disabled={photos.length >= max}
              style={{
                background: "transparent",
                border: "1px solid var(--line)",
                borderRadius: 6,
                padding: "8px 14px",
                fontFamily: "var(--sans)",
                fontSize: 13,
                fontWeight: 500,
                color: photos.length >= max ? "var(--muted)" : "var(--ink)",
                cursor: photos.length >= max ? "not-allowed" : "pointer",
                display: "flex",
                alignItems: "center",
                gap: 8,
              }}
            >
              <Icon name="upload" size={14} stroke={2} />
              Ajouter des photos
            </button>
            {photos.length > 0 ? (
              <button
                type="button"
                onClick={() => setPhotos([])}
                style={{
                  background: "transparent",
                  border: "1px solid var(--line)",
                  borderRadius: 6,
                  padding: "8px 14px",
                  fontFamily: "var(--sans)",
                  fontSize: 13,
                  fontWeight: 500,
                  color: "var(--muted)",
                  cursor: "pointer",
                }}
              >
                Effacer tout
              </button>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
