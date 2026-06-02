import { SuperAdminLayout } from '@/components/layout/super-layout';
import { Navbar } from '@/components/layout/navbar';
import { useGetNLServicesQuery } from '@/API/new-lawns-api';
import { useGetNLLeadsQuery } from '@/API/new-lawns-api';
import { useGetNLReviewsQuery } from '@/API/new-lawns-api';
import { useGetNLFAQsQuery } from '@/API/new-lawns-api';
import { useGetNLAreasQuery } from '@/API/new-lawns-api';
import { useGetNLGalleryQuery } from '@/API/new-lawns-api';
import { useGetNLTeamMembersQuery } from '@/API/new-lawns-api';
import { useGetNLPromotionsQuery } from '@/API/new-lawns-api';
import { TreePine, PhoneCall, Star, HelpCircle, Map, Image, UserCircle, Tag } from 'lucide-react';

interface StatCard {
  label: string;
  total: number;
  icon: React.ElementType;
  color: string;
  bgColor: string;
  secondary?: { label: string; count: number };
}

export default function StatsPage() {
  const { data: services } = useGetNLServicesQuery({ limit: 1 });
  const { data: leads } = useGetNLLeadsQuery({ limit: 1 });
  const { data: reviews } = useGetNLReviewsQuery({ limit: 1 });
  const { data: faqs } = useGetNLFAQsQuery({ limit: 1 });
  const { data: areas } = useGetNLAreasQuery({ limit: 1 });
  const { data: gallery } = useGetNLGalleryQuery({ limit: 1 });
  const { data: team } = useGetNLTeamMembersQuery({ limit: 1 });
  const { data: promotions } = useGetNLPromotionsQuery({ limit: 1 });

  const cards: StatCard[] = [
    { label: 'Services', total: services?.total ?? 0, icon: TreePine, color: '#22c55e', bgColor: 'bg-green-50', secondary: undefined },
    { label: 'Leads', total: leads?.total ?? 0, icon: PhoneCall, color: '#3b82f6', bgColor: 'bg-blue-50', secondary: undefined },
    { label: 'Reviews', total: reviews?.total ?? 0, icon: Star, color: '#f59e0b', bgColor: 'bg-amber-50', secondary: undefined },
    { label: 'FAQs', total: faqs?.total ?? 0, icon: HelpCircle, color: '#8b5cf6', bgColor: 'bg-purple-50', secondary: undefined },
    { label: 'Areas', total: areas?.total ?? 0, icon: Map, color: '#06b6d4', bgColor: 'bg-cyan-50', secondary: undefined },
    { label: 'Gallery', total: gallery?.total ?? 0, icon: Image, color: '#ec4899', bgColor: 'bg-pink-50', secondary: undefined },
    { label: 'Team', total: team?.total ?? 0, icon: UserCircle, color: '#f97316', bgColor: 'bg-orange-50', secondary: undefined },
    { label: 'Promotions', total: promotions?.total ?? 0, icon: Tag, color: '#14b8a6', bgColor: 'bg-teal-50', secondary: undefined },
  ];

  return (
    <SuperAdminLayout>
      <Navbar title="New Lawns Stats" subtitle="Overview of all data" superAccess />
      <div className="flex-1 px-6 pb-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {cards.map((card) => {
            const Icon = card.icon;
            return (
              <div key={card.label} className={`rounded-xl border border-border p-6 shadow-sm ${card.bgColor}`}>
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">{card.label}</p>
                    <p className="text-3xl font-bold mt-1" style={{ color: card.color }}>{card.total}</p>
                  </div>
                  <div className="rounded-lg bg-white p-3 shadow-sm">
                    <Icon className="h-6 w-6" style={{ color: card.color }} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </SuperAdminLayout>
  );
}
