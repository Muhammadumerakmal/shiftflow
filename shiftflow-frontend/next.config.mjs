import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/** @type {import('next').NextConfig} */
const nextConfig = {
  // This app lives in a subfolder of the backend repo, which has its own
  // lockfile. Pin the tracing root to this frontend so Next.js stops inferring
  // the backend directory as the workspace root.
  outputFileTracingRoot: __dirname,
};

export default nextConfig;
