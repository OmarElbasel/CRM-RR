export default function Loading() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-32 bg-white rounded-[14px] border border-ds-line" />
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 h-64 bg-white rounded-[14px] border border-ds-line" />
        <div className="h-64 bg-white rounded-[14px] border border-ds-line" />
      </div>
    </div>
  )
}
