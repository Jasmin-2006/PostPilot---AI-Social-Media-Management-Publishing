import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Sparkles, ArrowRight, User as UserIcon, Lock, Mail, CheckCircle2 } from 'lucide-react';

export const AuthModal: React.FC = () => {
  const { isLoggedIn, login, signup, users, switchUser } = useApp();
  const [mode, setMode] = useState<'login' | 'signup'>('login');

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  if (isLoggedIn) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (mode === 'signup') {
      if (!name.trim() || !email.trim() || !password.trim()) {
        setError('Please fill in all fields.');
        return;
      }
      signup(name, email, password);
    } else {
      if (!email.trim() || !password.trim()) {
        setError('Please enter email and password.');
        return;
      }
      login(email, password);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/80 backdrop-blur-md animate-in fade-in duration-300">
      <div className="bg-white rounded-3xl max-w-md w-full border border-stone-200 shadow-2xl overflow-hidden">
        {/* Brand Banner */}
        <div className="p-8 text-center bg-gradient-to-b from-stone-900 to-stone-950 text-white space-y-2 border-b border-stone-800">
          <div className="w-12 h-12 rounded-xl bg-amber-500 text-stone-950 flex items-center justify-center font-serif font-bold text-2xl mx-auto shadow-md">
            P
          </div>
          <h2 className="font-serif text-2xl font-bold tracking-tight text-white pt-1">
            PostPilot
          </h2>
          <p className="text-xs text-stone-300">
            Create once. AI adapts it. Publish everywhere.
          </p>
        </div>

        {/* Tab switch */}
        <div className="grid grid-cols-2 border-b border-stone-200 bg-stone-50 text-xs font-semibold">
          <button
            onClick={() => {
              setMode('login');
              setError('');
            }}
            className={`py-3 text-center transition-colors ${
              mode === 'login'
                ? 'bg-white text-stone-900 border-b-2 border-stone-900 font-bold'
                : 'text-stone-500 hover:text-stone-800'
            }`}
          >
            Log In
          </button>
          <button
            onClick={() => {
              setMode('signup');
              setError('');
            }}
            className={`py-3 text-center transition-colors ${
              mode === 'signup'
                ? 'bg-white text-stone-900 border-b-2 border-stone-900 font-bold'
                : 'text-stone-500 hover:text-stone-800'
            }`}
          >
            Create Account
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs">
              {error}
            </div>
          )}

          {mode === 'signup' && (
            <div>
              <label className="text-xs font-semibold text-stone-700 block mb-1">
                Full Name
              </label>
              <div className="relative">
                <UserIcon className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Alex Rivera"
                  className="w-full text-xs pl-9 pr-3 py-2.5 rounded-lg border border-stone-300 focus:outline-none focus:ring-1 focus:ring-stone-900"
                />
              </div>
            </div>
          )}

          <div>
            <label className="text-xs font-semibold text-stone-700 block mb-1">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@company.com"
                className="w-full text-xs pl-9 pr-3 py-2.5 rounded-lg border border-stone-300 focus:outline-none focus:ring-1 focus:ring-stone-900"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-stone-700 block mb-1">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full text-xs pl-9 pr-3 py-2.5 rounded-lg border border-stone-300 focus:outline-none focus:ring-1 focus:ring-stone-900"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-2.5 px-4 bg-stone-900 hover:bg-stone-800 text-white text-xs font-bold rounded-xl shadow-md transition-all flex items-center justify-center gap-2 mt-2"
          >
            <span>{mode === 'signup' ? 'Start Free Workspace' : 'Sign In to PostPilot'}</span>
            <ArrowRight className="w-3.5 h-3.5 text-amber-400" />
          </button>
        </form>

        {/* Demo Fast Login Switcher */}
        <div className="px-6 py-4 bg-stone-50 border-t border-stone-200 space-y-2">
          <p className="text-[11px] font-semibold text-stone-600 uppercase tracking-wider text-center">
            Or quick sign-in as demo creator:
          </p>

          <div className="grid grid-cols-2 gap-2">
            {users.map((u) => (
              <button
                key={u.id}
                type="button"
                onClick={() => switchUser(u.id)}
                className="p-2 rounded-lg bg-white border border-stone-200 hover:border-amber-400 text-left flex items-center gap-2 text-xs transition-colors shadow-2xs"
              >
                <img
                  src={u.avatarUrl}
                  alt={u.name}
                  className="w-6 h-6 rounded-full object-cover border border-stone-200"
                />
                <span className="font-semibold text-stone-900 truncate">
                  {u.name.split(' ')[0]}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
