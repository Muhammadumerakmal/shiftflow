import { env } from "../config/env.js";
import { ShiftModel } from "../models/shift.model.js";
import { StoreModel } from "../models/store.model.js";
import { SwapModel } from "../models/swap.model.js";
import { TimeOffModel } from "../models/timeOff.model.js";
import { AttendanceModel } from "../models/attendance.model.js";
import { SwapService } from "../services/swap.service.js";
import { TimeOffService } from "../services/timeOff.service.js";

const OPENAI_BASE = "https://api.openai.com/v1";

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

// ── Tool execution ────────────────────────────────────────────────

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

async function executeTool(toolName, args, storeId, userId) {
  try {
    switch (toolName) {
      case "getSchedule": {
        const ws = getWeekStart(args.weekStart);
        const we = getWeekEnd(ws);
        const shifts = await ShiftModel.findByStoreAndRange(storeId, ws, we);
        return JSON.stringify(shifts);
      }
      case "getStaffList": {
        const staff = await StoreModel.getStaffList(storeId);
        return JSON.stringify(staff);
      }
      case "getSwaps": {
        const swaps = await SwapModel.findByStore(storeId, args.status);
        return JSON.stringify(swaps);
      }
      case "getTimeOff": {
        const requests = await TimeOffModel.findByStore(storeId, args.status);
        return JSON.stringify(requests);
      }
      case "getAttendance": {
        const date = args.date || new Date().toISOString().split("T")[0];
        const { start, end } = parseDateToStartEnd(date);
        const records = await AttendanceModel.findByStoreAndRange(storeId, start, end);
        return JSON.stringify(records);
      }
      case "whoIsWorking": {
        if (!args.date) return JSON.stringify({ error: "date is required" });
        const ws = getWeekStart(args.date);
        const we = getWeekEnd(ws);
        const shifts = await ShiftModel.findByStoreAndRange(storeId, ws, we);
        const target = new Date(args.date + "T00:00:00Z").toDateString();
        const working = shifts.filter((s) => new Date(s.starts_at).toDateString() === target);
        return JSON.stringify(working);
      }
      case "createShift": {
        const shift = await ShiftModel.create({
          storeId,
          userId: args.userId,
          startsAt: args.startsAt,
          endsAt: args.endsAt,
          position: args.position || null,
        });
        return JSON.stringify({ message: "Draft shift created", shift });
      }
      case "approveSwap": {
        const result = await SwapService.approveSwap(args.swapId, userId);
        return JSON.stringify({ message: "Swap approved", swap: result });
      }
      case "rejectSwap": {
        const result = await SwapService.rejectSwap(args.swapId, userId);
        return JSON.stringify({ message: "Swap rejected", swap: result });
      }
      case "approveTimeOff": {
        const result = await TimeOffService.approveTimeOff(args.requestId, userId);
        return JSON.stringify({ message: "Time-off approved", request: result });
      }
      case "denyTimeOff": {
        const result = await TimeOffService.denyTimeOff(args.requestId, userId);
        return JSON.stringify({ message: "Time-off denied", request: result });
      }
      default:
        return JSON.stringify({ error: `Unknown tool: ${toolName}` });
    }
  } catch (err) {
    return JSON.stringify({ error: err.message });
  }
}

// ── OpenAI agent loop ─────────────────────────────────────────────

export async function agentChat({ message, history = [], storeId, userId }) {
  if (!env.openai.apiKey) {
    const err = new Error("AI is not configured (missing OPENAI_API_KEY).");
    err.status = 503;
    throw err;
  }
  if (!message?.trim()) {
    const err = new Error("A non-empty 'message' is required.");
    err.status = 400;
    throw err;
  }

  const messages = [
    { role: "system", content: SYSTEM_PROMPT },
    ...history.map((t) => ({ role: t.role === "assistant" ? "assistant" : "user", content: t.text })),
    { role: "user", content: message },
  ];

  for (let round = 0; round < 5; round++) {
    const res = await fetch(`${OPENAI_BASE}/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${env.openai.apiKey}`,
      },
      body: JSON.stringify({
        model: env.openai.model,
        messages,
        tools: TOOLS,
        tool_choice: "auto",
        temperature: 0.3,
      }),
    });

    if (!res.ok) {
      const detail = await res.text().catch(() => "");
      const err = new Error(`OpenAI request failed (${res.status}): ${detail.slice(0, 500)}`);
      err.status = 502;
      throw err;
    }

    const data = await res.json();
    const choice = data.choices?.[0];
    if (!choice) {
      const err = new Error("OpenAI returned no choices.");
      err.status = 502;
      throw err;
    }

    const assistantMessage = choice.message;
    messages.push(assistantMessage);

    if (!assistantMessage.tool_calls?.length) {
      return assistantMessage.content || "";
    }

    for (const tc of assistantMessage.tool_calls) {
      const args = JSON.parse(tc.function.arguments || "{}");
      const result = await executeTool(tc.function.name, args, storeId, userId);
      messages.push({
        role: "tool",
        tool_call_id: tc.id,
        content: result,
      });
    }
  }

  const last = messages[messages.length - 1];
  return last?.content || "I wasn't able to complete that request.";
}
