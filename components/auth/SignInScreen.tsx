"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { Icon } from "@/components/Icon";
import { Spinner } from "@/components/Spinner";

export function SignInScreen() {
  const [connecting, setConnecting] = useState(false);
  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#DCE6F0",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "48px 24px",
      }}
    >
      <div style={{ maxWidth: 460, width: "100%", textAlign: "center" }}>
        <div
          style={{
            width: 48,
            height: 48,
            borderRadius: 12,
            background: "var(--ink)",
            color: "#E6EEF6",
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: 24,
          }}
        >
          <span
            style={{
              fontFamily: "var(--serif)",
              fontWeight: 700,
              fontSize: 28,
              lineHeight: 1,
            }}
          >
            P
          </span>
        </div>
        <div
          style={{
            fontFamily: "var(--sans)",
            fontSize: 11,
            fontWeight: 600,
            textTransform: "uppercase",
            letterSpacing: "0.32em",
            color: "var(--accent)",
            marginBottom: 16,
          }}
        >
          Publimo · Atelier de publications
        </div>
        <h1
          style={{
            fontFamily: "var(--serif)",
            fontSize: 48,
            fontWeight: 600,
            letterSpacing: "-0.02em",
            margin: 0,
            color: "var(--ink)",
            lineHeight: 1.05,
          }}
        >
          Publications immobilières,{" "}
          <em style={{ color: "var(--accent)" }}>prêtes en un instant.</em>
        </h1>
        <p
          style={{
            fontFamily: "var(--sans)",
            fontSize: 16,
            color: "var(--muted)",
            marginTop: 18,
            marginBottom: 32,
            lineHeight: 1.5,
          }}
        >
          Connectez-vous pour créer vos publications Vendu / Acheté et retrouver
          votre profil sur tous vos appareils.
        </p>
        <button
          type="button"
          disabled={connecting}
          onClick={() => {
            setConnecting(true);
            signIn("google", { callbackUrl: "/" });
          }}
          style={{
            background: "#fff",
            border: "1px solid var(--line)",
            borderRadius: 8,
            padding: "14px 24px",
            fontFamily: "var(--sans)",
            fontSize: 15,
            fontWeight: 600,
            color: "var(--ink)",
            cursor: "pointer",
            display: "inline-flex",
            alignItems: "center",
            gap: 12,
            boxShadow: "0 1px 0 rgba(14,30,71,0.04), 0 8px 24px rgba(14,30,71,0.08)",
            opacity: connecting ? 0.7 : 1,
          }}
        >
          {connecting ? <Spinner size={18} /> : <Icon name="google" size={20} />}
          {connecting ? "Connexion…" : "Continuer avec Google"}
        </button>
      </div>
    </main>
  );
}
