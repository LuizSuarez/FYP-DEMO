export function StatsGrid({ children, className = "" }) {
  return (
    <div className={`grid gap-4 md:grid-cols-2 lg:grid-cols-4 ${className}`}>
      {children}
    </div>
  );
}