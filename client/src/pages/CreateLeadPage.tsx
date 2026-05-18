import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { HiOutlineArrowLeft } from 'react-icons/hi2';
import LeadForm from '../components/LeadForm';
import { leadsApi, getErrorMessage } from '../services/api';
import type { CreateLeadPayload } from '../types';

export default function CreateLeadPage() {
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (data: CreateLeadPayload | any) => {
    setError('');
    setIsSubmitting(true);
    try {
      await leadsApi.create(data as CreateLeadPayload);
      navigate('/');
    } catch (err) {
      setError(getErrorMessage(err));
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <Link to="/" className="inline-flex items-center gap-1.5 text-stone-500 hover:text-stone-900 dark:hover:text-stone-100 transition-colors text-sm font-medium mb-4">
          <HiOutlineArrowLeft size={16} />
          Back to Dashboard
        </Link>
        <h1 className="text-2xl font-bold tracking-tight text-stone-900 dark:text-stone-100 leading-tight">Create New Lead</h1>
      </div>

      {error && <div className="px-4 py-3 rounded-md bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400 text-sm font-medium mb-4">{error}</div>}

      <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-xl shadow-sm">
        <div className="p-6 md:p-8">
          <LeadForm
            onSubmit={handleSubmit}
            isSubmitting={isSubmitting}
            submitLabel="Create Lead"
          />
        </div>
      </div>
    </div>
  );
}
