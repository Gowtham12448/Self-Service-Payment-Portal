import { useEffect, useState } from 'react';
import { api } from '../api';

const emptyCard = { number: '', expMonth: '', expYear: '', holder: '', cvv: '' };

export default function Cards({ userId, toast }) {
  const [cards, setCards] = useState([]);
  const [form, setForm] = useState(emptyCard);
  const [busy, setBusy] = useState(false);

  const refresh = () => api.listCards(userId).then(setCards).catch(() => {});

  useEffect(() => { refresh(); }, [userId]);

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const addCard = async (e) => {
    e.preventDefault();
    setBusy(true);
    try {
      await api.addCard(userId, form);
      setForm(emptyCard);
      await refresh();
      toast('Card added', 'success');
    } catch (err) {
      toast(err.message, 'error');
    } finally {
      setBusy(false);
    }
  };

  const makeDefault = async (id) => {
    try {
      await api.setDefaultCard(userId, id);
      await refresh();
      toast('Default card updated', 'success');
    } catch (err) {
      toast(err.message, 'error');
    }
  };

  const remove = async (id) => {
    if (!confirm('Remove this card?')) return;
    try {
      await api.deleteCard(userId, id);
      await refresh();
      toast('Card removed', 'success');
    } catch (err) {
      toast(err.message, 'error');
    }
  };

  return (
    <div className="card-panel">
      <h2>Payment Methods</h2>

      <h3>Saved Cards</h3>
      {cards.length === 0 && <p>No cards yet.</p>}
      {cards.map((c) => (
        <div key={c.id} className="list-item">
          <div>
            <strong>{c.brand} •••• {c.last4}</strong>{' '}
            {c.isDefault && <span className="badge default">Default</span>}
            <div style={{ fontSize: 12, color: '#666' }}>
              {c.holder} — Exp {String(c.expMonth).padStart(2, '0')}/{c.expYear}
            </div>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            {!c.isDefault && (
              <button className="ghost" onClick={() => makeDefault(c.id)}>Make Default</button>
            )}
            <button className="ghost" onClick={() => remove(c.id)}>Remove</button>
          </div>
        </div>
      ))}

      <h3 style={{ marginTop: 24 }}>Add New Card</h3>
      <form onSubmit={addCard}>
        <label>Card Number</label>
        <input name="number" placeholder="4242 4242 4242 4242" value={form.number} onChange={onChange} required />
        <div className="row">
          <div>
            <label>Exp Month</label>
            <input name="expMonth" type="number" min="1" max="12" value={form.expMonth} onChange={onChange} required />
          </div>
          <div>
            <label>Exp Year</label>
            <input name="expYear" type="number" min="2024" max="2050" value={form.expYear} onChange={onChange} required />
          </div>
          <div>
            <label>CVV</label>
            <input name="cvv" type="password" value={form.cvv} onChange={onChange} required />
          </div>
        </div>
        <label>Card Holder</label>
        <input name="holder" value={form.holder} onChange={onChange} required />
        <button className="primary" type="submit" disabled={busy}>{busy ? 'Adding…' : 'Add Card'}</button>
      </form>
    </div>
  );
}
