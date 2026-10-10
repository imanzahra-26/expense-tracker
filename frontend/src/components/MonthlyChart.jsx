// ============================================
// MONTHLY CHART — Line chart of income vs expense
// ============================================

// Import recharts pieces
import {
  LineChart,          // Root container
  Line,               // A single line
  XAxis,              // Horizontal axis
  YAxis,              // Vertical axis
  CartesianGrid,      // Background grid
  Tooltip,            // Hover popup
  Legend,             // Color legend
  ResponsiveContainer, // Auto-resize
} from 'recharts';

// Props:
//   - data: array of { month, income, expense } from /reports/monthly
export default function MonthlyChart({ data }) {

  // Empty state — no data yet
  if (!data || data.length === 0) {
    return (
      <div className="chart-card">
        <h3>Income vs Expense (Last 6 Months)</h3>
        <p className="empty">No data yet. Add income/expenses to see trends! 📈</p>
      </div>
    );
  }

  return (
    <div className="chart-card">
      {/* Card title */}
      <h3>Income vs Expense (Last 6 Months)</h3>

      {/* Responsive chart container */}
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>

          {/* Background grid (light lines) */}
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />

          {/* X axis — the month strings (e.g. "2026-10") */}
          <XAxis dataKey="month" fontSize={12} />

          {/* Y axis — auto range based on data */}
          <YAxis fontSize={12} />

          {/* Hover tooltip — shows values per month */}
          <Tooltip
            formatter={(value) => `Rs. ${Number(value).toFixed(2)}`}
          />

          {/* Legend at the bottom */}
          <Legend />

          {/* Income line — green */}
          <Line
            type="monotone"           // Smooth curve
            dataKey="income"          // Reads data[i].income
            stroke="#10b981"          // Green
            strokeWidth={2}           // Thickness
            dot={{ r: 4 }}            // Point circle
            name="Income"             // Legend label
          />

          {/* Expense line — red */}
          <Line
            type="monotone"
            dataKey="expense"
            stroke="#ef4444"          // Red
            strokeWidth={2}
            dot={{ r: 4 }}
            name="Expense"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}