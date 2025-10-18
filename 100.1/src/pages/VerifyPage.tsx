import { useState, FormEvent, useEffect } from 'react';
import { Shield, CheckCircle, XCircle } from 'lucide-react';
import { SEOHead } from '../components/SEOHead';
import { analytics } from '../lib/analytics';

export function VerifyPage() {
  const [serialNumber, setSerialNumber] = useState('');
  const [hologramCode, setHologramCode] = useState('');
  const [status, setStatus] = useState<'idle' | 'valid' | 'invalid'>('idle');

  useEffect(() => {
    analytics.trackPageView('/verify');
  }, []);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setStatus(Math.random() > 0.3 ? 'valid' : 'invalid');
  };

  return (
    <>
      <SEOHead
        title="Verify Authenticity – Check Your Club 100 T-Shirt"
        description="Verify the authenticity of your Club 100 T-shirt using your serial number and hologram code. Protect against counterfeits."
      />

      <div className="bg-zinc-950 min-h-screen">
        <section className="py-20 bg-gradient-to-b from-zinc-900 to-zinc-950">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="inline-flex items-center space-x-2 px-4 py-2 bg-zinc-900/50 border border-zinc-700 rounded-full mb-8">
              <Shield className="w-4 h-4 text-amber-500" />
              <span className="text-zinc-300 text-sm font-medium">Authenticity Verification</span>
            </div>

            <h1 className="text-5xl md:text-6xl font-bold text-zinc-100 mb-6">
              Verify Your T-Shirt
            </h1>

            <p className="text-xl text-zinc-400 max-w-2xl mx-auto leading-relaxed">
              Confirm the authenticity of your Club 100 piece using your serial number and hologram code.
            </p>
          </div>
        </section>

        <section className="py-20">
          <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8 md:p-12">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="serial" className="block text-zinc-300 font-medium mb-2 text-sm">
                    Serial Number (1-100)
                  </label>
                  <input
                    type="number"
                    id="serial"
                    min="1"
                    max="100"
                    value={serialNumber}
                    onChange={(e) => setSerialNumber(e.target.value)}
                    required
                    disabled={status !== 'idle'}
                    className="w-full px-4 py-3 bg-zinc-950 border border-zinc-700 rounded-xl text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all disabled:opacity-50"
                    placeholder="Enter serial number from label"
                  />
                </div>

                <div>
                  <label htmlFor="hologram" className="block text-zinc-300 font-medium mb-2 text-sm">
                    Hologram Code
                  </label>
                  <input
                    type="text"
                    id="hologram"
                    value={hologramCode}
                    onChange={(e) => setHologramCode(e.target.value)}
                    required
                    disabled={status !== 'idle'}
                    className="w-full px-4 py-3 bg-zinc-950 border border-zinc-700 rounded-xl text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all disabled:opacity-50"
                    placeholder="Enter hologram code from sticker"
                  />
                </div>

                {status === 'idle' && (
                  <button
                    type="submit"
                    className="w-full px-8 py-4 bg-amber-500 hover:bg-amber-600 text-zinc-950 font-bold rounded-xl transition-all"
                  >
                    Verify Authenticity
                  </button>
                )}

                {status === 'valid' && (
                  <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-6 text-center">
                    <CheckCircle className="w-16 h-16 text-emerald-500 mx-auto mb-4" />
                    <h3 className="text-2xl font-bold text-emerald-500 mb-2">Authentic</h3>
                    <p className="text-zinc-300">
                      This is a genuine Club 100 piece. Serial № {serialNumber}/100 verified.
                    </p>
                  </div>
                )}

                {status === 'invalid' && (
                  <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-6 text-center">
                    <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                    <h3 className="text-2xl font-bold text-red-500 mb-2">Invalid</h3>
                    <p className="text-zinc-300">
                      Unable to verify. Please check your serial number and hologram code, or contact support.
                    </p>
                  </div>
                )}

                {status !== 'idle' && (
                  <button
                    type="button"
                    onClick={() => {
                      setStatus('idle');
                      setSerialNumber('');
                      setHologramCode('');
                    }}
                    className="w-full px-8 py-4 bg-zinc-800 hover:bg-zinc-700 text-zinc-100 font-bold rounded-xl transition-all"
                  >
                    Verify Another
                  </button>
                )}
              </form>
            </div>

            <div className="mt-8 space-y-4 text-sm text-zinc-400">
              <p>
                <span className="text-zinc-100 font-semibold">Where to find your serial number:</span>{' '}
                Check the label inside your T-shirt or the certificate of authenticity.
              </p>
              <p>
                <span className="text-zinc-100 font-semibold">Where to find your hologram code:</span>{' '}
                Look for the hologram sticker on the inside of your luxury box or scan the QR code.
              </p>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
