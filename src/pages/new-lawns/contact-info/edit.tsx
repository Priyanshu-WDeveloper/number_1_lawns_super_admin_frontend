import { useNavigate, useLocation } from 'react-router-dom';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';
import { SuperAdminLayout } from '@/components/layout/super-layout';
import { Navbar } from '@/components/layout/navbar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useUpdateNLContactInfoMutation } from '@/API/new-lawns-api';
import { NEW_LAWNS_ROUTES } from '@/constants/new-lawns-routes';
import { getErrorMessage } from '@/lib/get-error-message';
import type { NewLawnContactInfo } from '@/types/new-lawns.types';

const schema = z.object({
  type: z.enum(['phone', 'email', 'address', 'social', 'hours']),
  label: z.string().min(1, 'Label is required'),
  value: z.string().min(1, 'Value is required'),
  icon: z.string().optional(),
  order: z.coerce.number().int().min(0),
  status: z.enum(['active', 'inactive']),
});

type FormData = z.infer<typeof schema>;

export default function EditContactInfoPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const item = location.state?.contact as NewLawnContactInfo | undefined;
  const [updateItem, { isLoading }] = useUpdateNLContactInfoMutation();

  const form = useForm<FormData>({
    resolver: zodResolver(schema) as any,
    values: item ? {
      type: item.type, label: item.label, value: item.value,
      icon: item.icon ?? '', order: item.order, status: item.status,
    } : undefined,
  });

  if (!item) {
    return (
      <SuperAdminLayout>
        <div className="flex h-full items-center justify-center"><p className="text-muted-foreground">No contact data. Go back and try again.</p></div>
      </SuperAdminLayout>
    );
  }

  const onSubmit = async (data: FormData) => {
    try {
      await updateItem({ id: item._id, ...data }).unwrap();
      toast.success('Contact info updated');
      navigate(NEW_LAWNS_ROUTES.CONTACT_INFO);
    } catch (err) {
      toast.error(getErrorMessage(err, 'Failed to update'));
    }
  };

  return (
    <SuperAdminLayout>
      <div className="flex h-full flex-col">
        <div className="flex-1 w-full overflow-y-auto p-5 md:pl-10">
          <Button variant="ghost" onClick={() => navigate(NEW_LAWNS_ROUTES.CONTACT_INFO)} className="mb-4 text-muted-foreground hover:text-primary">
            <ArrowLeft className="h-4 w-4 mr-2" /> Back to Contact Info
          </Button>
          <Navbar title="Edit Contact Info" subtitle="Update contact information" showWelcome={false} superAccess />
          <div className="max-w-2xl mt-6 space-y-6">
            <div className="rounded-xl border border-border bg-white p-6 shadow-sm space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Type</label>
                  <Select onValueChange={(v) => form.setValue('type', v as any)} value={form.watch('type')}>
                    <SelectTrigger className="h-12 rounded-xl border-border"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="phone">Phone</SelectItem>
                      <SelectItem value="email">Email</SelectItem>
                      <SelectItem value="address">Address</SelectItem>
                      <SelectItem value="social">Social</SelectItem>
                      <SelectItem value="hours">Hours</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Order</label>
                  <Input type="number" {...form.register('order')} className="h-12 rounded-xl border-border bg-background" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Label</label>
                <Input {...form.register('label')} className="h-12 rounded-xl border-border bg-background" />
                {form.formState.errors.label && <p className="text-sm text-red-500">{form.formState.errors.label.message}</p>}
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Value</label>
                <Input {...form.register('value')} className="h-12 rounded-xl border-border bg-background" />
                {form.formState.errors.value && <p className="text-sm text-red-500">{form.formState.errors.value.message}</p>}
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Icon</label>
                <Input {...form.register('icon')} className="h-12 rounded-xl border-border bg-background" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Status</label>
                <Select onValueChange={(v) => form.setValue('status', v as any)} value={form.watch('status')}>
                  <SelectTrigger className="h-12 rounded-xl border-border"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex gap-3 pt-4">
                <Button onClick={form.handleSubmit(onSubmit)} disabled={isLoading} className="h-12 rounded-xl bg-green-600 hover:bg-green-700 px-8">
                  {isLoading ? 'Updating...' : 'Update Contact'}
                </Button>
                <Button variant="outline" onClick={() => navigate(NEW_LAWNS_ROUTES.CONTACT_INFO)} className="h-12 rounded-xl px-8">Cancel</Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </SuperAdminLayout>
  );
}
