// Thin wrapper around the BulldogEx Shop API (marzan-server).
// Every response from the backend already has the { success, message, data } shape.
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
const SESSION_KEY = 'bulldogex_session';
export const SESSION_EVENT = 'bulldogex-session-change';

// "Remember me" keeps the session in localStorage (survives closing the browser);
// otherwise it lives in sessionStorage and ends with the tab.
export const getSession = () => {
  const raw = localStorage.getItem(SESSION_KEY) ?? sessionStorage.getItem(SESSION_KEY);
  return raw ? JSON.parse(raw) : null;
};
export const setSession = (session, remember) => {
  clearSession();
  (remember ? localStorage : sessionStorage).setItem(SESSION_KEY, JSON.stringify(session));
  window.dispatchEvent(new Event(SESSION_EVENT));
};
// Replaces the stored user (e.g. after a profile edit) without changing where the session is kept.
export const updateSessionUser = (user) => {
  const storage = localStorage.getItem(SESSION_KEY) ? localStorage : sessionStorage;
  storage.setItem(SESSION_KEY, JSON.stringify({ ...getSession(), user }));
  window.dispatchEvent(new Event(SESSION_EVENT));
};
export const getRawSession = () => localStorage.getItem(SESSION_KEY) ?? sessionStorage.getItem(SESSION_KEY);
export const displayName = (user) => user?.username || user?.firstName || '';
export const clearSession = () => {
  localStorage.removeItem(SESSION_KEY);
  sessionStorage.removeItem(SESSION_KEY);
};
export const getToken = () => getSession()?.token ?? null;

class ApiError extends Error {
  constructor(message, status) {
    super(message);
    this.status = status;
  }
}

// `body` as a plain object sends JSON; as a FormData instance (image upload) it is sent as-is,
// since the browser needs to set its own multipart boundary in the Content-Type header.
async function request(path, { method = 'GET', body, auth = false } = {}) {
  const headers = {};
  if (auth) {
    const token = getToken();
    if (token) headers.Authorization = `Bearer ${token}`;
  }
  const isFormData = body instanceof FormData;
  if (body !== undefined && !isFormData) headers['Content-Type'] = 'application/json';

  const res = await fetch(`${API_URL}${path}`, {
    method,
    headers,
    body: body === undefined ? undefined : isFormData ? body : JSON.stringify(body),
  });
  const json = await res.json().catch(() => ({ success: false, message: 'The server did not return a valid response.' }));

  // An expired or invalid token: drop the session and send the user back to log in.
  if (auth && res.status === 401) {
    clearSession();
    window.location.assign('/auth/signin');
  }
  if (!res.ok || !json.success) throw new ApiError(json.message || `Request failed (${res.status})`, res.status);
  return json;
}

export const signIn = (email, password) => request('/api/v1/sessions', { method: 'POST', body: { email, password } });
export const signUp = (data) => request('/api/v1/users', { method: 'POST', body: data });
export const getMe = () => request('/api/v1/users/me', { auth: true });
export const getUsers = () => request('/api/v1/users', { auth: true });
export const updateUser = (id, data) => request(`/api/v1/users/${id}`, { method: 'PATCH', body: data, auth: true });

export const getCategories = () => request('/api/v1/categories');
export const getProducts = (params = {}) =>
  request(`/api/v1/products?${new URLSearchParams({ limit: 100, ...params })}`);
export const getProduct = (name) => request(`/api/v1/products/${name}`);
export const createProduct = (data) => request('/api/v1/products', { method: 'POST', body: data, auth: true });
export const updateProduct = (name, data) => request(`/api/v1/products/${name}`, { method: 'PUT', body: data, auth: true });
export const uploadProductImage = (name, file) => {
  const form = new FormData();
  form.append('image', file);
  return request(`/api/v1/products/${name}/upload-image`, { method: 'POST', body: form, auth: true });
};

export const getOrder = (id) => request(`/api/v1/orders/${id}`, { auth: true });
export const getReviews = (params = {}) => request(`/api/v1/reviews?${new URLSearchParams(params)}`);
export const createReview = (data) => request('/api/v1/reviews', { method: 'POST', body: data, auth: true });
export const getOrders = (params = {}) => request(`/api/v1/orders?${new URLSearchParams(params)}`, { auth: true });
export const createOrder = (data) => request('/api/v1/orders', { method: 'POST', body: data, auth: true });
export const updateOrder = (id, data) => request(`/api/v1/orders/${id}`, { method: 'PATCH', body: data, auth: true });

// Signs in, then loads the profile so the app knows the user's name and role.
export async function logIn(email, password, remember) {
  const { data } = await signIn(email, password);
  setSession({ token: data.token }, remember);
  const { data: user } = await getMe();
  const session = { token: data.token, user };
  setSession(session, remember);
  return session;
}

export { ApiError };
