"use client";

import { useRef } from "react";
import type { PhotoCrop } from "@/types";
import { Icon } from "@/components/Icon";
import { fileToDataURL } from "@/lib/images";

const clamp = (n: number, min: number, max: number) =>
  Math.max(min, Math.min(max, n));

// ------------------------------------------------------------
// PhotoCropPicker — upload + draggable circular crop view + zoom slider.
// Stores the picked image as a local data URL (uploaded on save) plus a
// {x,y,zoom} crop descriptor that BrokerAvatar uses to position the image.
// ------------------------------------------------------------
export function PhotoCropPicker({
  photo,
  crop,
  onChangePhoto,
  onChangeCrop,
  size = 180,
}: {
  photo: string | null;
  crop: PhotoCrop;
  onChangePhoto: (v: string | null) => void;
  onChangeCrop: (c: PhotoCrop) => void;
  size?: number;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const dragRef = useRef<{
    startX: number;
    startY: number;
    originX: number;
    originY: number;
  } | null>(null);
  const c = crop || { x: 0, y: 0, zoom: 1 };

  const handleFile = async (file?: File | null) => {
    if (!file) return;
    const url = await fileToDataURL(file);
    onChangePhoto(url);
    onChangeCrop({ x: 0, y: 0, zoom: 1 });
  };

  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!photo) return;
    e.preventDefault();
    e.currentTarget.setPointerCapture?.(e.pointerId);
    dragRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      originX: c.x,
      originY: c.y,
    };
  };
  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!dragRef.current) return;
    const d = dragRef.current;
    const dx = (e.clientX - d.startX) / size;
    const dy = (e.clientY - d.startY) / size;
    const limit = 0.6;
    onChangeCrop({
      x: clamp(d.originX + dx, -limit, limit),
      y: clamp(d.originY + dy, -limit, limit),
      zoom: c.zoom,
    });
  };
  const onPointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    dragRef.current = null;
    e.currentTarget.releasePointerCapture?.(e.pointerId);
  };

  const onWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    if (!photo) return;
    const next = clamp(c.zoom + (e.deltaY < 0 ? 0.08 : -0.08), 0.5, 3);
    onChangeCrop({ ...c, zoom: next });
  };

  const reCenter = () => onChangeCrop({ x: 0, y: 0, zoom: 1 });

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10, alignItems: "center" }}>
      <span
        style={{
          fontFamily: "var(--sans)",
          fontSize: 11,
          fontWeight: 600,
          textTransform: "uppercase",
          letterSpacing: "0.16em",
          color: "var(--ink)",
          opacity: 0.7,
          alignSelf: "flex-start",
        }}
      >
        Votre photo
      </span>

      <div
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        onWheel={onWheel}
        onClick={() => !photo && inputRef.current?.click()}
        style={{
          width: size,
          height: size,
          borderRadius: "50%",
          overflow: "hidden",
          position: "relative",
          background: photo ? "#E6EEF6" : "rgba(14,30,71,0.03)",
          border: photo ? "1px solid var(--line)" : "1.5px dashed var(--line)",
          cursor: photo ? "grab" : "pointer",
          touchAction: "none",
          userSelect: "none",
          flexShrink: 0,
        }}
      >
        {photo ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={photo}
            alt=""
            draggable={false}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "contain",
              transform: `translate(${(c.x || 0) * 100}%, ${(c.y || 0) * 100}%) scale(${c.zoom || 1})`,
              transformOrigin: "center center",
              pointerEvents: "none",
              userSelect: "none",
            }}
          />
        ) : (
          <div
            style={{
              width: "100%",
              height: "100%",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: 6,
              color: "var(--muted)",
              fontFamily: "var(--sans)",
              fontSize: 12,
              textAlign: "center",
              padding: 8,
            }}
          >
            <Icon name="upload" size={22} />
            <span>Glissez ou cliquez</span>
          </div>
        )}

        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          style={{ display: "none" }}
          onChange={(e) => handleFile(e.target.files?.[0])}
        />
      </div>

      {photo ? (
        <div style={{ width: size, display: "flex", flexDirection: "column", gap: 8 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span
              style={{
                fontFamily: "var(--mono)",
                fontSize: 10,
                color: "var(--muted)",
                letterSpacing: "0.1em",
              }}
            >
              ZOOM
            </span>
            <input
              type="range"
              min="0.5"
              max="3"
              step="0.02"
              value={c.zoom}
              onChange={(e) => onChangeCrop({ ...c, zoom: +e.target.value })}
              style={{ flex: 1, accentColor: "var(--accent)" }}
            />
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              fontSize: 11,
              fontFamily: "var(--sans)",
            }}
          >
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              style={{
                background: "transparent",
                border: "none",
                color: "var(--accent)",
                cursor: "pointer",
                padding: 0,
                fontWeight: 600,
              }}
            >
              Changer
            </button>
            <button
              type="button"
              onClick={reCenter}
              style={{
                background: "transparent",
                border: "none",
                color: "var(--muted)",
                cursor: "pointer",
                padding: 0,
              }}
            >
              Recentrer
            </button>
            <button
              type="button"
              onClick={() => {
                onChangePhoto(null);
                onChangeCrop({ x: 0, y: 0, zoom: 1 });
              }}
              style={{
                background: "transparent",
                border: "none",
                color: "var(--muted)",
                cursor: "pointer",
                padding: 0,
              }}
            >
              Retirer
            </button>
          </div>
        </div>
      ) : (
        <span
          style={{
            fontFamily: "var(--sans)",
            fontSize: 11,
            color: "var(--muted)",
            fontStyle: "italic",
            textAlign: "center",
            lineHeight: 1.4,
          }}
        >
          Portrait recommandé
        </span>
      )}
    </div>
  );
}

