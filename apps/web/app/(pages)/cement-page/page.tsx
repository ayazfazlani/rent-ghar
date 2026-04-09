"use client";

import { useState, useMemo } from "react";
import Head from "next/head";
import CementCard, { CementBrand } from "@/components/Cementcard";

// ── Sample data — replace with your NestJS API call ──────────────────────────
const ALL_BRANDS: CementBrand[] = [
  { id: 1, brand: "Lucky Cement",       slug: "lucky-cement",       title: "Lucky Cement — 50 Kg Bag",       price: 1300, change: +20, city: "Lahore",      weightKg: 50, category: "OPC Cement" },
  { id: 2, brand: "Bestway Cement",     slug: "bestway-cement",     title: "Bestway Cement — 50 Kg Bag",     price: 1280, change:   0, city: "Karachi",     weightKg: 50, category: "OPC Cement" },
  { id: 3, brand: "Maple Leaf Cement",  slug: "maple-leaf-cement",  title: "Maple Leaf Cement — 50 Kg Bag",  price: 1260, change: -10, city: "Islamabad",   weightKg: 50, category: "OPC Cement" },
  { id: 4, brand: "DG Khan Cement",     slug: "dg-khan-cement",     title: "DG Khan Cement — 50 Kg Bag",     price: 1290, change: +10, city: "Lahore",      weightKg: 50, category: "SRC Cement" },
  { id: 5, brand: "Fauji Cement",       slug: "fauji-cement",       title: "Fauji Cement — 50 Kg Bag",       price: 1270, change:   0, city: "Rawalpindi",  weightKg: 50, category: "OPC Cement" },
  { id: 6, brand: "Cherat Cement",      slug: "cherat-cement",      title: "Cherat Cement — 50 Kg Bag",      price: 1250, change: -20, city: "Peshawar",    weightKg: 50, category: "OPC Cement" },
  { id: 7, brand: "Power Cement",       slug: "power-cement",       title: "Power Cement — 50 Kg Bag",       price: 1240, change: +15, city: "Karachi",     weightKg: 50, category: "SRC Cement" },
  { id: 8, brand: "Askari Cement",      slug: "askari-cement",      title: "Askari Cement — 50 Kg Bag",      price: 1310, change: +30, city: "Lahore",      weightKg: 50, category: "OPC Cement" },
  { id: 9, brand: "Pioneer Cement",     slug: "pioneer-cement",     title: "Pioneer Cement — 50 Kg Bag",     price: 1230, change:  -5, city: "Multan",      weightKg: 50, category: "SRC Cement" },
  { id: 10, brand: "Gharibwal Cement",  slug: "gharibwal-cement",   title: "Gharibwal Cement — 50 Kg Bag",   price: 1220, change:   0, city: "Lahore",      weightKg: 50, category: "OPC Cement" },
];

const CITIES   = ["All Cities", "Lahore", "Karachi", "Islamabad", "Rawalpindi", "Peshawar", "Multan"];
const BRANDS   = ["All Brands", ...Array.from(new Set(ALL_BRANDS.map((b) => b.brand)))];
const CATEGORIES = ["All Types", ...Array.from(new Set(ALL_BRANDS.map((b) => b.category)))];
const MIN_PRICE = Math.min(...ALL_BRANDS.map((b) => b.price));
const MAX_PRICE = Math.max(...ALL_BRANDS.map((b) => b.price));

type ViewMode = "grid" | "list";
type SortKey  = "latest" | "price-asc" | "price-desc" | "name";

