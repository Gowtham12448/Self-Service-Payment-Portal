const BASE = '/api';

async function request(path, options = {}) {
  const res = await fetch(`${BASE}${path}`, {
    headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
    ...options,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || `HTTP ${res.status}`);
  return data;
}

export const api = {
  getUser: (userId) => request(`/users/${userId}`),
  saveUser: (userId, payload) =>
    request(`/users/${userId}`, { method: 'POST', body: JSON.stringify(payload) }),
  listCards: (userId) => request(`/cards/${userId}`),
  addCard: (userId, payload) =>
    request(`/cards/${userId}`, { method: 'POST', body: JSON.stringify(payload) }),
  setDefaultCard: (userId, cardId) =>
    request(`/cards/${userId}/${cardId}/default`, { method: 'PATCH' }),
  deleteCard: (userId, cardId) =>
    request(`/cards/${userId}/${cardId}`, { method: 'DELETE' }),
  listPayments: (userId) => request(`/payments/${userId}`),
  pay: (userId, payload) =>
    request(`/payments/${userId}`, { method: 'POST', body: JSON.stringify(payload) }),
  plans: () => request('/subscriptions/plans'),
  getSubscription: (userId) => request(`/subscriptions/${userId}`),
  subscribe: (userId, payload) =>
    request(`/subscriptions/${userId}`, { method: 'POST', body: JSON.stringify(payload) }),
  cancelSubscription: (userId) =>
    request(`/subscriptions/${userId}/cancel`, { method: 'POST' }),
  rolloverPlan: (userId, planId) =>
    request(`/subscriptions/${userId}/rollover`, {
      method: 'PATCH',
      body: JSON.stringify({ planId }),
    }),
};
