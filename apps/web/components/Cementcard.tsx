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

// Cement bag colors per brand index
const BAG_COLORS = [
  { bg: "#1a6fc4", dark: "#145599", light: "#e8f0fb", text: "#fff" },
  { bg: "#2e7d32", dark: "#1b5e20", light: "#e8f5e9", text: "#fff" },
  { bg: "#b71c1c", dark: "#7f0000", light: "#ffebee", text: "#fff" },
  { bg: "#e65100", dark: "#bf360c", light: "#fff3e0", text: "#fff" },
  { bg: "#4a148c", dark: "#311b92", light: "#f3e5f5", text: "#fff" },
  { bg: "#006064", dark: "#004d40", light: "#e0f7fa", text: "#fff" },
  { bg: "#37474f", dark: "#263238", light: "#eceff1", text: "#fff" },
  { bg: "#558b2f", dark: "#33691e", light: "#f1f8e9", text: "#fff" },
  { bg: "#ad1457", dark: "#880e4f", light: "#fce4ec", text: "#fff" },
  { bg: "#0277bd", dark: "#01579b", light: "#e1f5fe", text: "#fff" },
];

function CementBagSVG({ brand, weightKg, colorIdx }: { brand: string; weightKg: number; colorIdx: number }) {
  const c = BAG_COLORS[colorIdx % BAG_COLORS.length];
  const shortName = brand.replace(" Cement", "").toUpperCase();

  return (
    <svg viewBox="0 0 160 200" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      {/* Bag body */}
      <rect x="20" y="30" width="120" height="150" rx="8" fill={c.bg} />
      {/* Bag top fold */}
      <rect x="20" y="30" width="120" height="28" rx="6" fill={c.dark} />
      {/* Stitching top */}
      <line x1="30" y1="44" x2="130" y2="44" stroke="rgba(255,255,255,0.3)" strokeWidth="1.5" strokeDasharray="6 4" />
      {/* Bag bottom */}
      <rect x="20" y="152" width="120" height="28" rx="6" fill={c.dark} />
      {/* Stitching bottom */}
      <line x1="30" y1="166" x2="130" y2="166" stroke="rgba(255,255,255,0.3)" strokeWidth="1.5" strokeDasharray="6 4" />
      {/* Side lines */}
      <line x1="28" y1="60" x2="28" y2="150" stroke="rgba(255,255,255,0.15)" strokeWidth="3" />
      <line x1="132" y1="60" x2="132" y2="150" stroke="rgba(255,255,255,0.15)" strokeWidth="3" />
      {/* White label area */}
      <rect x="30" y="70" width="100" height="72" rx="5" fill="rgba(255,255,255,0.92)" />
      {/* Brand name */}
      <text
        x="80" y="100"
        textAnchor="middle"
        fontSize={shortName.length > 8 ? "10" : shortName.length > 5 ? "12" : "15"}
        fontWeight="800"
        fill={c.bg}
        fontFamily="Arial, sans-serif"
        letterSpacing="1"
      >
        {shortName}
      </text>
      {/* CEMENT label */}
      <text x="80" y="116" textAnchor="middle" fontSize="9" fontWeight="600" fill={c.dark} fontFamily="Arial, sans-serif" letterSpacing="2">
        CEMENT
      </text>
      {/* Divider */}
      <line x1="42" y1="122" x2="118" y2="122" stroke={c.bg} strokeWidth="1" opacity="0.3" />
      {/* Weight */}
      <text x="80" y="134" textAnchor="middle" fontSize="10" fontWeight="700" fill={c.bg} fontFamily="Arial, sans-serif">
        {weightKg} KG
      </text>
      {/* OPC tag */}
      <rect x="52" y="148" width="56" height="14" rx="3" fill={c.bg} opacity="0.15" />
      <text x="80" y="158" textAnchor="middle" fontSize="7.5" fontWeight="600" fill={c.bg} fontFamily="Arial, sans-serif">
        NET WEIGHT
      </text>
    </svg>
  );
}

export default function CementCard({ item, viewMode = "grid" }: CementCardProps) {
  /* ── LIST VIEW ─────────────────────────────────────────────────── */
  if (viewMode === "list") {
    return (
      <div className="flex items-center gap-4 bg-white border border-gray-200 rounded-lg p-3 hover:shadow-sm transition-shadow">
        <div className="w-16 h-20 flex-shrink-0 flex items-center justify-center">
          {item.image
            ? <img src={item.image} alt={item.title} className="w-full h-full object-contain" />
            : <CementBagSVG brand={item.brand} weightKg={item.weightKg} colorIdx={item.id - 1} />
          }
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-[11px] text-gray-400">{item.category}</p>
          <Link href={`/today-cement-rate-in-pakistan/${item.slug}`}
            className="text-sm font-normal text-[#1a6fc4] hover:underline block leading-snug mt-0.5 truncate">
            {item.title}
          </Link>
        </div>
        <div className="flex items-center gap-3 flex-shrink-0">
          <span className="text-[17px] font-semibold text-gray-800">Rs {item.price.toLocaleString()}</span>
          <button className="w-9 h-9 rounded-full bg-gray-100 hover:bg-[#1a6fc4] hover:text-white text-gray-500 flex items-center justify-center transition-colors duration-150">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" />
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
            </svg>
          </button>
        </div>
      </div>
    );
  }

  /* ── GRID VIEW ─────────────────────────────────────────────────── */
  return (
    <div className="group bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow duration-200">

      {/* Category + Title */}
      <div className="px-3 pt-3 pb-1">
        <p className="text-[11px] text-gray-400 leading-none mb-1">{item.category}</p>
        <Link href={`/today-cement-rate-in-pakistan/${item.slug}`}
          className="text-[13px] font-normal text-[#1a6fc4] hover:underline leading-snug line-clamp-2 block">
          {item.title}
        </Link>
      </div>

      {/* Image */}
      <div className="flex items-center justify-center bg-white px-8 py-3" style={{ minHeight: "190px" }}>
        {item.image ? (
          <img src={item.image} alt={item.title}
            className="w-full object-contain max-h-48 transition-transform duration-300 group-hover:scale-[1.04]" />
        ) : (
          <div className="w-28 h-40 transition-transform duration-300 group-hover:scale-[1.04]">
            <CementBagSVG brand={item.brand} weightKg={item.weightKg} colorIdx={item.id - 1} />
          </div>
        )}
      </div>

      {/* Price + Cart */}
      <div className="flex items-center justify-between px-3 pb-3 pt-1">
        <span className="text-[17px] font-semibold text-gray-800">Rs {item.price.toLocaleString()}</span>
        <button
          className="w-9 h-9 rounded-full bg-gray-100 hover:bg-[#1a6fc4] hover:text-white text-gray-500 flex items-center justify-center transition-colors duration-150"
          title="Check Rate"
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" />
            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
          </svg>
        </button>
      </div>

    </div>
  );
}