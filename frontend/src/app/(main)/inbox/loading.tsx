export default function Loading() {
  return (
    <div className="space-y-4 animate-pulse">
      <div className="h-12 bg-white rounded-[14px] border border-ds-line" />
      {[...Array(6)].map((_, i) => (
        <div key={i} className="h-16 bg-white rounded-[14px] border border-ds-line" />
      ))}
    </div>
  )
}
