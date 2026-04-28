export default function Loading() {
  return (
    <div className="min-h-screen bg-paper animate-pulse">
      <div className="flex">
        <div className="w-64 h-screen bg-ink hidden lg:block" />
        <div className="flex-1 p-8 space-y-6">
          <div className="h-8 w-64 bg-paper-2 rounded-lg" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 bg-white rounded-[14px] border border-ds-line" />
            ))}
          </div>
          <div className="h-64 bg-white rounded-[14px] border border-ds-line" />
        </div>
      </div>
    </div>
  )
}
