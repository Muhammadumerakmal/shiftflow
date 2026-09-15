import OpenAI from "openai";
import { env } from "../config/env.js";
import { ShiftModel } from "../models/shift.model.js";
import { StoreModel } from "../models/store.model.js";
import { SwapModel } from "../models/swap.model.js";
import { TimeOffModel } from "../models/timeOff.model.js";
import { AttendanceModel } from "../models/attendance.model.js";
import { SwapService } from "../services/swap.service.js";
import { TimeOffService } from "../services/timeOff.service.js";

const GEMINI_BASE_URL = "https://generativelanguage.googleapis.com/v1beta/openai";

const SYSTEM_PROMPT = `You are Flow, the ShiftFlow AI assistant for store managers.
You help manage shifts, staff, swap requests, and time-off requests.

You have access to tools that read and write store data. Always scope actions to the manager's store.
Be concise, friendly, and confirm before making any changes that create, approve, or reject something.
When asked about schedule coverage, use the tools to check who is actually scheduled.
Never invent data — always use the tools to get real information.`;

// ── Tool definitions ──────────────────────────────────────────────

const TOOLS = [
  {
    type: "function",
    function: {
      name: "getSchedule",
      description: "Get all shifts for a given week. Defaults to the current week.",
      parameters: {
        type: "object",
        properties: {
          weekStart: { type: "string", description: "ISO date of the week's Monday (YYYY-MM-DD). Defaults to current week." },
        },
      },
    },
  },
  {
    type: "function",
    function: {
      name: "getStaffList",
      description: "List all active staff members in the store.",
      parameters: { type: "object", properties: {} },
    },
  },
  {
    type: "function",
    function: {
      name: "getSwaps",
      description: "List swap requests, optionally filtered by status.",
      parameters: {
        type: "object",
        properties: {
          status: { type: "string", enum: ["open", "manager_review", "accepted", "approved", "rejected"], description: "Filter by status" },
        },
      },
    },
  },
  {
    type: "function",
    function: {
      name: "getTimeOff",
      description: "List time-off requests, optionally filtered by status.",
      parameters: {
        type: "object",
        properties: {
          status: { type: "string", enum: ["pending", "approved", "denied"], description: "Filter by status" },
        },
      },
    },
  },
  {
    type: "function",
    function: {
      name: "getAttendance",
      description: "List attendance records for a given date.",
      parameters: {
        type: "object",
        properties: {
          date: { type: "string", description: "ISO date (YYYY-MM-DD). Defaults to today." },
        },
      },
    },
  },
  {
    type: "function",
    function: {
      name: "whoIsWorking",
      description: "List staff members scheduled to work on a specific day.",
      parameters: {
        type: "object",
        properties: {
          date: { type: "string", description: "ISO date (YYYY-MM-DD). Required." },
        },
        required: ["date"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "createShift",
      description: "Create a new draft shift for a staff member.",
      parameters: {
        type: "object",
        properties: {
          userId: { type: "string", description: "The staff member's user ID" },
          startsAt: { type: "string", description: "ISO datetime for shift start" },
          endsAt: { type: "string", description: "ISO datetime for shift end" },
          position: { type: "string", description: "Job position (e.g. Cashier, Manager)" },
        },
        required: ["userId", "startsAt", "endsAt"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "approveSwap",
      description: "Approve a pending swap request (must be in manager_review status).",
      parameters: {
        type: "object",
        properties: {
          swapId: { type: "string", description: "The swap request ID" },
        },
        required: ["swapId"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "rejectSwap",
      description: "Reject a pending swap request.",
      parameters: {
        type: "object",
        properties: {
          swapId: { type: "string", description: "The swap request ID" },
        },
        required: ["swapId"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "approveTimeOff",
      description: "Approve a pending time-off request.",
      parameters: {
        type: "object",
        properties: {
          requestId: { type: "string", description: "The time-off request ID" },
        },
        required: ["requestId"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "denyTimeOff",
      description: "Deny a pending time-off request.",
      parameters: {
        type: "object",
        properties: {
          requestId: { type: "string", description: "The time-off request ID" },
        },
        required: ["requestId"],
      },
    },
  },
];

// ── Helpers ───────────────────────────────────────────────────────

function getWeekStart(dateStr) {
  if (dateStr) {
    const d = new Date(dateStr + "T00:00:00Z");
    const day = d.getUTCDay();
    const diff = d.getUTCDate() - day + (day === 0 ? -6 : 1);
    d.setUTCDate(diff);
    return d.toISOString().split("T")[0];
  }
  const now = new Date();
  const day = now.getUTCDay();
  const diff = now.getUTCDate() - day + (day === 0 ? -6 : 1);
  now.setUTCDate(diff);
  return now.toISOString().split("T")[0];
}

function getWeekEnd(weekStart) {
  const d = new Date(weekStart + "T00:00:00Z");
  d.setUTCDate(d.getUTCDate() + 7);
  return d.toISOString().split("T")[0];
}

function parseDateToStartEnd(dateStr) {
  const d = new Date(dateStr + "T00:00:00Z");
  const end = new Date(d);
  end.setUTCDate(end.getUTCDate() + 1);
  return { start: d.toISOString(), end: end.toISOString() };
}

// ── Tool execution ────────────────────────────────────────────────

async function executeTool(toolName, args, storeId, userId) {
  try {
    switch (toolName) {
      case "getSchedule": {
        const ws = getWeekStart(args.weekStart);
        const we = getWeekEnd(ws);
        return await ShiftModel.findByStoreAndRange(storeId, ws, we);
      }
      case "getStaffList":
        return await StoreModel.getStaffList(storeId);
      case "getSwaps":
        return await SwapModel.findByStore(storeId, args.status);
      case "getTimeOff":
        return await TimeOffModel.findByStore(storeId, args.status);
      case "getAttendance": {
        const date = args.date || new Date().toISOString().split("T")[0];
        const { start, end } = parseDateToStartEnd(date);
        return await AttendanceModel.findByStoreAndRange(storeId, start, end);
      }
      case "whoIsWorking": {
        if (!args.date) return { error: "date is required" };
        const ws = getWeekStart(args.date);
        const we = getWeekEnd(ws);
        const shifts = await ShiftModel.findByStoreAndRange(storeId, ws, we);
        const target = new Date(args.date + "T00:00:00Z").toDateString();
        return shifts.filter((s) => new Date(s.starts_at).toDateString() === target);
      }
      case "createShift": {
        const shift = await ShiftModel.create({
          storeId,
          userId: args.userId,
          startsAt: args.startsAt,
          endsAt: args.endsAt,
          position: args.position || null,
        });
        return { message: "Draft shift created", shift };
      }
      case "approveSwap":
        return await SwapService.approveSwap(args.swapId, userId);
      case "rejectSwap":
        return await SwapService.rejectSwap(args.swapId, userId);
      case "approveTimeOff":
        return await TimeOffService.approveTimeOff(args.requestId, userId);
      case "denyTimeOff":
        return await TimeOffService.denyTimeOff(args.requestId, userId);
      default:
        return { error: `Unknown tool: ${toolName}` };
    }
  } catch (err) {
    return { error: err.message };
  }
}

// ── Agent loop (Gemini via OpenAI-compatible endpoint) ─────────────

export async function agentChat({ message, history = [], storeId, userId }) {
  if (!env.gemini.apiKey) {
    const err = new Error("AI is not configured (missing GEMINI_API_KEY).");
    err.status = 503;
    throw err;
  }
  if (!message?.trim()) {
    const err = new Error("A non-empty 'message' is required.");
    err.status = 400;
    throw err;
  }

  const client = new OpenAI({
    apiKey: env.gemini.apiKey,
    baseURL: GEMINI_BASE_URL,
  });

  const messages = [
    { role: "system", content: SYSTEM_PROMPT },
    ...history.map((t) => ({ role: t.role === "assistant" ? "assistant" : "user", content: t.text })),
    { role: "user", content: message },
  ];

  // Run up to 5 tool-call rounds
  for (let round = 0; round < 5; round++) {
    const res = await client.chat.completions.create({
      model: env.gemini.model || "gemini-2.0-flash",
      messages,
      tools: TOOLS,
      tool_choice: "auto",
      temperature: 0.3,
    });

    const choice = res.choices?.[0];
    if (!choice) {
      const err = new Error("Gemini returned no choices.");
      err.status = 502;
      throw err;
    }

    const assistantMessage = choice.message;
    messages.push(assistantMessage);

    // No tool calls — return the text response
    if (!assistantMessage.tool_calls?.length) {
      return assistantMessage.content || "";
    }

    // Execute each tool call
    for (const tc of assistantMessage.tool_calls) {
      const args = JSON.parse(tc.function.arguments || "{}");
      const result = await executeTool(tc.function.name, args, storeId, userId);
      messages.push({
        role: "tool",
        tool_call_id: tc.id,
        content: typeof result === "string" ? result : JSON.stringify(result),
      });
    }
  }

  const last = messages[messages.length - 1];
  return last?.content || "I wasn't able to complete that request.";
}
