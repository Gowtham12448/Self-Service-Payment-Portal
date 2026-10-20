import { useEffect, useState } from 'react';
import { api } from '../api';

export default function UserInfo({ userId, toast }) {
  const [form, setForm] = useState({ fullName: '', email: '', address: '', country: 'US' });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getUser(userId)
      .then(setForm)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [userId]);

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.saveUser(userId, form);
      toast('User info saved', 'success');
    } catch (err) {
      toast(err.message, 'error');
    }
  };

  if (loading) return <div className="card-panel">Loading…</div>;

  return (
    <div className="card-panel">
      <h2>User Information</h2>
      <form onSubmit={onSubmit}>
        <label>Full Name</label>
        <input name="fullName" value={form.fullName} onChange={onChange} required />
        <label>Email</label>
        <input name="email" type="email" value={form.email} onChange={onChange} required />
        <label>Address</label>
        <input name="address" value={form.address} onChange={onChange} />
        <label>Country</label>
        <select name="country" value={form.country} onChange={onChange}>
          <option value="US">United States</option>
          <option value="IN">India</option>
          <option value="GB">United Kingdom</option>
          <option value="DE">Germany</option>
          <option value="AU">Australia</option>
        </select>
        <button className="primary" type="submit">Save Info</button>
      </form>
    </div>
  );
}
