import { useEffect, useState } from 'react';
import { api } from '../../api/client';
import type { SupplyRequest } from '../../types/models';

export default function AdminRequestsPage() {
  const [requests, setRequests] = useState<SupplyRequest[]>([]);
  const [reasons, setReasons] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    try { const res = await api.get('/requests'); setRequests(res.data); }
    finally { setLoading(false); }
  }

  useEffect(() => { void load(); }, []);

  async function approve(id: string) {
    setActionLoading(id);
    try { await api.post(`/requests/${id}/approve`); await load(); }
    finally { setActionLoading(null); }
  }

  async function reject(id: string) {
    setActionLoading(id);
    try { await api.post(`/requests/${id}/reject`, { reason: reasons[id] || '' }); await load(); }
    finally { setActionLoading(null); }
  }

  const pending = requests.filter(r => r.status === 'PENDING');
  const resolved = requests.filter(r => r.status !== 'PENDING');

  function statusBadge(status: string) {
    const cls = status === 'PENDING' ? 'badge-pending' : status === 'APPROVED' ? 'badge-approved' : 'badge-rejected';
    return <span className={`badge ${cls}`}>{status}</span>;
  }

  function employeeInitials(name?: string) {
    return name?.split(' ').map(n => n[0]).join('').toUpperCase() || '?';
  }

  return (
    <>
      <div className="page-header">
        <div>
          <h2>Supply Requests</h2>
          <p className="text-muted">Review and manage employee supply requests</p>
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon stat-icon-amber">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
          </div>
          <div className="stat-info">
            <div className="stat-label">Pending Review</div>
            <div className="stat-value">{pending.length}</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon stat-icon-blue">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V8Z"/><path d="M15 3v4a2 2 0 0 0 2 2h4"/></svg>
          </div>
          <div className="stat-info">
            <div className="stat-label">Total Requests</div>
            <div className="stat-value">{requests.length}</div>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="loading-spinner">
          <div className="spinner" />
          <span className="loading-text">Loading requests...</span>
        </div>
      ) : requests.length === 0 ? (
        <div className="card">
          <div className="empty-state">
            <div className="empty-state-icon">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M16 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V8Z"/><path d="M15 3v4a2 2 0 0 0 2 2h4"/></svg>
            </div>
            <p>No requests yet</p>
            <span>Requests from employees will appear here</span>
          </div>
        </div>
      ) : (
        <>
          {pending.length > 0 && (
            <div className="mb-28">
              <div className="section-header">
                <h3>Pending Review</h3>
                <span className="count">{pending.length}</span>
              </div>
              <div className="request-list">
                {pending.map((r) => (
                  <div key={r.id} className="request-card">
                    <div className="request-card-header">
                      <div className="request-card-employee">
                        <div className="avatar-sm">{employeeInitials(r.employee?.name)}</div>
                        <div>
                          <div className="employee-name">{r.employee?.name}</div>
                          <div className="employee-email">{r.employee?.email}</div>
                        </div>
                      </div>
                      {statusBadge(r.status)}
                    </div>
                    <div className="request-card-meta">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                      {new Date(r.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    </div>
                    {r.remarks && <div className="request-card-remark">"{r.remarks}"</div>}
                    <div className="request-card-items">
                      {r.items.map((it) => (
                        <span key={it.id} className="item-tag">{it.item.name} &times; {it.quantity}</span>
                      ))}
                    </div>
                    <div className="request-card-actions">
                      <div className="form-group flex-1">
                        <textarea
                          className="form-textarea"
                          placeholder="Rejection reason (optional)"
                          rows={2}
                          value={reasons[r.id] || ''}
                          onChange={(e) => setReasons((prev) => ({ ...prev, [r.id]: e.target.value }))}
                          style={{ minHeight: 48 }}
                        />
                      </div>
                      <div className="flex flex-col gap-8">
                        <button className="btn btn-success btn-sm" onClick={() => void approve(r.id)} disabled={actionLoading === r.id}>
                          {actionLoading === r.id ? '...' : 'Approve'}
                        </button>
                        <button className="btn btn-danger btn-sm" onClick={() => void reject(r.id)} disabled={actionLoading === r.id}>
                          {actionLoading === r.id ? '...' : 'Reject'}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {resolved.length > 0 && (
            <div>
              <div className="section-header">
                <h3>Resolved</h3>
                <span className="count">{resolved.length}</span>
              </div>
              <div className="request-list">
                {resolved.map((r) => (
                  <div key={r.id} className="request-card">
                    <div className="request-card-header">
                      <div className="request-card-employee">
                        <div className="avatar-sm">{employeeInitials(r.employee?.name)}</div>
                        <div>
                          <div className="employee-name">{r.employee?.name}</div>
                          <div className="employee-email">{r.employee?.email}</div>
                        </div>
                      </div>
                      {statusBadge(r.status)}
                    </div>
                    <div className="request-card-meta">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                      {new Date(r.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    </div>
                    <div className="request-card-items">
                      {r.items.map((it) => (
                        <span key={it.id} className="item-tag">{it.item.name} &times; {it.quantity}</span>
                      ))}
                    </div>
                    {r.rejectionReason && <div className="request-card-reason">Reason: {r.rejectionReason}</div>}
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </>
  );
}
