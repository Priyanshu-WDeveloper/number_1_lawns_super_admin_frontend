import { useForm, type UseFormReturn } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ImageUploadField } from '@/components/forms/image-upload';

const CATEGORIES = [
  'Lawn Mowing',
  'Landscaping',
  'Hedge Trimming',
  'Tree Work',
  'Clean-Ups',
] as const;

const gallerySchema = z.object({
  image: z.string().optional(),
  beforeImage: z.string().optional(),
  afterImage: z.string().optional(),
  category: z.string().min(1, 'Category is required'),
  isBeforeAfter: z.boolean(),
}).superRefine((data, ctx) => {
  if (data.isBeforeAfter) {
    if (!data.beforeImage) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['beforeImage'], message: 'Before image is required' });
    }
    if (!data.afterImage) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['afterImage'], message: 'After image is required' });
    }
  } else {
    if (!data.image) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['image'], message: 'Image is required' });
    }
  }
});

type GalleryFormData = z.infer<typeof gallerySchema>;

interface GalleryFormFieldsProps {
  form: UseFormReturn<GalleryFormData>;
}

function GalleryFormFields({ form }: GalleryFormFieldsProps) {
  const isBeforeAfter = form.watch('isBeforeAfter');
  const { setValue, formState: { errors } } = form;

  return (
    <>
      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground">
          Category
          <span className="text-primary"> *</span>
        </label>
        <Select
          onValueChange={(v) => setValue('category', v)}
          defaultValue={form.getValues('category')}
        >
          <SelectTrigger className="h-12 rounded-xl border-border bg-background">
            <SelectValue placeholder="Select category" />
          </SelectTrigger>
          <SelectContent>
            {CATEGORIES.map((cat) => (
              <SelectItem key={cat} value={cat}>{cat}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {isBeforeAfter ? (
        <div className="grid grid-cols-2 gap-4">
          <ImageUploadField
            label="Before Image"
            value={form.watch('beforeImage')}
            onChange={(url) => form.setValue('beforeImage', url, { shouldValidate: true })}
            error={errors.beforeImage?.message}
            required
          />
          <ImageUploadField
            label="After Image"
            value={form.watch('afterImage')}
            onChange={(url) => form.setValue('afterImage', url, { shouldValidate: true })}
            error={errors.afterImage?.message}
            required
          />
        </div>
      ) : (
        <ImageUploadField
          value={form.watch('image')}
          onChange={(url) => form.setValue('image', url, { shouldValidate: true })}
          error={errors.image?.message}
          required
        />
      )}

      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground">Before/After</label>
        <Select
          onValueChange={(v) => setValue('isBeforeAfter', v === 'true')}
          defaultValue={String(form.getValues('isBeforeAfter'))}
        >
          <SelectTrigger className="h-12 rounded-xl border-border bg-background">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="true">Yes</SelectItem>
            <SelectItem value="false">No</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </>
  );
}

function useGalleryForm(defaultValues?: Partial<GalleryFormData>) {
  return useForm<GalleryFormData>({
    resolver: zodResolver(gallerySchema),
    defaultValues: {
      image: '',
      beforeImage: '',
      afterImage: '',
      category: 'Lawn Mowing',
      isBeforeAfter: false,
      ...defaultValues,
    },
  });
}

export { gallerySchema, GalleryFormFields, useGalleryForm, CATEGORIES };
export type { GalleryFormData };