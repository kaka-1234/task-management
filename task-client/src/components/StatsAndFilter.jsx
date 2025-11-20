import React from "react";

const StatsAndFilter = ({
  status = "",
  onStatusChange,
  pendingCount = 0,
  doneCount = 0,
}) => {
  const isActive = (value) => status === value;

  return (
    <div className="flex items-center gap-3">
      <div className="flex items-center gap-3">
        <div
          className="px-3 py-2 rounded-md text-sm flex items-center gap-2 bg-slate-100"
          aria-hidden
        >
          <span className="text-blue-600 font-medium">{pendingCount}</span>
          <span className="text-slate-700">Đang làm</span>
        </div>

        <div
          className="px-3 py-2 rounded-md text-sm flex items-center gap-2 bg-slate-100"
          aria-hidden
        >
          <span className="text-green-600 font-medium">{doneCount}</span>
          <span className="text-slate-700">Hoàn thành</span>
        </div>
      </div>

      <div>
        <select
          value={status}
          onChange={(e) => onStatusChange?.(e.target.value)}
          className="px-3 py-2 border rounded-md bg-white text-sm"
          aria-label="Filter status"
        >
          <option value="">Tất cả</option>
          <option value="pending">Đang làm</option>
          <option value="done">Hoàn thành</option>
        </select>
      </div>
    </div>
  );
};

export default StatsAndFilter;
