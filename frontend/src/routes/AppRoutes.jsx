import { Routes, Route } from 'react-router-dom';
import Layout from '../layouts/Layout';
import ProtectedLayout from '../layouts/ProtectedLayout';
import Home from '../pages/Home';
import Login from '../pages/Login';
import Register from '../pages/Register';
import NotFound from '../pages/NotFound';

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Route>

      {/* Protected Routes (JWT-Ready Skeleton Structure) */}
      <Route element={<ProtectedLayout />}>
        {/* 
          Placeholder for future sprints:
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/checkins" element={<CheckIns />} />
          <Route path="/calendar" element={<AcademicCalendar />} />
        */}
      </Route>

      {/* Fallback Catch-All Route */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;
