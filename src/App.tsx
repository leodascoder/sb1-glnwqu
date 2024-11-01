import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Layout from './components/common/Layout';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import AgentDashboard from './components/agent/AgentDashboard';
import CustomerDashboard from './components/customer/CustomerDashboard';
import BookAppointment from './components/customer/BookAppointment';
import ProtectedRoute from './components/common/ProtectedRoute';
import { useAuth } from './hooks/useAuth';

function App() {
  const { isAuthenticated } = useAuth();

  return (
    <Router>
      <Toaster position="top-right" />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        <Route element={<Layout />}>
          <Route element={<ProtectedRoute isAuthenticated={isAuthenticated} />}>
            <Route path="/agent/dashboard" element={<AgentDashboard />} />
            <Route path="/customer/dashboard" element={<CustomerDashboard />} />
            <Route path="/book-appointment" element={<BookAppointment />} />
          </Route>
        </Route>
      </Routes>
    </Router>
  );
}

export default App;