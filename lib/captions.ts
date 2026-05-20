// French caption generator. Returns { headline, body, hashtags, full }.
// `kind` is "vendu" | "achete". Tone alternates per template style.

import type { Broker, Kind, StyleId } from "@/types";

interface CaptionEntry {
  h: string;
  b: string;
}

const CAPTION_BANK: Record<Kind, Record<"warm" | "celebratory", CaptionEntry[]>> = {
  vendu: {
    warm: [
      {
        h: "VENDU.",
        b: "Un immense merci à mes clients pour leur confiance tout au long de cette aventure. Une nouvelle page se tourne. Bonne route vers le prochain chapitre. ✨",
      },
      {
        h: "Mission accomplie.",
        b: "Merci du fond du cœur à mes clients pour leur confiance. Accompagner la vente de votre demeure a été un véritable privilège.",
      },
      {
        h: "Une vente, mille mercis.",
        b: "Merci à mes clients pour la confiance accordée. C'est avec beaucoup de gratitude que je vous accompagne dans cette belle transition.",
      },
    ],
    celebratory: [
      {
        h: "VENDU EN UN CLIN D'ŒIL !",
        b: "Félicitations à mes clients pour cette superbe transaction ! Encore une porte qui se ferme avec le sourire. 🎉🔑",
      },
      {
        h: "Encore un VENDU !",
        b: "Bravo à mes clients, votre propriété a trouvé ses nouveaux propriétaires. À vous le prochain rêve qui commence ! ✨",
      },
      {
        h: "Vendue. Et avec quel plaisir.",
        b: "Félicitations à mes clients pour cette belle vente. Merci de m'avoir fait confiance à chaque étape. C'est ce qui rend ce métier si beau. 🏡",
      },
    ],
  },
  achete: {
    warm: [
      {
        h: "ACHETÉ.",
        b: "Merci à mes clients pour leur confiance dans la recherche de leur nouveau chez-soi. Bienvenue à la maison. Que cette demeure vous apporte bonheur et souvenirs. 🏡",
      },
      {
        h: "Bienvenue à la maison.",
        b: "Quel bonheur de vous avoir accompagnés vers cette nouvelle adresse. Merci pour votre confiance, il ne vous reste plus qu'à profiter.",
      },
      {
        h: "Les clés sont à vous.",
        b: "Merci à mes clients pour la confiance accordée. C'est avec une immense fierté que je vous remets les clés de votre nouvelle maison.",
      },
    ],
    celebratory: [
      {
        h: "ACHETÉ ! 🎉",
        b: "Félicitations à mes clients pour l'achat de leur nouvelle propriété ! Que de beaux moments vous attendent entre ces murs. 🔑✨",
      },
      {
        h: "Un nouveau chez-soi !",
        b: "Bravo à mes clients, c'est officiel : vous êtes propriétaires ! Merci pour votre confiance, et bienvenue dans cette nouvelle aventure.",
      },
      {
        h: "Achetée. Adorée. À vous.",
        b: "Félicitations à mes nouveaux propriétaires ! Merci de m'avoir fait confiance dans cette grande étape. À votre santé et à votre nouvelle maison ! 🥂🏡",
      },
    ],
  },
};

const HASHTAG_SETS: Record<Kind, string[]> = {
  vendu: [
    "#vendu #immobilier #courtierimmobilier #merci #nouvellepage #immobilierqc #realestate",
    "#vendu #maisonvendue #courtierimmobilier #immobilierquebec #missionaccomplie #merci",
    "#vendu #immobilier #realestatequebec #courtier #merciclients #propriete",
  ],
  achete: [
    "#acheté #nouveauchezsoi #immobilier #courtierimmobilier #lesclésenmain #immobilierqc",
    "#acheté #nouvelleadresse #propriétaires #courtierimmobilier #immobilierquebec #félicitations",
    "#acheté #nouvellemaison #immobilier #realestate #courtier #merciclients",
  ],
};

export interface Caption {
  headline: string;
  body: string;
  hashtags: string;
  full: string;
}

// Pick a caption for a given (kind, styleId). styleId maps to a tone.
export function generateCaption({
  kind,
  styleId,
  broker,
}: {
  kind: Kind;
  styleId: StyleId;
  broker: Broker | null;
}): Caption {
  const tone = styleId === "modern" ? "celebratory" : "warm";
  const pool = CAPTION_BANK[kind][tone];
  // deterministic per style so it doesn't churn on re-render
  const pick = pool[0];
  const hashIdx = styleId === "classic" ? 0 : styleId === "modern" ? 1 : 2;
  const hashtags = HASHTAG_SETS[kind][hashIdx];

  const sig: string[] = [];
  if (broker?.name) sig.push(broker.name);
  if (broker?.agency) sig.push(broker.agency);
  const contact: string[] = [];
  if (broker?.phone) contact.push(`📞 ${broker.phone}`);
  if (broker?.email) contact.push(`✉️ ${broker.email}`);

  const full = [
    pick.h,
    "",
    pick.b,
    "",
    sig.join(" · "),
    ...contact, // phone and email each on their own line
    "",
    hashtags,
  ].join("\n");

  return { headline: pick.h, body: pick.b, hashtags, full };
}
