import {
  createApi,
  fetchBaseQuery,
} from '@reduxjs/toolkit/query/react';
import { getDeviceToken, getDeviceType } from '../lib/device';
import { getToken } from '../lib/auth';
import type {
  CustomersResponse,
  GetAdminsParams,
  GetAdminsResponse,
  GetCustomersParams,
} from '../types/api.types';
import { setAuth, clearAuth } from '../store/authSlice';
import { API_ROUTES } from '../constants';
import type { ICustomer } from '../types';

export const api = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_URL,
    prepareHeaders: (headers) => {
      const token = getToken();

      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }

      return headers;
    },
  }),
  tagTypes: [
    'Customers',
    'Employees',
    'Jobs',
    'Invoices',
    'Admins',
    'Billing',
  ],
  endpoints: (builder) => ({
    // Auth endpoints
    login: builder.mutation({
      query: (credentials) => ({
        url: '/admins/login',
        method: 'POST',
        body: {
          ...credentials,
          deviceType: getDeviceType(),
          deviceToken: getDeviceToken(),
        },
      }),
      async onQueryStarted(_, { queryFulfilled, dispatch }) {
        try {
          const { data } = await queryFulfilled;
          if (data?.user) {
            dispatch(
              setAuth({
                user: data.user,
                token: data.token,
                rememberMe: true,
              }),
            );
          }
        } catch {
          /* handled by caller */
        }
      },
    }),
    superLogin: builder.mutation({
      query: (credentials) => ({
        url: '/superadmins/login',
        method: 'POST',
        body: {
          ...credentials,
          deviceType: getDeviceType(),
          deviceToken: getDeviceToken(),
        },
      }),
      async onQueryStarted(_, { queryFulfilled, dispatch }) {
        try {
          const { data } = await queryFulfilled;
          if (data?.user) {
            dispatch(
              setAuth({
                user: data.user,
                token: data.token,
                rememberMe: true,
              }),
            );
          }
        } catch {
          /* handled by caller */
        }
      },
    }),
    logout: builder.mutation<void, void>({
      query: () => ({
        url: '/auth/logout',
        method: 'POST',
      }),

      async onQueryStarted(_, { queryFulfilled, dispatch }) {
        try {
          await queryFulfilled;
        } catch (error) {
          console.error('Logout failed', error);
        } finally {
          localStorage.removeItem('token');
          localStorage.removeItem('role');
          localStorage.removeItem('user');
          dispatch(clearAuth());
          dispatch(api.util.resetApiState());
        }
      },
    }),

    // Customer endpoints
    getCustomers: builder.query<
      CustomersResponse,
      GetCustomersParams
    >({
      query: ({ page = 1, limit = 10, search, status, sort }) => ({
        url: API_ROUTES.ADMINS.CUSTOMERS.LIST,
        params: {
          page,
          limit,
          search,
          status,
          sort,
        },
      }),
      providesTags: ['Customers'],
    }),
    getCustomerById: builder.query<ICustomer, string>({
      query: (id: string) => API_ROUTES.ADMINS.CUSTOMERS.DETAILS(id),
      providesTags: (_result, _error, id) => [
        { type: 'Customers', id },
      ],
    }),
    createCustomer: builder.mutation({
      query: (customer) => ({
        url: API_ROUTES.ADMINS.CUSTOMERS.CREATE,
        method: 'POST',
        body: customer,
      }),
      invalidatesTags: ['Customers'],
    }),
    updateCustomer: builder.mutation({
      query: ({ id, ...customer }) => ({
        url: API_ROUTES.ADMINS.CUSTOMERS.UPDATE(id),
        method: 'PUT',
        body: customer,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'Customers', id },
      ],
    }),
    deleteCustomer: builder.mutation({
      query: (id) => ({
        url: API_ROUTES.ADMINS.CUSTOMERS.DELETE(id),
        method: 'DELETE',
      }),
      invalidatesTags: ['Customers'],
    }),
    toggleCustomerStatus: builder.mutation({
      query: ({ id, status }) => ({
        url: API_ROUTES.ADMINS.CUSTOMERS.STATUS(id),

        method: 'PATCH',

        body: {
          status,
        },
      }),

      invalidatesTags: ['Customers'],
    }),

    // Employee endpoints
    getEmployees: builder.query({
      query: () => '/employees',
      providesTags: ['Employees'],
    }),
    getEmployeeById: builder.query({
      query: (id) => `/employees/${id}`,
      providesTags: (_result, _error, id) => [
        { type: 'Employees', id },
      ],
    }),
    createEmployee: builder.mutation({
      query: (employee) => ({
        url: '/employees',
        method: 'POST',
        body: employee,
      }),
      invalidatesTags: ['Employees'],
    }),
    updateEmployee: builder.mutation({
      query: ({ id, ...employee }) => ({
        url: `/employees/${id}`,
        method: 'PATCH',
        body: employee,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'Employees', id },
      ],
    }),
    deleteEmployee: builder.mutation({
      query: (id) => ({
        url: `/employees/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Employees'],
    }),

    // Job endpoints
    getJobs: builder.query({
      query: () => '/jobs',
      providesTags: ['Jobs'],
    }),
    getJobById: builder.query({
      query: (id) => `/jobs/${id}`,
      providesTags: (_result, _error, id) => [{ type: 'Jobs', id }],
    }),
    createJob: builder.mutation({
      query: (job) => ({
        url: '/jobs',
        method: 'POST',
        body: job,
      }),
      invalidatesTags: ['Jobs'],
    }),
    updateJob: builder.mutation({
      query: ({ id, ...job }) => ({
        url: `/jobs/${id}`,
        method: 'PATCH',
        body: job,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'Jobs', id },
      ],
    }),
    deleteJob: builder.mutation({
      query: (id) => ({
        url: `/jobs/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Jobs'],
    }),

    // Invoice endpoints
    getInvoices: builder.query({
      query: () => '/invoices',
      providesTags: ['Invoices'],
    }),
    getInvoiceById: builder.query({
      query: (id) => `/invoices/${id}`,
      providesTags: (_result, _error, id) => [
        { type: 'Invoices', id },
      ],
    }),
    createInvoice: builder.mutation({
      query: (invoice) => ({
        url: '/invoices',
        method: 'POST',
        body: invoice,
      }),
      invalidatesTags: ['Invoices'],
    }),
    updateInvoice: builder.mutation({
      query: ({ id, ...invoice }) => ({
        url: `/invoices/${id}`,
        method: 'PATCH',
        body: invoice,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'Invoices', id },
      ],
    }),
    deleteInvoice: builder.mutation({
      query: (id) => ({
        url: `/invoices/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Invoices'],
    }),

    // Super Admin - Admin Users endpoints
    getAdminUsers: builder.query<GetAdminsResponse, GetAdminsParams>({
      query: ({ page = 1, limit = 10, search, status, sort }) => ({
        url: '/superadmins/admins',

        params: {
          page,
          limit,
          search,
          status,
          sort,
        },
      }),

      providesTags: ['Admins'],
    }),
    getAdminUserById: builder.query({
      query: (id) => `/superadmins/edit-admin/${id}`,
      providesTags: (_result, _error, id) => [{ type: 'Admins', id }],
    }),
    createAdminUser: builder.mutation({
      query: (admin) => ({
        url: '/superadmins/add-admin',
        method: 'POST',
        body: admin,
      }),
      invalidatesTags: ['Admins'],
    }),
    updateAdminUser: builder.mutation({
      query: ({ id, ...admin }) => ({
        url: `/superadmins/edit-admin/${id}`,
        method: 'PUT',
        body: admin,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        'Admins',
        { type: 'Admins', id },
      ],
    }),
    deleteAdminUser: builder.mutation({
      query: (id) => ({
        url: `/super-admin/admins/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Admins'],
    }),

    // Super Admin - Billing endpoints
    getBillingStats: builder.query({
      query: () => '/super-admin/billing/stats',
      providesTags: ['Billing'],
    }),
    getBillingInvoices: builder.query({
      query: () => '/super-admin/billing/invoices',
      providesTags: ['Billing'],
    }),
  }),
});

export const {
  useLoginMutation,
  useSuperLoginMutation,
  useLogoutMutation,

  useGetCustomersQuery,
  useGetCustomerByIdQuery,
  useCreateCustomerMutation,
  useUpdateCustomerMutation,
  useDeleteCustomerMutation,
  useToggleCustomerStatusMutation,

  useGetEmployeesQuery,
  useGetEmployeeByIdQuery,
  useCreateEmployeeMutation,
  useUpdateEmployeeMutation,
  useDeleteEmployeeMutation,
  useGetJobsQuery,
  useGetJobByIdQuery,
  useCreateJobMutation,
  useUpdateJobMutation,
  useDeleteJobMutation,
  useGetInvoicesQuery,
  useGetInvoiceByIdQuery,
  useCreateInvoiceMutation,
  useUpdateInvoiceMutation,
  useDeleteInvoiceMutation,
  useGetAdminUsersQuery,
  useGetAdminUserByIdQuery,
  useCreateAdminUserMutation,
  useUpdateAdminUserMutation,
  useDeleteAdminUserMutation,
  useGetBillingStatsQuery,
  useGetBillingInvoicesQuery,
} = api;
