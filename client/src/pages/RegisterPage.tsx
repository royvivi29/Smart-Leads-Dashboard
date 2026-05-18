import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { authApi, getErrorMessage } from '../services/api';
import { UserRole } from '../types';
import type { User } from '../types';

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<UserRole>(UserRole.Sales);
  const [error, setError] = useState('');
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setValidationErrors({});
    setIsLoading(true);
    try {
      const res = await authApi.register({ name, email, password, role });
      const { user, token } = res.data.data as { user: User; token: string };
      login(token, user);
      navigate('/');
    } catch (err: unknown) {
      const apiErr = err as { response?: { data?: { errors?: Record<string, string[]> } } };
      if (apiErr.response?.data?.errors) {
        const flatErrors: Record<string, string> = {};
        for (const [key, msgs] of Object.entries(apiErr.response.data.errors)) {
          flatErrors[key] = msgs[0];
        }
        setValidationErrors(flatErrors);
      } else {
        setError(getErrorMessage(err));
      }
    } finally {
      setIsLoading(false);
    }
  };

  const inputCls =
    'w-full px-4 py-3 rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-white/5 text-stone-900 dark:text-stone-100 placeholder:text-stone-400 dark:placeholder:text-stone-500 text-[0.95rem] shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500/40 focus:border-orange-500 hover:border-orange-400/60 dark:hover:border-orange-500/40 transition-all duration-200';

  const labelCls =
    'block mb-1.5 text-[0.75rem] font-bold text-stone-600 dark:text-stone-300 uppercase tracking-widest';

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-gradient-to-br from-stone-100 to-stone-200 dark:from-[#0d0c0b] dark:to-[#1a1917] relative overflow-hidden">
      {/* Decorative blobs */}
      <div className="absolute top-[-10%] right-[-5%] w-[420px] h-[420px] bg-orange-500/20 dark:bg-orange-600/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[5%] w-[480px] h-[480px] bg-orange-500/20 dark:bg-orange-600/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Card — padding from .auth-card */}
      <div className="auth-card">

        {/* Logo */}
        <div className="flex justify-center items-center gap-3 mb-6">
          <div className="w-9 h-9 bg-gradient-to-tr from-orange-600 to-orange-400 rounded-xl flex items-center justify-center text-white text-xs font-black shadow-lg shadow-orange-500/30 hover:scale-110 transition-transform">
            SL
          </div>
          <span className="text-xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-stone-900 to-stone-600 dark:from-white dark:to-stone-400">
            Smart Leads
          </span>
        </div>

        <h1 className="text-[1.65rem] font-extrabold text-center tracking-tight text-stone-900 dark:text-stone-100 mb-1 leading-tight">
          Create an account
        </h1>
        <p className="text-[0.9rem] text-center text-stone-500 dark:text-stone-400 mb-7">
          Join your team to manage leads
        </p>

        {error && (
          <div
            id="register-error"
            className="mb-5 px-4 py-3 rounded-xl bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400 text-sm font-semibold border border-rose-200 dark:border-rose-800/50"
          >
            {error}
          </div>
        )}

        <form id="register-form" onSubmit={handleSubmit} className="flex flex-col gap-4">

          {/* Full Name */}
          <div>
            <label htmlFor="reg-name" className={labelCls}>Full Name</label>
            <input
              id="reg-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Rahul Sharma"
              required
              className={inputCls}
            />
            {validationErrors.name && (
              <p className="mt-1 text-xs text-rose-500 font-medium">{validationErrors.name}</p>
            )}
          </div>

          {/* Email */}
          <div>
            <label htmlFor="reg-email" className={labelCls}>Email Address</label>
            <input
              id="reg-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@company.com"
              required
              className={inputCls}
            />
            {validationErrors.email && (
              <p className="mt-1 text-xs text-rose-500 font-medium">{validationErrors.email}</p>
            )}
          </div>

          {/* Password */}
          <div>
            <label htmlFor="reg-password" className={labelCls}>Password</label>
            <input
              id="reg-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              minLength={6}
              className={inputCls}
            />
            {validationErrors.password && (
              <p className="mt-1 text-xs text-rose-500 font-medium">{validationErrors.password}</p>
            )}
          </div>

          {/* Role */}
          <div>
            <label htmlFor="reg-role" className={labelCls}>Role</label>
            <div className="relative">
              <select
                id="reg-role"
                value={role}
                onChange={(e) => setRole(e.target.value as UserRole)}
                className={`${inputCls} appearance-none cursor-pointer`}
              >
                <option value={UserRole.Sales}>Sales Representative</option>
                <option value={UserRole.Admin}>Administrator</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-stone-400">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                  <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                </svg>
              </div>
            </div>
          </div>

          <button
            id="register-submit-btn"
            type="submit"
            disabled={isLoading}
            className="mt-3 w-full inline-flex items-center justify-center gap-2 px-4 py-3.5 rounded-xl bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-500 hover:to-orange-400 text-white text-[1rem] font-bold shadow-lg shadow-orange-500/30 hover:shadow-orange-500/50 hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading
              ? <><span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin inline-block" /> Creating account…</>
              : 'Create account'}
          </button>
        </form>

        <p className="mt-7 text-center text-[0.9rem] text-stone-500 dark:text-stone-400 font-medium">
          Already have an account?{' '}
          <Link
            to="/login"
            className="text-orange-600 dark:text-orange-400 font-bold hover:text-orange-700 dark:hover:text-orange-300 transition-colors"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
