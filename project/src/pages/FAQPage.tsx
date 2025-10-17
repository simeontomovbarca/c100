import { useEffect, useState } from 'react';
import { HelpCircle } from 'lucide-react';
import { supabase, FAQItem } from '../lib/supabase';
import { SEOHead } from '../components/SEOHead';
import { analytics } from '../lib/analytics';

export function FAQPage() {
  const [faqs, setFaqs] = useState<FAQItem[]>([]);

  useEffect(() => {
    analytics.trackPageView('/faq');
    loadFAQs();
  }, []);

  const loadFAQs = async () => {
    const { data } = await supabase
      .from('faq_items')
      .select('*')
      .order('display_order');

    if (data) setFaqs(data);
  };

  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };

  return (
    <>
      <SEOHead
        title="FAQ – Frequently Asked Questions | Club 100"
        description="Find answers to common questions about Club 100 limited-edition T-shirts, shipping, returns, authenticity verification, and membership."
        structuredData={structuredData}
      />

      <div className="bg-zinc-950 min-h-screen">
        <section className="py-20 bg-gradient-to-b from-zinc-900 to-zinc-950">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="inline-flex items-center space-x-2 px-4 py-2 bg-zinc-900/50 border border-zinc-700 rounded-full mb-8">
              <HelpCircle className="w-4 h-4 text-amber-500" />
              <span className="text-zinc-300 text-sm font-medium">Help Center</span>
            </div>

            <h1 className="text-5xl md:text-6xl font-bold text-zinc-100 mb-6">
              Frequently Asked Questions
            </h1>

            <p className="text-xl text-zinc-400 max-w-2xl mx-auto leading-relaxed">
              Everything you need to know about Club 100.
            </p>
          </div>
        </section>

        <section className="py-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            {faqs.length > 0 ? (
              <div className="space-y-4">
                {faqs.map((faq) => (
                  <details
                    key={faq.id}
                    className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 group hover:border-zinc-700 transition-colors"
                  >
                    <summary className="font-semibold text-zinc-100 cursor-pointer list-none flex items-center justify-between text-lg">
                      {faq.question}
                      <span className="text-zinc-500 group-open:rotate-180 transition-transform text-2xl">▼</span>
                    </summary>
                    <p className="text-zinc-400 mt-4 leading-relaxed">{faq.answer}</p>
                  </details>
                ))}
              </div>
            ) : (
              <div className="text-center text-zinc-400">Loading FAQs...</div>
            )}
          </div>
        </section>

        <section className="py-20 bg-zinc-900/50">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold text-zinc-100 mb-4">Still Have Questions?</h2>
            <p className="text-zinc-400 mb-8">
              We're here to help. Reach out to our support team.
            </p>
            <a
              href="mailto:info@club100.bg"
              className="inline-block px-8 py-4 bg-amber-500 hover:bg-amber-600 text-zinc-950 font-bold rounded-xl transition-all"
            >
              Contact Support
            </a>
          </div>
        </section>
      </div>
    </>
  );
}
