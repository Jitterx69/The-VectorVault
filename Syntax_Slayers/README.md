# Team Syntax Slayers - VectorVault

## 🎯 Project: ML-Powered Attack Prediction System

AI-driven cybersecurity attack classifier using TensorFlow and SQLite database integration.

## 🚀 Features

- ✅ **3-Input ML Classifier** - Real-time attack prediction from numerical inputs
- ✅ **TensorFlow Neural Network** - Deep learning model trained on attack patterns
- ✅ **SQLite Database** - Attack details and mitigation strategies
- ✅ **Beautiful UI** - React-based interface with real-time updates
- ✅ **Confidence Scoring** - Probabilistic predictions with accuracy metrics

## 🛠️ Tech Stack

- **Frontend:** React + TypeScript + Vite
- **Backend:** Node.js + Express
- **ML Model:** Python + TensorFlow 2.20.0
- **Database:** SQLite
- **Styling:** TailwindCSS + shadcn/ui

## 📋 Setup Instructions

```bash
# Install dependencies
npm install
pip3 install numpy tensorflow

# Configure database
echo "SQLITE_DB_PATH=/path/to/your/attack_classifier.db" > .env

# Start backend server
npm run server

# Start frontend (in another terminal)
npm run dev
```

## 🎮 Usage

1. Open http://localhost:8080/search
2. Enter 3 numerical values (0 or 1):
   - Input 1: High Traffic indicator
   - Input 2: Database Error indicator  
   - Input 3: Email/Phishing Link indicator
3. Click "Predict Attack"
4. View real-time ML prediction with database details!

## 📊 Attack Types

- **DDoS** - Distributed Denial of Service
- **SQL Injection** - Database exploitation
- **Phishing** - Social engineering attacks
- **Normal** - System baseline behavior

## 👥 Team Syntax Slayers

Built with ❤️ for Nirman 5.0

## 📄 Documentation

- [Integration Guide](VectorVault/INTEGRATION_SUCCESS.md)
- [ML Setup Guide](VectorVault/ML_INTEGRATION_GUIDE.md)
- [API Documentation](VectorVault/README.md)
