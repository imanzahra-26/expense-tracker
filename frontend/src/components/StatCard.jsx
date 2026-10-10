// ============================================
// STAT CARD — Reusable card for a single stat
// ============================================

// Props:
//   - label: small text above the number (e.g. "Total Income")
//   - value: the big number to show
//   - color: theme color for the icon/accent ("green" | "red" | "indigo")
//   - icon:  emoji or small symbol

export default function StatCard({ label, value, color, icon }) {

  // Format number as currency-like string
  const formatted = Number(value).toLocaleString('en-US', {
    minimumFractionDigits: 2,     // Always show 2 decimals
    maximumFractionDigits: 2,     // Max 2 decimals
  });

  return (
    // Card container — the color class sets accent via CSS
    <div className={`stat-card stat-${color}`}>

      {/* Top row: label + icon */}
      <div className="stat-top">

        {/* Small label (e.g. "Total Income") */}
        <span className="stat-label">{label}</span>

        {/* Icon (emoji) */}
        <span className="stat-icon">{icon}</span>
      </div>

      {/* Big value (e.g. "3,600.00") */}
      <div className="stat-value">Rs. {formatted}</div>
    </div>
  );
}