npx create-react-app fraud-detection
cd fraud-detection
npm install axios react-bootstrap bootstrap react-table

//app.js
import React, { useState, useEffect } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";

function App() {
  const [data, setData] = useState([]);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);
  const [message, setMessage] = useState("");

  // Fetch dataset from Flask backend
  useEffect(() => {
    axios.get("http://127.0.0.1:5000/data").then((response) => {
      setData(response.data);
    });
  }, []);

  // Handle login
  const handleLogin = () => {
    axios
      .post("http://127.0.0.1:5000/login", { username, password })
      .then((res) => {
        setMessage(res.data.message);
        if (res.data.message === "Login successful!") setLoggedIn(true);
      })
      .catch((err) => setMessage("Login failed!"));
  };

  return (
    <div className="container">
      <h2 className="mt-4">Fraud Detection Dashboard</h2>

      {!loggedIn ? (
        <div className="mt-3">
          <h3>Login</h3>
          <input
            type="text"
            placeholder="Username"
            className="form-control mb-2"
            onChange={(e) => setUsername(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            className="form-control mb-2"
            onChange={(e) => setPassword(e.target.value)}
          />
          <button className="btn btn-primary" onClick={handleLogin}>
            Login
          </button>
          <p className="mt-2">{message}</p>
        </div>
      ) : (
        <div>
          <h3>Dataset Preview</h3>
          <table className="table table-bordered">
            <thead>
              <tr>
                <th>Amount</th>
                <th>City Population</th>
                <th>Latitude</th>
                <th>Longitude</th>
                <th>Is Fraud</th>
              </tr>
            </thead>
            <tbody>
              {data.slice(0, 10).map((row, index) => (
                <tr key={index}>
                  <td>{row.amt}</td>
                  <td>{row.city_pop}</td>
                  <td>{row.lat}</td>
                  <td>{row.long}</td>
                  <td>{row.is_fraud}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default App;

