import { useEffect, useState } from 'react';
import { api } from '../../api/client';
import type { SupplyRequest } from '../../types/models';

export default function AdminHistoryPage() {
  const [history, setHistory] = useState<SupplyRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'ALL' | 'APPROVED' | 'REJECTED' | 'PENDING'>('ALL');

  useEffect(() => {
    api.get('/history').then((res) => setHistory(res.data)).finally(() => setLoading(false));
  }, []);

  const filtered = filter === 'ALL' ? history : history.filter(r => r.status === filter);

  function statusBadge(status: string) {
    const cls = status === 'PENDING' ? 'badge-pending' : status === 'APPROVED' ? 'badge-approved' : 'badge-rejected';
    return <span className={`badge ${cls}`}>{status}</span>;
  }

  const approved = history.filter(r => r.status === 'APPROVED').length;
  const rejected = history.filter(r => r.status === 'REJECTED').length;
  const pendingCount = history.filter(r => r.status === 'PENDING').length;

  return (
    <>
      <div className="page-header">
        <div>
          <h2>Request History</h2>
          <p className="text-muted">Complete audit trail of all supply requests</p>
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon stat-icon-blue">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V8Z"/><path d="M15 3v4a2 2 0 0 0 2 2h4"/></svg>
          </div>
          <div className="stat-info">
            <div className="stat-label">Total</div>
            <div className="stat-value">{history.length}</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon stat-icon-green">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
          </div>
          <div className="stat-info">
            <div className="stat-label">Approved</div>
            <div className="stat-value">{approved}</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon stat-icon-red">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="15" x2="9" y1="9" y2="15"/><line x1="9" x2="15" y1="9" y2="15"/></svg>
          </div>
          <div className="stat-info">
            <div className="stat-label">Rejected</div>
            <div className="stat-value">{rejected}</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon stat-icon-amber">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
          </div>
          <div className="stat-info">
            <div className="stat-label">Pending</div>
            <div className="stat-value">{pendingCount}</div>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <h3>All Requests</h3>
          <div className="filter-tabs">
            {(['ALL', 'PENDING', 'APPROVED', 'REJECTED'] as const).map((f) => (
              <button key={f} className={`filter-tab${filter === f ? ' active' : ''}`} onClick={() => setFilter(f)}>
                {f === 'ALL' ? 'All' : f.charAt(0) + f.slice(1).toLowerCase()}
              </button>
            ))}
          </div>
        </div>
        <div className="card-body-flush">
          {loading ? (
            <div className="loading-spinner">
              <div className="spinner" />
              <span className="loading-text">Loading history...</span>
            </div>
          ) : filtered.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
              </div>
              <p>No requests found</p>
              <span>{filter !== 'ALL' ? 'Try a different filter' : 'History will appear once requests are made'}</span>
            </div>
          ) : (
            <div className="table-wrap">
              <table>
                <thead>
                  <tr><th>Employee</th><th>Items</th><th>Status</th><th>Created</th><th>Reviewed</th><th>Reason</th></tr>
                </thead>
                <tbody>
                  {filtered.map((r) => (
                    <tr key={r.id}>
                      <td className="td-primary">{r.employee?.name || '—'}</td>
                      <td>
                        <div className="flex flex-wrap gap-4">
                          {r.items?.map((it) => (
                            <span key={it.id} className="item-tag" style={{ fontSize: 12, padding: '2px 8px' }}>
                              {it.item?.name ?? 'Unknown'} &times; {it.quantity}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td>{statusBadge(r.status)}</td>
                      <td className="text-muted">{new Date(r.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</td>
                      <td className="text-muted">{r.reviewedAt ? new Date(r.reviewedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '—'}</td>
                      <td className="text-muted" style={{ maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{r.rejectionReason || '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
