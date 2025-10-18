import { useState, useEffect } from 'react';
import { CheckCircle, Package, Mail, Phone, MapPin, Truck } from 'lucide-react';
import { Link, useRouter } from '../lib/router';
import { supabase } from '../lib/supabase';
import { SEOHead } from '../components/SEOHead';

interface Order {
  id: string;
  order_number: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  shirt_size: string;
  shirt_number: number;
  street_address: string;
  city: string;
  postal_code: string;
  status: string;
  created_at: string;
}

export function OrderConfirmationPage() {
  const { navigate } = useRouter();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  const params = new URLSearchParams(window.location.search);
  const orderId = params.get('order');

  useEffect(() => {
    if (!orderId) {
      navigate('/');
      return;
    }

    loadOrder();
  }, [orderId, navigate]);

  const loadOrder = async () => {
    try {
      const { data, error } = await supabase
        .from('basic_orders')
        .select('*')
        .eq('id', orderId)
        .maybeSingle();

      if (error || !data) {
        navigate('/');
        return;
      }

      setOrder(data);
    } catch (err) {
      console.error('Error loading order:', err);
      navigate('/');
    } finally {
      setLoading(false);
    }
  };

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

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <div className="text-zinc-400">Loading...</div>
      </div>
    );
  }

  if (!order) {
    return null;
  }

  const price = calculatePrice(order.shirt_number);

  return (
    <>
      <SEOHead
        title="Order Confirmed - Club 100"
        description="Your order has been confirmed"
      />

      <div className="bg-zinc-950 min-h-screen">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-green-500/10 border-2 border-green-500 rounded-full mb-6">
              <CheckCircle className="w-10 h-10 text-green-500" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-zinc-100 mb-4">
              Order Confirmed!
            </h1>
            <p className="text-xl text-zinc-400 mb-2">
              Thank you for your purchase, {order.customer_name}!
            </p>
            <p className="text-zinc-500">
              Order Number: <span className="text-amber-500 font-bold">{order.order_number}</span>
            </p>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8 mb-8">
            <h2 className="text-2xl font-bold text-zinc-100 mb-6 flex items-center space-x-3">
              <Package className="w-6 h-6 text-amber-500" />
              <span>Your Order</span>
            </h2>

            <div className="bg-zinc-800 rounded-xl p-6 mb-6">
              <div className="flex items-start space-x-4">
                <div className="w-24 h-24 bg-zinc-700 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Package className="w-10 h-10 text-zinc-500" />
                </div>
                <div className="flex-1">
                  <h3 className="text-zinc-100 font-bold text-lg mb-2">
                    Club 100 - Genesis
                  </h3>
                  <div className="space-y-1 text-sm">
                    <p className="text-zinc-400">Size: <span className="text-zinc-100 font-semibold">{order.shirt_size}</span></p>
                    <p className="text-zinc-400">
                      Serial Number: <span className="text-amber-500 font-bold">№ {order.shirt_number}/100</span>
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-zinc-100">{price.toFixed(2)} BGN</p>
                  <p className="text-zinc-500 text-xs mt-1">VAT included</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <h3 className="text-zinc-100 font-semibold flex items-center space-x-2">
                  <Mail className="w-4 h-4 text-amber-500" />
                  <span>Contact Information</span>
                </h3>
                <div className="text-zinc-400 text-sm space-y-1">
                  <p>{order.customer_email}</p>
                  <p className="flex items-center space-x-2">
                    <Phone className="w-4 h-4" />
                    <span>{order.customer_phone}</span>
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                <h3 className="text-zinc-100 font-semibold flex items-center space-x-2">
                  <MapPin className="w-4 h-4 text-amber-500" />
                  <span>Shipping Address</span>
                </h3>
                <div className="text-zinc-400 text-sm space-y-1">
                  <p>{order.street_address}</p>
                  <p>{order.city}, {order.postal_code}</p>
                  <p>Bulgaria</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-amber-500/10 border border-amber-500/20 rounded-2xl p-6 mb-8">
            <div className="flex items-start space-x-4">
              <Truck className="w-6 h-6 text-amber-500 flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-zinc-100 font-bold mb-2">What Happens Next?</h3>
                <ul className="space-y-2 text-zinc-300 text-sm">
                  <li>• You'll receive a confirmation email at {order.customer_email}</li>
                  <li>• Our team will contact you within 24 hours to confirm delivery details</li>
                  <li>• Your exclusive Club 100 shirt will be carefully packaged</li>
                  <li>• Expected delivery: 2-3 business days within Bulgaria</li>
                  <li>• Free delivery included with your order</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 mb-8">
            <h3 className="text-zinc-100 font-bold mb-4">Order Timeline</h3>
            <div className="space-y-4">
              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <CheckCircle className="w-5 h-5 text-zinc-950" />
                </div>
                <div className="flex-1">
                  <p className="text-zinc-100 font-semibold">Order Placed</p>
                  <p className="text-zinc-400 text-sm">
                    {new Date(order.created_at).toLocaleString('en-GB', {
                      day: '2-digit',
                      month: 'short',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4 opacity-50">
                <div className="w-8 h-8 bg-zinc-700 rounded-full flex items-center justify-center flex-shrink-0">
                  <Package className="w-5 h-5 text-zinc-400" />
                </div>
                <div className="flex-1">
                  <p className="text-zinc-100 font-semibold">Processing</p>
                  <p className="text-zinc-400 text-sm">We're preparing your order</p>
                </div>
              </div>

              <div className="flex items-start space-x-4 opacity-50">
                <div className="w-8 h-8 bg-zinc-700 rounded-full flex items-center justify-center flex-shrink-0">
                  <Truck className="w-5 h-5 text-zinc-400" />
                </div>
                <div className="flex-1">
                  <p className="text-zinc-100 font-semibold">Shipped</p>
                  <p className="text-zinc-400 text-sm">On its way to you</p>
                </div>
              </div>

              <div className="flex items-start space-x-4 opacity-50">
                <div className="w-8 h-8 bg-zinc-700 rounded-full flex items-center justify-center flex-shrink-0">
                  <CheckCircle className="w-5 h-5 text-zinc-400" />
                </div>
                <div className="flex-1">
                  <p className="text-zinc-100 font-semibold">Delivered</p>
                  <p className="text-zinc-400 text-sm">Enjoy your Club 100 piece</p>
                </div>
              </div>
            </div>
          </div>

          <div className="text-center space-y-4">
            <Link
              to="/"
              className="inline-block px-8 py-4 bg-amber-500 hover:bg-amber-600 text-zinc-950 font-bold rounded-xl transition-all"
            >
              Back to Homepage
            </Link>
            <p className="text-zinc-500 text-sm">
              Questions? Email us at <a href="mailto:hello@club100.bg" className="text-amber-500 hover:underline">hello@club100.bg</a>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
