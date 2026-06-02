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
import { useCreateNLPageContentMutation } from '@/API/new-lawns-api';
import { NEW_LAWNS_ROUTES } from '@/constants/new-lawns-routes';
import { getErrorMessage } from '@/lib/get-error-message';

const schema = z.object({
  page: z.enum(['home', 'services', 'about', 'gallery', 'reviews', 'areas', 'contact']),
  section: z.string().min(1, 'Section is required'),
  title: z.string().min(1, 'Title is required'),
  subtitle: z.string().optional(),
  content: z.string().optional(),
  image: z.string().optional(),
  seoTitle: z.string().optional(),
  seoDescription: z.string().optional(),
  status: z.enum(['active', 'inactive']),
});

type FormData = z.infer<typeof schema>;

export default function CreatePageContentPage() {
  const navigate = useNavigate();
  const [createItem, { isLoading }] = useCreateNLPageContentMutation();
  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { page: 'home', section: '', title: '', subtitle: '', content: '', image: '', seoTitle: '', seoDescription: '', status: 'active' },
  });

  const onSubmit = async (data: FormData) => {
    try {
      await createItem(data).unwrap();
      toast.success('Content created');
      navigate(NEW_LAWNS_ROUTES.PAGE_CONTENT);
    } catch (err) {
      toast.error(getErrorMessage(err, 'Failed to create'));
    }
  };

  return (
    <SuperAdminLayout>
      <div className="flex h-full flex-col">
        <div className="flex-1 w-full overflow-y-auto p-5 md:pl-10">
          <Button variant="ghost" onClick={() => navigate(NEW_LAWNS_ROUTES.PAGE_CONTENT)} className="mb-4 text-muted-foreground hover:text-primary">
            <ArrowLeft className="h-4 w-4 mr-2" /> Back to Content
          </Button>
          <Navbar title="Add Page Content" subtitle="Create new page content section" showWelcome={false} superAccess />
          <div className="max-w-2xl mt-6 space-y-6">
            <div className="rounded-xl border border-border bg-white p-6 shadow-sm space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Page <span className="text-primary">*</span></label>
                  <Select onValueChange={(v) => form.setValue('page', v as any)} defaultValue="home">
                    <SelectTrigger className="h-12 rounded-xl border-border"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="home">Home</SelectItem>
                      <SelectItem value="services">Services</SelectItem>
                      <SelectItem value="about">About</SelectItem>
                      <SelectItem value="gallery">Gallery</SelectItem>
                      <SelectItem value="reviews">Reviews</SelectItem>
                      <SelectItem value="areas">Areas</SelectItem>
                      <SelectItem value="contact">Contact</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Section <span className="text-primary">*</span></label>
                  <Input {...form.register('section')} placeholder="e.g. hero, features, cta" className="h-12 rounded-xl border-border bg-background" />
                  {form.formState.errors.section && <p className="text-sm text-red-500">{form.formState.errors.section.message}</p>}
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Title <span className="text-primary">*</span></label>
                <Input {...form.register('title')} placeholder="Section title" className="h-12 rounded-xl border-border bg-background" />
                {form.formState.errors.title && <p className="text-sm text-red-500">{form.formState.errors.title.message}</p>}
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Subtitle</label>
                <Input {...form.register('subtitle')} placeholder="Section subtitle" className="h-12 rounded-xl border-border bg-background" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Content</label>
                <Textarea {...form.register('content')} placeholder="Main content text..." className="rounded-xl border-border bg-background min-h-[120px]" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Image URL</label>
                <Input {...form.register('image')} placeholder="https://..." className="h-12 rounded-xl border-border bg-background" />
              </div>
              <div className="border-t pt-4">
                <h4 className="text-sm font-medium mb-3 text-muted-foreground uppercase tracking-wide">SEO Settings</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">SEO Title</label>
                    <Input {...form.register('seoTitle')} placeholder="Meta title" className="h-12 rounded-xl border-border bg-background" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">SEO Description</label>
                    <Input {...form.register('seoDescription')} placeholder="Meta description" className="h-12 rounded-xl border-border bg-background" />
                  </div>
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
                  {isLoading ? 'Creating...' : 'Create Content'}
                </Button>
                <Button variant="outline" onClick={() => navigate(NEW_LAWNS_ROUTES.PAGE_CONTENT)} className="h-12 rounded-xl px-8">Cancel</Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </SuperAdminLayout>
  );
}
