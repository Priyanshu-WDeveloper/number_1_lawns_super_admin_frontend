import React from 'react';
import { Navigate } from 'react-router-dom';
import { ROLES, ROUTES } from '@/constants';
import { useSelector } from 'react-redux';
import type { RootState } from '@/store';

interface PublicRouteProps {
  children: React.ReactNode;
  redirectTo?: string;
}

export function PublicRoute({ children }: PublicRouteProps) {
  const token = useSelector((state: RootState) => state.auth.token);
  const user = useSelector((state: RootState) => state.auth.user);
  const role = user?.role;

  if (token) {
    if (role === ROLES.SUPER_ADMIN) {
      return <Navigate to={ROUTES.SUPER_ADMIN_DASHBOARD} replace />;
    }
  }

  return <>{children}</>;
}

interface SuperAdminRouteProps {
  children: React.ReactNode;
  redirectTo?: string;
}

export function SuperAdminRoute({ children }: SuperAdminRouteProps) {
  const token = useSelector((state: RootState) => state.auth.token);
  const user = useSelector((state: RootState) => state.auth.user);
  const role = user?.role;

  if (!token) {
    return <Navigate to={ROUTES.LOGIN} replace />;
  }

  if (role !== ROLES.SUPER_ADMIN) {
    return <Navigate to={ROUTES.SUPER_ADMIN_DASHBOARD} replace />;
  }

  return <>{children}</>;
}
