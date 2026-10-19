import React from 'react';

export const MarqueeStrip: React.FC = () => {
  const items = [
    'Morning Rolls',
    'Flat Whites',
    'Sourdough',
    'Stacked Pancakes',
    'Baked Eggs',
    'Toasties',
    'Specialty Filter',
    'Whipped Ricotta',
    'Dennistoun Coffee',
  ];

  return (
    <div className="relative py-4 sm:py-5 border-y border-[#2F3E2C]/10 bg-[#DCE5D3]/35 overflow-hidden group select-none">
      <div className="flex w-max animate-marquee group-hover:[animation-play-state:paused]">
        {/* Render twice for seamless loop */}
        {[0, 1].map((copyIndex) => (
          <div key={copyIndex} className="flex items-center gap-8 px-4 shrink-0">
            {items.map((item, i) => (
              <div key={i} className="flex items-center gap-8 shrink-0">
                <span className="font-serif italic text-2xl sm:text-3xl lg:text-4xl text-[#2F3E2C] tracking-wide whitespace-nowrap">
                  {item}
                </span>
                {/* 18px tiny logo as separator */}
                <img
                  src="/images/mesa-logo.png"
                  alt="separator"
                  className="w-[18px] h-[18px] rounded-full object-cover shrink-0 opacity-80"
                />
              </div>
            ))}
          </div>
        ))}
      </div>

      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee 35s linear infinite;
        }
      `}</style>
    </div>
  );
};
