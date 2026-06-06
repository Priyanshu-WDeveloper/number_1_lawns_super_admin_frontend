import {
  createApi,
  fetchBaseQuery,
} from '@reduxjs/toolkit/query/react';
import type {
  NewLawnService,
  NewLawnGalleryItem,
  NewLawnReview,
  ContactInquiry,
  ContactInquiryReply,
  WebsiteConfig,
  NewLawnListResponse,
  NewLawnListParams,
  QuoteRequest,
  QuoteStatus,
} from '@/types/new-lawns.types';
import { getToken } from '@/lib/auth';

const baseQuery = fetchBaseQuery({
  baseUrl: import.meta.env.VITE_API_URL + '/websites',
  prepareHeaders: (headers) => {
    const token = getToken();
    if (token) {
      headers.set('authorization', `Bearer ${token}`);
    }
    return headers;
  },
});

export const newLawnsApi = createApi({
  reducerPath: 'newLawnsApi',
  baseQuery,
  tagTypes: ['NL_Services', 'NL_Gallery', 'NL_Reviews', 'NL_Contacts', 'NL_Quotes', 'NL_WebsiteConfig'],
  endpoints: (builder) => ({
    getNLServices: builder.query<NewLawnListResponse<NewLawnService>, NewLawnListParams>({
      query: (params) => ({ url: '/services', params }),
      transformResponse: (response: any) => ({
        items: response.services,
        total: response.total,
        page: response.page,
        limit: response.limit,
        totalPages: response.totalPages,
      }),
      providesTags: ['NL_Services'],
    }),
    getNLServiceById: builder.query<NewLawnService, string>({
      query: (id) => ({ url: `/services/${id}` }),
      providesTags: (_result, _error, id) => [{ type: 'NL_Services', id }],
    }),
    createNLService: builder.mutation<NewLawnService, { title: string; description: string; image?: string }>({
      query: (body) => ({ url: '/services', method: 'POST', body }),
      invalidatesTags: ['NL_Services'],
    }),
    updateNLService: builder.mutation<NewLawnService, { id: string } & Partial<NewLawnService>>({
      query: ({ id, ...body }) => ({ url: `/services/${id}`, method: 'PUT', body }),
      invalidatesTags: (_result, _error, { id }) => ['NL_Services', { type: 'NL_Services', id }],
    }),
    deleteNLService: builder.mutation<void, string>({
      query: (id) => ({ url: `/services/${id}`, method: 'DELETE' }),
      invalidatesTags: ['NL_Services'],
    }),

    getNLGallery: builder.query<NewLawnListResponse<NewLawnGalleryItem>, NewLawnListParams>({
      query: (params) => ({ url: '/gallery', params }),
      transformResponse: (response: any) => ({
        items: response.galleries,
        total: response.total,
        page: response.page,
        limit: response.limit,
        totalPages: response.totalPages,
      }),
      providesTags: ['NL_Gallery'],
    }),
    createNLGalleryItem: builder.mutation<NewLawnGalleryItem, { image?: string; beforeImage?: string; afterImage?: string; category: string; isBeforeAfter: boolean }>({
      query: (body) => ({ url: '/gallery', method: 'POST', body }),
      invalidatesTags: ['NL_Gallery'],
    }),
    deleteNLGalleryItem: builder.mutation<void, string>({
      query: (id) => ({ url: `/gallery/${id}`, method: 'DELETE' }),
      invalidatesTags: ['NL_Gallery'],
    }),

    getNLReviews: builder.query<NewLawnListResponse<NewLawnReview>, NewLawnListParams>({
      query: (params) => ({ url: '/reviews', params }),
      transformResponse: (response: any) => ({
        items: response.reviews,
        total: response.total,
        page: response.page,
        limit: response.limit,
        totalPages: response.totalPages,
      }),
      providesTags: ['NL_Reviews'],
    }),
    createNLReview: builder.mutation<NewLawnReview, { reviewerName: string; location: string; rating: number; comment: string }>({
      query: (body) => ({ url: '/reviews', method: 'POST', body }),
      invalidatesTags: ['NL_Reviews'],
    }),
    deleteNLReview: builder.mutation<void, string>({
      query: (id) => ({ url: `/reviews/${id}`, method: 'DELETE' }),
      invalidatesTags: ['NL_Reviews'],
    }),

    getNLContacts: builder.query<NewLawnListResponse<ContactInquiry>, NewLawnListParams>({
      query: (params) => ({ url: '/contact-us', params }),
      transformResponse: (response: any) => ({
        items: response.contactUs,
        total: response.total,
        page: response.page,
        limit: response.limit,
        totalPages: response.totalPages,
      }),
      providesTags: ['NL_Contacts'],
    }),
    getNLContactById: builder.query<ContactInquiry, string>({
      query: (id) => ({ url: `/contact-us/${id}` }),
      providesTags: (_result, _error, id) => [{ type: 'NL_Contacts', id }],
    }),
    deleteNLContact: builder.mutation<void, string>({
      query: (id) => ({ url: `/contact-us/${id}`, method: 'DELETE' }),
      invalidatesTags: ['NL_Contacts'],
    }),
    markNLContactAsRead: builder.mutation<void, string>({
      query: (id) => ({ url: `/contact-us/${id}/read`, method: 'PUT' }),
      invalidatesTags: (_result, _error, id) => ['NL_Contacts', { type: 'NL_Contacts', id }],
    }),
    replyToNLContact: builder.mutation<ContactInquiryReply, { id: string; subject: string; message: string }>({
      query: ({ id, ...body }) => ({ url: `/contact-us/${id}/reply`, method: 'POST', body }),
      invalidatesTags: (_result, _error, { id }) => ['NL_Contacts', { type: 'NL_Contacts', id }],
    }),

    getNLQuotes: builder.query<NewLawnListResponse<QuoteRequest>, NewLawnListParams>({
      query: (params) => ({ url: '/quotes', params }),
      transformResponse: (response: any) => ({
        items: response.quotes,
        total: response.total,
        page: response.page,
        limit: response.limit,
        totalPages: response.totalPages,
      }),
      providesTags: ['NL_Quotes'],
    }),
    getNLQuoteById: builder.query<QuoteRequest, string>({
      query: (id) => ({ url: `/quotes/${id}` }),
      providesTags: (_result, _error, id) => [{ type: 'NL_Quotes', id }],
    }),
    updateNLQuoteStatus: builder.mutation<QuoteRequest, { id: string; status: QuoteStatus }>({
      query: ({ id, ...body }) => ({ url: `/quotes/${id}/status`, method: 'PUT', body }),
      invalidatesTags: (_result, _error, { id }) => ['NL_Quotes', { type: 'NL_Quotes', id }],
    }),
    deleteNLQuote: builder.mutation<void, string>({
      query: (id) => ({ url: `/quotes/${id}`, method: 'DELETE' }),
      invalidatesTags: ['NL_Quotes'],
    }),

    getNLWebsiteConfig: builder.query<WebsiteConfig, void>({
      query: () => ({ url: '/config' }),
      transformResponse: (response: any) => response.config,
      providesTags: ['NL_WebsiteConfig'],
    }),
    updateNLWebsiteConfig: builder.mutation<WebsiteConfig, Partial<WebsiteConfig>>({
      query: (body) => ({ url: '/config', method: 'PUT', body }),
      invalidatesTags: ['NL_WebsiteConfig'],
    }),
  }),
});

export const {
  useGetNLServicesQuery,
  useGetNLServiceByIdQuery,
  useCreateNLServiceMutation,
  useUpdateNLServiceMutation,
  useDeleteNLServiceMutation,

  useGetNLGalleryQuery,
  useCreateNLGalleryItemMutation,
  useDeleteNLGalleryItemMutation,

  useGetNLReviewsQuery,
  useCreateNLReviewMutation,
  useDeleteNLReviewMutation,

  useGetNLContactsQuery,
  useGetNLContactByIdQuery,
  useDeleteNLContactMutation,
  useMarkNLContactAsReadMutation,
  useReplyToNLContactMutation,

  useGetNLQuotesQuery,
  useGetNLQuoteByIdQuery,
  useUpdateNLQuoteStatusMutation,
  useDeleteNLQuoteMutation,

  useGetNLWebsiteConfigQuery,
  useUpdateNLWebsiteConfigMutation,
} = newLawnsApi;
