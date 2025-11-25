
const NavbarPartner = () => {
  const marqueeText = "Renessans Ta'lim universitetida - Ilmiy jurnal va maqolalaringizni chop etting";

  return (
    <div className="relative h-10 bg-white overflow-hidden border-b border-gray-100">
      {/* Animated Background Effects */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#133654]/20 to-transparent animate-shimmer"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(19,54,84,0.08),transparent_50%)] animate-pulse"></div>
      </div>
      
      {/* Flowing Wave Effect */}
      <div className="absolute inset-0 opacity-8">
        <div className="absolute inset-0 bg-gradient-to-r from-[#133654]/5 via-[#1a4d73]/8 to-[#133654]/5 animate-wave"></div>
      </div>

      {/* Marquee Content - Continuous Loop */}
      <div className="relative flex animate-marquee-continuous">
        <div className="flex whitespace-nowrap">
          <span className="text-[#133654] text-sm font-semibold py-2.5 inline-block px-8">
            {marqueeText}
          </span>
          <span className="text-[#133654] text-sm font-semibold py-2.5 inline-block px-8">
            •
          </span>
          <span className="text-[#133654] text-sm font-semibold py-2.5 inline-block px-8">
            {marqueeText}
          </span>
          <span className="text-[#133654] text-sm font-semibold py-2.5 inline-block px-8">
            •
          </span>
          <span className="text-[#133654] text-sm font-semibold py-2.5 inline-block px-8">
            {marqueeText}
          </span>
          <span className="text-[#133654] text-sm font-semibold py-2.5 inline-block px-8">
            •
          </span>
        </div>
        <div className="flex whitespace-nowrap">
          <span className="text-[#133654] text-sm font-semibold py-2.5 inline-block px-8">
            {marqueeText}
          </span>
          <span className="text-[#133654] text-sm font-semibold py-2.5 inline-block px-8">
            •
          </span>
          <span className="text-[#133654] text-sm font-semibold py-2.5 inline-block px-8">
            {marqueeText}
          </span>
          <span className="text-[#133654] text-sm font-semibold py-2.5 inline-block px-8">
            •
          </span>
          <span className="text-[#133654] text-sm font-semibold py-2.5 inline-block px-8">
            {marqueeText}
          </span>
          <span className="text-[#133654] text-sm font-semibold py-2.5 inline-block px-8">
            •
          </span>
        </div>
      </div>

      <style>{`
        @keyframes marquee-continuous {
          0% {
            transform: translateX(0%);
          }
          100% {
            transform: translateX(-50%);
          }
        }

        @keyframes shimmer {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }

        @keyframes wave {
          0% {
            transform: translateX(-100%) skewX(-10deg);
          }
          100% {
            transform: translateX(100%) skewX(-10deg);
          }
        }

        .animate-marquee-continuous {
          animation: marquee-continuous 25s linear infinite;
          will-change: transform;
          display: flex;
        }

        .animate-shimmer {
          animation: shimmer 3s ease-in-out infinite;
          will-change: transform;
        }

        .animate-wave {
          animation: wave 10s ease-in-out infinite;
          will-change: transform;
        }

        /* Smooth performance for all devices */
        .animate-marquee-continuous,
        .animate-shimmer,
        .animate-wave {
          backface-visibility: hidden;
          perspective: 1000px;
        }
      `}</style>
    </div>
  );
};

export default NavbarPartner;