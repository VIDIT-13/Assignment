import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import api from '../services/api';

interface Lead {
  _id?: string;
  name: string;
  email: string;
  status: 'New' | 'Contacted' | 'Qualified' | 'Lost';
  source: 'Website' | 'Instagram' | 'Referral';
}

interface LeadFormModalProps {
  lead?: Lead | null;
  onClose: () => void;
  onSuccess: () => void;
}

const LeadFormModal = ({ lead, onClose, onSuccess }: LeadFormModalProps) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'New' | 'Contacted' | 'Qualified' | 'Lost'>('New');
  const [source, setSource] = useState<'Website' | 'Instagram' | 'Referral'>('Website');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (lead) {
      setName(lead.name);
      setEmail(lead.email);
      setStatus(lead.status);
      setSource(lead.source);
    }
  }, [lead]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (lead?._id) {
        // Edit lead
        await api.put(`/leads/${lead._id}`, { name, email, status, source });
      } else {
        // Create lead
        await api.post('/leads', { name, email, status, source });
      }
      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to save lead');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-background dark:bg-slate-800 rounded-xl shadow-xl w-full max-w-lg border border-border overflow-hidden">
        {/* Header */}
        <div className="flex justify-between items-center px-6 py-4 border-b border-border">
          <h3 className="text-lg font-semibold text-text-main">
            {lead ? 'Edit Lead' : 'Add New Lead'}
          </h3>
          <button
            onClick={onClose}
            className="text-text-muted hover:text-text-main transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && <div className="bg-red-100 text-red-600 p-3 rounded text-sm">{error}</div>}

          <div>
            <label className="block text-sm font-medium text-text-muted mb-1">Name</label>
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

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-text-muted mb-1">Status</label>
              <select
                className="w-full p-2 rounded border border-border bg-background dark:bg-slate-800 text-text-main focus:outline-none focus:border-primary-500"
                value={status}
                onChange={(e) => setStatus(e.target.value as any)}
              >
                <option value="New">New</option>
                <option value="Contacted">Contacted</option>
                <option value="Qualified">Qualified</option>
                <option value="Lost">Lost</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-text-muted mb-1">Source</label>
              <select
                className="w-full p-2 rounded border border-border bg-background dark:bg-slate-800 text-text-main focus:outline-none focus:border-primary-500"
                value={source}
                onChange={(e) => setSource(e.target.value as any)}
              >
                <option value="Website">Website</option>
                <option value="Instagram">Instagram</option>
                <option value="Referral">Referral</option>
              </select>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t border-border mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-text-muted hover:text-text-main transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 text-sm font-medium bg-primary-600 hover:bg-primary-700 text-white rounded transition-colors disabled:opacity-50"
            >
              {loading ? 'Saving...' : 'Save Lead'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LeadFormModal;
