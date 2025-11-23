import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import "./App.css"
import LoginPage from "./pages/auth/LoginPage"
import SigninPage from "./pages/auth/SigninPage"
import EngineerPage from "./pages/area/EngineerPage" 
import MechanicalPage from "./pages/area/MechanicalPage"

import EngineerDashboard from "./pages/area/engineer/EngineerDashboard";
import EngineerWarehouse from "./pages/area/engineer/EngineerWarehouse";
import EngineerMovements from "./pages/area/engineer/EngineerMovements";
import EngineerUsers from "./pages/area/engineer/EngineerUsers";
import EngineerProducts from "./pages/area/engineer/EngineerProducts";
import EngineerSettings from "./pages/area/engineer/EngineerSettings";
import EngineerSupport from "./pages/area/engineer/EngineerSupport";
import EngineerNotifications from "./pages/area/engineer/EngineerNotifications";
import EngineerMe from "./pages/area/engineer/EngineerMe";

import NotFound from './pages/NotFound';
import { useState } from "react"

export default function App() {
  
  const [userRole, setUserRole] = useState(null);
  const handleLoginSuccess = (role) => { setUserRole(role); };

  return (
    <BrowserRouter>
        <Routes>
          <Route path="/" element={ !userRole ? <Navigate to="login" replace /> : userRole === 'ENGINEER' ? <Navigate to="/engineer" replace /> : <Navigate to="/mechanical" replace /> } /> {/* Pagina iniziale reindirizza in base al ruolo */}
          <Route path="/login" element={ !userRole ? <LoginPage onLoginSuccess={handleLoginSuccess} /> : userRole === 'ENGINEER' ? <Navigate to="/engineer" replace /> : <Navigate to="/mechanical" replace /> } /> {/* Pagina di login */}
          <Route path="/signin" element={<SigninPage />} /> {/* Pagina di registrazione */}
          
          <Route path="/engineer"  element={ userRole === 'ENGINEER' ? <EngineerPage />  : <Navigate to="/login" replace /> }> {/* accedo all'area riservata all'ingegnere se il ruolo è ENGINEER */}
              {/* Route predefinita: dashboard */}
              <Route index element={<EngineerDashboard />} />
              <Route path="warehouse" element={<EngineerWarehouse />} />
              <Route path="movements" element={<EngineerMovements />} />
              <Route path="users" element={<EngineerUsers />} />
              <Route path="products" element={<EngineerProducts />} />
              <Route path="settings" element={<EngineerSettings />} />
              <Route path="support" element={<EngineerSupport />} />
              <Route path="notifications" element={<EngineerNotifications />} />
              <Route path="me" element={ <EngineerMe />} />
          </Route>

          <Route path="/mechanical" element={ userRole === 'MECHANICAL' ? <MechanicalPage /> : <Navigate to="/login" replace /> } /> {/* accedo all'area riservata al meccanico SOLO se il ruolo è MECHANICAL */}
          <Route path='*' element={<NotFound />} /> {/* Pagina 404 per rotte non trovate */}
        </Routes>
    </BrowserRouter>
  )
}