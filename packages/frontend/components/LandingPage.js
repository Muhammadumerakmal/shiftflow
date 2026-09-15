"use client";

import Link from "next/link";

const features = [
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
      </svg>
    ),
    title: "Smart Scheduling",
    desc: "Create, publish, and manage weekly shifts with overlap detection built in.",
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 21L3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5" />
      </svg>
    ),
    title: "Shift Swaps",
    desc: "Staff request swaps, colleagues accept, managers approve — all in a clean workflow.",
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5m-9-6h.008v.008H12v-.008zM12 15h.008v.008H12V15zm0 2.25h.008v.008H12v-.008zM9.75 15h.008v.008H9.75V15zm0 2.25h.008v.008H9.75v-.008zM7.5 15h.008v.008H7.5V15zm0 2.25h.008v.008H7.5v-.008zm6.75-4.5h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008V15zm0 2.25h.008v.008h-.008v-.008zm2.25-4.5h.008v.008H16.5v-.008zm0 2.25h.008v.008H16.5V15z" />
      </svg>
    ),
    title: "Time-Off Requests",
    desc: "Staff submit, managers approve or deny with one tap. Overlap detection included.",
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    title: "Attendance Tracking",
    desc: "Clock in/out with variance tracking. Flag late arrivals and export CSV reports.",
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
      </svg>
    ),
    title: "Instant Notifications",
    desc: "In-app and email alerts for schedule publishes, swaps, and time-off decisions.",
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
      </svg>
    ),
    title: "AI Assistant",
    desc: "Chat with Flow — your AI scheduling assistant that knows your shifts and availability.",
  },
];

