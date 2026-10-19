# MESA Glasgow – Website Pitch & Production Build

A hand-crafted, editorial marketing website and table reservation platform for **MESA Glasgow**—an independent brunch café and specialty coffee spot located at **567 Duke Street, Dennistoun, Glasgow G31 1PY**.

Designed and engineered to agency pitch standards, featuring real Glasgow East End photography, typography, live opening-hours logic, and a multi-step booking system.

---

## 🚀 Quick Start (Local Setup)

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start the local Vite development server:**
   ```bash
   npm run dev
   ```
   The application will be running locally at `http://localhost:3000`.

3. **Compile and build for production:**
   ```bash
   npm run build
   ```

---

## 🎨 Asset Management & Photography

All brand and food photos are stored locally in the `/public/images/` directory so they are bundled with the project and load instantly without external CDN dependencies.

### Replacing the Brand Logo
- Place your updated logo at `/public/images/mesa-logo.png`.
- The logo is referenced in the navbar, footer, preloader, trust badges, and meta tags.
- Display rules: Always maintained as a crisp circle with soft elevation (`0 6px 20px rgba(47,62,44,0.18)`).

### Replacing or Adding Food Photos
- All 12 signature photos are located in `/public/images/`:
  - `founders.jpg`
  - `tomato-toast.jpg`
  - `booth-reel.jpg`
  - `slaw-sandwich.jpg`
  - `ham-sandwich.jpg`
  - `pancakes.jpg`
  - `eggs-crumb.jpg`
  - `street-sandwich.jpg`
  - `morning-roll.jpg`
  - `peaches.jpg`
  - `full-breakfast.jpg`
  - `baked-eggs.jpg`
- To update captions, alt text, or mappings, edit `/src/data/images.ts`.

---

## 🍽️ Editing Business Details, Menu & Opening Hours

All business content is cleanly decoupled in the `/src/data/` folder:

- **Menu Items & Pricing**: `/src/data/menu.ts`
  - Easily update dish names, descriptions, prices, dietary tags (`V`, `VG`, `GF`), and categories (`breakfast`, `brunch`, `sandwiches`, `sweet`, `drinks`).
- **Weekly Schedule & Business Info**: `/src/data/business.ts`
  - Update daily opening hours, telephone numbers, Google Maps links, and social URLs.
- **Google Reviews**: `/src/data/reviews.ts`
  - Update verified customer quotes and ratings.

---

## ✉️ Formspree Integration for Table Bookings

The reservation system supports real email dispatch via Formspree:

1. Create a free form endpoint at [Formspree](https://formspree.io).
2. Copy your Formspree Form ID (e.g., `xpznkwer`).
3. Add the environment variable in your `.env.local` or host dashboard:
   ```env
   VITE_FORMSPREE_ID="your_form_id_here"
   ```
4. If this variable is omitted, the booking flow gracefully confirms the booking on screen, downloads an `.ics` calendar invitation file, and offers one-click email/WhatsApp pre-filled messages.

---

## 🌐 Deploying to Vercel

1. Push your repository to GitHub.
2. Log into [Vercel](https://vercel.com) and click **"Add New Project"** → **Import Git Repository**.
3. Vercel auto-detects the framework preset as **Vite**.
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
4. Add your optional `VITE_FORMSPREE_ID` under **Environment Variables**.
5. Click **Deploy**.

*Note: The included `vercel.json` file ensures that all React Router routes (`/`, `/menu`, `/book`) work flawlessly on direct navigation and refreshes.*

---

## 🌿 Technical Stack & Architecture

- **React 18 + TypeScript + Vite**: Ultra-fast build and reactive state
- **Tailwind CSS v4**: Handcrafted sage, oat, cream, and peach design tokens
- **Lenis Smooth Scroll**: Silky natural scrolling with `prefers-reduced-motion` compliance
- **Framer Motion**: Word-by-word reveals, horizontal scroll timelines, and spring micro-interactions
- **Zod + React Hook Form**: Type-safe validation for reservation requests
- **date-fns + date-fns-tz**: Accurate `Europe/London` real-time opening hours and slot generation
- **SEO & Schema.org**: JSON-LD structured data for Google Maps & local restaurant search
