import { useEffect, useState, FormEvent } from 'react';
import { ArrowRight, Package, Shield, Clock, Star, Check, Sparkles, Crown } from 'lucide-react';
import { supabase, Collection, CollectionInventory, Review } from '../lib/supabase';
import { CountdownTimer } from '../components/CountdownTimer';
import { StockIndicator } from '../components/StockIndicator';
import { SEOHead } from '../components/SEOHead';
import { analytics } from '../lib/analytics';

export function LuxuryFunnel() {
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
      <div className="min-h-screen bg-luxury-gradient flex items-center justify-center">
        <div className="text-sage-200 font-sans text-xl">Зареждане...</div>
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
        <div className="min-h-screen bg-luxury-gradient flex items-center justify-center px-6 py-20 relative overflow-hidden">
          <div className="absolute inset-0">
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gold-400/5 rounded-full blur-3xl animate-float"></div>
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-terra-400/5 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>
          </div>

          <div className="max-w-3xl w-full text-center relative z-10">
            <div className="relative inline-block mb-12">
              <div className="absolute inset-0 bg-gradient-to-r from-gold-400 to-terra-400 rounded-[2.5rem] blur-2xl opacity-30 animate-glow"></div>
              <div className="relative w-32 h-32 bg-gradient-to-br from-gold-400 via-gold-500 to-terra-500 rounded-[2.5rem] flex items-center justify-center shadow-2xl">
                <Check className="w-16 h-16 text-zinc-950" strokeWidth={3} />
              </div>
            </div>

            <h1 className="text-6xl md:text-7xl font-sans font-extralight text-sage-50 mb-8 tracking-tight">
              Благодарим ви
            </h1>

            <p className="text-2xl text-sage-300 mb-16 leading-relaxed font-extralight max-w-2xl mx-auto">
              Вашата поръчка е получена и потвърдена.
              <span className="block mt-4 text-sage-400">Ще се свържем с вас в рамките на един час.</span>
            </p>

            <div className="bg-forest-950/40 backdrop-blur-2xl border border-gold-500/20 rounded-[2.5rem] p-12 shadow-2xl relative overflow-hidden">
              <div className="absolute inset-0 bg-shimmer animate-shimmer"></div>

              <div className="relative space-y-8">
                <div className="flex justify-between items-center py-6 border-b border-gold-500/10">
                  <span className="text-sage-500 text-sm uppercase tracking-luxury font-sans">Поръчка от</span>
                  <span className="text-sage-50 font-sans text-2xl">{formData.name}</span>
                </div>
                <div className="flex justify-between items-center py-6 border-b border-gold-500/10">
                  <span className="text-sage-500 text-sm uppercase tracking-luxury font-sans">Размер</span>
                  <span className="text-sage-50 font-sans text-2xl">{selectedSize}</span>
                </div>
                <div className="flex justify-between items-center py-6">
                  <span className="text-sage-500 text-sm uppercase tracking-luxury font-sans">Сума</span>
                  <span className="text-transparent bg-gradient-to-r from-gold-400 to-terra-400 bg-clip-text font-sans text-4xl font-semibold">
                    {collection.price_bgn} лв
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-12 flex items-center justify-center space-x-12 text-sage-500">
              <div className="flex items-center space-x-3">
                <Clock className="w-5 h-5 text-gold-400" />
                <span className="text-sm font-extralight">Доставка до 24 часа</span>
              </div>
              <div className="flex items-center space-x-3">
                <Shield className="w-5 h-5 text-gold-400" />
                <span className="text-sm font-extralight">Наложен платеж</span>
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

      <div className="min-h-screen bg-luxury-gradient relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-gold-400/3 rounded-full blur-3xl animate-float"></div>
          <div className="absolute top-1/3 right-1/4 w-[500px] h-[500px] bg-terra-400/3 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>
          <div className="absolute bottom-0 left-1/2 w-[400px] h-[400px] bg-forest-400/3 rounded-full blur-3xl animate-float" style={{ animationDelay: '4s' }}></div>
        </div>

        <section className="relative min-h-screen flex items-center justify-center px-6 py-32">
          <div className="absolute top-20 right-20 w-40 h-40 border border-gold-500/10 rounded-[3rem] rotate-12 hidden lg:block"></div>
          <div className="absolute bottom-32 left-20 w-32 h-32 border border-gold-500/10 rounded-full hidden lg:block"></div>
          <div className="absolute top-1/2 left-1/4 w-2 h-2 bg-gold-400 rounded-full animate-pulse"></div>
          <div className="absolute top-1/3 right-1/3 w-1 h-1 bg-terra-400 rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>

          <div className="relative z-10 max-w-7xl mx-auto w-full">
            <div className="text-center mb-24">
              <div className="inline-flex items-center space-x-4 px-8 py-4 bg-forest-950/40 backdrop-blur-2xl border border-gold-500/20 rounded-full mb-12 shadow-lg relative overflow-hidden">
                <div className="absolute inset-0 bg-shimmer animate-shimmer"></div>
                <Crown className="w-5 h-5 text-gold-400 relative z-10" />
                <span className="text-sage-100 text-sm font-sans uppercase tracking-luxury relative z-10 font-medium">Ексклузивен Дроп</span>
                <Sparkles className="w-5 h-5 text-gold-400 relative z-10" />
              </div>

              <h1 className="text-7xl md:text-8xl lg:text-9xl font-sans font-extralight text-sage-50 mb-12 tracking-tight leading-none">
                <span className="block mb-4">100 Тениски.</span>
                <span className="block text-transparent bg-gradient-to-r from-gold-300 via-gold-400 to-terra-400 bg-clip-text font-normal">
                  Никога Повече.
                </span>
              </h1>

              <div className="flex flex-col md:flex-row items-center justify-center gap-6 mb-16">
                <div className="px-8 py-4 bg-forest-950/30 backdrop-blur-xl border border-gold-500/10 rounded-2xl">
                  <span className="text-sage-200 font-sans text-lg">Колекция № 001</span>
                </div>
                <div className="w-1 h-1 bg-gold-400 rounded-full hidden md:block"></div>
                <div className="px-8 py-4 bg-forest-950/30 backdrop-blur-xl border border-gold-500/10 rounded-2xl">
                  <span className="text-sage-200 font-sans text-lg">THE CODE</span>
                </div>
              </div>

              <div className="mb-16">
                <CountdownTimer
                  targetDate={collection.drop_date_time}
                  onComplete={() => analytics.trackDropOpen(collection.name)}
                />
              </div>
            </div>

            <div className="mb-20 max-w-4xl mx-auto">
              <StockIndicator remaining={collection.remaining_stock} total={collection.total_stock} />
            </div>
          </div>
        </section>

        <section className="relative px-6 py-32">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
              <div className="lg:col-span-7 relative">
                <div className="absolute -inset-8 bg-gradient-to-br from-gold-400/5 to-terra-400/5 rounded-[4rem] blur-3xl"></div>
                <div className="relative bg-gradient-to-br from-forest-900/40 to-forest-950/40 backdrop-blur-2xl rounded-[4rem] p-12 border border-gold-500/10 shadow-2xl overflow-hidden group">
                  <div className="absolute inset-0 bg-shimmer animate-shimmer opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>

                  <div className="aspect-square bg-gradient-to-br from-sage-900/20 to-transparent rounded-[3rem] flex items-center justify-center relative">
                    <div className="text-center">
                      <Package className="w-40 h-40 text-forest-700 mx-auto mb-8 animate-float" />
                      <p className="text-sage-400 text-lg font-sans mb-2">Мокъп визуализация</p>
                      <p className="text-sage-600 text-sm font-sans">Forest Green вариант</p>
                    </div>
                  </div>

                  <div className="absolute top-8 right-8 bg-gradient-to-r from-gold-400 to-terra-400 text-zinc-950 px-6 py-3 rounded-2xl text-sm font-bold shadow-xl">
                    № X/100
                  </div>
                </div>
              </div>

              <div className="lg:col-span-5 space-y-12">
                <div>
                  <div className="inline-block px-6 py-3 bg-gold-400/10 backdrop-blur-xl border border-gold-500/20 rounded-full mb-8">
                    <span className="text-transparent bg-gradient-to-r from-gold-300 to-terra-400 bg-clip-text font-sans text-sm uppercase tracking-luxury font-semibold">
                      Геометричен Дизайн
                    </span>
                  </div>

                  <h2 className="text-6xl md:text-7xl font-sans font-extralight text-sage-50 mb-8 leading-tight">
                    The Code
                  </h2>

                  <p className="text-xl text-sage-300 leading-relaxed font-extralight">
                    Първата колекция от C100. Геометричен артистичен дизайн с уникална цветова палитра,
                    вдъхновена от съвременното изкуство.
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  {[
                    { value: '280 GSM', label: 'Премиум памук' },
                    { value: '100', label: 'Само 100 броя' },
                    { value: '24ч', label: 'Експресна доставка' },
                    { value: '№ X', label: 'Уникален номер' },
                  ].map((item, i) => (
                    <div
                      key={i}
                      className="bg-forest-950/30 backdrop-blur-xl border border-gold-500/10 rounded-3xl p-8 hover:bg-forest-950/50 transition-all duration-500 hover:scale-105 relative overflow-hidden group"
                    >
                      <div className="absolute inset-0 bg-shimmer animate-shimmer opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                      <div className="text-4xl font-sans text-transparent bg-gradient-to-r from-gold-400 to-terra-400 bg-clip-text mb-3 relative">
                        {item.value}
                      </div>
                      <div className="text-sm text-sage-400 font-sans relative">{item.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="relative px-6 py-40">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-20 items-start">
              <div className="lg:col-span-2 lg:sticky lg:top-32 space-y-8">
                <Crown className="w-12 h-12 text-gold-400 animate-float" />
                <h3 className="text-5xl md:text-6xl font-sans font-extralight text-sage-50 leading-tight">
                  Какво получаваш?
                </h3>
                <p className="text-xl text-sage-400 leading-relaxed font-extralight">
                  Всяка тениска идва с пълен пакет за доказване на автентичност и ексклузивност.
                </p>
              </div>

              <div className="lg:col-span-3 space-y-6">
                {[
                  { icon: Check, text: 'Премиум 280 GSM органичен памук', highlight: false },
                  { icon: Star, text: 'Oversize fit с drop shoulder дизайн', highlight: false },
                  { icon: Sparkles, text: 'Геометричен принт – THE CODE колекция', highlight: true },
                  { icon: Crown, text: 'Уникален сериен номер от 1 до 100', highlight: true },
                  { icon: Shield, text: 'Сертификат за автентичност с холограма', highlight: false },
                  { icon: Package, text: 'Луксозна кутия с премиум опаковка', highlight: false },
                  { icon: Check, text: 'QR код за онлайн верификация', highlight: false },
                ].map((item, i) => (
                  <div
                    key={i}
                    className={`flex items-start space-x-6 p-8 rounded-3xl transition-all duration-500 hover:scale-[1.02] relative overflow-hidden group ${
                      item.highlight
                        ? 'bg-gradient-to-r from-gold-400/10 to-terra-400/10 border-2 border-gold-500/30'
                        : 'bg-forest-950/30 backdrop-blur-xl border border-gold-500/10'
                    }`}
                  >
                    {item.highlight && (
                      <div className="absolute inset-0 bg-shimmer animate-shimmer opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                    )}

                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 relative ${
                      item.highlight
                        ? 'bg-gradient-to-br from-gold-400 to-terra-400 shadow-lg shadow-gold-500/20'
                        : 'bg-gold-400/10 border border-gold-500/20'
                    }`}>
                      <item.icon className={`w-7 h-7 ${item.highlight ? 'text-zinc-950' : 'text-gold-400'}`} />
                    </div>

                    <span className={`text-xl font-extralight pt-3 relative ${item.highlight ? 'text-sage-50' : 'text-sage-200'}`}>
                      {item.text}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {reviews.length > 0 && (
          <section className="relative px-6 py-32">
            <div className="max-w-7xl mx-auto">
              <div className="text-center mb-20">
                <div className="inline-flex items-center space-x-2 mb-8">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-6 h-6 fill-gold-400 text-gold-400" />
                  ))}
                </div>
                <h2 className="text-5xl md:text-6xl font-sans font-extralight text-sage-50 mb-6">
                  Мнения на собственици
                </h2>
                <p className="text-sage-400 text-xl font-extralight">От хора които вече притежават своя номер</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {reviews.map((review) => (
                  <div
                    key={review.id}
                    className="bg-forest-950/30 backdrop-blur-2xl border border-gold-500/10 rounded-[2.5rem] p-10 hover:bg-forest-950/50 transition-all duration-500 hover:scale-105 relative overflow-hidden group"
                  >
                    <div className="absolute inset-0 bg-shimmer animate-shimmer opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>

                    <div className="flex items-center space-x-2 mb-8 relative">
                      {[...Array(review.rating)].map((_, i) => (
                        <Star key={i} className="w-5 h-5 fill-gold-400 text-gold-400" />
                      ))}
                    </div>

                    <p className="text-sage-200 mb-8 leading-relaxed text-lg font-extralight relative">
                      &ldquo;{review.comment}&rdquo;
                    </p>

                    <div className="flex items-center justify-between pt-8 border-t border-gold-500/10 relative">
                      <span className="text-sage-400 font-sans">{review.customer_name}</span>
                      {review.serial_number && (
                        <span className="px-4 py-2 bg-gradient-to-r from-gold-400/20 to-terra-400/20 border border-gold-500/30 text-gold-400 font-bold text-sm rounded-full">
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

        <section className="relative px-6 py-40">
          <div className="absolute inset-0">
            <div className="absolute top-1/2 left-1/3 w-96 h-96 bg-gold-400/5 rounded-full blur-3xl animate-float"></div>
            <div className="absolute top-1/3 right-1/3 w-[500px] h-[500px] bg-terra-400/5 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>
          </div>

          <div className="max-w-6xl mx-auto text-center relative z-10">
            <div className="inline-block mb-12">
              <Shield className="w-16 h-16 text-gold-400 animate-float mx-auto" />
            </div>

            <h2 className="text-5xl md:text-7xl font-sans font-extralight text-sage-50 mb-12 leading-tight">
              Защо само 100 броя?
            </h2>

            <p className="text-2xl md:text-3xl text-sage-300 leading-relaxed mb-8 max-w-4xl mx-auto font-extralight">
              В свят на безкрайни опции и масово производство, ние избрахме друг път.
            </p>

            <p className="text-xl text-transparent bg-gradient-to-r from-gold-300 to-terra-400 bg-clip-text font-sans mb-20">
              След като продадем 100-тия брой, тази колекция се архивира завинаги.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-20">
              {[
                { icon: Shield, title: 'Ексклузивност', desc: 'Никога повече от 100 броя' },
                { icon: Star, title: 'Качество', desc: 'Премиум материали и изработка' },
                { icon: Crown, title: 'Автентичност', desc: 'Твоят уникален сериен номер' },
              ].map((item, i) => (
                <div
                  key={i}
                  className="bg-forest-950/30 backdrop-blur-2xl border border-gold-500/10 rounded-[2.5rem] p-10 hover:bg-forest-950/50 transition-all duration-500 hover:scale-105 relative overflow-hidden group"
                >
                  <div className="absolute inset-0 bg-shimmer animate-shimmer opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>

                  <div className="w-20 h-20 bg-gradient-to-br from-gold-400/20 to-terra-400/20 border border-gold-500/30 rounded-3xl flex items-center justify-center mx-auto mb-8 relative">
                    <item.icon className="w-10 h-10 text-gold-400" />
                  </div>

                  <h4 className="text-2xl font-sans text-sage-50 mb-4 relative">{item.title}</h4>
                  <p className="text-sage-400 font-extralight relative">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="order" className="relative px-6 py-40 bg-gradient-to-b from-transparent to-zinc-950">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-20">
              <div className="inline-block px-8 py-4 bg-gradient-to-r from-gold-400 to-terra-400 rounded-full mb-12 shadow-2xl shadow-gold-500/20 relative overflow-hidden">
                <div className="absolute inset-0 bg-shimmer animate-shimmer"></div>
                <span className="text-zinc-950 font-bold uppercase tracking-luxury text-sm relative">Последна Стъпка</span>
              </div>

              <h2 className="text-6xl md:text-7xl font-sans font-extralight text-sage-50 mb-8 leading-tight">
                Заяви своя номер
              </h2>

              <p className="text-2xl text-sage-300 font-extralight">
                Попълни формата и получи своята C100 тениска до 24 часа
              </p>
            </div>

            <div className="bg-gradient-to-br from-forest-950/50 to-forest-900/50 backdrop-blur-2xl border-2 border-gold-500/20 rounded-[4rem] p-12 md:p-16 shadow-2xl relative overflow-hidden">
              <div className="absolute inset-0 bg-shimmer animate-shimmer opacity-50"></div>

              <form onSubmit={handleOrder} className="space-y-10 relative">
                <div className="flex flex-col md:flex-row md:items-baseline justify-between mb-12 pb-12 border-b-2 border-gold-500/10 gap-6">
                  <div>
                    <h3 className="text-4xl font-sans text-sage-50 mb-3">Колекция № 001</h3>
                    <p className="text-sage-400 text-lg font-extralight">THE CODE – Лимитирано издание</p>
                  </div>
                  <div className="text-left md:text-right">
                    <div className="text-6xl font-sans text-transparent bg-gradient-to-r from-gold-400 to-terra-400 bg-clip-text">
                      {collection.price_bgn}<span className="text-3xl"> лв</span>
                    </div>
                    <div className="text-sm text-sage-500 mt-2 font-extralight">с включен ДДС</div>
                  </div>
                </div>

                <div>
                  <label className="block text-sage-200 font-sans text-lg mb-6">
                    Избери размер <span className="text-gold-400">*</span>
                  </label>
                  <div className="grid grid-cols-5 gap-4">
                    {inventory.map((item) => (
                      <button
                        key={item.size}
                        type="button"
                        onClick={() => setSelectedSize(item.size)}
                        disabled={item.remaining_quantity === 0}
                        className={`relative px-6 py-6 rounded-2xl font-sans text-xl transition-all duration-300 ${
                          selectedSize === item.size
                            ? 'bg-gradient-to-br from-gold-400 to-terra-400 text-zinc-950 border-2 border-gold-300 scale-110 shadow-2xl shadow-gold-500/30'
                            : item.remaining_quantity === 0
                            ? 'bg-forest-950 text-sage-700 border-2 border-forest-900 cursor-not-allowed opacity-40'
                            : 'bg-forest-900/50 backdrop-blur-xl text-sage-200 border-2 border-gold-500/20 hover:border-gold-400 hover:scale-105 hover:shadow-xl'
                        }`}
                      >
                        <div className="text-3xl font-semibold">{item.size}</div>
                        <div className="text-xs mt-2 font-sans">{item.remaining_quantity > 0 ? `${item.remaining_quantity}` : 'Няма'}</div>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="md:col-span-2">
                    <label htmlFor="name" className="block text-sage-300 font-sans text-sm uppercase tracking-luxury mb-4">
                      Име и фамилия *
                    </label>
                    <input
                      type="text"
                      id="name"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-8 py-5 bg-forest-950/50 backdrop-blur-xl border-2 border-gold-500/20 rounded-2xl text-sage-100 placeholder-sage-600 focus:outline-none focus:ring-4 focus:ring-gold-400/30 focus:border-gold-400 transition-all text-lg font-extralight"
                      placeholder="Иван Петров"
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sage-300 font-sans text-sm uppercase tracking-luxury mb-4">
                      Имейл адрес *
                    </label>
                    <input
                      type="email"
                      id="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-8 py-5 bg-forest-950/50 backdrop-blur-xl border-2 border-gold-500/20 rounded-2xl text-sage-100 placeholder-sage-600 focus:outline-none focus:ring-4 focus:ring-gold-400/30 focus:border-gold-400 transition-all text-lg font-extralight"
                      placeholder="ivan@example.com"
                    />
                  </div>

                  <div>
                    <label htmlFor="phone" className="block text-sage-300 font-sans text-sm uppercase tracking-luxury mb-4">
                      Телефон *
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-8 py-5 bg-forest-950/50 backdrop-blur-xl border-2 border-gold-500/20 rounded-2xl text-sage-100 placeholder-sage-600 focus:outline-none focus:ring-4 focus:ring-gold-400/30 focus:border-gold-400 transition-all text-lg font-extralight"
                      placeholder="0888 123 456"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="address" className="block text-sage-300 font-sans text-sm uppercase tracking-luxury mb-4">
                    Адрес за доставка *
                  </label>
                  <textarea
                    id="address"
                    required
                    rows={3}
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    className="w-full px-8 py-5 bg-forest-950/50 backdrop-blur-xl border-2 border-gold-500/20 rounded-2xl text-sage-100 placeholder-sage-600 focus:outline-none focus:ring-4 focus:ring-gold-400/30 focus:border-gold-400 transition-all resize-none text-lg font-extralight"
                    placeholder="гр. София, ул. Витоша 1, ет. 2, ап. 5"
                  />
                </div>

                <button
                  type="submit"
                  disabled={!selectedSize || orderStatus === 'loading'}
                  className="w-full px-12 py-8 bg-gradient-to-r from-gold-400 to-terra-400 hover:from-gold-500 hover:to-terra-500 text-zinc-950 font-bold rounded-3xl transition-all duration-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-4 text-xl shadow-2xl shadow-gold-500/30 hover:scale-[1.02] hover:shadow-gold-500/50 group relative overflow-hidden"
                >
                  <div className="absolute inset-0 bg-shimmer animate-shimmer"></div>
                  <span className="relative uppercase tracking-luxury">
                    {orderStatus === 'loading' ? 'Обработва се...' : 'Поръчай сега'}
                  </span>
                  <ArrowRight className="w-7 h-7 group-hover:translate-x-2 transition-transform relative" />
                </button>

                <div className="flex items-center justify-center space-x-12 pt-8 text-sage-500 font-extralight">
                  <div className="flex items-center space-x-3">
                    <Clock className="w-5 h-5 text-gold-400" />
                    <span>Доставка до 24 часа</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Shield className="w-5 h-5 text-gold-400" />
                    <span>Наложен платеж</span>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </section>

        <footer className="border-t-2 border-gold-500/10 py-16 px-6 bg-zinc-950 relative overflow-hidden">
          <div className="absolute inset-0 bg-shimmer animate-shimmer opacity-30"></div>
          <div className="max-w-7xl mx-auto text-center relative">
            <div className="text-4xl font-sans tracking-tight mb-8">
              <span className="text-sage-100">C</span>
              <span className="text-transparent bg-gradient-to-r from-gold-400 to-terra-400 bg-clip-text">100</span>
            </div>
            <p className="text-sage-400 mb-6 font-extralight text-lg">
              Ексклузивни лимитирани колекции. 100 броя. Никога повече.
            </p>
            <p className="text-sage-600 text-sm font-extralight">
              &copy; 2025 C100. Всички права запазени. Цените включват ДДС 20%.
            </p>
          </div>
        </footer>
      </div>
    </>
  );
}
