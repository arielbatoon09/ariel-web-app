"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Search,
  Plus,
  MoreHorizontal,
  Eye,
  Edit,
  ShieldAlert,
  Trash2,
  ChevronLeft,
  ChevronRight,
  CornerDownRight,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Download,
  Upload,
  ListFilter,
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface Column<T> {
  header: string;
  accessorKey: keyof T | ((item: T) => React.ReactNode);
  className?: string;
  sortKey?: keyof T; // Key to use when sorting this column
}

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  searchPlaceholder?: string;
  searchKey?: keyof T;
  onAddClick?: () => void;
  onViewClick?: (item: T) => void;
  onEditClick?: (item: T) => void;
  onToggleStatusClick?: (item: T) => void;
  onDeleteClick?: (item: T) => void;
  addButtonLabel?: string;
  filterComponent?: React.ReactNode;
  pageSize?: number;
  isLoading?: boolean;

  // Advanced Operations
  onDeleteBulk?: (items: T[]) => void;
  onImportCSV?: (items: any[]) => void;
}

export function DataTable<T extends { id: string; name?: string; title?: string; disabled?: boolean }>(props: DataTableProps<T>) {
  const {
    data,
    columns,
    searchPlaceholder = "Search...",
    searchKey,
    onAddClick,
    onViewClick,
    onEditClick,
    onToggleStatusClick,
    onDeleteClick,
    addButtonLabel = "Add New",
    filterComponent,
    pageSize = 10,
    isLoading = false,
    onDeleteBulk,
    onImportCSV,
  } = props;

  const [searchQuery, setSearchQuery] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState<"all" | "active" | "disabled">("all");
  const [currentPage, setCurrentPage] = React.useState(1);

  // Sorting State
  const [sortColumn, setSortColumn] = React.useState<keyof T | null>(null);
  const [sortDirection, setSortDirection] = React.useState<"asc" | "desc" | null>(null);

  // Selection State
  const [selectedIds, setSelectedIds] = React.useState<Set<string>>(new Set());

  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const hasStatusFilter = React.useMemo(() => {
    return data.some((item) => "disabled" in item);
  }, [data]);

  const filteredData = React.useMemo(() => {
    let result = data;

    // Search Filter
    if (searchQuery && searchKey) {
      result = result.filter((item) => {
        const val = item[searchKey];
        if (typeof val === "string") {
          return val.toLowerCase().includes(searchQuery.toLowerCase());
        }
        return false;
      });
    }

    // Status Filter
    if (hasStatusFilter && statusFilter !== "all") {
      result = result.filter((item) => {
        if (statusFilter === "active") return !item.disabled;
        if (statusFilter === "disabled") return !!item.disabled;
        return true;
      });
    }

    // Sort operations
    if (sortColumn && sortDirection) {
      result = [...result].sort((a, b) => {
        const valA = a[sortColumn!];
        const valB = b[sortColumn!];

        if (valA === undefined || valA === null) return 1;
        if (valB === undefined || valB === null) return -1;

        if (typeof valA === "string" && typeof valB === "string") {
          return sortDirection === "asc"
            ? valA.localeCompare(valB)
            : valB.localeCompare(valA);
        }

        if (typeof valA === "number" && typeof valB === "number") {
          return sortDirection === "asc" ? valA - valB : valB - valA;
        }

        if (typeof valA === "boolean" && typeof valB === "boolean") {
          return sortDirection === "asc"
            ? (valA ? 1 : 0) - (valB ? 1 : 0)
            : (valB ? 1 : 0) - (valA ? 1 : 0);
        }

        return 0;
      });
    }

    return result;
  }, [data, searchQuery, searchKey, statusFilter, hasStatusFilter, sortColumn, sortDirection]);

  const totalItems = filteredData.length;
  const totalPages = Math.max(Math.ceil(totalItems / pageSize), 1);

  const safePage = currentPage > totalPages ? 1 : currentPage;

  const paginatedData = React.useMemo(() => {
    const start = (safePage - 1) * pageSize;
    return filteredData.slice(start, start + pageSize);
  }, [filteredData, safePage, pageSize]);

  const hasActions = onViewClick || onEditClick || onToggleStatusClick || onDeleteClick;

  // Reset page-specific selection if paginated data changes
  React.useEffect(() => {
    setSelectedIds((prev) => {
      const next = new Set<string>();
      const currentIds = new Set(paginatedData.map((item) => item.id));
      prev.forEach((id) => {
        if (currentIds.has(id)) {
          next.add(id);
        }
      });
      return next;
    });
  }, [paginatedData]);

  // Selection handlers
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(new Set(paginatedData.map((item) => item.id)));
    } else {
      setSelectedIds(new Set());
    }
  };

  const handleSelectRow = (id: string, checked: boolean) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (checked) {
        next.add(id);
      } else {
        next.delete(id);
      }
      return next;
    });
  };

  const isAllSelected = paginatedData.length > 0 && paginatedData.every((item) => selectedIds.has(item.id));

  // Sorting click handler
  const handleSort = (key?: keyof T) => {
    if (!key) return;
    if (sortColumn === key) {
      if (sortDirection === "asc") {
        setSortDirection("desc");
      } else {
        setSortColumn(null);
        setSortDirection(null);
      }
    } else {
      setSortColumn(key);
      setSortDirection("asc");
    }
  };

  // CSV Export handler
  const handleExportCSV = () => {
    const itemsToExport = selectedIds.size > 0
      ? data.filter((item) => selectedIds.has(item.id))
      : filteredData;

    if (itemsToExport.length === 0) {
      alert("No data available to export.");
      return;
    }

    // Determine CSV headers (based on columns that have accessorKeys as strings, or raw headers)
    const exportColumns = columns.filter((col) => typeof col.accessorKey === "string" || col.sortKey);
    const headers = exportColumns.map((col) => col.header).join(",");

    const rows = itemsToExport.map((item) => {
      return exportColumns
        .map((col) => {
          const key = (col.sortKey || col.accessorKey) as keyof T;
          const val = item[key] !== undefined && item[key] !== null ? String(item[key]) : "";
          // Escape quotes
          return `"${val.replace(/"/g, '""')}"`;
        })
        .join(",");
    });

    const csvContent = "data:text/csv;charset=utf-8," + [headers, ...rows].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `data_export_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // CSV Import handler
  const handleImportCSV = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        if (!text) return;

        const lines = text.split(/\r?\n/).filter((l) => l.trim() !== "");
        if (lines.length < 2) return;

        const headers = lines[0].split(",").map((h) => h.trim().replace(/^"|"$/g, ""));
        const parsedItems = lines.slice(1).map((line, idx) => {
          // Robust CSV line parser to handle comma inside quotes
          const values: string[] = [];
          let current = "";
          let inQuotes = false;
          for (let i = 0; i < line.length; i++) {
            const char = line[i];
            if (char === '"') {
              inQuotes = !inQuotes;
            } else if (char === "," && !inQuotes) {
              values.push(current.trim());
              current = "";
            } else {
              current += char;
            }
          }
          values.push(current.trim());

          const obj: any = { id: `imported-${Date.now()}-${idx}` };
          headers.forEach((header, index) => {
            const rawVal = values[index]?.replace(/^"|"$/g, "") || "";
            // Find key in columns
            const col = columns.find((c) => c.header.toLowerCase() === header.toLowerCase());
            const key = (col?.sortKey || col?.accessorKey || header.toLowerCase().replace(/\s+/g, "")) as string;
            
            // Map values
            if (key === "role") {
              obj.role = rawVal.toLowerCase() === "admin" ? "admin" : "client";
            } else if (key === "disabled" || key === "status") {
              obj.disabled = rawVal.toLowerCase() === "true" || rawVal.toLowerCase() === "blocked";
            } else {
              obj[key] = rawVal;
            }
          });
          return obj;
        });

        if (onImportCSV) {
          onImportCSV(parsedItems);
        }
      } catch (err: any) {
        alert("Failed to parse CSV: " + err.message);
      } finally {
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      }
    };
    reader.readAsText(file);
  };

  // Bulk Delete handler
  const handleBulkDelete = () => {
    if (!onDeleteBulk) return;
    const selectedItems = data.filter((item) => selectedIds.has(item.id));
    onDeleteBulk(selectedItems);
    setSelectedIds(new Set());
  };

  return (
    <div className="space-y-4">
      {/* Search and Action Bar */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-1 flex-wrap items-center gap-3">
          {searchKey && (
            <div className="relative w-full max-w-xs">
              <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-neutral-400 dark:text-neutral-500" />
              <Input
                placeholder={searchPlaceholder}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="rounded-none border-neutral-300 pl-9 font-sans text-xs focus-visible:ring-1 focus-visible:ring-neutral-400"
              />
            </div>
          )}
          {hasStatusFilter && (
            <Select value={statusFilter} onValueChange={(val) => setStatusFilter(val as "all" | "active" | "disabled")}>
              <SelectTrigger className="!h-8 w-44 !rounded-none border-neutral-300 bg-transparent font-sans text-xs dark:bg-transparent">
                <span className="flex items-center gap-1.5">
                  <ListFilter className="size-3 text-neutral-400" />
                  <SelectValue placeholder="All Status">
                    {statusFilter === "all" ? "All Status" : statusFilter === "active" ? "Active" : "Disabled"}
                  </SelectValue>
                </span>
              </SelectTrigger>
              <SelectContent alignItemWithTrigger={false} className="w-44 !rounded-none border border-neutral-300 bg-background font-sans text-xs dark:border-neutral-700">
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="disabled">Disabled</SelectItem>
              </SelectContent>
            </Select>
          )}
          {filterComponent}
        </div>

        <div className="flex items-center gap-2">
          {/* CSV Import/Export Buttons */}
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImportCSV}
            accept=".csv"
            className="hidden"
          />
          {onImportCSV && (
            <Button
              onClick={() => fileInputRef.current?.click()}
              variant="outline"
              size="sm"
              className="h-8 rounded-none border-neutral-300 font-mono text-[10px] tracking-wider uppercase"
              title="Import CSV Data"
            >
              <Upload className="mr-1.5 size-3" />
              Import
            </Button>
          )}
          <Button
            onClick={handleExportCSV}
            variant="outline"
            size="sm"
            className="h-8 rounded-none border-neutral-300 font-mono text-[10px] tracking-wider uppercase"
            title={selectedIds.size > 0 ? "Export Selected to CSV" : "Export All to CSV"}
          >
            <Download className="mr-1.5 size-3" />
            Export {selectedIds.size > 0 && `(${selectedIds.size})`}
          </Button>

          {onAddClick && (
            <Button onClick={onAddClick} size="sm" className="h-8 cursor-pointer rounded-none font-mono text-[10px] tracking-wider uppercase">
              <Plus className="mr-1.5 size-3" />
              {addButtonLabel}
            </Button>
          )}
        </div>
      </div>

      {/* Selected Rows Action Banner */}
      {selectedIds.size > 0 && (
        <div className="flex items-center justify-between border border-neutral-300 bg-neutral-100 px-4 py-2 font-mono text-[10px] tracking-widest uppercase dark:border-neutral-700 dark:bg-neutral-900/60">
          <span className="text-neutral-600 dark:text-neutral-400">
            Selected: {selectedIds.size} record{selectedIds.size > 1 ? "s" : ""}
          </span>
          <div className="flex gap-2">
            {onDeleteBulk && (
              <Button
                onClick={handleBulkDelete}
                variant="destructive"
                size="sm"
                className="h-6 rounded-none px-2 font-mono text-[9px] uppercase"
              >
                <Trash2 className="mr-1 size-3" />
                Delete Selected
              </Button>
            )}
            <Button
              onClick={() => setSelectedIds(new Set())}
              variant="outline"
              size="sm"
              className="h-6 rounded-none px-2 border-neutral-300 font-mono text-[9px] uppercase"
            >
              Clear
            </Button>
          </div>
        </div>
      )}

      {/* Main Table Grid Card */}
      <div className="relative border border-neutral-300 bg-neutral-50/50 dark:border-neutral-700 dark:bg-neutral-900/20">
        {/* Intersection markers */}
        <div className="pointer-events-none absolute top-0 right-0 z-20 translate-x-1/2 -translate-y-1/2 text-xs text-neutral-300 select-none dark:text-neutral-700">
          +
        </div>
        <div className="pointer-events-none absolute bottom-0 left-0 z-20 -translate-x-1/2 translate-y-1/2 text-xs text-neutral-300 select-none dark:text-neutral-700">
          +
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left font-sans text-xs">
            <thead>
              <tr className="border-b border-neutral-300 bg-neutral-100/50 dark:border-neutral-700 dark:bg-neutral-900/40">
                {/* Select All Checkbox Column */}
                <th className="w-10 px-4 py-3 text-center">
                  <input
                    type="checkbox"
                    checked={isAllSelected}
                    onChange={(e) => handleSelectAll(e.target.checked)}
                    className="accent-neutral-900 dark:accent-neutral-100"
                  />
                </th>
                {columns.map((col, idx) => {
                  const sortKey = col.sortKey || (typeof col.accessorKey === "string" ? col.accessorKey : undefined);
                  const isSortable = !!sortKey;
                  const isSorted = sortColumn === sortKey;

                  return (
                    <th
                      key={idx}
                      onClick={() => isSortable && handleSort(sortKey)}
                      className={cn(
                        "px-4 py-3 font-mono text-[10px] tracking-wider text-neutral-400 uppercase dark:text-neutral-500",
                        isSortable && "cursor-pointer hover:text-foreground select-none",
                        col.className
                      )}
                    >
                      <div className="flex items-center gap-1">
                        <span>{col.header}</span>
                        {isSortable && (
                          <span className="text-neutral-400">
                            {isSorted ? (
                              sortDirection === "asc" ? (
                                <ArrowUp className="size-3" />
                              ) : (
                                <ArrowDown className="size-3" />
                              )
                            ) : (
                              <ArrowUpDown className="size-3 opacity-30" />
                            )}
                          </span>
                        )}
                      </div>
                    </th>
                  );
                })}
                {hasActions && (
                  <th className="w-20 px-4 py-3 text-right font-mono text-[10px] tracking-wider text-neutral-400 uppercase dark:text-neutral-500">
                    Actions
                  </th>
                )}
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                Array.from({ length: pageSize }).map((_, rowIdx) => (
                  <tr key={rowIdx} className={cn("border-b border-neutral-200 dark:border-neutral-800", rowIdx === pageSize - 1 && "border-b-0")}>
                    <td className="w-10 px-4 py-3 text-center">
                      <Skeleton className="mx-auto h-4 w-4" />
                    </td>
                    {columns.map((_, colIdx) => (
                      <td key={colIdx} className="px-4 py-3">
                        <Skeleton className="h-4 w-full" />
                      </td>
                    ))}
                    {hasActions && (
                      <td className="w-20 px-4 py-3">
                        <Skeleton className="ml-auto h-6 w-7" />
                      </td>
                    )}
                  </tr>
                ))
              ) : paginatedData.length > 0 ? (
                <>
                  {paginatedData.map((item, rowIdx) => {
                    const isSelected = selectedIds.has(item.id);
                    return (
                      <tr
                        key={item.id}
                        className={cn(
                          "border-b border-neutral-200 transition-colors hover:bg-neutral-100/40 dark:border-neutral-800 dark:hover:bg-neutral-900/10",
                          rowIdx === paginatedData.length - 1 && pageSize - paginatedData.length === 0 && "border-b-0",
                          item.disabled && "opacity-60 saturate-50",
                          isSelected && "bg-neutral-100/50 dark:bg-neutral-900/30"
                        )}
                      >
                        {/* Checkbox Column */}
                        <td className="w-10 px-4 py-3 text-center">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={(e) => handleSelectRow(item.id, e.target.checked)}
                            className="accent-neutral-900 dark:accent-neutral-100"
                          />
                        </td>
                        {columns.map((col, colIdx) => (
                          <td key={colIdx} className={cn("px-4 py-3 text-foreground", col.className)}>
                            {typeof col.accessorKey === "function" ? col.accessorKey(item) : (item[col.accessorKey as keyof T] as React.ReactNode)}
                          </td>
                        ))}
                        {hasActions && (
                          <td className="w-20 px-4 py-3 text-right">
                            <div className="flex justify-end">
                              <DropdownMenu>
                                <DropdownMenuTrigger
                                  render={
                                    <button className="flex size-7 items-center justify-center border border-neutral-300 hover:bg-neutral-100 focus:outline-none dark:border-neutral-700 dark:hover:bg-neutral-900/60">
                                      <MoreHorizontal className="size-4 text-neutral-500" />
                                    </button>
                                  }
                                />
                                <DropdownMenuContent
                                  align="end"
                                  className="w-40 rounded-none border border-neutral-300 bg-background text-[11px] dark:border-neutral-700"
                                >
                                  {onViewClick && (
                                    <DropdownMenuItem
                                      onClick={() => onViewClick(item)}
                                      className="cursor-pointer gap-2 rounded-none px-3 py-2 whitespace-nowrap text-neutral-600 hover:text-foreground dark:text-neutral-400"
                                    >
                                      <Eye className="size-3.5" />
                                      <span>View Details</span>
                                    </DropdownMenuItem>
                                  )}
                                  {onEditClick && (
                                    <DropdownMenuItem
                                      onClick={() => onEditClick(item)}
                                      className="cursor-pointer gap-2 rounded-none px-3 py-2 whitespace-nowrap text-neutral-600 hover:text-foreground dark:text-neutral-400"
                                    >
                                      <Edit className="size-3.5" />
                                      <span>Edit Details</span>
                                    </DropdownMenuItem>
                                  )}
                                  {onToggleStatusClick && (
                                    <DropdownMenuItem
                                      onClick={() => onToggleStatusClick(item)}
                                      className="cursor-pointer gap-2 rounded-none px-3 py-2 whitespace-nowrap text-neutral-600 hover:text-foreground dark:text-neutral-400"
                                    >
                                      <ShieldAlert className="size-3.5" />
                                      <span>{item.disabled ? "Enable" : "Disable"}</span>
                                    </DropdownMenuItem>
                                  )}
                                  {onDeleteClick && (
                                    <DropdownMenuItem
                                      onClick={() => onDeleteClick(item)}
                                      variant="destructive"
                                      className="cursor-pointer gap-2 rounded-none px-3 py-2 whitespace-nowrap text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20"
                                    >
                                      <Trash2 className="size-3.5" />
                                      <span>Delete</span>
                                    </DropdownMenuItem>
                                  )}
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                          </td>
                        )}
                      </tr>
                    );
                  })}
                  {/* Preoccupied/empty space rows */}
                  {Array.from({ length: pageSize - paginatedData.length }).map((_, emptyIdx) => (
                    <tr
                      key={`empty-${emptyIdx}`}
                      className={cn(
                        "border-b border-neutral-200/30 dark:border-neutral-800/30",
                        emptyIdx === pageSize - paginatedData.length - 1 && "border-b-0"
                      )}
                    >
                      <td className="w-10 px-4 py-3">&nbsp;</td>
                      {columns.map((col, colIdx) => (
                        <td key={colIdx} className="px-4 py-3 text-transparent select-none">
                          &nbsp;
                        </td>
                      ))}
                      {hasActions && <td className="w-20 px-4 py-3 text-transparent select-none">&nbsp;</td>}
                    </tr>
                  ))}
                </>
              ) : (
                <tr>
                  <td
                    colSpan={columns.length + (hasActions ? 1 : 0) + 1}
                    className="px-4 py-10 text-center font-mono text-xs text-neutral-400 dark:text-neutral-500"
                  >
                    No entries found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination Bar */}
      <div className="flex items-center justify-between border-t border-neutral-300 pt-4 dark:border-neutral-700">
        <span className="flex items-center gap-1.5 font-mono text-xs tracking-wider text-neutral-400 uppercase dark:text-neutral-500">
          <CornerDownRight className="size-3" />
          Page {currentPage} of {totalPages} ({totalItems} total)
        </span>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(Math.max(currentPage - 1, 1))}
            className="h-8 cursor-pointer rounded-none border-neutral-300 font-mono text-xs tracking-wider uppercase disabled:pointer-events-none disabled:opacity-30"
          >
            <ChevronLeft className="mr-1 size-3" />
            Prev
          </Button>

          {/* Page number buttons */}
          <div className="hidden items-center gap-1 sm:flex">
            {Array.from({ length: totalPages }).map((_, index) => {
              const pageNum = index + 1;
              return (
                <Button
                  key={pageNum}
                  variant={currentPage === pageNum ? "default" : "outline"}
                  size="sm"
                  onClick={() => setCurrentPage(pageNum)}
                  className={cn("h-8 w-8 cursor-pointer rounded-none p-0 font-mono text-xs", currentPage !== pageNum && "border-neutral-300")}
                >
                  {pageNum}
                </Button>
              );
            })}
          </div>

          <Button
            variant="outline"
            size="sm"
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(Math.min(currentPage + 1, totalPages))}
            className="h-8 cursor-pointer rounded-none border-neutral-300 font-mono text-xs tracking-wider uppercase disabled:pointer-events-none disabled:opacity-30"
          >
            Next
            <ChevronRight className="ml-1 size-3" />
          </Button>
        </div>
      </div>
    </div>
  );
}
