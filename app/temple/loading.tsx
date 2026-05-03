export default function TempleLoading() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <div className="animate-pulse space-y-4">
        <div className="h-40 rounded-2xl bg-white/10" />
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <div className="h-40 rounded-2xl bg-white/10" />
          <div className="h-40 rounded-2xl bg-white/10" />
          <div className="h-40 rounded-2xl bg-white/10" />
        </div>
      </div>
    </div>
  )
}
