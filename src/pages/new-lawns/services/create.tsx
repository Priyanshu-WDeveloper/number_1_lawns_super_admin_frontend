import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';

import { SuperAdminLayout } from '@/components/layout/super-layout';
import { Navbar } from '@/components/layout/navbar';
import { Button } from '@/components/ui/button';
import { getErrorMessage } from '@/lib/get-error-message';
import { NEW_LAWNS_ROUTES } from '@/constants/new-lawns-routes';
import { useCreateNLServiceMutation } from '@/API/new-lawns-api';
import {
  ServiceFormFields,
  useServiceForm,
  type ServiceFormData,
} from './components/service-form';

const CreateServicePage = () => {
  const navigate = useNavigate();
  const [createNLService, { isLoading }] =
    useCreateNLServiceMutation();
  const form = useServiceForm();

  const onSubmit = async (data: ServiceFormData) => {
    try {
      await createNLService(data).unwrap();
      toast.success('Service created successfully');
      navigate(NEW_LAWNS_ROUTES.SERVICES);
    } catch (error) {
      toast.error(getErrorMessage(error, 'Failed to create service'));
    }
  };

  return (
    <SuperAdminLayout>
      <div className="flex h-full flex-col">
        <div className="flex-1 w-full overflow-y-auto p-5 md:pl-10">
          <Button
            variant="ghost"
            onClick={() => navigate(NEW_LAWNS_ROUTES.SERVICES)}
            className="mb-4 text-muted-foreground hover:text-primary hover:bg-primary/10"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Services
          </Button>

          <Navbar
            title="Add Service"
            subtitle="Create a new lawn care service"
            showWelcome={false}
            superAccess
          />

          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="mt-6 space-y-8 max-w-2xl"
          >
            <div className="rounded-xl border border-[#ececec] bg-white p-6 shadow-sm">
              <h3 className="mb-6 text-lg font-semibold text-foreground">
                Service Details
              </h3>

              <div className="space-y-5">
                <ServiceFormFields form={form} />
              </div>
            </div>

            <div className="flex justify-end gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate(NEW_LAWNS_ROUTES.SERVICES)}
                className="h-12 rounded-xl px-6"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isLoading}
                className="h-12 rounded-xl bg-green-600 text-white hover:bg-green-700 px-6"
              >
                {isLoading ? 'Creating...' : 'Create Service'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </SuperAdminLayout>
  );
};

export default CreateServicePage;
