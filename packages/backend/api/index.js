import app from "../src/app.js";

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  try {
    return app(req, res);
  } catch (err) {
    console.error("CRASH:", err.stack || err.message || err);
    res.status(500).json({ success: false, error: err.message || "Server error" });
  }
}
