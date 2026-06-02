import {
  useParams,
  useNavigate,
  useLocation,
} from 'react-router-dom';
import {
  ArrowLeft,
  Mail,
  Phone,
  MapPin,
  Calendar,
  MessageSquare,
  User,
  Ellipsis,
} from 'lucide-react';
import { format } from 'date-fns';
import toast from 'react-hot-toast';

import { SuperAdminLayout } from '@/components/layout/super-layout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ActionButton } from '@/components/data-table/data-table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  useGetNLLeadByIdQuery,
  useUpdateNLLeadMutation,
} from '@/API/new-lawns-api';
import { NEW_LAWNS_ROUTES } from '@/constants/new-lawns-routes';
import Loader from '@/components/loader';
import type { NewLawnLead } from '@/types/new-lawns.types';
import { getErrorMessage } from '@/lib/get-error-message';

const statusConfig: Record<
  NewLawnLead['status'],
  { color: string; label: string; bg: string }
> = {
  new: { color: '#3b82f6', label: 'New', bg: 'bg-blue-50 text-blue-700 border-blue-200' },
  contacted: { color: '#f59e0b', label: 'Contacted', bg: 'bg-amber-50 text-amber-700 border-amber-200' },
  quoted: { color: '#8b5cf6', label: 'Quoted', bg: 'bg-purple-50 text-purple-700 border-purple-200' },
  won: { color: '#22c55e', label: 'Won', bg: 'bg-green-50 text-green-700 border-green-200' },
  lost: { color: '#ef4444', label: 'Lost', bg: 'bg-red-50 text-red-700 border-red-200' },
};

export default function NewLawnLeadViewPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const passedLead = location.state?.lead as NewLawnLead | undefined;
  const [updateLead] = useUpdateNLLeadMutation();

  const { data, isLoading, refetch } = useGetNLLeadByIdQuery(id!, {
    skip: !!passedLead,
  });

  const lead = passedLead ?? data;

  const handleStatusChange = async (
    id: string,
    status: NewLawnLead['status'],
  ) => {
    try {
      await updateLead({ id, status }).unwrap();
      refetch();
      toast.success(`Lead status set to ${status}`);
    } catch (error) {
      toast.error(getErrorMessage(error, 'Failed to update status'));
    }
  };

  if (isLoading) {
    return (
      <SuperAdminLayout>
        <Loader />
      </SuperAdminLayout>
    );
  }

  if (!lead) {
    return (
      <SuperAdminLayout>
        <div className="flex h-full items-center justify-center">
          <p className="text-muted-foreground">Lead not found</p>
        </div>
      </SuperAdminLayout>
    );
  }

  const statusCfg = statusConfig[lead.status];

  return (
    <SuperAdminLayout>
      <div className="flex h-full flex-col">
        <div className="flex-1 w-full overflow-y-auto p-5 md:pl-10">
          <Button
            variant="ghost"
            onClick={() => navigate(NEW_LAWNS_ROUTES.LEADS)}
            className="mb-4 text-muted-foreground hover:text-primary hover:bg-primary/10"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Leads
          </Button>

          <div className="mb-6 rounded-xl border border-[#ececec] bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10">
                  <User className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <div className="flex items-center gap-3">
                    <h1 className="text-2xl font-bold text-foreground">
                      {lead.firstName} {lead.lastName}
                    </h1>
                    <Badge className={`${statusCfg.bg} border px-3 py-1`}>
                      {statusCfg.label}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                    <span>{lead.email}</span>
                    <span>{lead.phone}</span>
                    <span>
                      Created{' '}
                      {format(new Date(lead.createdAt), 'MMM d, yyyy')}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-1">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <ActionButton
                      icon={<Ellipsis className="h-3.5 w-3.5" />}
                      className="h-8 w-8 rounded-full border border-[#e5e7eb] bg-white text-[#6b7280] hover:bg-[#f3f4f6] hover:text-[#374151] shadow-none"
                    />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    {(
                      ['new', 'contacted', 'quoted', 'won', 'lost'] as const
                    ).map((s) => (
                      <DropdownMenuItem
                        key={s}
                        disabled={lead.status === s}
                        onClick={() =>
                          handleStatusChange(lead._id, s)
                        }
                        className="truncate"
                      >
                        <span
                          className="mr-2 h-2 w-2 rounded-full"
                          style={{
                            backgroundColor: statusConfig[s].color,
                          }}
                        />
                        Mark as {statusConfig[s].label}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div className="rounded-xl border border-[#ececec] bg-white p-6 shadow-sm">
              <div className="mb-4 flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                  <Mail className="h-4 w-4 text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-foreground">
                  Contact Information
                </h3>
              </div>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Email</p>
                    <p className="text-foreground font-medium">
                      {lead.email}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Phone</p>
                    <p className="text-foreground font-medium">
                      {lead.phone}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-[#ececec] bg-white p-6 shadow-sm">
              <div className="mb-4 flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                  <MapPin className="h-4 w-4 text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-foreground">
                  Location
                </h3>
              </div>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground">Address</p>
                  <p className="text-foreground font-medium mt-1">
                    {lead.address || '-'}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">City</p>
                  <p className="text-foreground font-medium mt-1">
                    {lead.city || '-'}
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-[#ececec] bg-white p-6 shadow-sm">
              <div className="mb-4 flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                  <Calendar className="h-4 w-4 text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-foreground">
                  Service Request
                </h3>
              </div>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground">Service</p>
                  <p className="text-foreground font-medium mt-1">
                    {lead.service}
                  </p>
                </div>
                {lead.propertySize && (
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Property Size
                    </p>
                    <p className="text-foreground font-medium mt-1">
                      {lead.propertySize}
                    </p>
                  </div>
                )}
                {lead.preferredDate && (
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Preferred Date
                    </p>
                    <p className="text-foreground font-medium mt-1">
                      {format(
                        new Date(lead.preferredDate),
                        'MMM d, yyyy',
                      )}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {lead.message && (
            <div className="mt-6 rounded-xl border border-[#ececec] bg-white p-6 shadow-sm">
              <div className="mb-4 flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                  <MessageSquare className="h-4 w-4 text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-foreground">
                  Message
                </h3>
              </div>
              <p className="text-foreground whitespace-pre-wrap">
                {lead.message}
              </p>
            </div>
          )}

          {lead.notes && (
            <div className="mt-6 rounded-xl border border-[#ececec] bg-white p-6 shadow-sm">
              <div className="mb-4 flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                  <MessageSquare className="h-4 w-4 text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-foreground">
                  Notes
                </h3>
              </div>
              <p className="text-foreground whitespace-pre-wrap">
                {lead.notes}
              </p>
            </div>
          )}
        </div>
      </div>
    </SuperAdminLayout>
  );
}
