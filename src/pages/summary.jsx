import React, { useContext, useState } from "react"
import "./dashboard.css"
import "./summary.css"
import { NavLink, useNavigate } from "react-router-dom"
import { AppContext } from "../AppContext"
import Sidebar from "../components/nav"
import Topbar from "../components/topbar"

export default function Summary() {
  const navigate = useNavigate()

  const {
    pendingApprovals,
    markDisbursementFailed,
    deletePendingApproval,
    approveDisbursement,
    totalRequested
  } = useContext(AppContext)

  const [selectedIndex, setSelectedIndex] = useState(null)
  const [statusFilter, setStatusFilter] = useState("All")
  const [payeeFilter, setPayeeFilter] = useState("All")
  const [dateFilter, setDateFilter] = useState({ start: null, end: null })
  const [showSettingsMenu, setShowSettingsMenu] = useState(false);
  const [showAccountModal, setShowAccountModal] = useState(false);  
  const [showStatusModal, setShowStatusModal] = useState(false);

  function handleLogout() {
    navigate("/")
  }

  const reports = pendingApprovals.map(item => {
    const raw = item.date || item.createdAt || item.submittedAt || null
    const date = raw ? new Date(raw).toLocaleDateString() : new Date().toLocaleDateString()
    return {
      date,
      recipient: item.name,
      amount: `₱${item.amount}`,
      method: item.method,
      status: item.status || "Pending"
    }
  })

  const filteredReports = reports
    .filter(r => statusFilter === "All" || r.status === statusFilter)
    .filter(r => payeeFilter === "All" || r.recipient.toLowerCase().includes(payeeFilter.toLowerCase()))
    .filter(r => {
      if (!dateFilter.start || !dateFilter.end) return true
      const reportDate = new Date(r.date)
      const start = new Date(dateFilter.start)
      const end = new Date(dateFilter.end)
      return reportDate >= start && reportDate <= end
    })

  function openModal(index) {
    setSelectedIndex(index)
  }

  function closeModal() {
    setSelectedIndex(null)
  }

  function handleApprove() {
    if (selectedIndex === null) return
    approveDisbursement(selectedIndex)
    closeModal()
  }

  function handleCancel() {
    if (selectedIndex === null) return
    markDisbursementFailed(selectedIndex)
  }

  function handleDelete() {
    if (selectedIndex === null) return
    deletePendingApproval(selectedIndex)
    closeModal()
  }

  return (
    <div className="dash-root">
      <Sidebar/>

      <main className="main">
        <Topbar title="Summary"
         onOpenAccount={() => setShowAccountModal(true)}
         onOpenStatus={() => setShowStatusModal(true)}
         onLogout={handleLogout}
        />

        <section className="filter-bar">
          <span>Filter By:</span>

          <button
            className="filter-btn"
            onClick={() => {
              const start = prompt("Enter start date (YYYY-MM-DD):")
              const end = prompt("Enter end date (YYYY-MM-DD):")
              if (start && end) setDateFilter({ start, end })
            }}
          >
            Date Range ▼
          </button>

          <button
            className="filter-btn"
            onClick={() => {
              const status = prompt("Enter status (Pending, Approved, Failed):") || "All"
              setStatusFilter(status)
            }}
          >
            Status ▼
          </button>

          <button
            className="filter-btn"
            onClick={() => {
              const payee = prompt("Enter payee name:") || "All"
              setPayeeFilter(payee)
            }}
          >
            Payees ▼
          </button>
        </section>

        <section className="report-table">
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Payee</th>
                <th>Amount</th>
                <th>Method</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredReports.length === 0 ? (
                <tr>
                  <td colSpan="6" className="no-data">
                    No reports available. Submit a disbursement first.
                  </td>
                </tr>
              ) : (
                filteredReports.map((r, i) => (
                  <tr key={i}>
                    <td>{r.date}</td>
                    <td>{r.recipient}</td>
                    <td>{r.amount}</td>
                    <td>{r.method}</td>
                    <td className={r.status.toLowerCase()}>{r.status}</td>
                    <td>
                      <button className="view-btn" onClick={() => openModal(i)}>View</button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </section>

        {selectedIndex !== null && pendingApprovals[selectedIndex] && (
          <div className="modal-overlay">
            <div className="modal">
              <h2>Disbursement Details</h2>

              <p><strong>Recipient:</strong> {pendingApprovals[selectedIndex].name}</p>
              <p><strong>Amount:</strong> ₱{pendingApprovals[selectedIndex].amount}</p>
              <p><strong>Method:</strong> {pendingApprovals[selectedIndex].method}</p>
              <p><strong>Status:</strong> {pendingApprovals[selectedIndex].status || "Pending"}</p>

              {(() => {
                const desc =
                  pendingApprovals[selectedIndex].description ||
                  pendingApprovals[selectedIndex].reason ||
                  ""
                if (!desc) return null
                return (
                  <div className="modal-description-wrap">
                    <div className="modal-description-label">Reason / Description:</div>
                    <div className="modal-description">{desc}</div>
                  </div>
                )
              })()}

              <div className="modal-actions">
                {pendingApprovals[selectedIndex].status === "Pending" && (
                  <>
                    <button className="approve-transaction" onClick={handleApprove}>
                      Approve Transaction
                    </button>
                    <button className="cancel-transaction" onClick={handleCancel}>
                      Cancel Transaction
                    </button>
                  </>
                )}

                {pendingApprovals[selectedIndex].status === "Failed" && (
                  <button className="delete-transaction" onClick={handleDelete}>
                    Delete
                  </button>
                )}

                <button onClick={closeModal}>Close</button>
              </div>
            </div>
          </div>
        )}
        {showAccountModal && (
        <div className="modal-backdrop" onClick={() => setShowAccountModal(false)}>
          <div className="account-modal" onClick={(e) => e.stopPropagation()}>
            <h2>My Account</h2>

            <div className="field-row">
              <label>Username:</label>
              <div className="info-row">
                <span>yourusername</span>
                <button className="change-btn">Change Username</button>
              </div>
            </div>

            <div className="field-row">
              <label>Email:</label>
              <span>your@email.com</span>
            </div>

            <div className="field-row">
              <label>Contact Number:</label>
              <span>09123456789</span>
            </div>

            <div className="field-row">
              <label>Password:</label>
              <div className="info-row">
              <span>*********</span>
              <button className="change-btn">Change Password</button>
            </div>
            </div>

            <button className="close-modal" onClick={() => setShowAccountModal(false)}>Close</button>
          </div>
        </div>
      )}
        {showStatusModal && (
          <div className="modal-backdrop" onClick={() => setShowStatusModal(false)}>
            <div className="status-modal" onClick={(e) => e.stopPropagation()}>
              <h2>Account Status</h2>

              <div className="status-row">
                <span>Total Requested Disbursements: </span>
                <span>{totalRequested}</span>
              </div>

              <div className="status-row">
                <span>Login History: </span>
                <span>0</span>
              </div>

              <button className="close-modal" onClick={() => setShowStatusModal(false)}>Close</button>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
