import type { Broker, Kind, LayoutId } from "@/types";
import { PhotoGrid } from "./PhotoGrid";
import { BrokerAvatar, PostLogo } from "./BrokerBits";
import { KIND_LABEL } from "./meta";

export interface StyleProps {
  photos: (string | null)[];
  count: number;
  layoutId: LayoutId;
  broker: Broker | null;
  kind: Kind;
}

// =========================================================================
//  STYLE 1 — Classique (serif, pale paper, navy ink stamp)
// =========================================================================

function ClassiqueStamp({
  kind,
  stampColor,
  paperColor,
}: {
  kind: Kind;
  stampColor: string;
  paperColor: string;
}) {
  const text = KIND_LABEL[kind];
  return (
    <div
      style={{
        position: "absolute",
        right: 28,
        bottom: 28,
        width: 160,
        height: 160,
        borderRadius: "50%",
        background: stampColor,
        color: paperColor,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        boxShadow: `0 12px 28px ${stampColor}66, inset 0 0 0 2px ${paperColor}40`,
        transform: "rotate(-8deg)",
        fontFamily: "var(--serif)",
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 14,
          borderRadius: "50%",
          border: `1px dashed ${paperColor}66`,
        }}
      />
      <div
        style={{
          fontSize: 11,
          letterSpacing: "0.4em",
          textTransform: "uppercase",
          opacity: 0.85,
          fontFamily: "var(--sans)",
          fontWeight: 600,
        }}
      >
        {kind === "vendu" ? "Officiellement" : "Avec joie"}
      </div>
      <div
        style={{
          fontSize: 34,
          fontWeight: 700,
          letterSpacing: "0.04em",
          marginTop: 2,
          lineHeight: 1,
        }}
      >
        {text}
      </div>
      <div
        style={{
          marginTop: 6,
          fontSize: 11,
          letterSpacing: "0.32em",
          textTransform: "uppercase",
          opacity: 0.7,
          fontFamily: "var(--sans)",
          fontWeight: 500,
          fontStyle: "italic",
        }}
      >
        avec gratitude
      </div>
    </div>
  );
}

export function ClassiqueTemplate({
  photos,
  count,
  layoutId,
  broker,
  kind,
}: StyleProps) {
  const ink = "#0E1E47";
  const paper = "#E6EEF6";
  const trim = "#1A4A8A";

  return (
    <div
      style={{
        width: 1080,
        height: 1080,
        background: paper,
        color: ink,
        position: "relative",
        fontFamily: "var(--serif)",
        overflow: "hidden",
        padding: 48,
        display: "flex",
        flexDirection: "column",
        gap: 28,
        boxSizing: "border-box",
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 24,
          border: `1px solid ${ink}`,
          opacity: 0.22,
          pointerEvents: "none",
        }}
      />

      <header
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          paddingBottom: 18,
          borderBottom: `1px solid ${ink}33`,
          minHeight: 64,
        }}
      >
        <PostLogo broker={broker} color={ink} size={56} align="left" />
        <div
          style={{
            fontFamily: "var(--serif)",
            fontStyle: "italic",
            fontSize: 22,
            color: ink,
            opacity: 0.7,
          }}
        >
          {broker?.title || "Courtier immobilier"}
        </div>
      </header>

      <div style={{ flex: 1, position: "relative", minHeight: 0 }}>
        <PhotoGrid photos={photos} count={count} layout={layoutId} gap={6} />
        <ClassiqueStamp kind={kind} stampColor={ink} paperColor={paper} />
      </div>

      <div
        style={{
          textAlign: "center",
          fontFamily: "var(--serif)",
          fontStyle: "italic",
          fontSize: 30,
          lineHeight: 1.15,
          color: ink,
          marginTop: 4,
        }}
      >
        Merci à mes clients pour leur confiance.
      </div>

      <footer
        style={{
          display: "flex",
          alignItems: "center",
          gap: 22,
          paddingTop: 18,
          borderTop: `1px solid ${ink}33`,
        }}
      >
        <BrokerAvatar
          src={broker?.photo}
          crop={broker?.photoCrop}
          size={132}
          border={trim}
        />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div
            style={{
              fontFamily: "var(--serif)",
              fontSize: 44,
              fontWeight: 600,
              lineHeight: 1,
              color: ink,
            }}
          >
            {broker?.name || "Prénom Nom"}
          </div>
          <div
            style={{
              marginTop: 8,
              fontFamily: "var(--sans)",
              fontSize: 15,
              textTransform: "uppercase",
              letterSpacing: "0.22em",
              color: ink,
              opacity: 0.65,
            }}
          >
            {broker?.title || "Courtier immobilier"}
          </div>
        </div>
        <div
          style={{
            textAlign: "right",
            fontFamily: "var(--sans)",
            fontSize: 17,
            lineHeight: 1.5,
            color: ink,
          }}
        >
          <div>{broker?.phone || "514 555-0000"}</div>
          <div style={{ opacity: 0.7 }}>{broker?.email || "courtier@maison.qc"}</div>
        </div>
      </footer>
    </div>
  );
}

