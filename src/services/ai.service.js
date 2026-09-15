import { env } from "../config/env.js";
import { ShiftModel } from "../models/shift.model.js";

const GEMINI_BASE = "https://generativelanguage.googleapis.com/v1beta";

const SYSTEM_PROMPT =
  "You are Flow, the ShiftFlow assistant. Help employees with questions about " +
  "their shifts, schedules, shift swaps, time-off requests, and attendance. " +
  "Be concise, friendly, and practical. Use the CONTEXT block for the user's " +
  "real schedule data when answering. If the context has no shifts and the " +
  "user asks about their schedule, say you don't see any upcoming shifts — " +
  "never invent shifts, dates, or times.";

/**
 * Build a plain-text CONTEXT block describing the user's upcoming shifts,
 * so Gemini can answer schedule questions with real data.
 */
async function buildScheduleContext(userId) {
  if (!userId) return "";
  const shifts = await ShiftModel.findUpcomingByUser(userId, 10);
  if (!shifts.length) {
    return "CONTEXT — The user has no upcoming published shifts.";
  }
  const lines = shifts.map((s) => {
    const start = new Date(s.starts_at);
    const end = new Date(s.ends_at);
    const day = start.toLocaleDateString("en-US", {
      weekday: "long",
      month: "short",
      day: "numeric",
    });
    const time = (d) =>
      d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
    const where = s.store_name ? ` at ${s.store_name}` : "";
    const role = s.position ? ` (${s.position})` : "";
    return `- ${day}: ${time(start)}–${time(end)}${where}${role}`;
  });
  return `CONTEXT — The user's upcoming shifts (current time: ${new Date().toISOString()}):\n${lines.join("\n")}`;
}

/**
 * Send a chat message to Google Gemini and return the assistant's reply text.
 *
 * @param {object} params
 * @param {string} params.message - The user's latest message.
 * @param {Array<{role: "user"|"model", text: string}>} [params.history] - Prior turns.
 * @param {string} [params.userId] - When provided, the user's real upcoming
 *   shifts are fetched and supplied to the model as context.
 * @returns {Promise<string>} The model's reply text.
 */
export async function chatWithGemini({ message, history = [], userId } = {}) {
  if (!env.gemini.apiKey) {
    const err = new Error("Gemini is not configured (missing GEMINI_API_KEY).");
    err.status = 503;
    throw err;
  }
  if (!message || !message.trim()) {
    const err = new Error("A non-empty 'message' is required.");
    err.status = 400;
    throw err;
  }

  const scheduleContext = await buildScheduleContext(userId);

  const contents = [
    ...history.map((turn) => ({
      role: turn.role === "model" ? "model" : "user",
      parts: [{ text: turn.text }],
    })),
    {
      role: "user",
      parts: [{ text: scheduleContext ? `${scheduleContext}\n\n${message}` : message }],
    },
  ];

  const url =
    `${GEMINI_BASE}/models/${env.gemini.model}:generateContent` +
    `?key=${encodeURIComponent(env.gemini.apiKey)}`;

  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      systemInstruction: { parts: [{ text: SYSTEM_PROMPT }] },
      contents,
    }),
  });

  if (!res.ok) {
    const detail = await res.text().catch(() => "");
    const err = new Error(
      `Gemini request failed (${res.status}): ${detail.slice(0, 500)}`
    );
    err.status = res.status === 401 || res.status === 403 ? 502 : 502;
    throw err;
  }

  const data = await res.json();
  const reply = data?.candidates?.[0]?.content?.parts
    ?.map((p) => p.text)
    .filter(Boolean)
    .join("")
    .trim();

  if (!reply) {
    const err = new Error("Gemini returned an empty response.");
    err.status = 502;
    throw err;
  }

  return reply;
}
