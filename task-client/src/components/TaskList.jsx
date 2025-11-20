import React, { useState } from "react";
import { Trash2, Edit2, Check, X } from "lucide-react";
import { toast } from "sonner";

const formatDate = (d) => {
  if (!d) return "—";
  try {
    const dt = new Date(d);
    if (isNaN(dt)) return "—";
    return dt.toLocaleDateString("en-GB");
  } catch {
    return "—";
  }
};

const TaskList = ({ tasks = [], onToggle, onDelete, onUpdate }) => {
  const [editingId, setEditingId] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDue, setEditDue] = useState("");

  const startEdit = (t) => {
    setEditingId(t.id);
    setEditTitle(t.title || "");
    setEditDue(
      t.dueDate
        ? t.dueDate.includes("T")
          ? t.dueDate.split("T")[0]
          : t.dueDate
        : ""
    );
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditTitle("");
    setEditDue("");
  };

  const saveEdit = async (t) => {
    // validate title
    if (!editTitle.trim()) {
      toast.error("Tên task không được để trống");
      return;
    }

    // validate due date not in past (compare date-only)
    if (editDue) {
      const picked = new Date(editDue);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      picked.setHours(0, 0, 0, 0);
      if (picked < today) {
        toast.error("Ngày đến hạn không thể nhỏ hơn ngày hiện tại");
        return;
      }
    }

    const payload = { title: editTitle.trim(), dueDate: editDue || null };
    try {
      await onUpdate?.(t.id, payload);
    } catch (err) {
      console.error(err);
      toast.error("Không thể lưu thay đổi");
      return;
    }

    cancelEdit();
  };

  return (
    <div className="bg-white rounded-lg shadow">
      <table className="min-w-full text-left table-fixed w-full">
        <colgroup>
          <col style={{ width: "48px" }} />
          <col />
          <col style={{ width: "160px" }} />
          <col style={{ width: "140px" }} />
          <col style={{ width: "120px" }} />
        </colgroup>
        <thead>
          <tr className="text-sm text-slate-600">
            <th className="px-6 py-3">&nbsp;</th>
            <th className="px-6 py-3">Task</th>
            <th className="px-6 py-3">Due-date</th>
            <th className="px-6 py-3">Status</th>
            <th className="px-6 py-3">Actions</th>
          </tr>
        </thead>
        <tbody>
          {tasks.length === 0 && (
            <tr>
              <td colSpan={5} className="px-6 py-6 text-center text-slate-500">
                Không có task
              </td>
            </tr>
          )}
          {tasks.map((t) => (
            <tr key={t.id} className="border-t last:border-b">
              <td className="px-6 py-4">
                <button
                  onClick={() => onToggle?.(t)}
                  aria-label={
                    t.isCompleted ? "Mark not completed" : "Mark completed"
                  }
                  className={`w-6 h-6 inline-flex items-center justify-center rounded-full border ${
                    t.isCompleted
                      ? "bg-green-500 border-green-500"
                      : "bg-transparent border-slate-300"
                  }`}
                >
                  {t.isCompleted ? (
                    <Check className="w-4 h-4 text-white" />
                  ) : (
                    <></>
                  )}
                </button>
              </td>

              <td className="px-6 py-4 font-medium text-slate-800">
                {editingId === t.id ? (
                  <input
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    className="w-full border px-2 py-1 rounded h-9"
                  />
                ) : (
                  <span
                    className={`block truncate ${
                      t.isCompleted ? "line-through text-slate-400" : ""
                    }`}
                    title={t.title}
                  >
                    {t.title}
                  </span>
                )}
              </td>

              <td className="px-6 py-4">
                {editingId === t.id ? (
                  <input
                    type="date"
                    value={editDue}
                    onChange={(e) => setEditDue(e.target.value)}
                    className="border px-2 py-1 rounded w-36 h-9"
                  />
                ) : (
                  formatDate(t.dueDate)
                )}
              </td>

              <td className="px-6 py-4">
                <div
                  className={`rounded-full text-white text-sm flex items-center justify-center ${
                    t.isCompleted ? "bg-green-500" : "bg-blue-500"
                  }`}
                  style={{ width: 110, height: 36 }}
                  aria-hidden={true}
                >
                  <span className="text-sm select-none">
                    {t.isCompleted ? "Hoàn thành" : "Đang làm"}
                  </span>
                </div>
              </td>
              <td className="px-6 py-4">
                {editingId === t.id ? (
                  <div className="flex items-center gap-2 justify-end">
                    <button
                      onClick={() => saveEdit(t)}
                      className="w-9 h-9 bg-green-500 text-white rounded flex items-center justify-center hover:bg-green-600"
                    >
                      <Check className="w-4 h-4" />
                    </button>
                    <button
                      onClick={cancelEdit}
                      className="w-9 h-9 bg-slate-100 text-slate-700 rounded flex items-center justify-center hover:bg-slate-200"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 justify-end">
                    <button
                      onClick={() => startEdit(t)}
                      className="p-2 text-slate-600 hover:bg-slate-100 rounded"
                      aria-label={`Sửa ${t.title}`}
                    >
                      <Edit2 className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => onDelete?.(t)}
                      className="p-2 text-red-500 hover:bg-red-100 rounded"
                      aria-label={`Xóa ${t.title}`}
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TaskList;
