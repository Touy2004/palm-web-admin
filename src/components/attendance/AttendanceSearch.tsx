import React from "react";
import { Search } from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";

interface AttendanceSearchProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  startDate: string;
  setStartDate: (date: string) => void;
  endDate: string;
  setEndDate: (date: string) => void;
  handleSearch: (e?: React.FormEvent) => void;
}

export function AttendanceSearch({
  searchQuery,
  setSearchQuery,
  startDate,
  setStartDate,
  endDate,
  setEndDate,
  handleSearch
}: AttendanceSearchProps) {
  const { t } = useTranslation();

  return (
    <form onSubmit={handleSearch} className="flex flex-col sm:flex-row flex-wrap items-center gap-3">
      <div className="relative w-full sm:flex-1 sm:min-w-[280px]">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <input
          placeholder={t('common.searchPlaceholder')}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="h-10 w-full rounded-full border border-border bg-muted/40 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
        />
      </div>
      <div className="flex w-full sm:w-auto gap-2">
        <input 
          type="date" 
          value={startDate} 
          onChange={(e) => setStartDate(e.target.value)} 
          className="h-10 flex-1 sm:flex-none rounded-lg border border-border bg-card px-3 text-sm" 
        />
        <input 
          type="date" 
          value={endDate} 
          onChange={(e) => setEndDate(e.target.value)} 
          className="h-10 flex-1 sm:flex-none rounded-lg border border-border bg-card px-3 text-sm" 
        />
      </div>
      <button type="submit" className="inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground hover:opacity-90 transition">
        <Search className="h-4 w-4" /> {t('common.search')}
      </button>
    </form>
  );
}
