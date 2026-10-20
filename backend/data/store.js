// In-memory data store (no database)
const { v4: uuidv4 } = require('uuid');

const store = {
  users: {},          // userId -> userInfo
  cards: {},          // userId -> [card, ...]
  payments: {},       // userId -> [payment, ...]
  subscriptions: {},  // userId -> subscription object
};

// Seed a demo user
const demoUser = {
  id: 'demo-user',
  fullName: 'John Doe',
  email: 'john@example.com',
  address: '123 Main St, Springfield',
  country: 'US',
  createdAt: new Date().toISOString(),
};
store.users[demoUser.id] = demoUser;
store.cards[demoUser.id] = [
  {
    id: uuidv4(),
    brand: 'Visa',
    last4: '4242',
    expMonth: 12,
    expYear: 2028,
    holder: 'John Doe',
    isDefault: true,
  },
];
store.payments[demoUser.id] = [];
store.subscriptions[demoUser.id] = {
  id: null,
  plan: null,
  status: 'inactive',
  startedAt: null,
  cancelAt: null,
};

module.exports = store;
