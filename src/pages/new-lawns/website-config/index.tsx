import { useState, useCallback } from 'react';
import { useForm, useFieldArray, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Plus, X, Globe, Image, Phone, Info, GripVertical, ChevronDown } from 'lucide-react';
import toast from 'react-hot-toast';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core';
import {
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import * as Accordion from '@radix-ui/react-accordion';

import { SuperAdminLayout } from '@/components/layout/super-layout';
import { Navbar } from '@/components/layout/navbar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ImageUploadField } from '@/components/forms/image-upload';
import { ImageWithFallback } from '@/components/ui/image-with-fallback';
import {
  useGetNLWebsiteConfigQuery,
  useUpdateNLWebsiteConfigMutation,
} from '@/API/new-lawns-api';
import { formatDistanceToNow } from 'date-fns';
import { getErrorMessage } from '@/lib/get-error-message';
import Loader from '@/components/loader';

const bannerSchema = z.object({
  image: z.string().min(1, 'Image is required'),
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
});

const featureSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
});

const statSchema = z.object({
  value: z.string().min(1, 'Value is required'),
  label: z.string().min(1, 'Label is required'),
});

const configSchema = z.object({
  websiteName: z.string().min(1, 'Website name is required'),
  websiteLogo: z.string().optional(),
  websiteBannerList: z
    .array(bannerSchema)
    .min(1, 'At least one banner is required'),
  websiteContactDetails: z.object({
    email: z.string().email('Invalid email'),
    phone: z.string().min(1, 'Phone is required'),
    businessHours: z.string().min(1, 'Business hours is required'),
    city: z.string().min(1, 'City is required'),
    address: z.string().min(1, 'Address is required'),
    provinces: z.string().min(1, 'Provinces is required'),
    country: z.string().min(1, 'Country is required'),
    countryCode: z.string().min(1, 'Country code is required'),
  }),
  websiteAboutUs: z.object({
    title: z.string().min(1, 'Title is required'),
    description: z.string().min(1, 'Description is required'),
    image: z.string().min(1, 'Image is required'),
    features: z.array(featureSchema),
    stats: z.array(statSchema),
  }),
});

type ConfigFormData = z.infer<typeof configSchema>;

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1">
      <label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{label}</label>
      <div className="text-sm font-medium text-foreground">{children}</div>
    </div>
  );
}

function SectionCard({
  id, title, count, icon: Icon, description, onEdit, children,
}: {
  id: string; title: string; icon: typeof Globe; description: string;
  count?: number; onEdit?: () => void; children: React.ReactNode;
}) {
  return (
    <div id={id} className="overflow-hidden rounded-2xl border border-border bg-white shadow-sm transition-shadow hover:shadow-md">
      <div className="flex items-center justify-between border-l-[5px] border-green-600 px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-green-50">
            <Icon className="h-4 w-4 text-green-600" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-semibold text-foreground">{title}</h3>
              {count !== undefined && (
                <span className="inline-flex h-6 min-w-6 items-center justify-center rounded-full bg-green-100 px-2 text-xs font-medium text-green-700">
                  {count}
                </span>
              )}
            </div>
            <p className="text-xs text-muted-foreground">{description}</p>
          </div>
        </div>
        {onEdit && (
          <Button type="button" variant="outline" onClick={onEdit}
            className="shrink-0 rounded-xl border-green-200 bg-green-50 text-green-700 hover:bg-green-100 hover:text-green-800">
            Edit
          </Button>
        )}
      </div>
      <div className="border-t-2 border-border/80 px-6 py-4">{children}</div>
    </div>
  );
}

function SortableItem({ id, children }: { id: string; children: React.ReactNode }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
  };
  return (
    <div ref={setNodeRef} style={style} className="group relative">
      <div className="absolute left-2 top-1/2 -translate-y-1/2 z-10">
        <button type="button"
          className="cursor-grab active:cursor-grabbing text-muted-foreground/40 hover:text-muted-foreground transition-colors p-0.5"
          {...attributes} {...listeners}>
          <GripVertical className="h-4 w-4" />
        </button>
      </div>
      {children}
    </div>
  );
}

