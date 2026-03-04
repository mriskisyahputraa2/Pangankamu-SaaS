import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search } from "lucide-react";

interface ProductFiltersProps {
  searchTerm: string;
  limit: string;
  onSearchChange: (value: string) => void;
  onLimitChange: (value: string) => void;
}

export function ProductFilters({
  searchTerm,
  limit,
  onSearchChange,
  onLimitChange,
}: ProductFiltersProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-stretch sm:items-center">
      <div className="relative flex-1">
        <Search
          className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
          size={18}
        />
        <Input
          placeholder="Cari produk..."
          className="pl-10 h-11 rounded-xl w-full"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>
      <Select value={limit} onValueChange={onLimitChange}>
        <SelectTrigger className="w-full sm:w-32.5 h-11 rounded-xl">
          <SelectValue placeholder="Baris" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="5">5 Baris</SelectItem>
          <SelectItem value="10">10 Baris</SelectItem>
          <SelectItem value="20">20 Baris</SelectItem>
          <SelectItem value="50">50 Baris</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
