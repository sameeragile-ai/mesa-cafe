import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Home } from 'lucide-react';
import { PageTransition } from '../components/PageTransition';

export const NotFoundPage: React.FC = () => {
  return (
    <PageTransition>
      <div className="min-h-[85vh] flex flex-col items-center justify-center px-4 sm:px-6 text-center bg-[#FBF8F2] pt-24 pb-16">
        {/* Logo at 64px */}
        <div className="mb-6">
          <img
            src="/images/mesa-logo.png"
            alt="MESA Glasgow logo"
            className="w-16 h-16 rounded-full object-cover shadow-[0_6px_20px_rgba(47,62,44,0.18)] mx-auto"
          />
        </div>

        <span className="text-xs uppercase tracking-widest text-[#4F6B47] font-semibold mb-2 block">
          Error 404 · Table Not Found
        </span>

        <h1 className="font-serif italic text-4xl sm:text-5xl lg:text-6xl text-[#2F3E2C] tracking-tight mb-4">
          Off the Duke Street map.
        </h1>

        <p className="text-stone-600 text-sm sm:text-base max-w-md mx-auto mb-8 leading-relaxed">
          The page or dish you’re looking for seems to have wandered off. Let’s get you back to the main café counter.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-3">
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#2F3E2C] text-[#FBF8F2] text-xs font-semibold tracking-wider uppercase hover:bg-[#4F6B47] transition-all shadow-sm cursor-pointer"
          >
            <Home className="w-4 h-4" />
            <span>Back to Home</span>
          </Link>
          <Link
            to="/menu"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white border border-[#2F3E2C]/15 text-[#2F3E2C] text-xs font-semibold tracking-wider uppercase hover:bg-[#DCE5D3]/40 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Explore Menu</span>
          </Link>
        </div>
      </div>
    </PageTransition>
  );
};
