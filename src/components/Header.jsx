export default function Header({ dataCount, photoCount = 0, theme, onToggleTheme }) {
  return (
    <header className="no-print sticky top-0 z-40 glass-strong" style={{ borderBottom: '1px solid var(--border-color)' }}>
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
            <h1 className="text-lg font-bold tracking-tight leading-none" style={{ color: 'var(--text-primary)' }}>
              Cetak Kartu Ujian
            </h1>
            <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
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

          {/* Theme toggle */}
          <button
            className="theme-toggle"
            onClick={onToggleTheme}
            title={theme === 'dark' ? 'Mode Terang' : 'Mode Gelap'}
          >
            {theme === 'dark' ? (
              /* Sun icon — switch to light */
              <svg width="18" height="18" fill="none" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="5" stroke="currentColor" strokeWidth="2"/>
                <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            ) : (
              /* Moon icon — switch to dark */
              <svg width="18" height="18" fill="none" viewBox="0 0 24 24">
                <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            )}
          </button>
          
          {/* PWA indicator */}
          <div className="hidden sm:flex items-center gap-1.5 text-xs" style={{ color: 'var(--text-muted)' }}>
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
            Offline Ready
          </div>
        </div>
      </div>
    </header>
  );
}
