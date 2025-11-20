import React from "react";

const DateFilter = ({ period = "all", onChange }) => {
  return (
    <div>
      <select
        value={period}
        onChange={(e) => onChange?.(e.target.value)}
        className="px-3 py-2 border rounded-md bg-white text-sm"
        aria-label="Date period filter"
      >
        <option value="all">Tất cả</option>
        <option value="today">Hôm nay</option>
        <option value="week">Tuần này</option>
        <option value="month">Tháng này</option>
      </select>
    </div>
  );
};

export default DateFilter;
