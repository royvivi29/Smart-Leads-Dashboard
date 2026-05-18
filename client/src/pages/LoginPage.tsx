import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { authApi, getErrorMessage } from '../services/api';
import type { User } from '../types';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      const res = await authApi.login({ email, password });
      const { user, token } = res.data.data as { user: User; token: string };
      login(token, user);
      navigate('/');
    } catch (err) {
      setError(getErrorMessage(err));
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
      <div className="absolute -top-32 -left-32 w-[480px] h-[480px] bg-orange-500/20 dark:bg-orange-600/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-[480px] h-[480px] bg-orange-500/20 dark:bg-orange-600/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Card — padding comes from .auth-card in index.css */}
      <div className="auth-card">

        {/* Logo */}
        <div className="flex justify-center items-center gap-3 mb-8">
          <div className="w-10 h-10 bg-gradient-to-tr from-orange-600 to-orange-400 rounded-xl flex items-center justify-center text-white text-sm font-black shadow-lg shadow-orange-500/30 hover:scale-110 transition-transform">
            SL
          </div>
          <span className="text-2xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-stone-900 to-stone-600 dark:from-white dark:to-stone-400">
            Smart Leads
          </span>
        </div>

        {/* Heading */}
        <h1 className="text-[1.85rem] font-extrabold text-center tracking-tight text-stone-900 dark:text-stone-100 mb-2 leading-tight">
          Welcome back
        </h1>
        <p className="text-[0.95rem] text-center text-stone-500 dark:text-stone-400 mb-8">
          Sign in to your account to continue
        </p>

        {/* Error */}
        {error && (
          <div
            id="login-error"
            className="mb-5 px-4 py-3 rounded-xl bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400 text-sm font-semibold border border-rose-200 dark:border-rose-800/50"
          >
            {error}
          </div>
        )}

        {/* Form */}
        <form id="login-form" onSubmit={handleSubmit} className="flex flex-col gap-5">

          <div>
            <label htmlFor="login-email" className={labelCls}>Email Address</label>
            <input
              id="login-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@company.com"
              required
              autoFocus
              className={inputCls}
            />
          </div>

          <div>
            <label htmlFor="login-password" className={labelCls}>Password</label>
            <input
              id="login-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              className={inputCls}
            />
          </div>

          <button
            id="login-submit-btn"
            type="submit"
            disabled={isLoading}
            className="mt-2 w-full inline-flex items-center justify-center gap-2 px-4 py-3.5 rounded-xl bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-500 hover:to-orange-400 text-white text-[1rem] font-bold shadow-lg shadow-orange-500/30 hover:shadow-orange-500/50 hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading
              ? <><span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin inline-block" /> Signing in…</>
              : 'Sign in'}
          </button>
        </form>

        {/* Footer */}
        <p className="mt-8 text-center text-[0.9rem] text-stone-500 dark:text-stone-400 font-medium">
          Don&apos;t have an account?{' '}
          <Link
            to="/register"
            className="text-orange-600 dark:text-orange-400 font-bold hover:text-orange-700 dark:hover:text-orange-300 transition-colors"
          >
            Create one
          </Link>
        </p>
      </div>
    </div>
  );
}
