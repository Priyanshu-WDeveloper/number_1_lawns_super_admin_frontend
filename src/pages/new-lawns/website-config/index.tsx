import { useState } from 'react';
import { useForm, useFieldArray, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Plus, X, Pencil } from 'lucide-react';
import toast from 'react-hot-toast';

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

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1">
      <label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
        {label}
      </label>
      <div className="text-sm font-medium text-foreground">
        {children}
      </div>
    </div>
  );
}

function SectionCard({
  id,
  title,
  count,
  children,
}: {
  id: string;
  title: string;
  count?: number;
  children: React.ReactNode;
}) {
  return (
    <div
      id={id}
      className="overflow-hidden rounded-2xl border border-border bg-white shadow-sm transition-shadow hover:shadow-md"
    >
      <div className="flex items-center justify-between border-l-[5px] border-green-600 px-6 py-4">
        <div className="flex items-center gap-3">
          <h3 className="text-base font-semibold text-foreground">
            {title}
          </h3>
          {count !== undefined && (
            <span className="inline-flex h-6 min-w-6 items-center justify-center rounded-full bg-green-100 px-2 text-xs font-medium text-green-700">
              {count}
            </span>
          )}
        </div>
      </div>
      <div className="border-t border-border px-6 py-5">
        {children}
      </div>
    </div>
  );
}

