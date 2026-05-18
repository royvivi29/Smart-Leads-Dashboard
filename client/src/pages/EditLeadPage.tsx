import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { HiOutlineArrowLeft } from 'react-icons/hi2';
import LeadForm from '../components/LeadForm';
import { leadsApi, getErrorMessage } from '../services/api';
import type { Lead, UpdateLeadPayload } from '../types';

export default function EditLeadPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [lead, setLead] = useState<Lead | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  const handleSubmit = async (data: UpdateLeadPayload | unknown) => {
    if (!id) return;
    setError('');
    setIsSubmitting(true);
    try {
      await leadsApi.update(id, data as UpdateLeadPayload);
      navigate(`/leads/${id}`);
    } catch (err) {
      setError(getErrorMessage(err));
      setIsSubmitting(false);
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

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <Link to={`/leads/${id}`} className="inline-flex items-center gap-1.5 text-stone-500 hover:text-stone-900 dark:hover:text-stone-100 transition-colors text-sm font-medium mb-4">
          <HiOutlineArrowLeft size={16} />
          Back to Lead Details
        </Link>
        <h1 className="text-2xl font-bold tracking-tight text-stone-900 dark:text-stone-100 leading-tight">Edit Lead</h1>
      </div>

      {error && <div className="px-4 py-3 rounded-md bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400 text-sm font-medium mb-4">{error}</div>}

      <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-xl shadow-sm">
        <div className="p-6 md:p-8">
          <LeadForm
            initialData={lead!}
            onSubmit={handleSubmit as (data: any) => Promise<void>}
            isSubmitting={isSubmitting}
            submitLabel="Save Changes"
          />
        </div>
      </div>
    </div>
  );
}
