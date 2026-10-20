const express = require('express');
const store = require('../data/store');
const router = express.Router();

// Get user info
router.get('/:userId', (req, res) => {
  const user = store.users[req.params.userId];
  if (!user) return res.status(404).json({ error: 'User not found' });
  res.json(user);
});

// Create or update user info
router.post('/:userId', (req, res) => {
  const { fullName, email, address, country } = req.body;
  if (!fullName || !email) {
    return res.status(400).json({ error: 'fullName and email required' });
  }
  const id = req.params.userId;
  store.users[id] = {
    id,
    fullName,
    email,
    address: address || '',
    country: country || 'US',
    createdAt: store.users[id]?.createdAt || new Date().toISOString(),
  };
  res.json(store.users[id]);
});

module.exports = router;
