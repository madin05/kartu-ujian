export default function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-16 animate-fade-in">
      {/* Decorative card illustration */}
      <div className="relative mb-8">
        {/* Back card */}
        <div className="w-48 h-32 rounded-xl bg-gradient-to-br from-slate-700/50 to-slate-800/50 border border-slate-600/30 absolute -top-2 -left-2 rotate-[-6deg] shadow-lg"></div>
        {/* Middle card */}
        <div className="w-48 h-32 rounded-xl bg-gradient-to-br from-slate-700/60 to-slate-800/60 border border-slate-600/30 absolute -top-1 -left-1 rotate-[-3deg] shadow-lg"></div>
        {/* Front card */}
        <div className="w-48 h-32 rounded-xl bg-gradient-to-br from-indigo-600/20 to-indigo-800/20 border border-indigo-500/30 relative shadow-xl flex flex-col items-center justify-center gap-2 p-4">
          <svg width="32" height="32" fill="none" viewBox="0 0 24 24" className="text-indigo-400 animate-bounce-gentle">
            <rect x="3" y="3" width="18" height="18" rx="3" stroke="currentColor" strokeWidth="1.5"/>
            <path d="M7 8h10M7 12h10M7 16h6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
          <div className="w-20 h-1 rounded-full bg-indigo-500/30"></div>
          <div className="w-16 h-1 rounded-full bg-indigo-500/20"></div>
        </div>
      </div>

      <h2 className="text-xl font-bold text-white mb-2">Mulai dengan Upload File</h2>
      <p className="text-sm text-slate-400 max-w-md text-center mb-8 leading-relaxed">
        Upload file Excel (.xlsx) yang berisi data peserta ujian. Data akan langsung dikonversi menjadi kartu ujian siap cetak.
      </p>

      {/* Feature cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl w-full">
        <FeatureCard
          icon={
            <svg width="20" height="20" fill="none" viewBox="0 0 24 24">
              <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M17 8l-5-5-5 5M12 3v12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          }
          title="Upload Excel"
          desc="Import .xlsx atau .csv"
          color="indigo"
        />
        <FeatureCard
          icon={
            <svg width="20" height="20" fill="none" viewBox="0 0 24 24">
              <path d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          }
          title="Edit di Tabel"
          desc="CRUD inline editing"
          color="green"
        />
        <FeatureCard
          icon={
            <svg width="20" height="20" fill="none" viewBox="0 0 24 24">
              <path d="M6 9V2h12v7M6 18H4a2 2 0 01-2-2v-5a2 2 0 012-2h16a2 2 0 012 2v5a2 2 0 01-2 2h-2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <rect x="6" y="14" width="12" height="8" stroke="currentColor" strokeWidth="2"/>
            </svg>
          }
          title="Cetak Kartu"
          desc="Siap print A4"
          color="amber"
        />
      </div>
    </div>
  );
}

function FeatureCard({ icon, title, desc, color }) {
  const colorMap = {
    indigo: 'from-indigo-500/10 to-indigo-600/10 border-indigo-500/20 text-indigo-400',
    green: 'from-green-500/10 to-green-600/10 border-green-500/20 text-green-400',
    amber: 'from-amber-500/10 to-amber-600/10 border-amber-500/20 text-amber-400',
  };

  return (
    <div className={`rounded-xl bg-gradient-to-br ${colorMap[color]} border p-4 text-center transition-all hover:scale-105 hover:shadow-lg`}>
      <div className={`inline-flex mb-2 ${colorMap[color].split(' ').pop()}`}>{icon}</div>
      <p className="text-sm font-semibold text-white">{title}</p>
      <p className="text-xs text-slate-400 mt-0.5">{desc}</p>
    </div>
  );
}
