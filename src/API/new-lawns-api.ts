import {
  createApi,
  type BaseQueryFn,
} from '@reduxjs/toolkit/query/react';
import { mockDb } from '@/data/mock-new-lawns';
import type {
  NewLawnService,
  NewLawnLead,
  NewLawnReview,
  NewLawnFAQ,
  NewLawnArea,
  NewLawnGalleryItem,
  NewLawnPageContent,
  NewLawnContactInfo,
  NewLawnTeamMember,
  NewLawnPromotion,
  NewLawnListResponse,
  NewLawnListParams,
} from '@/types/new-lawns.types';

type MockQueryFn = BaseQueryFn<
  { endpoint: string; method: string; params?: any; body?: any; id?: string },
  unknown,
  { message: string }
>;

const mockBaseQuery: MockQueryFn = async ({ endpoint, method: _method, params, body, id }) => {
  try {
    const db = mockDb as any;
    switch (endpoint) {
      // Services
      case 'getServices': {
        const result = await db.getServices(params);
        return { data: result as NewLawnListResponse<NewLawnService> };
      }
      case 'getServiceById': {
        const result = await db.getServiceById(id);
        if (!result) return { error: { message: 'Not found' } };
        return { data: result as NewLawnService };
      }
      case 'createService': {
        const result = await db.createService(body);
        return { data: result as NewLawnService };
      }
      case 'updateService': {
        const result = await db.updateService(id, body);
        if (!result) return { error: { message: 'Not found' } };
        return { data: result as NewLawnService };
      }
      case 'deleteService': {
        await db.deleteService(id);
        return { data: { success: true } };
      }

      // Leads
      case 'getLeads': {
        const result = await db.getLeads(params);
        return { data: result as NewLawnListResponse<NewLawnLead> };
      }
      case 'getLeadById': {
        const result = await db.getLeadById(id);
        if (!result) return { error: { message: 'Not found' } };
        return { data: result as NewLawnLead };
      }
      case 'createLead': {
        const result = await db.createLead(body);
        return { data: result as NewLawnLead };
      }
      case 'updateLead': {
        const result = await db.updateLead(id, body);
        if (!result) return { error: { message: 'Not found' } };
        return { data: result as NewLawnLead };
      }
      case 'deleteLead': {
        await db.deleteLead(id);
        return { data: { success: true } };
      }

      // Reviews
      case 'getReviews': {
        const result = await db.getReviews(params);
        return { data: result as NewLawnListResponse<NewLawnReview> };
      }
      case 'createReview': {
        const result = await db.createReview(body);
        return { data: result as NewLawnReview };
      }
      case 'updateReview': {
        const result = await db.updateReview(id, body);
        if (!result) return { error: { message: 'Not found' } };
        return { data: result as NewLawnReview };
      }
      case 'deleteReview': {
        await db.deleteReview(id);
        return { data: { success: true } };
      }

      // FAQs
      case 'getFAQs': {
        const result = await db.getFAQs(params);
        return { data: result as NewLawnListResponse<NewLawnFAQ> };
      }
      case 'createFAQ': {
        const result = await db.createFAQ(body);
        return { data: result as NewLawnFAQ };
      }
      case 'updateFAQ': {
        const result = await db.updateFAQ(id, body);
        if (!result) return { error: { message: 'Not found' } };
        return { data: result as NewLawnFAQ };
      }
      case 'deleteFAQ': {
        await db.deleteFAQ(id);
        return { data: { success: true } };
      }

      // Areas
      case 'getAreas': {
        const result = await db.getAreas(params);
        return { data: result as NewLawnListResponse<NewLawnArea> };
      }
      case 'createArea': {
        const result = await db.createArea(body);
        return { data: result as NewLawnArea };
      }
      case 'updateArea': {
        const result = await db.updateArea(id, body);
        if (!result) return { error: { message: 'Not found' } };
        return { data: result as NewLawnArea };
      }
      case 'deleteArea': {
        await db.deleteArea(id);
        return { data: { success: true } };
      }

      // Gallery
      case 'getGallery': {
        const result = await db.getGallery(params);
        return { data: result as NewLawnListResponse<NewLawnGalleryItem> };
      }
      case 'createGalleryItem': {
        const result = await db.createGalleryItem(body);
        return { data: result as NewLawnGalleryItem };
      }
      case 'updateGalleryItem': {
        const result = await db.updateGalleryItem(id, body);
        if (!result) return { error: { message: 'Not found' } };
        return { data: result as NewLawnGalleryItem };
      }
      case 'deleteGalleryItem': {
        await db.deleteGalleryItem(id);
        return { data: { success: true } };
      }

      // Page Content
      case 'getPageContent': {
        const result = await db.getPageContent(params);
        return { data: result as NewLawnListResponse<NewLawnPageContent> };
      }
      case 'getPageContentById': {
        const result = await db.getPageContentById(id);
        if (!result) return { error: { message: 'Not found' } };
        return { data: result as NewLawnPageContent };
      }
      case 'createPageContent': {
        const result = await db.createPageContent(body);
        return { data: result as NewLawnPageContent };
      }
      case 'updatePageContent': {
        const result = await db.updatePageContent(id, body);
        if (!result) return { error: { message: 'Not found' } };
        return { data: result as NewLawnPageContent };
      }
      case 'deletePageContent': {
        await db.deletePageContent(id);
        return { data: { success: true } };
      }

      // Contact Info
      case 'getContactInfo': {
        const result = await db.getContactInfo(params);
        return { data: result as NewLawnListResponse<NewLawnContactInfo> };
      }
      case 'createContactInfo': {
        const result = await db.createContactInfo(body);
        return { data: result as NewLawnContactInfo };
      }
      case 'updateContactInfo': {
        const result = await db.updateContactInfo(id, body);
        if (!result) return { error: { message: 'Not found' } };
        return { data: result as NewLawnContactInfo };
      }
      case 'deleteContactInfo': {
        await db.deleteContactInfo(id);
        return { data: { success: true } };
      }

      // Team Members
      case 'getTeamMembers': {
        const result = await db.getTeamMembers(params);
        return { data: result as NewLawnListResponse<NewLawnTeamMember> };
      }
      case 'getTeamMemberById': {
        const result = await db.getTeamMemberById(id);
        if (!result) return { error: { message: 'Not found' } };
        return { data: result as NewLawnTeamMember };
      }
      case 'createTeamMember': {
        const result = await db.createTeamMember(body);
        return { data: result as NewLawnTeamMember };
      }
      case 'updateTeamMember': {
        const result = await db.updateTeamMember(id, body);
        if (!result) return { error: { message: 'Not found' } };
        return { data: result as NewLawnTeamMember };
      }
      case 'deleteTeamMember': {
        await db.deleteTeamMember(id);
        return { data: { success: true } };
      }

      // Promotions
      case 'getPromotions': {
        const result = await db.getPromotions(params);
        return { data: result as NewLawnListResponse<NewLawnPromotion> };
      }
      case 'getPromotionById': {
        const result = await db.getPromotionById(id);
        if (!result) return { error: { message: 'Not found' } };
        return { data: result as NewLawnPromotion };
      }
      case 'createPromotion': {
        const result = await db.createPromotion(body);
        return { data: result as NewLawnPromotion };
      }
      case 'updatePromotion': {
        const result = await db.updatePromotion(id, body);
        if (!result) return { error: { message: 'Not found' } };
        return { data: result as NewLawnPromotion };
      }
      case 'deletePromotion': {
        await db.deletePromotion(id);
        return { data: { success: true } };
      }

      default:
        return { error: { message: `Unknown endpoint: ${endpoint}` } };
    }
  } catch (e) {
    return { error: { message: String(e) } };
  }
};

