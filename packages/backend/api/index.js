export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  try {
    const { default: app } = await import("../src/app.js");
    return app(req, res);
  } catch (err) {
    console.error("CRASH:", err.stack || err.message || err);
    res.status(500).json({ success: false, error: err.message || "Server error" });
  }
}
