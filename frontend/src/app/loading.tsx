export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-paper">
      <div className="animate-pulse space-y-4">
        <div className="h-8 w-48 bg-paper-2 rounded-lg" />
        <div className="h-4 w-32 bg-paper-2 rounded-lg mx-auto" />
      </div>
    </div>
  )
}
