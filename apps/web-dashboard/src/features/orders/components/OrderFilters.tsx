"use client";

interface OrderFiltersProps {
  statusFilter: string;
  onFilterChange: (status: string) => void;
}

const FILTERS = [
  { value: "all", label: "Semua" },
  { value: "pending", label: "Menunggu" },
  { value: "paid", label: "Lunas" },
  { value: "cancelled", label: "Dibatalkan" },
  { value: "expired", label: "Kadaluarsa" },
];

export function OrderFilters({
  statusFilter,
  onFilterChange,
}: OrderFiltersProps) {
  return (
    <div className="flex gap-2 flex-wrap">
      {FILTERS.map((f) => (
        <button
          key={f.value}
          onClick={() => onFilterChange(f.value)}
          className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all border ${
            statusFilter === f.value
              ? "bg-slate-800 text-white border-slate-800"
              : "bg-white text-slate-600 border-slate-200 hover:border-slate-400"
          }`}
        >
          {f.label}
        </button>
      ))}
    </div>
  );
}
