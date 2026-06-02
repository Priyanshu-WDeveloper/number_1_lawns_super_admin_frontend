import { useParams, useNavigate } from 'react-router-dom';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ArrowLeft, Plus, X } from 'lucide-react';
import toast from 'react-hot-toast';

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
import { getErrorMessage } from '@/lib/get-error-message';
import { NEW_LAWNS_ROUTES } from '@/constants/new-lawns-routes';
import {
  useGetNLServiceByIdQuery,
  useUpdateNLServiceMutation,
} from '@/API/new-lawns-api';
import Loader from '@/components/loader';

const serviceSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  slug: z
    .string()
    .min(1, 'Slug is required')
    .regex(
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      'Slug must be lowercase with hyphens',
    ),
  description: z.string().min(1, 'Description is required'),
  price: z.string().min(1, 'Price is required'),
  category: z.enum(['installation', 'maintenance', 'design']),
  status: z.enum(['active', 'inactive']),
  features: z
    .array(z.string().min(1, 'Feature cannot be empty'))
    .min(1, 'At least one feature is required'),
});

type ServiceFormData = z.infer<typeof serviceSchema>;

const EditServicePage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [updateNLService, { isLoading: isUpdating }] =
    useUpdateNLServiceMutation();

  const { data: service, isLoading } = useGetNLServiceByIdQuery(id!);

  const {
    register,
    handleSubmit,
    control,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ServiceFormData>({
    resolver: zodResolver(serviceSchema),
    values: service
      ? {
          title: service.title,
          slug: service.slug,
          description: service.description,
          price: service.price,
          category: service.category,
          status: service.status,
          features: service.features,
        }
      : undefined,
  });

  const { fields, append, remove } = (useFieldArray as any)({
    control,
    name: 'features',
  });

  const onSubmit = async (data: ServiceFormData) => {
    try {
      await updateNLService({ id: id!, ...data }).unwrap();
      toast.success('Service updated successfully');
      navigate(NEW_LAWNS_ROUTES.SERVICES);
    } catch (error) {
      toast.error(
        getErrorMessage(error, 'Failed to update service'),
      );
    }
  };

  if (isLoading) {
    return (
      <SuperAdminLayout>
        <Loader />
      </SuperAdminLayout>
    );
  }

  if (!service) {
    return (
      <SuperAdminLayout>
        <div className="flex h-full items-center justify-center">
          <p className="text-muted-foreground">Service not found</p>
        </div>
      </SuperAdminLayout>
    );
  }

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
            title="Edit Service"
            subtitle="Update lawn care service details"
            showWelcome={false}
            superAccess
          />

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="mt-6 space-y-8"
          >
            <div className="rounded-xl border border-[#ececec] bg-white p-6 shadow-sm">
              <h3 className="mb-6 text-lg font-semibold text-foreground">
                Basic Information
              </h3>

              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">
                    Title
                    <span className="text-primary"> *</span>
                  </label>
                  <Input
                    placeholder="Lawn Mowing"
                    {...register('title')}
                    className="h-12 rounded-xl border-border bg-background"
                  />
                  {errors.title && (
                    <p className="text-sm text-red-500">
                      {errors.title.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">
                    Slug
                    <span className="text-primary"> *</span>
                  </label>
                  <Input
                    placeholder="lawn-mowing"
                    {...register('slug')}
                    className="h-12 rounded-xl border-border bg-background"
                  />
                  {errors.slug && (
                    <p className="text-sm text-red-500">
                      {errors.slug.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2 md:col-span-2">
                  <label className="text-sm font-medium text-foreground">
                    Description
                    <span className="text-primary"> *</span>
                  </label>
                  <textarea
                    placeholder="Describe the service in detail..."
                    {...register('description')}
                    rows={4}
                    className="flex w-full rounded-xl border border-border bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  />
                  {errors.description && (
                    <p className="text-sm text-red-500">
                      {errors.description.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">
                    Price
                    <span className="text-primary"> *</span>
                  </label>
                  <Input
                    placeholder="$99"
                    {...register('price')}
                    className="h-12 rounded-xl border-border bg-background"
                  />
                  {errors.price && (
                    <p className="text-sm text-red-500">
                      {errors.price.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">
                    Category
                    <span className="text-primary"> *</span>
                  </label>
                  <Select
                    value={watch('category')}
                    onValueChange={(val) =>
                      setValue('category', val as 'installation' | 'maintenance' | 'design')}
                  >
                    <SelectTrigger className="h-12 rounded-xl border-border">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="installation">
                        Installation
                      </SelectItem>
                      <SelectItem value="maintenance">
                        Maintenance
                      </SelectItem>
                      <SelectItem value="design">Design</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.category && (
                    <p className="text-sm text-red-500">
                      {errors.category.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">
                    Status
                    <span className="text-primary"> *</span>
                  </label>
                  <Select
                    value={watch('status')}
                    onValueChange={(val) =>
                      setValue('status', val as 'active' | 'inactive')
                    }
                  >
                    <SelectTrigger className="h-12 rounded-xl border-border">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">
                        Inactive
                      </SelectItem>
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

            <div className="rounded-xl border border-[#ececec] bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-foreground">
                  Features
                </h3>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => append('')}
                  className="rounded-xl"
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Add Feature
                </Button>
              </div>
              <div className="space-y-3">
                {fields.map((field: any, index: number) => (
                  <div
                    key={field.id}
                    className="flex items-center gap-2"
                  >
                    <Input
                      placeholder={`Feature ${index + 1}`}
                      {...register(`features.${index}`)}
                      className="h-12 rounded-xl border-border bg-background flex-1"
                    />
                    {fields.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => remove(index)}
                        className="h-12 w-12 shrink-0 rounded-xl text-red-500 hover:text-red-600 hover:bg-red-50"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
                {errors.features && (
                  <p className="text-sm text-red-500">
                    {errors.features.message ||
                      errors.features.root?.message}
                  </p>
                )}
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
                disabled={isUpdating}
                className="h-12 rounded-xl bg-green-600 text-white hover:bg-green-700 px-6"
              >
                {isUpdating ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </SuperAdminLayout>
  );
};

export default EditServicePage;
