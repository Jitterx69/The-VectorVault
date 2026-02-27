# 🛡️ The VectorVault

> **Next-Gen AI-Powered Security Operations Center (SOC)**
> *Advanced Threat Detection, Vector Analysis, and Automated Incident Response*

![Status](https://img.shields.io/badge/Status-Active-success)
![Version](https://img.shields.io/badge/Version-5.0-blue)
![Tech](https://img.shields.io/badge/Stack-React%20|%20Node%20|%20Python%20|%20SQLite-blueviolet)

---

## 📖 Overview

**The VectorVault** is a cutting-edge Security Operations Center (SOC) dashboard designed to modernize threat detection and response. It combines **Real-time Monitoring**, **Vector-based Machine Learning**, and **Automated Mitigation Workflows** into a single, cohesive interface.

Unlike traditional SOCs, VectorVault leverages **Ephemeral Authentication** and **AI-Driven Analysis** to ensure maximum security and rapid response times.

---

## ✨ Key Features

### 🔐 **Zero-Trust Ephemeral Authentication**
*   **"New Session, New Credentials"**: Security codes are generated on-demand via Python scripts.
*   **Email Delivery**: Credentials are securely emailed to the authorized user.
*   **Auto-Expiration**: Login credentials expire automatically after **2 minutes**, enforcing strict access control.

### 🧠 **Vector Search & Threat Detection**
*   **3D Vector Analysis**: Input complex threat vectors (X, Y, Z coordinates) to classify attacks.
*   **ML-Powered Classification**: Instantly identifies threats like DDoS, SQL Injection, or Malware based on vector signatures.
*   **Visual Feedback**: Interactive visualization of the threat vector space.

### 🚨 **Real-Time Incident Management**
*   **Live Dashboard**: Monitor network health, server load, and active threats in real-time.
*   **"Code Weight" Workflow**: seamless transition from monitoring to deep analysis.
*   **Automated Logging**: One-click logging of predicted threats directly to the active incident registry.

### 🤖 **AI Analysis Engine (Arpita AI)**
*   **Threat Simulation**: Watch real-time simulations of critical threats entering the system.
*   **Auto-Mitigation**: Visual tracking of threats moving from "Critical" to "Resolved" status.
*   **Two-Zone Layout**: Clear separation between Active Threats and Mitigated/Saved incidents.

### 🛠️ **Code-Level Solutions**
*   **Instant Mitigation**: Access ready-to-deploy **C++** and **Assembly** code snippets for specific threats.
*   **Detailed Reporting**: Generate comprehensive incident reports via email with a single click.

---

## 🏗️ Tech Stack

| Component | Technology | Description |
| :--- | :--- | :--- |
| **Frontend** | React + Vite | Fast, responsive UI with TailwindCSS & Shadcn/ui |
| **Backend** | Node.js + Express | Robust API handling and process orchestration |
| **Database** | SQLite | Lightweight, local database for incidents & predictions |
| **AI/ML** | Python | Scripts for vector analysis, auth generation, and reporting |
| **Vector DB** | TiDB (Optional) | Cloud-native vector storage for scalable deployments |

---

## 🚀 Quick Start Guide

### Prerequisites
*   **Node.js** (v18+)
*   **Python** (v3.8+)
*   **npm** or **yarn**

### 1. Clone & Install
```bash
git clone https://github.com/your-org/The-VectorVault.git
cd The-VectorVault
npm install
```

### 2. Configure Environment
Create a `.env` file in the root directory:
```env
# Server Configuration
PORT=3001
NODE_ENV=development

# Database
SQLITE_DB_PATH=/path/to/your/desktop/attack_classifier.db

# Email Configuration (for Auth & Reports)
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
```

### 3. Run the Application
Start both the Backend Server and Frontend Client with a single command:
```bash
npm run dev:full
```
*   **Frontend**: `http://localhost:8080`
*   **Backend**: `http://localhost:3001`

---

## 🕹️ User Workflows

### 1️⃣ Authentication Flow
1.  Go to the **Login Page**.
2.  Click **"Generate Credentials"**.
3.  Check your **Email** for the username and password.
4.  Login within **2 minutes** before they expire.

### 2️⃣ Threat Detection Flow
1.  On the **Dashboard**, click the **"Code Weight"** button.
2.  System automatically sends a security code email and redirects you to **Vector Search**.
3.  Enter vector coordinates (e.g., `1, 0, 0` for DDoS) and click **"Analyze"**.
4.  Review the prediction and click **"Log Incident"** to save it.

### 3️⃣ Incident Resolution Flow
1.  Navigate to the **Incidents Page**.
2.  Find the new incident and click **"Solve"**.
3.  Review the **C++ / Assembly** mitigation code.
4.  Click **"Accept & Resolve"** to clear the threat.

---

## 📂 Project Structure

```
The-VectorVault/
├── src/
│   ├── pages/          # React Pages (Dashboard, Incidents, VectorSearch, etc.)
│   ├── components/     # Reusable UI Components
│   ├── hooks/          # Custom React Hooks
│   └── App.tsx         # Main Routing Logic
├── server.cjs          # Express Backend Server
├── auth_manager.py     # Python Script for Credential Generation
├── incident_reporter.py # Python Script for Email Reports
├── threat_solutions.py # Python Database of Threat Solutions
├── package.json        # Dependencies & Scripts
└── README.md           # You are here!
```

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1.  Fork the Project
2.  Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3.  Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4.  Push to the Branch (`git push origin feature/AmazingFeature`)
5.  Open a Pull Request

---

<div align="center">
  <b>Built with ❤️ by the Syntax Slayers Team</b>
</div>
