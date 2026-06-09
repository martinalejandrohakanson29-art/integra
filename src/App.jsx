import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import AgendaPage from './pages/AgendaPage';
import PatientListPage from './pages/PatientListPage';
import NewPatientPage from './pages/NewPatientPage';
import EditPatientPage from './pages/EditPatientPage';
import PatientHistoryPage from './pages/PatientHistoryPage';

// NUEVAS PÁGINAS DE PROFESIONALES
import ProfessionalListPage from './pages/ProfessionalListPage';
import NewProfessionalPage from './pages/NewProfessionalPage';
import EditProfessionalPage from './pages/EditProfessionalPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/agenda" element={<AgendaPage />} />
        
        <Route path="/pacientes" element={<PatientListPage />} />
        <Route path="/nuevo-paciente" element={<NewPatientPage />} />
        <Route path="/pacientes/:id/editar" element={<EditPatientPage />} />
        
        {/* /historia-clinica se unificó en /pacientes: redirigimos por si quedó algún enlace guardado */}
        <Route path="/historia-clinica" element={<Navigate to="/pacientes" replace />} />
        <Route path="/pacientes/:id/historia" element={<PatientHistoryPage />} />

        {/* RUTAS DE PROFESIONALES */}
        <Route path="/profesionales" element={<ProfessionalListPage />} />
        <Route path="/nuevo-profesional" element={<NewProfessionalPage />} />
        <Route path="/profesionales/:id/editar" element={<EditProfessionalPage />} />

        <Route path="/" element={<Navigate to="/agenda" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
