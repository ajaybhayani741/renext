const StyledTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div
      style={{
        background: "rgba(255,255,255,0.97)",
        backdropFilter: "blur(12px)",
        borderRadius: 12,
        padding: "12px 16px",
        boxShadow: "0 8px 32px rgba(0,0,0,0.12)",
        border: "1px solid rgba(0,0,0,0.06)",
        minWidth: 120,
      }}
    >
      <p style={{ fontSize: 13, fontWeight: 600, marginBottom: 6, color: "#1e293b" }}>
        {label}
      </p>
      {payload.map((p: any, i: number) => (
        <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 4 }}>
          <div
            style={{
              width: 10,
              height: 10,
              borderRadius: "50%",
              background: typeof p.fill === "string" && p.fill.startsWith("url") ? p.color : p.fill || p.color,
              boxShadow: `0 0 6px ${typeof p.fill === "string" && p.fill.startsWith("url") ? p.color : p.fill || p.color}40`,
            }}
          />
          <span style={{ fontSize: 12, color: "#64748b" }}>{p.name}:</span>
          <span style={{ fontSize: 13, fontWeight: 700, color: "#1e293b" }}>
            {p.value}
            {p.unit || ""}
          </span>
        </div>
      ))}
    </div>
  );
};

export default StyledTooltip;
