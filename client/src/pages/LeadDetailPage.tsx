import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { HiOutlineArrowLeft, HiOutlinePencil, HiOutlineTrash } from 'react-icons/hi2';
import { leadsApi, getErrorMessage } from '../services/api';
import type { Lead } from '../types';
import { LeadStatus, UserRole } from '../types';
import { useAuth } from '../context/AuthContext';
import ConfirmModal from '../components/ConfirmModal';

const statusBadgeClasses: Record<LeadStatus, string> = {
  [LeadStatus.New]: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
  [LeadStatus.Contacted]: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  [LeadStatus.Qualified]: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
  [LeadStatus.Lost]: 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400',
};

const statusDotClasses: Record<LeadStatus, string> = {
  [LeadStatus.New]: 'bg-emerald-500 dark:bg-emerald-400',
  [LeadStatus.Contacted]: 'bg-blue-500 dark:bg-blue-400',
  [LeadStatus.Qualified]: 'bg-amber-500 dark:bg-amber-400',
  [LeadStatus.Lost]: 'bg-rose-500 dark:bg-rose-400',
};

export default function LeadDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const isAdmin = user?.role === UserRole.Admin;

  const [lead, setLead] = useState<Lead | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const [isDeleting, setIsDeleting] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  useEffect(() => {
    if (!id) return;

    const fetchLead = async () => {
      try {
        const res = await leadsApi.getById(id);
        setLead(res.data.data as Lead);
      } catch (err) {
        setError(getErrorMessage(err));
      } finally {
        setIsLoading(false);
      }
    };

    fetchLead();
  }, [id]);

  const handleDelete = async () => {
    if (!id) return;
    setIsDeleting(true);
    try {
      await leadsApi.delete(id);
      navigate('/');
    } catch (err) {
      setError(getErrorMessage(err));
      setIsDeleting(false);
      setShowConfirm(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-16">
        <div className="inline-block w-8 h-8 border-[3px] border-stone-200 dark:border-stone-700 border-t-orange-600 rounded-full animate-spin" />
      </div>
    );
  }

  if (error && !lead) {
    return (
      <div className="text-center py-16 px-6">
        <div className="text-4xl mb-4 opacity-30">⚠️</div>
        <div className="text-lg font-semibold mb-1 text-stone-900 dark:text-stone-100">Error loading lead</div>
        <div className="text-sm text-stone-500 dark:text-stone-400 max-w-xs mx-auto mb-6">{error}</div>
        <Link to="/" className="inline-flex items-center justify-center gap-1.5 px-4 py-2 bg-stone-100 dark:bg-stone-800 text-stone-900 dark:text-stone-100 rounded-md text-sm font-medium hover:bg-stone-200 dark:hover:bg-stone-700 transition-colors">
          Back to Dashboard
        </Link>
      </div>
    );
  }

  if (!lead) return null;

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-6">
        <Link to="/" className="inline-flex items-center gap-1.5 text-stone-500 hover:text-stone-900 dark:hover:text-stone-100 transition-colors text-sm font-medium mb-4">
          <HiOutlineArrowLeft size={16} />
          Back to Dashboard
        </Link>

        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-stone-900 dark:text-stone-100 leading-tight mb-2">{lead.name}</h1>
            <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold tracking-wide ${statusBadgeClasses[lead.status]}`}>
              <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${statusDotClasses[lead.status]}`} />
              {lead.status}
            </span>
          </div>

          <div className="flex gap-2">
            <button
              className="inline-flex items-center justify-center gap-1.5 px-4 py-2 bg-white dark:bg-[#1C1B18] text-stone-900 dark:text-stone-100 border border-stone-300 dark:border-stone-700 rounded-md text-sm font-medium hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
              onClick={() => navigate(`/leads/${lead._id}/edit`)}
              id="edit-lead-btn"
            >
              <HiOutlinePencil size={16} />
              Edit
            </button>
            {isAdmin && (
              <button
                className="inline-flex items-center justify-center gap-1.5 px-4 py-2 bg-rose-600 text-white rounded-md text-sm font-medium hover:bg-rose-700 transition-colors"
                onClick={() => setShowConfirm(true)}
                id="delete-lead-btn"
              >
                <HiOutlineTrash size={16} />
                Delete
              </button>
            )}
          </div>
        </div>
      </div>

      {error && <div className="px-4 py-3 rounded-md bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400 text-sm font-medium mb-4">{error}</div>}

      <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-xl shadow-sm">
        <div className="px-6 py-5 border-b border-stone-200 dark:border-stone-800">
          <h2 className="text-[1.1rem] font-bold text-stone-900 dark:text-stone-100 tracking-tight">Lead Information</h2>
        </div>
        <div className="p-6 md:p-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <div className="text-[0.72rem] font-bold tracking-[0.06em] uppercase text-stone-500 dark:text-stone-400 mb-1">Full Name</div>
              <div className="text-[0.95rem] text-stone-900 dark:text-stone-100 font-medium">{lead.name}</div>
            </div>

            <div>
              <div className="text-[0.72rem] font-bold tracking-[0.06em] uppercase text-stone-500 dark:text-stone-400 mb-1">Email Address</div>
              <div className="text-[0.95rem] text-stone-900 dark:text-stone-100">
                <a href={`mailto:${lead.email}`} className="text-orange-600 dark:text-orange-500 hover:text-orange-700 dark:hover:text-orange-400 font-medium">
                  {lead.email}
                </a>
              </div>
            </div>

            <div>
              <div className="text-[0.72rem] font-bold tracking-[0.06em] uppercase text-stone-500 dark:text-stone-400 mb-1">Source</div>
              <div className="text-[0.95rem] text-stone-900 dark:text-stone-100 font-medium">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-stone-100 text-stone-600 dark:bg-stone-800 dark:text-stone-400 mt-1">
                  {lead.source}
                </span>
              </div>
            </div>

            <div>
              <div className="text-[0.72rem] font-bold tracking-[0.06em] uppercase text-stone-500 dark:text-stone-400 mb-1">Date Created</div>
              <div className="text-[0.95rem] text-stone-900 dark:text-stone-100 tabular-nums">
                {new Date(lead.createdAt).toLocaleString('en-IN', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </div>
            </div>

            <div>
              <div className="text-[0.72rem] font-bold tracking-[0.06em] uppercase text-stone-500 dark:text-stone-400 mb-1">Last Updated</div>
              <div className="text-[0.95rem] text-stone-900 dark:text-stone-100 tabular-nums">
                {new Date(lead.updatedAt).toLocaleString('en-IN', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      <ConfirmModal
        isOpen={showConfirm}
        title="Delete Lead"
        message={<>Are you sure you want to delete <strong>{lead.name}</strong>? This action cannot be undone.</>}
        confirmLabel="Delete"
        variant="danger"
        isLoading={isDeleting}
        onConfirm={handleDelete}
        onCancel={() => !isDeleting && setShowConfirm(false)}
      />
    </div>
  );
}
