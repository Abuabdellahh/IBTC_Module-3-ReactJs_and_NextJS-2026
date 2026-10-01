export default function MenuLoading() {
  return (
    <div className="loading-skeleton">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="skeleton-item" />
      ))}
    </div>
  )
}
