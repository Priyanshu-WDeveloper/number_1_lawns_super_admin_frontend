import {
  useParams,
  useNavigate,
  useLocation,
} from "react-router-dom";
import { ArrowLeft, Trash2, CheckCircle2 } from "lucide-react";
import { format } from "date-fns";
import toast from "react-hot-toast";
import { useState } from "react";

import { SuperAdminLayout } from "@/components/layout/super-layout";
import { Button } from "@/components/ui/button";
import { ActionButton } from "@/components/data-table/data-table";
import {
  useGetNLQuoteByIdQuery,
  useDeleteNLQuoteMutation,
  useUpdateNLQuoteStatusMutation,
} from "@/API/new-lawns-api";
import { NEW_LAWNS_ROUTES } from "@/constants/new-lawns-routes";
import { getErrorMessage } from "@/lib/get-error-message";
import Loader from "@/components/loader";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import type { QuoteRequest, QuoteStatus } from "@/types/new-lawns.types";

export default function ViewQuotePage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const passedQuote = location.state?.quote as QuoteRequest | undefined;

  const [deleteNLQuote] = useDeleteNLQuoteMutation();
  const [updateNLQuoteStatus] = useUpdateNLQuoteStatusMutation();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const { data: fetchedQuote, isLoading } = useGetNLQuoteByIdQuery(id!, {
    skip: !!passedQuote,
  });
  const quote = passedQuote ?? fetchedQuote;

  const handleDelete = async () => {
    if (!quote) return;
    try {
      await deleteNLQuote(quote._id).unwrap();
      toast.success("Quote request deleted");
      navigate(NEW_LAWNS_ROUTES.QUOTES);
    } catch (error) {
      toast.error(getErrorMessage(error, "Failed to delete quote request"));
    }
  };

  const handleUpdateStatus = async (status: QuoteStatus) => {
    if (!quote) return;
    try {
      await updateNLQuoteStatus({ id: quote._id, status }).unwrap();
      toast.success(`Status updated to ${status}`);
    } catch (error) {
      toast.error(getErrorMessage(error, "Failed to update status"));
    }
  };

  if (isLoading) {
    return (
      <SuperAdminLayout>
        <Loader />
      </SuperAdminLayout>
    );
  }

  if (!quote) {
    return (
      <SuperAdminLayout>
        <div className="flex h-full items-center justify-center">
          <p className="text-muted-foreground">Quote request not found</p>
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
            onClick={() => navigate(NEW_LAWNS_ROUTES.QUOTES)}
            className="mb-4 text-muted-foreground hover:text-primary hover:bg-primary/10"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Quote Requests
          </Button>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-1">
                Quote Request
              </h1>
              <p className="text-sm text-muted-foreground">
                {quote.fullName} • {quote.email}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <ActionButton
                icon={<Trash2 className="h-4 w-4" />}
                intent="delete"
                onClick={() => setShowDeleteConfirm(true)}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 space-y-6">
              <div className="rounded-xl border border-[#ececec] bg-white p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-foreground mb-4">
                  Request Details
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Service</p>
                    <p className="font-medium text-foreground mt-1">{quote.serviceRequired}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Preferred Date</p>
                    <p className="font-medium text-foreground mt-1">
                        {quote.preferredDate ? format(new Date(quote.preferredDate), 'MMM d, yyyy') : 'N/A'}
                    </p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-sm text-muted-foreground">Address</p>
                    <p className="font-medium text-foreground mt-1">{quote.propertyAddress}</p>
                  </div>
                   <div className="col-span-2">
                    <p className="text-sm text-muted-foreground">Additional Details</p>
                    <p className="font-medium text-foreground mt-1">{quote.additionalDetails || 'None'}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="md:col-span-1 space-y-6">
              <div className="rounded-xl border border-[#ececec] bg-white p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-foreground mb-4">
                  Update Status
                </h3>
                <div className="space-y-2">
                  {(['Pending', 'In Progress', 'Completed', 'Rejected'] as QuoteStatus[]).map((status) => (
                      <Button
                        key={status}
                        variant={quote.status === status ? 'default' : 'outline'}
                        className="w-full justify-start gap-2"
                        onClick={() => handleUpdateStatus(status)}
                        disabled={quote.status === status}
                      >
                        {quote.status === status && <CheckCircle2 className="h-4 w-4" />}
                        {status}
                      </Button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {showDeleteConfirm && (
        <ConfirmDialog
          open={showDeleteConfirm}
          onOpenChange={setShowDeleteConfirm}
          title="Delete Quote Request"
          description={`Are you sure you want to delete this quote request? This action cannot be undone.`}
          confirmText="Delete"
          onConfirm={handleDelete}
        />
      )}
    </SuperAdminLayout>
  );
}