export const newLawnsApi = createApi({
  reducerPath: 'newLawnsApi',
  baseQuery: mockBaseQuery,
  tagTypes: ['NL_Services', 'NL_Leads', 'NL_Reviews', 'NL_FAQs', 'NL_Areas', 'NL_Gallery', 'NL_PageContent', 'NL_ContactInfo', 'NL_TeamMembers', 'NL_Promotions'],
  endpoints: (builder) => ({
    // Services
    getNLServices: builder.query<NewLawnListResponse<NewLawnService>, NewLawnListParams>({
      query: (params) => ({ endpoint: 'getServices', method: 'GET', params }),
      providesTags: ['NL_Services'],
    }),
    getNLServiceById: builder.query<NewLawnService, string>({
      query: (id) => ({ endpoint: 'getServiceById', method: 'GET', id }),
      providesTags: (_result, _error, id) => [{ type: 'NL_Services', id }],
    }),
    createNLService: builder.mutation<NewLawnService, Omit<NewLawnService, '_id' | 'createdAt' | 'updatedAt'>>({
      query: (body) => ({ endpoint: 'createService', method: 'POST', body }),
      invalidatesTags: ['NL_Services'],
    }),
    updateNLService: builder.mutation<NewLawnService, { id: string } & Partial<NewLawnService>>({
      query: ({ id, ...body }) => ({ endpoint: 'updateService', method: 'PUT', id, body }),
      invalidatesTags: (_result, _error, { id }) => ['NL_Services', { type: 'NL_Services', id }],
    }),
    deleteNLService: builder.mutation<void, string>({
      query: (id) => ({ endpoint: 'deleteService', method: 'DELETE', id }),
      invalidatesTags: ['NL_Services'],
    }),

    // Leads
    getNLLeads: builder.query<NewLawnListResponse<NewLawnLead>, NewLawnListParams>({
      query: (params) => ({ endpoint: 'getLeads', method: 'GET', params }),
      providesTags: ['NL_Leads'],
    }),
    getNLLeadById: builder.query<NewLawnLead, string>({
      query: (id) => ({ endpoint: 'getLeadById', method: 'GET', id }),
      providesTags: (_result, _error, id) => [{ type: 'NL_Leads', id }],
    }),
    createNLLead: builder.mutation<NewLawnLead, Omit<NewLawnLead, '_id' | 'createdAt' | 'updatedAt'>>({
      query: (body) => ({ endpoint: 'createLead', method: 'POST', body }),
      invalidatesTags: ['NL_Leads'],
    }),
    updateNLLead: builder.mutation<NewLawnLead, { id: string } & Partial<NewLawnLead>>({
      query: ({ id, ...body }) => ({ endpoint: 'updateLead', method: 'PUT', id, body }),
      invalidatesTags: (_result, _error, { id }) => ['NL_Leads', { type: 'NL_Leads', id }],
    }),
    deleteNLLead: builder.mutation<void, string>({
      query: (id) => ({ endpoint: 'deleteLead', method: 'DELETE', id }),
      invalidatesTags: ['NL_Leads'],
    }),

    // Reviews
    getNLReviews: builder.query<NewLawnListResponse<NewLawnReview>, NewLawnListParams>({
      query: (params) => ({ endpoint: 'getReviews', method: 'GET', params }),
      providesTags: ['NL_Reviews'],
    }),
    createNLReview: builder.mutation<NewLawnReview, Omit<NewLawnReview, '_id' | 'createdAt' | 'updatedAt'>>({
      query: (body) => ({ endpoint: 'createReview', method: 'POST', body }),
      invalidatesTags: ['NL_Reviews'],
    }),
    updateNLReview: builder.mutation<NewLawnReview, { id: string } & Partial<NewLawnReview>>({
      query: ({ id, ...body }) => ({ endpoint: 'updateReview', method: 'PUT', id, body }),
      invalidatesTags: (_result, _error, { id }) => ['NL_Reviews', { type: 'NL_Reviews', id }],
    }),
    deleteNLReview: builder.mutation<void, string>({
      query: (id) => ({ endpoint: 'deleteReview', method: 'DELETE', id }),
      invalidatesTags: ['NL_Reviews'],
    }),

    // FAQs
    getNLFAQs: builder.query<NewLawnListResponse<NewLawnFAQ>, NewLawnListParams>({
      query: (params) => ({ endpoint: 'getFAQs', method: 'GET', params }),
      providesTags: ['NL_FAQs'],
    }),
    createNLFAQ: builder.mutation<NewLawnFAQ, Omit<NewLawnFAQ, '_id' | 'createdAt' | 'updatedAt'>>({
      query: (body) => ({ endpoint: 'createFAQ', method: 'POST', body }),
      invalidatesTags: ['NL_FAQs'],
    }),
    updateNLFAQ: builder.mutation<NewLawnFAQ, { id: string } & Partial<NewLawnFAQ>>({
      query: ({ id, ...body }) => ({ endpoint: 'updateFAQ', method: 'PUT', id, body }),
      invalidatesTags: (_result, _error, { id }) => ['NL_FAQs', { type: 'NL_FAQs', id }],
    }),
    deleteNLFAQ: builder.mutation<void, string>({
      query: (id) => ({ endpoint: 'deleteFAQ', method: 'DELETE', id }),
      invalidatesTags: ['NL_FAQs'],
    }),

    // Areas
    getNLAreas: builder.query<NewLawnListResponse<NewLawnArea>, NewLawnListParams>({
      query: (params) => ({ endpoint: 'getAreas', method: 'GET', params }),
      providesTags: ['NL_Areas'],
    }),
    createNLArea: builder.mutation<NewLawnArea, Omit<NewLawnArea, '_id' | 'createdAt' | 'updatedAt'>>({
      query: (body) => ({ endpoint: 'createArea', method: 'POST', body }),
      invalidatesTags: ['NL_Areas'],
    }),
    updateNLArea: builder.mutation<NewLawnArea, { id: string } & Partial<NewLawnArea>>({
      query: ({ id, ...body }) => ({ endpoint: 'updateArea', method: 'PUT', id, body }),
      invalidatesTags: (_result, _error, { id }) => ['NL_Areas', { type: 'NL_Areas', id }],
    }),
    deleteNLArea: builder.mutation<void, string>({
      query: (id) => ({ endpoint: 'deleteArea', method: 'DELETE', id }),
      invalidatesTags: ['NL_Areas'],
    }),

    // Gallery
    getNLGallery: builder.query<NewLawnListResponse<NewLawnGalleryItem>, NewLawnListParams>({
      query: (params) => ({ endpoint: 'getGallery', method: 'GET', params }),
      providesTags: ['NL_Gallery'],
    }),
    createNLGalleryItem: builder.mutation<NewLawnGalleryItem, Omit<NewLawnGalleryItem, '_id' | 'createdAt' | 'updatedAt'>>({
      query: (body) => ({ endpoint: 'createGalleryItem', method: 'POST', body }),
      invalidatesTags: ['NL_Gallery'],
    }),
    updateNLGalleryItem: builder.mutation<NewLawnGalleryItem, { id: string } & Partial<NewLawnGalleryItem>>({
      query: ({ id, ...body }) => ({ endpoint: 'updateGalleryItem', method: 'PUT', id, body }),
      invalidatesTags: (_result, _error, { id }) => ['NL_Gallery', { type: 'NL_Gallery', id }],
    }),
    deleteNLGalleryItem: builder.mutation<void, string>({
      query: (id) => ({ endpoint: 'deleteGalleryItem', method: 'DELETE', id }),
      invalidatesTags: ['NL_Gallery'],
    }),

    // Page Content
    getNLPageContent: builder.query<NewLawnListResponse<NewLawnPageContent>, NewLawnListParams>({
      query: (params) => ({ endpoint: 'getPageContent', method: 'GET', params }),
      providesTags: ['NL_PageContent'],
    }),
    getNLPageContentById: builder.query<NewLawnPageContent, string>({
      query: (id) => ({ endpoint: 'getPageContentById', method: 'GET', id }),
      providesTags: (_result, _error, id) => [{ type: 'NL_PageContent', id }],
    }),
    createNLPageContent: builder.mutation<NewLawnPageContent, Omit<NewLawnPageContent, '_id' | 'createdAt' | 'updatedAt'>>({
      query: (body) => ({ endpoint: 'createPageContent', method: 'POST', body }),
      invalidatesTags: ['NL_PageContent'],
    }),
    updateNLPageContent: builder.mutation<NewLawnPageContent, { id: string } & Partial<NewLawnPageContent>>({
      query: ({ id, ...body }) => ({ endpoint: 'updatePageContent', method: 'PUT', id, body }),
      invalidatesTags: (_result, _error, { id }) => ['NL_PageContent', { type: 'NL_PageContent', id }],
    }),
    deleteNLPageContent: builder.mutation<void, string>({
      query: (id) => ({ endpoint: 'deletePageContent', method: 'DELETE', id }),
      invalidatesTags: ['NL_PageContent'],
    }),

    // Contact Info
    getNLContactInfo: builder.query<NewLawnListResponse<NewLawnContactInfo>, NewLawnListParams>({
      query: (params) => ({ endpoint: 'getContactInfo', method: 'GET', params }),
      providesTags: ['NL_ContactInfo'],
    }),
    createNLContactInfo: builder.mutation<NewLawnContactInfo, Omit<NewLawnContactInfo, '_id' | 'createdAt' | 'updatedAt'>>({
      query: (body) => ({ endpoint: 'createContactInfo', method: 'POST', body }),
      invalidatesTags: ['NL_ContactInfo'],
    }),
    updateNLContactInfo: builder.mutation<NewLawnContactInfo, { id: string } & Partial<NewLawnContactInfo>>({
      query: ({ id, ...body }) => ({ endpoint: 'updateContactInfo', method: 'PUT', id, body }),
      invalidatesTags: (_result, _error, { id }) => ['NL_ContactInfo', { type: 'NL_ContactInfo', id }],
    }),
    deleteNLContactInfo: builder.mutation<void, string>({
      query: (id) => ({ endpoint: 'deleteContactInfo', method: 'DELETE', id }),
      invalidatesTags: ['NL_ContactInfo'],
    }),

    // Team Members
    getNLTeamMembers: builder.query<NewLawnListResponse<NewLawnTeamMember>, NewLawnListParams>({
      query: (params) => ({ endpoint: 'getTeamMembers', method: 'GET', params }),
      providesTags: ['NL_TeamMembers'],
    }),
    getNLTeamMemberById: builder.query<NewLawnTeamMember, string>({
      query: (id) => ({ endpoint: 'getTeamMemberById', method: 'GET', id }),
      providesTags: (_result, _error, id) => [{ type: 'NL_TeamMembers', id }],
    }),
    createNLTeamMember: builder.mutation<NewLawnTeamMember, Omit<NewLawnTeamMember, '_id' | 'createdAt' | 'updatedAt'>>({
      query: (body) => ({ endpoint: 'createTeamMember', method: 'POST', body }),
      invalidatesTags: ['NL_TeamMembers'],
    }),
    updateNLTeamMember: builder.mutation<NewLawnTeamMember, { id: string } & Partial<NewLawnTeamMember>>({
      query: ({ id, ...body }) => ({ endpoint: 'updateTeamMember', method: 'PUT', id, body }),
      invalidatesTags: (_result, _error, { id }) => ['NL_TeamMembers', { type: 'NL_TeamMembers', id }],
    }),
    deleteNLTeamMember: builder.mutation<void, string>({
      query: (id) => ({ endpoint: 'deleteTeamMember', method: 'DELETE', id }),
      invalidatesTags: ['NL_TeamMembers'],
    }),

    // Promotions
    getNLPromotions: builder.query<NewLawnListResponse<NewLawnPromotion>, NewLawnListParams>({
      query: (params) => ({ endpoint: 'getPromotions', method: 'GET', params }),
      providesTags: ['NL_Promotions'],
    }),
    getNLPromotionById: builder.query<NewLawnPromotion, string>({
      query: (id) => ({ endpoint: 'getPromotionById', method: 'GET', id }),
      providesTags: (_result, _error, id) => [{ type: 'NL_Promotions', id }],
    }),
    createNLPromotion: builder.mutation<NewLawnPromotion, Omit<NewLawnPromotion, '_id' | 'createdAt' | 'updatedAt'>>({
      query: (body) => ({ endpoint: 'createPromotion', method: 'POST', body }),
      invalidatesTags: ['NL_Promotions'],
    }),
    updateNLPromotion: builder.mutation<NewLawnPromotion, { id: string } & Partial<NewLawnPromotion>>({
      query: ({ id, ...body }) => ({ endpoint: 'updatePromotion', method: 'PUT', id, body }),
      invalidatesTags: (_result, _error, { id }) => ['NL_Promotions', { type: 'NL_Promotions', id }],
    }),
    deleteNLPromotion: builder.mutation<void, string>({
      query: (id) => ({ endpoint: 'deletePromotion', method: 'DELETE', id }),
      invalidatesTags: ['NL_Promotions'],
    }),
  }),
});

