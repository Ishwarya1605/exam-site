export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "https://exam-site-backend-theta.vercel.app";

export function apiUrl(path) {
  if (!path) return API_BASE_URL;
  if (path.startsWith("/")) return `${API_BASE_URL}${path}`;
  return `${API_BASE_URL}/${path}`;
}
