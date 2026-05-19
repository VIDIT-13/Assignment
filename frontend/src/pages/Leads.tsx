import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import LeadFormModal from '../components/LeadFormModal';
import { 
  Search, Plus, Download, Edit2, Trash2, ChevronLeft, ChevronRight, 
  Filter, RefreshCw 
} from 'lucide-react';

interface Lead {
  _id: string;
  name: string;
  email: string;
  status: 'New' | 'Contacted' | 'Qualified' | 'Lost';
  source: 'Website' | 'Instagram' | 'Referral';
  createdAt: string;
}

const Leads = () => {
  const { user } = useAuth();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Search and filter states
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [sourceFilter, setSourceFilter] = useState('');
  const [sortOrder, setSortOrder] = useState('latest');
  
  // Pagination
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalLeads, setTotalLeads] = useState(0);

  // Modals
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1); // Reset to first page when search changes
    }, 400);
    return () => clearTimeout(timer);
  }, [search]);

  const fetchLeads = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await api.get('/leads', {
        params: {
          page,
          search: debouncedSearch,
          status: statusFilter,
          source: sourceFilter,
          sort: sortOrder,
        },
      });
      setLeads(response.data.leads);
      setTotalPages(response.data.pagination.totalPages);
      setTotalLeads(response.data.pagination.total);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch leads');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, [page, debouncedSearch, statusFilter, sourceFilter, sortOrder]);

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this lead?')) return;
    try {
      await api.delete(`/leads/${id}`);
      fetchLeads();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to delete lead');
    }
  };

  const handleExportCsv = async () => {
    try {
      const response = await api.get('/leads/export', { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `leads_export_${new Date().toISOString().slice(0,10)}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err: any) {
      alert('Failed to export CSV');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'New': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
      case 'Contacted': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400';
      case 'Qualified': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
      case 'Lost': return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
      default: return 'bg-slate-100 text-slate-800 dark:bg-slate-900/30 dark:text-slate-400';
    }
  };

  return (
    <div className="space-y-6">
      {/* Upper header action area */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-text-main">Leads Directory</h2>
          <p className="text-sm text-text-muted">Manage all incoming and active business leads</p>
        </div>

        <div className="flex gap-3 w-full sm:w-auto">
          {/* CSV Export Option */}
          <button
            onClick={handleExportCsv}
            className="flex items-center justify-center gap-2 px-4 py-2 border border-border rounded-lg text-text-muted hover:text-text-main bg-background dark:bg-slate-800 transition-colors text-sm font-medium w-full sm:w-auto"
          >
            <Download size={16} />
            <span>Export CSV</span>
          </button>

          {/* Add lead button */}
          <button
            onClick={() => {
              setSelectedLead(null);
              setIsModalOpen(true);
            }}
            className="flex items-center justify-center gap-2 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors text-sm font-medium w-full sm:w-auto shadow-sm"
          >
            <Plus size={16} />
            <span>Add Lead</span>
          </button>
        </div>
      </div>

      {/* Filter and Search controls */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 bg-background dark:bg-slate-800 p-4 rounded-xl border border-border">
        {/* Search */}
        <div className="relative md:col-span-2">
          <Search className="absolute left-3 top-2.5 h-4.5 w-4.5 text-text-muted" />
          <input
            type="text"
            placeholder="Search leads by name or email..."
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-border bg-transparent text-text-main placeholder:text-text-muted focus:outline-none focus:border-primary-500 text-sm"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Status filter */}
        <div className="flex items-center gap-2">
          <Filter size={16} className="text-text-muted shrink-0" />
          <select
            className="w-full p-2 text-sm rounded-lg border border-border bg-background dark:bg-slate-800 text-text-main focus:outline-none focus:border-primary-500"
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setPage(1);
            }}
          >
            <option value="">All Statuses</option>
            <option value="New">New</option>
            <option value="Contacted">Contacted</option>
            <option value="Qualified">Qualified</option>
            <option value="Lost">Lost</option>
          </select>
        </div>

        {/* Source and Sort filters combined */}
        <div className="flex gap-2">
          <select
            className="w-full p-2 text-sm rounded-lg border border-border bg-background dark:bg-slate-800 text-text-main focus:outline-none focus:border-primary-500"
            value={sourceFilter}
            onChange={(e) => {
              setSourceFilter(e.target.value);
              setPage(1);
            }}
          >
            <option value="">All Sources</option>
            <option value="Website">Website</option>
            <option value="Instagram">Instagram</option>
            <option value="Referral">Referral</option>
          </select>

          <select
            className="p-2 text-sm rounded-lg border border-border bg-background dark:bg-slate-800 text-text-main focus:outline-none focus:border-primary-500"
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
          >
            <option value="latest">Latest</option>
            <option value="oldest">Oldest</option>
          </select>
        </div>
      </div>

      {/* Main leads content */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 bg-background dark:bg-slate-800 rounded-xl border border-border gap-3">
          <RefreshCw className="animate-spin text-primary-500" size={32} />
          <p className="text-text-muted text-sm">Loading leads database...</p>
        </div>
      ) : error ? (
        <div className="p-6 text-center bg-red-50 dark:bg-red-950/20 text-red-600 rounded-xl border border-red-200 dark:border-red-950">
          <p>{error}</p>
        </div>
      ) : leads.length === 0 ? (
        <div className="text-center py-20 bg-background dark:bg-slate-800 rounded-xl border border-border">
          <p className="text-text-muted text-lg mb-2">No leads found</p>
          <p className="text-sm text-text-muted">Try adjusting your filters or create a new lead to start</p>
        </div>
      ) : (
        <div className="bg-background dark:bg-slate-800 rounded-xl border border-border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-border bg-slate-50 dark:bg-slate-700/50 text-xs font-semibold text-text-muted uppercase">
                  <th className="px-6 py-4">Name</th>
                  <th className="px-6 py-4">Email</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Source</th>
                  <th className="px-6 py-4">Created At</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border text-sm text-text-main">
                {leads.map((lead) => (
                  <tr key={lead._id} className="hover:bg-slate-50/50 dark:hover:bg-slate-700/20 transition-colors">
                    <td className="px-6 py-4 font-medium">{lead.name}</td>
                    <td className="px-6 py-4 text-text-muted">{lead.email}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor(lead.status)}`}>
                        {lead.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">{lead.source}</td>
                    <td className="px-6 py-4 text-text-muted">
                      {new Date(lead.createdAt).toLocaleDateString(undefined, {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => {
                            setSelectedLead(lead);
                            setIsModalOpen(true);
                          }}
                          className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-md text-text-muted hover:text-primary-600 transition-colors"
                          title="Edit lead"
                        >
                          <Edit2 size={15} />
                        </button>
                        {user?.role === 'admin' && (
                          <button
                            onClick={() => handleDelete(lead._id)}
                            className="p-1.5 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-md text-text-muted hover:text-red-600 transition-colors"
                            title="Delete lead"
                          >
                            <Trash2 size={15} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination Footer */}
          <div className="flex justify-between items-center px-6 py-4 border-t border-border">
            <span className="text-xs text-text-muted">
              Showing {leads.length} of {totalLeads} leads
            </span>
            <div className="flex gap-2">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="p-2 border border-border rounded-lg text-text-muted hover:text-text-main disabled:opacity-50 disabled:hover:text-text-muted transition-colors bg-background dark:bg-slate-800"
              >
                <ChevronLeft size={16} />
              </button>
              <span className="flex items-center px-3 text-sm font-medium text-text-main">
                Page {page} of {totalPages}
              </span>
              <button
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="p-2 border border-border rounded-lg text-text-muted hover:text-text-main disabled:opacity-50 disabled:hover:text-text-muted transition-colors bg-background dark:bg-slate-800"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit/Create Modal Overlay */}
      {isModalOpen && (
        <LeadFormModal
          lead={selectedLead}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedLead(null);
          }}
          onSuccess={fetchLeads}
        />
      )}
    </div>
  );
};

export default Leads;
