import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, Pencil, ExternalLink } from 'lucide-react';
import { SuperAdminLayout } from '@/components/layout/super-layout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ActionButton } from '@/components/data-table/data-table';
import { useGetNLPageContentByIdQuery } from '@/API/new-lawns-api';
import { NEW_LAWNS_ROUTES } from '@/constants/new-lawns-routes';
import Loader from '@/components/loader';
import type { NewLawnPageContent } from '@/types/new-lawns.types';

const PAGE_LABELS: Record<string, string> = { home: 'Home', services: 'Services', about: 'About', gallery: 'Gallery', reviews: 'Reviews', areas: 'Areas', contact: 'Contact' };

const statusColors: Record<string, string> = {
  active: 'bg-primary/10 text-primary border-primary/20',
  inactive: 'bg-gray-100 text-gray-700 border-gray-200',
};

export default function ViewPageContentPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const passed = location.state?.content as NewLawnPageContent | undefined;

  const { data, isLoading } = useGetNLPageContentByIdQuery(id!, { skip: !!passed });
  const item = passed ?? data;

  if (isLoading) return <SuperAdminLayout><Loader /></SuperAdminLayout>;
  if (!item) return <SuperAdminLayout><div className="flex h-full items-center justify-center"><p className="text-muted-foreground">Content not found</p></div></SuperAdminLayout>;

  return (
    <SuperAdminLayout>
      <div className="flex h-full flex-col">
        <div className="flex-1 w-full overflow-y-auto p-5 md:pl-10">
          <Button variant="ghost" onClick={() => navigate(NEW_LAWNS_ROUTES.PAGE_CONTENT)} className="mb-4 text-muted-foreground hover:text-primary">
            <ArrowLeft className="h-4 w-4 mr-2" /> Back to Content
          </Button>

          <div className="mb-6 rounded-xl border border-border bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-2xl font-bold text-foreground">{item.title}</h1>
                  <Badge className={`${statusColors[item.status] || statusColors.inactive} border px-3 py-1`}>{item.status}</Badge>
                </div>
                <div className="flex gap-2">
                  <Badge variant="outline">{PAGE_LABELS[item.page] || item.page}</Badge>
                  <Badge variant="outline">{item.section}</Badge>
                </div>
              </div>
              <ActionButton icon={<Pencil className="h-3.5 w-3.5" />}
                onClick={() => navigate(NEW_LAWNS_ROUTES.PAGE_CONTENT_EDIT.replace(':id', item._id), { state: { content: item } })} />
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div className="rounded-xl border border-border bg-white p-6 shadow-sm">
              <h3 className="text-lg font-semibold mb-4">Content</h3>
              {item.subtitle && (
                <div className="mb-4">
                  <p className="text-sm text-muted-foreground">Subtitle</p>
                  <p className="text-foreground font-medium mt-1">{item.subtitle}</p>
                </div>
              )}
              {item.content && (
                <div>
                  <p className="text-sm text-muted-foreground">Body</p>
                  <p className="text-foreground mt-1 whitespace-pre-wrap">{item.content}</p>
                </div>
              )}
              {!item.subtitle && !item.content && <p className="text-muted-foreground text-sm">No content</p>}
            </div>

            <div className="rounded-xl border border-border bg-white p-6 shadow-sm">
              <h3 className="text-lg font-semibold mb-4">SEO</h3>
              {item.seoTitle ? (
                <div className="mb-4">
                  <p className="text-sm text-muted-foreground">SEO Title</p>
                  <p className="text-foreground font-medium mt-1">{item.seoTitle}</p>
                </div>
              ) : <p className="text-sm text-muted-foreground mb-4">No SEO title</p>}
              {item.seoDescription ? (
                <div>
                  <p className="text-sm text-muted-foreground">SEO Description</p>
                  <p className="text-foreground mt-1">{item.seoDescription}</p>
                </div>
              ) : <p className="text-sm text-muted-foreground">No SEO description</p>}
            </div>

            {item.image && (
              <div className="md:col-span-2 rounded-xl border border-border bg-white p-6 shadow-sm">
                <h3 className="text-lg font-semibold mb-4">Image</h3>
                <div className="flex items-center gap-3">
                  <span className="text-sm text-muted-foreground truncate flex-1">{item.image}</span>
                  <a href={item.image} target="_blank" rel="noopener noreferrer">
                    <ActionButton icon={<ExternalLink className="h-3.5 w-3.5" />} />
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </SuperAdminLayout>
  );
}
