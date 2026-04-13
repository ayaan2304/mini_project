/**
 * FILE: client.js
 * PURPOSE: Centralized helper for all frontend HTTP requests to the backend API.
 *
 * FLOW:
 * 1) Build final URL using Vite env or local proxy path.
 * 2) Attach JSON headers and optional Bearer token.
 * 3) Parse JSON response and throw user-friendly errors for failed requests.
 *
 * WHY THIS EXISTS:
 * It prevents duplicated fetch logic and keeps API behavior consistent across pages.
 *
 * DEPENDENCIES:
 * - browser fetch API for network requests
 * - Vite environment variables for API base URL
 */
const API_URL = import.meta.env.VITE_API_URL || "/api";

export const apiRequest = async (path, { method = "GET", token, body } = {}) => {
  const response = await fetch(`${API_URL}${path}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    ...(body ? { body: JSON.stringify(body) } : {}),
  });

  const data = await response.json();
  if (!response.ok) throw new Error(data.message || "Something went wrong");
  return data;
};
