import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import "./App.css"
import LoginPage from "./pages/auth/LoginPage"
import SigninPage from "./pages/auth/SigninPage"
import EngineerPage from "./pages/area/EngineerPage" 
import MechanicalPage from "./pages/area/MechanicalPage"
import NotFound from './pages/NotFound';
import { useState } from "react"

export default function App() {
  
  const [userRole, setUserRole] = useState(null);
  const handleLoginSuccess = (role) => { setUserRole(role); };

  return (
    <BrowserRouter>
      <main className="container">
        <Routes>
          <Route path="/" element={ !userRole ? <Navigate to="login" replace /> : userRole === 'ENGINEER' ? <Navigate to="/engineer" replace /> : <Navigate to="/mechanical" replace /> } /> {/* Pagina iniziale reindirizza in base al ruolo */}
          <Route path="/login" element={ !userRole ? <LoginPage onLoginSuccess={handleLoginSuccess} /> : userRole === 'ENGINEER' ? <Navigate to="/engineer" replace /> : <Navigate to="/mechanical" replace /> } /> {/* Pagina di login */}
          <Route path="/signin" element={<SigninPage />} /> {/* Pagina di registrazione */}
          <Route path="/engineer"  element={ userRole === 'ENGINEER' ? <EngineerPage />  : <Navigate to="/login" replace /> } /> {/* accedo all'area riservata all'ingegnere se il ruolo è ENGINEER */}
          <Route path="/mechanical" element={ userRole === 'MECHANICAL' ? <MechanicalPage /> : <Navigate to="/login" replace /> } /> {/* accedo all'area riservata al meccanico SOLO se il ruolo è MECHANICAL */}
          <Route path='*' element={<NotFound />} /> {/* Pagina 404 per rotte non trovate */}
        </Routes>
      </main>
    </BrowserRouter>
  )
}