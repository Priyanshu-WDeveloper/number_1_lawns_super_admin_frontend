import React, { Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import { SuperAdminRoute } from '@/components/route-guards';
import Loader from '@/components/loader';

const NLServicesPage = React.lazy(() => import('../pages/new-lawns/services'));
const NLCreateServicePage = React.lazy(() => import('../pages/new-lawns/services/create'));
const NLEditServicePage = React.lazy(() => import('../pages/new-lawns/services/edit'));
const NLViewServicePage = React.lazy(() => import('../pages/new-lawns/services/view'));

const NLReviewsPage = React.lazy(() => import('../pages/new-lawns/reviews'));
const NLCreateReviewPage = React.lazy(() => import('../pages/new-lawns/reviews/create'));

const NLGalleryPage = React.lazy(() => import('../pages/new-lawns/gallery'));
const NLCreateGalleryPage = React.lazy(() => import('../pages/new-lawns/gallery/create'));

const NLContactUsPage = React.lazy(() => import('../pages/new-lawns/contact-us'));
const NLContactUsViewPage = React.lazy(() => import('../pages/new-lawns/contact-us/view'));

const NLWebsiteConfigPage = React.lazy(() => import('../pages/new-lawns/website-config'));

const NewLawnsRoutes = () => (
  <Suspense fallback={<Loader />}>
    <Routes>
      <Route index element={<SuperAdminRoute><NLServicesPage /></SuperAdminRoute>} />
      <Route path="services" element={<SuperAdminRoute><NLServicesPage /></SuperAdminRoute>} />
      <Route path="services/create" element={<SuperAdminRoute><NLCreateServicePage /></SuperAdminRoute>} />
      <Route path="services/:id/edit" element={<SuperAdminRoute><NLEditServicePage /></SuperAdminRoute>} />
      <Route path="services/:id" element={<SuperAdminRoute><NLViewServicePage /></SuperAdminRoute>} />

      <Route path="reviews" element={<SuperAdminRoute><NLReviewsPage /></SuperAdminRoute>} />
      <Route path="reviews/create" element={<SuperAdminRoute><NLCreateReviewPage /></SuperAdminRoute>} />

      <Route path="gallery" element={<SuperAdminRoute><NLGalleryPage /></SuperAdminRoute>} />
      <Route path="gallery/create" element={<SuperAdminRoute><NLCreateGalleryPage /></SuperAdminRoute>} />

      <Route path="contacts" element={<SuperAdminRoute><NLContactUsPage /></SuperAdminRoute>} />
      <Route path="contacts/:id" element={<SuperAdminRoute><NLContactUsViewPage /></SuperAdminRoute>} />

      <Route path="website-config" element={<SuperAdminRoute><NLWebsiteConfigPage /></SuperAdminRoute>} />
    </Routes>
  </Suspense>
);

export default NewLawnsRoutes;
