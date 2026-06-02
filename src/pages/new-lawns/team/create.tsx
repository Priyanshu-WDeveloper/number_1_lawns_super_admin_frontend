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
import { useCreateNLTeamMemberMutation } from '@/API/new-lawns-api';
import { NEW_LAWNS_ROUTES } from '@/constants/new-lawns-routes';
import { getErrorMessage } from '@/lib/get-error-message';

const schema = z.object({
  name: z.string().min(1, 'Name is required'),
  role: z.string().min(1, 'Role is required'),
  bio: z.string().min(1, 'Bio is required'),
  email: z.string().min(1, 'Email is required').email('Invalid email'),
  phone: z.string().optional(),
  image: z.string().optional(),
  order: z.coerce.number().int().min(0),
  status: z.enum(['active', 'inactive']),
});

type FormData = z.infer<typeof schema>;

export default function CreateTeamPage() {
  const navigate = useNavigate();
  const [createItem, { isLoading }] = useCreateNLTeamMemberMutation();
  const form = useForm<FormData>({
    resolver: zodResolver(schema) as any,
    defaultValues: { name: '', role: '', bio: '', email: '', phone: '', image: '', order: 1, status: 'active' },
  });

  const onSubmit = async (data: FormData) => {
    try {
      await createItem(data).unwrap();
      toast.success('Team member created');
      navigate(NEW_LAWNS_ROUTES.TEAM);
    } catch (err) {
      toast.error(getErrorMessage(err, 'Failed to create'));
    }
  };

  return (
    <SuperAdminLayout>
      <div className="flex h-full flex-col">
        <div className="flex-1 w-full overflow-y-auto p-5 md:pl-10">
          <Button variant="ghost" onClick={() => navigate(NEW_LAWNS_ROUTES.TEAM)} className="mb-4 text-muted-foreground hover:text-primary">
            <ArrowLeft className="h-4 w-4 mr-2" /> Back to Team
          </Button>
          <Navbar title="Add Team Member" subtitle="Add a new team member" showWelcome={false} superAccess />
          <div className="max-w-2xl mt-6 space-y-6">
            <div className="rounded-xl border border-border bg-white p-6 shadow-sm space-y-5">
              <div className="space-y-2">
                <label className="text-sm font-medium">Name <span className="text-primary">*</span></label>
                <Input {...form.register('name')} placeholder="Full name" className="h-12 rounded-xl border-border bg-background" />
                {form.formState.errors.name && <p className="text-sm text-red-500">{form.formState.errors.name.message}</p>}
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Role <span className="text-primary">*</span></label>
                  <Input {...form.register('role')} placeholder="e.g. Lead Installer" className="h-12 rounded-xl border-border bg-background" />
                  {form.formState.errors.role && <p className="text-sm text-red-500">{form.formState.errors.role.message}</p>}
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Order</label>
                  <Input type="number" {...form.register('order')} className="h-12 rounded-xl border-border bg-background" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Bio <span className="text-primary">*</span></label>
                <Textarea {...form.register('bio')} placeholder="Brief bio" className="min-h-[100px] rounded-xl border-border bg-background" />
                {form.formState.errors.bio && <p className="text-sm text-red-500">{form.formState.errors.bio.message}</p>}
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Email <span className="text-primary">*</span></label>
                  <Input {...form.register('email')} placeholder="email@example.com" className="h-12 rounded-xl border-border bg-background" />
                  {form.formState.errors.email && <p className="text-sm text-red-500">{form.formState.errors.email.message}</p>}
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Phone</label>
                  <Input {...form.register('phone')} placeholder="021 123 4567" className="h-12 rounded-xl border-border bg-background" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Image URL</label>
                <Input {...form.register('image')} placeholder="https://example.com/photo.jpg" className="h-12 rounded-xl border-border bg-background" />
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
                  {isLoading ? 'Creating...' : 'Create Member'}
                </Button>
                <Button variant="outline" onClick={() => navigate(NEW_LAWNS_ROUTES.TEAM)} className="h-12 rounded-xl px-8">Cancel</Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </SuperAdminLayout>
  );
}
