# 🚑 Resq-Forces

> Life saving force

## 🌟 Overview

In any life-threatening emergency—be it a cardiac arrest, a building fire, or a severe road accident—the first 10 minutes are the most critical. While professional emergency services (995) average an 8–12 minute arrival time, the "Gap" between the incident and their arrival is where lives are often lost.

Our Solution:
Resq-Forces bridges this "995 Gap" by activating an untapped network of certified community lifesavers—off-duty medics, trained fire wardens, and CPR-certified civilians—who are already at or near the scene. By using real-time geofencing and AI-driven dispatch, we turn nearby bystanders into immediate professional intervenors, providing life-saving assistance minutes before the ambulance or fire engine arrives.

---

## ✨ Key Features

- **📍 Proximity-Based Activation:** Uses real-time geofencing to alert certified responders within the immediate "on-site" radius of an incident.
- **🎓 Intelligent Skill-Matching:** Automatically matches incident types (e.g., Cardiac Arrest) with responders holding specific certifications (e.g., CPR/AED).
- **📡 Live Resource Tracking:** Provides dispatchers with a real-time bird’s-eye view of responder movement and arrival status.

---

## 🛠️ Tech Stack

- **Framework:** [Next.js] for a seamless, fast frontend and backend integration.
- **Styling:** [Tailwind CSS] for a responsive, mobile-first emergency dashboard.
- **Backend & Database:** [Supabase] for real-time PostgreSQL database updates and secure authentication.
- **AI Engine:** [Gemini API] for intelligent incident categorization and responder matching logic.

---

## ⚙️ Installation & Setup

Follow these steps to get your local environment running.

### 1. Clone the Repository

```bash
git clone "https://github.com/ongkitwei/DLW-ResqForces.git"
cd DLW-ResqForces

npm install
# or
yarn install

## Create a .env.local file in the root directory. Copy and paste the following, replacing the placeholders with your actual credentials:

# Supabase (Found in Project Settings > API)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Google Gemini AI
GEMINI_API_KEY=your_gemini_api_key

# Google Map API
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_google_map_api
npm run dev
```