export const {
  useGetNLServicesQuery,
  useGetNLServiceByIdQuery,
  useCreateNLServiceMutation,
  useUpdateNLServiceMutation,
  useDeleteNLServiceMutation,
  useGetNLLeadsQuery,
  useGetNLLeadByIdQuery,
  useCreateNLLeadMutation,
  useUpdateNLLeadMutation,
  useDeleteNLLeadMutation,
  useGetNLReviewsQuery,
  useCreateNLReviewMutation,
  useUpdateNLReviewMutation,
  useDeleteNLReviewMutation,
  useGetNLFAQsQuery,
  useCreateNLFAQMutation,
  useUpdateNLFAQMutation,
  useDeleteNLFAQMutation,
  useGetNLAreasQuery,
  useCreateNLAreaMutation,
  useUpdateNLAreaMutation,
  useDeleteNLAreaMutation,

  useGetNLGalleryQuery,
  useCreateNLGalleryItemMutation,
  useUpdateNLGalleryItemMutation,
  useDeleteNLGalleryItemMutation,

  useGetNLPageContentQuery,
  useGetNLPageContentByIdQuery,
  useCreateNLPageContentMutation,
  useUpdateNLPageContentMutation,
  useDeleteNLPageContentMutation,

  useGetNLContactInfoQuery,
  useCreateNLContactInfoMutation,
  useUpdateNLContactInfoMutation,
  useDeleteNLContactInfoMutation,

  useGetNLTeamMembersQuery,
  useGetNLTeamMemberByIdQuery,
  useCreateNLTeamMemberMutation,
  useUpdateNLTeamMemberMutation,
  useDeleteNLTeamMemberMutation,

  useGetNLPromotionsQuery,
  useGetNLPromotionByIdQuery,
  useCreateNLPromotionMutation,
  useUpdateNLPromotionMutation,
  useDeleteNLPromotionMutation,
} = newLawnsApi;
