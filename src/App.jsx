import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import AgendaPage from './pages/AgendaPage';
import PatientListPage from './pages/PatientListPage';
import NewPatientPage from './pages/NewPatientPage';
import PatientHistoryPage from './pages/PatientHistoryPage';
import EditAppointmentPage from './pages/EditAppointmentPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/agenda" element={<AgendaPage />} />
        <Route path="/pacientes" element={<PatientListPage />} />
        <Route path="/nuevo-paciente" element={<NewPatientPage />} />
        <Route path="/historia-clinica" element={<PatientHistoryPage />} />
        <Route path="/editar-turno" element={<EditAppointmentPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
