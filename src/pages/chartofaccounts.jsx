import React, { useContext, useState, useEffect } from "react"
import "./dashboard.css"
import "./chartofaccounts.css"
import logo from "./logo.png"
import { NavLink, useNavigate } from "react-router-dom"
import { AppContext } from "../AppContext"

export default function ChartOfAccounts() {
  const navigate = useNavigate()
  const {
    payees,
    getPayeeCOA,
    updatePayeeCOA,
    currentPayee,
    setCurrentPayee,
    currentCOA,
    setCurrentCOA
  } = useContext(AppContext)

  const [payeeName, setPayeeName] = useState("")
  const [showModal, setShowModal] = useState(false)
  const [selectedTable, setSelectedTable] = useState("Liabilities")
  const [newAccountName, setNewAccountName] = useState("")

  const defaultCOA = {
    Assets: [
      { number: 1001, name: "Cash on Hand" },
      { number: 1002, name: "Cash In Bank" },
      { number: 1003, name: "Online Payment Account" },
      { number: 1004, name: "Checks on Hand" }
    ],
    Liabilities: [{ number: 2001, name: "Accounts Payable" }],
    Revenues: [{ number: 3001, name: "Services" }],
    Expenses: [
      { number: 4001, name: "Materials" },
      { number: 4002, name: "Labor" },
      { number: 4003, name: "Rent" },
      { number: 4004, name: "Miscellaneous" }
    ]
  }

  const handleLogout = () => navigate("/")

  const openModal = () => setShowModal(true)
  const closeModal = () => {
    setShowModal(false)
    setNewAccountName("")
    setSelectedTable("Liabilities")
  }

  // Load currentCOA on mount (when returning to page)
  useEffect(() => {
    if (currentPayee) setPayeeName(currentPayee.name)
    if (currentCOA && Object.keys(currentCOA).length) return
    if (currentPayee) {
      const saved = getPayeeCOA(currentPayee.name)
      setCurrentCOA(saved || defaultCOA)
    }
  }, [])

  const handlePayeeEnter = (e) => {
    if (e.key !== "Enter") return

    const found = payees.find(p => p.name.toLowerCase() === payeeName.toLowerCase())
    if (!found) {
      setCurrentPayee(null)
      setCurrentCOA({})
      alert("This payee does not exist.")
      return
    }

    setCurrentPayee(found)
    const savedCOA = getPayeeCOA(found.name)
    setCurrentCOA(savedCOA || defaultCOA)
  }

  const handleAddAccount = () => {
    if (!newAccountName.trim() || !currentPayee) return

    // Prevent duplicate names in selected table
    if (currentCOA[selectedTable].some(acc => acc.name.toLowerCase() === newAccountName.toLowerCase())) {
      alert("This account already exists in the selected table.")
      return
    }

    const table = selectedTable
    const lastNumber = currentCOA[table].length
      ? currentCOA[table][currentCOA[table].length - 1].number
      : table === "Liabilities" ? 2000
        : table === "Revenues" ? 3000
          : 4000

    const newAccount = { number: lastNumber + 1, name: newAccountName }
    const updatedCOA = { ...currentCOA, [table]: [...currentCOA[table], newAccount] }

    updatePayeeCOA(currentPayee.name, updatedCOA)
    setCurrentCOA(updatedCOA)
    closeModal()
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
          <NavLink to="/chartofaccounts" className="nav-item active">Chart of Accounts</NavLink>
        </nav>
        <button className="logout" onClick={handleLogout}>Log Out</button>
      </aside>

      <main className="main">
        <header className="topbar">
          <h1 className="page-title">Chart of Accounts</h1>
          <div className="top-controls">
            <input className="search" placeholder="Search..." />
            <button className="gear" aria-label="settings">⚙️</button>
          </div>
        </header>

        <div className="coa-buttons">
          <input
            className="coa-input-top"
            placeholder="Enter payee name"
            value={payeeName}
            onChange={e => setPayeeName(e.target.value)}
            onKeyDown={handlePayeeEnter}
          />
          {currentPayee && <button onClick={openModal} style={{ marginLeft: "10px" }}>Add Account</button>}
        </div>

        <div className="coa-center-wrap">
          <div className="coa-card">
            {!currentPayee ? (
              <p style={{ textAlign: "center", marginTop: "50px", color: "black" }}>
                Enter the payee's name to see their chart of accounts
              </p>
            ) : (
              <>
                <h3 style={{ marginBottom: "5px"}}>{currentPayee.name}'s Chart of Accounts</h3>
                {["Assets", "Liabilities", "Revenues", "Expenses"].map(section => (
                  <table key={section} className="coa-section-table">
                    <thead>
                      <tr><th colSpan="4" className="section-header">{section}</th></tr>
                      <tr>
                        <th>Account Number</th>
                        <th>Account Name</th>
                        <th>Debit</th>
                        <th>Credit</th>
                      </tr>
                    </thead>
                    <tbody>
                      {currentCOA[section]?.map(acc => (
                        <tr key={acc.number}>
                          <td>{acc.number}</td>
                          <td>{acc.name}</td>
                          <td>0</td>
                          <td>0</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ))}
              </>
            )}
          </div>
        </div>

        {showModal && (
          <div className="modal-overlay">
            <div className="modal">
              <h3>Add New Account</h3>
              <label>
                Table:
                <select value={selectedTable} onChange={(e) => setSelectedTable(e.target.value)}>
                  <option value="Liabilities">Liabilities</option>
                  <option value="Revenues">Revenues</option>
                  <option value="Expenses">Expenses</option>
                </select>
              </label>
              <label>
                Account Name:
                <input
                  type="text"
                  value={newAccountName}
                  onChange={(e) => setNewAccountName(e.target.value)}
                />
              </label>
              <div style={{ marginTop: "15px" }}>
                <button onClick={handleAddAccount}>Add</button>
                <button onClick={closeModal} style={{ marginLeft: "10px" }}>Cancel</button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
