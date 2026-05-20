// Circular loading spinner. `size` sets diameter (px); inherits `currentColor`.
export function Spinner({ size = 16 }: { size?: number }) {
  return (
    <span
      className="bp-spinner"
      style={{ fontSize: size }}
      role="status"
      aria-label="Chargement"
    />
  );
}
