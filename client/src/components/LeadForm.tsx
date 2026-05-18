import { useState, useEffect, type FormEvent } from 'react';
import { LeadStatus, LeadSource } from '../types';
import type { CreateLeadPayload, UpdateLeadPayload, Lead } from '../types';

interface LeadFormProps {
  initialData?: Lead;
  onSubmit: (data: CreateLeadPayload | UpdateLeadPayload) => Promise<void>;
  isSubmitting: boolean;
  submitLabel: string;
}

export default function LeadForm({
  initialData,
  onSubmit,
  isSubmitting,
  submitLabel,
}: LeadFormProps) {
  const [name, setName] = useState(initialData?.name || '');
  const [email, setEmail] = useState(initialData?.email || '');
  const [status, setStatus] = useState<LeadStatus>(initialData?.status || LeadStatus.New);
  const [source, setSource] = useState<LeadSource | ''>(initialData?.source || '');
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (initialData) {
      setName(initialData.name);
      setEmail(initialData.email);
      setStatus(initialData.status);
      setSource(initialData.source);
    }
  }, [initialData]);

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!name.trim() || name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = 'Please enter a valid email';
    }
    if (!source) {
      newErrors.source = 'Please select a source';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    await onSubmit({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      status,
      source: source as LeadSource,
    });
  };

  const inputClasses = "px-3 py-2 bg-white dark:bg-[#1C1B18] border border-stone-200 dark:border-stone-800 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all text-sm w-full text-stone-900 dark:text-stone-100 placeholder:text-stone-400 dark:placeholder:text-stone-500";
  const labelClasses = "text-[0.8rem] font-semibold text-stone-500 dark:text-stone-400 uppercase tracking-[0.04em]";

  return (
    <form className="flex flex-col gap-4.5" onSubmit={handleSubmit} id="lead-form">
      <div className="flex flex-col gap-1.5">
        <label className={labelClasses} htmlFor="lead-name">Name</label>
        <input
          id="lead-name"
          className={inputClasses}
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. Rahul Sharma"
        />
        {errors.name && <span className="text-[0.78rem] text-rose-500 mt-0.5">{errors.name}</span>}
      </div>

      <div className="flex flex-col gap-1.5">
        <label className={labelClasses} htmlFor="lead-email">Email</label>
        <input
          id="lead-email"
          className={inputClasses}
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="e.g. rahul@company.com"
        />
        {errors.email && <span className="text-[0.78rem] text-rose-500 mt-0.5">{errors.email}</span>}
      </div>

      <div className="flex flex-col gap-1.5">
        <label className={labelClasses} htmlFor="lead-status">Status</label>
        <select
          id="lead-status"
          className={inputClasses}
          value={status}
          onChange={(e) => setStatus(e.target.value as LeadStatus)}
        >
          {Object.values(LeadStatus).map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </div>

      <div className="flex flex-col gap-1.5">
        <label className={labelClasses} htmlFor="lead-source">Source</label>
        <select
          id="lead-source"
          className={inputClasses}
          value={source}
          onChange={(e) => setSource(e.target.value as LeadSource)}
        >
          <option value="">Select source…</option>
          {Object.values(LeadSource).map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
        {errors.source && <span className="text-[0.78rem] text-rose-500 mt-0.5">{errors.source}</span>}
      </div>

      <button
        type="submit"
        className="inline-flex items-center justify-center gap-1.5 px-4 py-2 bg-orange-600 text-white rounded-md text-sm font-medium hover:bg-orange-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed mt-2"
        disabled={isSubmitting}
        id="lead-submit-btn"
      >
        {isSubmitting ? <><span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Saving…</> : submitLabel}
      </button>
    </form>
  );
}
