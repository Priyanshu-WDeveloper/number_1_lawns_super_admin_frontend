import { useForm, type UseFormReturn } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

import { Input } from '@/components/ui/input';
import { ImageUploadField } from '@/components/forms/image-upload';

const serviceSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  image: z.string().optional(),
});

type ServiceFormData = z.infer<typeof serviceSchema>;

interface ServiceFormFieldsProps {
  form: UseFormReturn<ServiceFormData>;
}

function ServiceFormFields({ form }: ServiceFormFieldsProps) {
  const {
    register,
    formState: { errors },
  } = form;

  return (
    <>
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

      <ImageUploadField
        value={form.watch('image')}
        onChange={(url) => form.setValue('image', url)}
        error={errors.image?.message}
        required
      />
    </>
  );
}

function useServiceForm(defaultValues?: Partial<ServiceFormData>) {
  return useForm<ServiceFormData>({
    resolver: zodResolver(serviceSchema),
    defaultValues: {
      title: '',
      description: '',
      image: '',
      ...defaultValues,
    },
  });
}

export { serviceSchema, ServiceFormFields, useServiceForm };
export type { ServiceFormData };
