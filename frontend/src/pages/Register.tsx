import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'admin' | 'sales'>('sales');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      await api.post('/auth/register', { name, email, password, role });
      setSuccess('Registration successful! Redirecting to login...');
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-surface dark:bg-slate-900 transition-colors">
      <div className="bg-background dark:bg-slate-800 p-8 rounded-xl shadow-lg w-full max-w-md border border-border">
        <h2 className="text-2xl font-bold text-center text-text-main mb-6">Smart Leads Register</h2>
        {error && <div className="bg-red-100 text-red-600 p-3 rounded mb-4 text-sm">{error}</div>}
        {success && <div className="bg-green-100 text-green-600 p-3 rounded mb-4 text-sm">{success}</div>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-text-muted mb-1">Full Name</label>
            <input
              type="text"
              className="w-full p-2 rounded border border-border bg-transparent text-text-main focus:outline-none focus:border-primary-500"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-text-muted mb-1">Email</label>
            <input
              type="email"
              className="w-full p-2 rounded border border-border bg-transparent text-text-main focus:outline-none focus:border-primary-500"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-text-muted mb-1">Password</label>
            <input
              type="password"
              className="w-full p-2 rounded border border-border bg-transparent text-text-main focus:outline-none focus:border-primary-500"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-text-muted mb-1">Role</label>
            <select
              className="w-full p-2 rounded border border-border bg-background dark:bg-slate-800 text-text-main focus:outline-none focus:border-primary-500"
              value={role}
              onChange={(e) => setRole(e.target.value as 'admin' | 'sales')}
            >
              <option value="sales">Sales User</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          <button
            type="submit"
            className="w-full bg-primary-600 hover:bg-primary-700 text-white font-medium py-2 px-4 rounded transition-colors"
          >
            Sign Up
          </button>
        </form>
        <p className="mt-4 text-center text-sm text-text-muted">
          Already have an account? <Link to="/login" className="text-primary-500 hover:underline">Login</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