function SortableBannerItem({
  id, index, register, errors, control, onRemove,
}: {
  id: string; index: number; register: any; errors: any; control: any; onRemove: () => void;
}) {
  return (
    <SortableItem id={id}>
      <Accordion.Item value={id} className="rounded-xl border border-border bg-gray-50/50 overflow-hidden">
        <Accordion.Header>
          <Accordion.Trigger className="flex w-full items-center justify-between pl-10 pr-4 py-3 text-sm font-semibold text-foreground hover:bg-gray-100/50 [&[data-state=open]>svg:last-child]:rotate-180">
            <span>Banner {index + 1}</span>
            <div className="flex items-center gap-1">
              <button type="button" onClick={(e) => { e.stopPropagation(); onRemove(); }}
                className="h-7 w-7 rounded-md text-muted-foreground/40 hover:text-red-500 hover:bg-red-50 transition-colors flex items-center justify-center">
                <X className="h-3.5 w-3.5" />
              </button>
              <ChevronDown className="h-4 w-4 text-muted-foreground transition-transform duration-200" />
            </div>
          </Accordion.Trigger>
        </Accordion.Header>
        <Accordion.Content className="border-t border-border px-4 py-4 data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div className="space-y-1">
              <label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Title</label>
              <Input {...register(`websiteBannerList.${index}.title`)} className="h-10 rounded-lg border-border bg-white" />
              {errors.websiteBannerList?.[index]?.title && (
                <p className="text-sm text-red-500">{errors.websiteBannerList[index].title?.message}</p>
              )}
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Description</label>
              <Input {...register(`websiteBannerList.${index}.description`)} className="h-10 rounded-lg border-border bg-white" />
              {errors.websiteBannerList?.[index]?.description && (
                <p className="text-sm text-red-500">{errors.websiteBannerList[index].description?.message}</p>
              )}
            </div>
            <Controller control={control} name={`websiteBannerList.${index}.image`}
              render={({ field: f, fieldState }) => (
                <ImageUploadField value={f.value} onChange={f.onChange} error={fieldState.error?.message} label="Image" required />
              )}
            />
          </div>
        </Accordion.Content>
      </Accordion.Item>
    </SortableItem>
  );
}

function SortableFeatureItem({
  id, index, register, onRemove,
}: {
  id: string; index: number; register: any; onRemove: () => void;
}) {
  return (
    <SortableItem id={id}>
      <div className="rounded-xl border border-border bg-white p-4 shadow-sm border-l-[3px] border-l-green-500">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-medium text-muted-foreground">Feature {index + 1}</span>
          <button type="button" onClick={onRemove}
            className="h-7 w-7 rounded-md text-muted-foreground/40 hover:text-red-500 hover:bg-red-50 transition-colors flex items-center justify-center">
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
        <div className="space-y-2">
          <Input {...register(`websiteAboutUs.features.${index}.title`)} placeholder="Feature title" className="h-10 rounded-lg border-border bg-background" />
          <Input {...register(`websiteAboutUs.features.${index}.description`)} placeholder="Feature description" className="h-10 rounded-lg border-border bg-background" />
        </div>
      </div>
    </SortableItem>
  );
}

function SortableStatItem({
  id, index, register, onRemove,
}: {
  id: string; index: number; register: any; onRemove: () => void;
}) {
  return (
    <SortableItem id={id}>
      <div className="flex flex-col items-center gap-2 rounded-xl border border-green-200 bg-white p-4 text-center shadow-sm">
        <div className="flex w-full items-start justify-end">
          <button type="button" onClick={onRemove}
            className="h-7 w-7 rounded-md text-muted-foreground/40 hover:text-red-500 hover:bg-red-50 transition-colors flex items-center justify-center">
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
        <div className="w-full space-y-2">
          <Input {...register(`websiteAboutUs.stats.${index}.value`)} placeholder="10+" className="h-10 rounded-lg border-border bg-white text-center text-lg font-bold" />
          <Input {...register(`websiteAboutUs.stats.${index}.label`)} placeholder="Years Experience" className="h-10 rounded-lg border-border bg-white text-center text-sm" />
        </div>
      </div>
    </SortableItem>
  );
}

