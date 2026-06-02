import {
  useParams,
  useNavigate,
  useLocation,
} from 'react-router-dom';
import {
  ArrowLeft,
  Pencil,
  Trash2,
  Tag,
  DollarSign,
  FileText,
  Clock,
  Calendar,
} from 'lucide-react';
import { format } from 'date-fns';
import toast from 'react-hot-toast';

import { SuperAdminLayout } from '@/components/layout/super-layout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ActionButton } from '@/components/data-table/data-table';
import {
  useGetNLServiceByIdQuery,
  useDeleteNLServiceMutation,
} from '@/API/new-lawns-api';
import { NEW_LAWNS_ROUTES } from '@/constants/new-lawns-routes';
import type { NewLawnService } from '@/types/new-lawns.types';
import { getErrorMessage } from '@/lib/get-error-message';
import Loader from '@/components/loader';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';
import { useState } from 'react';

const statusColors: Record<string, string> = {
  active: 'bg-primary/10 text-primary border-primary/20',
  inactive: 'bg-gray-100 text-gray-700 border-gray-200',
};

const categoryColors: Record<string, string> = {
  installation: 'bg-blue-100 text-blue-700 border-blue-200',
  maintenance: 'bg-amber-100 text-amber-700 border-amber-200',
  design: 'bg-purple-100 text-purple-700 border-purple-200',
};

export default function ViewServicePage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const passedService = location.state?.service as
    | NewLawnService
    | undefined;

  const [deleteNLService] = useDeleteNLServiceMutation();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const { data, isLoading } = useGetNLServiceByIdQuery(
    id!,
    { skip: !!passedService },
  );

  const service = passedService ?? data;

  const handleDelete = async () => {
    if (!service) return;
    try {
      await deleteNLService(service._id).unwrap();
      toast.success('Service deleted successfully');
      navigate(NEW_LAWNS_ROUTES.SERVICES);
    } catch (error) {
      toast.error(
        getErrorMessage(error, 'Failed to delete service'),
      );
    }
  };

  if (isLoading) {
    return (
      <SuperAdminLayout>
        <Loader />
      </SuperAdminLayout>
    );
  }

  if (!service) {
    return (
      <SuperAdminLayout>
        <div className="flex h-full items-center justify-center">
          <p className="text-muted-foreground">
            Service not found
          </p>
        </div>
      </SuperAdminLayout>
    );
  }

  return (
    <SuperAdminLayout>
      <div className="flex h-full flex-col">
        <div className="flex-1 w-full overflow-y-auto p-5 md:pl-10">
          <Button
            variant="ghost"
            onClick={() => navigate(NEW_LAWNS_ROUTES.SERVICES)}
            className="mb-4 text-muted-foreground hover:text-primary hover:bg-primary/10"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Services
          </Button>

          <div className="mb-6 rounded-xl border border-[#ececec] bg-white p-6 shadow-sm">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-2xl font-bold text-foreground">
                    {service.title}
                  </h1>
                  <Badge
                    className={`${statusColors[service.status] || statusColors.inactive} border px-3 py-1`}
                  >
                    {service.status}
                  </Badge>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">
                    /
                    {service.slug}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-1 shrink-0">
                <ActionButton
                  icon={<Pencil className="h-3.5 w-3.5" />}
                  intent="edit"
                  onClick={() =>
                    navigate(
                      NEW_LAWNS_ROUTES.SERVICES_EDIT.replace(
                        ':id',
                        service._id,
                      ),
                    )
                  }
                />
                <ActionButton
                  icon={<Trash2 className="h-3.5 w-3.5" />}
                  intent="delete"
                  onClick={() => setShowDeleteConfirm(true)}
                />
              </div>
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div className="rounded-xl border border-[#ececec] bg-white p-6 shadow-sm">
              <div className="mb-4 flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                  <Tag className="h-4 w-4 text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-foreground">
                  Service Details
                </h3>
              </div>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Tag className="h-4 w-4 text-muted-foreground shrink-0" />
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Category
                    </p>
                    <Badge
                      className={`${categoryColors[service.category]} border mt-0.5`}
                    >
                      {service.category}
                    </Badge>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <DollarSign className="h-4 w-4 text-muted-foreground shrink-0" />
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Price
                    </p>
                    <p className="text-foreground font-medium">
                      {service.price}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Clock className="h-4 w-4 text-muted-foreground shrink-0" />
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Status
                    </p>
                    <Badge
                      className={`${statusColors[service.status] || statusColors.inactive} border mt-0.5`}
                    >
                      {service.status}
                    </Badge>
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-[#ececec] bg-white p-6 shadow-sm">
              <div className="mb-4 flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                  <Calendar className="h-4 w-4 text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-foreground">
                  Timestamps
                </h3>
              </div>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground">
                    Created
                  </p>
                  <p className="text-foreground font-medium">
                    {format(
                      new Date(service.createdAt),
                      'MMM d, yyyy h:mm a',
                    )}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">
                    Last Updated
                  </p>
                  <p className="text-foreground font-medium">
                    {format(
                      new Date(service.updatedAt),
                      'MMM d, yyyy h:mm a',
                    )}
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-[#ececec] bg-white p-6 shadow-sm md:col-span-2">
              <div className="mb-4 flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                  <FileText className="h-4 w-4 text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-foreground">
                  Description
                </h3>
              </div>
              <p className="text-foreground leading-relaxed whitespace-pre-wrap">
                {service.description}
              </p>
            </div>

            <div className="rounded-xl border border-[#ececec] bg-white p-6 shadow-sm md:col-span-2">
              <div className="mb-4 flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                  <Tag className="h-4 w-4 text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-foreground">
                  Features
                </h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {service.features.map((feature, index) => (
                  <Badge
                    key={index}
                    variant="secondary"
                    className="px-3 py-1.5 text-sm"
                  >
                    {feature}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      {showDeleteConfirm && (
        <ConfirmDialog
          open={showDeleteConfirm}
          onOpenChange={setShowDeleteConfirm}
          title="Delete Service"
          description={`Are you sure you want to delete "${service.title}"? This action cannot be undone.`}
          confirmText="Delete"
          onConfirm={handleDelete}
        />
      )}
    </SuperAdminLayout>
  );
}
