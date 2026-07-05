import { Routes, Route } from 'react-router-dom';
import Layout from '../layouts/Layout';
import ProtectedLayout from '../layouts/ProtectedLayout';
import Home from '../pages/Home';
import Login from '../pages/Login';
import Register from '../pages/Register';
import Dashboard from '../pages/Dashboard';
import Profile from '../pages/Profile';
import Insights from '../pages/Insights';
import Calendar from '../pages/Calendar';
import Luna from '../pages/Luna';
import Resources from '../pages/Resources';
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

      {/* Protected Routes (JWT-Ready Structure) */}
      <Route element={<ProtectedLayout />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/insights" element={<Insights />} />
        <Route path="/calendar" element={<Calendar />} />
        <Route path="/luna" element={<Luna />} />
        <Route path="/resources" element={<Resources />} />
      </Route>

      {/* Fallback Catch-All Route */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;
