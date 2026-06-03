import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';

import { SuperAdminLayout } from '@/components/layout/super-layout';
import { Navbar } from '@/components/layout/navbar';
import { Button } from '@/components/ui/button';
import { useCreateNLGalleryItemMutation } from '@/API/new-lawns-api';
import { NEW_LAWNS_ROUTES } from '@/constants/new-lawns-routes';
import { getErrorMessage } from '@/lib/get-error-message';
import {
  GalleryFormFields,
  useGalleryForm,
  type GalleryFormData,
} from './components/gallery-form';

export default function CreateGalleryPage() {
  const navigate = useNavigate();
  const [createItem, { isLoading }] = useCreateNLGalleryItemMutation();
  const form = useGalleryForm();

  const onSubmit = async (data: GalleryFormData) => {
    try {
      await createItem(data).unwrap();
      toast.success('Gallery image created');
      navigate(NEW_LAWNS_ROUTES.GALLERY);
    } catch (err) {
      toast.error(getErrorMessage(err, 'Failed to create'));
    }
  };

  return (
    <SuperAdminLayout>
      <div className="flex h-full flex-col">
        <div className="flex-1 w-full overflow-y-auto p-5 md:pl-10">
          <Button variant="ghost" onClick={() => navigate(NEW_LAWNS_ROUTES.GALLERY)} className="mb-4 text-muted-foreground hover:text-primary">
            <ArrowLeft className="h-4 w-4 mr-2" /> Back to Gallery
          </Button>
          <Navbar title="Add Gallery Image" subtitle="Add a new gallery image" showWelcome={false} superAccess />
          <div className="max-w-2xl mt-6 space-y-6">
            <div className="rounded-xl border border-border bg-white p-6 shadow-sm space-y-5">
              <GalleryFormFields form={form} />
              <div className="flex gap-3 pt-4">
                <Button onClick={form.handleSubmit(onSubmit)} disabled={isLoading} className="h-12 rounded-xl bg-green-600 hover:bg-green-700 px-8">
                  {isLoading ? 'Creating...' : 'Create Image'}
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
