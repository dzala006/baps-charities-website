interface PhotoPlaceholderProps {
  label?: string;
  ratio?: string;
  full?: boolean;
  style?: React.CSSProperties;
}

export default function PhotoPlaceholder({ label, ratio = "4/3", full, style }: PhotoPlaceholderProps) {
  return (
    <div
      style={{
        background: "#c9bdb1",
        aspectRatio: full ? undefined : ratio,
        width: "100%",
        height: full ? "100%" : undefined,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 8,
        ...style,
      }}
    >
      <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="rgba(76,66,56,0.4)" strokeWidth="1.4">
        <rect x="3" y="3" width="18" height="18" rx="2" />
        <circle cx="8.5" cy="8.5" r="1.5" />
        <polyline points="21 15 16 10 5 21" />
      </svg>
      {label && (
        <span style={{ fontSize: 11, color: "rgba(76,66,56,0.5)", fontStyle: "italic", maxWidth: 200, textAlign: "center", lineHeight: 1.4, padding: "0 16px" }}>
          {label}
        </span>
      )}
    </div>
  );
}
