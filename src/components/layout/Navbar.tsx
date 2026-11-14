import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Award,
  Compass,
  Globe,
  LogIn,
  LogOut,
  Menu,
  Sparkles,
  UserCheck,
  X,
} from 'lucide-react';
import { useAuth } from '../../lib/auth';
import { useLocale, useTranslations } from '../../lib/i18n';
import { TagBadge } from '../shared/TagBadge';

export const Navbar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { locale, setLocale } = useLocale();
  const { user, isAuthenticated, logout } = useAuth();
  const t = useTranslations();

  const [scrolled, setScrolled] = useState<boolean>(false);
  const [openMenuRouteKey, setOpenMenuRouteKey] = useState<string | null>(null);

  const currentRouteKey = `${location.pathname}${location.search}`;
  const mobileMenuOpen = openMenuRouteKey === currentRouteKey;

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [location.pathname, location.search]);

  const navLinks = [
    { to: '/', label: t.nav.explore, icon: Compass },
    { to: '/journey', label: t.nav.journey, icon: Sparkles },
    { to: '/passport', label: t.nav.passport, icon: Award },
  ];

  const isActive = (path: string): boolean => {
    if (path === '/') {
      return (
        location.pathname === '/' ||
        location.pathname.startsWith('/places/') ||
        location.pathname.startsWith('/place/')
      );
    }
    return location.pathname.startsWith(path);
  };

  const toggleLocale = () => {
    setLocale(locale === 'vi' ? 'en' : 'vi');
  };

  const toggleMobileMenu = () => {
    setOpenMenuRouteKey((prev) => (prev === currentRouteKey ? null : currentRouteKey));
  };

  const handleLogoutClick = async () => {
    setOpenMenuRouteKey(null);
    await logout();
    navigate('/auth');
  };

  // Mọi trang đều có header/hero nền charcoal ở đỉnh trang; khi chưa cuộn và đóng menu mobile thì nền trong suốt chữ cream
  const isSolidSurface = scrolled || mobileMenuOpen;

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-colors duration-400 ${
        isSolidSurface
          ? 'bg-parchment/92 backdrop-blur-md border-b border-stone shadow-hover text-ink'
          : 'bg-transparent border-b border-cream/15 text-cream'
      }`}
    >
      <div className="max-w-content mx-auto px-5 sm:px-10 h-18 flex items-center justify-between gap-2 sm:gap-4">
        {/* Brand Logo */}
        <Link
          to="/"
          onClick={() => setOpenMenuRouteKey(null)}
          className="inline-flex items-center gap-3 min-h-[44px] focus:outline-none shrink-0"
        >
          <span
            className={`font-display font-semibold text-[22px] sm:text-[26px] leading-none tracking-tight transition-colors duration-300 ${
              isSolidSurface ? 'text-charcoal' : 'text-cream'
            }`}
          >
            {t.brand.name}
          </span>
          <span className="hidden sm:inline-flex">
            <TagBadge variant="gold">HoaLang</TagBadge>
          </span>
        </Link>

        {/* Desktop Navigation Links & Identity Bar */}
        <div className="hidden lg:flex items-center gap-6 lg:gap-8">
          {navLinks.map((link) => {
            const active = isActive(link.to);
            return (
              <Link
                key={link.to}
                to={link.to}
                className={`inline-flex items-center min-h-[44px] font-body text-[12px] uppercase tracking-[0.10em] transition-colors duration-300 ${
                  active
                    ? isSolidSurface
                      ? 'text-lacquer font-semibold border-b-2 border-lacquer'
                      : 'text-gold font-semibold border-b-2 border-gold'
                    : isSolidSurface
                      ? 'text-ink hover:text-lacquer font-medium'
                      : 'text-cream/85 hover:text-gold font-medium'
                }`}
              >
                {link.label}
              </Link>
            );
          })}

          {/* Language Switcher */}
          <button
            type="button"
            onClick={toggleLocale}
            className={`inline-flex items-center gap-1.5 min-h-[36px] px-3 py-1 rounded-xs border font-body text-[11px] font-semibold uppercase tracking-[0.12em] transition-colors duration-300 ${
              isSolidSurface
                ? 'border-stone text-ink hover:border-bronze'
                : 'border-cream/40 text-cream hover:border-gold hover:text-gold'
            }`}
            aria-label={t.nav.language}
          >
            <Globe className="w-3.5 h-3.5 text-gold" />
            <span>{locale === 'vi' ? 'VI · EN' : 'EN · VI'}</span>
          </button>

          {/* Identity Badge ("Biết ai là ai") / Login CTA */}
          {isAuthenticated && user ? (
            <div className="flex items-center gap-2">
              <Link
                to="/auth"
                className={`inline-flex items-center gap-2.5 min-h-[40px] pl-2 pr-3.5 py-1 rounded-sm border transition-colors duration-300 ${
                  isSolidSurface
                    ? 'bg-cream border-stone text-charcoal hover:border-bronze'
                    : 'bg-charcoal/80 border-gold/50 text-cream hover:border-gold'
                }`}
              >
                <span className="w-7 h-7 rounded-xs bg-lacquer border border-gold flex items-center justify-center font-display text-xs font-bold text-cream">
                  {user.avatarInitials}
                </span>
                <span className="text-left leading-tight">
                  <span className="block font-body text-[11px] font-semibold tracking-[0.06em]">
                    {user.fullName}
                  </span>
                  <span className="block font-body text-[9px] uppercase tracking-[0.10em] text-gold">
                    {user.title}
                  </span>
                </span>
              </Link>

              <button
                type="button"
                onClick={handleLogoutClick}
                title={t.nav.logoutCta}
                aria-label={t.nav.logoutCta}
                className={`inline-flex items-center justify-center min-h-[40px] min-w-[40px] rounded-sm border transition-colors duration-300 ${
                  isSolidSurface
                    ? 'border-stone text-ash hover:text-lacquer hover:border-lacquer'
                    : 'border-cream/35 text-cream/80 hover:text-gold hover:border-gold'
                }`}
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <Link
              to="/auth"
              className="inline-flex items-center gap-2 min-h-[40px] px-4 py-2 rounded-sm bg-lacquer text-cream border border-lacquer font-body text-[11px] font-semibold uppercase tracking-[0.12em] hover:brightness-90 transition-all duration-300"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>{t.nav.loginCta}</span>
            </Link>
          )}
        </div>

        {/* Mobile Controls (Identity/Login + Language + Hamburger) */}
        <div className="flex lg:hidden shrink-0 items-center gap-2">
          <Link
            to="/auth"
            onClick={() => setOpenMenuRouteKey(null)}
            className={`inline-flex items-center justify-center min-h-[44px] px-2.5 whitespace-nowrap rounded-xs border font-body text-[11px] font-semibold uppercase tracking-[0.08em] ${
              isAuthenticated && user
                ? 'bg-lacquer text-cream border-gold'
                : isSolidSurface
                  ? 'border-lacquer bg-lacquer text-cream'
                  : 'border-gold/60 bg-charcoal/80 text-gold'
            }`}
          >
            {isAuthenticated && user ? user.avatarInitials : t.nav.loginCta}
          </Link>

          <button
            type="button"
            onClick={toggleLocale}
            className={`inline-flex items-center justify-center min-h-[44px] min-w-[44px] px-2.5 rounded-xs border font-body text-[11px] font-semibold uppercase tracking-[0.10em] transition-colors duration-300 ${
              isSolidSurface
                ? 'border-stone text-ink'
                : 'border-cream/40 text-cream'
            }`}
            aria-label={t.nav.language}
          >
            {locale.toUpperCase()}
          </button>

          <button
            type="button"
            onClick={toggleMobileMenu}
            className={`inline-flex items-center justify-center min-h-[44px] min-w-[44px] rounded-xs border transition-colors duration-300 ${
              isSolidSurface
                ? 'border-stone text-charcoal hover:border-bronze'
                : 'border-cream/40 text-cream hover:border-gold'
            }`}
            aria-expanded={mobileMenuOpen}
            aria-label={mobileMenuOpen ? t.nav.closeMenu : t.nav.openMenu}
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-parchment border-b border-stone px-5 py-4 space-y-2.5 shadow-hover">
          {/* Active Identity Card inside Mobile Drawer */}
          {isAuthenticated && user ? (
            <div className="p-3.5 bg-cream border border-stone rounded-sm flex items-center justify-between gap-3">
              <Link
                to="/auth"
                onClick={() => setOpenMenuRouteKey(null)}
                className="flex items-center gap-3"
              >
                <span className="w-9 h-9 rounded-xs bg-lacquer border border-gold flex items-center justify-center font-display text-sm font-bold text-cream">
                  {user.avatarInitials}
                </span>
                <div>
                  <div className="font-body text-xs font-semibold text-charcoal">
                    {user.fullName}
                  </div>
                  <div className="font-body text-[10px] uppercase tracking-[0.10em] text-gold">
                    {user.title}
                  </div>
                </div>
              </Link>
              <button
                type="button"
                onClick={handleLogoutClick}
                className="inline-flex items-center gap-1 min-h-[38px] px-3 py-1.5 rounded-xs border border-stone font-body text-[10px] font-semibold uppercase tracking-[0.10em] text-lacquer"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>{t.nav.logoutCta}</span>
              </button>
            </div>
          ) : (
            <Link
              to="/auth"
              onClick={() => setOpenMenuRouteKey(null)}
              className="flex items-center justify-center gap-2 min-h-[44px] px-4 py-2.5 rounded-sm bg-lacquer text-cream border border-lacquer font-body text-[12px] font-semibold uppercase tracking-[0.12em]"
            >
              <LogIn className="w-4 h-4" />
              <span>
                {t.nav.loginCta} / {t.nav.registerCta}
              </span>
            </Link>
          )}

          {navLinks.map((link) => {
            const active = isActive(link.to);
            const Icon = link.icon;
            return (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setOpenMenuRouteKey(null)}
                className={`flex items-center gap-3 min-h-[44px] px-4 py-2.5 rounded-sm border font-body text-[12px] uppercase tracking-[0.10em] transition-colors duration-300 ${
                  active
                    ? 'bg-cream border-lacquer text-lacquer font-semibold'
                    : 'bg-cream/60 border-stone text-ink hover:border-bronze'
                }`}
              >
                <Icon className="w-4 h-4 text-gold shrink-0" />
                <span>{link.label}</span>
              </Link>
            );
          })}

          <Link
            to="/auth"
            onClick={() => setOpenMenuRouteKey(null)}
            className={`flex items-center gap-3 min-h-[44px] px-4 py-2.5 rounded-sm border font-body text-[12px] uppercase tracking-[0.10em] transition-colors duration-300 ${
              location.pathname === '/auth'
                ? 'bg-cream border-lacquer text-lacquer font-semibold'
                : 'bg-cream/60 border-stone text-ink hover:border-bronze'
            }`}
          >
            <UserCheck className="w-4 h-4 text-gold shrink-0" />
            <span>{t.nav.profileCta}</span>
          </Link>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
