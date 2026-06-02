import { useNavigate } from 'react-router-dom';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { ArrowLeft } from 'lucide-react';
import z from 'zod';
import toast from 'react-hot-toast';

import { getErrorMessage } from '@/lib/get-error-message';
import { SuperAdminLayout } from '@/components/layout/super-layout';
import { Navbar } from '@/components/layout/navbar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  useCreateNLReviewMutation,
} from '@/API/new-lawns-api';
import { NEW_LAWNS_ROUTES } from '@/constants/new-lawns-routes';

const reviewSchema = z.object({
  customerName: z.string().min(1, 'Customer name is required'),
  rating: z
    .number({ message: 'Rating is required' })
    .min(1, 'Rating must be at least 1')
    .max(5, 'Rating must be at most 5'),
  text: z
    .string()
    .min(10, 'Review text must be at least 10 characters'),
  service: z.string().min(1, 'Service is required'),
  status: z.enum(['approved', 'pending', 'rejected']),
});

type ReviewFormData = z.infer<typeof reviewSchema>;

export default function CreateReviewPage() {
  const navigate = useNavigate();
  const [createReview, { isLoading }] = useCreateNLReviewMutation();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ReviewFormData>({
    mode: 'onTouched',
    resolver: zodResolver(reviewSchema),
    defaultValues: {
      customerName: '',
      rating: 5,
      text: '',
      service: '',
      status: 'pending',
    },
  });

  const rating = watch('rating');
  const status = watch('status');

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
            onSubmit={handleSubmit(onSubmit)}
            className="mt-6 max-w-2xl space-y-6"
          >
            <div className="rounded-xl border border-[#ececec] bg-white p-6 shadow-sm">
              <div className="space-y-5">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">
                    Customer Name
                    <span className="text-primary"> *</span>
                  </label>
                  <Input
                    placeholder="Enter customer name"
                    {...register('customerName')}
                    className="h-12 rounded-xl border-border bg-background"
                  />
                  {errors.customerName && (
                    <p className="text-sm text-red-500">
                      {errors.customerName.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">
                    Rating
                    <span className="text-primary"> *</span>
                  </label>
                  <Select
                    value={String(rating)}
                    onValueChange={(value) =>
                      setValue('rating', Number(value))
                    }
                  >
                    <SelectTrigger className="h-12 rounded-xl border-border bg-background">
                      <SelectValue placeholder="Select rating" />
                    </SelectTrigger>
                    <SelectContent>
                      {[5, 4, 3, 2, 1].map((r) => (
                        <SelectItem key={r} value={String(r)}>
                          {'★'.repeat(r)}
                          {'☆'.repeat(5 - r)} ({r}/5)
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.rating && (
                    <p className="text-sm text-red-500">
                      {errors.rating.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">
                    Review Text
                    <span className="text-primary"> *</span>
                  </label>
                  <textarea
                    placeholder="Write the review text..."
                    {...register('text')}
                    rows={5}
                    className="flex w-full rounded-xl border border-border bg-background px-4 py-3 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring resize-none"
                  />
                  {errors.text && (
                    <p className="text-sm text-red-500">
                      {errors.text.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">
                    Service
                    <span className="text-primary"> *</span>
                  </label>
                  <Input
                    placeholder="e.g. Lawn Mowing, Garden Design"
                    {...register('service')}
                    className="h-12 rounded-xl border-border bg-background"
                  />
                  {errors.service && (
                    <p className="text-sm text-red-500">
                      {errors.service.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">
                    Status
                    <span className="text-primary"> *</span>
                  </label>
                  <Select
                    value={status}
                    onValueChange={(value) =>
                      setValue('status', value as 'approved' | 'pending' | 'rejected')
                    }
                  >
                    <SelectTrigger className="h-12 rounded-xl border-border bg-background">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="approved">Approved</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="rejected">Rejected</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.status && (
                    <p className="text-sm text-red-500">
                      {errors.status.message}
                    </p>
                  )}
                </div>
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
