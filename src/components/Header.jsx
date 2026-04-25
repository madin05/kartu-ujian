export default function Header({ dataCount, photoCount = 0 }) {
  return (
    <header className="no-print sticky top-0 z-40 glass-strong border-b border-slate-700/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
        {/* Logo & Title */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-indigo-700 flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <svg width="22" height="22" fill="none" viewBox="0 0 24 24">
              <rect x="3" y="3" width="18" height="18" rx="3" stroke="white" strokeWidth="2"/>
              <path d="M7 8h10M7 12h10M7 16h6" stroke="white" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </div>
          <div>
            <h1 className="text-lg font-bold text-white tracking-tight leading-none">
              Cetak Kartu Ujian
            </h1>
            <p className="text-xs text-slate-400 mt-0.5">
              Generator kartu ujian dari Excel
            </p>
          </div>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-3">
          {dataCount > 0 && (
            <div className="badge badge-primary animate-fade-in">
              <svg width="14" height="14" fill="none" viewBox="0 0 24 24">
                <path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              {dataCount} peserta
            </div>
          )}
          
          {/* PWA indicator */}
          <div className="hidden sm:flex items-center gap-1.5 text-xs text-slate-500">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
            Offline Ready
          </div>
        </div>
      </div>
    </header>
  );
}
