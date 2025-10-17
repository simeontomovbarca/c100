import { useEffect, useState } from 'react';
import { ArrowRight, Package, Shield, Clock, Users } from 'lucide-react';
import { Link } from '../lib/router';
import { supabase, Collection } from '../lib/supabase';
import { CountdownTimer } from '../components/CountdownTimer';
import { StockIndicator } from '../components/StockIndicator';
import { NewsletterForm } from '../components/NewsletterForm';
import { SEOHead } from '../components/SEOHead';
import { analytics } from '../lib/analytics';

export function HomePage() {
  const [collection, setCollection] = useState<Collection | null>(null);

  useEffect(() => {
    analytics.trackPageView('/');
    loadCollection();
  }, []);

  const loadCollection = async () => {
    const { data } = await supabase
      .from('collections')
      .select('*')
      .eq('slug', 'collection-1-genesis')
      .maybeSingle();

    if (data) setCollection(data);
  };

  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Club 100',
    url: window.location.origin,
    description: 'Limited edition T-shirts. 100 pieces per drop. Never reprinted.',
  };

  return (
    <>
      <SEOHead
        title="Club 100 – Limited Edition T-Shirts | Only 100 Pieces"
        description="Exclusive limited-edition T-shirts with only 100 pieces per collection. Premium quality, numbered certificates, and lifetime exclusivity. Join Club 100 today."
        structuredData={structuredData}
      />

      <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-b from-zinc-950 via-zinc-900 to-zinc-950">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-zinc-800/20 via-zinc-900/50 to-zinc-950"></div>

        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          <div className="inline-flex items-center space-x-2 px-4 py-2 bg-zinc-900/50 border border-zinc-700 rounded-full mb-8">
            <div className="w-2 h-2 bg-amber-500 rounded-full animate-pulse"></div>
            <span className="text-zinc-300 text-sm font-medium">Limited Drop Active</span>
          </div>

          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold text-zinc-100 mb-6 tracking-tight">
            100 T-Shirts.
            <br />
            <span className="bg-gradient-to-r from-amber-400 to-amber-600 bg-clip-text text-transparent">
              Never Again.
            </span>
          </h1>

          <p className="text-xl md:text-2xl text-zinc-400 mb-12 max-w-2xl mx-auto leading-relaxed">
            THE ORIGIN – 001 Collection | Choose Your № (1-100) | 89.90 BGN
          </p>

          {collection && (
            <div className="mb-12">
              <CountdownTimer
                targetDate={collection.drop_date_time}
                onComplete={() => analytics.trackDropOpen(collection.name)}
              />
            </div>
          )}

          {collection && (
            <div className="mb-12">
              <StockIndicator remaining={collection.remaining_stock} total={collection.total_stock} />
            </div>
          )}

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <Link
              to="/shop/collection-1-genesis"
              className="group px-8 py-4 bg-amber-500 hover:bg-amber-600 text-zinc-950 font-bold rounded-xl transition-all flex items-center space-x-2 text-lg"
            >
              <span>Get Yours Before They're Gone</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              to="/club-100"
              className="px-8 py-4 bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-zinc-100 font-bold rounded-xl transition-all text-lg"
            >
              Join Club 100
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16">
            <div className="flex flex-col items-center space-y-3">
              <div className="w-12 h-12 bg-zinc-900 border border-zinc-700 rounded-xl flex items-center justify-center">
                <Package className="w-6 h-6 text-amber-500" />
              </div>
              <div className="text-center">
                <div className="text-zinc-100 font-semibold text-sm">Limited</div>
                <div className="text-zinc-500 text-xs">Only 100 pieces</div>
              </div>
            </div>

            <div className="flex flex-col items-center space-y-3">
              <div className="w-12 h-12 bg-zinc-900 border border-zinc-700 rounded-xl flex items-center justify-center">
                <Shield className="w-6 h-6 text-amber-500" />
              </div>
              <div className="text-center">
                <div className="text-zinc-100 font-semibold text-sm">Certified</div>
                <div className="text-zinc-500 text-xs">Serial № X/100</div>
              </div>
            </div>

            <div className="flex flex-col items-center space-y-3">
              <div className="w-12 h-12 bg-zinc-900 border border-zinc-700 rounded-xl flex items-center justify-center">
                <Clock className="w-6 h-6 text-amber-500" />
              </div>
              <div className="text-center">
                <div className="text-zinc-100 font-semibold text-sm">Fast Delivery</div>
                <div className="text-zinc-500 text-xs">Within 24h</div>
              </div>
            </div>

            <div className="flex flex-col items-center space-y-3">
              <div className="w-12 h-12 bg-zinc-900 border border-zinc-700 rounded-xl flex items-center justify-center">
                <Users className="w-6 h-6 text-amber-500" />
              </div>
              <div className="text-center">
                <div className="text-zinc-100 font-semibold text-sm">Exclusive</div>
                <div className="text-zinc-500 text-xs">Never reprinted</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-zinc-950 py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-5xl font-bold text-zinc-100 mb-6">
            This is not a T-shirt.
            <br />
            <span className="text-zinc-500">It's a ticket to Club 100.</span>
          </h2>
          <p className="text-lg text-zinc-400 mb-12 leading-relaxed max-w-2xl mx-auto">
            Every piece is crafted from heavyweight 280 GSM organic cotton with an oversized fit.
            Each drop is limited to exactly 100 numbered pieces with embossed prints,
            luxury packaging, and a certificate of authenticity. Choose your unique number from 1 to 100.
            When they're gone, they're gone forever.
          </p>
          <Link
            to="/about"
            className="inline-flex items-center text-amber-500 hover:text-amber-400 font-semibold transition-colors"
          >
            Learn our story <ArrowRight className="w-4 h-4 ml-2" />
          </Link>
        </div>
      </section>

      <section className="bg-gradient-to-b from-zinc-950 to-zinc-900 py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-zinc-100 mb-6">
            Stay Updated on New Drops
          </h2>
          <p className="text-zinc-400 mb-8">
            Be the first to know when new collections launch. No spam, just exclusive updates.
          </p>
          <div className="flex justify-center">
            <NewsletterForm source="homepage" />
          </div>
        </div>
      </section>
    </>
  );
}
