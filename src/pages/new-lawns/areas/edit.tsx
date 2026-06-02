import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
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
import { useUpdateNLAreaMutation } from '@/API/new-lawns-api';
import { NEW_LAWNS_ROUTES } from '@/constants/new-lawns-routes';
import { getErrorMessage } from '@/lib/get-error-message';
import type { NewLawnArea } from '@/types/new-lawns.types';

const areaSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  region: z.string().min(1, 'Region is required'),
  description: z.string().min(20, 'Description must be at least 20 characters'),
  status: z.enum(['active', 'inactive']),
  image: z.string().optional(),
});

type AreaFormData = z.infer<typeof areaSchema>;

export default function EditAreaPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const passedData = location.state?.area as NewLawnArea | undefined;

  const [updateArea, { isLoading }] = useUpdateNLAreaMutation();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<AreaFormData>({
    resolver: zodResolver(areaSchema),
    values: passedData
      ? {
          name: passedData.name,
          region: passedData.region,
          description: passedData.description,
          status: passedData.status,
          image: passedData.image ?? '',
        }
      : undefined,
    defaultValues: passedData
      ? undefined
      : {
          name: '',
          region: '',
          description: '',
          status: 'active',
          image: '',
        },
  });

  const selectedStatus = watch('status');

  useEffect(() => {
    if (!passedData) {
      toast.error('No area data provided');
      navigate(NEW_LAWNS_ROUTES.AREAS);
    }
  }, [passedData, navigate]);

  if (!passedData) return null;

  const onSubmit = async (data: AreaFormData) => {
    try {
      await updateArea({ id: passedData._id, ...data }).unwrap();
      toast.success('Area updated successfully');
      navigate(NEW_LAWNS_ROUTES.AREAS);
    } catch (err) {
      toast.error(getErrorMessage(err, 'Failed to update area'));
    }
  };

  return (
    <SuperAdminLayout>
      <Navbar title="Edit Area" subtitle="Update service area" superAccess />
      <div className="flex-1 px-6 pb-6">
        <div className="max-w-2xl mx-auto">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-medium">Name</label>
              <Input
                id="name"
                placeholder="Area name"
                {...register('name')}
              />
              {errors.name && (
                <p className="text-sm text-red-500">{errors.name.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <label htmlFor="region" className="text-sm font-medium">Region</label>
              <Input
                id="region"
                placeholder="Region"
                {...register('region')}
              />
              {errors.region && (
                <p className="text-sm text-red-500">{errors.region.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <label htmlFor="description" className="text-sm font-medium">Description</label>
              <Textarea
                id="description"
                placeholder="Enter area description"
                className="min-h-[120px]"
                {...register('description')}
              />
              {errors.description && (
                <p className="text-sm text-red-500">{errors.description.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <label htmlFor="image" className="text-sm font-medium">Image URL (optional)</label>
              <Input
                id="image"
                placeholder="https://example.com/image.jpg"
                {...register('image')}
              />
              {errors.image && (
                <p className="text-sm text-red-500">{errors.image.message}</p>
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
                {isLoading ? 'Updating...' : 'Update Area'}
              </Button>
              <Button type="button" variant="outline" onClick={() => navigate(NEW_LAWNS_ROUTES.AREAS)}>
                Cancel
              </Button>
            </div>
          </form>
        </div>
      </div>
    </SuperAdminLayout>
  );
}
