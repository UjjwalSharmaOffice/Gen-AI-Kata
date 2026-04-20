import { useEffect, useState } from 'react';
import { api } from '../../api/client';
import type { InventoryItem } from '../../types/models';

export default function EmployeeNewRequestPage() {
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [remarks, setRemarks] = useState('');
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    api.get('/inventory').then((res) => setInventory(res.data)).finally(() => setLoading(false));
  }, []);

  const selectedCount = Object.values(quantities).filter(q => q > 0).length;
  const totalQty = Object.values(quantities).reduce((s, q) => s + (q > 0 ? q : 0), 0);

  async function submit() {
    const items = Object.entries(quantities)
      .filter(([, qty]) => qty > 0)
      .map(([itemId, quantity]) => ({ itemId, quantity }));

    if (!items.length) {
      setMessage({ type: 'error', text: 'Select at least one item with quantity greater than 0' });
      return;
    }

    setSubmitting(true);
    setMessage(null);
    try {
      await api.post('/requests', { remarks, items });
      setQuantities({});
      setRemarks('');
      setMessage({ type: 'success', text: 'Your request has been submitted and is pending approval' });
    } catch {
      setMessage({ type: 'error', text: 'Failed to submit request. Please try again.' });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      <div className="page-header">
        <div>
          <h2>New Supply Request</h2>
          <p className="text-muted">Select items and quantities to request from inventory</p>
        </div>
      </div>

      {message && (
        <div className={`alert ${message.type === 'success' ? 'alert-success' : 'alert-error'} mb-24`}>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            {message.type === 'success' ? (
              <><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></>
            ) : (
              <><circle cx="12" cy="12" r="10"/><line x1="15" x2="9" y1="9" y2="15"/><line x1="9" x2="15" y1="9" y2="15"/></>
            )}
          </svg>
          {message.text}
        </div>
      )}

      <div className="card mb-24">
        <div className="card-header">
          <h3>Remarks</h3>
          <span className="text-muted">Optional</span>
        </div>
        <div className="card-body">
          <textarea
            className="form-textarea"
            placeholder="Describe why you need these supplies..."
            value={remarks}
            onChange={(e) => setRemarks(e.target.value)}
            rows={3}
          />
        </div>
      </div>

      <div className="card mb-24">
        <div className="card-header">
          <h3>Available Items</h3>
          <div className="flex gap-8">
            <span className="badge badge-info">{selectedCount} selected</span>
            {totalQty > 0 && <span className="badge badge-neutral">{totalQty} total qty</span>}
          </div>
        </div>
        <div className="card-body-flush">
          {loading ? (
            <div className="loading-spinner">
              <div className="spinner" />
              <span className="loading-text">Loading items...</span>
            </div>
          ) : inventory.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/><path d="m3.3 7 8.7 5 8.7-5"/><path d="M12 22V12"/></svg>
              </div>
              <p>No items available</p>
              <span>Contact your admin to add inventory items</span>
            </div>
          ) : (
            <div className="table-wrap">
              <table>
                <thead>
                  <tr><th>Item</th><th>Available</th><th>Status</th><th style={{ width: 120 }}>Quantity</th></tr>
                </thead>
                <tbody>
                  {inventory.map((i) => (
                    <tr key={i.id} className={(quantities[i.id] ?? 0) > 0 ? 'row-selected' : undefined}>
                      <td className="td-primary">{i.name}</td>
                      <td style={{ fontVariantNumeric: 'tabular-nums' }}>{i.quantity}</td>
                      <td>
                        {i.quantity === 0 ? (
                          <span className="badge badge-rejected">Unavailable</span>
                        ) : i.quantity < 10 ? (
                          <span className="badge badge-pending">Low Stock</span>
                        ) : (
                          <span className="badge badge-approved">Available</span>
                        )}
                      </td>
                      <td>
                        <input
                          className="form-input qty-input"
                          type="number"
                          min={0}
                          max={i.quantity}
                          value={quantities[i.id] ?? 0}
                          onChange={(e) => setQuantities((prev) => ({ ...prev, [i.id]: Number(e.target.value) }))}
                          disabled={i.quantity === 0}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      <button
        className="btn btn-primary btn-lg"
        onClick={() => void submit()}
        disabled={submitting || selectedCount === 0}
        style={{ minWidth: 200 }}
      >
        {submitting ? (
          <>
            <span className="spinner" style={{ width: 18, height: 18, borderWidth: 2 }} />
            Submitting...
          </>
        ) : (
          <>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" x2="11" y1="2" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
            Submit Request ({selectedCount} items)
          </>
        )}
      </button>
    </>
  );
}
