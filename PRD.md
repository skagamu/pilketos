# Product Requirements Document (PRD)
**Project Name:** OSIS E-Voting Kiosk System
**Document Version:** 1.1 (Finalized Requirements)
**Target Platform:** Web (Optimized for Desktop/Laptop Fullscreen Kiosk Mode)

---

## 1. Executive Summary
The OSIS E-Voting System is a lightweight, kiosk-based web application designed to facilitate in-person student council elections. To maximize voting speed and minimize friction, the system removes digital voter authentication (like NISN or tokens). Instead, it relies on a physical Operator-controlled "Lock/Unlock" flow to ensure the one-person-one-vote principle. The system is backed by a real-time database to provide instant election results to administrators and for public display on a projector.

## 2. Goals & Objectives
*   **Speed & Simplicity:** Enable voters to cast their vote in under 10 seconds.
*   **Tamper Prevention:** Prevent double-voting via an Operator-controlled booth lock mechanism and browser constraints (fullscreen enforcement, disabled context menus).
*   **Real-time Monitoring & Presentation:** Provide an instant, live-updating dashboard for the election committee to monitor results privately, which is also aesthetic enough to be shown on a large projector for public announcements.
*   **Zero-Maintenance Deployment:** Utilize a serverless/BaaS architecture (GitHub Pages + Supabase) to keep hosting costs and maintenance at zero.

## 3. Tech Stack
*   **Frontend Framework:** React (Vite)
*   **Styling:** Tailwind CSS (Dark theme, rapid UI development)
*   **Routing:** React Router (HashRouter for GitHub Pages compatibility)
*   **Backend & Database:** Supabase (PostgreSQL)
*   **Deployment:** GitHub Pages

## 4. User Roles
*   **Voter:** An anonymous student using the unlocked kiosk to cast exactly one vote.
*   **Operator:** The committee member managing the physical laptop. They possess a static, hardcoded PIN to unlock the kiosk for the next voter and manage the fullscreen state.
*   **Admin/Committee:** The election head who accesses the secure `/hasil` route, protected by a Master PIN/Auth, to view live election results on their devices or a projector.

## 5. User Flows

### A. The Voting Flow (Kiosk Mode)
1.  **Idle State (Locked):** The laptop screen displays a locked "Waiting for Operator" screen.
2.  **Kiosk Enforcement (Operator Action):** The operator clicks a hidden UI button (e.g., a faint lock icon in the corner) to trigger the browser's Fullscreen API.
3.  **Unlock:** The Operator enters a static 4-digit PIN (e.g., `1234` configured via env vars) and clicks "Unlock".
4.  **Voting State:** The screen transitions to display the OSIS candidates.
5.  **Selection:** The Voter clicks on their chosen candidate.
6.  **Confirmation:** A modal pops up: "Are you sure you want to vote for Candidate [Name]?" (Yes/No).
7.  **Submission & Reset:** 
    *   If Yes: The system records the anonymous vote in Supabase.
    *   A simple "Thank You" screen appears for exactly 3 seconds.
    *   The system automatically returns to the **Idle State (Locked)**, ready for the Operator to reset it for the next student.

### B. The Admin Dashboard Flow (`/hasil`)
1.  **Access:** Admin navigates to `https://[domain].github.io/[repo]/#/hasil`.
2.  **Authentication Guard:** Admin is prompted to enter a Master PIN or Supabase Auth credentials. This prevents unauthorized students from viewing the live results on their personal devices even if they know the URL.
3.  **Dashboard:** Upon successful login, the Admin sees a highly aesthetic, large-screen optimized dashboard displaying:
    *   Total votes cast.
    *   Live updating bar/pie charts of the current vote distribution (powered by Supabase Realtime).

---

## 6. Functional Requirements

### 6.1. Voting Interface (Public Route: `/`)
*   **Static Kiosk Lock:** A mandatory lock screen requiring a hardcoded static PIN to bypass.
*   **Fullscreen Enforcement:** A hidden button to trigger `document.documentElement.requestFullscreen()`.
*   **Tamper Resistance:** Disable right-click context menus (`onContextMenu={e => e.preventDefault()}`) to prevent accidental/intentional element inspection.
*   **Candidate Display:** Fetch and display candidate data from Supabase. Ensure UI is optimized for full-screen laptop display (large tap/click targets). Note: Specific candidate data fields (Vision/Mission, etc.) will be finalized later, so the UI and schema must be flexible.
*   **Vote Submission:** A function that inserts a single record into the Supabase database.
*   **Auto-Reset:** Strict timeout cleanup. Once a vote is cast (showing the 3s Thank You screen), it must automatically revert to the locked state.

### 6.2. Admin Dashboard (Protected Route: `/hasil`)
*   **Auth Guard:** Must verify a Master PIN or active session before rendering the dashboard.
*   **Live Results:** Implement Supabase Realtime subscriptions (`on('postgres_changes')`).
*   **Projector-Ready UI:** Typography and charts must scale well for large resolutions (e.g., 1080p projectors). Use high contrast and clear data visualization.

---

## 7. Database Schema Draft (Supabase / PostgreSQL)

### Table 1: `candidates`
*   `id` (uuid, primary key)
*   `candidate_number` (int)
*   `name` (text)
*   `vision` (text) - *Flexible/Pending*
*   `mission` (text) - *Flexible/Pending*
*   `photo_url` (text)
*   `created_at` (timestamptz)

### Table 2: `votes`
*   `id` (uuid, primary key)
*   `candidate_id` (uuid, foreign key references `candidates.id`)
*   `created_at` (timestamptz)
*   *(No `user_id` is recorded to maintain complete anonymity).*

### Security & Row Level Security (RLS) Policies
*   **`candidates` table:** `SELECT` allowed for all.
*   **`votes` table:** `INSERT` allowed for all. `SELECT` allowed ONLY for authenticated Admins (to protect the `/hasil` route data).
