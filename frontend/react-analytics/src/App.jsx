import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  Users, 
  Clock, 
  Star, 
  Activity, 
  RefreshCw, 
  AlertCircle 
} from 'lucide-react';
import 'bootstrap/dist/css/bootstrap.min.css';

export default function App() {
  const [summary, setSummary] = useState({
    pendingRequests: 1,
    availableMaids: 3,
    averageRating: 4.7,
    allocationsLastYear: 3
  });
  const [demand, setDemand] = useState({
    '2025': 2,
    '2026': 2
  });
  const [history, setHistory] = useState({
    Jan: 0, Feb: 1, Mar: 0, Apr: 0, May: 0, Jun: 1,
    Jul: 0, Aug: 1, Sep: 1, Oct: 0, Nov: 0, Dec: 0
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchReports = async () => {
    setLoading(true);
    setError(null);
    try {
      let baseUrl = 'http://localhost:8080/api/reports';
      let summaryRes = await fetch(`${baseUrl}/summary`).catch(() => null);
      
      if (!summaryRes || !summaryRes.ok) {
        baseUrl = 'http://localhost:8086/api/reports';
        summaryRes = await fetch(`${baseUrl}/summary`);
      }
      
      if (!summaryRes || !summaryRes.ok) throw new Error('Report Service not reachable');
      const summaryData = await summaryRes.json();
      setSummary(summaryData);

      // Fetch demand comparison
      const demandRes = await fetch(`${baseUrl}/demand-comparison`);
      if (demandRes.ok) {
        const demandData = await demandRes.json();
        setDemand(demandData);
      }

      // Fetch history
      const historyRes = await fetch(`${baseUrl}/allocations-history`);
      if (historyRes.ok) {
        const historyData = await historyRes.json();
        setHistory(historyData);
      }
    } catch (err) {
      console.warn("Could not connect to Report Service, displaying seeded local data.", err);
      setError("Using pre-seeded local database records (Report Service offline/loading)");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  // Simple SVG bar chart calculation values
  const maxHistoryValue = Math.max(...Object.values(history), 1);
  const historyKeys = Object.keys(history);

  return (
    <div className="bg-light min-vh-100 p-4">
      {/* Header bar */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="fw-bold mb-0 text-dark">Analytical Reporting Dashboard</h2>
          <p className="text-muted small mb-0">Bureau statistics aggregates & comparative data</p>
        </div>
        <div className="d-flex gap-2">
          <button className="btn btn-white shadow-sm border rounded-pill px-3 py-2 text-dark small d-flex align-items-center gap-2" onClick={fetchReports}>
            <RefreshCw size={16} className={loading ? "animate-spin" : ""} /> Refresh
          </button>
        </div>
      </div>

      {error && (
        <div className="alert alert-info border-0 rounded-4 d-flex align-items-center gap-2 mb-4" role="alert">
          <AlertCircle size={18} />
          <span className="small">{error}</span>
        </div>
      )}

      {/* Top Metrics Row */}
      <div className="row g-4 mb-4">
        {/* Metric 1 */}
        <div className="col-md-3">
          <div className="card border-0 shadow-sm rounded-4 p-3 h-100 bg-white">
            <div className="d-flex justify-content-between align-items-center mb-2">
              <span className="text-muted small fw-semibold">Pending Requests</span>
              <div className="bg-warning-subtle text-warning rounded-pill p-2">
                <Clock size={20} />
              </div>
            </div>
            <h2 className="fw-bold text-dark mb-1">{summary.pendingRequests}</h2>
            <span className="text-warning small fw-bold">Awaiting Allocation</span>
          </div>
        </div>

        {/* Metric 2 */}
        <div className="col-md-3">
          <div className="card border-0 shadow-sm rounded-4 p-3 h-100 bg-white">
            <div className="d-flex justify-content-between align-items-center mb-2">
              <span className="text-muted small fw-semibold">Available Maids</span>
              <div className="bg-success-subtle text-success rounded-pill p-2">
                <Users size={20} />
              </div>
            </div>
            <h2 className="fw-bold text-dark mb-1">{summary.availableMaids}</h2>
            <span className="text-success small fw-bold">Verified & Active</span>
          </div>
        </div>

        {/* Metric 3 */}
        <div className="col-md-3">
          <div className="card border-0 shadow-sm rounded-4 p-3 h-100 bg-white">
            <div className="d-flex justify-content-between align-items-center mb-2">
              <span className="text-muted small fw-semibold">Average Feedback Rating</span>
              <div className="bg-primary-subtle text-primary rounded-pill p-2">
                <Star size={20} />
              </div>
            </div>
            <h2 className="fw-bold text-dark mb-1">{summary.averageRating} <span className="fs-6 text-muted">/ 5</span></h2>
            <div className="text-warning small d-flex gap-0.5">
              <Star size={12} fill="currentColor" />
              <Star size={12} fill="currentColor" />
              <Star size={12} fill="currentColor" />
              <Star size={12} fill="currentColor" />
              <Star size={12} fill="currentColor" />
            </div>
          </div>
        </div>

        {/* Metric 4 */}
        <div className="col-md-3">
          <div className="card border-0 shadow-sm rounded-4 p-3 h-100 bg-white">
            <div className="d-flex justify-content-between align-items-center mb-2">
              <span className="text-muted small fw-semibold">Allocations (Last 1 year)</span>
              <div className="bg-info-subtle text-info rounded-pill p-2">
                <TrendingUp size={20} />
              </div>
            </div>
            <h2 className="fw-bold text-dark mb-1">{summary.allocationsLastYear}</h2>
            <span className="text-info small fw-bold">Active Placement Contracts</span>
          </div>
        </div>
      </div>

      <div className="row g-4">
        {/* Allocations over time */}
        <div className="col-lg-8">
          <div className="card border-0 shadow-sm rounded-4 p-4 bg-white h-100">
            <h5 className="fw-bold text-dark mb-3"><Activity size={18} className="text-primary me-2" /> Allocations History (Last 12 Months)</h5>
            
            {/* Custom Responsive SVG Chart */}
            <div className="w-100 my-4" style={{ height: '240px' }}>
              <svg viewBox="0 0 600 240" className="w-100 h-100">
                {/* Horizontal Gridlines */}
                <line x1="40" y1="30" x2="570" y2="30" stroke="#f1f5f9" strokeWidth="1" />
                <line x1="40" y1="90" x2="570" y2="90" stroke="#f1f5f9" strokeWidth="1" />
                <line x1="40" y1="150" x2="570" y2="150" stroke="#f1f5f9" strokeWidth="1" />
                <line x1="40" y1="210" x2="570" y2="210" stroke="#cbd5e1" strokeWidth="1.5" />

                {/* Y-axis Labels */}
                <text x="15" y="35" fill="#94a3b8" fontSize="10" fontWeight="bold">Max</text>
                <text x="15" y="125" fill="#94a3b8" fontSize="10" fontWeight="bold">Med</text>
                <text x="15" y="215" fill="#94a3b8" fontSize="10" fontWeight="bold">0</text>

                {/* Bars */}
                {historyKeys.map((month, index) => {
                  const val = history[month];
                  const barHeight = (val / maxHistoryValue) * 160;
                  const x = 50 + index * 43;
                  const y = 210 - barHeight;
                  return (
                    <g key={month}>
                      {/* Bar */}
                      <rect 
                        x={x} 
                        y={y} 
                        width="24" 
                        height={Math.max(barHeight, 4)} 
                        rx="4" 
                        fill="#3b82f6" 
                        opacity={val > 0 ? "1" : "0.2"}
                        className="transition-all"
                      />
                      {/* Value Indicator on Top */}
                      {val > 0 && (
                        <text x={x + 12} y={y - 6} fill="#1e293b" fontSize="10" fontWeight="bold" textAnchor="middle">{val}</text>
                      )}
                      {/* X Label */}
                      <text x={x + 12} y="228" fill="#64748b" fontSize="10" fontWeight="semibold" textAnchor="middle">{month}</text>
                    </g>
                  );
                })}
              </svg>
            </div>
          </div>
        </div>

        {/* Demand comparison */}
        <div className="col-lg-4">
          <div className="card border-0 shadow-sm rounded-4 p-4 bg-white h-100">
            <h5 className="fw-bold text-dark mb-4"><TrendingUp size={18} className="text-success me-2" /> Demand Year-over-Year</h5>
            
            <div className="d-flex flex-column gap-4 py-3">
              {/* 2025 Demand */}
              <div>
                <div className="d-flex justify-content-between mb-2">
                  <span className="fw-semibold text-secondary">Previous Year (2025)</span>
                  <strong className="text-dark">{demand['2025']} Requests</strong>
                </div>
                <div className="progress rounded-pill bg-light" style={{ height: '12px' }}>
                  <div 
                    className="progress-bar rounded-pill bg-secondary" 
                    role="progressbar" 
                    style={{ width: `${(demand['2025'] / (demand['2025'] + demand['2026'] || 1)) * 100}%` }}
                  ></div>
                </div>
              </div>

              {/* 2026 Demand */}
              <div>
                <div className="d-flex justify-content-between mb-2">
                  <span className="fw-semibold text-primary">Current Year (2026)</span>
                  <strong className="text-dark">{demand['2026']} Requests</strong>
                </div>
                <div className="progress rounded-pill bg-primary-subtle" style={{ height: '12px' }}>
                  <div 
                    className="progress-bar rounded-pill bg-primary" 
                    role="progressbar" 
                    style={{ width: `${(demand['2026'] / (demand['2025'] + demand['2026'] || 1)) * 100}%` }}
                  ></div>
                </div>
              </div>
            </div>

            <div className="bg-light rounded-4 p-3 text-center mt-auto small">
              <span className="text-muted">Relative Demand Shift:</span>
              <strong className="text-success ms-1">
                {demand['2026'] >= demand['2025'] ? '+' : ''}
                {Math.round(((demand['2026'] - demand['2025']) / (demand['2025'] || 1)) * 100)}%
              </strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
