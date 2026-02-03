import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from './components/MainLayout';
import LoginPage from './pages/LoginPage';
import AgendaPage from './pages/AgendaPage';
import PatientListPage from './pages/PatientListPage';
import NewPatientPage from './pages/NewPatientPage';
import PatientHistoryPage from './pages/PatientHistoryPage';
import EditAppointmentPage from './pages/EditAppointmentPage';

function App() {
  return (
    <Router>
      <Routes>
        {/* Ruta de Login (Sin Sidebar) */}
        <Route path="/login" element={<LoginPage />} />

        {/* Rutas con Sidebar (Dentro de MainLayout) */}
        <Route element={<MainLayout />}>
          <Route path="/agenda" element={<AgendaPage />} />
          <Route path="/pacientes" element={<PatientListPage />} />
          <Route path="/pacientes/nuevo" element={<NewPatientPage />} />
          <Route path="/pacientes/:id/historia" element={<PatientHistoryPage />} />
          <Route path="/turnos/:id/editar" element={<EditAppointmentPage />} />
          
          {/* Redirección por defecto */}
          <Route path="/" element={<Navigate to="/agenda" replace />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
