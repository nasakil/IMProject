import React from "react"
import "./dashboard.css"
import "./disbursement.css"
import logo from "../logo.png"
import { NavLink, useNavigate } from "react-router-dom"

export default function Disbursement() {

     const navigate = useNavigate()

  function handleLogout() {
    navigate("/") 
  }
  return (
    <div className="dash-root">
      <aside className="sidebar">
        <div className="logo-wrap">
          <img src={logo} alt="logo" className="logo" />
        </div>
        <nav className="nav">
          <NavLink to="/dashboard" className="nav-item">
            Dashboard
          </NavLink>
          <NavLink to="/disbursement" className="nav-item">
            Disbursement
          </NavLink>
          <NavLink to="/recipients" className="nav-item">
            Recipients
          </NavLink>
          <NavLink to="/reports" className="nav-item">
            Reports
          </NavLink>
        </nav>
        <button className="logout" onClick={handleLogout}>Log Out</button>
      </aside>

      <main className="main">
        <header className="topbar">
          <h1 className="page-title">Disbursement</h1>
          <div className="top-controls">
            <input className="search" placeholder="Search..." />
            <button className="gear" aria-label="settings">⚙️</button>
          </div>
        </header>

        <section className="disb-form">
          <form className="form-card">
            <div className="form-row">
              <label>Recipient name:</label>
              <input type="text" placeholder="Enter recipient name..." />
            </div>

            <div className="form-row">
              <label>Payment Method:</label>
              <select>
                <option>Choose method</option>
                <option>Bank Transfer</option>
                <option>Online Payment</option>
                <option>Cash</option>
                <option>Check</option>
              </select>
            </div>

            <div className="form-row">
              <label>Contact Details:</label>
              <input type="text" placeholder="Phone number or email..." />
            </div>

            <div className="form-row inline">
              <label>Amount:</label>
              <input type="number" placeholder="₱..." />
              <label>Date:</label>
              <input type="date" />
            </div>

            <div className="form-row">
              <label>Reason/Description:</label>
              <textarea placeholder="Type here..." rows="4" />
            </div>

            <div className="form-row">
              <label>Attachment:</label>
              <input type="file" className="filebtn" />
            </div>

            <div className="form-actions">
              <button type="button" className="btn cancel">Cancel</button>
              <button type="submit" className="btn submit">Submit</button>
            </div>
          </form>
        </section>
      </main>
    </div>
  )
}
