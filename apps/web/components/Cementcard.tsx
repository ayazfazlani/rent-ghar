 "use client";

import Link from "next/link";

export interface CementBrand {
  id: number;
  brand: string;
  slug: string;
  title: string;
  price: number;
  change: number;
  city: string;
  weightKg: number;
  image?: string;
  category: string;
}

interface CementCardProps {
  item: CementBrand;
  viewMode?: "grid" | "list";
}

const BAG_COLORS = [
  { bg: "#1a6fc4", dark: "#145599" },
  { bg: "#2e7d32", dark: "#1b5e20" },
  { bg: "#b71c1c", dark: "#7f0000" },
  { bg: "#e65100", dark: "#bf360c" },
  { bg: "#4a148c", dark: "#311b92" },
  { bg: "#006064", dark: "#004d40" },
  { bg: "#37474f", dark: "#263238" },
  { bg: "#558b2f", dark: "#33691e" },
  { bg: "#ad1457", dark: "#880e4f" },
  { bg: "#0277bd", dark: "#01579b" },
];

function CementBagSVG({ brand, weightKg, colorIdx }: { brand: string; weightKg: number; colorIdx: number }) {
  const c = BAG_COLORS[colorIdx % BAG_COLORS.length];
  const shortName = brand.replace(" Cement", "").toUpperCase();
  const fontSize = shortName.length > 8 ? 10 : shortName.length > 5 ? 12 : 15;

  return (
    <svg viewBox="0 0 160 200" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
      <rect x="20" y="30" width="120" height="150" rx="8" fill={c.bg} />
      <rect x="20" y="30" width="120" height="28" rx="6" fill={c.dark} />
      <line x1="30" y1="44" x2="130" y2="44" stroke="rgba(255,255,255,0.3)" strokeWidth="1.5" strokeDasharray="6 4" />
      <rect x="20" y="152" width="120" height="28" rx="6" fill={c.dark} />
      <line x1="30" y1="166" x2="130" y2="166" stroke="rgba(255,255,255,0.3)" strokeWidth="1.5" strokeDasharray="6 4" />
      <line x1="28" y1="60" x2="28" y2="150" stroke="rgba(255,255,255,0.15)" strokeWidth="3" />
      <line x1="132" y1="60" x2="132" y2="150" stroke="rgba(255,255,255,0.15)" strokeWidth="3" />
      <rect x="30" y="70" width="100" height="72" rx="5" fill="rgba(255,255,255,0.92)" />
      <text x="80" y="100" textAnchor="middle" fontSize={fontSize} fontWeight="800" fill={c.bg} fontFamily="Arial,sans-serif" letterSpacing="1">{shortName}</text>
      <text x="80" y="116" textAnchor="middle" fontSize="9" fontWeight="600" fill={c.dark} fontFamily="Arial,sans-serif" letterSpacing="2">CEMENT</text>
      <line x1="42" y1="122" x2="118" y2="122" stroke={c.bg} strokeWidth="1" opacity="0.3" />
      <text x="80" y="134" textAnchor="middle" fontSize="10" fontWeight="700" fill={c.bg} fontFamily="Arial,sans-serif">{weightKg} KG</text>
    </svg>
  );
}

export default function CementCard({ item, viewMode = "grid" }: CementCardProps) {

  /* ── LIST VIEW ─────────────────────────────────────────────────── */
  if (viewMode === "list") {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "16px",
          background: "#fff",
          border: "1px solid #e5e7eb",
          padding: "14px",
          transition: "box-shadow 0.2s",
        }}
        onMouseEnter={(e) => (e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.08)")}
        onMouseLeave={(e) => (e.currentTarget.style.boxShadow = "none")}
      >
        {/* Image */}
        <div style={{ width: "64px", height: "80px", flexShrink: 0 }}>
          {item.image ? (
            <img src={item.image} alt={item.title} style={{ width: "100%", height: "100%", objectFit: "contain" }} />
          ) : (
            <CementBagSVG brand={item.brand} weightKg={item.weightKg} colorIdx={item.id - 1} />
          )}
        </div>

        {/* Body */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{ fontSize: "11px", color: "#9ca3af", marginBottom: "4px" }}>{item.category}</p>
          <Link
            href={`/today-cement-rate-in-pakistan/${item.slug}`}
            style={{ fontSize: "14px", fontWeight: 500, color: "#1a6fc4", textDecoration: "none", display: "block", lineHeight: "1.4", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}
          >
            {item.title}
          </Link>
        </div>

        {/* Right */}
        <div style={{ display: "flex", alignItems: "center", gap: "12px", flexShrink: 0 }}>
          <span style={{ fontSize: "17px", fontWeight: 600, color: "#1f2937" }}>
            Rs {item.price.toLocaleString()}
          </span>
          <CartButton />
        </div>
      </div>
    );
  }

  /* ── GRID VIEW ─────────────────────────────────────────────────── */
  return (
    <div
      style={{ background: "#fff", border: "1px solid #e5e7eb", overflow: "hidden", transition: "box-shadow 0.2s" }}
      onMouseEnter={(e) => (e.currentTarget.style.boxShadow = "0 4px 16px rgba(0,0,0,0.1)")}
      onMouseLeave={(e) => (e.currentTarget.style.boxShadow = "none")}
    >
      {/* 1. Category + Title */}
      <div style={{ padding: "14px 14px 12px", minHeight: "74px" }}>
        <p style={{ fontSize: "11px", color: "#9ca3af", marginBottom: "5px", lineHeight: 1 }}>
          {item.category}
        </p>
        <Link
          href={`/today-cement-rate-in-pakistan/${item.slug}`}
          style={{
            fontSize: "13px",
            fontWeight: 400,
            color: "#1a6fc4",
            textDecoration: "none",
            lineHeight: "1.45",
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          } as React.CSSProperties}
        >
          {item.title}
        </Link>
      </div>

      {/* 2. Image */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#fff",
          padding: "12px 40px",
          height: "210px",
        }}
      >
        {item.image ? (
          <img src={item.image} alt={item.title} style={{ width: "100%", height: "100%", objectFit: "contain" }} />
        ) : (
          <div style={{ width: "120px", height: "150px" }}>
            <CementBagSVG brand={item.brand} weightKg={item.weightKg} colorIdx={item.id - 1} />
          </div>
        )}
      </div>

      {/* 3. Price + Cart */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "12px 14px",
          borderTop: "1px solid #f3f4f6",
        }}
      >
        <span style={{ fontSize: "18px", fontWeight: 600, color: "#1f2937" }}>
          Rs {item.price.toLocaleString()}
        </span>
        <CartButton />
      </div>
    </div>
  );
}

function CartButton() {
  return (
    <button
      title="Check Rate"
      style={{
        width: "36px",
        height: "36px",
        borderRadius: "50%",
        border: "1px solid #e5e7eb",
        background: "#f3f4f6",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        cursor: "pointer",
        color: "#6b7280",
        transition: "background 0.15s, color 0.15s, border-color 0.15s",
        flexShrink: 0,
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = "#1a6fc4";
        e.currentTarget.style.color = "#fff";
        e.currentTarget.style.borderColor = "#1a6fc4";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = "#f3f4f6";
        e.currentTarget.style.color = "#6b7280";
        e.currentTarget.style.borderColor = "#e5e7eb";
      }}
    >
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="9" cy="21" r="1" />
        <circle cx="20" cy="21" r="1" />
        <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
      </svg>
    </button>
  );
}