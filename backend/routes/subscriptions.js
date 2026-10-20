const express = require('express');
const { v4: uuidv4 } = require('uuid');
const store = require('../data/store');
const router = express.Router();

// Plan catalog
const PLANS = {
  basic:    { id: 'basic',    name: 'Basic',    price: 9.99,  interval: 'monthly' },
  pro:      { id: 'pro',      name: 'Pro',      price: 19.99, interval: 'monthly' },
  business: { id: 'business', name: 'Business', price: 49.99, interval: 'monthly' },
};

router.get('/plans', (req, res) => res.json(Object.values(PLANS)));

// Get subscription
router.get('/:userId', (req, res) => {
  res.json(store.subscriptions[req.params.userId] || { status: 'inactive' });
});

// Purchase / start subscription
router.post('/:userId', (req, res) => {
  const { planId, cardId } = req.body;
  const userId = req.params.userId;
  const plan = PLANS[planId];
  if (!plan) return res.status(400).json({ error: 'Invalid plan' });

  const cards = store.cards[userId] || [];
  const card = cardId ? cards.find(c => c.id === cardId) : cards.find(c => c.isDefault);
  if (!card) return res.status(400).json({ error: 'No card available' });

  const subscription = {
    id: uuidv4(),
    plan: plan.id,
    planName: plan.name,
    amount: plan.price,
    status: 'active',
    startedAt: new Date().toISOString(),
    cancelAt: null,
  };
  store.subscriptions[userId] = subscription;

  store.payments[userId].unshift({
    id: uuidv4(),
    amount: plan.price,
    currency: 'USD',
    cardLast4: card.last4,
    status: 'succeeded',
    description: `Subscription: ${plan.name}`,
    createdAt: new Date().toISOString(),
  });

  res.status(201).json(subscription);
});

// Rollover / change plan
router.patch('/:userId/rollover', (req, res) => {
  const { planId } = req.body;
  const userId = req.params.userId;
  const plan = PLANS[planId];
  if (!plan) return res.status(400).json({ error: 'Invalid plan' });
  const sub = store.subscriptions[userId];
  if (!sub || sub.status === 'inactive') {
    return res.status(400).json({ error: 'No active subscription' });
  }
  sub.plan = plan.id;
  sub.planName = plan.name;
  sub.amount = plan.price;
  sub.rolledOverAt = new Date().toISOString();
  res.json(sub);
});

// Cancel subscription
router.post('/:userId/cancel', (req, res) => {
  const userId = req.params.userId;
  const sub = store.subscriptions[userId];
  if (!sub || sub.status !== 'active') {
    return res.status(400).json({ error: 'No active subscription' });
  }
  sub.status = 'canceled';
  sub.cancelAt = new Date().toISOString();
  res.json(sub);
});

module.exports = router;
