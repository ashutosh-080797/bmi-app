// App.js
import React, { useState } from 'react';
import { Link, Route, BrowserRouter as Router, Routes } from 'react-router-dom';

// Home Tab
function Home() {
  const [weight, setWeight] = useState(60);
  const [height, setHeight] = useState(170);
  const [bmi, setBMI] = useState(null);

  const calculateBMI = async () => {
    const response = await fetch('YOUR_BACKEND_API/bmi', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ weight, height }),
    });
    const data = await response.json();
    setBMI(data.bmi);
  };

  return (
    <div>
      <h2>BMI Calculator</h2>
      <div>
        <label>Weight (kg): </label>
        <select value={weight} onChange={(e) => setWeight(e.target.value)}>
          {[...Array(150)].map((_, i) => <option key={i}>{i + 40}</option>)}
        </select>
      </div>
      <div>
        <label>Height (cm): </label>
        <select value={height} onChange={(e) => setHeight(e.target.value)}>
          {[...Array(100)].map((_, i) => <option key={i}>{i + 100}</option>)}
        </select>
      </div>
      <button onClick={calculateBMI}>Calculate BMI</button>
      {bmi && <p>Your BMI: {bmi}</p>}
    </div>
  );
}

// Account Tab (Signup/Login)
function Account() {
  const [phone, setPhone] = useState('');
  const [name, setName] = useState('');
  const [otp, setOtp] = useState('');

  const handleSignup = async () => {
    await fetch('YOUR_BACKEND_API/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, phone }),
    });
  };

  const handleLogin = async () => {
    await fetch('YOUR_BACKEND_API/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone }),
    });
  };

  const verifyOTP = async () => {
    await fetch('YOUR_BACKEND_API/verify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone, otp }),
    });
  };

  return (
    <div>
      <h2>Signup</h2>
      <input placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
      <input placeholder="Phone" value={phone} onChange={(e) => setPhone(e.target.value)} />
      <button onClick={handleSignup}>Signup</button>

      <h2>Login</h2>
      <input placeholder="Phone" value={phone} onChange={(e) => setPhone(e.target.value)} />
      <button onClick={handleLogin}>Send OTP</button>
      <input placeholder="OTP" value={otp} onChange={(e) => setOtp(e.target.value)} />
      <button onClick={verifyOTP}>Verify OTP</button>
    </div>
  );
}

// Main App
function App() {
  return (
    <Router>
      <nav>
        <Link to="/">Home</Link>
        <Link to="/account">Account</Link>
      </nav>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/account" element={<Account />} />
      </Routes>
    </Router>
  );
}

export default App;