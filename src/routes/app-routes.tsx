import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from '../pages/auth/login';
import DashboardPage from '../pages/dashboard/DashboardPage';
import CustomerManagementPage from '../pages/customers';
import CreateCustomerPage from '../pages/customers/create';
import EmployeeManagementPage from '../pages/employees';
import CreateEmployeePage from '../pages/employees/create';
import JobManagementPage from '../pages/jobs';
import CreateJobPage from '../pages/jobs/create';
import InvoiceManagementPage from '../pages/invoices';

const AppRoutes: React.FC = () => {
  // const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const isAuthenticated = true; // For now, assuming all routes are accessible as auth is not fully implemented

  return (
    <Routes>
      {/* Public route for Login */}
      <Route
        path="/login"
        element={<Login />}
        // element={
        //   isAuthenticated ? (
        //     <Navigate to="/dashboard" replace />
        //   ) : (
        //     <Login />
        //   )
        // }
      />

      {/* Protected route for Dashboard */}
      <Route
        path="/dashboard"
        element={
          isAuthenticated ? (
            <DashboardPage />
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />

      {/* Protected route for Customer Management */}
      <Route
        path="/customers"
        element={
          isAuthenticated ? (
            <CustomerManagementPage />
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />

      {/* Protected route for Create Customer */}
      <Route
        path="/customers/create"
        element={
          isAuthenticated ? (
            <CreateCustomerPage />
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />

      {/* Protected route for Employee Management */}
      <Route
        path="/employees"
        element={
          isAuthenticated ? (
            <EmployeeManagementPage />
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />

      {/* Protected route for Create Employee */}
      <Route
        path="/employees/create"
        element={
          isAuthenticated ? (
            <CreateEmployeePage />
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />
      {/* Protected route for Job Management */}
      <Route
        path="/jobs"
        element={
          isAuthenticated ? (
            <JobManagementPage />
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />

      {/* Protected route for Create Job */}
      <Route
        path="/jobs/create"
        element={
          isAuthenticated ? (
            <CreateJobPage />
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />
      {/* Protected route for Invoice */}
      <Route
        path="/invoices"
        element={
          isAuthenticated ? (
            <InvoiceManagementPage />
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />

      {/* Redirect root to dashboard if authenticated, otherwise to login */}
      <Route
        path="/"
        element={<Login />}
        // element={
        //   isAuthenticated ? (
        //     <Navigate to="/dashboard" replace />
        //   ) : (
        //     <Navigate to="/login" replace />
        //   )
        // }
      />

      {/* Catch-all route for 404 */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
};

export default AppRoutes;
