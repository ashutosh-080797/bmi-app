# app.py
from flask import Flask, request, jsonify
import psycopg2
import os
import random
import boto3  # AWS SDK for SNS

app = Flask(__name__)

# Connect to PostgreSQL (AWS RDS)
conn = psycopg2.connect(
    dbname='your_db',
    user='your_user',
    password='your_password',
    host='your-rds-endpoint.amazonaws.com'
)

# AWS SNS for OTP
sns = boto3.client('sns', region_name='us-east-1')

@app.route('/signup', methods=['POST'])
def signup():
    data = request.json
    name = data['name']
    phone = data['phone']
    
    cur = conn.cursor()
    cur.execute("INSERT INTO users (name, phone) VALUES (%s, %s)", (name, phone))
    conn.commit()
    return jsonify({"message": "User created!"})

@app.route('/login', methods=['POST'])
def login():
    phone = request.json['phone']
    otp = str(random.randint(1000, 9999))  # Generate 4-digit OTP
    
    # Store OTP in DB (add a column for OTP in users table)
    cur = conn.cursor()
    cur.execute("UPDATE users SET otp = %s WHERE phone = %s", (otp, phone))
    conn.commit()
    
    # Send OTP via SMS
    sns.publish(PhoneNumber=phone, Message=f"Your OTP is: {otp}")
    return jsonify({"message": "OTP sent!"})

@app.route('/verify', methods=['POST'])
def verify_otp():
    phone = request.json['phone']
    otp = request.json['otp']
    
    cur = conn.cursor()
    cur.execute("SELECT otp FROM users WHERE phone = %s", (phone,))
    stored_otp = cur.fetchone()[0]
    
    if stored_otp == otp:
        return jsonify({"message": "Login successful!"})
    else:
        return jsonify({"error": "Invalid OTP"}), 401

@app.route('/bmi', methods=['POST'])
def calculate_bmi():
    data = request.json
    weight = float(data['weight'])
    height = float(data['height']) / 100  # Convert cm to meters
    bmi = weight / (height ** 2)
    return jsonify({"bmi": round(bmi, 2)})

if __name__ == '__main__':
    app.run(debug=True)