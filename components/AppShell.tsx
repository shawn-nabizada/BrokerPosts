"use client";

import { useEffect, useState } from "react";
import type { Broker } from "@/types";
import { ProfileModal } from "@/components/setup/ProfileModal";
import { ComposeScreen } from "@/components/compose/ComposeScreen";

type Status = "loading" | "ready";

/**
 * Authenticated shell. Fetches the broker's profile, forces the setup modal on
 * first run, and otherwise shows the composer. Profile edits reopen the modal.
 */
export function AppShell({ userId }: { userId: string }) {
  const [status, setStatus] = useState<Status>("loading");
  const [broker, setBroker] = useState<Broker | null>(null);
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/profile", { cache: "no-store" });
        const data = (await res.json()) as { profile: Broker | null };
        if (!cancelled) setBroker(data.profile);
      } catch {
        if (!cancelled) setBroker(null);
      } finally {
        if (!cancelled) setStatus("ready");
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  if (status === "loading") {
    return <div className="bp-loading">Préparation de l&apos;atelier…</div>;
  }

  const needsSetup = !broker || !broker.name;

  const onSaved = (b: Broker) => {
    setBroker(b);
    setEditing(false);
  };

  if (needsSetup) {
    return <ProfileModal userId={userId} initial={broker} onSaved={onSaved} mode="first" />;
  }

  return (
    <>
      <ComposeScreen broker={broker} onEditBroker={() => setEditing(true)} />
      {editing ? (
        <ProfileModal
          userId={userId}
          initial={broker}
          onSaved={onSaved}
          onClose={() => setEditing(false)}
          mode="edit"
        />
      ) : null}
    </>
  );
}
