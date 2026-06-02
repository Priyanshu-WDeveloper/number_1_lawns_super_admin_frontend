import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';

import { SuperAdminLayout } from '@/components/layout/super-layout';
import { Navbar } from '@/components/layout/navbar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useCreateNLFAQMutation } from '@/API/new-lawns-api';
import { NEW_LAWNS_ROUTES } from '@/constants/new-lawns-routes';
import { getErrorMessage } from '@/lib/get-error-message';

const faqSchema = z.object({
  question: z.string().min(10, 'Question must be at least 10 characters'),
  answer: z.string().min(20, 'Answer must be at least 20 characters'),
  category: z.string().min(1, 'Category is required'),
  order: z.coerce.number().int().min(0, 'Order must be a non-negative number'),
  status: z.enum(['active', 'inactive']),
});

type FAQFormData = z.infer<typeof faqSchema>;

export default function CreateFAQPage() {
  const navigate = useNavigate();
  const [createFAQ, { isLoading }] = useCreateNLFAQMutation();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FAQFormData>({
    resolver: zodResolver(faqSchema) as any,
    defaultValues: {
      question: '',
      answer: '',
      category: '',
      order: 0,
      status: 'active',
    },
  });

  const selectedStatus = watch('status');
  const selectedCategory = watch('category');

  const onSubmit = async (data: FAQFormData) => {
    try {
      await createFAQ(data).unwrap();
      toast.success('FAQ created successfully');
      navigate(NEW_LAWNS_ROUTES.FAQS);
    } catch (err) {
      toast.error(getErrorMessage(err, 'Failed to create FAQ'));
    }
  };

  return (
    <SuperAdminLayout>
      <Navbar title="Create FAQ" subtitle="Add a new frequently asked question" superAccess />
      <div className="flex-1 px-6 pb-6">
        <div className="max-w-2xl mx-auto">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="question" className="text-sm font-medium">Question</label>
              <Textarea
                id="question"
                placeholder="Enter the question"
                className="min-h-[80px]"
                {...register('question')}
              />
              {errors.question && (
                <p className="text-sm text-red-500">{errors.question.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <label htmlFor="answer" className="text-sm font-medium">Answer</label>
              <Textarea
                id="answer"
                placeholder="Enter the answer"
                className="min-h-[150px]"
                {...register('answer')}
              />
              {errors.answer && (
                <p className="text-sm text-red-500">{errors.answer.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <label htmlFor="category" className="text-sm font-medium">Category</label>
              <Select
                value={selectedCategory}
                onValueChange={(value) => setValue('category', value, { shouldValidate: true })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="General">General</SelectItem>
                  <SelectItem value="Artificial Grass">Artificial Grass</SelectItem>
                  <SelectItem value="Natural Turf">Natural Turf</SelectItem>
                  <SelectItem value="Maintenance">Maintenance</SelectItem>
                </SelectContent>
              </Select>
              {errors.category && (
                <p className="text-sm text-red-500">{errors.category.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <label htmlFor="order" className="text-sm font-medium">Order</label>
              <Input
                id="order"
                type="number"
                placeholder="Display order"
                {...register('order')}
              />
              {errors.order && (
                <p className="text-sm text-red-500">{errors.order.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <label htmlFor="status" className="text-sm font-medium">Status</label>
              <Select
                value={selectedStatus}
                onValueChange={(value) => setValue('status', value as 'active' | 'inactive', { shouldValidate: true })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
              {errors.status && (
                <p className="text-sm text-red-500">{errors.status.message}</p>
              )}
            </div>

            <div className="flex items-center gap-3 pt-4">
              <Button type="submit" disabled={isLoading}>
                {isLoading ? 'Creating...' : 'Create FAQ'}
              </Button>
              <Button type="button" variant="outline" onClick={() => navigate(NEW_LAWNS_ROUTES.FAQS)}>
                Cancel
              </Button>
            </div>
          </form>
        </div>
      </div>
    </SuperAdminLayout>
  );
}
