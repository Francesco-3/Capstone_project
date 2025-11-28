import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import "./App.css"
import LoginPage from "./pages/auth/LoginPage"
import SigninPage from "./pages/auth/SigninPage"
import EngineerPage from "./pages/area/EngineerPage" 
import MechanicalPage from "./pages/area/MechanicalPage"

import EngineerDashboard from "./pages/area/engineer/EngineerDashboard";
import EngineerWarehouse from "./pages/area/engineer/EngineerWarehouse";
import SectionA2 from "./pages/area/engineer/SectionA2";
import SectionB2 from "./pages/area/engineer/SectionB2";
import SectionC2 from "./pages/area/engineer/SectionC2";
import SectionD2 from "./pages/area/engineer/SectionD2";
import EngineerMovements from "./pages/area/engineer/EngineerMovements";
import EngineerUsers from "./pages/area/engineer/EngineerUsers";
import EngineerProducts from "./pages/area/engineer/EngineerProducts";
import EngineerSupport from "./pages/area/engineer/EngineerSupport";
import EngineerMe from "./pages/area/engineer/EngineerMe";

import MechanicalMe from "./pages/area/mechanical/MechanicalMe";
import SectionA from "./pages/area/mechanical/SectionA";
import SectionB from "./pages/area/mechanical/SectionB";
import SectionC from "./pages/area/mechanical/SectionC";
import SectionD from "./pages/area/mechanical/SectionD";

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
          
<Route path="/engineer" element={ userRole === 'ENGINEER' ? <EngineerPage /> : <Navigate to="/login" replace /> }>
  {/* Dashboard */}
  <Route index element={<EngineerDashboard />} />

  {/* Warehouse con sezioni nidificate */}
  <Route path="warehouse" element={<EngineerWarehouse />}>
    <Route index element={<SectionA2 />} />      {/* default se vuoi */}
    <Route path="section-A" element={<SectionA2 />} />
    <Route path="section-B" element={<SectionB2 />} />
    <Route path="section-C" element={<SectionC2 />} />
    <Route path="section-D" element={<SectionD2 />} />
  </Route>

  <Route path="movements" element={<EngineerMovements />} />
  <Route path="users" element={<EngineerUsers />} />
  <Route path="products" element={<EngineerProducts />} />
  <Route path="support" element={<EngineerSupport />} />
  <Route path="me" element={<EngineerMe />} />
</Route>


          <Route path="/mechanical" element={ userRole === 'MECHANICAL' ? <MechanicalPage /> : <Navigate to="/login" replace /> }> {/* accedo all'area riservata al meccanico SOLO se il ruolo è MECHANICAL */}
              <Route path="me" element={ <MechanicalMe />} />
              <Route path="section-A" element={ <SectionA />} />
              <Route path="section-B" element={ <SectionB />} />
              <Route path="section-C" element={ <SectionC />} />
              <Route path="section-D" element={ <SectionD />} />
          </Route>

          <Route path='*' element={<NotFound />} /> {/* Pagina 404 per rotte non trovate */}
        </Routes>
    </BrowserRouter>
  )
}