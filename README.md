# 🧠 SmritiAI

> **Remembering Life when Memory Fails**  

SmritiAI is an AI-powered personal memory assistant designed to **capture, organize, and recall life events**. It helps users store memories, health records, financial details, and more, providing an intelligent, accessible, and secure platform for personal life management.

[![Status](https://img.shields.io/badge/status-production%20ready-green)]()
[![Tech Stack](https://img.shields.io/badge/tech-React%2CNode%2CSupabase-blue)]()
[![License](https://img.shields.io/badge/license-MIT-green)]()

---

## 🎯 Goals & Objectives

- Enable users to **capture life events and important memories** effortlessly.  
- Provide **voice-first and literacy-free input** for accessibility.  
- Organize information across **health, finances, personal records, and relationships**.  
- Offer **timeline-based visualization** and AI-powered recall for easy memory retrieval.  
- Ensure **privacy, security, and user ownership** of all data.  

---

## ✨ Core Features

### Memory & Life Management
- **DocumentVault** – Secure storage for important documents.  
- **Memories** – Capture personal moments, stories, and multimedia content.  
- **Timeline** – Visual chronological display of life events.  
- **Health** – Track health records, appointments, and medical history.  
- **Records** – Manage official and personal records.  
- **Money Vault** – Store financial information securely.  
- **People** – Manage connections, family, and friends.  
- **Legacy** – Plan digital legacy and important instructions.  
- **SOS** – Emergency alerts with location sharing.  
- **Photo Globe** – Map-based visualization of memories and events.  

---

## 🏗️ Technical Architecture

- **Frontend:** React.js, PWA support, TailwindCSS, interactive dashboards  
- **Backend / Database:** Supabase, PostgreSQL, serverless functions  
- **AI / ML:** NLP for conversational recall, predictive insights, memory suggestions  
- **Security:** JWT, OAuth, encryption, secure user-owned memory  
- **Hosting & Infrastructure:** Vite, AWS/GCP/Firebase, CI/CD pipelines, auto-scaling  
- **Voice-first Input:** Voice commands, speech recognition, text-to-speech  

---

## 📂 Directory Structure

```bash
SmritiAI/
├── smmm/
│   ├── build/
│   │   ├── index.html
│   │   └── assets/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── figma/
│   │   │   ├── services/
│   │   │   ├── ui/
│   │   │   ├── AIInsights.tsx
│   │   │   ├── AnimatedBackground.tsx
│   │   │   ├── Avatar3D.tsx
│   │   │   ├── Dashboard.tsx
│   │   │   ├── Finance.tsx
│   │   │   ├── Header.tsx
│   │   │   ├── Navbar.tsx
│   │   │   ├── Sidebar.tsx
│   │   │   └── VoiceInterface.tsx
│   │   ├── pages/
│   │   │   ├── Home.tsx
│   │   │   ├── Dashboard.tsx
│   │   │   ├── Finance.tsx
│   │   │   ├── Healthcare.tsx
│   │   │   └── VoiceDemo.tsx
│   │   ├── utils/
│   │   │   ├── supabase/
│   │   │   ├── voiceService.ts
│   │   │   ├── voiceCommands.ts
│   │   │   └── memoryAnalyzer.ts
│   │   ├── styles/
│   │   │   └── globals.css
│   │   ├── supabase/
│   │   │   └── functions/
│   │   ├── guidelines/
│   │   ├── services/
│   │   ├── App.tsx
│   │   ├── main.tsx
│   │   ├── index.css
│   │   ├── routes.ts
│   │   └── ... (config & docs)
│   ├── package.json
│   ├── vite.config.ts
│   └── index.html
├── .git/
└── README.md
