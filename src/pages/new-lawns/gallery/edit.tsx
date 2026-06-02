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
import { useUpdateNLGalleryItemMutation } from '@/API/new-lawns-api';
import { NEW_LAWNS_ROUTES } from '@/constants/new-lawns-routes';
import { getErrorMessage } from '@/lib/get-error-message';
import type { NewLawnGalleryItem } from '@/types/new-lawns.types';

const schema = z.object({
  title: z.string().min(1, 'Title is required'),
  image: z.string().min(1, 'Image URL is required'),
  category: z.enum(['artificial', 'natural', 'before-after', 'design', 'other']),
  status: z.enum(['active', 'inactive']),
});

type FormData = z.infer<typeof schema>;

export default function EditGalleryPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const item = location.state?.gallery as NewLawnGalleryItem | undefined;
  const [updateItem, { isLoading }] = useUpdateNLGalleryItemMutation();

  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    values: item ? { title: item.title, image: item.image, category: item.category, status: item.status } : undefined,
  });

  if (!item) {
    return (
      <SuperAdminLayout>
        <div className="flex h-full items-center justify-center"><p className="text-muted-foreground">No gallery item data. Go back and try again.</p></div>
      </SuperAdminLayout>
    );
  }

  const onSubmit = async (data: FormData) => {
    try {
      await updateItem({ id: item._id, ...data }).unwrap();
      toast.success('Gallery image updated');
      navigate(NEW_LAWNS_ROUTES.GALLERY);
    } catch (err) {
      toast.error(getErrorMessage(err, 'Failed to update'));
    }
  };

  return (
    <SuperAdminLayout>
      <div className="flex h-full flex-col">
        <div className="flex-1 w-full overflow-y-auto p-5 md:pl-10">
          <Button variant="ghost" onClick={() => navigate(NEW_LAWNS_ROUTES.GALLERY)} className="mb-4 text-muted-foreground hover:text-primary">
            <ArrowLeft className="h-4 w-4 mr-2" /> Back to Gallery
          </Button>
          <Navbar title="Edit Gallery Image" subtitle="Update gallery image details" showWelcome={false} superAccess />
          <div className="max-w-2xl mt-6 space-y-6">
            <div className="rounded-xl border border-border bg-white p-6 shadow-sm space-y-5">
              <div className="space-y-2">
                <label className="text-sm font-medium">Title <span className="text-primary">*</span></label>
                <Input {...form.register('title')} className="h-12 rounded-xl border-border bg-background" />
                {form.formState.errors.title && <p className="text-sm text-red-500">{form.formState.errors.title.message}</p>}
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Category <span className="text-primary">*</span></label>
                <Select onValueChange={(v) => form.setValue('category', v as any)} value={form.watch('category')}>
                  <SelectTrigger className="h-12 rounded-xl border-border"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="artificial">Artificial</SelectItem>
                    <SelectItem value="natural">Natural</SelectItem>
                    <SelectItem value="before-after">Before/After</SelectItem>
                    <SelectItem value="design">Design</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Image URL <span className="text-primary">*</span></label>
                <Input {...form.register('image')} className="h-12 rounded-xl border-border bg-background" />
                {form.formState.errors.image && <p className="text-sm text-red-500">{form.formState.errors.image.message}</p>}
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
                  {isLoading ? 'Updating...' : 'Update Image'}
                </Button>
                <Button variant="outline" onClick={() => navigate(NEW_LAWNS_ROUTES.GALLERY)} className="h-12 rounded-xl px-8">Cancel</Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </SuperAdminLayout>
  );
}
