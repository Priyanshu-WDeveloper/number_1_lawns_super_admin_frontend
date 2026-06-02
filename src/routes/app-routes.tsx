import React, { Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import {
  PublicRoute,
  SuperAdminRoute,
} from '@/components/route-guards';
import { ROUTES } from '@/constants';
import Loader from '@/components/loader';
import NewLawnsRoutes from './new-lawns-routes';

const Login = React.lazy(() => import('../pages/auth/login'));
const ForgotPassword = React.lazy(
  () => import('../pages/auth/forgot-password'),
);
const SuperAdminProfilePage = React.lazy(
  () => import('../pages/super-admin/profile'),
);
const SuperAdminDashboardPage = React.lazy(
  () => import('../pages/super-admin/dashboard'),
);
const SuperAdminBillingPage = React.lazy(
  () => import('../pages/super-admin/billing'),
);
const NotificationsPage = React.lazy(
  () => import('../pages/notification'),
);
const SuperAdminAdminsPage = React.lazy(
  () => import('../pages/super-admin/admin'),
);
const AdminCreatePage = React.lazy(
  () => import('../pages/super-admin/admin/create'),
);
const AdminViewPage = React.lazy(
  () => import('../pages/super-admin/admin/view'),
);
const AdminEditPage = React.lazy(
  () => import('../pages/super-admin/admin/edit'),
);
const NotFoundPage = React.lazy(() => import('../pages/not-found'));

const AppRoutes = () => {
  return (
    <Suspense fallback={<Loader />}>
      <Routes>
        {/* Public Routes */}
        <Route
          path={ROUTES.LOGIN}
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />
        <Route
          path={ROUTES.FORGOT_PASSWORD}
          element={
            <PublicRoute>
              <ForgotPassword />
            </PublicRoute>
          }
        />

        {/* Super Admin Protected Routes */}
        <Route
          path={ROUTES.SUPER_ADMIN_DASHBOARD}
          element={
            <SuperAdminRoute>
              <SuperAdminDashboardPage />
            </SuperAdminRoute>
          }
        />
        <Route
          path={ROUTES.SUPER_ADMIN_PROFILE}
          element={
            <SuperAdminRoute>
              <SuperAdminProfilePage />
            </SuperAdminRoute>
          }
        />
        <Route
          path={ROUTES.SUPER_ADMIN_ADMINS}
          element={
            <SuperAdminRoute>
              <SuperAdminAdminsPage />
            </SuperAdminRoute>
          }
        />
        <Route
          path={ROUTES.ADMIN_CREATE}
          element={
            <SuperAdminRoute>
              <AdminCreatePage />
            </SuperAdminRoute>
          }
        />
        <Route
          path={ROUTES.ADMIN_VIEW}
          element={
            <SuperAdminRoute>
              <AdminViewPage />
            </SuperAdminRoute>
          }
        />
        <Route
          path={ROUTES.ADMIN_EDIT}
          element={
            <SuperAdminRoute>
              <AdminEditPage />
            </SuperAdminRoute>
          }
        />
        <Route
          path={ROUTES.SUPER_ADMIN_BILLING}
          element={
            <SuperAdminRoute>
              <SuperAdminBillingPage />
            </SuperAdminRoute>
          }
        />
        <Route
          path={ROUTES.SUPER_ADMIN_NOTIFICATIONS}
          element={
            <SuperAdminRoute>
              <NotificationsPage />
            </SuperAdminRoute>
          }
        />

        <Route path="/super-admin/new-lawns/*" element={<NewLawnsRoutes />} />

        {/* Root and Catch-all */}
        <Route
          path="/"
          element={<Navigate to={ROUTES.LOGIN} replace />}
        />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Suspense>
  );
};

export default AppRoutes;
