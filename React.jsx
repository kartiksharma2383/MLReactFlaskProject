//REACT CODE
npx create-react-app fraud-detection-dashboard
cd fraud-detection-dashboard
npm install axios react-router-dom plotly.js react-plotly.js bootstrap

//app.js
import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import axios from "axios";
import Navbar from "./components/Navbar";
import Login from "./components/Login";
import Welcome from "./components/Welcome";
import FilteredData from "./components/FilteredData";
import AdvancedAnalysis from "./components/AdvancedAnalysis";
import About from "./components/About";
import "bootstrap/dist/css/bootstrap.min.css";

function App() {
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    axios.get("http://localhost:5000/check-auth", { withCredentials: true })
      .then(response => {
        if (response.data.authenticated) {
          setAuthenticated(true);
        }
      })
      .catch(() => setAuthenticated(false));
  }, []);

  return (
    <Router>
      <Navbar authenticated={authenticated} setAuthenticated={setAuthenticated} />
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login setAuthenticated={setAuthenticated} />} />
        <Route path="/welcome" element={authenticated ? <Welcome /> : <Navigate to="/login" />} />
        <Route path="/filtered-data" element={authenticated ? <FilteredData /> : <Navigate to="/login" />} />
        <Route path="/advanced-analysis" element={authenticated ? <AdvancedAnalysis /> : <Navigate to="/login" />} />
        <Route path="/about" element={<About />} />
      </Routes>
    </Router>
  );
}

export default App;

//login.js
import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Login({ setAuthenticated }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const response = await axios.post("http://localhost:5000/login", { username, password }, { withCredentials: true });
      if (response.data.success) {
        setAuthenticated(true);
        navigate("/welcome");
      } else {
        alert("Invalid credentials");
      }
    } catch (error) {
      alert("Login failed");
    }
  };

  return (
    <div className="container mt-5">
      <h2>Login to Fraud Data Analytics</h2>
      <input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
      <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
      <button onClick={handleLogin}>Login</button>
    </div>
  );
}

export default Login;

//filterdata.js
import React, { useState, useEffect } from "react";
import axios from "axios";
import Plot from "react-plotly.js";

function FilteredData() {
  const [data, setData] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");

  useEffect(() => {
    axios.get("http://localhost:5000/data")
      .then(response => setData(response.data))
      .catch(error => console.error(error));
  }, []);

  return (
    <div>
      <h3>Filtered Data</h3>
      <select onChange={(e) => setSelectedCategory(e.target.value)}>
        <option value="">All</option>
        {Array.from(new Set(data.map(item => item.fraud_category))).map(category => (
          <option key={category} value={category}>{category}</option>
        ))}
      </select>
      <ul>
        {data.filter(item => !selectedCategory || item.fraud_category === selectedCategory)
             .map((item, index) => <li key={index}>{item.fraud_category} - {item.total_amount}</li>)}
      </ul>
    </div>
  );
}

export default FilteredData;
