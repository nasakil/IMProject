import React, { useState, useContext, useRef, useEffect } from "react"
import "./dashboard.css"
import "./disbursement.css"
import logo from "../logo.png"
import { NavLink, useNavigate } from "react-router-dom"
import { AppContext } from "../AppContext"

export default function Disbursement() {
  const { addDisbursement, payees } = useContext(AppContext)
  const navigate = useNavigate()
  const fileInputRef = useRef(null)

  const [form, setForm] = useState({
    name: "",
    method: "",
    contact: "",
    amount: "",
    date: "",
    reason: "",
    file: null
  })

  // autosuggest + validation state
  const [suggestions, setSuggestions] = useState([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [nameError, setNameError] = useState(false)

  // set default date to today (YYYY-MM-DD)
  useEffect(() => {
    const d = new Date()
    const yyyy = d.getFullYear()
    const mm = String(d.getMonth() + 1).padStart(2, "0")
    const dd = String(d.getDate()).padStart(2, "0")
    setForm(prev => ({ ...prev, date: `${yyyy}-${mm}-${dd}` }))
  }, [])

  function handleChange(e) {
    const { name, value, files } = e.target
    const newVal = files ? files[0] : value
    // special handling for payee name input (autosuggest + validate)
    if (name === "name") {
      setForm(prev => ({ ...prev, name: newVal }))
      const q = String(newVal || "").trim()
      if (!q) {
        setSuggestions([])
        setShowSuggestions(false)
        setNameError(false)
        return
      }
      const names = (payees || []).map(p => p.name || "")
      const filtered = names.filter(n => n.toLowerCase().includes(q.toLowerCase()))
      setSuggestions(filtered)
      setShowSuggestions(filtered.length > 0)
      // exact-match validation (case-insensitive)
      const exact = names.find(n => n.toLowerCase() === q.toLowerCase())
      setNameError(!exact)
      return
    }

    setForm(prev => ({
      ...prev,
      [name]: newVal
    }))
  }

  function handleSubmit(e) {
    e.preventDefault()

    if (!form.name || !form.amount || !form.method) {
      alert("Please fill in the required fields.")
      return
    }
    // prevent submit if name not in payee list
    const names = (payees || []).map(p => p.name || "")
    const matched = names.find(n => n.toLowerCase() === String(form.name || "").toLowerCase())
    if (!matched) {
      setNameError(true)
      alert("The payee name is not in the payee's list.")
      return
    }

    addDisbursement({
      name: form.name,
      method: form.method,
      contact: form.contact,
      amount: form.amount,
      date: form.date,
      reason: form.reason,
      file: form.file || null
    })

    alert("Disbursement submitted.")

    // Reset all fields including file input
    setForm({
      name: "",
      method: "",
      contact: "",
      amount: "",
      date: "",
      reason: "",
      file: null
    })
    setNameError(false)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  function handleClear() {
    setForm({
      name: "",
      method: "",
      contact: "",
      amount: "",
      date: "",
      reason: "",
      file: null
    })
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

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
          <NavLink to="/dashboard" className="nav-item">Dashboard</NavLink>
          <NavLink to="/disbursement" className="nav-item">Disbursement</NavLink>
          <NavLink to="/payees" className="nav-item">Payees</NavLink>
          <NavLink to="/summary" className="nav-item">Summary</NavLink>
          <NavLink to="/summary" className="nav-item">Chart of Accounts</NavLink>
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
          <form className="form-card" onSubmit={handleSubmit}>
            <div className="form-row">
              <label>Name Of Payee:</label>
              <input
                name="name"
                type="text"
                placeholder="Enter the name of the payee..."
                value={form.name}
                onChange={handleChange}
                className={nameError ? "input-error" : ""}
              />
              <div className="error-holder">
              {nameError && <span className="error-text">Payee not found in the list.</span>}
            </div>
            </div>

            <div className="form-row">
              <label>Payment Method:</label>
              <select name="method" value={form.method} onChange={handleChange}>
                <option value="">Choose method</option>
                <option>Bank Transfer</option>
                <option>Online Payment</option>
                <option>Cash</option>
                <option>Check</option>
              </select>
            </div>

            <div className="form-row">
              <label>Contact Details:</label>
              <input
                name="contact"
                type="text"
                placeholder="Phone number or email..."
                value={form.contact}
                onChange={handleChange}
              />
            </div>

            <div className="form-row inline">
              <label>Amount:</label>
              <input
                name="amount"
                type="number"
                placeholder="₱..."
                value={form.amount}
                onChange={handleChange}
              />
              <label>Date:</label>
              <input
                name="date"
                type="date"
                value={form.date}
                onChange={handleChange}
              />
            </div>

            <div className="form-row">
              <label>Reason/Description:</label>
              <textarea
                name="reason"
                placeholder="Type here..."
                rows="4"
                value={form.reason}
                onChange={handleChange}
              />
            </div>

            <div className="form-actions">
              <button type="button" className="btn cancel" onClick={handleClear}>
                Clear All
              </button>
              <button type="submit" className="btn submit">Submit</button>
            </div>
          </form>
        </section>
      </main>
    </div>
  )
}
