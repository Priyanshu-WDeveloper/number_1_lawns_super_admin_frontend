import { useNavigate } from 'react-router-dom';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';
import { SuperAdminLayout } from '@/components/layout/super-layout';
import { Navbar } from '@/components/layout/navbar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useCreateNLPromotionMutation } from '@/API/new-lawns-api';
import { NEW_LAWNS_ROUTES } from '@/constants/new-lawns-routes';
import { getErrorMessage } from '@/lib/get-error-message';

const schema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  code: z.string().min(1, 'Code is required'),
  discountType: z.enum(['percentage', 'fixed']),
  discountValue: z.coerce.number().min(1, 'Value must be at least 1'),
  minOrder: z.coerce.number().optional(),
  startDate: z.string().min(1, 'Start date is required'),
  endDate: z.string().min(1, 'End date is required'),
  status: z.enum(['active', 'inactive']),
});

type FormData = z.infer<typeof schema>;

export default function CreatePromotionPage() {
  const navigate = useNavigate();
  const [createItem, { isLoading }] = useCreateNLPromotionMutation();
  const form = useForm<FormData>({
    resolver: zodResolver(schema) as any,
    defaultValues: {
      title: '', description: '', code: '', discountType: 'percentage',
      discountValue: 0, startDate: '', endDate: '', status: 'active',
    },
  });

  const discountType = form.watch('discountType');

  const onSubmit = async (data: FormData) => {
    try {
      await createItem(data).unwrap();
      toast.success('Promotion created');
      navigate(NEW_LAWNS_ROUTES.PROMOTIONS);
    } catch (err) {
      toast.error(getErrorMessage(err, 'Failed to create'));
    }
  };

  return (
    <SuperAdminLayout>
      <div className="flex h-full flex-col">
        <div className="flex-1 w-full overflow-y-auto p-5 md:pl-10">
          <Button variant="ghost" onClick={() => navigate(NEW_LAWNS_ROUTES.PROMOTIONS)} className="mb-4 text-muted-foreground hover:text-primary">
            <ArrowLeft className="h-4 w-4 mr-2" /> Back to Promotions
          </Button>
          <Navbar title="Add Promotion" subtitle="Create a new promotion or discount" showWelcome={false} superAccess />
          <div className="max-w-2xl mt-6 space-y-6">
            <div className="rounded-xl border border-border bg-white p-6 shadow-sm space-y-5">
              <div className="space-y-2">
                <label className="text-sm font-medium">Title <span className="text-primary">*</span></label>
                <Input {...form.register('title')} placeholder="e.g. Spring Special" className="h-12 rounded-xl border-border bg-background" />
                {form.formState.errors.title && <p className="text-sm text-red-500">{form.formState.errors.title.message}</p>}
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Description <span className="text-primary">*</span></label>
                <Textarea {...form.register('description')} placeholder="Promotion description" className="min-h-[80px] rounded-xl border-border bg-background" />
                {form.formState.errors.description && <p className="text-sm text-red-500">{form.formState.errors.description.message}</p>}
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Code <span className="text-primary">*</span></label>
                  <Input {...form.register('code')} placeholder="e.g. SPRING15" className="h-12 rounded-xl border-border bg-background uppercase" />
                  {form.formState.errors.code && <p className="text-sm text-red-500">{form.formState.errors.code.message}</p>}
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Discount Type</label>
                  <Select onValueChange={(v) => form.setValue('discountType', v as any)} defaultValue="percentage">
                    <SelectTrigger className="h-12 rounded-xl border-border"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="percentage">Percentage (%)</SelectItem>
                      <SelectItem value="fixed">Fixed ($)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Value <span className="text-primary">*</span></label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">{discountType === 'percentage' ? '%' : '$'}</span>
                    <Input type="number" {...form.register('discountValue')} className="h-12 rounded-xl border-border bg-background pl-8" />
                  </div>
                  {form.formState.errors.discountValue && <p className="text-sm text-red-500">{form.formState.errors.discountValue.message}</p>}
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Min. Order</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                    <Input type="number" {...form.register('minOrder')} className="h-12 rounded-xl border-border bg-background pl-8" />
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Start Date <span className="text-primary">*</span></label>
                  <Input type="date" {...form.register('startDate')} className="h-12 rounded-xl border-border bg-background" />
                  {form.formState.errors.startDate && <p className="text-sm text-red-500">{form.formState.errors.startDate.message}</p>}
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">End Date <span className="text-primary">*</span></label>
                  <Input type="date" {...form.register('endDate')} className="h-12 rounded-xl border-border bg-background" />
                  {form.formState.errors.endDate && <p className="text-sm text-red-500">{form.formState.errors.endDate.message}</p>}
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Status</label>
                <Select onValueChange={(v) => form.setValue('status', v as any)} defaultValue="active">
                  <SelectTrigger className="h-12 rounded-xl border-border"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex gap-3 pt-4">
                <Button onClick={form.handleSubmit(onSubmit)} disabled={isLoading} className="h-12 rounded-xl bg-green-600 hover:bg-green-700 px-8">
                  {isLoading ? 'Creating...' : 'Create Promotion'}
                </Button>
                <Button variant="outline" onClick={() => navigate(NEW_LAWNS_ROUTES.PROMOTIONS)} className="h-12 rounded-xl px-8">Cancel</Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </SuperAdminLayout>
  );
}
