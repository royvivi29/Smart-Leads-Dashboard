import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { HiOutlinePlus, HiOutlineArrowDownTray } from 'react-icons/hi2';
import { useLeads } from '../hooks/useLeads';
import LeadsTable from '../components/LeadsTable';
import FilterBar from '../components/FilterBar';
import Pagination from '../components/Pagination';
import ConfirmModal from '../components/ConfirmModal';
import { leadsApi, getErrorMessage } from '../services/api';

export default function DashboardPage() {
  const {
    leads,
    pagination,
    filters,
    isLoading,
    error: leadsError,
    setFilter,
    resetFilters,
    refetch,
  } = useLeads();

  const navigate = useNavigate();
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  const error = leadsError || localError;

  const handleDelete = async () => {
    if (!deleteId) return;
    setIsDeleting(true);
    setLocalError(null);
    try {
      await leadsApi.delete(deleteId);
      setDeleteId(null);
      refetch();
    } catch (err) {
      setLocalError(getErrorMessage(err));
    } finally {
      setIsDeleting(false);
    }
  };

  const handleExport = async () => {
    setIsExporting(true);
    setLocalError(null);
    try {
      const res = await leadsApi.exportCsv(filters);
      const blob = new Blob([res.data], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `leads-export-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      setLocalError(getErrorMessage(err));
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="py-2">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8" id="dashboard-header">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-stone-900 dark:text-stone-100 leading-tight">
            Leads Dashboard
          </h1>
          <p className="text-[0.9rem] text-stone-500 dark:text-stone-400 mt-1.5 font-medium">
            Manage and track your sales pipeline.
          </p>
        </div>
        <div className="flex gap-3 w-full sm:w-auto">
          <button
            className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-white/80 dark:bg-[#1a1917]/80 backdrop-blur-sm text-stone-700 dark:text-stone-200 border border-stone-200 dark:border-stone-700/50 rounded-xl text-[0.95rem] font-bold hover:bg-stone-50 dark:hover:bg-[#23211f] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow-md hover:border-stone-300 dark:hover:border-stone-600"
            onClick={handleExport}
            disabled={isExporting || leads.length === 0}
            id="export-csv-btn"
          >
            {isExporting ? <span className="inline-block w-4 h-4 border-2 border-stone-300 dark:border-stone-600 border-t-orange-600 rounded-full animate-spin" /> : <HiOutlineArrowDownTray size={18} />}
            Export CSV
          </button>
          <button
            className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-500 hover:to-orange-400 text-white rounded-xl text-[0.95rem] font-bold transition-all duration-300 shadow-lg shadow-orange-500/30 hover:shadow-orange-500/50 transform hover:-translate-y-0.5"
            onClick={() => navigate('/leads/new')}
            id="create-lead-btn"
          >
            <HiOutlinePlus size={18} strokeWidth={2.5} />
            New Lead
          </button>
        </div>
      </div>

      <FilterBar
        filters={filters}
        onFilterChange={setFilter}
        onReset={resetFilters}
        totalResults={pagination?.total || 0}
      />

      {error && <div className="px-5 py-4 rounded-xl bg-rose-100/80 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400 text-sm font-semibold mb-6 border border-rose-200 dark:border-rose-800/50 shadow-sm backdrop-blur-sm animate-pulse">{error}</div>}

      <div className="bg-white/70 dark:bg-[#1a1917]/70 backdrop-blur-xl border border-white/40 dark:border-stone-700/50 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.15)] overflow-hidden mb-6 transition-all duration-300 hover:shadow-[0_8px_40px_rgb(0,0,0,0.08)] dark:hover:shadow-[0_8px_40px_rgb(0,0,0,0.25)]">
        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <div className="inline-block w-10 h-10 border-[3px] border-stone-200 dark:border-stone-700 border-t-orange-600 rounded-full animate-spin" />
          </div>
        ) : (
          <LeadsTable leads={leads} onDelete={setDeleteId} />
        )}
      </div>

      {!isLoading && leads.length > 0 && pagination && (
        <Pagination pagination={pagination} onPageChange={(page) => setFilter('page', page)} />
      )}

      <ConfirmModal
        isOpen={!!deleteId}
        title="Delete Lead"
        message="Are you sure you want to delete this lead? This action cannot be undone."
        confirmLabel="Delete"
        variant="danger"
        isLoading={isDeleting}
        onConfirm={handleDelete}
        onCancel={() => !isDeleting && setDeleteId(null)}
      />
    </div>
  );
}
