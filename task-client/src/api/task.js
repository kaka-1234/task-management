import api from "./client";

// get all tasks
export const getAllTasks = async () => {
  const res = await api.get("/tasks");
  return res.data;
};

// get task by id
export const getTaskById = async (id) => {
  const res = await api.get(`/tasks/${id}`);
  return res.data;
};

// create a new task
export const createTask = async (task) => {
  const res = await api.post("/tasks", task);
  return res.data;
};

// update a task by id
export const updateTask = async (id, updates) => {
  const res = await api.put(`/tasks/${id}`, updates);
  return res.data;
};

// delete a task by id
export const deleteTask = async (id) => {
  const res = await api.delete(`/tasks/${id}`);
  return res.data;
};
