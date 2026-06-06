import { useNavigate } from 'react-router-dom';
import {
  TreePine,
  Star,
  Image,
  MessageSquareText,
  FileText,
  Settings,
  Loader2,
} from 'lucide-react';
import { SuperAdminLayout } from '@/components/layout/super-layout';
import { Navbar } from '@/components/layout/navbar';
import {
  useGetNLServicesQuery,
  useGetNLReviewsQuery,
  useGetNLGalleryQuery,
  useGetNLContactsQuery,
  useGetNLQuotesQuery,
} from '@/API/new-lawns-api';

const sections = [
  {
    title: 'Services',
    icon: TreePine,
    url: '/super-admin/new-lawns/services',
    description: 'Manage lawn care services',
    hook: 'services' as const,
  },
  {
    title: 'Reviews',
    icon: Star,
    url: '/super-admin/new-lawns/reviews',
    description: 'Manage customer reviews',
    hook: 'reviews' as const,
  },
  {
    title: 'Gallery',
    icon: Image,
    url: '/super-admin/new-lawns/gallery',
    description: 'Manage photo gallery',
    hook: 'gallery' as const,
  },
  {
    title: 'Contact Inquiries',
    icon: MessageSquareText,
    url: '/super-admin/new-lawns/contacts',
    description: 'View contact form submissions',
    hook: 'contacts' as const,
  },
  {
    title: 'Quote Requests',
    icon: FileText,
    url: '/super-admin/new-lawns/quotes',
    description: 'View quote requests',
    hook: 'quotes' as const,
  },
  {
    title: 'Website Config',
    icon: Settings,
    url: '/super-admin/new-lawns/website-config',
    description: 'Configure website settings',
    hook: null,
  },
];

export default function NewLawnsHubPage() {
  const navigate = useNavigate();

  const { data: servicesData } = useGetNLServicesQuery({
    page: 1,
    limit: 1,
  });
  const { data: reviewsData } = useGetNLReviewsQuery({
    page: 1,
    limit: 1,
  });
  const { data: galleryData } = useGetNLGalleryQuery({
    page: 1,
    limit: 1,
  });
  const { data: contactsData } = useGetNLContactsQuery({
    page: 1,
    limit: 1,
  });
  const { data: quotesData } = useGetNLQuotesQuery({
    page: 1,
    limit: 1,
  });

  const counts: Record<string, number | undefined> = {
    services: servicesData?.total,
    reviews: reviewsData?.total,
    gallery: galleryData?.total,
    contacts: contactsData?.total,
    quotes: quotesData?.total,
  };

  const stats = [
    {
      label: 'Total Services',
      value: servicesData?.total,
      color: 'bg-blue-50 text-blue-700 border-blue-200',
    },
    {
      label: 'Total Reviews',
      value: reviewsData?.total,
      color: 'bg-amber-50 text-amber-700 border-amber-200',
    },
    {
      label: 'Gallery Items',
      value: galleryData?.total,
      color: 'bg-purple-50 text-purple-700 border-purple-200',
    },
    {
      label: 'Contact Inquiries',
      value: contactsData?.total,
      color: 'bg-cyan-50 text-cyan-700 border-cyan-200',
    },
    {
      label: 'Quote Requests',
      value: quotesData?.total,
      color: 'bg-rose-50 text-rose-700 border-rose-200',
    },
  ];

  return (
    <SuperAdminLayout>
      <div className="px-4 pt-4">
        <Navbar title="Web Handling" />
        <div className="space-y-6 p-6">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className={`rounded-xl border p-4 ${stat.color}`}
              >
                <p className="text-sm font-medium opacity-80">
                  {stat.label}
                </p>
                <p className="mt-1 text-3xl font-bold">
                  {stat.value !== undefined ? (
                    stat.value
                  ) : (
                    <Loader2 className="h-6 w-6 animate-spin" />
                  )}
                </p>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sections.map((section) => (
              <button
                key={section.title}
                onClick={() => navigate(section.url)}
                className="flex items-start gap-4 rounded-xl border border-gray-200 bg-white p-6 text-left transition-all hover:shadow-md hover:border-[#16a34a]/30"
              >
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-[#16a34a]/10">
                  <section.icon className="h-6 w-6 text-[#16a34a]" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-semibold text-gray-900 truncate">
                      {section.title}
                    </h3>
                    {section.hook &&
                      counts[section.hook] !== undefined && (
                        <span className="shrink-0 rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-600">
                          {counts[section.hook]}
                        </span>
                      )}
                  </div>
                  <p className="mt-1 text-sm text-gray-500 line-clamp-2">
                    {section.description}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </SuperAdminLayout>
  );
}