export default function WebsiteConfigPage() {
  const [isEditing, setIsEditing] = useState(false);
  const { data: config, isLoading: isFetching } = useGetNLWebsiteConfigQuery();
  const [updateConfig, { isLoading: isUpdating }] = useUpdateNLWebsiteConfigMutation();

  const { register, handleSubmit, control, formState: { errors, isDirty } } = useForm<ConfigFormData>({
    resolver: zodResolver(configSchema),
    values: config ? {
      websiteName: config.websiteName,
      websiteLogo: config.websiteLogo || '',
      websiteBannerList: config.websiteBannerList,
      websiteContactDetails: config.websiteContactDetails,
      websiteAboutUs: {
        title: config.websiteAboutUs.title,
        description: config.websiteAboutUs.description,
        image: config.websiteAboutUs.image || '',
        features: config.websiteAboutUs.features,
        stats: config.websiteAboutUs.stats,
      },
    } : undefined,
  });

  const { fields: bannerFields, append: appendBanner, remove: removeBanner, move: moveBanner } = useFieldArray({ control, name: 'websiteBannerList' });
  const { fields: featureFields, append: appendFeature, remove: removeFeature, move: moveFeature } = useFieldArray({ control, name: 'websiteAboutUs.features' });
  const { fields: statFields, append: appendStat, remove: removeStat, move: moveStat } = useFieldArray({ control, name: 'websiteAboutUs.stats' });

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  const handleDragEnd = useCallback(
    (event: DragEndEvent, moveFn: (from: number, to: number) => void, fieldsArr: any[]) => {
      const { active, over } = event;
      if (!over || active.id === over.id) return;
      const oldIndex = fieldsArr.findIndex((f: any) => f.id === active.id);
      const newIndex = fieldsArr.findIndex((f: any) => f.id === over.id);
      if (oldIndex !== -1 && newIndex !== -1) moveFn(oldIndex, newIndex);
    }, [],
  );

  const handleBannerDragEnd = useCallback(
    (event: DragEndEvent) => handleDragEnd(event, moveBanner, bannerFields),
    [handleDragEnd, moveBanner, bannerFields],
  );
  const handleFeatureDragEnd = useCallback(
    (event: DragEndEvent) => handleDragEnd(event, moveFeature, featureFields),
    [handleDragEnd, moveFeature, featureFields],
  );
  const handleStatDragEnd = useCallback(
    (event: DragEndEvent) => handleDragEnd(event, moveStat, statFields),
    [handleDragEnd, moveStat, statFields],
  );

  const onSubmit = async (data: ConfigFormData) => {
    try {
      await updateConfig(data).unwrap();
      toast.success('Website config updated');
      setIsEditing(false);
    } catch (err) {
      toast.error(getErrorMessage(err, 'Failed to update config'));
    }
  };

  const enterEditMode = (sectionId?: string) => {
    setIsEditing(true);
    if (sectionId) {
      setTimeout(() => {
        document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    }
  };

  if (isFetching) {
    return (
      <SuperAdminLayout>
        <Loader />
      </SuperAdminLayout>
    );
  }

  const Actions = isEditing ? (
    <div className="flex items-center gap-2">
      {isDirty && (
        <span className="flex items-center gap-1.5 text-xs text-amber-600 font-medium">
          <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
          Unsaved changes
        </span>
      )}
      <Button type="button" variant="outline" onClick={() => setIsEditing(false)} className="h-10 rounded-xl px-5">
        Cancel
      </Button>
      <Button type="submit" disabled={isUpdating} className="h-10 rounded-xl bg-green-600 text-white hover:bg-green-700 px-5">
        {isUpdating ? 'Saving...' : 'Save Changes'}
      </Button>
    </div>
  ) : (
    <Button type="button" onClick={() => enterEditMode()} className="h-11 gap-2 rounded-xl px-6">
      Edit Configuration
    </Button>
  );

  return (
    <SuperAdminLayout>
      <div className="flex h-full flex-col">
        <div className="flex-1 w-full overflow-y-auto p-5 md:pl-10">
          <div className="sticky top-0 z-10 bg-[#F4F7EF] -mx-5 md:-ml-10 pb-4">
            <Navbar title="Website Config" subtitle="Manage website configuration" showWelcome={false} superAccess />
            <div className="mt-2 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-4 px-2 sm:px-5">
              {config && (
                <div className="flex items-center gap-2 flex-wrap min-w-0">
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-white px-3 py-1 text-xs font-medium text-muted-foreground">
                    <Image className="h-3.5 w-3.5" /> {config.websiteBannerList.length} Banners
                  </span>
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-white px-3 py-1 text-xs font-medium text-muted-foreground">
                    <span className="h-2 w-2 rounded-full bg-green-500" /> {config.websiteAboutUs.features.length} Features
                  </span>
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-white px-3 py-1 text-xs font-medium text-muted-foreground">
                    <span className="h-2 w-2 rounded-full bg-green-500" /> {config.websiteAboutUs.stats.length} Stats
                  </span>
                  {config.updatedAt && (
                    <span className="ml-1 text-xs text-muted-foreground">
                      Updated {formatDistanceToNow(new Date(config.updatedAt), { addSuffix: true })}
                    </span>
                  )}
                </div>
              )}
              <div className="flex-shrink-0 self-end sm:self-auto">{Actions}</div>
            </div>
          </div>

          <div className="space-y-10 pt-4">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-10">
              {/* GENERAL */}
              {isEditing ? (
                <SectionCard id="general" title="General" icon={Globe} description="Website name and logo">
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-end gap-4">
                    <div className="sm:flex-1 space-y-2">
                      <label className="text-sm font-medium">Website Name <span className="text-primary">*</span></label>
                      <Input {...register('websiteName')} className="h-10 rounded-xl border-border bg-background" />
                      {errors.websiteName && <p className="text-sm text-red-500">{errors.websiteName.message}</p>}
                    </div>
                    <Controller control={control} name="websiteLogo"
                      render={({ field, fieldState }) => (
                        <div className="w-full sm:w-auto">
                          <ImageUploadField value={field.value} onChange={field.onChange} error={fieldState.error?.message} label="Logo URL" />
                        </div>
                      )}
                    />
                  </div>
                </SectionCard>
              ) : (
                <SectionCard id="general" title="General" icon={Globe} description="Website name and logo" onEdit={() => enterEditMode('general')}>
                  <div className="flex flex-col sm:flex-row items-start gap-6">
                    <div>
                      <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Website Name</p>
                      <p className="mt-1 text-sm font-medium text-foreground">{config?.websiteName}</p>
                    </div>
                    <div>
                      <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Logo</p>
                      <div className="mt-1">
                        {config?.websiteLogo ? (
                          <ImageWithFallback src={config.websiteLogo} alt="" className="h-16 rounded-lg object-contain" />
                        ) : (
                          <span className="text-sm italic text-muted-foreground">Not set</span>
                        )}
                      </div>
                    </div>
                  </div>
                </SectionCard>
              )}

              {/* BANNERS */}
              {isEditing ? (
                <SectionCard id="banners" title="Banners" icon={Image} description="Hero banner images and text" count={bannerFields.length}>
                  <div className="space-y-1">
                    <Button type="button" variant="outline" size="sm" onClick={() => appendBanner({ image: '', title: '', description: '' })} className="rounded-xl">
                      <Plus className="h-4 w-4 mr-1" /> Add Banner
                    </Button>
                  </div>
                  {errors.websiteBannerList?.message && (
                    <p className="mt-3 text-sm text-red-500">{errors.websiteBannerList.message}</p>
                  )}
                  <div className="mt-4">
                    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleBannerDragEnd}>
                      <SortableContext items={bannerFields.map((f) => f.id)} strategy={verticalListSortingStrategy}>
                        <Accordion.Root type="multiple" defaultValue={bannerFields.map((f) => f.id)} className="space-y-3">
                          {bannerFields.map((field, index) => (
                            <SortableBannerItem
                              key={field.id} id={field.id} index={index}
                              register={register} errors={errors} control={control}
                              onRemove={() => removeBanner(index)}
                            />
                          ))}
                        </Accordion.Root>
                      </SortableContext>
                    </DndContext>
                  </div>
                </SectionCard>
              ) : (
                <SectionCard id="banners" title="Banners" icon={Image} description="Hero banner images and text"
                  count={config?.websiteBannerList.length} onEdit={() => enterEditMode('banners')}>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-border text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                          <th className="pb-3 pr-4 w-[120px]">Image</th>
                          <th className="pb-3 pr-4 w-auto min-w-[140px]">Title</th>
                          <th className="pb-3 pr-4 hidden md:table-cell">Description</th>
                        </tr>
                      </thead>
                      <tbody>
                        {config?.websiteBannerList.map((banner, index) => (
                          <tr key={index} className="border-b border-border/50 last:border-0 transition-colors hover:bg-muted/30 cursor-pointer"
                            onClick={() => document.getElementById('banners')?.scrollIntoView({ behavior: 'smooth', block: 'start' })}>
                            <td className="py-3 pr-4">
                              <ImageWithFallback src={banner.image} alt="" className="h-20 w-28 rounded-lg object-cover shadow-sm" />
                            </td>
                            <td className="py-3 pr-4 font-medium text-foreground truncate max-w-[160px]">{banner.title}</td>
                            <td className="py-3 pr-4 text-muted-foreground hidden md:table-cell max-w-[250px] truncate">{banner.description}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </SectionCard>
              )}

              {/* CONTACT DETAILS */}
              {isEditing ? (
                <SectionCard id="contact" title="Contact Details" icon={Phone} description="Contact information and address">
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Email <span className="text-primary">*</span></label>
                      <Input {...register('websiteContactDetails.email')} className="h-10 rounded-xl border-border bg-background" />
                      {errors.websiteContactDetails?.email && <p className="text-sm text-red-500">{errors.websiteContactDetails.email.message}</p>}
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Phone <span className="text-primary">*</span></label>
                      <Input {...register('websiteContactDetails.phone')} className="h-10 rounded-xl border-border bg-background" />
                      {errors.websiteContactDetails?.phone && <p className="text-sm text-red-500">{errors.websiteContactDetails.phone.message}</p>}
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Business Hours <span className="text-primary">*</span></label>
                      <Input {...register('websiteContactDetails.businessHours')} className="h-10 rounded-xl border-border bg-background" />
                      {errors.websiteContactDetails?.businessHours && <p className="text-sm text-red-500">{errors.websiteContactDetails.businessHours.message}</p>}
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">City <span className="text-primary">*</span></label>
                      <Input {...register('websiteContactDetails.city')} className="h-10 rounded-xl border-border bg-background" />
                      {errors.websiteContactDetails?.city && <p className="text-sm text-red-500">{errors.websiteContactDetails.city.message}</p>}
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Address <span className="text-primary">*</span></label>
                      <Input {...register('websiteContactDetails.address')} className="h-10 rounded-xl border-border bg-background" />
                      {errors.websiteContactDetails?.address && <p className="text-sm text-red-500">{errors.websiteContactDetails.address.message}</p>}
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Provinces <span className="text-primary">*</span></label>
                      <Input {...register('websiteContactDetails.provinces')} className="h-10 rounded-xl border-border bg-background" />
                      {errors.websiteContactDetails?.provinces && <p className="text-sm text-red-500">{errors.websiteContactDetails.provinces.message}</p>}
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Country <span className="text-primary">*</span></label>
                      <Input {...register('websiteContactDetails.country')} className="h-10 rounded-xl border-border bg-background" />
                      {errors.websiteContactDetails?.country && <p className="text-sm text-red-500">{errors.websiteContactDetails.country.message}</p>}
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Country Code <span className="text-primary">*</span></label>
                      <Input {...register('websiteContactDetails.countryCode')} className="h-10 rounded-xl border-border bg-background" />
                      {errors.websiteContactDetails?.countryCode && <p className="text-sm text-red-500">{errors.websiteContactDetails.countryCode.message}</p>}
                    </div>
                  </div>
                </SectionCard>
              ) : (
                <SectionCard id="contact" title="Contact Details" icon={Phone} description="Contact information and address" onEdit={() => enterEditMode('contact')}>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-4">
                    <Field label="Email">{config?.websiteContactDetails.email}</Field>
                    <Field label="Phone">{config?.websiteContactDetails.phone}</Field>
                    <Field label="Business Hours">{config?.websiteContactDetails.businessHours}</Field>
                    <Field label="City">{config?.websiteContactDetails.city}</Field>
                    <Field label="Address">{config?.websiteContactDetails.address}</Field>
                    <Field label="Provinces">{config?.websiteContactDetails.provinces}</Field>
                    <Field label="Country">{config?.websiteContactDetails.country}</Field>
                    <Field label="Country Code">{config?.websiteContactDetails.countryCode}</Field>
                  </div>
                </SectionCard>
              )}

              {/* ABOUT US */}
              {isEditing ? (
                <SectionCard id="about" title="About Us" icon={Info} description="About us content, features, and stats">
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Title <span className="text-primary">*</span></label>
                        <Input {...register('websiteAboutUs.title')} className="h-10 rounded-xl border-border bg-background" />
                        {errors.websiteAboutUs?.title && <p className="text-sm text-red-500">{errors.websiteAboutUs.title.message}</p>}
                      </div>
                      <Controller control={control} name="websiteAboutUs.image"
                        render={({ field, fieldState }) => (
                          <ImageUploadField value={field.value} onChange={field.onChange} error={fieldState.error?.message} label="Image" required />
                        )}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Description <span className="text-primary">*</span></label>
                      <textarea {...register('websiteAboutUs.description')} rows={4}
                        className="flex w-full rounded-xl border border-border bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" />
                      {errors.websiteAboutUs?.description && <p className="text-sm text-red-500">{errors.websiteAboutUs.description.message}</p>}
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <label className="text-sm font-medium">Features</label>
                        <Button type="button" variant="outline" size="sm" onClick={() => appendFeature({ title: '', description: '' })} className="rounded-xl">
                          <Plus className="h-4 w-4 mr-1" /> Add Feature
                        </Button>
                      </div>
                      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleFeatureDragEnd}>
                        <SortableContext items={featureFields.map((f) => f.id)} strategy={verticalListSortingStrategy}>
                          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            {featureFields.map((field, index) => (
                              <SortableFeatureItem
                                key={field.id} id={field.id} index={index}
                                register={register}
                                onRemove={() => removeFeature(index)}
                              />
                            ))}
                          </div>
                        </SortableContext>
                      </DndContext>
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <label className="text-sm font-medium">Stats</label>
                        <Button type="button" variant="outline" size="sm" onClick={() => appendStat({ value: '', label: '' })} className="rounded-xl">
                          <Plus className="h-4 w-4 mr-1" /> Add Stat
                        </Button>
                      </div>
                      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleStatDragEnd}>
                        <SortableContext items={statFields.map((f) => f.id)} strategy={verticalListSortingStrategy}>
                          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4">
                            {statFields.map((field, index) => (
                              <SortableStatItem
                                key={field.id} id={field.id} index={index}
                                register={register}
                                onRemove={() => removeStat(index)}
                              />
                            ))}
                          </div>
                        </SortableContext>
                      </DndContext>
                    </div>
                  </div>
                </SectionCard>
              ) : (
                <SectionCard id="about" title="About Us" icon={Info} description="About us content, features, and stats" onEdit={() => enterEditMode('about')}>
                  <div className="space-y-6">
                    <div className="flex flex-col sm:flex-row gap-6 items-start">
                      <div className="flex-1 min-w-0 space-y-2">
                        <Field label="Title">{config?.websiteAboutUs.title}</Field>
                        <Field label="Description">{config?.websiteAboutUs.description}</Field>
                      </div>
                      {config?.websiteAboutUs.image && (
                        <div className="shrink-0">
                          <ImageWithFallback src={config.websiteAboutUs.image} alt="" className="h-32 w-56 rounded-xl object-cover shadow-sm" />
                        </div>
                      )}
                    </div>

                    <div>
                      <p className="mb-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">Features</p>
                      {config?.websiteAboutUs.features && config.websiteAboutUs.features.length > 0 ? (
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                          {config.websiteAboutUs.features.map((f, i) => (
                            <div key={i} className="rounded-xl border border-border bg-white p-4 shadow-sm border-l-[3px] border-l-green-500">
                              <p className="font-semibold text-foreground">{f.title}</p>
                              <p className="mt-1 text-sm text-muted-foreground leading-relaxed">{f.description}</p>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-sm italic text-muted-foreground">No features defined</p>
                      )}
                    </div>

                    <div>
                      <p className="mb-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">Stats</p>
                      {config?.websiteAboutUs.stats && config.websiteAboutUs.stats.length > 0 ? (
                        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                          {config.websiteAboutUs.stats.map((s, i) => (
                            <div key={i} className="flex flex-col items-center justify-center rounded-xl bg-gradient-to-br from-green-50 to-green-100 p-6 text-center">
                              <p className="text-5xl font-extrabold text-green-700 leading-none">{s.value}</p>
                              <p className="mt-2 text-[11px] font-semibold uppercase tracking-wider text-green-600">{s.label}</p>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-sm italic text-muted-foreground">No stats defined</p>
                      )}
                    </div>
                  </div>
                </SectionCard>
              )}
            </form>
          </div>
        </div>
      </div>
    </SuperAdminLayout>
  );
}
