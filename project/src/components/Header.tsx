import { ShoppingBag, Menu, X } from 'lucide-react';
import { Link } from '../lib/router';
import { useState } from 'react';

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <>
      <div className="bg-gradient-to-r from-zinc-900 via-zinc-800 to-zinc-900 text-zinc-100 py-2 px-4 text-center text-sm font-medium border-b border-zinc-700">
        <Link to="/club-100" className="hover:text-amber-400 transition-colors">
          Early Access for Club 100 Members – Learn More
        </Link>
      </div>

      <header className="sticky top-0 z-40 bg-zinc-950/95 backdrop-blur-sm border-b border-zinc-800">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="flex items-center space-x-2">
              <div className="text-2xl font-bold tracking-tighter">
                <span className="text-zinc-100">CLUB</span>
                <span className="text-amber-500"> 100</span>
              </div>
            </Link>

            <div className="hidden md:flex items-center space-x-8">
              <Link to="/" className="text-zinc-300 hover:text-zinc-100 transition-colors text-sm font-medium">
                Home
              </Link>
              <Link to="/shop/collection-1-genesis" className="text-zinc-300 hover:text-zinc-100 transition-colors text-sm font-medium">
                Shop
              </Link>
              <Link to="/club-100" className="text-zinc-300 hover:text-zinc-100 transition-colors text-sm font-medium">
                Club 100
              </Link>
              <Link to="/archive" className="text-zinc-300 hover:text-zinc-100 transition-colors text-sm font-medium">
                Archive
              </Link>
              <Link to="/about" className="text-zinc-300 hover:text-zinc-100 transition-colors text-sm font-medium">
                About
              </Link>
            </div>

            <div className="flex items-center space-x-4">
              <button className="p-2 text-zinc-300 hover:text-zinc-100 transition-colors">
                <ShoppingBag className="w-5 h-5" />
              </button>
              <button
                className="md:hidden p-2 text-zinc-300 hover:text-zinc-100 transition-colors"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>

          {isMenuOpen && (
            <div className="md:hidden py-4 space-y-4 border-t border-zinc-800">
              <Link
                to="/"
                className="block text-zinc-300 hover:text-zinc-100 transition-colors text-sm font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              <Link
                to="/shop/collection-1-genesis"
                className="block text-zinc-300 hover:text-zinc-100 transition-colors text-sm font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                Shop
              </Link>
              <Link
                to="/club-100"
                className="block text-zinc-300 hover:text-zinc-100 transition-colors text-sm font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                Club 100
              </Link>
              <Link
                to="/archive"
                className="block text-zinc-300 hover:text-zinc-100 transition-colors text-sm font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                Archive
              </Link>
              <Link
                to="/about"
                className="block text-zinc-300 hover:text-zinc-100 transition-colors text-sm font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                About
              </Link>
            </div>
          )}
        </nav>
      </header>
    </>
  );
}
