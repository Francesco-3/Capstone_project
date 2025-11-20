import { useState } from "react";
import { Nav, Image } from "react-bootstrap";
import { Link, useLocation } from "react-router-dom";
import classNames from "classnames";

import "./css/AsideLeft.css";
import userAvatar from "../assets/image/user.png";

export default function AsideLeft() {
  const [collapsed, setCollapsed] = useState(false);
  const [user] = useState(null);
  const location = useLocation()

  const toggleCollapsed = () => setCollapsed(prev => !prev);

  return (
    <div className={classNames("sidebar align-items-center", { collapsed })} style={{ border: "var(--border)" }}>
      {/* Bottone collapse */}
      <button className="expand-btn" onClick={toggleCollapsed}>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
        </svg>
      </button>

      {/* Logo */}
      <div className="sidebar-top-wrapper d-flex">
        <div className="sidebar-top d-flex align-items-start flex-column">
          <a href="/engineer" className="logo_wrapper d-flex align-items-center fw-700">
            <Image src="{logo}" alt="Logo" className="logo-small" />
            {!collapsed && <span className="company-name">Mechanista WMS</span>}
          </a>
        </div>
      </div>

      {/* Link per la Dashboard */}
      <Nav className="sidebar-links flex-column">
        <div className="tooltip-wrapper">
          <Nav.Link as={Link} to="/engineer" className={classNames("d-flex align-items-center sidebar-link", { active: location.pathname === "/engineer" })}>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <rect x="15" y="12" width="9" height="9" rx="1.5"/>
              <rect x="3" y="3" width="9" height="9" rx="1.5"/>
              <rect x="15" y="3" width="9" height="6" rx="1.5"/>
              <rect x="3" y="15" width="9" height="6" rx="1.5"/>
            </svg>
            {!collapsed && <span className="link">Dashboard</span>}
          </Nav.Link>
          <span className="tooltip-content">{collapsed && "Dashboard"}</span>
        </div>

        {/* Link per le Analisi */}
        <div className="tooltip-wrapper">
          <Nav.Link as={Link} to="analytics" className={(location.pathname === "/engineer/analytics" ? "active " : "") + "d-flex align-items-center"}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <polyline points="4,18 10,12 14,16 20,8"/>
              <circle cx="4" cy="18" r="2"/>
              <circle cx="10" cy="12" r="2"/>
              <circle cx="14" cy="16" r="2"/>
              <circle cx="20" cy="8" r="2"/>
            </svg>
            {!collapsed && <span className="link">Analisi</span>}
          </Nav.Link>
          <span className="tooltip-content">{collapsed && "Analisi"}</span>
        </div>

        {/* Link per il Monitoraggio */}
        <div className="tooltip-wrapper">
          <Nav.Link as={Link} to="monitoring" className={(location.pathname === "/engineer/monitoring" ? "active " : "") + "d-flex align-items-center"}>
            <svg xmlns="http://www.w3.org/2000/svg" 
              width="24" height="24" 
              viewBox="0 0 24 24" fill="none" stroke="currentColor" 
              stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
            </svg>
            {!collapsed && <span className="link">Monitoraggio</span>}
          </Nav.Link>
          <span className="tooltip-content">{collapsed && "Monitoraggio"}</span>
        </div>

        {/* Link per gli Utenti */}
        <div className="tooltip-wrapper">
          <Nav.Link as={Link} to="users" className={(location.pathname === "/engineer/users" ? "active " : "") + "d-flex align-items-center"}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <circle cx="12" cy="8" r="4"/>
              <path d="M4 20c1-4 4-6 8-6s7 2 8 6"/>
            </svg>
            {!collapsed && <span className="link">Utenti</span>}
          </Nav.Link>
          <span className="tooltip-content">{collapsed && "Utenti"}</span>
        </div>

        {/* Link per i Prodotti */}
        <div className="tooltip-wrapper">
          <Nav.Link as={Link} to="products" className={(location.pathname === "/engineer/products" ? "active " : "") + "d-flex align-items-center"}>
            <svg xmlns="http://www.w3.org/2000/svg" 
              width="24" height="24" viewBox="0 0 24 24"
              fill="none" stroke="currentColor" stroke-width="2" 
              stroke-linecap="round"  stroke-linejoin="round">
              <path d="M12.89 1.17l8.23 4.74A2 2 0 0 1 22 7.64v8.72a2 2 0 0 1-1.28 1.81l-8.23 4.74a2 2 0 0 1-1.42 0l-8.23-4.74A2 2 0 0 1 2 16.36V7.64a2 2 0 0 1 1.28-1.81l8.23-4.74a2 2 0 0 1 1.42 0z"/>
              <polyline points="2.32 6.75 12 12.38 21.68 6.75"/>
              <polyline points="12 21.68 12 12.38 12 2.32"/>
            </svg>
            {!collapsed && <span className="link">Prodotti</span>}
          </Nav.Link>
          <span className="tooltip-content">{collapsed && "Prodotti"}</span>
        </div>

        <div className="separator w-100 mb-4 mx-0 separator-top"></div>

        {/* Link per le Impostazioni */}
        <div className="tooltip-wrapper">
          <Nav.Link as={Link} to="settings" className={(location.pathname === "/engineer/settings" ? "active " : "") + "d-flex align-items-center"}>
            <svg xmlns="http://www.w3.org/2000/svg" 
              width="24" height="24" 
              viewBox="0 0 24 24" fill="none" stroke="currentColor" 
              stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="3"/>
              <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9A1.65 1.65 0 0 0 10 3.69V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/>
            </svg>
            {!collapsed && <span className="link">Impostazioni</span>}
          </Nav.Link>
          <span className="tooltip-content">{collapsed && "Impostazioni"}</span>
        </div>

        {/* Link per il Supporto */}
        <div className="tooltip-wrapper">
          <Nav.Link as={Link} to="support" className={(location.pathname === "/engineer/support" ? "active " : "") + "d-flex align-items-center"}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <circle cx="12" cy="12" r="9"/>
              <path d="M9 10a3 3 0 1 1 6 0c0 2-3 2-3 4"/>
              <line x1="12" y1="17" x2="12" y2="17.1"/>
            </svg>
            {!collapsed && <span className="link">Supporto</span>}
          </Nav.Link>
          <span className="tooltip-content">{collapsed && "Supporto"}</span>
        </div>

        {/* Link per le Notifiche */}
        <div className="tooltip-wrapper">
          <Nav.Link as={Link} to="notifications" className={(location.pathname === "/engineer/notifications" ? "active " : "") + "d-flex align-items-center"}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M12 22c1.2 0 2-.8 2-2h-4c0 1.2.8 2 2 2zm7-6v-5a7 7 0 1 0-14 0v5l-2 2v1h18v-1l-2-2z"/>
            </svg>
            {!collapsed && <span className="link">Notifiche</span>}
          </Nav.Link>
          <span className="tooltip-content">{collapsed && "Notifiche"}</span>
        </div>
      </Nav>

      <div className="separator w-100 my-4 mx-0"></div>

      {/* Profilo utente */}
      <div className="sidebar_profile d-flex align-items-start flex-column" style={{ color: "var(--label-bg)", gap: "10px" }}>
        <Nav className="d-flex flex-column align-items-center w-100">
          {/* Link per il profilo dell'Utente */}
          <Nav.Link as={Link} to="me" className={(location.pathname === "/engineer/me" ? "active " : "") + "d-flex gap-3 align-items-center"}>
            <div className="avatar_wrapper d-flex">
              <Image src={userAvatar} alt="Avatar" className="avatar d-block pointer" roundedCircle />
            </div>
            {!collapsed && (<div className="avatar_name fw-bold">{user?.username || "Profilo"}</div>)}
          </Nav.Link>

          {/* Link per tornare al Login */}
          <Nav.Link href="/login" className="logout mt-2 p-1 d-flex align-items-center">
            <svg xmlns="http://www.w3.org/2000/svg" 
              width="24" height="24" 
              viewBox="0 0 24 24" fill="none" 
              stroke="currentColor" stroke-width="2" 
              stroke-linecap="round" stroke-linejoin="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" style={{color: "var(--danger)"}}/>
              <polyline points="16 17 21 12 16 7" style={{color: "var(--danger)"}}/>
              <line x1="21" y1="12" x2="9" y2="12" style={{color: "var(--danger)"}}/>
            </svg>
            {!collapsed && <span className="link ms-2" style={{color: "var(--danger)"}}>Logout</span>}
          </Nav.Link>
        </Nav>
      </div>
    </div>
  );
}