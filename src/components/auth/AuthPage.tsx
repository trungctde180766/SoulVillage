import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  CheckCircle2,
  Eye,
  EyeOff,
  LogIn,
  LogOut,
  ShieldCheck,
  Sparkles,
  UserCheck,
  UserPlus,
} from 'lucide-react';
import type { CulturalMemberRole } from '../../types/auth';
import { useAuth } from '../../lib/auth';
import { useTranslations } from '../../lib/i18n';
import {
  Button,
  Input,
  OrnamentDivider,
  PageHeader,
  SectionLabel,
  TagBadge,
} from '../shared';

type AuthTabMode = 'login' | 'register' | 'profile';

export const AuthPage: React.FC = () => {
  const navigate = useNavigate();
  const t = useTranslations();
  const {
    user,
    isAuthenticated,
    demoAccounts,
    login,
    register,
    quickSwitchDemo,
    updateProfile,
    logout,
  } = useAuth();

  const [activeTab, setActiveTab] = useState<AuthTabMode>(() =>
    isAuthenticated ? 'profile' : 'login'
  );
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState<boolean>(false);

  // Login Form State
  const [loginEmail, setLoginEmail] = useState<string>('');
  const [loginPassword, setLoginPassword] = useState<string>('');

  // Register Form State
  const [regName, setRegName] = useState<string>('');
  const [regEmail, setRegEmail] = useState<string>('');
  const [regRole, setRegRole] = useState<CulturalMemberRole>('visitor');
  const [regTitle, setRegTitle] = useState<string>('');
  const [regPassword, setRegPassword] = useState<string>('');
  const [regConfirmPassword, setRegConfirmPassword] = useState<string>('');

  // Profile Update Form State
  const [profileName, setProfileName] = useState<string>(user?.fullName || '');
  const [profileTitle, setProfileTitle] = useState<string>(user?.title || '');
  const [profileBio, setProfileBio] = useState<string>(user?.bio || '');

  const syncProfileDraft = (nextUser: { fullName: string; title: string; bio?: string }) => {
    setProfileName(nextUser.fullName);
    setProfileTitle(nextUser.title);
    setProfileBio(nextUser.bio || '');
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);
    setSubmitting(true);
    try {
      const loggedUser = await login({ email: loginEmail, password: loginPassword });
      syncProfileDraft(loggedUser);
      setActiveTab('profile');
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Đăng nhập thất bại.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    if (regPassword !== regConfirmPassword) {
      setErrorMsg(t.auth.passwordMismatchError);
      return;
    }

    setSubmitting(true);
    try {
      const createdUser = await register({
        fullName: regName,
        email: regEmail,
        password: regPassword,
        role: regRole,
        title: regTitle.trim() || undefined,
      });
      syncProfileDraft(createdUser);
      setActiveTab('profile');
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Đăng ký thất bại.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleQuickDemoLogin = async (email: string) => {
    setErrorMsg(null);
    setSuccessMsg(null);
    setSubmitting(true);
    try {
      const switchedUser = await quickSwitchDemo(email);
      syncProfileDraft(switchedUser);
      setActiveTab('profile');
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Chuyển danh tính thất bại.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);
    setSubmitting(true);
    try {
      const updated = await updateProfile({
        fullName: profileName,
        title: profileTitle,
        bio: profileBio,
      });
      syncProfileDraft(updated);
      setSuccessMsg(t.auth.profileUpdatedSuccess);
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Cập nhật hồ sơ thất bại.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleLogout = async () => {
    setErrorMsg(null);
    setSuccessMsg(null);
    await logout();
    setActiveTab('login');
  };

  const roleOptions: { id: CulturalMemberRole; label: string }[] = [
    { id: 'visitor', label: t.auth.roles.visitor },
    { id: 'artisan', label: t.auth.roles.artisan },
    { id: 'scholar', label: t.auth.roles.scholar },
    { id: 'tv1_lead', label: t.auth.roles.tv1_lead },
    { id: 'tv2_ai', label: t.auth.roles.tv2_ai },
    { id: 'tv3_curator', label: t.auth.roles.tv3_curator },
  ];

  return (
    <div className="min-h-screen bg-parchment text-ink pb-24">
      {/* 1. Editorial PageHeader */}
      <PageHeader
        label={t.auth.sectionLabel}
        title={t.auth.pageTitle}
        subtitle={t.auth.pageSubtitle}
        className="pt-28 sm:pt-32"
        breadcrumbs={[
          {
            label: t.nav.explore,
            onClick: () => navigate('/'),
          },
          {
            label: t.nav.auth,
          },
        ]}
      >
        {user && (
          <div className="inline-flex flex-wrap items-center gap-3 pt-2">
            <TagBadge variant="gold">{t.auth.statusVerified}</TagBadge>
            <span className="font-body text-caption text-cream/90">
              {t.auth.currentIdentityLabel}:{' '}
              <strong className="text-gold">{user.fullName}</strong> ({user.title})
            </span>
          </div>
        )}
      </PageHeader>

      <div className="max-w-content mx-auto px-5 sm:px-10 py-12 sm:py-16 space-y-10">
        {/* Mode Switcher Tabs */}
        <div className="flex flex-wrap items-center gap-3 border-b border-stone pb-4">
          <button
            type="button"
            onClick={() => {
              setErrorMsg(null);
              setSuccessMsg(null);
              setActiveTab('login');
            }}
            className={`inline-flex items-center gap-2 min-h-[44px] px-5 py-2.5 rounded-sm border font-body text-[12px] font-semibold uppercase tracking-[0.12em] transition-colors duration-300 ${
              activeTab === 'login'
                ? 'bg-lacquer text-cream border-lacquer'
                : 'bg-cream text-ink border-stone hover:border-bronze'
            }`}
          >
            <LogIn className="w-4 h-4" />
            <span>{t.auth.tabLogin}</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setErrorMsg(null);
              setSuccessMsg(null);
              setActiveTab('register');
            }}
            className={`inline-flex items-center gap-2 min-h-[44px] px-5 py-2.5 rounded-sm border font-body text-[12px] font-semibold uppercase tracking-[0.12em] transition-colors duration-300 ${
              activeTab === 'register'
                ? 'bg-lacquer text-cream border-lacquer'
                : 'bg-cream text-ink border-stone hover:border-bronze'
            }`}
          >
            <UserPlus className="w-4 h-4" />
            <span>{t.auth.tabRegister}</span>
          </button>

          {user && (
            <button
              type="button"
              onClick={() => {
                setErrorMsg(null);
                setSuccessMsg(null);
                syncProfileDraft(user);
                setActiveTab('profile');
              }}
              className={`inline-flex items-center gap-2 min-h-[44px] px-5 py-2.5 rounded-sm border font-body text-[12px] font-semibold uppercase tracking-[0.12em] transition-colors duration-300 ${
                activeTab === 'profile'
                  ? 'bg-lacquer text-cream border-lacquer'
                  : 'bg-cream text-ink border-stone hover:border-bronze'
              }`}
            >
              <UserCheck className="w-4 h-4" />
              <span>{t.auth.tabProfile}</span>
            </button>
          )}
        </div>

        {/* Asymmetric 12-Column Layout (7 cols Auth/Profile Form + 5 cols Quick Team Identity Switch) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
          {/* Left Column (7 cols): Login / Register / Active Profile */}
          <div className="lg:col-span-7 bg-cream border border-stone rounded-sm p-6 sm:p-10 space-y-6">
            {errorMsg && (
              <div
                role="alert"
                className="p-4 bg-lacquer/15 border border-lacquer/50 rounded-sm font-body text-body-sm text-lacquer"
              >
                {errorMsg}
              </div>
            )}

            {successMsg && (
              <div
                role="status"
                className="p-4 bg-gold/20 border border-gold/50 rounded-sm font-body text-body-sm text-charcoal flex items-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4 text-gold shrink-0" />
                <span>{successMsg}</span>
              </div>
            )}

            {activeTab === 'login' && (
              <form onSubmit={handleLoginSubmit} className="space-y-6">
                <div className="space-y-2 border-b border-stone pb-4">
                  <SectionLabel>{t.auth.tabLogin}</SectionLabel>
                  <h2 className="font-display text-display-md text-charcoal">
                    {t.auth.loginHeading}
                  </h2>
                  <p className="font-body text-body-sm text-ash">
                    {t.auth.loginSubheading}
                  </p>
                </div>

                <Input
                  id="login-email"
                  type="email"
                  required
                  label={t.auth.emailLabel}
                  placeholder={t.auth.emailPlaceholder}
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                />

                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label
                      htmlFor="login-password"
                      className="block font-body text-[11px] font-semibold uppercase tracking-[0.15em] text-ash"
                    >
                      {t.auth.passwordLabel}
                    </label>
                    <button
                      type="button"
                      onClick={() => setShowPassword((prev) => !prev)}
                      className="inline-flex items-center gap-1 font-body text-[11px] uppercase tracking-[0.10em] text-bronze hover:text-lacquer"
                    >
                      {showPassword ? (
                        <>
                          <EyeOff className="w-3.5 h-3.5" />
                          <span>{t.auth.hidePassword}</span>
                        </>
                      ) : (
                        <>
                          <Eye className="w-3.5 h-3.5" />
                          <span>{t.auth.showPassword}</span>
                        </>
                      )}
                    </button>
                  </div>
                  <input
                    id="login-password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder={t.auth.passwordPlaceholder}
                    className="w-full min-h-[44px] bg-parchment border border-stone py-3 px-4 rounded-sm text-base text-ink placeholder:text-ash focus:border-bronze focus:outline-none transition-colors duration-300"
                  />
                </div>

                <div className="pt-2 space-y-4">
                  <Button
                    type="submit"
                    variant="primary"
                    isLoading={submitting}
                    className="w-full"
                  >
                    {submitting ? t.auth.submitting : t.auth.loginSubmit}
                  </Button>

                  <div className="text-center">
                    <button
                      type="button"
                      onClick={() => {
                        setErrorMsg(null);
                        setActiveTab('register');
                      }}
                      className="font-body text-body-sm text-bronze border-b border-stone hover:text-lacquer hover:border-lacquer transition-colors duration-300"
                    >
                      {t.auth.switchToRegister}
                    </button>
                  </div>
                </div>
              </form>
            )}

            {activeTab === 'register' && (
              <form onSubmit={handleRegisterSubmit} className="space-y-5">
                <div className="space-y-2 border-b border-stone pb-4">
                  <SectionLabel>{t.auth.tabRegister}</SectionLabel>
                  <h2 className="font-display text-display-md text-charcoal">
                    {t.auth.registerHeading}
                  </h2>
                  <p className="font-body text-body-sm text-ash">
                    {t.auth.registerSubheading}
                  </p>
                </div>

                <Input
                  id="register-name"
                  type="text"
                  required
                  label={t.auth.fullNameLabel}
                  placeholder={t.auth.fullNamePlaceholder}
                  value={regName}
                  onChange={(e) => setRegName(e.target.value)}
                />

                <Input
                  id="register-email"
                  type="email"
                  required
                  label={t.auth.emailLabel}
                  placeholder={t.auth.emailPlaceholder}
                  value={regEmail}
                  onChange={(e) => setRegEmail(e.target.value)}
                />

                {/* Cultural Role Selection Chips */}
                <div className="space-y-2">
                  <label className="block font-body text-[11px] font-semibold uppercase tracking-[0.15em] text-ash">
                    {t.auth.roleLabel}
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {roleOptions.map((option) => {
                      const active = regRole === option.id;
                      return (
                        <button
                          key={option.id}
                          type="button"
                          onClick={() => setRegRole(option.id)}
                          className={`min-h-[44px] px-3.5 py-2.5 rounded-sm border text-left font-body text-caption transition-colors duration-300 ${
                            active
                              ? 'bg-gold/20 border-gold text-charcoal font-semibold'
                              : 'bg-parchment border-stone text-ink hover:border-bronze'
                          }`}
                        >
                          {option.label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <Input
                  id="register-title"
                  type="text"
                  label={t.auth.titleLabel}
                  placeholder={t.auth.titlePlaceholder}
                  value={regTitle}
                  onChange={(e) => setRegTitle(e.target.value)}
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    id="register-password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    label={t.auth.passwordLabel}
                    placeholder={t.auth.passwordPlaceholder}
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                  />
                  <Input
                    id="register-confirm-password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    label={t.auth.confirmPasswordLabel}
                    placeholder={t.auth.confirmPasswordPlaceholder}
                    value={regConfirmPassword}
                    onChange={(e) => setRegConfirmPassword(e.target.value)}
                  />
                </div>

                <div className="pt-2 space-y-4">
                  <Button
                    type="submit"
                    variant="primary"
                    isLoading={submitting}
                    className="w-full"
                  >
                    {submitting ? t.auth.submitting : t.auth.registerSubmit}
                  </Button>

                  <div className="text-center">
                    <button
                      type="button"
                      onClick={() => {
                        setErrorMsg(null);
                        setActiveTab('login');
                      }}
                      className="font-body text-body-sm text-bronze border-b border-stone hover:text-lacquer hover:border-lacquer transition-colors duration-300"
                    >
                      {t.auth.switchToLogin}
                    </button>
                  </div>
                </div>
              </form>
            )}

            {activeTab === 'profile' && user && (
              <div className="space-y-8">
                {/* Imperial Identity Seal Card */}
                <div className="p-6 sm:p-8 bg-parchment border-2 border-stone rounded-md space-y-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone pb-5">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 rounded-sm bg-lacquer border-2 border-gold flex items-center justify-center font-display text-2xl font-bold text-cream shrink-0">
                        {user.avatarInitials}
                      </div>
                      <div className="space-y-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <TagBadge variant="gold">
                            {t.auth.roles[user.role] || user.title}
                          </TagBadge>
                          <TagBadge variant="lacquer">
                            {t.auth.statusVerified}
                          </TagBadge>
                        </div>
                        <h2 className="font-display text-3xl text-charcoal">
                          {user.fullName}
                        </h2>
                        <p className="font-body text-body-sm text-bronze">
                          {user.title}
                        </p>
                      </div>
                    </div>
                  </div>

                  <dl className="grid grid-cols-1 sm:grid-cols-3 gap-4 font-body text-body-sm">
                    <div className="p-3.5 bg-cream border border-stone rounded-sm">
                      <dt className="text-label-sm uppercase text-ash">
                        {t.auth.emailLabel}
                      </dt>
                      <dd className="text-ink font-medium mt-1 break-all">
                        {user.email}
                      </dd>
                    </div>
                    <div className="p-3.5 bg-cream border border-stone rounded-sm">
                      <dt className="text-label-sm uppercase text-ash">
                        {t.auth.memberIdLabel}
                      </dt>
                      <dd className="text-ink font-medium mt-1">{user.id}</dd>
                    </div>
                    <div className="p-3.5 bg-cream border border-stone rounded-sm">
                      <dt className="text-label-sm uppercase text-ash">
                        {t.auth.joinedAtLabel}
                      </dt>
                      <dd className="text-ink font-medium mt-1">
                        {new Date(user.joinedAt).toLocaleDateString('vi-VN')}
                      </dd>
                    </div>
                  </dl>

                  {user.bio && (
                    <blockquote className="border-l-2 border-gold pl-4 italic font-display text-xl text-charcoal/90">
                      “{user.bio}”
                    </blockquote>
                  )}
                </div>

                <OrnamentDivider />

                {/* Edit Profile Form */}
                <form onSubmit={handleProfileUpdate} className="space-y-5">
                  <SectionLabel>{t.auth.tabProfile}</SectionLabel>

                  <Input
                    id="profile-name"
                    type="text"
                    required
                    label={t.auth.fullNameLabel}
                    value={profileName}
                    onChange={(e) => setProfileName(e.target.value)}
                  />

                  <Input
                    id="profile-title"
                    type="text"
                    required
                    label={t.auth.titleLabel}
                    value={profileTitle}
                    onChange={(e) => setProfileTitle(e.target.value)}
                  />

                  <div className="space-y-1.5">
                    <label
                      htmlFor="profile-bio"
                      className="block font-body text-[11px] font-semibold uppercase tracking-[0.15em] text-ash"
                    >
                      {t.auth.bioLabel}
                    </label>
                    <textarea
                      id="profile-bio"
                      rows={3}
                      value={profileBio}
                      onChange={(e) => setProfileBio(e.target.value)}
                      placeholder={t.auth.bioPlaceholder}
                      className="w-full bg-parchment border border-stone py-3 px-4 rounded-sm text-base text-ink placeholder:text-ash focus:border-bronze focus:outline-none transition-colors duration-300"
                    />
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
                    <Button type="submit" variant="primary" isLoading={submitting}>
                      {t.auth.updateProfileSubmit}
                    </Button>

                    <Button type="button" variant="ghost" onClick={handleLogout}>
                      <span className="inline-flex items-center gap-2">
                        <LogOut className="w-4 h-4 text-lacquer" />
                        <span>{t.auth.logoutButton}</span>
                      </span>
                    </Button>
                  </div>
                </form>
              </div>
            )}
          </div>

          {/* Right Column (5 cols): 1-Click Team & Demo Identity Switcher */}
          <aside className="lg:col-span-5 space-y-6">
            <div className="bg-cream border border-stone rounded-sm p-6 sm:p-8 space-y-6">
              <div className="space-y-2 border-b border-stone pb-4">
                <SectionLabel>{t.auth.quickDemoLabel}</SectionLabel>
                <h3 className="font-display text-display-md text-charcoal">
                  {t.auth.quickDemoHeading}
                </h3>
                <p className="font-body text-body-sm text-ash leading-relaxed">
                  {t.auth.quickDemoDesc}
                </p>
              </div>

              <div className="space-y-4">
                {demoAccounts.map((demo) => {
                  const isCurrent = user?.email.toLowerCase() === demo.email.toLowerCase();
                  return (
                    <div
                      key={demo.id}
                      className={`p-5 rounded-sm border transition-all duration-300 space-y-3 ${
                        isCurrent
                          ? 'bg-gold/15 border-gold'
                          : 'bg-parchment border-stone hover:border-bronze'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-10 h-10 rounded-xs border flex items-center justify-center font-display text-base font-bold shrink-0 ${
                              isCurrent
                                ? 'bg-lacquer text-cream border-gold'
                                : 'bg-charcoal text-gold border-stone'
                            }`}
                          >
                            {demo.avatarInitials}
                          </div>
                          <div>
                            <h4 className="font-display text-xl text-charcoal leading-tight">
                              {demo.fullName}
                            </h4>
                            <p className="font-body text-caption text-bronze">
                              {demo.title}
                            </p>
                          </div>
                        </div>

                        {isCurrent && (
                          <TagBadge variant="gold">
                            <span className="inline-flex items-center gap-1">
                              <ShieldCheck className="w-3 h-3" />
                              <span>{t.auth.activeAccountBadge}</span>
                            </span>
                          </TagBadge>
                        )}
                      </div>

                      <p className="font-body text-caption text-ash leading-relaxed">
                        {demo.bio}
                      </p>

                      <div className="flex items-center justify-between pt-2 border-t border-stone/50">
                        <span className="font-body text-[11px] text-ash">
                          {demo.email}
                        </span>
                        <button
                          type="button"
                          disabled={submitting || isCurrent}
                          onClick={() => handleQuickDemoLogin(demo.email)}
                          className={`inline-flex items-center gap-1.5 min-h-[38px] px-3.5 py-1.5 rounded-xs border font-body text-[11px] font-semibold uppercase tracking-[0.10em] transition-colors duration-300 ${
                            isCurrent
                              ? 'border-gold/50 bg-gold/20 text-gold cursor-default'
                              : 'border-lacquer bg-lacquer text-cream hover:brightness-90'
                          }`}
                        >
                          <Sparkles className="w-3.5 h-3.5" />
                          <span>
                            {isCurrent
                              ? t.auth.activeAccountBadge
                              : t.auth.useAccountCta}
                          </span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
