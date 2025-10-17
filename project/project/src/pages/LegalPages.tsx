import { useEffect } from 'react';
import { SEOHead } from '../components/SEOHead';
import { analytics } from '../lib/analytics';

export function ShippingReturnsPage() {
  useEffect(() => {
    analytics.trackPageView('/shipping-returns');
  }, []);

  return (
    <>
      <SEOHead
        title="Shipping & Returns Policy | Club 100"
        description="Learn about Club 100 shipping and returns policy. 24-hour delivery in Bulgaria, 14-day returns for defects."
      />
      <div className="bg-zinc-950 min-h-screen py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-5xl font-bold text-zinc-100 mb-8">Shipping & Returns</h1>
          <div className="prose prose-invert max-w-none space-y-6 text-zinc-400">
            <section>
              <h2 className="text-2xl font-bold text-zinc-100 mb-4">Shipping</h2>
              <p>We offer fast delivery within Bulgaria via Econt or Speedy courier services.</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Delivery time: Within 24 hours for orders placed before 2 PM</li>
                <li>Tracking number provided immediately after order confirmation</li>
                <li>Free shipping on all orders</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-zinc-100 mb-4">Returns Policy</h2>
              <p>
                Due to the limited nature and serial numbering of our products, all sales are final.
                However, we stand behind the quality of our products.
              </p>
              <p>
                If your T-shirt has a manufacturing defect, we offer a full refund within 14 days of delivery.
                Please contact us at info@club100.bg with photos of the defect.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-zinc-100 mb-4">Exchanges</h2>
              <p>
                Size exchanges are not available due to limited stock per size. Please refer to our size guide
                before purchasing to ensure the best fit.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-zinc-100 mb-4">Contact</h2>
              <p>
                Questions about shipping or returns? Email us at{' '}
                <a href="mailto:info@club100.bg" className="text-amber-500 hover:text-amber-400">
                  info@club100.bg
                </a>
              </p>
            </section>
          </div>
        </div>
      </div>
    </>
  );
}

export function TermsPage() {
  useEffect(() => {
    analytics.trackPageView('/terms');
  }, []);

  return (
    <>
      <SEOHead title="Terms & Conditions | Club 100" description="Club 100 terms and conditions." />
      <div className="bg-zinc-950 min-h-screen py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-5xl font-bold text-zinc-100 mb-8">Terms & Conditions</h1>
          <div className="prose prose-invert max-w-none space-y-6 text-zinc-400">
            <p>Last updated: {new Date().toLocaleDateString()}</p>

            <section>
              <h2 className="text-2xl font-bold text-zinc-100 mb-4">1. Agreement to Terms</h2>
              <p>
                By accessing and purchasing from Club 100, you agree to be bound by these Terms and Conditions.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-zinc-100 mb-4">2. Limited Edition Policy</h2>
              <p>
                Each collection is strictly limited to 100 numbered pieces. Once a collection is sold out,
                it will never be reproduced. All sales are final.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-zinc-100 mb-4">3. Pricing</h2>
              <p>All prices are listed in BGN and EUR and include VAT at 20%.</p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-zinc-100 mb-4">4. Payment</h2>
              <p>
                We accept cash on delivery, credit/debit cards, Apple Pay, and Google Pay. Payment is processed
                securely through our payment partners.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-zinc-100 mb-4">5. Intellectual Property</h2>
              <p>
                All designs, logos, and content are the property of Club 100 and protected by copyright law.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-zinc-100 mb-4">6. Contact</h2>
              <p>
                For questions about these terms, contact us at{' '}
                <a href="mailto:info@club100.bg" className="text-amber-500 hover:text-amber-400">
                  info@club100.bg
                </a>
              </p>
            </section>
          </div>
        </div>
      </div>
    </>
  );
}

export function PrivacyPage() {
  useEffect(() => {
    analytics.trackPageView('/privacy');
  }, []);

  return (
    <>
      <SEOHead title="Privacy Policy | Club 100" description="Club 100 privacy policy and data protection." />
      <div className="bg-zinc-950 min-h-screen py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-5xl font-bold text-zinc-100 mb-8">Privacy Policy</h1>
          <div className="prose prose-invert max-w-none space-y-6 text-zinc-400">
            <p>Last updated: {new Date().toLocaleDateString()}</p>

            <section>
              <h2 className="text-2xl font-bold text-zinc-100 mb-4">1. Information We Collect</h2>
              <p>We collect information you provide when making a purchase or joining Club 100:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Name and email address</li>
                <li>Shipping address and phone number</li>
                <li>Payment information (processed securely by our payment partners)</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-zinc-100 mb-4">2. How We Use Your Information</h2>
              <p>We use your information to:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Process and fulfill your orders</li>
                <li>Send order confirmations and shipping updates</li>
                <li>Provide Club 100 membership benefits and early access</li>
                <li>Send promotional emails (you can opt out anytime)</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-zinc-100 mb-4">3. Data Protection</h2>
              <p>
                We implement appropriate security measures to protect your personal information. We comply with
                GDPR and Bulgarian data protection laws.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-zinc-100 mb-4">4. Cookies</h2>
              <p>
                We use cookies to improve your browsing experience and track website analytics. You can disable
                cookies in your browser settings.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-zinc-100 mb-4">5. Your Rights</h2>
              <p>You have the right to:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Access your personal data</li>
                <li>Request data correction or deletion</li>
                <li>Opt out of marketing communications</li>
                <li>Lodge a complaint with a supervisory authority</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-zinc-100 mb-4">6. Contact</h2>
              <p>
                For privacy concerns, contact us at{' '}
                <a href="mailto:info@club100.bg" className="text-amber-500 hover:text-amber-400">
                  info@club100.bg
                </a>
              </p>
            </section>
          </div>
        </div>
      </div>
    </>
  );
}

export function ContactPage() {
  useEffect(() => {
    analytics.trackPageView('/contact');
  }, []);

  return (
    <>
      <SEOHead title="Contact Us | Club 100" description="Get in touch with Club 100 support team." />
      <div className="bg-zinc-950 min-h-screen py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-5xl font-bold text-zinc-100 mb-8 text-center">Contact Us</h1>
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8 md:p-12 text-center">
            <p className="text-xl text-zinc-400 mb-8">
              Have questions about Club 100, your order, or membership? We're here to help.
            </p>

            <div className="space-y-6">
              <div>
                <h3 className="text-zinc-100 font-semibold mb-2">Email</h3>
                <a
                  href="mailto:info@club100.bg"
                  className="text-amber-500 hover:text-amber-400 text-lg transition-colors"
                >
                  info@club100.bg
                </a>
              </div>

              <div>
                <h3 className="text-zinc-100 font-semibold mb-2">Response Time</h3>
                <p className="text-zinc-400">We typically respond within 24 hours</p>
              </div>

              <div className="pt-6 border-t border-zinc-800">
                <p className="text-sm text-zinc-500">
                  For order tracking, please include your order number in the subject line.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
