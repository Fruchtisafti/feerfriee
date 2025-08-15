export default function Loading() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <div className="h-6 w-40 animate-pulse rounded bg-gray-200" />
      <div className="mt-6 h-32 animate-pulse rounded-2xl bg-gray-100" />
      <div className="mt-4 h-24 animate-pulse rounded-2xl bg-gray-100" />
    </div>
  );
}
