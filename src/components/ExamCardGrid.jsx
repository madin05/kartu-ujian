import ExamCard from './ExamCard';

/**
 * Grid of exam cards - used for both preview and print
 */
export default function ExamCardGrid({ data, isPrintMode = false, photoMap = {} }) {
  if (data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-slate-500">
        <svg width="48" height="48" fill="none" viewBox="0 0 24 24" className="mb-4 text-slate-600">
          <rect x="3" y="3" width="18" height="18" rx="3" stroke="currentColor" strokeWidth="1.5"/>
          <path d="M7 8h10M7 12h10M7 16h6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
        <p className="text-sm">Belum ada data kartu ujian</p>
      </div>
    );
  }

  return (
    <div className={isPrintMode ? 'print-card-grid' : 'card-preview-grid'}>
      {data.map((row, index) => (
        <ExamCard
          key={row._id || index}
          data={row}
          index={index + 1}
          photoMap={photoMap}
        />
      ))}
    </div>
  );
}
