import { useEffect, useState } from 'react';
import { api } from '../../api/client';
import type { InventoryItem } from '../../types/models';

export default function AdminInventoryPage() {
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [name, setName] = useState('');
  const [quantity, setQuantity] = useState(0);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    try {
      const res = await api.get('/inventory');
      setItems(res.data);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { void load(); }, []);

  async function addItem() {
    setError('');
    if (!name.trim() || quantity < 0) {
      setError('Provide a valid name and non-negative quantity');
      return;
    }
    try {
      await api.post('/inventory', { name, quantity });
      setName('');
      setQuantity(0);
      await load();
    } catch (e: any) {
      setError(e?.response?.data?.error?.message || 'Failed to add item');
    }
  }

  async function remove(id: string) {
    await api.delete(`/inventory/${id}`);
    await load();
  }

  const totalItems = items.length;
  const totalStock = items.reduce((sum, i) => sum + i.quantity, 0);
  const lowStock = items.filter(i => i.quantity > 0 && i.quantity < 10).length;
  const outOfStock = items.filter(i => i.quantity === 0).length;

  return (
    <>
      <div className="page-header">
        <div>
          <h2>Inventory</h2>
          <p className="text-muted">Manage your office supply stock levels</p>
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon stat-icon-blue">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/><path d="m3.3 7 8.7 5 8.7-5"/><path d="M12 22V12"/></svg>
          </div>
          <div className="stat-info">
            <div className="stat-label">Total Items</div>
            <div className="stat-value">{totalItems}</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon stat-icon-green">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>
          </div>
          <div className="stat-info">
            <div className="stat-label">Total Stock</div>
            <div className="stat-value">{totalStock}</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon stat-icon-amber">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" x2="12" y1="9" y2="13"/><line x1="12" x2="12.01" y1="17" y2="17"/></svg>
          </div>
          <div className="stat-info">
            <div className="stat-label">Low Stock</div>
            <div className="stat-value">{lowStock}</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon stat-icon-red">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="15" x2="9" y1="9" y2="15"/><line x1="9" x2="15" y1="9" y2="15"/></svg>
          </div>
          <div className="stat-info">
            <div className="stat-label">Out of Stock</div>
            <div className="stat-value">{outOfStock}</div>
          </div>
        </div>
      </div>

      <div className="card mb-28">
        <div className="card-header">
          <h3>Add New Item</h3>
        </div>
        <div className="card-body">
          <div className="form-row">
            <div className="form-group flex-1">
              <label className="form-label">Item Name</label>
              <input className="form-input" placeholder="e.g. Printer Paper A4" value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div className="form-group">
              <label className="form-label">Quantity</label>
              <input className="form-input qty-input" type="number" min={0} value={quantity} onChange={(e) => setQuantity(Number(e.target.value))} />
            </div>
            <div className="form-group">
              <label className="form-label">&nbsp;</label>
              <button className="btn btn-primary" onClick={() => void addItem()}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="M12 5v14"/></svg>
                Add Item
              </button>
            </div>
          </div>
          {error && (
            <div className="alert alert-error mt-12">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="15" x2="9" y1="9" y2="15"/><line x1="9" x2="15" y1="9" y2="15"/></svg>
              {error}
            </div>
          )}
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <h3>All Items</h3>
          <span className="badge badge-neutral">{totalItems} items</span>
        </div>
        <div className="card-body-flush">
          {loading ? (
            <div className="loading-spinner">
              <div className="spinner" />
              <span className="loading-text">Loading inventory...</span>
            </div>
          ) : items.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/><path d="m3.3 7 8.7 5 8.7-5"/><path d="M12 22V12"/></svg>
              </div>
              <p>No inventory items yet</p>
              <span>Add your first item above to get started</span>
            </div>
          ) : (
            <div className="table-wrap">
              <table>
                <thead>
                  <tr><th>Item Name</th><th>Quantity</th><th>Status</th><th style={{ width: 100 }}>Actions</th></tr>
                </thead>
                <tbody>
                  {items.map((i) => (
                    <tr key={i.id}>
                      <td className="td-primary">{i.name}</td>
                      <td style={{ fontVariantNumeric: 'tabular-nums' }}>{i.quantity}</td>
                      <td>
                        {i.quantity === 0 ? (
                          <span className="badge badge-rejected">Out of Stock</span>
                        ) : i.quantity < 10 ? (
                          <span className="badge badge-pending">Low Stock</span>
                        ) : (
                          <span className="badge badge-approved">In Stock</span>
                        )}
                      </td>
                      <td>
                        <button className="btn btn-ghost btn-sm text-danger" onClick={() => void remove(i.id)}>Delete</button>
                      </td>
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
