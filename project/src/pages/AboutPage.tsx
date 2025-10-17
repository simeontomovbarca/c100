import { useEffect } from 'react';
import { Target, Heart, Sparkles } from 'lucide-react';
import { SEOHead } from '../components/SEOHead';
import { analytics } from '../lib/analytics';

export function AboutPage() {
  useEffect(() => {
    analytics.trackPageView('/about');
  }, []);

  return (
    <>
      <SEOHead
        title="About Club 100 – Why Only 100 Pieces"
        description="Learn the story behind Club 100 and why we believe in limiting every collection to exactly 100 pieces. Quality, exclusivity, and community over mass production."
      />

      <div className="bg-zinc-950 min-h-screen">
        <section className="py-20 bg-gradient-to-b from-zinc-900 to-zinc-950">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-5xl md:text-6xl font-bold text-zinc-100 mb-6 text-center">
              Why Only
              <br />
              <span className="bg-gradient-to-r from-amber-400 to-amber-600 bg-clip-text text-transparent">
                100 Pieces?
              </span>
            </h1>
            <p className="text-xl text-zinc-400 text-center max-w-2xl mx-auto leading-relaxed">
              In a world of endless options and mass production, we chose a different path.
            </p>
          </div>
        </section>

        <section className="py-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="prose prose-invert max-w-none">
              <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8 md:p-12 mb-12">
                <h2 className="text-3xl font-bold text-zinc-100 mb-6">Our Story</h2>
                <div className="space-y-4 text-zinc-400 leading-relaxed">
                  <p>
                    Club 100 was born from a simple question: What if clothing could be more than just fashion?
                    What if every piece told a story, carried meaning, and connected you to a community of like-minded individuals?
                  </p>
                  <p>
                    We rejected the fast-fashion model of endless inventory and disposable trends. Instead,
                    we embraced constraints. By limiting each collection to exactly 100 numbered pieces,
                    we create something rare, valuable, and impossible to replicate.
                  </p>
                  <p>
                    Every T-shirt is crafted from premium heavyweight organic cotton with meticulous attention
                    to detail. From the embossed prints to the luxury packaging, nothing is mass-produced.
                    When you own a piece from Club 100, you're not just wearing clothing—you're part of an exclusive community.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8 text-center">
                  <div className="w-12 h-12 bg-amber-500/10 border border-amber-500/20 rounded-xl flex items-center justify-center mx-auto mb-6">
                    <Target className="w-6 h-6 text-amber-500" />
                  </div>
                  <h3 className="text-xl font-bold text-zinc-100 mb-3">Our Mission</h3>
                  <p className="text-zinc-400 text-sm leading-relaxed">
                    To create limited-edition pieces that celebrate individuality, craftsmanship, and the power of scarcity.
                  </p>
                </div>

                <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8 text-center">
                  <div className="w-12 h-12 bg-amber-500/10 border border-amber-500/20 rounded-xl flex items-center justify-center mx-auto mb-6">
                    <Heart className="w-6 h-6 text-amber-500" />
                  </div>
                  <h3 className="text-xl font-bold text-zinc-100 mb-3">Our Values</h3>
                  <p className="text-zinc-400 text-sm leading-relaxed">
                    Quality over quantity. Authenticity over trends. Community over consumption.
                  </p>
                </div>

                <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8 text-center">
                  <div className="w-12 h-12 bg-amber-500/10 border border-amber-500/20 rounded-xl flex items-center justify-center mx-auto mb-6">
                    <Sparkles className="w-6 h-6 text-amber-500" />
                  </div>
                  <h3 className="text-xl font-bold text-zinc-100 mb-3">Our Promise</h3>
                  <p className="text-zinc-400 text-sm leading-relaxed">
                    Every collection is limited to 100 pieces. Once sold out, archived forever. No reprints, ever.
                  </p>
                </div>
              </div>

              <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8 md:p-12">
                <h2 className="text-3xl font-bold text-zinc-100 mb-6">The Process</h2>
                <div className="space-y-6 text-zinc-400">
                  <div>
                    <h4 className="text-zinc-100 font-semibold mb-2">1. Design</h4>
                    <p>
                      Each collection starts with a concept. We spend months perfecting every detail—from
                      the fabric weight to the exact placement of prints. Nothing is rushed.
                    </p>
                  </div>
                  <div>
                    <h4 className="text-zinc-100 font-semibold mb-2">2. Production</h4>
                    <p>
                      We partner with ethical European manufacturers who share our commitment to quality.
                      Only premium materials make the cut: heavyweight organic cotton, precision embroidery,
                      and durable finishes.
                    </p>
                  </div>
                  <div>
                    <h4 className="text-zinc-100 font-semibold mb-2">3. Numbering</h4>
                    <p>
                      Each piece is individually numbered from 1 to 100. Your serial number is printed on
                      the label and included in your certificate of authenticity.
                    </p>
                  </div>
                  <div>
                    <h4 className="text-zinc-100 font-semibold mb-2">4. Packaging</h4>
                    <p>
                      Every T-shirt arrives in a luxury box with your certificate, a hologram for verification,
                      and a QR code linking to the digital archive of your collection.
                    </p>
                  </div>
                  <div>
                    <h4 className="text-zinc-100 font-semibold mb-2">5. Archive</h4>
                    <p>
                      When all 100 pieces sell out, the collection is permanently archived. It becomes part
                      of Club 100 history, never to be reproduced.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-20 bg-gradient-to-b from-zinc-950 to-zinc-900">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-zinc-100 mb-6">
              Join the Movement
            </h2>
            <p className="text-xl text-zinc-400 mb-8 max-w-2xl mx-auto leading-relaxed">
              Own a piece of history. Be part of something exclusive. Join Club 100.
            </p>
          </div>
        </section>
      </div>
    </>
  );
}
