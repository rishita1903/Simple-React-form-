// src/App.js
import React, { useState, useEffect } from "react";
import "./App.css";

const App = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    flatNumber: "",
    purpose: "Delivery",
    mobile: "",
  });

  const [submittedData, setSubmittedData] = useState([]);
  const [popupMessage, setPopupMessage] = useState("");

  useEffect(() => {
    const storedData = JSON.parse(localStorage.getItem("visitorLogs")) || [];
    setSubmittedData(storedData);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    const { fullName, flatNumber, purpose, mobile } = formData;
    if (!fullName.trim() || !flatNumber.trim() || !purpose || !mobile.trim()) {
      alert("Please fill out all fields.");
      return false;
    }
    if (!/^\d{10}$/.test(mobile)) {
      alert("Mobile number must be exactly 10 digits.");
      return false;
    }
    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const newEntry = { ...formData, id: Date.now() };
    const updatedData = [newEntry, ...submittedData];

    setSubmittedData(updatedData);
    localStorage.setItem("visitorLogs", JSON.stringify(updatedData));

    setFormData({
      fullName: "",
      flatNumber: "",
      purpose: "Delivery",
      mobile: "",
    });

    setPopupMessage("Visitor registered successfully!");

    setTimeout(() => setPopupMessage(""), 3000);
  };

  const handleDelete = (id) => {
    const filteredData = submittedData.filter((entry) => entry.id !== id);
    setSubmittedData(filteredData);
    localStorage.setItem("visitorLogs", JSON.stringify(filteredData));
    setPopupMessage("Visitor entry deleted.");

    setTimeout(() => setPopupMessage(""), 2000);
  };

  return (
    <div className="container">
      <h2>🏡 Society Visitor Registration</h2>
      <form onSubmit={handleSubmit} className="form-box">
        <input
          type="text"
          name="fullName"
          placeholder="Full Name"
          value={formData.fullName}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="flatNumber"
          placeholder="Flat Number (e.g. A-203)"
          value={formData.flatNumber}
          onChange={handleChange}
          required
        />
        <select
          name="purpose"
          value={formData.purpose}
          onChange={handleChange}
          required
        >
          <option value="">-- Select Purpose --</option>
          <option value="Delivery">Delivery</option>
          <option value="Guest">Guest</option>
          <option value="Maintenance">Maintenance</option>
          <option value="Other">Other</option>
        </select>
        <input
          type="text"
          name="mobile"
          placeholder="10-digit Mobile Number"
          value={formData.mobile}
          onChange={handleChange}
          required
        />
        <button type="submit">Submit</button>
      </form>

      {popupMessage && <div className="popup">{popupMessage}</div>}

      <div className="log-section">
        <h3>📋 Visitor Log</h3>
        {submittedData.length === 0 ? (
          <p>No visitors yet.</p>
        ) : (
          submittedData.map((entry) => (
            <div key={entry.id} className="entry-card">
              <p><strong>👤 Name:</strong> {entry.fullName}</p>
              <p><strong>🏢 Flat:</strong> {entry.flatNumber}</p>
              <p><strong>🎯 Purpose:</strong> {entry.purpose}</p>
              <p><strong>📞 Mobile:</strong> {entry.mobile}</p>
              <button className="delete-btn" onClick={() => handleDelete(entry.id)}>Delete</button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default App;
