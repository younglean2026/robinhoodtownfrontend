import { API_URL } from "../config.js";

const TOKEN_KEY = "rht_session";

export function getSession() {
  try {
    return JSON.parse(localStorage.getItem(TOKEN_KEY)) || null;
  } catch {
    return null;
  }
}

export function setSession(session) {
  localStorage.setItem(TOKEN_KEY, JSON.stringify(session));
}

export function clearSession() {
  localStorage.removeItem(TOKEN_KEY);
}

async function request(path, { method = "GET", body, auth = false } = {}) {
  const headers = { "Content-Type": "application/json" };
  if (auth) {
    const session = getSession();
    if (!session?.token) throw new Error("NOT_LOGGED_IN");
    headers.Authorization = `Bearer ${session.token}`;
  }

  const res = await fetch(`${API_URL}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined
  });

  let data = null;
  try {
    data = await res.json();
  } catch {
    /* non-JSON error body */
  }

  if (!res.ok) {
    if (res.status === 401 && auth) clearSession();
    throw new Error(data?.error || `HTTP_${res.status}`);
  }
  return data;
}

export const api = {
  getNonce: (address) => request(`/auth/nonce?address=${address}`),
  verify: (address, signature) =>
    request("/auth/verify", { method: "POST", body: { address, signature } }),
  getState: () => request("/state", { auth: true }),
  deploy: (tokenId) => request("/deploy", { method: "POST", body: { tokenId }, auth: true }),
  undeploy: (tokenId) =>
    request("/undeploy", { method: "POST", body: { tokenId }, auth: true }),
  claim: () => request("/claim", { method: "POST", auth: true })
};
