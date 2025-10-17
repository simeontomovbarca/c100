import { useEffect, useState } from 'react';
import { ShoppingCart, Truck, RotateCcw, Shield, Star, Package } from 'lucide-react';
import { Link, useRouter } from '../lib/router';
import { supabase, Collection, CollectionInventory, FAQItem, Review } from '../lib/supabase';
import { CountdownTimer } from '../components/CountdownTimer';
import { StockIndicator } from '../components/StockIndicator';
import { SEOHead } from '../components/SEOHead';
import { analytics } from '../lib/analytics';

export function ProductPage() {
  const { currentPath } = useRouter();
  const [collection, setCollection] = useState<Collection | null>(null);
  const [inventory, setInventory] = useState<CollectionInventory[]>([]);
  const [faqs, setFaqs] = useState<FAQItem[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [isSticky, setIsSticky] = useState(false);

  useEffect(() => {
    loadData();

    const handleScroll = () => {
      setIsSticky(window.scrollY > 600);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [currentPath]);

  const loadData = async () => {
    const { data: collectionData } = await supabase
      .from('collections')
      .select('*')
      .eq('slug', 'collection-1-genesis')
      .maybeSingle();

    if (collectionData) {
      setCollection(collectionData);
      analytics.trackPageView(`/shop/${collectionData.slug}`);

      const { data: inventoryData } = await supabase
        .from('collection_inventory')
        .select('*')
        .eq('collection_id', collectionData.id)
        .order('size');

      if (inventoryData) setInventory(inventoryData);

      const { data: faqData } = await supabase
        .from('faq_items')
        .select('*')
        .or(`collection_id.eq.${collectionData.id},collection_id.is.null`)
        .order('display_order');

      if (faqData) setFaqs(faqData);

      const { data: reviewData } = await supabase
        .from('reviews')
        .select('*')
        .eq('collection_id', collectionData.id)
        .eq('is_approved', true)
        .order('created_at', { ascending: false });

      if (reviewData) setReviews(reviewData);
    }
  };

  const handleBuyNow = () => {
    if (!selectedSize) {
      alert('Please select a size');
      return;
    }

    if (collection) {
      analytics.trackAddToCart(collection.name, selectedSize);
    }

    alert('Checkout flow will be implemented with payment integration');
  };

  if (!collection) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <div className="text-zinc-400">Loading...</div>
      </div>
    );
  }

  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    brand: { '@type': 'Brand', name: 'Club 100' },
    name: `Club 100 – ${collection.name} (Limited 100)`,
    description: collection.short_description,
    image: collection.hero_image_url || `${window.location.origin}/images/genesis-hero.jpg`,
    sku: 'C100-GENESIS',
    offers: {
      '@type': 'Offer',
      priceCurrency: 'BGN',
      price: collection.price_bgn.toString(),
      availability: collection.is_sold_out
        ? 'https://schema.org/SoldOut'
        : 'https://schema.org/InStock',
      url: window.location.href,
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '5',
      reviewCount: reviews.length.toString(),
    },
  };

  const faqStructuredData = {
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
        title={collection.seo_title}
        description={collection.seo_description}
        ogImage={collection.og_image_url || undefined}
        structuredData={[structuredData, faqStructuredData]}
      />

      {isSticky && (
        <div className="fixed bottom-0 left-0 right-0 z-50 bg-zinc-950/95 backdrop-blur-sm border-t border-zinc-800 py-4 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-zinc-800 rounded-lg"></div>
              <div>
                <div className="text-zinc-100 font-semibold text-sm">{collection.name}</div>
                <div className="text-amber-500 font-bold">{collection.price_bgn} BGN</div>
              </div>
            </div>
            <button
              onClick={handleBuyNow}
              className="px-6 py-3 bg-amber-500 hover:bg-amber-600 text-zinc-950 font-bold rounded-xl transition-all flex items-center space-x-2"
            >
              <ShoppingCart className="w-5 h-5" />
              <span className="hidden sm:inline">Buy Now</span>
            </button>
          </div>
        </div>
      )}

      <div className="bg-zinc-950 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
            <div>
              <div className="aspect-square bg-gradient-to-br from-zinc-800 to-zinc-900 rounded-2xl mb-4 flex items-center justify-center border border-zinc-700">
                <div className="text-center">
                  <Package className="w-24 h-24 text-zinc-600 mx-auto mb-4" />
                  <p className="text-zinc-500">Product image placeholder</p>
                </div>
              </div>

              <div className="grid grid-cols-4 gap-4">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="aspect-square bg-zinc-900 rounded-lg border border-zinc-800 hover:border-zinc-600 transition-colors cursor-pointer"
                  ></div>
                ))}
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className="px-3 py-1 bg-amber-500/10 border border-amber-500/20 text-amber-500 text-xs font-bold rounded-full uppercase">
                    Limited
                  </span>
                  <span className="px-3 py-1 bg-zinc-800 border border-zinc-700 text-zinc-400 text-xs font-bold rounded-full uppercase">
                    Serial № X/100
                  </span>
                  <span className="px-3 py-1 bg-zinc-800 border border-zinc-700 text-zinc-400 text-xs font-bold rounded-full uppercase">
                    Premium Fabric
                  </span>
                </div>

                <h1 className="text-4xl md:text-5xl font-bold text-zinc-100 mb-4">{collection.name}</h1>
                <p className="text-xl text-zinc-400 leading-relaxed mb-6">{collection.short_description}</p>

                <div className="flex items-baseline space-x-4 mb-6">
                  <span className="text-4xl font-bold text-zinc-100">{collection.price_bgn} BGN</span>
                  <span className="text-2xl text-zinc-500">/ {collection.price_eur} EUR</span>
                </div>

                <div className="text-xs text-zinc-500 mb-6">Prices include VAT 20%</div>
              </div>

              <CountdownTimer targetDate={collection.drop_date_time} />

              <StockIndicator remaining={collection.remaining_stock} total={collection.total_stock} />

              <div className="space-y-4">
                <label className="block text-zinc-100 font-semibold text-sm uppercase tracking-wider">
                  Select Size
                </label>
                <div className="grid grid-cols-5 gap-3">
                  {inventory.map((item) => (
                    <button
                      key={item.size}
                      onClick={() => setSelectedSize(item.size)}
                      disabled={item.remaining_quantity === 0}
                      className={`px-4 py-3 rounded-xl font-semibold transition-all ${
                        selectedSize === item.size
                          ? 'bg-amber-500 text-zinc-950 border-2 border-amber-500'
                          : item.remaining_quantity === 0
                          ? 'bg-zinc-900 text-zinc-600 border border-zinc-800 cursor-not-allowed line-through'
                          : 'bg-zinc-900 text-zinc-100 border border-zinc-700 hover:border-amber-500'
                      }`}
                    >
                      <div>{item.size}</div>
                      <div className="text-xs mt-1">{item.remaining_quantity}</div>
                    </button>
                  ))}
                </div>
                <Link to="#" className="text-sm text-amber-500 hover:text-amber-400 transition-colors">
                  Size Guide
                </Link>
              </div>

              <div className="space-y-3">
                <button
                  onClick={handleBuyNow}
                  disabled={!selectedSize || collection.is_sold_out}
                  className="w-full px-8 py-4 bg-amber-500 hover:bg-amber-600 text-zinc-950 font-bold rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 text-lg"
                >
                  <ShoppingCart className="w-5 h-5" />
                  <span>Buy Now</span>
                </button>

                <Link
                  to="/club-100"
                  className="block w-full px-8 py-4 bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-zinc-100 font-bold rounded-xl transition-all text-center"
                >
                  Join Club 100 for Early Access
                </Link>
              </div>

              <div className="grid grid-cols-3 gap-4 pt-6 border-t border-zinc-800">
                <div className="flex flex-col items-center text-center space-y-2">
                  <Truck className="w-6 h-6 text-amber-500" />
                  <div className="text-xs text-zinc-400">24h Delivery</div>
                </div>
                <div className="flex flex-col items-center text-center space-y-2">
                  <Shield className="w-6 h-6 text-amber-500" />
                  <div className="text-xs text-zinc-400">Secure Payment</div>
                </div>
                <div className="flex flex-col items-center text-center space-y-2">
                  <RotateCcw className="w-6 h-6 text-amber-500" />
                  <div className="text-xs text-zinc-400">14 Day Returns</div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 mb-16">
            <div className="lg:col-span-2 space-y-12">
              <div>
                <h2 className="text-3xl font-bold text-zinc-100 mb-6">The Story</h2>
                <p className="text-zinc-400 leading-relaxed whitespace-pre-line">
                  {collection.story_description}
                </p>
              </div>

              <div>
                <h2 className="text-3xl font-bold text-zinc-100 mb-6">What You Get</h2>
                <ul className="space-y-4">
                  {[
                    'Premium heavyweight 280 GSM organic cotton',
                    'Oversized fit with drop shoulders',
                    'Embossed/puff print that catches light',
                    'Small logo on left chest',
                    'Unique serial number № X/100',
                    'Certificate of authenticity',
                    'Luxury box with hologram + QR code',
                  ].map((item, i) => (
                    <li key={i} className="flex items-start space-x-3">
                      <div className="w-6 h-6 rounded-full bg-amber-500/10 border border-amber-500/20 flex items-center justify-center mt-0.5 flex-shrink-0">
                        <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
                      </div>
                      <span className="text-zinc-300">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
              <h3 className="text-xl font-bold text-zinc-100 mb-4">Specifications</h3>
              <dl className="space-y-4 text-sm">
                <div>
                  <dt className="text-zinc-500 mb-1">Fabric</dt>
                  <dd className="text-zinc-300">280 GSM Organic Cotton</dd>
                </div>
                <div>
                  <dt className="text-zinc-500 mb-1">Fit</dt>
                  <dd className="text-zinc-300">Oversized, Drop Shoulder</dd>
                </div>
                <div>
                  <dt className="text-zinc-500 mb-1">Print</dt>
                  <dd className="text-zinc-300">Embossed/Puff Print</dd>
                </div>
                <div>
                  <dt className="text-zinc-500 mb-1">Care</dt>
                  <dd className="text-zinc-300">Machine wash cold, tumble dry low</dd>
                </div>
                <div>
                  <dt className="text-zinc-500 mb-1">Made In</dt>
                  <dd className="text-zinc-300">Europe</dd>
                </div>
              </dl>
            </div>
          </div>

          {reviews.length > 0 && (
            <div className="mb-16">
              <h2 className="text-3xl font-bold text-zinc-100 mb-6">What Owners Say</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {reviews.map((review) => (
                  <div key={review.id} className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
                    <div className="flex items-center space-x-1 mb-3">
                      {[...Array(review.rating)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-amber-500 text-amber-500" />
                      ))}
                    </div>
                    <p className="text-zinc-300 mb-4 leading-relaxed">{review.comment}</p>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-zinc-400">{review.customer_name}</span>
                      {review.serial_number && (
                        <span className="text-amber-500 font-semibold">№ {review.serial_number}/100</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {faqs.length > 0 && (
            <div className="mb-16">
              <h2 className="text-3xl font-bold text-zinc-100 mb-6">Frequently Asked Questions</h2>
              <div className="space-y-4">
                {faqs.map((faq) => (
                  <details
                    key={faq.id}
                    className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 group"
                  >
                    <summary className="font-semibold text-zinc-100 cursor-pointer list-none flex items-center justify-between">
                      {faq.question}
                      <span className="text-zinc-500 group-open:rotate-180 transition-transform">▼</span>
                    </summary>
                    <p className="text-zinc-400 mt-4 leading-relaxed">{faq.answer}</p>
                  </details>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
