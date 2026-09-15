import "./globals.css";
import { AuthProvider } from "../lib/auth-context";

export const metadata = {
  title: "ShiftFlow",
  description: "Schedule, swap, and track attendance — built for retail teams.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
