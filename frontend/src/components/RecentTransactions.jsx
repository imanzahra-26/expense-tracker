// ============================================
// RECENT TRANSACTIONS — Last 5 combined entries
// ============================================

// Props:
//   - data: array of { id, type, title, amount, category, date }
export default function RecentTransactions({ data }) {

  // Empty state
  if (!data || data.length === 0) {
    return (
      <div className="chart-card">
        <h3>Recent Transactions</h3>
        <p className="empty">No transactions yet 💸</p>
      </div>
    );
  }

  return (
    <div className="chart-card">
      <h3>Recent Transactions</h3>

      <ul className="tx-list">
        {data.map((tx) => (
          // Each row — type class colors it green (income) or red (expense)
          <li key={`${tx.type}-${tx.id}`} className={`tx-item tx-${tx.type}`}>

            {/* Left side: icon + title + category */}
            <div className="tx-left">

              {/* Arrow icon depending on type */}
              <span className="tx-icon">
                {tx.type === 'income' ? '⬇️' : '⬆️'}
              </span>

              {/* Title + small category/date line */}
              <div>
                <p className="tx-title">{tx.title}</p>
                <p className="tx-meta">
                  {tx.category} • {new Date(tx.date).toLocaleDateString()}
                </p>
              </div>
            </div>

            {/* Right side: amount with +/- sign */}
            <span className="tx-amount">
              {tx.type === 'income' ? '+' : '-'} Rs. {Number(tx.amount).toFixed(2)}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}