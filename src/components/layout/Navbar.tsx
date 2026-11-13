import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Compass, Sparkles, Award, Menu, X, Landmark } from 'lucide-react';

export const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { to: '/', label: 'Khám Phá Di Sản', icon: Compass },
    { to: '/journey', label: 'Hành Trình AI', icon: Sparkles, highlight: true },
    { to: '/passport', label: 'Hộ Chiếu Văn Hóa', icon: Award },
  ];

  const isActive = (path: string) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <nav className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-stone-200/80 shadow-sm transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo & Brand Identity */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 rounded-xl bg-primary-900 flex items-center justify-center text-ivory-100 shadow-md group-hover:bg-primary-800 transition-colors">
              <Landmark className="w-5 h-5 text-ochre-400" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-serif font-bold text-xl tracking-wide text-primary-950">
                  Hồn Làng
                </span>
                <span className="text-[10px] uppercase tracking-wider px-1.5 py-0.5 bg-ochre-100 text-ochre-800 font-semibold rounded">
                  Hue MVP
                </span>
              </div>
              <p className="text-[11px] text-stone-500 font-medium hidden sm:block">
                Bản đồ văn hóa sống Việt Nam
              </p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1 lg:space-x-2">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const active = isActive(link.to);
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-sm font-medium transition-colors ${
                    active
                      ? 'bg-primary-900 text-ivory-100 shadow-sm'
                      : link.highlight
                      ? 'text-terracotta-600 hover:bg-terracotta-50 font-semibold'
                      : 'text-stone-700 hover:bg-stone-100'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${active ? 'text-ochre-300' : ''}`} />
                  <span>{link.label}</span>
                </Link>
              );
            })}

            {/* Preparation / Hackathon Badge */}
            <div className="pl-3 border-l border-stone-200">
              <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-800 border border-emerald-200">
                <span className="w-2 h-2 rounded-full bg-emerald-500 mr-1.5 animate-pulse" />
                DevFest 2026 Ready
              </span>
            </div>
          </div>

          {/* Mobile Hamburger */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-lg text-stone-600 hover:text-stone-900 hover:bg-stone-100"
              aria-label="Toggle navigation menu"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isOpen && (
        <div className="md:hidden border-b border-stone-200 bg-white px-4 pt-2 pb-4 space-y-1">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const active = isActive(link.to);
            return (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setIsOpen(false)}
                className={`flex items-center space-x-3 px-3 py-2.5 rounded-lg text-base font-medium ${
                  active
                    ? 'bg-primary-900 text-ivory-100'
                    : 'text-stone-700 hover:bg-stone-100'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span>{link.label}</span>
              </Link>
            );
          })}
        </div>
      )}
    </nav>
  );
};

