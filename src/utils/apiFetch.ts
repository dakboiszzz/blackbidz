// src/utils/apiFetch.ts

const API_BASE_URL = import.meta.env.VITE_API_URL;

export async function apiFetch(endpoint: string, options: RequestInit = {}) {
  // 1. Look inside the browser's LocalStorage for a saved token
  const token = localStorage.getItem("admin_token");
  
  // 2. Check if we are uploading a file (FormData)
  const isFormData = options.body instanceof FormData;
  
  // 3. Prepare headers using your Record fix
  const headers: Record<string, string> = {
    // Keep any custom headers passed into the function
    ...(options.headers as Record<string, string>),
  };

  // 4. Only force JSON if it's NOT an image upload
  if (!isFormData) {
    headers["Content-Type"] = "application/json";
  }

  // 5. Attach the token if you are logged in
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  // 6. Actually send the request to your FastAPI backend
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  // 7. Handle expired tokens gracefully
  if (response.status === 401) {
    localStorage.removeItem("admin_token");
    window.location.href = '/login'; 
  }

  return response;
}