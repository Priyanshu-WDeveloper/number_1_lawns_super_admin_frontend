import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';

import { getErrorMessage } from '@/lib/get-error-message';
import { SuperAdminLayout } from '@/components/layout/super-layout';
import { Navbar } from '@/components/layout/navbar';
import { Button } from '@/components/ui/button';
import { useCreateNLReviewMutation } from '@/API/new-lawns-api';
import { NEW_LAWNS_ROUTES } from '@/constants/new-lawns-routes';
import {
  ReviewFormFields,
  useReviewForm,
  type ReviewFormData,
} from './components/review-form';

export default function CreateReviewPage() {
  const navigate = useNavigate();
  const [createReview, { isLoading }] = useCreateNLReviewMutation();
  const form = useReviewForm();

  const onSubmit = async (data: ReviewFormData) => {
    try {
      await createReview(data).unwrap();
      toast.success('Review created successfully');
      navigate(NEW_LAWNS_ROUTES.REVIEWS);
    } catch (error) {
      toast.error(getErrorMessage(error, 'Failed to create review'));
    }
  };

  return (
    <SuperAdminLayout>
      <div className="flex h-full flex-col">
        <div className="flex-1 w-full overflow-y-auto p-5 md:pl-10">
          <Button
            variant="ghost"
            onClick={() => navigate(NEW_LAWNS_ROUTES.REVIEWS)}
            className="mb-4 text-muted-foreground hover:text-primary hover:bg-primary/10"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Reviews
          </Button>

          <Navbar
            title="Add Review"
            subtitle="Create a new customer review"
            showWelcome={false}
            superAccess
          />

          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="mt-6 max-w-2xl space-y-6"
          >
            <div className="rounded-xl border border-[#ececec] bg-white p-6 shadow-sm">
              <div className="space-y-5">
                <ReviewFormFields form={form} />
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate(NEW_LAWNS_ROUTES.REVIEWS)}
                className="h-12 flex-1 rounded-xl border-border text-base"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isLoading}
                className="h-12 flex-1 rounded-xl bg-green-600 text-white hover:bg-green-700 text-base"
              >
                {isLoading ? 'Creating...' : 'Create Review'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </SuperAdminLayout>
  );
}
