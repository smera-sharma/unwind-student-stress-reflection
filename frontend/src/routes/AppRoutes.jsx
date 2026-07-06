import React, { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from '../layouts/Layout';
import ProtectedLayout from '../layouts/ProtectedLayout';
import PageLoaderSkeleton from '../components/common/PageLoaderSkeleton';

// Lazy loaded page components
const Home = lazy(() => import('../pages/Home'));
const Login = lazy(() => import('../pages/Login'));
const Register = lazy(() => import('../pages/Register'));
const Dashboard = lazy(() => import('../pages/Dashboard'));
const Profile = lazy(() => import('../pages/Profile'));
const Insights = lazy(() => import('../pages/Insights'));
const Calendar = lazy(() => import('../pages/Calendar'));
const Luna = lazy(() => import('../pages/Luna'));
const Resources = lazy(() => import('../pages/Resources'));
const NotFound = lazy(() => import('../pages/NotFound'));

const AppRoutes = () => {
  return (
    <Suspense fallback={<PageLoaderSkeleton />}>
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
    </Suspense>
  );
};

export default AppRoutes;
