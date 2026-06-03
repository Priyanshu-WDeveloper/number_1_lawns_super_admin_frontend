import { useForm, type UseFormReturn } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import z from 'zod';

import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const reviewSchema = z.object({
  reviewerName: z.string().min(1, 'Reviewer name is required'),
  location: z.string().min(1, 'Location is required'),
  rating: z
    .number({ message: 'Rating is required' })
    .min(1, 'Rating must be at least 1')
    .max(5, 'Rating must be at most 5'),
  comment: z.string().min(10, 'Comment must be at least 10 characters'),
});

type ReviewFormData = z.infer<typeof reviewSchema>;

interface ReviewFormFieldsProps {
  form: UseFormReturn<ReviewFormData>;
}

function ReviewFormFields({ form }: ReviewFormFieldsProps) {
  const { register, setValue, watch, formState: { errors } } = form;
  const rating = watch('rating');

  return (
    <>
      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground">
          Reviewer Name
          <span className="text-primary"> *</span>
        </label>
        <Input
          placeholder="Enter reviewer name"
          {...register('reviewerName')}
          className="h-12 rounded-xl border-border bg-background"
        />
        {errors.reviewerName && (
          <p className="text-sm text-red-500">{errors.reviewerName.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground">
          Location
          <span className="text-primary"> *</span>
        </label>
        <Input
          placeholder="e.g. Auckland"
          {...register('location')}
          className="h-12 rounded-xl border-border bg-background"
        />
        {errors.location && (
          <p className="text-sm text-red-500">{errors.location.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground">
          Rating
          <span className="text-primary"> *</span>
        </label>
        <Select
          value={String(rating)}
          onValueChange={(value) => setValue('rating', Number(value))}
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
          <p className="text-sm text-red-500">{errors.rating.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground">
          Comment
          <span className="text-primary"> *</span>
        </label>
        <textarea
          placeholder="Write the review comment..."
          {...register('comment')}
          rows={5}
          className="flex w-full rounded-xl border border-border bg-background px-4 py-3 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring resize-none"
        />
        {errors.comment && (
          <p className="text-sm text-red-500">{errors.comment.message}</p>
        )}
      </div>
    </>
  );
}

function useReviewForm(defaultValues?: Partial<ReviewFormData>) {
  return useForm<ReviewFormData>({
    mode: 'onTouched',
    resolver: zodResolver(reviewSchema),
    defaultValues: {
      reviewerName: '',
      location: '',
      rating: 5,
      comment: '',
      ...defaultValues,
    },
  });
}

export { reviewSchema, ReviewFormFields, useReviewForm };
export type { ReviewFormData };
