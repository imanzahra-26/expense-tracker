// ============================================
// CATEGORY CHART — Pie chart of expense categories
// ============================================

// Import recharts pieces
import {
  PieChart,      // Root container
  Pie,           // The pie shape
  Cell,          // Individual slice
  Tooltip,       // Hover popup
  Legend,        // Color legend
  ResponsiveContainer, // Auto-resize to parent
} from 'recharts';

// Pastel palette for slices (reused cyclically)
const COLORS = [
  '#6366f1',    // Indigo
  '#ec4899',    // Pink
  '#06b6d4',    // Cyan
  '#f59e0b',    // Amber
  '#10b981',    // Emerald
  '#8b5cf6',    // Violet
  '#ef4444',    // Red
  '#14b8a6',    // Teal
];

// Props:
//   - data: array of { category, total } from /reports/categories
export default function CategoryChart({ data }) {

  // Empty state — user has no expenses yet
  if (!data || data.length === 0) {
    return (
      <div className="chart-card">
        <h3>Spending by Category</h3>
        <p className="empty">No expenses yet. Add one to see the chart! 📊</p>
      </div>
    );
  }

  return (
    <div className="chart-card">
      {/* Card title */}
      <h3>Spending by Category</h3>

      {/* ResponsiveContainer makes the chart fill the card width */}
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>

          {/* The pie itself */}
          <Pie
            data={data}                  // Array of { category, total }
            dataKey="total"              // Which field to use for slice size
            nameKey="category"           // Which field to use for slice name
            cx="50%"                     // Center X (50% = middle)
            cy="50%"                     // Center Y
            outerRadius={100}            // Size of pie
            label={(entry) => entry.category} // Show category name on slice
          >
            {/* One Cell per slice, colored from the palette */}
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}                          // React key
                fill={COLORS[index % COLORS.length]}           // Cycle colors
              />
            ))}
          </Pie>

          {/* Hover tooltip showing values */}
          <Tooltip
            formatter={(value) => `Rs. ${Number(value).toFixed(2)}`}
          />

          {/* Color legend at the bottom */}
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}