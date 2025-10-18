import { Link } from '../lib/router';
import { Instagram, Facebook, Mail } from 'lucide-react';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-zinc-950 border-t border-zinc-800 text-zinc-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="text-2xl font-bold tracking-tighter mb-4">
              <span className="text-zinc-100">CLUB</span>
              <span className="text-amber-500"> 100</span>
            </div>
            <p className="text-sm leading-relaxed">
              Limited edition T-shirts. 100 pieces per drop. Never reprinted. Own your serial number.
            </p>
          </div>

          <div>
            <h3 className="text-zinc-100 font-semibold mb-4 text-sm uppercase tracking-wider">Shop</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/shop/collection-1-genesis" className="hover:text-zinc-100 transition-colors">
                  Current Drop
                </Link>
              </li>
              <li>
                <Link to="/archive" className="hover:text-zinc-100 transition-colors">
                  Archive
                </Link>
              </li>
              <li>
                <Link to="/club-100" className="hover:text-zinc-100 transition-colors">
                  Join Club 100
                </Link>
              </li>
              <li>
                <Link to="/verify" className="hover:text-zinc-100 transition-colors">
                  Verify Authenticity
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-zinc-100 font-semibold mb-4 text-sm uppercase tracking-wider">Info</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/about" className="hover:text-zinc-100 transition-colors">
                  About
                </Link>
              </li>
              <li>
                <Link to="/faq" className="hover:text-zinc-100 transition-colors">
                  FAQ
                </Link>
              </li>
              <li>
                <Link to="/shipping-returns" className="hover:text-zinc-100 transition-colors">
                  Shipping & Returns
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-zinc-100 transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-zinc-100 font-semibold mb-4 text-sm uppercase tracking-wider">Legal</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/terms" className="hover:text-zinc-100 transition-colors">
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="hover:text-zinc-100 transition-colors">
                  Privacy Policy
                </Link>
              </li>
            </ul>
            <div className="flex space-x-4 mt-6">
              <a href="#" className="hover:text-zinc-100 transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="hover:text-zinc-100 transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="mailto:info@club100.bg" className="hover:text-zinc-100 transition-colors">
                <Mail className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-zinc-800 text-center text-sm">
          <p>&copy; {currentYear} Club 100. All rights reserved. Prices include VAT 20%.</p>
        </div>
      </div>
    </footer>
  );
}
