import React, { Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import { SuperAdminRoute } from '@/components/route-guards';
import Loader from '@/components/loader';

const NLServicesPage = React.lazy(() => import('../pages/new-lawns/services'));
const NLCreateServicePage = React.lazy(() => import('../pages/new-lawns/services/create'));
const NLEditServicePage = React.lazy(() => import('../pages/new-lawns/services/edit'));
const NLViewServicePage = React.lazy(() => import('../pages/new-lawns/services/view'));

const NLLeadsPage = React.lazy(() => import('../pages/new-lawns/leads'));
const NLViewLeadPage = React.lazy(() => import('../pages/new-lawns/leads/view'));

const NLReviewsPage = React.lazy(() => import('../pages/new-lawns/reviews'));
const NLCreateReviewPage = React.lazy(() => import('../pages/new-lawns/reviews/create'));

const NLFaqsPage = React.lazy(() => import('../pages/new-lawns/faqs'));
const NLCreateFaqPage = React.lazy(() => import('../pages/new-lawns/faqs/create'));
const NLEditFaqPage = React.lazy(() => import('../pages/new-lawns/faqs/edit'));

const NLAreasPage = React.lazy(() => import('../pages/new-lawns/areas'));
const NLCreateAreaPage = React.lazy(() => import('../pages/new-lawns/areas/create'));
const NLEditAreaPage = React.lazy(() => import('../pages/new-lawns/areas/edit'));

const NLGalleryPage = React.lazy(() => import('../pages/new-lawns/gallery'));
const NLCreateGalleryPage = React.lazy(() => import('../pages/new-lawns/gallery/create'));
const NLEditGalleryPage = React.lazy(() => import('../pages/new-lawns/gallery/edit'));

const NLPageContentPage = React.lazy(() => import('../pages/new-lawns/page-content'));
const NLCreatePageContentPage = React.lazy(() => import('../pages/new-lawns/page-content/create'));
const NLViewPageContentPage = React.lazy(() => import('../pages/new-lawns/page-content/view'));
const NLEditPageContentPage = React.lazy(() => import('../pages/new-lawns/page-content/edit'));

const NLContactInfoPage = React.lazy(() => import('../pages/new-lawns/contact-info'));
const NLCreateContactInfoPage = React.lazy(() => import('../pages/new-lawns/contact-info/create'));
const NLEditContactInfoPage = React.lazy(() => import('../pages/new-lawns/contact-info/edit'));

const NLTeamPage = React.lazy(() => import('../pages/new-lawns/team'));
const NLCreateTeamPage = React.lazy(() => import('../pages/new-lawns/team/create'));
const NLEditTeamPage = React.lazy(() => import('../pages/new-lawns/team/edit'));

const NLPromotionsPage = React.lazy(() => import('../pages/new-lawns/promotions'));
const NLCreatePromotionPage = React.lazy(() => import('../pages/new-lawns/promotions/create'));
const NLEditPromotionPage = React.lazy(() => import('../pages/new-lawns/promotions/edit'));

const NLStatsPage = React.lazy(() => import('../pages/new-lawns/stats'));

const NewLawnsRoutes = () => (
  <Suspense fallback={<Loader />}>
    <Routes>
      <Route path="services" element={<SuperAdminRoute><NLServicesPage /></SuperAdminRoute>} />
      <Route path="services/create" element={<SuperAdminRoute><NLCreateServicePage /></SuperAdminRoute>} />
      <Route path="services/:id/edit" element={<SuperAdminRoute><NLEditServicePage /></SuperAdminRoute>} />
      <Route path="services/:id" element={<SuperAdminRoute><NLViewServicePage /></SuperAdminRoute>} />

      <Route path="leads" element={<SuperAdminRoute><NLLeadsPage /></SuperAdminRoute>} />
      <Route path="leads/:id" element={<SuperAdminRoute><NLViewLeadPage /></SuperAdminRoute>} />

      <Route path="reviews" element={<SuperAdminRoute><NLReviewsPage /></SuperAdminRoute>} />
      <Route path="reviews/create" element={<SuperAdminRoute><NLCreateReviewPage /></SuperAdminRoute>} />

      <Route path="faqs" element={<SuperAdminRoute><NLFaqsPage /></SuperAdminRoute>} />
      <Route path="faqs/create" element={<SuperAdminRoute><NLCreateFaqPage /></SuperAdminRoute>} />
      <Route path="faqs/:id/edit" element={<SuperAdminRoute><NLEditFaqPage /></SuperAdminRoute>} />

      <Route path="areas" element={<SuperAdminRoute><NLAreasPage /></SuperAdminRoute>} />
      <Route path="areas/create" element={<SuperAdminRoute><NLCreateAreaPage /></SuperAdminRoute>} />
      <Route path="areas/:id/edit" element={<SuperAdminRoute><NLEditAreaPage /></SuperAdminRoute>} />

      <Route path="gallery" element={<SuperAdminRoute><NLGalleryPage /></SuperAdminRoute>} />
      <Route path="gallery/create" element={<SuperAdminRoute><NLCreateGalleryPage /></SuperAdminRoute>} />
      <Route path="gallery/:id/edit" element={<SuperAdminRoute><NLEditGalleryPage /></SuperAdminRoute>} />

      <Route path="page-content" element={<SuperAdminRoute><NLPageContentPage /></SuperAdminRoute>} />
      <Route path="page-content/create" element={<SuperAdminRoute><NLCreatePageContentPage /></SuperAdminRoute>} />
      <Route path="page-content/:id" element={<SuperAdminRoute><NLViewPageContentPage /></SuperAdminRoute>} />
      <Route path="page-content/:id/edit" element={<SuperAdminRoute><NLEditPageContentPage /></SuperAdminRoute>} />

      <Route path="contact-info" element={<SuperAdminRoute><NLContactInfoPage /></SuperAdminRoute>} />
      <Route path="contact-info/create" element={<SuperAdminRoute><NLCreateContactInfoPage /></SuperAdminRoute>} />
      <Route path="contact-info/:id/edit" element={<SuperAdminRoute><NLEditContactInfoPage /></SuperAdminRoute>} />

      <Route path="team" element={<SuperAdminRoute><NLTeamPage /></SuperAdminRoute>} />
      <Route path="team/create" element={<SuperAdminRoute><NLCreateTeamPage /></SuperAdminRoute>} />
      <Route path="team/:id/edit" element={<SuperAdminRoute><NLEditTeamPage /></SuperAdminRoute>} />

      <Route path="promotions" element={<SuperAdminRoute><NLPromotionsPage /></SuperAdminRoute>} />
      <Route path="promotions/create" element={<SuperAdminRoute><NLCreatePromotionPage /></SuperAdminRoute>} />
      <Route path="promotions/:id/edit" element={<SuperAdminRoute><NLEditPromotionPage /></SuperAdminRoute>} />

      <Route path="stats" element={<SuperAdminRoute><NLStatsPage /></SuperAdminRoute>} />
    </Routes>
  </Suspense>
);

export default NewLawnsRoutes;
