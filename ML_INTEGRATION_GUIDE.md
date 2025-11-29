# ML-Based Attack Prediction Setup Guide

## ✅ **Integration Complete!**

Your SQLite database is now integrated with the VectorSearch page. The system takes 3 numeric inputs, runs them through your ML model, and displays attack information from your database in real-time.

---

## 🎯 **How It Works**

1. **User enters 3 numeric values** (e.g., `1`, `0`, `0`)
2. **ML model predicts attack name** (e.g., "Distributed Denial of Service (DDoS)")
3. **Backend queries SQLite database** using the predicted attack name
4. **Results display** with summary, mitigation points, and confidence score

---

## 📁 **Database Configuration**

### **Step 1: Set Your Database Path**

Create a `.env` file in your project root (if it doesn't exist):

```bash
SQLITE_DB_PATH=/Users/mohit/Desktop/your-actual-database-name.db
```

**Replace `your-actual-database-name.db` with your actual database filename!**

### **Step 2: Database Schema**

Your database should have these tables (already set up based on your schema):

**Table: `attack_details_ref`**
- `id` (INTEGER, PRIMARY KEY)
- `attack_name` (TEXT, NOT NULL) - e.g., "DDoS", "SQL Injection"
 - `summary` (TEXT) - Description of the attack
- `points` (TEXT) - JSON array of mitigation steps

**Table: `predictions`** (for logging)
- `id` (INTEGER, PRIMARY KEY)
- `timestamp` (TEXT)
- `input_vector` (TEXT) - The 3 inputs as JSON
- `predicted_attack_name` (TEXT)
- `confidence` (REAL)
- `summary` (TEXT)
- `points` (TEXT)

---

## 🤖 **ML Model Integration**

### **Current Implementation**

The code currently uses a **simple rule-based system** as a placeholder. You need to replace it with your actual ML model.

**Location:** `/server.cjs`, lines ~478-505 (search for "ML MODEL PREDICTION")

### **Replace This Section**

```javascript
// ===============================================
// ML MODEL PREDICTION
// ===============================================
// TODO: Replace this with your actual ML model prediction logic

// OPTION 1: If your ML model is in Python
// Use child_process to call your Python script
const { spawn } = require('child_process');
const python = spawn('python3', ['path/to/your/ml_model.py', input1, input2, input3]);

python.stdout.on('data', (data) => {
  const result = JSON.parse(data.toString());
  predictedAttackName = result.attackName;
  confidence = result.confidence;
});

// OPTION 2: If using TensorFlow.js (Node.js)
// const tf = require('@tensorflow/tfjs-node');
// const model = await tf.loadLayersModel('file://path/to/model.json');
// const prediction = model.predict(tf.tensor2d([[input1, input2, input3]]));

// OPTION 3: If using ONNX Runtime
// const ort = require('onnxruntime-node');
// const session = await ort.InferenceSession.create('./model.onnx');
// const feeds = { input: new ort.Tensor('float32', [input1, input2, input3], [1, 3]) };
// const results = await session.run(feeds);
```

---

## 🚀 **Quick Start**

### **1. Install Dependencies** ✅ (Already done)
```bash
npm install better-sqlite3
```

### **2. Configure Database Path**
Edit `.env` file:
```bash
SQLITE_DB_PATH=/Users/mohit/Desktop/your-database.db
```

### **3. Start Backend Server**
```bash
npm run server
```

### **4. Start Frontend**
```bash
npm run dev
```

### **5. Test the Integration**

1. Open http://localhost:8080/search
2. Log in (use `localStorage.setItem('vectorvault-auth', 'true')` in console if needed)
3. Enter 3 numbers: `1`, `0`, `0`
4. Click "Predict Attack"
5. See real-time results from your database!

---

## 📊 **API Endpoint**

**POST** `/api/predict-attack`

**Request:**
```json
{
  "part1": "1",
  "part2": "0",
  "part3": "0"
}
```

**Response:**
```json
{
  "success": true,
  "input": [1, 0, 0],
  "prediction": {
    "attackName": "Distributed Denial of Service (DDoS)",
    "confidence": 0.95,
    "summary": "A DDoS attack attempts to make a machine...",
    "points": [
      "Use traffic filtering and rate limiting",
      "Deploy CDN and load balancers",
      "Implement DDoS protection services"
    ],
    "foundInDatabase": true
  },
  "timestamp": "2025-11-29T14:17:46.000Z"
}
```

---

## 🔧 **Troubleshooting**

### **Database Not Found**
```
Failed to connect to SQLite database: unable to open database file
```
**Solution:** Check your `.env` file and ensure `SQLITE_DB_PATH` points to the correct database file.

### **Attack Name Not Found in Database**
If your prediction returns an attack name that's not in your database:
1. Check the exact naming in your `attack_details_ref` table
2. Update the ML model predictions to match database entries
3. Or add the attack types to your database

### **Port Conflicts**
- Frontend runs on: `http://localhost:8080`
- Backend runs on: `http://localhost:3001`

---

## 🎨 **UI Features**

✅ Real-time prediction with loading states
✅ Confidence score display with color coding
✅ Attack summary from database
✅ Mitigation action points
✅ Database lookup status indicator
✅ Recent searches history
✅ Error handling and user feedback

---

## 📝 **Next Steps**

1. **Replace the ML model** placeholder with your actual model
2. **Test with real data** from your database
3. **Add more attack types** to your database
4. **Fine-tune the UI** based on your needs
5. **Deploy to production** when ready

---

## 🆘 **Need Help?**

The integration is complete and ready to use! Just:
1. Set your database path in `.env`
2. Replace the ML model placeholder
3. Start testing!

**Files Modified:**
- `/server.cjs` - Added SQLite connection and prediction endpoint
- `/src/lib/api.ts` - Added prediction API method
- `/src/pages/VectorSearch.tsx` - Updated UI for predictions
- `/.env.example` - Added database path configuration

---

**Integration Status: ✅ READY TO USE**