// =========================================================================
//  STYLE 2 — Moderne (full-width, oversized headline, no sidebar)
// =========================================================================

export function ModerneTemplate({
  photos,
  count,
  layoutId,
  broker,
  kind,
}: StyleProps) {
  const ink = "#0E1E47";
  const paper = "#E6EEF6";
  const accent = "#1A4A8A";
  const text = KIND_LABEL[kind];

  return (
    <div
      style={{
        width: 1080,
        height: 1080,
        background: paper,
        color: ink,
        position: "relative",
        fontFamily: "var(--sans)",
        overflow: "hidden",
        padding: 48,
        boxSizing: "border-box",
        display: "flex",
        flexDirection: "column",
        gap: 18,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          minHeight: 56,
        }}
      >
        <PostLogo broker={broker} color={ink} size={56} align="left" />
        <span
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            color: accent,
            fontWeight: 700,
            fontFamily: "var(--mono)",
            fontSize: 11,
            letterSpacing: "0.28em",
            textTransform: "uppercase",
          }}
        >
          <span
            style={{
              width: 10,
              height: 10,
              background: accent,
              display: "inline-block",
            }}
          />
          {kind === "vendu" ? "Transaction conclue" : "Nouvelle acquisition"}
        </span>
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "flex-end",
          justifyContent: "space-between",
          gap: 18,
          borderBottom: `2px solid ${ink}`,
          paddingBottom: 14,
        }}
      >
        <div
          style={{
            fontFamily: "var(--sans)",
            fontWeight: 900,
            fontSize: 96,
            letterSpacing: "-0.04em",
            color: ink,
            lineHeight: 0.85,
          }}
        >
          {text}.
        </div>
        <div
          style={{
            fontFamily: "var(--serif)",
            fontStyle: "italic",
            fontSize: 22,
            color: ink,
            opacity: 0.7,
            textAlign: "right",
            maxWidth: 320,
            lineHeight: 1.25,
            paddingBottom: 14,
          }}
        >
          {kind === "vendu" ? "Et avec quel plaisir." : "Et quelle aventure."}
        </div>
      </div>

      <div style={{ flex: 1, minHeight: 0 }}>
        <PhotoGrid photos={photos} count={count} layout={layoutId} gap={6} />
      </div>

      <footer
        style={{
          display: "flex",
          alignItems: "center",
          gap: 18,
          paddingTop: 14,
          borderTop: `2px solid ${ink}`,
        }}
      >
        <BrokerAvatar
          src={broker?.photo}
          crop={broker?.photoCrop}
          size={116}
          border={ink}
        />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div
            style={{
              fontFamily: "var(--sans)",
              fontSize: 36,
              fontWeight: 800,
              lineHeight: 1,
              color: ink,
              letterSpacing: "-0.01em",
            }}
          >
            {broker?.name || "PRÉNOM NOM"}
          </div>
          <div
            style={{
              marginTop: 6,
              fontFamily: "var(--mono)",
              fontSize: 13,
              textTransform: "uppercase",
              letterSpacing: "0.18em",
              opacity: 0.6,
            }}
          >
            {broker?.title || "Courtier immobilier"}
          </div>
        </div>
        <div
          style={{
            textAlign: "right",
            fontFamily: "var(--mono)",
            fontSize: 16,
            lineHeight: 1.5,
            color: ink,
          }}
        >
          <div style={{ fontWeight: 600 }}>{broker?.phone || "514·555·0000"}</div>
          <div style={{ opacity: 0.7 }}>{broker?.email || "courtier@agence.qc"}</div>
        </div>
      </footer>
    </div>
  );
}