export default function TodayCementRatePage() {
  // Filters
  const [priceRange, setPriceRange] = useState<[number, number]>([MIN_PRICE, MAX_PRICE]);
  const [selectedCity, setSelectedCity]     = useState("All Cities");
  const [selectedBrand, setSelectedBrand]   = useState("All Brands");
  const [selectedCat, setSelectedCat]       = useState("All Types");
  const [sidebarOpen, setSidebarOpen]       = useState(false);

  // Grid controls
  const [viewMode, setViewMode]   = useState<ViewMode>("grid");
  const [sortBy, setSortBy]       = useState<SortKey>("latest");
  const [perPage, setPerPage]     = useState(16);

  const results = useMemo(() => {
    return ALL_BRANDS
      .filter((b) => b.price >= priceRange[0] && b.price <= priceRange[1])
      .filter((b) => selectedCity  === "All Cities"  || b.city     === selectedCity)
      .filter((b) => selectedBrand === "All Brands"  || b.brand    === selectedBrand)
      .filter((b) => selectedCat   === "All Types"   || b.category === selectedCat)
      .sort((a, b) => {
        if (sortBy === "price-asc")  return a.price - b.price;
        if (sortBy === "price-desc") return b.price - a.price;
        if (sortBy === "name")       return a.brand.localeCompare(b.brand);
        return a.id - b.id;
      })
      .slice(0, perPage);
  }, [priceRange, selectedCity, selectedBrand, selectedCat, sortBy, perPage]);

  const resetFilters = () => {
    setPriceRange([MIN_PRICE, MAX_PRICE]);
    setSelectedCity("All Cities");
    setSelectedBrand("All Brands");
    setSelectedCat("All Types");
  };

  return (
    <>
      <Head>
        <title>Today Cement Rate in Pakistan 2026 | PropertyDealer.pk</title>
        <meta name="description" content="Check today's latest cement rate in Pakistan. Updated daily prices of Lucky, Bestway, Maple Leaf, DG Khan and all major cement brands per 50 Kg bag." />
        <meta name="keywords" content="cement rate in Pakistan, today cement price, lucky cement rate, bestway cement price, maple leaf cement rate" />
      </Head>

      <div className="outer">
        {/* Mobile filter overlay */}
        {sidebarOpen && <div className="overlay" onClick={() => setSidebarOpen(false)} />}

        {/* ── Breadcrumb ────────────────────────────────────────────────── */}
        <nav className="breadcrumb">
          <a href="/">Home</a><span>›</span>
          <a href="/pages">Pages</a><span>›</span>
          <span className="bc-active">Today Cement Rate in Pakistan</span>
        </nav>

        <div className="layout">
          {/* ── LEFT SIDEBAR ────────────────────────────────────────────── */}
          <aside className={`sidebar ${sidebarOpen ? "sidebar-open" : ""}`}>
            <div className="sidebar-header">
              <h3>Filters</h3>
              <button className="close-sb" onClick={() => setSidebarOpen(false)}>✕</button>
            </div>

            {/* Price range */}
            <div className="filter-section">
              <h4>Filter by price</h4>
              <div className="range-wrap">
                <input
                  type="range"
                  min={MIN_PRICE}
                  max={MAX_PRICE}
                  value={priceRange[0]}
                  step={10}
                  onChange={(e) => setPriceRange([+e.target.value, priceRange[1]])}
                  className="range-slider"
                />
                <input
                  type="range"
                  min={MIN_PRICE}
                  max={MAX_PRICE}
                  value={priceRange[1]}
                  step={10}
                  onChange={(e) => setPriceRange([priceRange[0], +e.target.value])}
                  className="range-slider"
                />
              </div>
              <p className="price-label">
                Price: Rs {priceRange[0].toLocaleString()} — Rs {priceRange[1].toLocaleString()}
              </p>
              <button className="filter-apply-btn" onClick={resetFilters}>Reset</button>
            </div>

            {/* City */}
            <div className="filter-section">
              <h4>City</h4>
              {CITIES.map((c) => (
                <label key={c} className="radio-label">
                  <input
                    type="radio"
                    name="city"
                    checked={selectedCity === c}
                    onChange={() => setSelectedCity(c)}
                  />
                  {c}
                </label>
              ))}
            </div>

            {/* Brands */}
            <div className="filter-section">
              <h4>Brands</h4>
              {BRANDS.map((b) => (
                <label key={b} className="radio-label">
                  <input
                    type="radio"
                    name="brand"
                    checked={selectedBrand === b}
                    onChange={() => setSelectedBrand(b)}
                  />
                  {b}
                  {b !== "All Brands" && (
                    <span className="count-badge">
                      ({ALL_BRANDS.filter((x) => x.brand === b).length})
                    </span>
                  )}
                </label>
              ))}
            </div>

            {/* Category */}
            <div className="filter-section">
              <h4>Cement Type</h4>
              {CATEGORIES.map((cat) => (
                <label key={cat} className="radio-label">
                  <input
                    type="radio"
                    name="category"
                    checked={selectedCat === cat}
                    onChange={() => setSelectedCat(cat)}
                  />
                  {cat}
                </label>
              ))}
            </div>
          </aside>

          {/* ── MAIN CONTENT ─────────────────────────────────────────────── */}
          <main className="main-content">
            <h1 className="page-title">Today Cement Rate in Pakistan</h1>

            {/* Toolbar */}
            <div className="toolbar">
              <div className="toolbar-left">
                {/* Mobile filter toggle */}
                <button className="mobile-filter-btn" onClick={() => setSidebarOpen(true)}>
                  ☰ Filters
                </button>

                {/* View toggle */}
                <div className="view-btns">
                  {(["grid", "list"] as ViewMode[]).map((v) => (
                    <button
                      key={v}
                      className={`view-btn ${viewMode === v ? "active" : ""}`}
                      onClick={() => setViewMode(v)}
                      title={v}
                    >
                      {v === "grid" ? (
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                          <rect x="1" y="1" width="6" height="6" rx="1"/><rect x="9" y="1" width="6" height="6" rx="1"/>
                          <rect x="1" y="9" width="6" height="6" rx="1"/><rect x="9" y="9" width="6" height="6" rx="1"/>
                        </svg>
                      ) : (
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                          <rect x="1" y="2" width="14" height="3" rx="1"/><rect x="1" y="7" width="14" height="3" rx="1"/>
                          <rect x="1" y="12" width="14" height="3" rx="1"/>
                        </svg>
                      )}
                    </button>
                  ))}
                </div>

                <span className="result-count">Showing {results.length} of {ALL_BRANDS.length} results</span>
              </div>

              <div className="toolbar-right">
                <select value={sortBy} onChange={(e) => setSortBy(e.target.value as SortKey)} className="sel">
                  <option value="latest">Sort by latest</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                  <option value="name">Brand: A–Z</option>
                </select>
                <select value={perPage} onChange={(e) => setPerPage(+e.target.value)} className="sel">
                  <option value={8}>Show 8</option>
                  <option value={16}>Show 16</option>
                  <option value={ALL_BRANDS.length}>Show All</option>
                </select>
              </div>
            </div>

            {/* Cards */}
            {results.length === 0 ? (
              <div className="empty-state">
                <p>No results match your filters.</p>
                <button onClick={resetFilters} className="filter-apply-btn">Reset Filters</button>
              </div>
            ) : viewMode === "grid" ? (
              <div className="cement-grid">
                {results.map((item) => (
                  <CementCard key={item.id} item={item} viewMode="grid" />
                ))}
              </div>
            ) : (
              <div className="cement-list">
                {results.map((item) => (
                  <CementCard key={item.id} item={item} viewMode="list" />
                ))}
              </div>
            )}

            {/* SEO block */}
            <div className="seo-block">
              <h2>Today Cement Rate in Pakistan — April 2026</h2>
              <p>
                PropertyDealer.pk provides daily updated cement prices across all major brands including
                Lucky Cement, Bestway Cement, Maple Leaf, DG Khan, Fauji, and more. Prices are
                updated every morning to reflect the latest market rates from Lahore, Karachi,
                Islamabad, Rawalpindi, Peshawar, and other cities across Pakistan.
              </p>
              <h3>Why Do Cement Prices Change?</h3>
              <p>
                Cement prices in Pakistan fluctuate due to coal prices, fuel costs, government taxes (FED),
                and seasonal demand. The construction season from February to June typically sees higher
                demand which pushes prices up.
              </p>
            </div>
          </main>
        </div>

        {/* ── Global styles ──────────────────────────────────────────────── */}
        <style jsx global>{`
          * { box-sizing: border-box; margin: 0; padding: 0; }
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background: #fafafa; color: #1a1a1a; }
        `}</style>

        <style jsx>{`
          .outer { max-width: 1200px; margin: 0 auto; padding: 1.2rem 1rem 3rem; }
          .breadcrumb { display: flex; gap: 6px; align-items: center; font-size: 13px; color: #999; margin-bottom: 1.2rem; flex-wrap: wrap; }
          .breadcrumb a { color: #999; text-decoration: none; }
          .breadcrumb a:hover { color: #1D9E75; text-decoration: underline; }
          .bc-active { color: #444; }

          /* Layout */
          .layout { display: flex; gap: 24px; align-items: flex-start; }
          .overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.4); z-index: 99; }

          /* Sidebar */
          .sidebar {
            width: 240px;
            flex-shrink: 0;
            background: #fff;
            border: 1px solid #e8e8e8;
            border-radius: 10px;
            padding: 1rem;
            position: sticky;
            top: 1rem;
          }
          .sidebar-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; }
          .sidebar-header h3 { font-size: 15px; font-weight: 600; }
          .close-sb { display: none; background: none; border: none; font-size: 18px; cursor: pointer; color: #888; }
          .filter-section { border-top: 1px solid #f0f0f0; padding: 14px 0; }
          .filter-section h4 { font-size: 13px; font-weight: 600; margin-bottom: 10px; color: #222; text-decoration: underline; text-underline-offset: 3px; }
          .range-wrap { display: flex; flex-direction: column; gap: 6px; margin-bottom: 8px; }
          .range-slider { width: 100%; accent-color: #1D6FA5; }
          .price-label { font-size: 12px; color: #555; margin-bottom: 10px; }
          .filter-apply-btn {
            font-size: 12px;
            padding: 6px 18px;
            border-radius: 6px;
            border: 1px solid #ccc;
            background: #fff;
            cursor: pointer;
            color: #333;
          }
          .filter-apply-btn:hover { background: #f5f5f5; }
          .radio-label { display: flex; align-items: center; gap: 7px; font-size: 13px; color: #444; margin-bottom: 7px; cursor: pointer; }
          .radio-label input { accent-color: #1D6FA5; }
          .count-badge { font-size: 11px; color: #999; margin-left: 3px; }

          /* Main */
          .main-content { flex: 1; min-width: 0; }
          .page-title { font-size: 22px; font-weight: 600; color: #1a1a1a; margin-bottom: 4px; }

          /* Toolbar */
          .toolbar {
            display: flex;
            justify-content: space-between;
            align-items: center;
            background: #f5f5f5;
            border: 1px solid #e8e8e8;
            border-radius: 8px;
            padding: 8px 12px;
            margin: 12px 0 16px;
            flex-wrap: wrap;
            gap: 8px;
          }
          .toolbar-left { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; }
          .toolbar-right { display: flex; align-items: center; gap: 8px; }
          .mobile-filter-btn {
            display: none;
            font-size: 13px;
            padding: 6px 12px;
            border-radius: 6px;
            border: 1px solid #ccc;
            background: #fff;
            cursor: pointer;
          }
          .view-btns { display: flex; gap: 4px; }
          .view-btn {
            width: 32px;
            height: 32px;
            border-radius: 6px;
            border: 1px solid #ddd;
            background: #fff;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            color: #777;
          }
          .view-btn.active { background: #1D6FA5; border-color: #1D6FA5; color: #fff; }
          .result-count { font-size: 13px; color: #888; }
          .sel {
            font-size: 13px;
            padding: 6px 10px;
            border-radius: 6px;
            border: 1px solid #ddd;
            background: #fff;
            color: #333;
            cursor: pointer;
          }

          /* Grid / List */
          .cement-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(190px, 1fr));
            gap: 16px;
          }
          .cement-list { display: flex; flex-direction: column; gap: 12px; }
          .empty-state { text-align: center; padding: 3rem; color: #888; }
          .empty-state p { margin-bottom: 12px; }

          /* SEO */
          .seo-block { margin-top: 3rem; padding-top: 2rem; border-top: 1px solid #eee; }
          .seo-block h2 { font-size: 18px; font-weight: 600; margin-bottom: 10px; }
          .seo-block h3 { font-size: 15px; font-weight: 600; margin: 16px 0 8px; }
          .seo-block p { font-size: 14px; color: #555; line-height: 1.7; }

          /* Responsive */
          @media (max-width: 768px) {
            .sidebar {
              position: fixed;
              top: 0; left: -260px;
              height: 100vh;
              overflow-y: auto;
              z-index: 100;
              width: 260px;
              border-radius: 0;
              transition: left 0.25s ease;
            }
            .sidebar.sidebar-open { left: 0; }
            .close-sb { display: block; }
            .mobile-filter-btn { display: block; }
            .cement-grid { grid-template-columns: repeat(2, 1fr); }
          }
          @media (max-width: 480px) {
            .cement-grid { grid-template-columns: 1fr 1fr; gap: 10px; }
          }
        `}</style>
      </div>
    </>
  );
}