# 🎙️ DhwaniAI — Real-Time Voice Impersonation Detection & Prevention

DhwaniAI is a web dashboard that shows how a layered defense system can detect AI-cloned and impersonated voices during a phone call and stop fraud before money or data is lost. It was built for **Smart India Hackathon 2026** (problem statement **SIH26104**).

The core idea is a four-signal pipeline:

> **Voice + Identity + Intent + Context → Risk Score → Prevention**

---

## ✨ Features

- **Dashboard** – overview of calls analysed, high-risk calls, weekly stream volume, classification profiles and recent threats (charts built with Recharts).
- **Live Signal Analysis (Analyze Voice)** – pick a call scenario and watch the risk score build up over time across four modules:
  - AI Voice Detection (synthetic / deepfake probability)
  - Speaker Verification (match against a trusted voiceprint)
  - Speech-to-Text transcript
  - Intent & Context analysis (urgency, financial requests, secrecy cues)
- **Threat Analysis** – explains each attack vector (AI voice cloning, acoustic biometric verification, conversational intent/NLP analysis), how it works and how DhwaniAI counters it.
- **Incident Registry** – saved log of analysed calls with diagnostics, resolution status and notes; incidents can be viewed and deleted.
- **Out-of-band identity verification** – a simulated secondary verification flow (trusted contact handshake, SMS dispatch, device check) that returns a verification token.
- **Risk-based action** – every call ends in a recommendation such as *Allow*, *Secondary Verification Required* or block.

### Demo scenarios

| Scenario | What it shows |
|---|---|
| Genuine Call | A verified family contact – low risk, allowed |
| AI-Cloned CEO | Deepfake voice demanding an urgent wire transfer – critical risk |
| Human Impersonator | A real person pretending to be someone else – caught via speaker mismatch and intent |

> **Note:** All risk scores, biometric values and synthetic-voice flags in this project are **simulated sample data** used to demonstrate the pipeline. No real call audio is analysed yet.

---

## 🛠️ Tech Stack

- **Frontend:** React 19, Vite, Tailwind CSS 4, Recharts, Lucide React, Motion
- **Backend:** Node.js, Express
- **Storage:** JSON file (`db.json`), created automatically on first run
- **Language:** JavaScript

---

## 📁 Project Structure

```
dhwani-ai/
├── server.js               # Express API + Vite dev server
├── index.html
├── src/
│   ├── App.jsx             # Tab navigation and incident state
│   ├── data.js             # Scenarios, sample incidents, threat vectors
│   └── components/
│       ├── Dashboard.jsx
│       ├── AnalyzeVoice.jsx
│       ├── ThreatAnalysis.jsx
│       └── IncidentHistory.jsx
└── .env.example
```

---

## 🚀 Getting Started

**Prerequisites:** Node.js 18 or newer.

```bash
# 1. Clone the repository
git clone https://github.com/GayatriN-16/DHWANI-AI.git
cd DHWANI-AI

# 2. Install dependencies
npm install

# 3. (Optional) create your env file
cp .env.example .env

# 4. Start the app
npm run dev
```

Open **http://localhost:3000** in your browser.

### Production build

```bash
npm run build
npm start
```

---

## 🔌 API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/incidents` | List all saved incidents |
| POST | `/api/incidents` | Save a new incident |
| DELETE | `/api/incidents/:id` | Delete an incident |
| POST | `/api/verify-identity` | Simulated out-of-band identity verification |
| GET | `/api/health` | Health check |

---

## 🗺️ Roadmap

- Analyse real microphone / call audio instead of sample scenarios
- Train and plug in a real deepfake-voice classifier and speaker-verification model
- Connect the Gemini API for live transcript and intent analysis
- Real SMS / push-based second-factor verification

---

## 👩‍💻 Author

**Gayatri Nikam** – Final-year B.E. Computer Engineering student, aspiring Data Scientist
GitHub: [@GayatriN-16](https://github.com/GayatriN-16)
