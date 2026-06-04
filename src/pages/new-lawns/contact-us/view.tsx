import {
  useParams,
  useNavigate,
  useLocation,
} from 'react-router-dom';
import { ArrowLeft, Trash2, Mail, Phone, User, Calendar, MessageSquare, CheckCheck, Send, Reply } from 'lucide-react';
import { format } from 'date-fns';
import toast from 'react-hot-toast';
import { useState } from 'react';

import { SuperAdminLayout } from '@/components/layout/super-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

import { Textarea } from '@/components/ui/textarea';
import { ActionButton } from '@/components/data-table/data-table';
import {
  useGetNLContactByIdQuery,
  useDeleteNLContactMutation,
  useMarkNLContactAsReadMutation,
  useReplyToNLContactMutation,
} from '@/API/new-lawns-api';
import { NEW_LAWNS_ROUTES } from '@/constants/new-lawns-routes';
import { getErrorMessage } from '@/lib/get-error-message';
import Loader from '@/components/loader';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';
import type {
  ContactInquiry,
  ContactInquiryReply,
} from '@/types/new-lawns.types';

export default function ViewContactPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const passedInquiry = location.state?.inquiry as
    | ContactInquiry
    | undefined;

  const [deleteNLContact] = useDeleteNLContactMutation();
  const [markNLContactAsRead] = useMarkNLContactAsReadMutation();
  const [replyToNLContact] = useReplyToNLContactMutation();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [replySubject, setReplySubject] = useState('');
  const [replyMessage, setReplyMessage] = useState('');
  const [sendingReply, setSendingReply] = useState(false);

  const { data: fetchedInquiry, isLoading } = useGetNLContactByIdQuery(
    id!,
    { skip: !!passedInquiry },
  );
  const inquiry = passedInquiry ?? fetchedInquiry;

  const handleDelete = async () => {
    if (!inquiry) return;
    try {
      await deleteNLContact(inquiry._id).unwrap();
      toast.success('Inquiry deleted');
      navigate(NEW_LAWNS_ROUTES.CONTACTS);
    } catch (error) {
      toast.error(getErrorMessage(error, 'Failed to delete inquiry'));
    }
  };

  const handleMarkAsRead = async () => {
    if (!inquiry) return;
    try {
      await markNLContactAsRead(inquiry._id).unwrap();
      toast.success('Marked as read');
    } catch (error) {
      toast.error(getErrorMessage(error, 'Failed to mark as read'));
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
      toast.success('Reply sent');
      setReplySubject('');
      setReplyMessage('');
    } catch (error) {
      toast.error(getErrorMessage(error, 'Failed to send reply'));
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

          <div className="mb-6 rounded-xl border border-[#ececec] bg-white p-6 shadow-sm">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-3">
                  <h1 className="text-2xl font-bold text-foreground">
                    {inquiry.name}
                  </h1>
                  {inquiry.isRead ? (
                    <span className="inline-flex items-center gap-1 rounded-full bg-green-50 px-3 py-0.5 text-xs font-medium text-green-700 border border-green-200">
                      <CheckCheck className="h-3 w-3" />
                      Read
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-3 py-0.5 text-xs font-medium text-blue-700 border border-blue-200">
                      New
                    </span>
                  )}
                </div>
                <p className="text-muted-foreground text-sm mt-1">
                  {inquiry.email} {inquiry.phone ? `· ${inquiry.phone}` : ''}
                </p>
              </div>
              <div className="flex items-center gap-2">
                {!inquiry.isRead && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleMarkAsRead}
                    className="gap-1"
                  >
                    <CheckCheck className="h-3.5 w-3.5" />
                    Mark as Read
                  </Button>
                )}
                <ActionButton
                  icon={<Trash2 className="h-3.5 w-3.5" />}
                  intent="delete"
                  onClick={() => setShowDeleteConfirm(true)}
                />
              </div>
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div className="rounded-xl border border-[#ececec] bg-white p-6 shadow-sm md:col-span-2">
              <div className="mb-4 flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                  <MessageSquare className="h-4 w-4 text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-foreground">
                  Message
                </h3>
              </div>
              <p className="text-foreground leading-relaxed whitespace-pre-wrap">
                {inquiry.message}
              </p>
            </div>

            {(inquiry.replies?.length ?? 0) > 0 && (
              <div className="rounded-xl border border-[#ececec] bg-white p-6 shadow-sm md:col-span-2">
                <div className="mb-4 flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                    <Reply className="h-4 w-4 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground">
                    Replies ({inquiry.replies.length})
                  </h3>
                </div>
                <div className="space-y-4">
                  {inquiry.replies.map((reply: ContactInquiryReply) => (
                    <div key={reply._id} className="rounded-lg border border-[#ececec] bg-gray-50 p-4">
                      <div className="mb-2 flex items-center justify-between">
                        <span className="text-sm font-medium text-foreground">
                          {reply.subject}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {format(new Date(reply.createdAt), 'MMM d, yyyy h:mm a')}
                        </span>
                      </div>
                      <p className="text-sm text-foreground whitespace-pre-wrap">
                        {reply.message}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="rounded-xl border border-[#ececec] bg-white p-6 shadow-sm">
              <div className="mb-4 flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                  <User className="h-4 w-4 text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-foreground">
                  Sender Info
                </h3>
              </div>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground">Name</p>
                  <p className="text-foreground font-medium">{inquiry.name}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Email</p>
                  <a
                    href={`mailto:${inquiry.email}`}
                    className="text-foreground font-medium hover:text-primary transition-colors flex items-center gap-1"
                  >
                    <Mail className="h-3.5 w-3.5" />
                    {inquiry.email}
                  </a>
                </div>
                {inquiry.phone && (
                  <div>
                    <p className="text-sm text-muted-foreground">Phone</p>
                    <a
                      href={`tel:${inquiry.phone}`}
                      className="text-foreground font-medium hover:text-primary transition-colors flex items-center gap-1"
                    >
                      <Phone className="h-3.5 w-3.5" />
                      {inquiry.phone}
                    </a>
                  </div>
                )}
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
                  <p className="text-sm text-muted-foreground">Submitted</p>
                  <p className="text-foreground font-medium">
                    {format(new Date(inquiry.createdAt), 'MMM d, yyyy h:mm a')}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Last Updated</p>
                  <p className="text-foreground font-medium">
                    {format(new Date(inquiry.updatedAt), 'MMM d, yyyy h:mm a')}
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-[#ececec] bg-white p-6 shadow-sm md:col-span-2">
              <div className="mb-4 flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                  <Send className="h-4 w-4 text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-foreground">
                  Send Reply
                </h3>
              </div>
              <div className="space-y-4">
                <div>
                  <label htmlFor="replySubject" className="text-sm font-medium">Subject</label>
                  <Input
                    id="replySubject"
                    value={replySubject}
                    onChange={(e) => setReplySubject(e.target.value)}
                    placeholder="Re: Customer inquiry"
                    className="mt-1"
                  />
                </div>
                <div>
                  <label htmlFor="replyMessage" className="text-sm font-medium">Message</label>
                  <Textarea
                    id="replyMessage"
                    value={replyMessage}
                    onChange={(e) => setReplyMessage(e.target.value)}
                    placeholder="Type your reply..."
                    className="mt-1 min-h-[120px]"
                  />
                </div>
                <Button
                  onClick={handleReply}
                  disabled={!replySubject.trim() || !replyMessage.trim() || sendingReply}
                  className="gap-1"
                >
                  <Send className="h-4 w-4" />
                  {sendingReply ? 'Sending...' : 'Send Reply'}
                </Button>
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
