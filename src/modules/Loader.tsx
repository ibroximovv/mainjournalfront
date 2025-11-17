import React from "react";

const SmoothLoader = () => {
  return (
    <div className="flex items-center justify-center h-screen w-full bg-white relative overflow-hidden">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 opacity-3">
        <svg className="w-full h-full">
          <defs>
            <pattern id="dots" width="40" height="40" patternUnits="userSpaceOnUse">
              <circle cx="20" cy="20" r="1" fill="#133654" opacity="0.1"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#dots)"/>
        </svg>
      </div>

      {/* Main content */}
      <div className="relative z-10 flex flex-col items-center justify-center">
        {/* Logo with animated rings */}
        <div className="relative w-48 h-48">
          {/* Animated outer ring 1 */}
          <svg className="absolute inset-0 w-full h-full animate-spin-slow" viewBox="0 0 200 200">
            <circle
              cx="100"
              cy="100"
              r="90"
              fill="none"
              stroke="#133654"
              strokeWidth="1.5"
              strokeDasharray="8 12"
              opacity="0.25"
            />
          </svg>

          {/* Animated outer ring 2 */}
          <svg className="absolute inset-2 w-11/12 h-11/12 m-auto animate-spin-reverse" viewBox="0 0 200 200">
            <circle
              cx="100"
              cy="100"
              r="90"
              fill="none"
              stroke="#133654"
              strokeWidth="1.5"
              strokeDasharray="5 10"
              opacity="0.2"
            />
          </svg>

          {/* Animated middle ring */}
          <svg className="absolute inset-6 w-5/6 h-5/6 m-auto animate-spin-medium" viewBox="0 0 200 200">
            <circle
              cx="100"
              cy="100"
              r="90"
              fill="none"
              stroke="#133654"
              strokeWidth="2"
              strokeDasharray="15 10"
              opacity="0.3"
            />
          </svg>

          {/* Pulsing background circles */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="absolute w-32 h-32 rounded-full animate-pulse-ring" style={{ backgroundColor: '#133654', opacity: 0.05 }}></div>
            <div className="absolute w-28 h-28 rounded-full animate-pulse-ring-delayed" style={{ backgroundColor: '#133654', opacity: 0.08 }}></div>
          </div>

          {/* Logo container */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="relative w-28 h-28 rounded-lg flex items-center justify-center shadow-lg" style={{ backgroundColor: '#133654' }}>
              {/* Logo placeholder */}
              <div className="text-center">
                <div className="text-white font-bold text-3xl mb-1 tracking-wider">RTU</div>
                <div className="text-white text-xs font-light opacity-80 tracking-widest">RENESSANS</div>
              </div>
              
              {/* Subtle shine effect */}
              <div className="absolute inset-0 rounded-lg opacity-20 animate-shine" style={{ 
                background: 'linear-gradient(120deg, transparent 0%, rgba(255,255,255,0.3) 50%, transparent 100%)',
              }}></div>
            </div>
          </div>

          {/* Orbiting dots */}
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="absolute animate-orbit-smooth"
              style={{
                animationDelay: `${i * 1}s`,
                top: "50%",
                left: "50%",
              }}
            >
              <div 
                className="w-2 h-2 rounded-full transform -translate-x-1/2 -translate-y-1/2 shadow-sm" 
                style={{ backgroundColor: '#133654', opacity: 0.5 }}
              ></div>
            </div>
          ))}
        </div>

        {/* Animated loading text */}
        <div className="mt-16 text-center">
          <h2 className="text-2xl font-semibold mb-3 animate-text-wave" style={{ color: '#133654' }}>
            Renessans Ta'lim Universiteti
          </h2>
          
          {/* Animated underline */}
          <div className="relative w-80 h-1 mx-auto mb-6 rounded-full overflow-hidden" style={{ backgroundColor: 'rgba(19, 54, 84, 0.1)' }}>
            <div className="absolute h-full w-1/3 rounded-full animate-slide-bar" style={{ backgroundColor: '#133654' }}></div>
          </div>

          {/* Loading text with animation */}
          <div className="flex items-center justify-center gap-2">
            <p className="text-base font-medium animate-fade-pulse" style={{ color: '#133654' }}>
              Yuklanmoqda
            </p>
            <div className="flex gap-1">
              {[...Array(3)].map((_, i) => (
                <span
                  key={i}
                  className="text-xl font-bold animate-dot-bounce"
                  style={{ 
                    color: '#133654',
                    animationDelay: `${i * 0.2}s`
                  }}
                >
                  .
                </span>
              ))}
            </div>
          </div>

          {/* Status text */}
          <p className="mt-4 text-sm font-light animate-fade-in-slow" style={{ color: '#133654', opacity: 0.6 }}>
            Iltimos kuting...
          </p>
        </div>
      </div>

      <style>{`
        @keyframes spin-slow {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
        .animate-spin-slow {
          animation: spin-slow 20s linear infinite;
        }

        @keyframes spin-reverse {
          from {
            transform: rotate(360deg);
          }
          to {
            transform: rotate(0deg);
          }
        }
        .animate-spin-reverse {
          animation: spin-reverse 15s linear infinite;
        }

        @keyframes spin-medium {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
        .animate-spin-medium {
          animation: spin-medium 10s linear infinite;
        }

        @keyframes pulse-ring {
          0%, 100% {
            transform: scale(1);
            opacity: 0.05;
          }
          50% {
            transform: scale(1.1);
            opacity: 0.1;
          }
        }
        .animate-pulse-ring {
          animation: pulse-ring 3s ease-in-out infinite;
        }

        @keyframes pulse-ring-delayed {
          0%, 100% {
            transform: scale(1);
            opacity: 0.08;
          }
          50% {
            transform: scale(1.15);
            opacity: 0.03;
          }
        }
        .animate-pulse-ring-delayed {
          animation: pulse-ring-delayed 3s ease-in-out infinite;
          animation-delay: 1.5s;
        }

        @keyframes shine {
          0% {
            transform: translateX(-100%) skewX(-15deg);
          }
          100% {
            transform: translateX(200%) skewX(-15deg);
          }
        }
        .animate-shine {
          animation: shine 3s ease-in-out infinite;
        }

        @keyframes orbit-smooth {
          0% {
            transform: translate(-50%, -50%) rotate(0deg) translateX(90px) rotate(0deg);
            opacity: 0.3;
          }
          50% {
            opacity: 0.7;
            transform: translate(-50%, -50%) rotate(180deg) translateX(90px) rotate(-180deg);
          }
          100% {
            transform: translate(-50%, -50%) rotate(360deg) translateX(90px) rotate(-360deg);
            opacity: 0.3;
          }
        }
        .animate-orbit-smooth {
          animation: orbit-smooth 8s cubic-bezier(0.45, 0.05, 0.55, 0.95) infinite;
        }

        @keyframes text-wave {
          0%, 100% {
            transform: translateY(0);
            opacity: 1;
          }
          50% {
            transform: translateY(-3px);
            opacity: 0.9;
          }
        }
        .animate-text-wave {
          animation: text-wave 3s ease-in-out infinite;
        }

        @keyframes slide-bar {
          0% {
            left: -33.33%;
          }
          100% {
            left: 100%;
          }
        }
        .animate-slide-bar {
          animation: slide-bar 2s cubic-bezier(0.4, 0, 0.2, 1) infinite;
        }

        @keyframes fade-pulse {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.6;
          }
        }
        .animate-fade-pulse {
          animation: fade-pulse 2s ease-in-out infinite;
        }

        @keyframes dot-bounce {
          0%, 100% {
            transform: translateY(0);
            opacity: 0.5;
          }
          50% {
            transform: translateY(-5px);
            opacity: 1;
          }
        }
        .animate-dot-bounce {
          animation: dot-bounce 1s ease-in-out infinite;
        }

        @keyframes fade-in-slow {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 0.6;
            transform: translateY(0);
          }
        }
        .animate-fade-in-slow {
          animation: fade-in-slow 1.5s ease-out;
        }
      `}</style>
    </div>
  );
};

export default SmoothLoader;