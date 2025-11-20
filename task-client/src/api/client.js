import axios from "axios";

const DEFAULT_API = "http://localhost:5000/api";
// In development prefer a relative `/api` so Vite's dev server proxy can forward requests
const base =
  import.meta.env.VITE_API_BASE_URL ||
  (import.meta.env.MODE === "development" ? "/api" : DEFAULT_API);

const api = axios.create({
  baseURL: base, // URL lấy từ .env or fallback to local backend
  timeout: 10000,
});

console.info("API base URL:", base);

api.interceptors.response.use(
  (res) => res,
  (err) => {
    console.error("API Error:", err);
    return Promise.reject(err);
  }
);
export default api;
