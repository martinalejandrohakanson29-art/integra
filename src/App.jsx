import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import AgendaPage from './pages/AgendaPage';
import PatientListPage from './pages/PatientListPage';
import NewPatientPage from './pages/NewPatientPage';
import PatientHistoryListPage from './pages/PatientHistoryListPage';
import PatientHistoryPage from './pages/PatientHistoryPage';
import EditAppointmentPage from './pages/EditAppointmentPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        
        {/* Rutas de la aplicación */}
        <Route path="/agenda" element={<AgendaPage />} />
        <Route path="/pacientes" element={<PatientListPage />} />
        <Route path="/nuevo-paciente" element={<NewPatientPage />} />
        
        {/* Nueva ruta para el buscador general de historias */}
        <Route path="/historia-clinica" element={<PatientHistoryListPage />} />
        
        {/* Ruta para la ficha específica de un paciente */}
        <Route path="/pacientes/:id/historia" element={<PatientHistoryPage />} />
        
        <Route path="/editar-turno" element={<EditAppointmentPage />} />
        
        <Route path="/" element={<Navigate to="/agenda" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
