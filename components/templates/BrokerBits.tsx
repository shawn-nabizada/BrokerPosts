import type { Broker, PhotoCrop } from "@/types";
import { Icon } from "@/components/Icon";

// Circular broker headshot with pan/zoom crop transform (object-fit: contain
// so what the cropper shows matches the post exactly).
export function BrokerAvatar({
  src,
  crop,
  size = 88,
  border = "rgba(255,255,255,0.4)",
}: {
  src: string | null | undefined;
  crop: PhotoCrop | null | undefined;
  size?: number;
  border?: string;
}) {
  const c = crop || { x: 0, y: 0, zoom: 1 };
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        overflow: "hidden",
        flexShrink: 0,
        background: "#C9D6E5",
        border: `2px solid ${border}`,
        boxShadow: "0 1px 3px rgba(0,0,0,0.15)",
        position: "relative",
      }}
    >
      {src ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={src}
          alt=""
          crossOrigin="anonymous"
          style={{
            width: "100%",
            height: "100%",
            objectFit: "contain",
            display: "block",
            transform: `translate(${(c.x || 0) * 100}%, ${(c.y || 0) * 100}%) scale(${c.zoom || 1})`,
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
            color: "rgba(0,0,0,0.4)",
          }}
        >
          <Icon name="user" size={size * 0.4} />
        </div>
      )}
    </div>
  );
}

// Big-on-post agency logo, or a quiet text fallback if not provided.
export function PostLogo({
  broker,
  color,
  size = 56,
  align = "left",
}: {
  broker: Broker | null;
  color: string;
  size?: number;
  align?: "left" | "right";
}) {
  if (broker?.logo) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={broker.logo}
        alt=""
        crossOrigin="anonymous"
        style={{
          height: size,
          maxWidth: size * 4,
          width: "auto",
          objectFit: "contain",
          objectPosition: align === "right" ? "right center" : "left center",
          display: "block",
        }}
      />
    );
  }
  return (
    <div
      style={{
        height: size,
        width: size,
        borderRadius: "50%",
        border: `1.5px solid ${color}`,
        opacity: 0.35,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color,
        fontFamily: "var(--mono)",
        fontSize: 10,
        letterSpacing: "0.18em",
        fontWeight: 600,
      }}
      title="Logo de l'agence"
    >
      LOGO
    </div>
  );
}
