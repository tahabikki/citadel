'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Building2, Mail, Lock, ArrowRight } from 'lucide-react';
import { ScrollReveal } from '@/components/ScrollReveal';

export default function LoginPage() {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          action: isLogin ? 'login' : 'register',
          email,
          password,
          firstName,
          lastName
        })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error);
      }

      if (data.user.role === 'ADMIN' || data.user.role === 'STAFF') {
        router.push('/admin');
      } else {
        router.push('/');
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--background)] hero-gradient p-4">
      <div className="w-full max-w-md">
        <ScrollReveal animation="fade-right">
          <div className="bg-[var(--card)] rounded-[var(--radius-xl)] shadow-[var(--shadow-xl)] border border-[var(--border-light)] p-8">
          <div className="flex items-center justify-center gap-3 mb-8">
            <Building2 className="w-10 h-10 text-[var(--primary)]" />
            <div>
              <h1 className="font-display text-2xl font-bold">Citadel Hôtel</h1>
              <p className="text-xs text-[var(--secondary)]">Property Management System</p>
            </div>
          </div>

          <h2 className="text-xl font-semibold text-center mb-6">
            {isLogin ? 'Welcome back' : 'Create account'}
          </h2>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-[var(--radius-md)] mb-4 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">First Name</label>
                  <input
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="w-full px-4 py-3 bg-[var(--background)] border border-[var(--border-light)] rounded-[var(--radius-md)] focus:outline-none focus:border-[var(--primary)]"
                    required={!isLogin}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Last Name</label>
                  <input
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="w-full px-4 py-3 bg-[var(--background)] border border-[var(--border-light)] rounded-[var(--radius-md)] focus:outline-none focus:border-[var(--primary)]"
                    required={!isLogin}
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--secondary)]" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-[var(--background)] border border-[var(--border-light)] rounded-[var(--radius-md)] focus:outline-none focus:border-[var(--primary)]"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--secondary)]" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-[var(--background)] border border-[var(--border-light)] rounded-[var(--radius-md)] focus:outline-none focus:border-[var(--primary)]"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary py-3 flex items-center justify-center gap-2"
            >
              {loading ? 'Please wait...' : isLogin ? 'Sign In' : 'Create Account'}
              <ArrowRight className="w-5 h-5" />
            </button>
          </form>

          <p className="text-center text-sm text-[var(--secondary)] mt-6">
            {isLogin ? "Don't have an account?" : 'Already have an account?'}{' '}
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="text-[var(--primary)] hover:underline"
            >
              {isLogin ? 'Sign up' : 'Sign in'}
            </button>
          </p>
          </div>
        </ScrollReveal>

        <ScrollReveal animation="fade-left" delay={120}>
          <p className="text-center text-sm text-[var(--secondary)] mt-6">
            <Link href="/" className="hover:text-[var(--foreground)]">← Back to hotel website</Link>
          </p>
        </ScrollReveal>
      </div>
    </div>
  );
}
