'use client';

import Link from 'next/link';

export const Topbar = () => {
  const navItems = [
    { href: '#features', label: 'Features' },
    { href: '#how-it-works', label: 'How it works' },
    { href: '#pricing', label: 'Pricing' },
    { href: '#about', label: 'About' },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 backdrop-blur-lg border-b border-slate-200/60 dark:border-slate-800/60 bg-white/70 dark:bg-slate-900/70">
      <div className="max-w-[1200px] mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/">
          <div className="flex items-center gap-2 cursor-pointer">
            <div className="w-8 h-8 bg-[#2b2bee] rounded-lg flex items-center justify-center text-white font-bold text-lg">
              🧠
            </div>
            <h2 className="text-slate-900 dark:text-white text-lg font-bold tracking-tight">Second Brain</h2>
          </div>
        </Link>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center gap-8">
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="text-slate-600 dark:text-slate-300 text-sm font-medium hover:text-[#2b2bee] transition-colors"
            >
              {item.label}
            </a>
          ))}
        </nav>

        {/* Auth Buttons */}
        <div className="flex items-center gap-3">
          <Link href="/dashboard">
            <button className="hidden sm:flex px-4 py-2 text-slate-700 dark:text-slate-200 text-sm font-semibold hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-all">
              Dashboard
            </button>
          </Link>
          <Link href="/Login">
            <button className="hidden sm:flex px-4 py-2 text-slate-700 dark:text-slate-200 text-sm font-semibold hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-all">
              Log In
            </button>
          </Link>
          <Link href="/Signup">
            <button className="bg-[#2b2bee] hover:bg-[#2118c4] text-white px-5 py-2.5 rounded-lg text-sm font-bold shadow-lg shadow-[#2b2bee]/20 transition-all">
              Get Started
            </button>
          </Link>
        </div>
      </div>
    </header>
  );
};
