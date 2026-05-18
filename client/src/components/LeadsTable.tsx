import { useNavigate } from 'react-router-dom';
import { HiOutlinePencil, HiOutlineTrash, HiOutlineEye } from 'react-icons/hi2';
import type { Lead } from '../types';
import { LeadStatus, UserRole } from '../types';
import { useAuth } from '../context/AuthContext';

interface LeadsTableProps {
  leads: Lead[];
  onDelete: (id: string) => void;
}

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

function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

export default function LeadsTable({ leads, onDelete }: LeadsTableProps) {
  const navigate = useNavigate();
  const { user } = useAuth();
  const isAdmin = user?.role === UserRole.Admin;

  if (leads.length === 0) {
    return (
      <div className="text-center py-16 px-6">
        <div className="text-4xl mb-4 opacity-30">📋</div>
        <div className="text-lg font-semibold mb-1 text-stone-900 dark:text-stone-100">No leads found</div>
        <div className="text-sm text-stone-500 dark:text-stone-400 max-w-xs mx-auto">
          Try adjusting your filters or create a new lead to get started.
        </div>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto overflow-y-hidden">
      <table className="w-full min-w-[500px] text-sm text-left border-collapse" id="leads-table">
        <thead>
          <tr>
            <th className="px-4 py-3 text-[0.72rem] font-bold tracking-wider uppercase text-stone-500 dark:text-stone-400 border-b border-stone-200 dark:border-stone-800 whitespace-nowrap">Name</th>
            <th className="px-4 py-3 text-[0.72rem] font-bold tracking-wider uppercase text-stone-500 dark:text-stone-400 border-b border-stone-200 dark:border-stone-800 whitespace-nowrap">Status</th>
            <th className="px-4 py-3 text-[0.72rem] font-bold tracking-wider uppercase text-stone-500 dark:text-stone-400 border-b border-stone-200 dark:border-stone-800 whitespace-nowrap">Source</th>
            <th className="px-4 py-3 text-[0.72rem] font-bold tracking-wider uppercase text-stone-500 dark:text-stone-400 border-b border-stone-200 dark:border-stone-800 whitespace-nowrap">Created</th>
            <th className="px-4 py-3 border-b border-stone-200 dark:border-stone-800" style={{ width: '1%' }}></th>
          </tr>
        </thead>
        <tbody>
          {leads.map((lead) => (
            <tr key={lead._id} className="group border-b border-stone-200 dark:border-stone-800 last:border-0 hover:bg-stone-50 dark:hover:bg-stone-800/50 transition-colors">
              <td className="px-4 py-3 align-middle">
                <div className="font-semibold text-stone-900 dark:text-stone-100">{lead.name}</div>
                <div className="text-[0.82rem] text-stone-500 dark:text-stone-400">{lead.email}</div>
              </td>
              <td className="px-4 py-3 align-middle hidden sm:table-cell">
                <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold tracking-wide ${statusBadgeClasses[lead.status]}`}>
                  <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${statusDotClasses[lead.status]}`} />
                  {lead.status}
                </span>
              </td>
              <td className="px-4 py-3 align-middle hidden md:table-cell">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-stone-100 text-stone-600 dark:bg-stone-800 dark:text-stone-400">
                  {lead.source}
                </span>
              </td>
              <td className="px-4 py-3 align-middle hidden lg:table-cell">
                <span className="text-[0.82rem] text-stone-500 dark:text-stone-400 tabular-nums">{formatDate(lead.createdAt)}</span>
              </td>
              <td className="px-4 py-3 align-middle text-right">
                <div className="flex justify-end gap-1 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    className="p-1.5 rounded-md text-stone-500 dark:text-stone-400 hover:bg-stone-200 dark:hover:bg-stone-700 hover:text-stone-900 dark:hover:text-stone-100 transition-colors"
                    title="View details"
                    onClick={() => navigate(`/leads/${lead._id}`)}
                    aria-label={`View ${lead.name}`}
                  >
                    <HiOutlineEye size={16} />
                  </button>
                  <button
                    className="p-1.5 rounded-md text-stone-500 dark:text-stone-400 hover:bg-stone-200 dark:hover:bg-stone-700 hover:text-stone-900 dark:hover:text-stone-100 transition-colors"
                    title="Edit lead"
                    onClick={() => navigate(`/leads/${lead._id}/edit`)}
                    aria-label={`Edit ${lead.name}`}
                  >
                    <HiOutlinePencil size={16} />
                  </button>
                  {isAdmin && (
                    <button
                      className="p-1.5 rounded-md text-rose-500 hover:bg-rose-100 dark:hover:bg-rose-900/30 transition-colors"
                      title="Delete lead"
                      onClick={() => onDelete(lead._id)}
                      aria-label={`Delete ${lead.name}`}
                    >
                      <HiOutlineTrash size={16} />
                    </button>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