const steps = [
  {
    num: "01",
    title: "Create Your Store",
    desc: "Sign up as an owner and set up your store in seconds.",
  },
  {
    num: "02",
    title: "Invite Your Team",
    desc: "Send SMS invites to your staff — they join with a single tap.",
  },
  {
    num: "03",
    title: "Build the Schedule",
    desc: "Create shifts, assign staff, and publish the weekly schedule.",
  },
  {
    num: "04",
    title: "Manage on the Go",
    desc: "Handle swaps, time-off, and attendance from anywhere.",
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Nav */}
      <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-md z-50 border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div
              className="w-8 h-8 rounded-xl flex items-center justify-center text-white font-bold text-sm shadow-md"
              style={{ background: "linear-gradient(135deg, #5B8DEF, #9B7BFF)" }}
            >
              S
            </div>
            <span className="text-lg font-semibold text-text-primary">ShiftFlow</span>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="text-sm font-medium text-text-secondary hover:text-text-primary transition"
            >
              Log In
            </Link>
            <Link
              href="/login"
              className="text-sm font-medium bg-accent text-white px-5 py-2.5 rounded-xl hover:opacity-90 transition shadow-[0_4px_14px_rgba(91,141,239,0.3)]"
            >
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-20 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-accent/5 text-accent text-xs font-medium px-4 py-1.5 rounded-full mb-6 border border-accent/10">
            <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse-soft"></span>
            Built for retail teams
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-text-primary leading-[1.1] mb-6 tracking-tight">
            Shift scheduling
            <br />
            <span
              className="bg-clip-text text-transparent"
              style={{ backgroundImage: "linear-gradient(135deg, #5B8DEF, #9B7BFF)" }}
            >
              that actually works
            </span>
          </h1>
          <p className="text-lg sm:text-xl text-text-secondary max-w-2xl mx-auto mb-10 leading-relaxed">
            Stop juggling spreadsheets and group chats. ShiftFlow lets you build schedules,
            handle swaps, track attendance, and manage time-off — all in one place.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/login"
              className="w-full sm:w-auto bg-accent text-white font-medium px-8 py-3.5 rounded-xl hover:opacity-90 transition text-center shadow-[0_6px_20px_rgba(91,141,239,0.35)]"
            >
              Start Free — No Card Needed
            </Link>
            <a
              href="#features"
              className="w-full sm:w-auto border border-gray-200 text-text-secondary font-medium px-8 py-3.5 rounded-xl hover:bg-gray-50 transition text-center"
            >
              See How It Works
            </a>
          </div>
        </div>
      </section>

      {/* Dashboard Preview */}
      <section className="pb-20 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto">
          <div className="bg-neutral rounded-3xl border border-gray-200 p-6 sm:p-8 shadow-[0_24px_60px_rgba(91,141,239,0.1)]">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-3 h-3 rounded-full bg-red-400"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
              <div className="w-3 h-3 rounded-full bg-green-400"></div>
              <span className="ml-2 text-xs text-text-muted font-mono">shiftflow.app/schedule</span>
            </div>
            <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
              <div className="grid grid-cols-7 border-b border-gray-100">
                {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((d) => (
                  <div key={d} className="p-2 sm:p-3 text-center text-xs font-medium text-text-muted">
                    {d}
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-7 min-h-[200px]">
                {[
                  { day: 0, shifts: [{ name: "Alex", time: "9a-5p", bg: "bg-accent/10", text: "text-accent" }] },
                  { day: 1, shifts: [{ name: "Jordan", time: "10a-6p", bg: "bg-emerald-50", text: "text-emerald-700" }] },
                  { day: 2, shifts: [{ name: "Alex", time: "9a-5p", bg: "bg-accent/10", text: "text-accent" }, { name: "Sam", time: "12p-8p", bg: "bg-amber-50", text: "text-amber-700" }] },
                  { day: 3, shifts: [{ name: "Jordan", time: "10a-6p", bg: "bg-emerald-50", text: "text-emerald-700" }] },
                  { day: 4, shifts: [{ name: "Sam", time: "11a-7p", bg: "bg-amber-50", text: "text-amber-700" }] },
                  { day: 5, shifts: [{ name: "Alex", time: "10a-4p", bg: "bg-accent/10", text: "text-accent" }, { name: "Jordan", time: "10a-4p", bg: "bg-emerald-50", text: "text-emerald-700" }] },
                  { day: 6, shifts: [] },
                ].map((col) => (
                  <div key={col.day} className="p-1 sm:p-2 border-r border-gray-50 last:border-r-0">
                    {col.shifts.map((s, i) => (
                      <div
                        key={i}
                        className={`${s.bg} ${s.text} rounded-lg px-1.5 py-1.5 mb-1 text-[10px] sm:text-xs transition-all hover:scale-[1.02]`}
                      >
                        <div className="font-semibold truncate">{s.name}</div>
                        <div className="opacity-70">{s.time}</div>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 px-4 sm:px-6 bg-neutral">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-text-primary mb-4 tracking-tight">
              Everything you need to manage shifts
            </h2>
            <p className="text-text-secondary text-lg max-w-2xl mx-auto">
              From scheduling to attendance, ShiftFlow handles the logistics so you can focus on your store.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {features.map((f, i) => (
              <div
                key={f.title}
                className="bg-white rounded-2xl p-6 border border-gray-100 hover:shadow-[0_12px_40px_rgba(91,141,239,0.12)] hover:border-accent/20 transition-all duration-300 group"
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                <div className="w-11 h-11 rounded-xl bg-accent/10 text-accent flex items-center justify-center mb-4 group-hover:bg-accent group-hover:text-white transition-colors duration-300">
                  {f.icon}
                </div>
                <h3 className="text-lg font-semibold text-text-primary mb-2">{f.title}</h3>
                <p className="text-sm text-text-secondary leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-text-primary mb-4 tracking-tight">
              Up and running in minutes
            </h2>
            <p className="text-text-secondary text-lg">
              No complex setup. No training required.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((s, i) => (
              <div key={s.num} className="text-center group">
                <div
                  className="text-4xl font-bold mb-3 bg-clip-text text-transparent"
                  style={{ backgroundImage: "linear-gradient(135deg, #5B8DEF, #9B7BFF)" }}
                >
                  {s.num}
                </div>
                <h3 className="text-lg font-semibold text-text-primary mb-2">{s.title}</h3>
                <p className="text-sm text-text-secondary leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section
        className="py-20 px-4 sm:px-6"
        style={{ background: "linear-gradient(135deg, #5B8DEF, #9B7BFF)" }}
      >
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4 tracking-tight">
            Ready to simplify your scheduling?
          </h2>
          <p className="text-white/70 text-lg mb-8">
            Join retail teams that use ShiftFlow to save hours every week.
          </p>
          <Link
            href="/login"
            className="inline-block bg-white text-accent font-semibold px-8 py-3.5 rounded-xl hover:bg-gray-50 transition shadow-lg"
          >
            Get Started Free
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 sm:px-6 border-t border-gray-100">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div
              className="w-6 h-6 rounded-lg flex items-center justify-center text-white font-bold text-[10px]"
              style={{ background: "linear-gradient(135deg, #5B8DEF, #9B7BFF)" }}
            >
              S
            </div>
            <span className="text-sm font-medium text-text-primary">ShiftFlow</span>
          </div>
          <p className="text-xs text-text-muted">
            Shift management for retail teams. Built with care.
          </p>
        </div>
      </footer>
    </div>
  );
}
