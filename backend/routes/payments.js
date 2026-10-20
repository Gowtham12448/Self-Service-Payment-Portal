const express = require('express');
const { v4: uuidv4 } = require('uuid');
const store = require('../data/store');
const router = express.Router();

// List payments
router.get('/:userId', (req, res) => {
  res.json(store.payments[req.params.userId] || []);
});

// Make a one-time payment
router.post('/:userId', (req, res) => {
  const { amount, currency = 'USD', cardId, description } = req.body;
  const userId = req.params.userId;

  if (!amount || amount <= 0) {
    return res.status(400).json({ error: 'amount must be > 0' });
  }
  const cards = store.cards[userId] || [];
  const card = cardId ? cards.find(c => c.id === cardId) : cards.find(c => c.isDefault);
  if (!card) return res.status(400).json({ error: 'No card available' });

  // Simulate random failure (10%)
  if (Math.random() < 0.1) {
    const failed = {
      id: uuidv4(),
      amount: Number(amount),
      currency,
      cardLast4: card.last4,
      status: 'failed',
      description: description || 'Payment',
      createdAt: new Date().toISOString(),
    };
    store.payments[userId].unshift(failed);
    return res.status(402).json({ error: 'Payment declined by issuer', payment: failed });
  }

  const payment = {
    id: uuidv4(),
    amount: Number(amount),
    currency,
    cardLast4: card.last4,
    status: 'succeeded',
    description: description || 'Payment',
    createdAt: new Date().toISOString(),
  };
  store.payments[userId].unshift(payment);
  res.status(201).json(payment);
});

module.exports = router;