// Simple logo picker — converts to a data URL preview (uploaded on save).
export function ImagePicker({
  value,
  onChange,
  label,
  hint,
  height = 92,
}: {
  value: string | null;
  onChange: (v: string | null) => void;
  label: string;
  hint?: string;
  height?: number;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const handleFile = async (file?: File | null) => {
    if (!file) return;
    const url = await fileToDataURL(file);
    onChange(url);
  };
  const onDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith("image/")) handleFile(file);
  };
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      <span
        style={{
          fontFamily: "var(--sans)",
          fontSize: 11,
          fontWeight: 600,
          textTransform: "uppercase",
          letterSpacing: "0.16em",
          color: "var(--ink)",
          opacity: 0.7,
        }}
      >
        {label}
      </span>
      <div
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => e.preventDefault()}
        onDrop={onDrop}
        style={{
          height,
          border: value ? "1px solid var(--line)" : "1.5px dashed var(--line)",
          borderRadius: 6,
          background: value ? "#fff" : "rgba(14,30,71,0.03)",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          overflow: "hidden",
          width: "100%",
          transition: "all 0.15s ease",
        }}
      >
        {value ? (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={value}
              alt=""
              style={{
                width: "100%",
                height: "100%",
                objectFit: "contain",
                padding: 12,
              }}
            />
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onChange(null);
              }}
              style={{
                position: "absolute",
                top: 6,
                right: 6,
                width: 24,
                height: 24,
                borderRadius: "50%",
                background: "rgba(0,0,0,0.6)",
                color: "#fff",
                border: "none",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
              aria-label="Retirer l'image"
            >
              <Icon name="x" size={14} stroke={2} />
            </button>
          </>
        ) : (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 6,
              color: "var(--muted)",
              fontFamily: "var(--sans)",
              fontSize: 12,
              textAlign: "center",
              padding: 8,
            }}
          >
            <Icon name="upload" size={22} />
            <span>{hint || "Cliquer ou glisser"}</span>
          </div>
        )}
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          style={{ display: "none" }}
          onChange={(e) => handleFile(e.target.files?.[0])}
        />
      </div>
    </div>
  );
}
