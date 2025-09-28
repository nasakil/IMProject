import React from "react"
import "./dashboard.css"
import logo from "./logo.png"
import { NavLink, useNavigate} from "react-router-dom"


export default function Dashboard() {

 const navigate = useNavigate()

  function handleLogout() {
    navigate("/") 
  }

const stats = [
{ title: "Total Disbursed Today", value: "₱ 0" },
{ title: "Pending Disbursements", value: "3" },
{ title: "Failed Transactions", value: "1", warning: true }
]

const recent = [
"₱5,000 disbursed to Juan Dela Cruz",
"₱2,000 disbursement failed for Maria Reyes"
]

const approvals = [
"₱3,000 disbursed to Ana Delos Santos",
"₱15,000 disbursed to Carlos Manalo",
"₱3,500 disbursed to Lucita Ramon"
]

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
      <h1 className="page-title">Dashboard</h1>
      <div className="top-controls">
        <input className="search" placeholder="Search..." />
        <button className="gear" aria-label="settings">⚙️</button>
      </div>
    </header>

    <section className="cards-row">
      {stats.map((s, i) => (
        <div key={i} className={"stat-card" + (s.warning ? " warn" : "")}>
          <div className="stat-value">{s.value}</div>
          <div className="stat-title">{s.title}</div>
        </div>
      ))}
    </section>

    <section className="content-grid">
      <div className="recent-card">
        <div className="card-title">Recent Activity</div>
        <ul className="activity-list">
          {recent.map((r, i) => (
            <li key={i}>{r}</li>
          ))}
        </ul>
      </div>

      <div className="pending-card">
        <div className="card-title">Pending Approvals</div>
        <ul className="approvals-list">
          {approvals.map((a, i) => (
            <li key={i}>
              <span className="bullet" />
              <span className="app-text">{a}</span>
              <button className="chev">›</button>
            </li>
          ))}
        </ul>
      </div>
    </section>
  </main>
</div>
)
}