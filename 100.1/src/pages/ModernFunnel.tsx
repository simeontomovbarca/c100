import { useEffect, useState, FormEvent } from 'react';
import { ArrowRight, Package, Shield, Clock, Star, Check, Sparkles, Zap } from 'lucide-react';
import { supabase, Collection, CollectionInventory, Review } from '../lib/supabase';
import { CountdownTimer } from '../components/CountdownTimer';
import { StockIndicator } from '../components/StockIndicator';
import { SEOHead } from '../components/SEOHead';
import { analytics } from '../lib/analytics';

export function ModernFunnel() {
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
        <div className="min-h-screen bg-gradient-to-br from-zinc-900 via-forest-900 to-zinc-950 flex items-center justify-center px-4 relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-20 left-10 w-64 h-64 bg-terra-500 rounded-full blur-3xl"></div>
            <div className="absolute bottom-20 right-10 w-96 h-96 bg-forest-500 rounded-full blur-3xl"></div>
          </div>

          <div className="max-w-2xl w-full text-center relative z-10">
            <div className="w-24 h-24 bg-gradient-to-br from-terra-500 to-terra-600 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-2xl shadow-terra-500/30 rotate-6">
              <Check className="w-12 h-12 text-white" />
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-sage-50 mb-6">
              Благодарим ви!
            </h1>
            <p className="text-xl text-sage-300 mb-12 leading-relaxed">
              Вашата поръчка е получена. Ще се свържем с вас в рамките на 1 час за потвърждение.
            </p>
            <div className="bg-forest-900/50 backdrop-blur-xl border border-forest-700 rounded-3xl p-8 text-left space-y-4 shadow-2xl">
              <div className="flex justify-between items-center py-3 border-b border-forest-800">
                <span className="text-sage-400 text-sm uppercase tracking-wider">Име</span>
                <span className="text-sage-100 font-semibold text-lg">{formData.name}</span>
              </div>
              <div className="flex justify-between items-center py-3 border-b border-forest-800">
                <span className="text-sage-400 text-sm uppercase tracking-wider">Размер</span>
                <span className="text-sage-100 font-semibold text-lg">{selectedSize}</span>
              </div>
              <div className="flex justify-between items-center py-3">
                <span className="text-sage-400 text-sm uppercase tracking-wider">Сума</span>
                <span className="text-terra-400 font-bold text-2xl">{collection.price_bgn} лв</span>
              </div>
            </div>
            <div className="mt-8 flex items-center justify-center space-x-8 text-sm text-sage-500">
              <div className="flex items-center space-x-2">
                <Clock className="w-4 h-4" />
                <span>24ч доставка</span>
              </div>
              <div className="flex items-center space-x-2">
                <Shield className="w-4 h-4" />
                <span>Наложен платеж</span>
              </div>
            </div>
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

      <div className="min-h-screen bg-zinc-950 relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-terra-500 rounded-full blur-3xl"></div>
          <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-forest-500 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-1/2 w-96 h-96 bg-sage-500 rounded-full blur-3xl"></div>
        </div>

        <section className="relative min-h-screen flex items-center justify-center px-4 py-20">
          <div className="absolute top-10 right-10 w-32 h-32 border-2 border-terra-500/20 rounded-3xl rotate-12 hidden lg:block"></div>
          <div className="absolute bottom-20 left-10 w-24 h-24 border-2 border-forest-500/20 rounded-full hidden lg:block"></div>

          <div className="relative z-10 max-w-7xl mx-auto w-full">
            <div className="text-center mb-16">
              <div className="inline-flex items-center space-x-3 px-6 py-3 bg-gradient-to-r from-forest-900/80 to-forest-800/80 backdrop-blur-xl border border-forest-700 rounded-full mb-8 shadow-lg">
                <Sparkles className="w-4 h-4 text-terra-400 animate-pulse" />
                <span className="text-sage-200 text-sm font-bold uppercase tracking-widest">Ексклузивен дроп</span>
                <Sparkles className="w-4 h-4 text-terra-400 animate-pulse" />
              </div>

              <h1 className="text-6xl md:text-8xl lg:text-9xl font-black text-sage-50 mb-8 tracking-tighter leading-none">
                <span className="block">100 ТЕНИСКИ.</span>
                <span className="block bg-gradient-to-r from-terra-400 via-terra-500 to-terra-600 bg-clip-text text-transparent">
                  НИКОГА ПОВЕЧЕ.
                </span>
              </h1>

              <div className="flex flex-col md:flex-row items-center justify-center gap-4 mb-12">
                <div className="flex items-center space-x-3 px-6 py-3 bg-forest-900/30 border border-forest-800 rounded-2xl">
                  <div className="w-2 h-2 bg-terra-500 rounded-full animate-pulse"></div>
                  <span className="text-sage-200 font-semibold">Колекция № 001</span>
                </div>
                <div className="flex items-center space-x-3 px-6 py-3 bg-forest-900/30 border border-forest-800 rounded-2xl">
                  <Package className="w-4 h-4 text-terra-400" />
                  <span className="text-sage-200 font-semibold">THE CODE</span>
                </div>
              </div>

              <CountdownTimer
                targetDate={collection.drop_date_time}
                onComplete={() => analytics.trackDropOpen(collection.name)}
              />
            </div>

            <div className="mb-16 max-w-3xl mx-auto">
              <StockIndicator remaining={collection.remaining_stock} total={collection.total_stock} />
            </div>
          </div>
        </section>

        <section className="relative px-4 py-20 bg-gradient-to-b from-transparent via-forest-950/30 to-transparent">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-7 relative">
                <div className="absolute -top-8 -left-8 w-32 h-32 bg-terra-500/10 rounded-3xl rotate-12 blur-xl"></div>
                <div className="relative bg-gradient-to-br from-forest-800 to-forest-900 rounded-[3rem] p-8 border border-forest-700 shadow-2xl overflow-hidden transform hover:scale-[1.02] transition-all duration-500">
                  <div className="aspect-square bg-gradient-to-br from-sage-800/30 to-transparent rounded-3xl flex items-center justify-center">
                    <div className="text-center">
                      <Package className="w-32 h-32 text-forest-600 mx-auto mb-6" />
                      <p className="text-sage-500 text-lg font-semibold">Мокъп визуализация</p>
                      <p className="text-sage-600 text-sm mt-2">Forest Green вариант</p>
                    </div>
                  </div>
                  <div className="absolute top-6 right-6 bg-terra-500 text-white px-5 py-2 rounded-full text-sm font-bold shadow-lg">
                    № X/100
                  </div>
                </div>
              </div>

              <div className="lg:col-span-5 space-y-8">
                <div>
                  <div className="inline-block px-4 py-2 bg-terra-500/10 border border-terra-500/30 rounded-full mb-6">
                    <span className="text-terra-400 font-bold text-sm uppercase tracking-wider">Геометричен дизайн</span>
                  </div>
                  <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-sage-50 mb-6 leading-tight">
                    THE CODE
                  </h2>
                  <p className="text-xl text-sage-300 leading-relaxed mb-8">
                    Първата колекция от C100. Геометричен артистичен дизайн с уникална цветова палитра.
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-forest-900/40 border border-forest-800 rounded-2xl p-6 backdrop-blur-sm hover:bg-forest-900/60 transition-all hover:scale-105">
                    <div className="text-3xl font-bold text-terra-400 mb-2">280 GSM</div>
                    <div className="text-sm text-sage-400">Премиум памук</div>
                  </div>
                  <div className="bg-forest-900/40 border border-forest-800 rounded-2xl p-6 backdrop-blur-sm hover:bg-forest-900/60 transition-all hover:scale-105">
                    <div className="text-3xl font-bold text-terra-400 mb-2">100</div>
                    <div className="text-sm text-sage-400">Само 100 броя</div>
                  </div>
                  <div className="bg-forest-900/40 border border-forest-800 rounded-2xl p-6 backdrop-blur-sm hover:bg-forest-900/60 transition-all hover:scale-105">
                    <div className="text-3xl font-bold text-terra-400 mb-2">24ч</div>
                    <div className="text-sm text-sage-400">Експресна доставка</div>
                  </div>
                  <div className="bg-forest-900/40 border border-forest-800 rounded-2xl p-6 backdrop-blur-sm hover:bg-forest-900/60 transition-all hover:scale-105">
                    <div className="text-3xl font-bold text-terra-400 mb-2">№ X</div>
                    <div className="text-sm text-sage-400">Уникален номер</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="relative px-4 py-32">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 items-start">
              <div className="lg:col-span-2 lg:sticky lg:top-8">
                <h3 className="text-4xl md:text-5xl font-black text-sage-50 leading-tight mb-8">
                  Какво получаваш?
                </h3>
                <p className="text-lg text-sage-400 leading-relaxed">
                  Всяка тениска идва с пълен пакет за доказване на автентичност и ексклузивност.
                </p>
              </div>

              <div className="lg:col-span-3 space-y-4">
                {[
                  { icon: Check, text: 'Премиум 280 GSM органичен памук', highlight: false },
                  { icon: Star, text: 'Oversize fit с drop shoulder', highlight: false },
                  { icon: Sparkles, text: 'Геометричен принт - THE CODE дизайн', highlight: true },
                  { icon: Package, text: 'Уникален сериен номер (1-100)', highlight: true },
                  { icon: Shield, text: 'Сертификат за автентичност', highlight: false },
                  { icon: Check, text: 'Луксозна кутия с холограма', highlight: false },
                  { icon: Check, text: 'QR код за верификация', highlight: false },
                ].map((item, i) => (
                  <div
                    key={i}
                    className={`flex items-start space-x-4 p-6 rounded-2xl transition-all hover:scale-105 ${
                      item.highlight
                        ? 'bg-gradient-to-r from-terra-500/10 to-forest-900/40 border-2 border-terra-500/30'
                        : 'bg-forest-900/20 border-2 border-forest-800'
                    }`}
                  >
                    <div className={`w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0 ${
                      item.highlight ? 'bg-terra-500/30 border-2 border-terra-500' : 'bg-terra-500/20 border-2 border-terra-500/30'
                    }`}>
                      <item.icon className="w-5 h-5 text-terra-400" />
                    </div>
                    <span className={`text-lg font-medium pt-1.5 ${item.highlight ? 'text-sage-50' : 'text-sage-200'}`}>
                      {item.text}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {reviews.length > 0 && (
          <section className="relative px-4 py-20 bg-gradient-to-b from-transparent via-zinc-900/50 to-transparent">
            <div className="max-w-7xl mx-auto">
              <div className="text-center mb-16">
                <div className="inline-flex items-center space-x-2 mb-6">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-terra-500 text-terra-500" />
                  ))}
                </div>
                <h2 className="text-4xl md:text-5xl font-black text-sage-50 mb-4">
                  Мнения на собственици
                </h2>
                <p className="text-sage-400 text-lg">От хора които вече притежават своя №</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {reviews.map((review) => (
                  <div
                    key={review.id}
                    className="bg-forest-900/40 backdrop-blur-sm border border-forest-700 rounded-3xl p-8 hover:bg-forest-900/60 transition-all hover:scale-105 hover:-rotate-1 cursor-pointer"
                  >
                    <div className="flex items-center space-x-1 mb-6">
                      {[...Array(review.rating)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-terra-500 text-terra-500" />
                      ))}
                    </div>
                    <p className="text-sage-200 mb-6 leading-relaxed text-lg">&ldquo;{review.comment}&rdquo;</p>
                    <div className="flex items-center justify-between pt-6 border-t border-forest-800">
                      <span className="text-sage-400 font-medium">{review.customer_name}</span>
                      {review.serial_number && (
                        <span className="px-3 py-1 bg-terra-500/20 border border-terra-500/30 text-terra-400 font-bold text-sm rounded-full">
                          № {review.serial_number}/100
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        <section className="relative px-4 py-32 bg-gradient-to-b from-transparent via-forest-950/40 to-transparent">
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-1/2 left-1/4 w-64 h-64 bg-terra-500 rounded-full blur-3xl"></div>
            <div className="absolute top-1/3 right-1/3 w-96 h-96 bg-forest-500 rounded-full blur-3xl"></div>
          </div>

          <div className="max-w-5xl mx-auto text-center relative z-10">
            <Zap className="w-16 h-16 text-terra-400 mx-auto mb-8 animate-pulse" />
            <h2 className="text-4xl md:text-6xl font-black text-sage-50 mb-8 leading-tight">
              Защо само 100 броя?
            </h2>
            <p className="text-xl md:text-2xl text-sage-300 leading-relaxed mb-12 max-w-3xl mx-auto">
              В свят на безкрайни опции и масово производство, ние избрахме друг път.
              <span className="block mt-6 text-terra-400 font-bold">
                След като продадем 100-тия брой, тази колекция се архивира завинаги.
              </span>
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16">
              <div className="bg-forest-900/40 backdrop-blur-xl border border-forest-700 rounded-3xl p-8 hover:bg-forest-900/60 transition-all hover:scale-105">
                <div className="w-16 h-16 bg-terra-500/20 border border-terra-500/30 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <Shield className="w-8 h-8 text-terra-400" />
                </div>
                <h4 className="text-xl font-bold text-sage-50 mb-3">Ексклузивност</h4>
                <p className="text-sage-400">Никога повече от 100 броя</p>
              </div>
              <div className="bg-forest-900/40 backdrop-blur-xl border border-forest-700 rounded-3xl p-8 hover:bg-forest-900/60 transition-all hover:scale-105">
                <div className="w-16 h-16 bg-terra-500/20 border border-terra-500/30 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <Star className="w-8 h-8 text-terra-400" />
                </div>
                <h4 className="text-xl font-bold text-sage-50 mb-3">Качество</h4>
                <p className="text-sage-400">Премиум материали и изработка</p>
              </div>
              <div className="bg-forest-900/40 backdrop-blur-xl border border-forest-700 rounded-3xl p-8 hover:bg-forest-900/60 transition-all hover:scale-105">
                <div className="w-16 h-16 bg-terra-500/20 border border-terra-500/30 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <Package className="w-8 h-8 text-terra-400" />
                </div>
                <h4 className="text-xl font-bold text-sage-50 mb-3">Автентичност</h4>
                <p className="text-sage-400">Твоят уникален сериен номер</p>
              </div>
            </div>
          </div>
        </section>

        <section id="order" className="relative px-4 py-32 bg-gradient-to-b from-transparent to-zinc-950">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <div className="inline-block px-6 py-3 bg-gradient-to-r from-terra-500 to-terra-600 rounded-full mb-8 shadow-lg shadow-terra-500/30">
                <span className="text-white font-bold uppercase tracking-wider">Последна стъпка</span>
              </div>
              <h2 className="text-5xl md:text-6xl font-black text-sage-50 mb-6 leading-tight">
                Заяви своя номер
                <br />
                <span className="text-terra-400">преди да е късно</span>
              </h2>
              <p className="text-xl text-sage-300">Попълни формата и получи своята C100 тениска до 24 часа</p>
            </div>

            <div className="bg-gradient-to-br from-forest-900/60 to-forest-950/60 backdrop-blur-2xl border-2 border-forest-700 rounded-[3rem] p-8 md:p-12 shadow-2xl">
              <form onSubmit={handleOrder} className="space-y-8">
                <div className="flex flex-col md:flex-row md:items-baseline justify-between mb-8 pb-8 border-b-2 border-forest-800 gap-4">
                  <div>
                    <h3 className="text-3xl font-black text-sage-50 mb-2">Колекция № 001</h3>
                    <p className="text-sage-400 text-lg">THE CODE – Лимитирано издание</p>
                  </div>
                  <div className="text-left md:text-right">
                    <div className="text-5xl font-black text-terra-400">{collection.price_bgn}<span className="text-2xl"> лв</span></div>
                    <div className="text-sm text-sage-500 mt-1">с включен ДДС</div>
                  </div>
                </div>

                <div>
                  <label className="block text-sage-200 font-bold mb-4 uppercase tracking-widest text-sm flex items-center space-x-2">
                    <span>Избери размер</span>
                    <span className="text-terra-400">*</span>
                  </label>
                  <div className="grid grid-cols-5 gap-3">
                    {inventory.map((item) => (
                      <button
                        key={item.size}
                        type="button"
                        onClick={() => setSelectedSize(item.size)}
                        disabled={item.remaining_quantity === 0}
                        className={`relative px-6 py-4 rounded-2xl font-black text-lg transition-all ${
                          selectedSize === item.size
                            ? 'bg-gradient-to-br from-terra-500 to-terra-600 text-white border-2 border-terra-400 scale-110 shadow-lg shadow-terra-500/50'
                            : item.remaining_quantity === 0
                            ? 'bg-forest-950 text-sage-700 border-2 border-forest-800 cursor-not-allowed opacity-50'
                            : 'bg-forest-800 text-sage-200 border-2 border-forest-700 hover:border-terra-500 hover:scale-105 hover:shadow-lg'
                        }`}
                      >
                        <div className="text-2xl">{item.size}</div>
                        <div className="text-xs mt-1 font-medium">{item.remaining_quantity > 0 ? `${item.remaining_quantity} бр` : 'Няма'}</div>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2">
                    <label htmlFor="name" className="block text-sage-300 font-semibold mb-3 text-sm uppercase tracking-wider">
                      Име и фамилия *
                    </label>
                    <input
                      type="text"
                      id="name"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-6 py-4 bg-forest-950 border-2 border-forest-700 rounded-2xl text-sage-100 placeholder-sage-600 focus:outline-none focus:ring-4 focus:ring-terra-500/30 focus:border-terra-500 transition-all text-lg"
                      placeholder="Иван Петров"
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sage-300 font-semibold mb-3 text-sm uppercase tracking-wider">
                      Имейл адрес *
                    </label>
                    <input
                      type="email"
                      id="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-6 py-4 bg-forest-950 border-2 border-forest-700 rounded-2xl text-sage-100 placeholder-sage-600 focus:outline-none focus:ring-4 focus:ring-terra-500/30 focus:border-terra-500 transition-all text-lg"
                      placeholder="ivan@example.com"
                    />
                  </div>

                  <div>
                    <label htmlFor="phone" className="block text-sage-300 font-semibold mb-3 text-sm uppercase tracking-wider">
                      Телефон *
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-6 py-4 bg-forest-950 border-2 border-forest-700 rounded-2xl text-sage-100 placeholder-sage-600 focus:outline-none focus:ring-4 focus:ring-terra-500/30 focus:border-terra-500 transition-all text-lg"
                      placeholder="0888 123 456"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="address" className="block text-sage-300 font-semibold mb-3 text-sm uppercase tracking-wider">
                    Адрес за доставка *
                  </label>
                  <textarea
                    id="address"
                    required
                    rows={3}
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    className="w-full px-6 py-4 bg-forest-950 border-2 border-forest-700 rounded-2xl text-sage-100 placeholder-sage-600 focus:outline-none focus:ring-4 focus:ring-terra-500/30 focus:border-terra-500 transition-all resize-none text-lg"
                    placeholder="гр. София, ул. Витоша 1, ет. 2, ап. 5"
                  />
                </div>

                <button
                  type="submit"
                  disabled={!selectedSize || orderStatus === 'loading'}
                  className="w-full px-10 py-6 bg-gradient-to-r from-terra-500 to-terra-600 hover:from-terra-600 hover:to-terra-700 text-white font-black rounded-2xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-4 text-xl shadow-2xl shadow-terra-500/30 hover:scale-105 hover:shadow-terra-500/50 group"
                >
                  <span>{orderStatus === 'loading' ? 'ОБРАБОТВА СЕ...' : 'ПОРЪЧАЙ СЕГА - НАЛОЖЕН ПЛАТЕЖ'}</span>
                  <ArrowRight className="w-7 h-7 group-hover:translate-x-2 transition-transform" />
                </button>

                <div className="flex items-center justify-center space-x-8 pt-6 text-sage-500 text-sm">
                  <div className="flex items-center space-x-2">
                    <Clock className="w-4 h-4 text-terra-400" />
                    <span>Доставка до 24 часа</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Shield className="w-4 h-4 text-terra-400" />
                    <span>Плащане при получаване</span>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </section>

        <footer className="border-t-2 border-forest-800 py-12 px-4 bg-zinc-950">
          <div className="max-w-7xl mx-auto text-center">
            <div className="text-3xl font-black tracking-tighter mb-6">
              <span className="text-sage-100">C</span>
              <span className="text-terra-500">100</span>
            </div>
            <p className="text-sage-500 text-sm mb-4">
              Ексклузивни лимитирани колекции. 100 броя. Никога повече.
            </p>
            <p className="text-sage-600 text-xs">
              &copy; 2025 C100. Всички права запазени. Цените включват ДДС 20%.
            </p>
          </div>
        </footer>
      </div>
    </>
  );
}
