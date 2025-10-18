import { useState, useEffect } from 'react';
import { ArrowLeft, ShoppingBag, CheckCircle } from 'lucide-react';
import { Link, useRouter } from '../lib/router';
import { supabase } from '../lib/supabase';
import { SEOHead } from '../components/SEOHead';

export function CheckoutPage() {
  const { navigate } = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const params = new URLSearchParams(window.location.search);
  const shirtNumber = Number(params.get('number'));
  const shirtSize = params.get('size') || 'L';

  const [formData, setFormData] = useState({
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    streetAddress: '',
    city: '',
    postalCode: '',
  });

  useEffect(() => {
    if (!shirtNumber || shirtNumber < 1 || shirtNumber > 100) {
      navigate('/shop/collection-1-genesis');
    }
  }, [shirtNumber, navigate]);

  const calculatePrice = (number: number): number => {
    const specialNumbers = [10, 20, 30, 40, 50, 60, 70, 80, 90, 100];

    if (specialNumbers.includes(number)) {
      if (number === 100) {
        return 89.90 + 100 + 50;
      }
      return 89.90 + number;
    }

    return 89.90;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const { data: numberCheck } = await supabase
        .from('shirt_numbers')
        .select('is_sold')
        .eq('number', shirtNumber)
        .maybeSingle();

      if (numberCheck?.is_sold) {
        setError('This number has already been sold. Please choose another.');
        setIsSubmitting(false);
        return;
      }

      const orderNumber = `C100-${String(shirtNumber).padStart(3, '0')}`;

      const { data: orderData, error: orderError } = await supabase
        .from('basic_orders')
        .insert([
          {
            order_number: orderNumber,
            customer_name: formData.customerName,
            customer_email: formData.customerEmail,
            customer_phone: formData.customerPhone,
            shirt_size: shirtSize,
            shirt_number: shirtNumber,
            street_address: formData.streetAddress,
            city: formData.city,
            postal_code: formData.postalCode,
            status: 'pending',
          },
        ])
        .select()
        .single();

      if (orderError) throw orderError;

      const { error: updateError } = await supabase
        .from('shirt_numbers')
        .update({
          is_sold: true,
          sold_at: new Date().toISOString(),
          order_email: formData.customerEmail,
        })
        .eq('number', shirtNumber);

      if (updateError) throw updateError;

      navigate(`/order-confirmation?order=${orderData.id}`);
    } catch (err: any) {
      console.error('Order submission error:', err);
      setError(err.message || 'Failed to submit order. Please try again.');
      setIsSubmitting(false);
    }
  };

  if (!shirtNumber) {
    return null;
  }

  const price = calculatePrice(shirtNumber);

  return (
    <>
      <SEOHead
        title="Checkout - Club 100"
        description="Complete your order"
      />

      <div className="bg-zinc-950 min-h-screen">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <Link
            to="/shop/collection-1-genesis"
            className="inline-flex items-center space-x-2 text-zinc-400 hover:text-zinc-100 transition-colors mb-8"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Product</span>
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2">
              <h1 className="text-4xl font-bold text-zinc-100 mb-8">Checkout</h1>

              {error && (
                <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-500">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 space-y-6">
                  <h2 className="text-xl font-bold text-zinc-100">Contact Information</h2>

                  <div>
                    <label htmlFor="customerName" className="block text-zinc-300 text-sm font-semibold mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      id="customerName"
                      name="customerName"
                      value={formData.customerName}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-xl text-zinc-100 focus:border-amber-500 focus:outline-none"
                      placeholder="Ivan Petrov"
                    />
                  </div>

                  <div>
                    <label htmlFor="customerEmail" className="block text-zinc-300 text-sm font-semibold mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      id="customerEmail"
                      name="customerEmail"
                      value={formData.customerEmail}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-xl text-zinc-100 focus:border-amber-500 focus:outline-none"
                      placeholder="ivan@example.com"
                    />
                  </div>

                  <div>
                    <label htmlFor="customerPhone" className="block text-zinc-300 text-sm font-semibold mb-2">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      id="customerPhone"
                      name="customerPhone"
                      value={formData.customerPhone}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-xl text-zinc-100 focus:border-amber-500 focus:outline-none"
                      placeholder="+359 88 123 4567"
                    />
                  </div>
                </div>

                <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 space-y-6">
                  <h2 className="text-xl font-bold text-zinc-100">Shipping Address</h2>

                  <div>
                    <label htmlFor="streetAddress" className="block text-zinc-300 text-sm font-semibold mb-2">
                      Street Address *
                    </label>
                    <input
                      type="text"
                      id="streetAddress"
                      name="streetAddress"
                      value={formData.streetAddress}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-xl text-zinc-100 focus:border-amber-500 focus:outline-none"
                      placeholder="ul. Vitosha 15"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="city" className="block text-zinc-300 text-sm font-semibold mb-2">
                        City *
                      </label>
                      <input
                        type="text"
                        id="city"
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-xl text-zinc-100 focus:border-amber-500 focus:outline-none"
                        placeholder="Sofia"
                      />
                    </div>

                    <div>
                      <label htmlFor="postalCode" className="block text-zinc-300 text-sm font-semibold mb-2">
                        Postal Code *
                      </label>
                      <input
                        type="text"
                        id="postalCode"
                        name="postalCode"
                        value={formData.postalCode}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-xl text-zinc-100 focus:border-amber-500 focus:outline-none"
                        placeholder="1000"
                      />
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full px-8 py-4 bg-amber-500 hover:bg-amber-600 text-zinc-950 font-bold rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 text-lg"
                >
                  {isSubmitting ? (
                    <span>Processing...</span>
                  ) : (
                    <>
                      <CheckCircle className="w-5 h-5" />
                      <span>Complete Order</span>
                    </>
                  )}
                </button>
              </form>
            </div>

            <div>
              <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 sticky top-8">
                <h2 className="text-xl font-bold text-zinc-100 mb-6">Order Summary</h2>

                <div className="space-y-4 mb-6 pb-6 border-b border-zinc-800">
                  <div className="flex items-start space-x-4">
                    <div className="w-20 h-20 bg-zinc-800 rounded-lg flex items-center justify-center">
                      <ShoppingBag className="w-8 h-8 text-zinc-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-zinc-100 font-semibold">Club 100 - Genesis</h3>
                      <p className="text-zinc-400 text-sm mt-1">
                        Size: {shirtSize}
                      </p>
                      <p className="text-amber-500 font-bold text-sm mt-1">
                        Serial № {shirtNumber}/100
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-zinc-400">
                    <span>Base Price</span>
                    <span>89.90 BGN</span>
                  </div>
                  {price > 89.90 && (
                    <div className="flex justify-between text-zinc-400">
                      <span>Special Number Fee</span>
                      <span>+{(price - 89.90).toFixed(2)} BGN</span>
                    </div>
                  )}
                  <div className="flex justify-between text-zinc-400">
                    <span>Shipping</span>
                    <span className="text-green-500">FREE</span>
                  </div>
                </div>

                <div className="pt-6 border-t border-zinc-800">
                  <div className="flex justify-between items-center">
                    <span className="text-zinc-100 font-bold text-lg">Total</span>
                    <span className="text-amber-500 font-bold text-2xl">{price.toFixed(2)} BGN</span>
                  </div>
                  <p className="text-zinc-500 text-xs mt-2">VAT 20% included</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
