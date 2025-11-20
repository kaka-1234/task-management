import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const Pagination = ({ current = 1, total = 1, onChange }) => {
  if (total <= 1) return null;

  const items = (() => {
    // follow rules from user:
    // - if total <= 4: show all pages
    // - if total > 4 and page <= 2: show 1,2,3,...,last
    // - if page === total-1: show 1,...,last-2,last-1,last
    // - otherwise (middle): show 1,...,page,...,last
    const pages = [];
    if (total <= 4) {
      for (let i = 1; i <= total; i++) pages.push(i);
      return pages;
    }

    if (current <= 2) {
      pages.push(1, 2, 3, "...", total);
      return pages;
    }

    if (current >= total - 1) {
      pages.push(1, "...", total - 2, total - 1, total);
      return pages;
    }

    // middle case
    pages.push(1, "...", current, "...", total);
    return pages;
  })();

  const handlePrev = () => onChange?.(Math.max(1, current - 1));
  const handleNext = () => onChange?.(Math.min(total, current + 1));

  const prevDisabled = current <= 1;
  const nextDisabled = current >= total;

  return (
    <nav className="flex items-center gap-2" aria-label="Pagination">
      <button
        onClick={() => !prevDisabled && handlePrev()}
        disabled={prevDisabled}
        className={`px-3 py-1 rounded ${
          prevDisabled
            ? "bg-slate-50 text-slate-300 cursor-not-allowed"
            : "bg-slate-100"
        }`}
      >
        <div className="flex items-center">
          <ChevronLeft
            className={`w-4 h-4 ${
              prevDisabled ? "text-slate-300" : "text-slate-600"
            }`}
          />
          <span className="ml-2">Prev</span>
        </div>
      </button>

      {items.map((it, idx) => {
        if (it === "...") {
          return (
            <span key={`e-${idx}`} className="px-2 text-slate-500">
              ...
            </span>
          );
        }

        return (
          <button
            key={it}
            onClick={() => onChange?.(it)}
            className={`px-3 py-1 rounded ${
              it === current ? "bg-blue-500 text-white" : "bg-slate-100"
            }`}
          >
            {it}
          </button>
        );
      })}

      <button
        onClick={() => !nextDisabled && handleNext()}
        disabled={nextDisabled}
        className={`px-3 py-1 rounded ${
          nextDisabled
            ? "bg-slate-50 text-slate-300 cursor-not-allowed"
            : "bg-slate-100"
        }`}
      >
        <div className="flex items-center">
          <span className="mr-2">Next</span>
          <ChevronRight
            className={`w-4 h-4 ${
              nextDisabled ? "text-slate-300" : "text-slate-600"
            }`}
          />
        </div>
      </button>
    </nav>
  );
};

export default Pagination;
