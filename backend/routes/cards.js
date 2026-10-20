const express = require('express');
const { v4: uuidv4 } = require('uuid');
const store = require('../data/store');
const router = express.Router();

// List cards
router.get('/:userId', (req, res) => {
  res.json(store.cards[req.params.userId] || []);
});

// Add card (fake validation)
router.post('/:userId', (req, res) => {
  const { number, expMonth, expYear, holder, cvv } = req.body;
  if (!number || !expMonth || !expYear || !holder) {
    return res.status(400).json({ error: 'Missing card fields' });
  }
  const digits = String(number).replace(/\s/g, '');
  if (digits.length < 13 || digits.length > 19) {
    return res.status(400).json({ error: 'Invalid card number' });
  }
  if (!/^\d{3,4}$/.test(String(cvv || ''))) {
    return res.status(400).json({ error: 'Invalid CVV' });
  }

  const brand =
    digits.startsWith('4') ? 'Visa' :
    /^5[1-5]/.test(digits) ? 'Mastercard' :
    /^3[47]/.test(digits) ? 'Amex' : 'Unknown';

  const card = {
    id: uuidv4(),
    brand,
    last4: digits.slice(-4),
    expMonth: Number(expMonth),
    expYear: Number(expYear),
    holder,
    isDefault: (store.cards[req.params.userId] || []).length === 0,
  };

  store.cards[req.params.userId] = [...(store.cards[req.params.userId] || []), card];
  res.status(201).json(card);
});

// Set default card
router.patch('/:userId/:cardId/default', (req, res) => {
  const { userId, cardId } = req.params;
  const cards = store.cards[userId] || [];
  if (!cards.find(c => c.id === cardId)) {
    return res.status(404).json({ error: 'Card not found' });
  }
  store.cards[userId] = cards.map(c => ({ ...c, isDefault: c.id === cardId }));
  res.json(store.cards[userId]);
});

// Delete card
router.delete('/:userId/:cardId', (req, res) => {
  const { userId, cardId } = req.params;
  const cards = store.cards[userId] || [];
  const filtered = cards.filter(c => c.id !== cardId);
  if (filtered.length === cards.length) {
    return res.status(404).json({ error: 'Card not found' });
  }
  if (filtered.length > 0 && !filtered.some(c => c.isDefault)) {
    filtered[0].isDefault = true;
  }
  store.cards[userId] = filtered;
  res.json(filtered);
});

module.exports = router;
