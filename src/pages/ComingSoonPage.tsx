import { useState, useEffect } from 'react';
import { Logo } from '../components/Logo';

export function ComingSoonPage() {
  const [timeLeft, setTimeLeft] = useState({
    hours: 23,
    minutes: 59,
    seconds: 59
  });

  useEffect(() => {
    // Target 10:00 AM tomorrow
    const calculateTarget = () => {
      const now = new Date();
      const target = new Date();
      if (now.getHours() >= 10) {
        target.setDate(now.getDate() + 1);
      }
      target.setHours(10, 0, 0, 0);
      return target;
    };

    const targetDate = calculateTarget();

    const interval = setInterval(() => {
      const now = new Date();
      const diff = targetDate.getTime() - now.getTime();

      if (diff <= 0) {
        setTimeLeft({ hours: 0, minutes: 0, seconds: 0 });
        clearInterval(interval);
      } else {
        const totalSeconds = Math.floor(diff / 1000);
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;
        setTimeLeft({ hours, minutes, seconds });
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-[#071626] text-white flex flex-col justify-between p-6 md:p-12 font-sans">
      {/* Ambient background glow effects */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-brass/10 rounded-full blur-[130px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-[350px] h-[350px] bg-amber-500/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Header */}
      <header className="relative z-10 flex items-center justify-between w-full max-w-6xl mx-auto">
        <Logo imgClassName="h-14 w-auto brightness-110 drop-shadow-md" />
        <div className="flex items-center gap-4">
          <span className="inline-flex items-center gap-2 rounded-full border border-brass/30 bg-brass/10 px-3.5 py-1 text-xs font-semibold tracking-wide text-amber-300 backdrop-blur-md">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            AMFI Registered ARN-251896
          </span>
        </div>
      </header>

      {/* Main Content Card */}
      <main className="relative z-10 my-auto w-full max-w-4xl mx-auto text-center py-12">
        <div className="inline-flex items-center gap-2 rounded-full border border-brass/40 bg-gradient-to-r from-brass/20 to-amber-500/10 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-amber-300 mb-8 shadow-lg">
          <span className="h-2 w-2 rounded-full bg-amber-400 animate-ping" />
          Launching Tomorrow
        </div>

        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white mb-6 leading-tight">
          Something <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-brass to-amber-400">Extraordinary</span> is Arriving.
        </h1>

        <p className="max-w-2xl mx-auto text-base sm:text-lg text-gray-300 leading-relaxed mb-12">
          TejasFinserv is putting the final touches on your state-of-the-art digital wealth management platform. 
          Get ready for intelligent SIP tracking, precision calculators, and disciplined wealth architecture.
        </p>

        {/* Live Countdown Grid */}
        <div className="grid grid-cols-3 gap-4 sm:gap-6 max-w-lg mx-auto mb-6">
          <div className="relative overflow-hidden rounded-2xl border border-brass/30 bg-gradient-to-b from-white/10 to-white/5 p-4 sm:p-6 backdrop-blur-xl shadow-2xl group hover:border-brass/60 transition">
            <span className="block text-3xl sm:text-5xl font-black text-amber-300 font-mono tracking-tighter">
              {String(timeLeft.hours).padStart(2, '0')}
            </span>
            <span className="block text-xs uppercase tracking-widest text-gray-400 font-semibold mt-1">Hours</span>
          </div>
          <div className="relative overflow-hidden rounded-2xl border border-brass/30 bg-gradient-to-b from-white/10 to-white/5 p-4 sm:p-6 backdrop-blur-xl shadow-2xl group hover:border-brass/60 transition">
            <span className="block text-3xl sm:text-5xl font-black text-amber-300 font-mono tracking-tighter">
              {String(timeLeft.minutes).padStart(2, '0')}
            </span>
            <span className="block text-xs uppercase tracking-widest text-gray-400 font-semibold mt-1">Minutes</span>
          </div>
          <div className="relative overflow-hidden rounded-2xl border border-brass/30 bg-gradient-to-b from-white/10 to-white/5 p-4 sm:p-6 backdrop-blur-xl shadow-2xl group hover:border-brass/60 transition">
            <span className="block text-3xl sm:text-5xl font-black text-amber-300 font-mono tracking-tighter animate-pulse">
              {String(timeLeft.seconds).padStart(2, '0')}
            </span>
            <span className="block text-xs uppercase tracking-widest text-gray-400 font-semibold mt-1">Seconds</span>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 flex flex-col sm:flex-row items-center justify-between gap-4 w-full max-w-6xl mx-auto border-t border-white/10 pt-6 text-xs text-gray-400">
        <p>© {new Date().getFullYear()} TejasFinserv. All rights reserved. Vijayawada, Andhra Pradesh.</p>
        <div className="flex items-center gap-6">
          <span className="flex items-center gap-1.5 text-gray-300">
            <svg className="h-3.5 w-3.5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            256-Bit SSL Secured
          </span>
        </div>
      </footer>
    </div>
  );
}
