import { useEffect, useState } from 'react';
import { api } from '../api';

export default function PaymentPage({ userId, toast }) {
  const [cards, setCards] = useState([]);
  const [payments, setPayments] = useState([]);
  const [form, setForm] = useState({ amount: '', cardId: '', description: '' });
  const [busy, setBusy] = useState(false);

  const refresh = async () => {
    const [c, p] = await Promise.all([api.listCards(userId), api.listPayments(userId)]);
    setCards(c);
    setPayments(p);
    setForm((f) => ({
      ...f,
      cardId: f.cardId || c.find((x) => x.isDefault)?.id || c[0]?.id || '',
    }));
  };

  useEffect(() => { refresh(); }, [userId]);

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const pay = async (e) => {
    e.preventDefault();
    setBusy(true);
    try {
      const result = await api.pay(userId, {
        amount: Number(form.amount),
        cardId: form.cardId,
        description: form.description,
      });
      toast(`Payment succeeded: $${result.amount.toFixed(2)}`, 'success');
      setForm({ ...form, amount: '', description: '' });
      await refresh();
    } catch (err) {
      toast(err.message, 'error');
      await refresh();
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="card-panel">
      <h2>Make a Payment</h2>

      <form onSubmit={pay}>
        <label>Amount (USD)</label>
        <input name="amount" type="number" step="0.01" min="0.01" value={form.amount} onChange={onChange} required />
        <label>Card</label>
        <select name="cardId" value={form.cardId} onChange={onChange} required>
          {cards.length === 0 && <option value="">No cards — add one first</option>}
          {cards.map((c) => (
            <option key={c.id} value={c.id}>
              {c.brand} •••• {c.last4} {c.isDefault ? '(default)' : ''}
            </option>
          ))}
        </select>
        <label>Description</label>
        <input name="description" value={form.description} onChange={onChange} placeholder="Optional" />
        <button className="primary" type="submit" disabled={busy || cards.length === 0}>
          {busy ? 'Processing…' : 'Pay Now'}
        </button>
      </form>

      <h3 style={{ marginTop: 24 }}>Payment History</h3>
      {payments.length === 0 && <p>No payments yet.</p>}
      {payments.map((p) => (
        <div key={p.id} className="list-item">
          <div>
            <strong>${p.amount.toFixed(2)} {p.currency}</strong>{' '}
            <span className={`badge ${p.status === 'failed' ? 'failed' : ''}`}>{p.status}</span>
            <div style={{ fontSize: 12, color: '#666' }}>
              {p.description} · •••• {p.cardLast4} · {new Date(p.createdAt).toLocaleString()}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
