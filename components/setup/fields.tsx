"use client";

import type { ReactNode } from "react";

export function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: ReactNode;
}) {
  return (
    <label style={{ display: "flex", flexDirection: "column", gap: 8, minWidth: 0 }}>
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
      {children}
      {hint ? (
        <span
          style={{
            fontFamily: "var(--sans)",
            fontSize: 12,
            color: "var(--muted)",
            fontStyle: "italic",
          }}
        >
          {hint}
        </span>
      ) : null}
    </label>
  );
}

export function TextInput({
  value,
  onChange,
  placeholder,
  type = "text",
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
}) {
  return (
    <input
      type={type}
      value={value || ""}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      style={{
        width: "100%",
        minWidth: 0,
        boxSizing: "border-box",
        padding: "12px 14px",
        border: "1px solid var(--line)",
        borderRadius: 6,
        background: "#fff",
        fontSize: 15,
        fontFamily: "var(--sans)",
        color: "var(--ink)",
        outline: "none",
      }}
      onFocus={(e) => (e.target.style.borderColor = "var(--ink)")}
      onBlur={(e) => (e.target.style.borderColor = "var(--line)")}
    />
  );
}
