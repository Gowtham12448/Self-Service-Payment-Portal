import { useState } from 'react';
import UserInfo from './components/UserInfo';
import Cards from './components/Cards';
import PaymentPage from './components/PaymentPage';
import Subscription from './components/Subscription';
import Toast from './components/Toast';

const USER_ID = 'demo-user'; // hardcoded demo identity

const TABS = [
  { key: 'user', label: 'User Info' },
  { key: 'cards', label: 'Payment Methods' },
  { key: 'pay', label: 'Make Payment' },
  { key: 'sub', label: 'Subscription' },
];

export default function App() {
  const [tab, setTab] = useState('user');
  const [toastState, setToastState] = useState({ message: '', type: 'success' });

  const toast = (message, type = 'success') => setToastState({ message, type });

  return (
    <div className="container">
      <h1>Self-Service Payment Portal</h1>
      <p className="subtitle">User: {USER_ID}</p>

      <div className="tabs">
        {TABS.map((t) => (
          <button
            key={t.key}
            className={tab === t.key ? 'active' : ''}
            onClick={() => setTab(t.key)}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === 'user' && <UserInfo userId={USER_ID} toast={toast} />}
      {tab === 'cards' && <Cards userId={USER_ID} toast={toast} />}
      {tab === 'pay' && <PaymentPage userId={USER_ID} toast={toast} />}
      {tab === 'sub' && <Subscription userId={USER_ID} toast={toast} />}

      <Toast
        message={toastState.message}
        type={toastState.type}
        onClose={() => setToastState({ message: '', type: 'success' })}
      />
    </div>
  );
}
