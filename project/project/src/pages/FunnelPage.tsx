import { useEffect, useState, FormEvent } from 'react';
import { ArrowRight, Package, Shield, Clock, Star, Check } from 'lucide-react';
import { supabase, Collection, CollectionInventory, Review } from '../lib/supabase';
import { CountdownTimer } from '../components/CountdownTimer';
import { StockIndicator } from '../components/StockIndicator';
import { SEOHead } from '../components/SEOHead';
import { analytics } from '../lib/analytics';

export function FunnelPage() {
  const [collection, setCollection] = useState<Collection | null>(null);
  const [inventory, setInventory] = useState<CollectionInventory[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: ''
  });
  const [orderStatus, setOrderStatus] = useState<'idle' | 'loading' | 'success'>('idle');

  useEffect(() => {
    analytics.trackPageView('/');
    loadCollection();
  }, []);

  const loadCollection = async () => {
    const { data: collectionData } = await supabase
      .from('collections')
      .select('*')
      .eq('slug', 'collection-1-genesis')
      .maybeSingle();

    if (collectionData) {
      setCollection(collectionData);

      const { data: inventoryData } = await supabase
        .from('collection_inventory')
        .select('*')
        .eq('collection_id', collectionData.id)
        .order('size');

      if (inventoryData) setInventory(inventoryData);

      const { data: reviewData } = await supabase
        .from('reviews')
        .select('*')
        .eq('collection_id', collectionData.id)
        .eq('is_approved', true)
        .order('created_at', { ascending: false })
        .limit(3);

      if (reviewData) setReviews(reviewData);
    }
  };

  const handleOrder = async (e: FormEvent) => {
    e.preventDefault();
    if (!selectedSize || !collection) return;

    setOrderStatus('loading');
    analytics.trackAddToCart(collection.name, selectedSize);

    setTimeout(() => {
      setOrderStatus('success');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 1500);
  };

  if (!collection) {
    return (
      <div className="min-h-screen bg-zinc-900 flex items-center justify-center">
        <div className="text-sage-300">Зареждане...</div>
      </div>
    );
  }

  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    brand: { '@type': 'Brand', name: 'C100' },
    name: 'C100 – Колекция № 001',
    description: '100 уникални тениски. Само веднъж. Никога повече.',
    sku: 'C100-001',
    offers: {
      '@type': 'Offer',
      priceCurrency: 'BGN',
      price: collection.price_bgn.toString(),
      availability: collection.is_sold_out ? 'https://schema.org/SoldOut' : 'https://schema.org/InStock',
      url: window.location.href,
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '5',
      reviewCount: reviews.length.toString(),
    },
  };

  if (orderStatus === 'success') {
    return (
      <>
        <SEOHead
          title="Поръчка изпратена – C100"
          description="Вашата поръчка е получена успешно"
          structuredData={structuredData}
        />
        <div className="min-h-screen bg-gradient-to-b from-zinc-900 via-forest-900 to-zinc-900 flex items-center justify-center px-4">
          <div className="max-w-2xl w-full text-center">
            <div className="w-20 h-20 bg-terra-500/10 border-2 border-terra-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <Check className="w-10 h-10 text-terra-500" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-sage-50 mb-4">
              Благодарим ви!
            </h1>
            <p className="text-xl text-sage-300 mb-8">
              Вашата поръчка е получена. Ще се свържем с вас в рамките на 1 час за потвърждение.
            </p>
            <div className="bg-forest-900/50 border border-forest-700 rounded-2xl p-6 text-left space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-sage-400">Име:</span>
                <span className="text-sage-100 font-medium">{formData.name}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-sage-400">Размер:</span>
                <span className="text-sage-100 font-medium">{selectedSize}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-sage-400">Сума:</span>
                <span className="text-terra-400 font-bold text-lg">{collection.price_bgn} лв</span>
              </div>
            </div>
            <p className="text-sage-500 text-sm mt-6">
              Доставка: В рамките на 24 часа | Плащане: Наложен платеж
            </p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <SEOHead
        title="C100 – Колекция № 001 | Само 100 броя"
        description="Ексклузивна лимитирана тениска. 100 уникални бройки с индивидуален номер. Висококачествен памук 280 GSM. След 100-тия брой - никога повече."
        structuredData={structuredData}
      />

      <div className="min-h-screen bg-gradient-to-b from-zinc-900 via-forest-900 to-zinc-900">
        <section className="relative min-h-screen flex items-center justify-center px-4 py-20">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-forest-800/20 via-transparent to-transparent"></div>

          <div className="relative z-10 max-w-6xl mx-auto w-full">
            <div className="text-center mb-12">
              <div className="inline-flex items-center space-x-2 px-4 py-2 bg-forest-900/50 border border-forest-700 rounded-full mb-8">
                <div className="w-2 h-2 bg-terra-500 rounded-full animate-pulse"></div>
                <span className="text-sage-200 text-sm font-medium uppercase tracking-wider">Продажбата започва скоро</span>
              </div>

              <h1 className="text-6xl md:text-8xl font-bold text-sage-50 mb-6 tracking-tighter leading-none">
                100 ТЕНИСКИ.
                <br />
                <span className="bg-gradient-to-r from-terra-400 to-terra-600 bg-clip-text text-transparent">
                  НИКОГА ПОВЕЧЕ.
                </span>
              </h1>

              <p className="text-xl md:text-2xl text-sage-300 mb-8 max-w-2xl mx-auto leading-relaxed">
                Колекция № 001 – "THE CODE"
                <br />
                <span className="text-sage-400 text-lg">Сериен № X/100</span>
              </p>

              <CountdownTimer
                targetDate={collection.drop_date_time}
                onComplete={() => analytics.trackDropOpen(collection.name)}
              />
            </div>

            <div className="mb-12">
              <StockIndicator remaining={collection.remaining_stock} total={collection.total_stock} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
              <div className="order-2 lg:order-1">
                <div className="aspect-square bg-gradient-to-br from-forest-800 to-forest-900 rounded-3xl overflow-hidden border border-forest-700 flex items-center justify-center">
                  <Package className="w-32 h-32 text-forest-600" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <p className="text-sage-500 text-lg">Визуализация на продукта</p>
                  </div>
                </div>

                <div className="mt-8 grid grid-cols-4 gap-3">
                  <div className="flex flex-col items-center space-y-2 bg-forest-900/30 border border-forest-800 rounded-xl p-4">
                    <Package className="w-6 h-6 text-terra-500" />
                    <div className="text-xs text-sage-300 text-center font-medium">Само 100 броя</div>
                  </div>
                  <div className="flex flex-col items-center space-y-2 bg-forest-900/30 border border-forest-800 rounded-xl p-4">
                    <Shield className="w-6 h-6 text-terra-500" />
                    <div className="text-xs text-sage-300 text-center font-medium">Сертификат</div>
                  </div>
                  <div className="flex flex-col items-center space-y-2 bg-forest-900/30 border border-forest-800 rounded-xl p-4">
                    <Clock className="w-6 h-6 text-terra-500" />
                    <div className="text-xs text-sage-300 text-center font-medium">24ч доставка</div>
                  </div>
                  <div className="flex flex-col items-center space-y-2 bg-forest-900/30 border border-forest-800 rounded-xl p-4">
                    <Star className="w-6 h-6 text-terra-500" />
                    <div className="text-xs text-sage-300 text-center font-medium">280 GSM</div>
                  </div>
                </div>
              </div>

              <div className="order-1 lg:order-2 bg-forest-900/50 border border-forest-700 rounded-3xl p-8 backdrop-blur-sm">
                <form onSubmit={handleOrder} className="space-y-6">
                  <div>
                    <div className="flex items-baseline justify-between mb-6">
                      <div>
                        <h2 className="text-3xl font-bold text-sage-50 mb-2">Колекция № 001</h2>
                        <p className="text-sage-400">THE CODE – Лимитирано издание</p>
                      </div>
                      <div className="text-right">
                        <div className="text-4xl font-bold text-terra-400">{collection.price_bgn} лв</div>
                        <div className="text-sm text-sage-500">с ДДС</div>
                      </div>
                    </div>

                    <div className="bg-forest-800/50 border border-forest-700 rounded-xl p-4 space-y-2 mb-6">
                      <div className="flex items-start space-x-2">
                        <Check className="w-4 h-4 text-terra-500 mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-sage-300">Висококачествен памук 280 GSM</span>
                      </div>
                      <div className="flex items-start space-x-2">
                        <Check className="w-4 h-4 text-terra-500 mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-sage-300">Oversize fit с drop shoulder</span>
                      </div>
                      <div className="flex items-start space-x-2">
                        <Check className="w-4 h-4 text-terra-500 mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-sage-300">Уникален сериен номер № X/100</span>
                      </div>
                      <div className="flex items-start space-x-2">
                        <Check className="w-4 h-4 text-terra-500 mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-sage-300">Луксозна кутия с холограма</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sage-200 font-semibold mb-3 uppercase tracking-wider text-sm">
                      Избери размер
                    </label>
                    <div className="grid grid-cols-5 gap-2">
                      {inventory.map((item) => (
                        <button
                          key={item.size}
                          type="button"
                          onClick={() => setSelectedSize(item.size)}
                          disabled={item.remaining_quantity === 0}
                          className={`px-4 py-3 rounded-xl font-bold transition-all ${
                            selectedSize === item.size
                              ? 'bg-terra-500 text-zinc-900 border-2 border-terra-500 scale-105'
                              : item.remaining_quantity === 0
                              ? 'bg-forest-950 text-sage-600 border border-forest-800 cursor-not-allowed line-through'
                              : 'bg-forest-800 text-sage-200 border border-forest-700 hover:border-terra-500 hover:text-sage-50'
                          }`}
                        >
                          <div className="text-lg">{item.size}</div>
                          <div className="text-xs mt-1">{item.remaining_quantity}</div>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label htmlFor="name" className="block text-sage-300 font-medium mb-2 text-sm">
                      Име и фамилия *
                    </label>
                    <input
                      type="text"
                      id="name"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-3 bg-forest-950 border border-forest-700 rounded-xl text-sage-100 placeholder-sage-600 focus:outline-none focus:ring-2 focus:ring-terra-500 focus:border-transparent transition-all"
                      placeholder="Иван Петров"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="email" className="block text-sage-300 font-medium mb-2 text-sm">
                        Имейл *
                      </label>
                      <input
                        type="email"
                        id="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full px-4 py-3 bg-forest-950 border border-forest-700 rounded-xl text-sage-100 placeholder-sage-600 focus:outline-none focus:ring-2 focus:ring-terra-500 focus:border-transparent transition-all"
                        placeholder="ivan@example.com"
                      />
                    </div>
                    <div>
                      <label htmlFor="phone" className="block text-sage-300 font-medium mb-2 text-sm">
                        Телефон *
                      </label>
                      <input
                        type="tel"
                        id="phone"
                        required
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full px-4 py-3 bg-forest-950 border border-forest-700 rounded-xl text-sage-100 placeholder-sage-600 focus:outline-none focus:ring-2 focus:ring-terra-500 focus:border-transparent transition-all"
                        placeholder="0888 123 456"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="address" className="block text-sage-300 font-medium mb-2 text-sm">
                      Адрес за доставка *
                    </label>
                    <textarea
                      id="address"
                      required
                      rows={2}
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      className="w-full px-4 py-3 bg-forest-950 border border-forest-700 rounded-xl text-sage-100 placeholder-sage-600 focus:outline-none focus:ring-2 focus:ring-terra-500 focus:border-transparent transition-all resize-none"
                      placeholder="гр. София, ул. Витоша 1, ет. 2, ап. 5"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={!selectedSize || orderStatus === 'loading'}
                    className="w-full px-8 py-5 bg-terra-500 hover:bg-terra-600 text-zinc-900 font-bold rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-3 text-lg shadow-lg shadow-terra-500/20"
                  >
                    <span>{orderStatus === 'loading' ? 'ОБРАБОТКА...' : 'ПОРЪЧАЙ СЕГА'}</span>
                    <ArrowRight className="w-6 h-6" />
                  </button>

                  <div className="text-center">
                    <p className="text-sage-500 text-sm">
                      Плащане: <span className="text-sage-300 font-medium">Наложен платеж</span>
                    </p>
                    <p className="text-sage-500 text-sm">
                      Доставка: <span className="text-sage-300 font-medium">24 часа (Еконт/Спиди)</span>
                    </p>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </section>

        {reviews.length > 0 && (
          <section className="py-20 px-4 bg-zinc-900/50">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold text-sage-50 text-center mb-12">
                Мнения на собственици
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {reviews.map((review) => (
                  <div key={review.id} className="bg-forest-900/50 border border-forest-700 rounded-2xl p-6">
                    <div className="flex items-center space-x-1 mb-4">
                      {[...Array(review.rating)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-terra-500 text-terra-500" />
                      ))}
                    </div>
                    <p className="text-sage-300 mb-4 leading-relaxed">{review.comment}</p>
                    <div className="flex items-center justify-between text-sm border-t border-forest-800 pt-4">
                      <span className="text-sage-400">{review.customer_name}</span>
                      {review.serial_number && (
                        <span className="text-terra-500 font-semibold">№ {review.serial_number}/100</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        <section className="py-20 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-sage-50 mb-6">
              Защо само 100 броя?
            </h2>
            <p className="text-lg text-sage-300 leading-relaxed mb-8">
              В свят на безкрайни опции и масово производство, ние избрахме друг път.
              Всяка тениска е изработена от висококачествен памук с внимание към детайлите.
              След като продадем 100-тия брой, тази колекция се архивира завинаги. Никога повече.
            </p>
            <div className="inline-flex items-center space-x-2 text-terra-400 font-semibold">
              <Shield className="w-5 h-5" />
              <span>Гарантирана автентичност</span>
            </div>
          </div>
        </section>

        <footer className="border-t border-forest-800 py-8 px-4 bg-zinc-950">
          <div className="max-w-6xl mx-auto text-center">
            <div className="text-2xl font-bold tracking-tighter mb-4">
              <span className="text-sage-100">C</span>
              <span className="text-terra-500">100</span>
            </div>
            <p className="text-sage-500 text-sm">
              &copy; 2025 C100. Всички права запазени. Цените включват ДДС 20%.
            </p>
          </div>
        </footer>
      </div>
    </>
  );
}
