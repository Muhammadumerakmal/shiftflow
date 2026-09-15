---
name: ui-design-reference
description: Reference sheet of UI patterns, colors, and themes from analyzed screenshots. Use when building or styling UI components — especially an AI chatbot/chat widget (Intercom/Crisp/Drift-style) or a goal/progress tracker card with basic vs premium tiers. Provides exact hex colors, layout structure, and theming direction.
---

# UI Design Reference

A reference sheet of UI patterns, colors, and themes extracted from analyzed
screenshots. Use this to guide styling decisions when building similar
components.

## When to use this skill

Reach for this reference whenever you are:

- Building an embedded **AI chatbot / chat widget** (bubbles, quick-reply chips,
  pill input bar, holographic avatar).
- Building a **stat / progress / goal-tracker card**, particularly one with a
  **basic vs. premium** two-tier design.
- Choosing colors, spacing, corner radii, or gradients that should match the
  "calm AI" pastel aesthetic or the "premium glassy" gradient aesthetic
  described below.

Copy the exact hex values and layout notes rather than inventing new ones, so
components stay consistent across the app.

---

## 1. AI Chatbot Widget

**UI Name:** Chat widget (AI chatbot widget) — same family as Intercom, Crisp,
Drift-style embedded assistants.

### Layout Structure

- Full-screen modal/overlay on mobile (slides up from bottom).
- Header bar: logo (left) + refresh icon + close icon (right).
- Centered intro section: circular gradient/holographic avatar, bot name,
  one-line greeting.
- "Today" timestamp divider before chat log.
- Chat bubbles: bot messages left-aligned (light gray), user messages
  right-aligned (blue/tinted pill).
- Suggested quick-reply chips (pill-shaped, tappable) stacked above input.
- Bottom input bar: rounded pill text field + mic icon + circular send button
  (up arrow).
- "Powered by [Company]" footer credit.

### Colors

| Element            | Color                                                |
| ------------------ | ---------------------------------------------------- |
| Background         | White / very light gray (`#F8F9FA`)                  |
| Accent / primary   | Soft blue (`#5B8DEF`)                                |
| User bubbles       | Soft blue (accent)                                   |
| Bot bubbles        | Light gray (`#F1F2F6`)                               |
| Text (primary)     | Dark navy/charcoal (`#1A1A2E`)                       |
| Text (secondary)   | Gray                                                 |
| Avatar             | Iridescent holographic gradient (blue/purple/pink)   |
| Header icons       | Muted gray-blue                                      |

### Theme

Soft, rounded, light/minimal — pastel-leaning "calm AI" aesthetic. High
whitespace, low contrast, gentle gradients. Rounded corners on all elements
(bubbles, input, avatar, buttons).

### Build Notes

- **Web:** flexbox column layout, bubble components, fixed input bar.
- **React:** `ChatBubble`, `QuickReplyChip`, `ChatInput` components + Tailwind
  for rounded/pill styling.
- **Avatar:** animated CSS gradient or small Lottie/GIF for the holographic
  sphere.

---

## 2. Goal Tracker Card (Basic vs Premium)

**UI Name:** Progress/stat card component, two-tier (basic vs premium) variant.

### Basic Card

| Element                 | Color                                          |
| ----------------------- | ---------------------------------------------- |
| Background              | White                                          |
| Progress ring (filled)  | Blue (`#1E88E5`)                               |
| Progress ring (unfilled)| Light gray                                     |
| Text                    | Dark navy/black, gray for labels               |
| Button                  | Solid blue gradient (`#1565C0` → `#1E88E5`)    |
| Icon                    | Gray outline                                   |

**Theme:** Clean, flat, minimal — light and neutral.

### Premium Card

| Element            | Color                                                        |
| ------------------ | ----------------------------------------------------------- |
| Header background  | Purple-to-blue gradient, 115°: `#A34DFF` → `#637AF8` (48%) → `#4CC7EF` (100%) |
| Body background    | White, rounded top corners (30px)                           |
| Progress ring      | Purple/violet gradient stroke                               |
| Stat icon badges   | Colored circles — purple (Target), teal (Completed), pink (Remaining) |
| Button             | Purple-to-pink gradient, 100°: `#347FF2` → `#9B4DFF` → `#E34CFF` |

**Theme:** Vibrant, gradient-heavy, "premium/glassy" feel. Subtle content
fade-in animation on load (`contentIn 0.6s ease 0.95s forwards`).

### Design Pattern

Same layout and data between tiers — the premium version swaps flat colors for
gradients and adds icon badges. Common technique for signaling a "pro" tier
visually without changing structure.
