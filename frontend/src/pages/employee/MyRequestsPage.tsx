import { useEffect, useState } from 'react';
import { api } from '../../api/client';
import type { SupplyRequest } from '../../types/models';

export default function EmployeeMyRequestsPage() {
  const [requests, setRequests] = useState<SupplyRequest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/requests').then((res) => setRequests(res.data)).finally(() => setLoading(false));
  }, []);

  function statusBadge(status: string) {
    const cls = status === 'PENDING' ? 'badge-pending' : status === 'APPROVED' ? 'badge-approved' : 'badge-rejected';
    return <span className={`badge ${cls}`}>{status}</span>;
  }

  const pending = requests.filter(r => r.status === 'PENDING').length;
  const approved = requests.filter(r => r.status === 'APPROVED').length;
  const rejected = requests.filter(r => r.status === 'REJECTED').length;

  return (
    <>
      <div className="page-header">
        <div>
          <h2>My Requests</h2>
          <p className="text-muted">Track the status of your supply requests</p>
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon stat-icon-blue">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V8Z"/><path d="M15 3v4a2 2 0 0 0 2 2h4"/></svg>
          </div>
          <div className="stat-info">
            <div className="stat-label">Total</div>
            <div className="stat-value">{requests.length}</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon stat-icon-amber">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
          </div>
          <div className="stat-info">
            <div className="stat-label">Pending</div>
            <div className="stat-value">{pending}</div>
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
      </div>

      {loading ? (
        <div className="loading-spinner">
          <div className="spinner" />
          <span className="loading-text">Loading your requests...</span>
        </div>
      ) : requests.length === 0 ? (
        <div className="card">
          <div className="empty-state">
            <div className="empty-state-icon">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M16 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V8Z"/><path d="M15 3v4a2 2 0 0 0 2 2h4"/></svg>
            </div>
            <p>No requests yet</p>
            <span>Submit a new supply request to get started</span>
          </div>
        </div>
      ) : (
        <div className="request-list">
          {requests.map((r) => (
            <div key={r.id} className="request-card">
              <div className="request-card-header">
                <div className="request-card-meta">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                  {new Date(r.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                </div>
                {statusBadge(r.status)}
              </div>

              <div className="request-card-items">
                {r.items.map((it) => (
                  <span key={it.id} className="item-tag">{it.item.name} &times; {it.quantity}</span>
                ))}
              </div>

              {r.remarks && <div className="request-card-remark">"{r.remarks}"</div>}

              {r.rejectionReason && <div className="request-card-reason">Rejected: {r.rejectionReason}</div>}

              {r.reviewedAt && (
                <div className="text-muted mt-12">
                  Reviewed {new Date(r.reviewedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  {r.reviewedBy ? ` by ${r.reviewedBy.name}` : ''}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </>
  );
}