// =========================================================================
//  STYLE 3 — Éditorial (magazine masthead, display headline anchors bottom)
// =========================================================================

export function EditorialTemplate({
  photos,
  count,
  layoutId,
  broker,
  kind,
}: StyleProps) {
  const ink = "#0E1E47";
  const paper = "#E6EEF6";
  const blockColor = "#0E1E47";
  const accent = "#A9C2DF";
  const displayWord = kind === "vendu" ? "Vendu." : "Acheté.";

  return (
    <div
      style={{
        width: 1080,
        height: 1080,
        background: paper,
        color: ink,
        position: "relative",
        fontFamily: "var(--serif)",
        overflow: "hidden",
        boxSizing: "border-box",
        display: "grid",
        gridTemplateRows: "auto 1fr auto",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "30px 44px 22px",
          color: ink,
          borderBottom: `1px solid ${ink}`,
          margin: "0 44px",
          minHeight: 76,
        }}
      >
        <PostLogo broker={broker} color={ink} size={56} align="left" />
        <span
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            fontFamily: "var(--sans)",
            fontSize: 11,
            letterSpacing: "0.32em",
            textTransform: "uppercase",
            color: ink,
          }}
        >
          <span
            style={{
              width: 8,
              height: 8,
              borderRadius: "50%",
              background: "#1A4A8A",
              display: "inline-block",
            }}
          />
          <span>{broker?.title || "Courtier immobilier"}</span>
        </span>
      </div>

      <div style={{ minHeight: 0, padding: "26px 44px 26px", position: "relative" }}>
        <PhotoGrid photos={photos} count={count} layout={layoutId} gap={4} />
      </div>

      <div
        style={{
          background: blockColor,
          color: paper,
          padding: "40px 44px 38px",
          display: "grid",
          gridTemplateColumns: "1.05fr 1px 0.95fr",
          gap: 28,
          alignItems: "center",
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 0,
            right: 44,
            width: 12,
            height: 56,
            background: accent,
          }}
        />

        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          <div
            style={{
              fontFamily: "var(--sans)",
              fontSize: 10,
              letterSpacing: "0.32em",
              textTransform: "uppercase",
              color: accent,
              fontWeight: 600,
            }}
          >
            {kind === "vendu" ? "Officiellement vendue" : "Officiellement achetée"}
          </div>
          <div
            style={{
              fontFamily: '"DM Serif Display", "Playfair Display", serif',
              fontSize: 96,
              lineHeight: 0.9,
              letterSpacing: "-0.04em",
              color: paper,
              fontWeight: 400,
              marginTop: -4,
            }}
          >
            {displayWord}
          </div>
          <div
            style={{
              fontFamily: "var(--serif)",
              fontStyle: "italic",
              fontSize: 17,
              color: paper,
              opacity: 0.78,
              marginTop: 6,
              maxWidth: 460,
              lineHeight: 1.35,
            }}
          >
            « Merci à mes clients pour leur confiance — félicitations pour ce nouveau chapitre. »
          </div>
        </div>

        <div style={{ width: 1, alignSelf: "stretch", background: `${paper}33` }} />

        <div style={{ display: "flex", alignItems: "center", gap: 18, minWidth: 0 }}>
          <BrokerAvatar
            src={broker?.photo}
            crop={broker?.photoCrop}
            size={124}
            border={accent}
          />
          <div style={{ minWidth: 0, flex: 1 }}>
            <div
              style={{
                fontFamily: "var(--sans)",
                fontSize: 10,
                letterSpacing: "0.28em",
                textTransform: "uppercase",
                color: accent,
                marginBottom: 4,
              }}
            >
              Votre courtier
            </div>
            <div
              style={{
                fontFamily: "var(--serif)",
                fontSize: 38,
                fontWeight: 600,
                lineHeight: 1.05,
                color: paper,
              }}
            >
              {broker?.name || "Prénom Nom"}
            </div>
            <div
              style={{
                marginTop: 8,
                fontFamily: "var(--sans)",
                fontSize: 16,
                lineHeight: 1.55,
                color: paper,
                opacity: 0.9,
              }}
            >
              <div style={{ fontWeight: 600 }}>{broker?.phone || "514 555-0000"}</div>
              <div style={{ opacity: 0.8 }}>{broker?.email || "courtier@maison.qc"}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
