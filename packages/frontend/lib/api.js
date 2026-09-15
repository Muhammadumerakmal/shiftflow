const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";

function getToken() {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("accessToken");
}

async function request(path, { method = "GET", body, auth = true } = {}) {
  const headers = { "Content-Type": "application/json" };

  if (auth) {
    const token = getToken();
    if (token) headers.Authorization = `Bearer ${token}`;
  }

  const res = await fetch(`${API_URL}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(data.error || `Request failed (${res.status})`);
  }

  return data.data;
}

export const api = {
  // Auth
  login: (email, password) =>
    request("/auth/login", { method: "POST", body: { email, password }, auth: false }),
  register: (payload) =>
    request("/auth/register", { method: "POST", body: payload, auth: false }),
  getMe: () => request("/auth/me"),

  // OTP (Staff login)
  requestOtp: (phone) =>
    request("/auth/otp/request", { method: "POST", body: { phone }, auth: false }),
  verifyOtp: (phone, code) =>
    request("/auth/otp/verify", { method: "POST", body: { phone, code }, auth: false }),

  // Store & Staff
  getStore: (storeId) => request(`/stores/${storeId}`),
  getStaffList: (storeId) => request(`/stores/${storeId}/staff`),
  inviteStaff: (storeId, payload) =>
    request(`/stores/${storeId}/staff/invite`, { method: "POST", body: payload }),
  updateStaff: (staffId, payload) =>
    request(`/stores/${storeId}/staff/${staffId}`, { method: "PATCH", body: payload }),

  // Shifts
  getWeekSchedule: (storeId, weekStart) =>
    request(`/stores/${storeId}/shifts?weekStart=${weekStart}`),
  createShift: (storeId, payload) =>
    request(`/stores/${storeId}/shifts`, { method: "POST", body: payload }),
  updateShift: (shiftId, payload) =>
    request(`/shifts/${shiftId}`, { method: "PATCH", body: payload }),
  deleteShift: (shiftId) => request(`/shifts/${shiftId}`, { method: "DELETE" }),
  publishWeek: (storeId, weekStart) =>
    request(`/stores/${storeId}/shifts/publish`, { method: "POST", body: { weekStart } }),

  // Swap Requests
  requestSwap: (shiftId, payload) =>
    request(`/shifts/${shiftId}/swap-request`, { method: "POST", body: payload }),
  listSwaps: (storeId, status) =>
    request(`/stores/${storeId}/swap-requests${status ? `?status=${status}` : ""}`),
  acceptSwap: (swapId) => request(`/swap-requests/${swapId}/accept`, { method: "POST" }),
  approveSwap: (swapId) => request(`/swap-requests/${swapId}/approve`, { method: "POST" }),
  rejectSwap: (swapId) => request(`/swap-requests/${swapId}/reject`, { method: "POST" }),

  // Time Off
  requestTimeOff: (storeId, payload) =>
    request(`/stores/${storeId}/time-off`, { method: "POST", body: payload }),
  listTimeOff: (storeId, status) =>
    request(`/stores/${storeId}/time-off${status ? `?status=${status}` : ""}`),
  approveTimeOff: (id) => request(`/time-off/${id}/approve`, { method: "PATCH" }),
  denyTimeOff: (id) => request(`/time-off/${id}/deny`, { method: "PATCH" }),

  // Attendance
  clockIn: (payload) => request(`/attendance/clock-in`, { method: "POST", body: payload }),
  clockOut: () => request(`/attendance/clock-out`, { method: "POST" }),
  listAttendance: (storeId, date) =>
    request(`/stores/${storeId}/attendance${date ? `?date=${date}` : ""}`),
  attendanceExportUrl: (storeId, weekStart) =>
    `${API_URL}/stores/${storeId}/attendance/export?weekStart=${weekStart}`,

  // Notifications
  listNotifications: (unreadOnly) =>
    request(`/notifications${unreadOnly ? "?unread=true" : ""}`),
  markNotificationRead: (id) =>
    request(`/notifications/${id}/read`, { method: "PATCH" }),

  // AI assistant (Gemini-backed, schedule-aware)
  chat: (message, history = []) =>
    request(`/ai/chat`, { method: "POST", body: { message, history } }),
};
