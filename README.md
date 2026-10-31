# ⚡ VEXXBIT // Autonomous AI Agent Labs & Systems

> **Live Showcase:** [https://vexxbit.tech](https://vexxbit.tech)  
> **Builder:** Samuel Kangethe ([@vexxbit](https://dev.to/vexxbit) on DEV / [Vexx-bit](https://github.com/Vexx-bit) on GitHub)  
> **Event:** Hacktoberfest 2026 (Major League Hacking & DEV) — *"AI belongs to everyone"*  
> **Challenge Track:** Best .Tech Domain Name (`vexxbit.tech`)

---

## 🌟 Overview

**Vexxbit Labs** is an interactive, high-performance 3D engineering showcase and autonomous agent research hub built by Samuel Kangethe. It demonstrates production-grade agentic architectures, neuro-symbolic safety guardrails, multimodal edge intelligence, and zero-friction student tooling.

### 🚀 Key Highlights & Showcase Features

* **Interactive 3D Quantum Core**: Powered by Three.js WebGL with PBR physical materials, reactive gyro rings, orbiting satellite nodes, dynamic point lights, and mouse parallax.
* **GSAP ScrollTrigger Choreography**: As you scroll through the laboratory dossier, the 3D core smoothly rotates, scales, and docks into side telemetry viewports in real time.
* **Web Audio API Sound Engine**: Zero-asset procedural sci-fi audio synthesizer for tactile soundscapes, UI blips, and resonant core shockwaves.
* **Featured Production System — Study Agent on WhatsApp**:
  * Chat-operated autonomous agent allowing university students to access lecture slides, past exams, and AI-generated practice quizzes inside WhatsApp.
  * Architecture: Google Agent Development Kit (ADK) + Gemini Multimodal API + Cloud Run + Twilio WhatsApp API.
  * Live dashboard: [agentic-workshop-ten.vercel.app](https://agentic-workshop-ten.vercel.app/)
* **Interactive Lab CLI**: Fully responsive terminal emulator accepting real-time commands (`projects`, `study-agent`, `pulse`, `hacktoberfest`, `contact`, `whoami`).
* **Cloudflare Pages Edge Deployment**: Hosted directly on Cloudflare’s worldwide edge network mapped to the custom domain `vexxbit.tech`.

---

## 🛠️ Technology Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend Framework** | React 19, Vite, TypeScript |
| **3D & Graphics** | Three.js (WebGL), PBR Shaders, Volumetric Particle Systems |
| **Animation & Scroll** | GSAP 3 (GreenSock), ScrollTrigger |
| **Audio Synthesis** | Web Audio API (Hardware-accelerated procedural synthesis) |
| **Styling & HUD** | Tailwind CSS v4, Lucide Icons, Glassmorphism, Custom Grid Overlays |
| **Typography** | *Syne* (800/900 Display), *Space Grotesk*, *JetBrains Mono* |
| **Hosting & DNS** | Cloudflare Pages, Cloudflare DNS, Titan Email |

---

## 💻 Local Development

Clone the repository and install dependencies:

```bash
git clone https://github.com/Vexx-bit/vexxbit-tech.git
cd vexxbit-tech

# Install dependencies
npm install

# Start development server
npm run dev
```

Build for production:

```bash
npm run build
```

---

## ☁️ Deployment on Cloudflare Pages (Custom Domain: `vexxbit.tech`)

1. Push this repository to GitHub.
2. In the [Cloudflare Dashboard](https://dash.cloudflare.com/):
   * Go to **Workers & Pages** → **Create application** → **Pages** → **Connect to Git**.
   * Select your repository (`vexxbit-tech`).
   * Framework preset: `Vite` (Build command: `npm run build`, Output directory: `dist`).
3. Click **Deploy**.
4. Once deployed, open **Custom domains** → **Set up a custom domain** → enter `vexxbit.tech`. Cloudflare will automatically handle the DNS routing and generate SSL certificates instantly!

---

## 📬 Contact & Links

* **Titan Email:** [samuel@vexxbit.tech](mailto:samuel@vexxbit.tech)
* **DEV.to:** [@vexxbit](https://dev.to/vexxbit)
* **GitHub:** [@Vexx-bit](https://github.com/Vexx-bit)
* **Hacktoberfest:** Verified MLH Participant `018c1df7-3267-6ba4-90e3-ccc64cd68b8a`
