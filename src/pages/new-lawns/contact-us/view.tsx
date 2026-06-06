import {
  useParams,
  useNavigate,
  useLocation,
} from "react-router-dom";
import { ArrowLeft, Trash2, CheckCheck, Send, Reply } from "lucide-react";
import { format } from "date-fns";
import toast from "react-hot-toast";
import { useState } from "react";

import { SuperAdminLayout } from "@/components/layout/super-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ActionButton } from "@/components/data-table/data-table";
import {
  useGetNLContactByIdQuery,
  useDeleteNLContactMutation,
  useMarkNLContactAsReadMutation,
  useReplyToNLContactMutation,
} from "@/API/new-lawns-api";
import { NEW_LAWNS_ROUTES } from "@/constants/new-lawns-routes";
import { getErrorMessage } from "@/lib/get-error-message";
import Loader from "@/components/loader";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import type { ContactInquiry, ContactInquiryReply } from "@/types/new-lawns.types";

export default function ViewContactPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const passedInquiry = location.state?.inquiry as ContactInquiry | undefined;

  const [deleteNLContact] = useDeleteNLContactMutation();
  const [markNLContactAsRead] = useMarkNLContactAsReadMutation();
  const [replyToNLContact] = useReplyToNLContactMutation();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [replySubject, setReplySubject] = useState("");
  const [replyMessage, setReplyMessage] = useState("");
  const [sendingReply, setSendingReply] = useState(false);

  const { data: fetchedInquiry, isLoading } = useGetNLContactByIdQuery(id!, {
    skip: !!passedInquiry,
  });
  const inquiry = passedInquiry ?? fetchedInquiry;

  const handleDelete = async () => {
    if (!inquiry) return;
    try {
      await deleteNLContact(inquiry._id).unwrap();
      toast.success("Inquiry deleted");
      navigate(NEW_LAWNS_ROUTES.CONTACTS);
    } catch (error) {
      toast.error(getErrorMessage(error, "Failed to delete inquiry"));
    }
  };

  const handleMarkAsRead = async () => {
    if (!inquiry) return;
    try {
      await markNLContactAsRead(inquiry._id).unwrap();
      toast.success("Marked as read");
    } catch (error) {
      toast.error(getErrorMessage(error, "Failed to mark as read"));
    }
  };

  const handleReply = async () => {
    if (!inquiry || !replySubject.trim() || !replyMessage.trim()) return;
    setSendingReply(true);
    try {
      await replyToNLContact({
        id: inquiry._id,
        subject: replySubject.trim(),
        message: replyMessage.trim(),
      }).unwrap();
      toast.success("Reply sent");
      setReplySubject("");
      setReplyMessage("");
    } catch (error) {
      toast.error(getErrorMessage(error, "Failed to send reply"));
    } finally {
      setSendingReply(false);
    }
  };

  if (isLoading) {
    return (
      <SuperAdminLayout>
        <Loader />
      </SuperAdminLayout>
    );
  }

  if (!inquiry) {
    return (
      <SuperAdminLayout>
        <div className="flex h-full items-center justify-center">
          <p className="text-muted-foreground">Inquiry not found</p>
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
            onClick={() => navigate(NEW_LAWNS_ROUTES.CONTACTS)}
            className="mb-4 text-muted-foreground hover:text-primary hover:bg-primary/10"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Inquiries
          </Button>

          {/* Header: Name + Actions */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-1">
                {inquiry.name}
              </h1>
              <p className="text-sm text-muted-foreground">
                {`${inquiry.isRead ? "Read" : "Unread"} • ${
                  inquiry.replies?.length ?? 0
                } Replies`}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="default" size="sm" className="gap-2">
                <Reply className="h-4 w-4" />
                Reply
              </Button>
              {!inquiry.isRead && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleMarkAsRead}
                  className="gap-2"
                >
                  <CheckCheck className="h-4 w-4" />
                  Mark as Read
                </Button>
              )}
              <ActionButton
                icon={<Trash2 className="h-4 w-4" />}
                intent="delete"
                onClick={() => setShowDeleteConfirm(true)}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 space-y-6">
              {/* Customer Information Card */}
              <div className="rounded-xl border border-[#ececec] bg-white p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-foreground mb-4">
                  Customer Information
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Email</p>
                    <p className="font-medium text-foreground mt-1">
                      {inquiry.email}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Phone</p>
                    <p className="font-medium text-foreground mt-1">
                      {inquiry.phone || "N/A"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Conversation History */}
              <div className="rounded-xl border border-[#ececec] bg-white p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-foreground mb-4">
                  Conversation History
                </h3>
                <div className="space-y-6">
                  {/* Original Inquiry */}
                  <div className="relative pl-4 border-l-4 border-green-500">
                    <div className="absolute -left-[6px] top-1.5 w-3 h-3 rounded-full bg-green-500" />
                    <div className="mb-2 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-md font-bold text-foreground">
                          Original Inquiry
                        </span>
                        <span className="px-1.5 py-0.5 rounded-md bg-green-100 text-green-700 text-[10px] font-bold uppercase">
                          Customer
                        </span>
                      </div>
                      <span className="text-xs text-muted-foreground font-normal">
                        {format(new Date(inquiry.createdAt), "MMM d, h:mm a")}
                      </span>
                    </div>
                    <p className="text-sm text-foreground bg-white p-3 rounded-lg border border-border mt-2">
                      {inquiry.message}
                    </p>
                  </div>

                  {/* Replies */}
                  {inquiry.replies?.map((reply: ContactInquiryReply) => (
                    <div
                      key={reply._id}
                      className="relative pl-4 border-l-4 border-blue-500"
                    >
                      <div className="absolute -left-[6px] top-1.5 w-3 h-3 rounded-full bg-blue-500" />
                      <div className="mb-2 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-md font-bold text-foreground">
                            {reply.subject}
                          </span>
                          <span className="px-1.5 py-0.5 rounded-md bg-blue-100 text-blue-700 text-[10px] font-bold uppercase">
                            Super Admin
                          </span>
                        </div>
                        <span className="text-xs text-muted-foreground font-normal">
                          {format(new Date(reply.createdAt), "MMM d, h:mm a")}
                        </span>
                      </div>
                      <p className="text-sm text-foreground bg-green-50 p-3 rounded-lg mt-2">
                        {reply.message}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Sidebar: Details + Reply */}
            <div className="md:col-span-1 space-y-6">
              {/* Compact Details Card */}
              <div className="rounded-xl border border-[#ececec] bg-white p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-foreground mb-4">
                  Details
                </h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Status</span>
                    <span className="font-medium text-foreground text-sm">
                      {inquiry.isRead ? "Read" : "Unread"}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Replies</span>
                    <span className="font-medium text-foreground text-sm">
                      {inquiry.replies?.length ?? 0}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Submitted</span>
                    <span className="font-medium text-foreground text-sm">
                      {format(new Date(inquiry.createdAt), "MMM d, yyyy")}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Updated</span>
                    <span className="font-medium text-foreground text-sm">
                      {format(new Date(inquiry.updatedAt), "MMM d, yyyy")}
                    </span>
                  </div>
                </div>
              </div>

              {/* Reply Form */}
              <div className="rounded-xl border border-[#ececec] bg-white p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-foreground mb-4">
                  Send Reply
                </h3>
                <div className="space-y-4">
                  <Input
                    value={replySubject}
                    onChange={(e) => setReplySubject(e.target.value)}
                    placeholder="Subject"
                    className="h-10 text-sm"
                  />
                  <Textarea
                    value={replyMessage}
                    onChange={(e) => setReplyMessage(e.target.value)}
                    placeholder="Type your reply..."
                    className="min-h-[120px] text-sm"
                  />
                  <Button
                    onClick={handleReply}
                    disabled={
                      !replySubject.trim() || !replyMessage.trim() || sendingReply
                    }
                    className="w-full gap-2 h-10 text-sm"
                  >
                    <Send className="h-4 w-4" />
                    {sendingReply ? "Sending..." : "Send Reply"}
                  </Button>
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
          title="Delete Inquiry"
          description={`Are you sure you want to delete this inquiry from "${inquiry.name}"? This action cannot be undone.`}
          confirmText="Delete"
          onConfirm={handleDelete}
        />
      )}
    </SuperAdminLayout>
  );
}
