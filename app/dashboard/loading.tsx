export default function DashboardLoading() {
  return (
    <div className="animate-pulse space-y-7">
      <div className="h-4 w-32 rounded bg-black/10" />
      <div className="h-10 w-80 max-w-full rounded-xl bg-black/10" />
      <div className="grid gap-4 sm:grid-cols-3">
        {[1, 2, 3].map((item) => (
          <div key={item} className="h-36 rounded-3xl bg-black/[.06]" />
        ))}
      </div>
      <div className="h-72 rounded-[2rem] bg-black/[.06]" />
    </div>
  );
}
