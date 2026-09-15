"use client";

import Link from "next/link";

const features = [
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    ),
    title: "Smart Scheduling",
    desc: "Create, publish, and manage weekly shifts with drag-and-drop simplicity. Detect overlaps instantly.",
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
      </svg>
    ),
    title: "Shift Swaps",
    desc: "Staff can request swaps, colleagues accept, and managers approve — all with a clean state-machine workflow.",
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    title: "Time-Off Requests",
    desc: "Staff submit requests, managers approve or deny with one tap. Overlap detection built in.",
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    title: "Attendance Tracking",
    desc: "Clock in/out with variance tracking. Flag late arrivals and export weekly CSV reports.",
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
      </svg>
    ),
    title: "Instant Notifications",
    desc: "In-app and email alerts for schedule publishes, swap requests, and time-off decisions.",
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
    title: "AI Assistant",
    desc: "Chat with Flow — your AI scheduling assistant that knows your upcoming shifts and availability.",
  },
];

const steps = [
  {
    num: "01",
    title: "Create Your Store",
    desc: "Sign up as an owner and set up your store profile in seconds.",
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
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary text-white flex items-center justify-center font-bold text-sm">
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
              className="text-sm font-medium bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-light transition"
            >
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-20 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-primary/5 text-primary text-xs font-medium px-3 py-1 rounded-full mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></span>
            Built for retail teams
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-text-primary leading-tight mb-6">
            Shift scheduling
            <br />
            <span className="text-primary">that actually works</span>
          </h1>
          <p className="text-lg sm:text-xl text-text-secondary max-w-2xl mx-auto mb-10 leading-relaxed">
            Stop juggling spreadsheets and group chats. ShiftFlow lets you build schedules,
            handle swaps, track attendance, and manage time-off — all in one place.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/login"
              className="w-full sm:w-auto bg-primary text-white font-medium px-8 py-3 rounded-lg hover:bg-primary-light transition text-center"
            >
              Start Free — No Card Needed
            </Link>
            <a
              href="#features"
              className="w-full sm:w-auto border border-gray-200 text-text-secondary font-medium px-8 py-3 rounded-lg hover:bg-gray-50 transition text-center"
            >
              See How It Works
            </a>
          </div>
        </div>
      </section>

      {/* Dashboard Preview */}
      <section className="pb-20 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto">
          <div className="bg-neutral rounded-2xl border border-gray-200 p-6 sm:p-8 shadow-2xl shadow-primary/5">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-3 h-3 rounded-full bg-red-400"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
              <div className="w-3 h-3 rounded-full bg-green-400"></div>
              <span className="ml-2 text-xs text-text-secondary">shiftflow.app/schedule</span>
            </div>
            <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
              {/* Mini schedule mockup */}
              <div className="grid grid-cols-7 border-b border-gray-100">
                {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((d) => (
                  <div key={d} className="p-2 sm:p-3 text-center text-xs font-medium text-text-secondary">
                    {d}
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-7 min-h-[200px]">
                {[
                  { day: 0, shifts: [{ name: "Alex", time: "9a-5p", color: "bg-primary/10 text-primary" }] },
                  { day: 1, shifts: [{ name: "Jordan", time: "10a-6p", color: "bg-emerald-50 text-emerald-700" }] },
                  { day: 2, shifts: [{ name: "Alex", time: "9a-5p", color: "bg-primary/10 text-primary" }, { name: "Sam", time: "12p-8p", color: "bg-amber-50 text-amber-700" }] },
                  { day: 3, shifts: [{ name: "Jordan", time: "10a-6p", color: "bg-emerald-50 text-emerald-700" }] },
                  { day: 4, shifts: [{ name: "Sam", time: "11a-7p", color: "bg-amber-50 text-amber-700" }] },
                  { day: 5, shifts: [{ name: "Alex", time: "10a-4p", color: "bg-primary/10 text-primary" }, { name: "Jordan", time: "10a-4p", color: "bg-emerald-50 text-emerald-700" }] },
                  { day: 6, shifts: [] },
                ].map((col) => (
                  <div key={col.day} className="p-1 sm:p-2 border-r border-gray-50 last:border-r-0">
                    {col.shifts.map((s, i) => (
                      <div
                        key={i}
                        className={`${s.color} rounded-md px-1.5 py-1 mb-1 text-[10px] sm:text-xs`}
                      >
                        <div className="font-medium truncate">{s.name}</div>
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
            <h2 className="text-3xl sm:text-4xl font-bold text-text-primary mb-4">
              Everything you need to manage shifts
            </h2>
            <p className="text-text-secondary text-lg max-w-2xl mx-auto">
              From scheduling to attendance, ShiftFlow handles the logistics so you can focus on running your store.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f) => (
              <div
                key={f.title}
                className="bg-white rounded-xl p-6 border border-gray-100 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300"
              >
                <div className="w-10 h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center mb-4">
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
            <h2 className="text-3xl sm:text-4xl font-bold text-text-primary mb-4">
              Up and running in minutes
            </h2>
            <p className="text-text-secondary text-lg">
              No complex setup. No training required.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((s) => (
              <div key={s.num} className="text-center">
                <div className="text-4xl font-bold text-primary/20 mb-3">{s.num}</div>
                <h3 className="text-lg font-semibold text-text-primary mb-2">{s.title}</h3>
                <p className="text-sm text-text-secondary leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 sm:px-6 bg-primary">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Ready to simplify your scheduling?
          </h2>
          <p className="text-white/70 text-lg mb-8">
            Join retail teams that use ShiftFlow to save hours every week on shift management.
          </p>
          <Link
            href="/login"
            className="inline-block bg-white text-primary font-medium px-8 py-3 rounded-lg hover:bg-gray-50 transition"
          >
            Get Started Free
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 sm:px-6 border-t border-gray-100">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-primary text-white flex items-center justify-center font-bold text-[10px]">
              S
            </div>
            <span className="text-sm font-medium text-text-primary">ShiftFlow</span>
          </div>
          <p className="text-xs text-text-secondary">
            Shift management for retail teams. Built with care.
          </p>
        </div>
      </footer>
    </div>
  );
}
