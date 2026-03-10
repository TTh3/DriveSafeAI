<div align="center">
  <img src="./src/assets/hero-car.jpg" alt="DriveSafeAI Hero" width="80%" style="border-radius: 12px; margin-bottom: 20px;" />

  <h1>🚗 DriveSafeAI</h1>
  <p><strong>Learn to Drive Safely with AI — A 3D Educational Driving Simulator</strong></p>

  <h3><a href="https://drive-safe-ai-kappa.vercel.app/">🌐 Play the Simulator Live Here!</a></h3>

  <p>
    <a href="#-about-drivesafeai">About</a> •
    <a href="#-features">Features</a> •
    <a href="#-why-it-was-made">Why it was made</a> •
    <a href="#-tech-stack">Tech Stack</a> •
    <a href="#-getting-started">Getting Started</a> •
    <a href="#-open-source-release">Open Source Release</a>
  </p>

  <p>
    <img alt="Version" src="https://img.shields.io/badge/version-0.1.0-blue.svg?cacheSeconds=2592000" />
    <img alt="License: MIT" src="https://img.shields.io/badge/License-MIT-yellow.svg" />
    <img alt="React" src="https://img.shields.io/badge/React-18.3-61DAFB.svg?logo=react" />
    <img alt="Three.js" src="https://img.shields.io/badge/Three.js-WebGL-black.svg?logo=three.js" />
  </p>
</div>

---

## 📖 About DriveSafeAI

**DriveSafeAI** is a student-friendly, highly interactive 3D driving simulator designed to teach road rules, traffic navigation, and autonomous vehicle technology. 

Powered by the **Google Maps Platform** and **Three.js**, it visualizes real-world routes and transforms them into an immersive educational experience. Watch the AI Autopilot navigate complex intersections, roundabouts, and lane merges while providing real-time, context-aware safety tips linked directly to official driver's handbooks from around the world.

## ✨ Features

- 🌍 **Real-World Navigation:** Uses the Google Maps Directions API to fetch accurate, real-world routes and map them to realistic 3D vehicle trajectories.
- 🚦 **AI Autopilot:** Watch an autonomous vehicle make real-time turn-by-turn decisions, handle roundabouts, and learn how to position correctly in traffic.
- 🗺️ **Custom Routes:** Choose any origin and destination across supported countries and let the AI navigate the journey.
- 📚 **Learn Country-Specific Rules:** Switch between **Australia, USA, UK, Japan, and Germany**. The simulator adapts to each country's unique driving side (left-hand vs right-hand traffic) and localized road rules.
- 🎓 **Educational Feedback:** As the car drives, the simulator provides real-time safety tips (e.g., checking blind spots, yielding at roundabouts, zipper merging) synced to the exact maneuver, complete with deep links to official local driver's handbooks (DMV, UK Highway Code, StVO, etc.).
- 📱 **Mobile Ready & Responsive HUD:** A beautiful, glassmorphic UI featuring real-time trip statistics, customizable playback speeds, and route progress.

## 💡 Why it was made

Learning to drive can be intimidating, and reading a static driver's handbook often fails to translate into real-world spatial awareness. 

**DriveSafeAI** was built to bridge this gap. By combining the familiarity of Google Maps with an interactive 3D environment, the project:
1. **Gamifies learning:** Making road safety education engaging and visually intuitive.
2. **Demystifies Autonomous Vehicles:** Showing users how AI interprets routes, plans trajectories, and makes safe decisions.
3. **Provides Contextual Learning:** Instead of memorizing rules in isolation, students see the rule applied *exactly* when the car approaches a relevant scenario (like a complex roundabout or intersection).

## 🚀 Open Source Release Today!

We are thrilled to release **DriveSafeAI** to the open-source community today! 🎉

Whether you are a learner driver seeking visual aids, a driving instructor, or a developer interested in WebGL, React, and Maps integration — this project is for you. We welcome contributions to add more countries, better 3D models, and advanced simulation features! Let's make the roads safer, together.

## 🛠️ Tech Stack

- **Frontend:** React 18, Vite, TailwindCSS, Framer Motion
- **UI & Design:** Radix UI, shadcn/ui styles, Glassmorphism
- **3D Rendering:** Three.js, React Three Fiber (`@react-three/fiber`), Drei (`@react-three/drei`)
- **Mapping & Routing:** Google Maps API (WebGLOverlayView, Directions API, Places API)

## 🏎️ Getting Started

### Prerequisites
- Node.js (v18+)
- A [Google Maps API Key](https://developers.google.com/maps/documentation/javascript/get-api-key) with **Places API** and **Directions API** enabled.

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-username/self-driving-simulator.git
   cd self-driving-simulator
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up Environment Variables:**
   Create a `.env` file in the root directory and add your Google Maps API Key:
   ```env
   VITE_MAPS_API_KEY=your_google_maps_api_key_here
   ```

4. **Run the development server:**
   ```bash
   npm run dev
   ```

5. **Drive!**
   Open `http://localhost:5173` in your browser and start navigating.

---

<div align="center">
  <i>Drive Safe. Learn Smart.</i>
  <br />
  Made with ❤️ by the DriveSafeAI Team.
</div>