export default function WebsiteConfigPage() {
  const [isEditing, setIsEditing] = useState(false);
  const { data: config, isLoading: isFetching } =
    useGetNLWebsiteConfigQuery();
  const [updateConfig, { isLoading: isUpdating }] =
    useUpdateNLWebsiteConfigMutation();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<ConfigFormData>({
    resolver: zodResolver(configSchema),
    values: config
      ? {
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
        }
      : undefined,
  });

  const {
    fields: bannerFields,
    append: appendBanner,
    remove: removeBanner,
  } = useFieldArray({
    control,
    name: 'websiteBannerList',
  });

  const {
    fields: featureFields,
    append: appendFeature,
    remove: removeFeature,
  } = useFieldArray({
    control,
    name: 'websiteAboutUs.features',
  });

  const {
    fields: statFields,
    append: appendStat,
    remove: removeStat,
  } = useFieldArray({
    control,
    name: 'websiteAboutUs.stats',
  });

  const onSubmit = async (data: ConfigFormData) => {
    try {
      await updateConfig(data).unwrap();
      toast.success('Website config updated');
      setIsEditing(false);
    } catch (err) {
      toast.error(getErrorMessage(err, 'Failed to update config'));
    }
  };

  if (isFetching) {
    return (
      <SuperAdminLayout>
        <Loader />
      </SuperAdminLayout>
    );
  }

  return (
    <SuperAdminLayout>
      <div className="flex h-full flex-col">
        <div className="flex-1 w-full overflow-y-auto p-5 md:pl-10">
          <Navbar
            title="Website Config"
            subtitle="Manage website configuration"
            showWelcome={false}
            superAccess
          />

          <div className="space-y-6 pt-4">
            {isEditing ? (
              <form
                onSubmit={handleSubmit(onSubmit)}
                className="space-y-6"
              >
                <SectionCard id="general" title="General">
                  <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">
                        Website Name{' '}
                        <span className="text-primary">*</span>
                      </label>
                      <Input
                        {...register('websiteName')}
                        className="h-12 rounded-xl border-border bg-background"
                      />
                      {errors.websiteName && (
                        <p className="text-sm text-red-500">
                          {errors.websiteName.message}
                        </p>
                      )}
                    </div>
                    <Controller
                      control={control}
                      name="websiteLogo"
                      render={({ field, fieldState }) => (
                        <ImageUploadField
                          value={field.value}
                          onChange={field.onChange}
                          error={fieldState.error?.message}
                          label="Logo URL"
                        />
                      )}
                    />
                  </div>
                </SectionCard>

                <SectionCard
                  id="banners"
                  title="Banners"
                  count={bannerFields.length}
                >
                  <div className="space-y-1">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        appendBanner({
                          image: '',
                          title: '',
                          description: '',
                        })
                      }
                      className="rounded-xl"
                    >
                      <Plus className="h-4 w-4 mr-1" /> Add Banner
                    </Button>
                  </div>
                  {errors.websiteBannerList?.message && (
                    <p className="mt-3 text-sm text-red-500">
                      {errors.websiteBannerList.message}
                    </p>
                  )}
                  <div className="mt-4 space-y-4">
                    {bannerFields.map((field, index) => (
                      <div
                        key={field.id}
                        className="rounded-xl border border-border bg-gray-50/50 p-4"
                      >
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-sm font-semibold text-foreground">
                            Banner {index + 1}
                          </span>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => removeBanner(index)}
                            className="h-8 w-8 text-red-500 hover:bg-red-50"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                          <div className="space-y-1">
                            <label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                              Title
                            </label>
                            <Input
                              {...register(
                                `websiteBannerList.${index}.title`,
                              )}
                              className="h-10 rounded-lg border-border bg-white"
                            />
                            {errors.websiteBannerList?.[index]
                              ?.title && (
                              <p className="text-sm text-red-500">
                                {
                                  errors.websiteBannerList[index]
                                    .title?.message
                                }
                              </p>
                            )}
                          </div>
                          <div className="space-y-1">
                            <label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                              Description
                            </label>
                            <Input
                              {...register(
                                `websiteBannerList.${index}.description`,
                              )}
                              className="h-10 rounded-lg border-border bg-white"
                            />
                            {errors.websiteBannerList?.[index]
                              ?.description && (
                              <p className="text-sm text-red-500">
                                {
                                  errors.websiteBannerList[index]
                                    .description?.message
                                }
                              </p>
                            )}
                          </div>
                          <Controller
                            control={control}
                            name={`websiteBannerList.${index}.image`}
                            render={({ field: f, fieldState }) => (
                              <ImageUploadField
                                value={f.value}
                                onChange={f.onChange}
                                error={fieldState.error?.message}
                                label="Image"
                                required
                              />
                            )}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </SectionCard>

                <SectionCard id="contact" title="Contact Details">
                  <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">
                        Email <span className="text-primary">*</span>
                      </label>
                      <Input
                        {...register('websiteContactDetails.email')}
                        className="h-12 rounded-xl border-border bg-background"
                      />
                      {errors.websiteContactDetails?.email && (
                        <p className="text-sm text-red-500">
                          {errors.websiteContactDetails.email.message}
                        </p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">
                        Phone <span className="text-primary">*</span>
                      </label>
                      <Input
                        {...register('websiteContactDetails.phone')}
                        className="h-12 rounded-xl border-border bg-background"
                      />
                      {errors.websiteContactDetails?.phone && (
                        <p className="text-sm text-red-500">
                          {errors.websiteContactDetails.phone.message}
                        </p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">
                        Business Hours{' '}
                        <span className="text-primary">*</span>
                      </label>
                      <Input
                        {...register(
                          'websiteContactDetails.businessHours',
                        )}
                        className="h-12 rounded-xl border-border bg-background"
                      />
                      {errors.websiteContactDetails
                        ?.businessHours && (
                        <p className="text-sm text-red-500">
                          {
                            errors.websiteContactDetails.businessHours
                              .message
                          }
                        </p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">
                        City <span className="text-primary">*</span>
                      </label>
                      <Input
                        {...register('websiteContactDetails.city')}
                        className="h-12 rounded-xl border-border bg-background"
                      />
                      {errors.websiteContactDetails?.city && (
                        <p className="text-sm text-red-500">
                          {errors.websiteContactDetails.city.message}
                        </p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">
                        Address{' '}
                        <span className="text-primary">*</span>
                      </label>
                      <Input
                        {...register('websiteContactDetails.address')}
                        className="h-12 rounded-xl border-border bg-background"
                      />
                      {errors.websiteContactDetails?.address && (
                        <p className="text-sm text-red-500">
                          {
                            errors.websiteContactDetails.address
                              .message
                          }
                        </p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">
                        Provinces{' '}
                        <span className="text-primary">*</span>
                      </label>
                      <Input
                        {...register(
                          'websiteContactDetails.provinces',
                        )}
                        className="h-12 rounded-xl border-border bg-background"
                      />
                      {errors.websiteContactDetails?.provinces && (
                        <p className="text-sm text-red-500">
                          {
                            errors.websiteContactDetails.provinces
                              .message
                          }
                        </p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">
                        Country{' '}
                        <span className="text-primary">*</span>
                      </label>
                      <Input
                        {...register('websiteContactDetails.country')}
                        className="h-12 rounded-xl border-border bg-background"
                      />
                      {errors.websiteContactDetails?.country && (
                        <p className="text-sm text-red-500">
                          {
                            errors.websiteContactDetails.country
                              .message
                          }
                        </p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">
                        Country Code{' '}
                        <span className="text-primary">*</span>
                      </label>
                      <Input
                        {...register(
                          'websiteContactDetails.countryCode',
                        )}
                        className="h-12 rounded-xl border-border bg-background"
                      />
                      {errors.websiteContactDetails?.countryCode && (
                        <p className="text-sm text-red-500">
                          {
                            errors.websiteContactDetails.countryCode
                              .message
                          }
                        </p>
                      )}
                    </div>
                  </div>
                </SectionCard>

                <SectionCard id="about" title="About Us">
                  <div className="space-y-5">
                    <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">
                          Title{' '}
                          <span className="text-primary">*</span>
                        </label>
                        <Input
                          {...register('websiteAboutUs.title')}
                          className="h-12 rounded-xl border-border bg-background"
                        />
                        {errors.websiteAboutUs?.title && (
                          <p className="text-sm text-red-500">
                            {errors.websiteAboutUs.title.message}
                          </p>
                        )}
                      </div>
                      <Controller
                        control={control}
                        name="websiteAboutUs.image"
                        render={({ field, fieldState }) => (
                          <ImageUploadField
                            value={field.value}
                            onChange={field.onChange}
                            error={fieldState.error?.message}
                            label="Image"
                            required
                          />
                        )}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">
                        Description{' '}
                        <span className="text-primary">*</span>
                      </label>
                      <textarea
                        {...register('websiteAboutUs.description')}
                        rows={4}
                        className="flex w-full rounded-xl border border-border bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      />
                      {errors.websiteAboutUs?.description && (
                        <p className="text-sm text-red-500">
                          {errors.websiteAboutUs.description.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <label className="text-sm font-medium">
                          Features
                        </label>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            appendFeature({
                              title: '',
                              description: '',
                            })
                          }
                          className="rounded-xl"
                        >
                          <Plus className="h-4 w-4 mr-1" /> Add
                          Feature
                        </Button>
                      </div>
                      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        {featureFields.map((field, index) => (
                          <div
                            key={field.id}
                            className="rounded-xl border border-border bg-white p-4 shadow-sm border-l-[3px] border-l-green-500"
                          >
                            <div className="flex items-start justify-between mb-2">
                              <span className="text-xs font-medium text-muted-foreground">
                                Feature {index + 1}
                              </span>
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                onClick={() => removeFeature(index)}
                                className="h-6 w-6 text-red-500 hover:bg-red-50"
                              >
                                <X className="h-3 w-3" />
                              </Button>
                            </div>
                            <div className="space-y-2">
                              <Input
                                {...register(
                                  `websiteAboutUs.features.${index}.title`,
                                )}
                                placeholder="Feature title"
                                className="h-10 rounded-lg border-border bg-background"
                              />
                              {errors.websiteAboutUs?.features?.[
                                index
                              ]?.title && (
                                <p className="text-sm text-red-500">
                                  {
                                    errors.websiteAboutUs.features[
                                      index
                                    ].title?.message
                                  }
                                </p>
                              )}
                              <Input
                                {...register(
                                  `websiteAboutUs.features.${index}.description`,
                                )}
                                placeholder="Feature description"
                                className="h-10 rounded-lg border-border bg-background"
                              />
                              {errors.websiteAboutUs?.features?.[
                                index
                              ]?.description && (
                                <p className="text-sm text-red-500">
                                  {
                                    errors.websiteAboutUs.features[
                                      index
                                    ].description?.message
                                  }
                                </p>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <label className="text-sm font-medium">
                          Stats
                        </label>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            appendStat({ value: '', label: '' })
                          }
                          className="rounded-xl"
                        >
                          <Plus className="h-4 w-4 mr-1" /> Add Stat
                        </Button>
                      </div>
                      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4">
                        {statFields.map((field, index) => (
                          <div
                            key={field.id}
                            className="flex flex-col items-center gap-2 rounded-xl bg-gradient-to-br from-green-50 to-green-100 p-4 text-center"
                          >
                            <div className="flex w-full items-start justify-end">
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                onClick={() => removeStat(index)}
                                className="h-6 w-6 text-red-500 hover:bg-red-50/80"
                              >
                                <X className="h-3 w-3" />
                              </Button>
                            </div>
                            <div className="w-full space-y-2">
                              <Input
                                {...register(
                                  `websiteAboutUs.stats.${index}.value`,
                                )}
                                placeholder="10+"
                                className="h-10 rounded-lg border-border bg-white text-center text-lg font-bold"
                              />
                              {errors.websiteAboutUs?.stats?.[index]
                                ?.value && (
                                <p className="text-sm text-red-500">
                                  {
                                    errors.websiteAboutUs.stats[index]
                                      .value?.message
                                  }
                                </p>
                              )}
                              <Input
                                {...register(
                                  `websiteAboutUs.stats.${index}.label`,
                                )}
                                placeholder="Years Experience"
                                className="h-10 rounded-lg border-border bg-white text-center text-sm"
                              />
                              {errors.websiteAboutUs?.stats?.[index]
                                ?.label && (
                                <p className="text-sm text-red-500">
                                  {
                                    errors.websiteAboutUs.stats[index]
                                      .label?.message
                                  }
                                </p>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </SectionCard>

                <div className="flex justify-end gap-3 border-t border-border pt-6">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsEditing(false)}
                    className="h-10 rounded-xl px-5"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={isUpdating}
                    className="h-10 rounded-xl bg-green-600 text-white hover:bg-green-700 px-5"
                  >
                    {isUpdating ? 'Saving...' : 'Save Changes'}
                  </Button>
                </div>
              </form>
            ) : (
              <div className="space-y-6">
                <div className="flex justify-end">
                  <Button
                    onClick={() => setIsEditing(true)}
                    className="h-11 gap-2 rounded-xl px-6"
                  >
                    <Pencil className="h-4 w-4" />
                    Edit Configuration
                  </Button>
                </div>
                <SectionCard id="general" title="General">
                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <Field label="Website Name">
                      {config?.websiteName}
                    </Field>
                    <Field label="Logo">
                      {config?.websiteLogo ? (
                        <ImageWithFallback
                          src={config.websiteLogo}
                          alt=""
                          className="h-10 rounded object-contain"
                        />
                      ) : (
                        <span className="italic text-muted-foreground">
                          Not set
                        </span>
                      )}
                    </Field>
                  </div>
                </SectionCard>

                <SectionCard
                  id="banners"
                  title="Banners"
                  count={config?.websiteBannerList.length}
                >
                  <div className="space-y-4">
                    {config?.websiteBannerList.map(
                      (banner, index) => (
                        <div
                          key={index}
                          className="rounded-xl border border-border bg-gray-50/50 p-4"
                        >
                          <div className="mb-3 text-sm font-semibold text-foreground">
                            Banner {index + 1}
                          </div>
                          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                            <Field label="Title">
                              {banner.title}
                            </Field>
                            <Field label="Description">
                              {banner.description}
                            </Field>
                            <Field label="Image">
                              <ImageWithFallback
                                src={banner.image}
                                alt=""
                                className="h-16 w-24 rounded-lg object-cover shadow-sm"
                              />
                            </Field>
                          </div>
                        </div>
                      ),
                    )}
                  </div>
                </SectionCard>

                <SectionCard id="contact" title="Contact Details">
                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <Field label="Email">
                      {config?.websiteContactDetails.email}
                    </Field>
                    <Field label="Phone">
                      {config?.websiteContactDetails.phone}
                    </Field>
                    <Field label="Business Hours">
                      {config?.websiteContactDetails.businessHours}
                    </Field>
                    <Field label="City">
                      {config?.websiteContactDetails.city}
                    </Field>
                    <Field label="Address">
                      {config?.websiteContactDetails.address}
                    </Field>
                    <Field label="Provinces">
                      {config?.websiteContactDetails.provinces}
                    </Field>
                    <Field label="Country">
                      {config?.websiteContactDetails.country}
                    </Field>
                    <Field label="Country Code">
                      {config?.websiteContactDetails.countryCode}
                    </Field>
                  </div>
                </SectionCard>

                <SectionCard id="about" title="About Us">
                  <div className="space-y-5">
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                      <Field label="Title">
                        {config?.websiteAboutUs.title}
                      </Field>
                      <Field label="Image">
                        <ImageWithFallback
                          src={config?.websiteAboutUs.image}
                          alt=""
                          className="h-16 w-24 rounded-lg object-cover shadow-sm"
                        />
                      </Field>
                    </div>
                    <Field label="Description">
                      {config?.websiteAboutUs.description}
                    </Field>

                    <div>
                      <label className="mb-3 block text-xs font-medium uppercase tracking-wider text-muted-foreground">
                        Features
                      </label>
                      {config?.websiteAboutUs.features &&
                      config.websiteAboutUs.features.length > 0 ? (
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                          {config.websiteAboutUs.features.map(
                            (f, i) => (
                              <div
                                key={i}
                                className="rounded-xl border border-border bg-white p-4 shadow-sm border-l-[3px] border-l-green-500"
                              >
                                <p className="font-semibold text-foreground">
                                  {f.title}
                                </p>
                                <p className="mt-1 text-sm text-muted-foreground leading-relaxed">
                                  {f.description}
                                </p>
                              </div>
                            ),
                          )}
                        </div>
                      ) : (
                        <p className="text-sm italic text-muted-foreground">
                          No features defined
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="mb-3 block text-xs font-medium uppercase tracking-wider text-muted-foreground">
                        Stats
                      </label>
                      {config?.websiteAboutUs.stats &&
                      config.websiteAboutUs.stats.length > 0 ? (
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4">
                          {config.websiteAboutUs.stats.map((s, i) => (
                            <div
                              key={i}
                              className="flex flex-col items-center justify-center rounded-xl bg-gradient-to-br from-green-50 to-green-100 p-5 text-center"
                            >
                              <p className="text-2xl font-bold text-green-700">
                                {s.value}
                              </p>
                              <p className="mt-1 text-xs font-medium text-green-600">
                                {s.label}
                              </p>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-sm italic text-muted-foreground">
                          No stats defined
                        </p>
                      )}
                    </div>
                  </div>
                </SectionCard>
              </div>
            )}
          </div>
        </div>
      </div>
    </SuperAdminLayout>
  );
}
