import React, { useState } from 'react';
import { X, ArrowRight } from 'lucide-react';

interface AnnouncementBarProps {
  onOpenBooking: () => void;
}

export const AnnouncementBar: React.FC<AnnouncementBarProps> = ({ onOpenBooking }) => {
  const [isDismissed, setIsDismissed] = useState(false);

  if (isDismissed) return null;

  return (
    <div className="relative z-50 bg-[#2F3E2C] text-[#FBF8F2] text-xs py-2 px-4 border-b border-[#4F6B47]/30 transition-all">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        <div className="w-6 hidden sm:block" /> {/* Spacer */}
        <div className="flex-1 flex items-center justify-center gap-2 text-center">
          <span className="font-light tracking-wide text-[#DCE5D3]">
            Now serving our seasonal autumn specials
          </span>
          <span className="text-white/40" aria-hidden="true">·</span>
          <button
            onClick={onOpenBooking}
            className="inline-flex items-center gap-1 font-medium text-[#F4C9A8] hover:text-white underline underline-offset-4 transition-colors cursor-pointer"
          >
            <span>Book a table</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>
        <button
          onClick={() => setIsDismissed(true)}
          aria-label="Dismiss announcement"
          className="text-[#DCE5D3]/70 hover:text-white p-1 rounded transition-colors cursor-pointer"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
