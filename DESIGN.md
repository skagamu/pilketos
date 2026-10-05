# Design System & UI/UX Guidelines
**Project:** E-Voting OSIS (Kiosk Mode)
**Tech Stack:** React (Vite) + Tailwind CSS
**Theme Mode:** Dark Mode only (for Kiosk consistency)
**Design Read:** "Public-sector/school election utility, trust-first language, leaning toward high-contrast accessible dark mode with constrained, intentional interaction."

## 1. Design Dials
*   **DESIGN_VARIANCE (3/10):** Symmetrical, predictable layout. The focus is on clarity and speed, not artistic chaos. Center-aligned titles, equal grid items for candidates.
*   **MOTION_INTENSITY (2/10):** Static & functional. Minimal motion. Only state-change feedback (button press down, simple modal fade-in). No infinite loops or scroll animations (since it's a single-screen kiosk).
*   **VISUAL_DENSITY (5/10):** Standard application density. Photos must be large enough to recognize faces from a short distance, text large and readable.

## 2. Typography
*   **Font Family:** `Geist` or `Inter` (Sans-serif, highly legible). No serifs.
*   **Display / Header:** `text-4xl md:text-5xl font-black tracking-tight`.
*   **Body:** `text-lg text-slate-300 leading-relaxed`.
*   **Numbers:** `font-mono` (for candidate numbers and live result metrics).

## 3. Color Palette (Dark Theme / KPU Wonogiri Vibe)
*   **Background:** `bg-slate-950`
*   **Surfaces/Cards:** `bg-slate-900 border-slate-800`
*   **Primary Text:** `text-slate-100`
*   **Secondary Text:** `text-slate-400`
*   **Accent (Primary Action):** `bg-red-600 hover:bg-red-500` (Red signals official/election urgency).
*   **Success (Voted):** `bg-emerald-600`

## 4. Layout Mechanics (Kiosk Specifics)
*   **Full Height:** `min-h-[100dvh]` to prevent scrolling if unnecessary.
*   **Hidden Nav:** No navigation bar in the voting flow. The user is trapped in the flow.
*   **Grid:** `grid-cols-1 md:grid-cols-2 lg:grid-cols-3` depending on the number of candidates. Max width constrained to `max-w-7xl mx-auto`.
*   **Responsive:** Programmed mobile-first, but optimized heavily for Desktop Fullscreen (1080p) since it will run on laptops and projectors.

## 5. Interaction Patterns
*   **Active State:** Buttons must have a tactile feel. On click: `active:scale-[0.98] active:translate-y-[1px]`.
*   **Confirmation Modal:** A centered overlay with a backdrop blur `backdrop-blur-sm bg-slate-950/80` to prevent accidental clicks.
*   **Accessibility:** High contrast for candidate names and the "COBLOS" (Vote) button.

## 6. Components Inventory
1.  **Lock Screen Component:** Full screen, logo, "Bilik Suara Terkunci", Operator PIN input. Includes a hidden/faint icon button in the corner to trigger Browser Fullscreen mode.
2.  **Candidate Card Component:** Large Photo (aspect ratio 3:4 or 1:1), Number Badge, Name, Vision/Mission (flexible), massive "Pilih Paslon [N]" CTA button.
3.  **Confirmation Modal:** "Anda yakin memilih Paslon No X?" -> [Batal] / [Yakin & Simpan].
4.  **Success Screen:** "Terima Kasih" message. Auto-locks after exactly 3 seconds.
5.  **Admin Login (`/hasil`):** Centered Auth/PIN card to protect live results from students guessing the URL.
6.  **Admin Dashboard (`/hasil`):** Aesthetic, large-screen optimized layout displaying total votes and live bar/pie charts suitable for a public projector.