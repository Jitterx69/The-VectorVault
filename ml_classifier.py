#!/usr/bin/env python3
"""
ML Attack Classifier - TensorFlow Implementation
Predicts attack types based on 3-feature input vector
"""

import sys
import json
import numpy as np
import tensorflow as tf
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import Dense

# Suppress TensorFlow warnings
tf.get_logger().setLevel('ERROR')

# --- 1. TRAINING DATA ---
X_data = np.array([
    [0, 0, 0],  # Normal
    [1, 0, 0],  # DDoS
    [1, 1, 0],  # DDoS/Overload mix
    [0, 1, 0],  # SQL Injection
    [0, 1, 1],  # SQL Injection + Phishing symptom
    [0, 0, 1],  # Phishing
    [1, 0, 1],  # DDoS + Phishing symptom
    [0, 0, 0],  # Normal
], dtype=np.float32)

Y_labels = np.array([
    [1, 0, 0, 0], # Normal
    [0, 1, 0, 0], # DDoS
    [0, 1, 0, 0], # DDoS
    [0, 0, 1, 0], # SQL Injection
    [0, 0, 1, 0], # SQL Injection
    [0, 0, 0, 1], # Phishing
    [0, 1, 0, 0], # DDoS
    [1, 0, 0, 0], # Normal
], dtype=np.float32)

ATTACK_TYPES = [
    "Normal System Behavior",
    "Distributed Denial of Service (DDoS)",
    "SQL Injection (SQLi)",
    "Phishing Attack"
]


# --- 2. BUILD MODEL ---
def build_and_train_model(X, Y):
    """Creates and trains the neural network"""
    model = Sequential([
        Dense(8, activation='relu', input_shape=(X.shape[1],)),
        Dense(len(ATTACK_TYPES), activation='softmax')
    ])
    
    model.compile(
        optimizer='adam',
        loss='categorical_crossentropy',
        metrics=['accuracy']
    )
    
    # Train quietly
    model.fit(X, Y, epochs=100, verbose=0)
    
    return model


# --- 3. PREDICT ---
def predict_attack(model, input_vector):
    """Predicts attack type from input vector"""
    prediction_raw = model.predict(input_vector, verbose=0)[0]
    predicted_index = np.argmax(prediction_raw)
    
    attack_name = ATTACK_TYPES[predicted_index]
    confidence = float(prediction_raw[predicted_index])
    
    return {
        "attackName": attack_name,
        "confidence": confidence,
        "probabilities": {
            ATTACK_TYPES[i]: float(prediction_raw[i])
            for i in range(len(ATTACK_TYPES))
        }
    }


# --- 4. MAIN EXECUTION ---
if __name__ == '__main__':
    try:
        # Parse command line arguments: input1 input2 input3
        if len(sys.argv) != 4:
            print(json.dumps({
                "error": "Expected 3 arguments: input1 input2 input3",
                "usage": "python ml_classifier.py 1 0 0"
            }))
            sys.exit(1)
        
        # Get inputs
        input1 = int(sys.argv[1])
        input2 = int(sys.argv[2])
        input3 = int(sys.argv[3])
        
        # Validate inputs (should be 0 or 1)
        if not all(val in [0, 1] for val in [input1, input2, input3]):
            print(json.dumps({
                "error": "All inputs must be 0 or 1",
                "received": [input1, input2, input3]
            }))
            sys.exit(1)
        
        # Create input vector
        input_vector = np.array([[input1, input2, input3]], dtype=np.float32)
        
        # Train model
        model = build_and_train_model(X_data, Y_labels)
        
        # Predict
        result = predict_attack(model, input_vector)
        
        # Output JSON result
        print(json.dumps(result))
        sys.exit(0)
        
    except Exception as e:
        print(json.dumps({
            "error": str(e)
        }))
        sys.exit(1)
