import React, { useState } from "react";
import { toast } from "sonner";

const AddTask = ({ onAdd }) => {
  const [title, setTitle] = useState("");
  const [dueDate, setDueDate] = useState("");

  const submit = (e) => {
    e.preventDefault();

    const t = title.trim();
    if (!t) {
      return;
    }

    if (dueDate) {
      const today = new Date();
      today.setHours(0, 0, 0, 0); // reset giờ phút giây

      const selected = new Date(dueDate);

      if (selected < today) {
        toast.error("Ngày hết hạn không được nhỏ hơn ngày hiện tại!");
        return;
      }
    }

    onAdd?.({ title: t, dueDate: dueDate || null });
    setTitle("");
    setDueDate("");
  };

  return (
    <form onSubmit={submit} className="w-full">
      <div className="bg-white rounded-xl shadow p-4 flex items-center gap-3">
        <input
          className="flex-1 bg-transparent placeholder:text-slate-400 text-slate-800 px-3 py-2 rounded-md border border-slate-100"
          placeholder="Cần làm gì hôm nay?"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          aria-label="Task title"
        />

        <div className="flex items-center border-l pl-3">
          <label htmlFor="due" className="sr-only">
            Due date
          </label>
          <input
            id="due"
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className="h-9 text-sm text-slate-700 bg-white border border-slate-100 px-2 rounded"
            aria-label="Due date"
          />
        </div>

        {(() => {
          const disabled = !title.trim() || !dueDate;
          return (
            <button
              type="submit"
              disabled={disabled}
              aria-disabled={disabled}
              className={`ml-3 ${
                disabled
                  ? "bg-blue-500/60 cursor-not-allowed opacity-60"
                  : "bg-blue-500 hover:bg-blue-600"
              } text-white rounded-md px-4 py-2 font-medium`}
              aria-label="Thêm"
            >
              Add
            </button>
          );
        })()}
      </div>
    </form>
  );
};

export default AddTask;
