// src/api/apiFetch.js
export async function apiFetch(url, options = {}) {
  const token = localStorage.getItem("token");

  // gabungkan headers yang ada dengan Authorization
  const headers = {
    ...(options.headers || {}),
    Authorization: token ? `Bearer ${token}` : "",
  };

  try {
    const res = await fetch(`http://backend:8080${url}`, {
      ...options,
      headers,
    });

    // Jika token expired atau tidak valid
    if (res.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/signin"; // redirect ke halaman login
      return;
    }

    // Jika response bukan 2xx, lempar error
    if (!res.ok) {
      const errText = await res.text();
      throw new Error(errText || `HTTP ${res.status}`);
    }

    // jika ada body JSON, parse
    const contentType = res.headers.get("content-type") || "";
    if (contentType.includes("application/json")) {
      return res.json();
    }
    return res;
  } catch (err) {
    console.error("apiFetch error:", err);
    throw err;
  }
}
