import { useEffect, useState } from 'react';
import { api } from '../api';

export default function Subscription({ userId, toast }) {
  const [plans, setPlans] = useState([]);
  const [sub, setSub] = useState(null);
  const [cards, setCards] = useState([]);
  const [selectedPlan, setSelectedPlan] = useState('pro');
  const [cardId, setCardId] = useState('');
  const [busy, setBusy] = useState(false);

  const refresh = async () => {
    const [p, s, c] = await Promise.all([
      api.plans(),
      api.getSubscription(userId),
      api.listCards(userId),
    ]);
    setPlans(p);
    setSub(s);
    setCards(c);
    setCardId((prev) => prev || c.find((x) => x.isDefault)?.id || c[0]?.id || '');
  };

  useEffect(() => { refresh(); }, [userId]);

  const subscribe = async () => {
    setBusy(true);
    try {
      await api.subscribe(userId, { planId: selectedPlan, cardId });
      await refresh();
      toast('Subscription activated', 'success');
    } catch (err) {
      toast(err.message, 'error');
    } finally {
      setBusy(false);
    }
  };

  const cancel = async () => {
    if (!confirm('Cancel your subscription?')) return;
    setBusy(true);
    try {
      await api.cancelSubscription(userId);
      await refresh();
      toast('Subscription canceled', 'success');
    } catch (err) {
      toast(err.message, 'error');
    } finally {
      setBusy(false);
    }
  };

  const rollover = async () => {
    if (sub?.plan === selectedPlan) return toast('Already on this plan', 'error');
    setBusy(true);
    try {
      await api.rolloverPlan(userId, selectedPlan);
      await refresh();
      toast('Plan changed successfully', 'success');
    } catch (err) {
      toast(err.message, 'error');
    } finally {
      setBusy(false);
    }
  };

  const active = sub?.status === 'active';

  return (
    <div className="card-panel">
      <h2>Subscription</h2>

      <div className="list-item">
        <div>
          <strong>Current Status:</strong>{' '}
          <span className={`badge ${active ? 'default' : 'failed'}`}>
            {sub?.status || 'inactive'}
          </span>
          {active && (
            <div style={{ fontSize: 13, color: '#666' }}>
              {sub.planName} — ${sub.amount}/month (since{' '}
              {new Date(sub.startedAt).toLocaleDateString()})
            </div>
          )}
        </div>
      </div>

      <label style={{ marginTop: 16 }}>Choose a Plan</label>
      <select value={selectedPlan} onChange={(e) => setSelectedPlan(e.target.value)}>
        {plans.map((p) => (
          <option key={p.id} value={p.id}>
            {p.name} — ${p.price}/{p.interval}
          </option>
        ))}
      </select>

      <label>Payment Card</label>
      <select value={cardId} onChange={(e) => setCardId(e.target.value)}>
        {cards.length === 0 && <option value="">No cards — add one first</option>}
        {cards.map((c) => (
          <option key={c.id} value={c.id}>
            {c.brand} •••• {c.last4} {c.isDefault ? '(default)' : ''}
          </option>
        ))}
      </select>

      <div style={{ display: 'flex', gap: 12, marginTop: 16, flexWrap: 'wrap' }}>
        {!active && (
          <button className="primary" onClick={subscribe} disabled={busy || cards.length === 0}>
            Subscribe
          </button>
        )}
        {active && (
          <>
            <button className="primary" onClick={rollover} disabled={busy}>
              Rollover to Selected Plan
            </button>
            <button className="primary danger" onClick={cancel} disabled={busy}>
              Cancel Subscription
            </button>
          </>
        )}
      </div>
    </div>
  );
}
