import { useEffect } from 'react';
import { Archive, Calendar } from 'lucide-react';
import { SEOHead } from '../components/SEOHead';
import { analytics } from '../lib/analytics';

export function ArchivePage() {
  useEffect(() => {
    analytics.trackPageView('/archive');
  }, []);

  return (
    <>
      <SEOHead
        title="Archive – Past Sold-Out Collections | Club 100"
        description="Browse the complete archive of sold-out Club 100 collections. Each drop is limited to 100 pieces and never reprinted once archived."
      />

      <div className="bg-zinc-950 min-h-screen">
        <section className="py-20 bg-gradient-to-b from-zinc-900 to-zinc-950">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="inline-flex items-center space-x-2 px-4 py-2 bg-zinc-900/50 border border-zinc-700 rounded-full mb-8">
              <Archive className="w-4 h-4 text-amber-500" />
              <span className="text-zinc-300 text-sm font-medium">Sold Out Collections</span>
            </div>

            <h1 className="text-5xl md:text-6xl font-bold text-zinc-100 mb-6">
              The Archive
            </h1>

            <p className="text-xl text-zinc-400 max-w-2xl mx-auto leading-relaxed">
              A permanent record of every Club 100 collection. Once archived, never reproduced.
            </p>
          </div>
        </section>

        <section className="py-20">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="w-24 h-24 bg-zinc-900 border border-zinc-800 rounded-2xl flex items-center justify-center mb-6">
                <Calendar className="w-12 h-12 text-zinc-600" />
              </div>
              <h2 className="text-2xl font-bold text-zinc-100 mb-3">Coming Soon</h2>
              <p className="text-zinc-400 max-w-md">
                Collection 1 is still available. Check back here once it sells out to see
                the archived collection with photos and owner testimonials.
              </p>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
