import React, { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import Header from "../components/Header";
import AddTask from "../components/AddTask";
import StatsAndFilter from "../components/StatsAndFilter";
import TaskList from "../components/TaskList";
import Pagination from "../components/Pagination";
import DateFilter from "../components/DateFilter";
import { getAllTasks, createTask, updateTask, deleteTask } from "../api/task";

const PAGE_SIZE = 4;

const HomePage = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [statusFilter, setStatusFilter] = useState("");
  const [datePeriod, setDatePeriod] = useState("all");
  const [page, setPage] = useState(1);

  const load = async () => {
    setLoading(true);
    try {
      const res = await getAllTasks();
      setTasks(res || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleAdd = async ({ title, dueDate }) => {
    try {
      const created = await createTask({ title, dueDate });
      // update local state without reloading entire list to avoid full UI reflow
      setTasks((s) => [created, ...(s || [])]);
      setPage(1);
      toast.success("Thêm task thành công");
    } catch (err) {
      console.error(err);
      toast.error("Không thể tạo task");
    }
  };

  const handleToggle = async (t) => {
    try {
      // optimistic local update to avoid reloading the whole UI
      setTasks((s) =>
        s.map((it) =>
          it.id === t.id ? { ...it, isCompleted: !it.isCompleted } : it
        )
      );

      await updateTask(t.id, {
        title: t.title,
        dueDate: t.dueDate ?? null,
        isCompleted: !t.isCompleted,
      });

      toast.success("Cập nhật trạng thái thành công");
    } catch (err) {
      console.error(err);
      toast.error("Không thể cập nhật task");
      // revert by reloading if error
      await load();
    }
  };

  const handleDelete = async (t) => {
    try {
      await deleteTask(t.id);
      // update local state without reloading the page
      setTasks((s) => s.filter((it) => it.id !== t.id));
      toast.success("Xóa task thành công");
    } catch (err) {
      console.error(err);
      toast.error("Không thể xóa task");
    }
  };

  const handleUpdate = async (id, payload) => {
    try {
      await updateTask(id, payload);
      // apply update locally to avoid full reload and layout shifts
      setTasks((s) =>
        s.map((it) => (it.id === id ? { ...it, ...payload } : it))
      );
      toast.success("Cập nhật thành công");
    } catch (err) {
      console.error(err);
      toast.error("Không thể cập nhật task");
    }
  };

  const filtered = useMemo(() => {
    const today = new Date();
    const startOfToday = new Date(today);
    startOfToday.setHours(0, 0, 0, 0);
    const endOfToday = new Date(today);
    endOfToday.setHours(23, 59, 59, 999);

    // start of week (Monday)
    const day = today.getDay();
    const deltaToMon = (day + 6) % 7; // 0=>Mon, 6=>Sun
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - deltaToMon);
    startOfWeek.setHours(0, 0, 0, 0);
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);
    endOfWeek.setHours(23, 59, 59, 999);

    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    startOfMonth.setHours(0, 0, 0, 0);
    const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);
    endOfMonth.setHours(23, 59, 59, 999);

    return tasks.filter((t) => {
      if (statusFilter === "pending" && t.isCompleted) return false;
      if (statusFilter === "done" && !t.isCompleted) return false;

      if (datePeriod && datePeriod !== "all") {
        const d = t.dueDate ? new Date(t.dueDate) : null;
        if (!d) return false;

        if (datePeriod === "today") {
          if (d < startOfToday || d > endOfToday) return false;
        } else if (datePeriod === "week") {
          if (d < startOfWeek || d > endOfWeek) return false;
        } else if (datePeriod === "month") {
          if (d < startOfMonth || d > endOfMonth) return false;
        }
      }

      return true;
    });
  }, [tasks, statusFilter, datePeriod]);

  const pendingCount = filtered.filter((t) => !t.isCompleted).length;
  const doneCount = filtered.filter((t) => t.isCompleted).length;

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pageItems = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [totalPages]);

  return (
    <div className="min-h-screen bg-slate-50 py-12 flex justify-center">
      <div className="w-full max-w-3xl bg-white rounded-2xl p-8 shadow-lg">
        <Header />

        <div className="mt-6">
          <AddTask onAdd={handleAdd} />
        </div>

        <div className="mt-4 flex items-center justify-between">
          <StatsAndFilter
            status={statusFilter}
            onStatusChange={setStatusFilter}
            pendingCount={pendingCount}
            doneCount={doneCount}
          />
        </div>

        <div className="mt-6">
          {loading ? (
            <div>Loading...</div>
          ) : (
            <TaskList
              tasks={pageItems}
              onToggle={handleToggle}
              onDelete={handleDelete}
              onUpdate={handleUpdate}
            />
          )}
        </div>

        <div className="mt-4 flex items-center justify-between">
          <div className="flex items-center">
            {/* left: pagination */}
            <Pagination current={page} total={totalPages} onChange={setPage} />
          </div>

          <div>
            {/* right: date filter (period select) */}
            <DateFilter
              period={datePeriod}
              onChange={(v) => setDatePeriod(v)}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
