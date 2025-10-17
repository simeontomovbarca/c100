import { useState, FormEvent, useEffect } from 'react';
import { Crown, Zap, Gift, Calendar, Check } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { SEOHead } from '../components/SEOHead';
import { analytics } from '../lib/analytics';

export function Club100Page() {
  const [formData, setFormData] = useState({ name: '', email: '' });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  useEffect(() => {
    analytics.trackPageView('/club-100');
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setStatus('loading');

    try {
      const { error } = await supabase
        .from('club_members')
        .insert([{
          name: formData.name,
          email: formData.email,
          is_early_access: true
        }]);

      if (error) {
        if (error.code === '23505') {
          setMessage('You are already a Club 100 member!');
          setStatus('success');
        } else {
          throw error;
        }
      } else {
        setMessage('Welcome to Club 100! Check your email for exclusive perks.');
        setStatus('success');
        setFormData({ name: '', email: '' });
        analytics.trackJoinClub(formData.email);
      }
    } catch (error) {
      console.error('Club signup error:', error);
      setMessage('Something went wrong. Please try again.');
      setStatus('error');
    }

    setTimeout(() => {
      if (status !== 'success') {
        setStatus('idle');
        setMessage('');
      }
    }, 5000);
  };

  const benefits = [
    {
      icon: Zap,
      title: 'Early Access',
      description: '48 hours before public drop. Get first pick on new collections.',
    },
    {
      icon: Crown,
      title: 'Exclusive Perks',
      description: 'Member-only collections, special pricing, and surprise drops.',
    },
    {
      icon: Gift,
      title: 'Priority Support',
      description: 'Dedicated support line and guaranteed replacements.',
    },
    {
      icon: Calendar,
      title: 'Private Events',
      description: 'Invitations to exclusive launches, meetups, and community events.',
    },
  ];

  return (
    <>
      <SEOHead
        title="Club 100 – Exclusive Membership | Early Access to Limited Drops"
        description="Join Club 100 for early access to limited-edition drops, exclusive perks, priority support, and invitations to private events. Membership is earned through purchases or invitation."
      />

      <div className="bg-zinc-950 min-h-screen">
        <section className="relative py-20 bg-gradient-to-b from-zinc-900 to-zinc-950">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-amber-500/5 via-transparent to-transparent"></div>

          <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="inline-flex items-center space-x-2 px-4 py-2 bg-zinc-900/50 border border-zinc-700 rounded-full mb-8">
              <Crown className="w-4 h-4 text-amber-500" />
              <span className="text-zinc-300 text-sm font-medium">Exclusive Membership</span>
            </div>

            <h1 className="text-5xl md:text-6xl font-bold text-zinc-100 mb-6">
              Welcome to
              <br />
              <span className="bg-gradient-to-r from-amber-400 to-amber-600 bg-clip-text text-transparent">
                Club 100
              </span>
            </h1>

            <p className="text-xl text-zinc-400 mb-12 max-w-2xl mx-auto leading-relaxed">
              An exclusive community of collectors who understand that true value comes from scarcity,
              authenticity, and belonging to something rare.
            </p>
          </div>
        </section>

        <section className="py-20">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl md:text-4xl font-bold text-zinc-100 text-center mb-12">
              Member Benefits
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {benefits.map((benefit) => (
                <div
                  key={benefit.title}
                  className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8 hover:border-amber-500/30 transition-colors"
                >
                  <div className="w-12 h-12 bg-amber-500/10 border border-amber-500/20 rounded-xl flex items-center justify-center mb-6">
                    <benefit.icon className="w-6 h-6 text-amber-500" />
                  </div>
                  <h3 className="text-xl font-bold text-zinc-100 mb-3">{benefit.title}</h3>
                  <p className="text-zinc-400 leading-relaxed">{benefit.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-20 bg-gradient-to-b from-zinc-950 to-zinc-900">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-zinc-100 mb-4">
                How to Join
              </h2>
              <p className="text-zinc-400">
                Membership is earned through purchases or special invitation only.
              </p>
            </div>

            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8 md:p-12 mb-12">
              <div className="space-y-6 mb-8">
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-amber-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <Check className="w-5 h-5 text-zinc-950" />
                  </div>
                  <div>
                    <h4 className="text-zinc-100 font-semibold mb-1">Purchase a Limited Drop</h4>
                    <p className="text-zinc-400 text-sm">
                      Automatic membership with your first Club 100 purchase
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-amber-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <Check className="w-5 h-5 text-zinc-950" />
                  </div>
                  <div>
                    <h4 className="text-zinc-100 font-semibold mb-1">Apply for Early Access</h4>
                    <p className="text-zinc-400 text-sm">
                      Fill out the form below to be considered for membership
                    </p>
                  </div>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-zinc-300 font-medium mb-2 text-sm">
                    Full Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    disabled={status === 'loading' || status === 'success'}
                    className="w-full px-4 py-3 bg-zinc-950 border border-zinc-700 rounded-xl text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all disabled:opacity-50"
                    placeholder="Enter your name"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-zinc-300 font-medium mb-2 text-sm">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                    disabled={status === 'loading' || status === 'success'}
                    className="w-full px-4 py-3 bg-zinc-950 border border-zinc-700 rounded-xl text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all disabled:opacity-50"
                    placeholder="Enter your email"
                  />
                </div>

                <button
                  type="submit"
                  disabled={status === 'loading' || status === 'success'}
                  className="w-full px-8 py-4 bg-amber-500 hover:bg-amber-600 text-zinc-950 font-bold rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {status === 'loading' ? 'Submitting...' : status === 'success' ? 'Applied!' : 'Apply for Membership'}
                </button>

                {message && (
                  <p className={`text-center text-sm ${status === 'success' ? 'text-emerald-400' : 'text-red-400'}`}>
                    {message}
                  </p>
                )}
              </form>
            </div>

            <div className="text-center text-zinc-500 text-sm">
              By applying, you agree to receive exclusive updates and early access notifications from Club 100.
            </div>
          </div>
        </section>

        <section className="py-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-zinc-100 mb-6">
              The Rules
            </h2>
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8 text-left space-y-4">
              <p className="text-zinc-400">
                <span className="text-zinc-100 font-semibold">1.</span> Each collection is limited to exactly 100 numbered pieces.
              </p>
              <p className="text-zinc-400">
                <span className="text-zinc-100 font-semibold">2.</span> Once a collection sells out, it's archived forever. No reprints.
              </p>
              <p className="text-zinc-400">
                <span className="text-zinc-100 font-semibold">3.</span> Every piece includes a serial number and certificate of authenticity.
              </p>
              <p className="text-zinc-400">
                <span className="text-zinc-100 font-semibold">4.</span> Members get 48-hour early access before public drops.
              </p>
              <p className="text-zinc-400">
                <span className="text-zinc-100 font-semibold">5.</span> Quality over quantity. We drop when ready, not on schedule.
              </p>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
