import { useState, useRef, useCallback, useEffect } from 'react';
import {
  useParams,
  useNavigate,
  useLocation,
} from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import z from 'zod';
import toast from 'react-hot-toast';

import { getErrorMessage } from '@/lib/get-error-message';
import {
  ArrowLeft,
  Upload,
  Link2,
  User,
  Mail,
  Phone,
  MapPin,
  Building2,
  Map as MapIcon,
  Hash,
  Globe,
  // FileText,
} from 'lucide-react';
import { SuperAdminLayout } from '@/components/layout/super-layout';
import { Navbar } from '@/components/layout/navbar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ROUTES } from '@/constants';
import {
  useGetAdminUserByIdQuery,
  useUpdateAdminUserMutation,
  useUploadDocumentMutation,
} from '@/API/api';
import { AdminFormStepper } from '@/components/admin/admin-form-stepper';
import { AdminFormStep } from '@/components/admin/admin-form-step';
import { ReviewCard } from '@/components/admin/review-card';
import Loader from '@/components/loader';
import defaultAvatar from '@/assets/avatar.png';
// import { IMAGE_PLACEHOLDER } from '@/lib/image-placeholder';
import type { IAdmins } from '@/types/admins.types';
import { validatePhone } from '@/lib/phone-validation';
import {
  validateAddress,
  getCountryIsoFromPhoneCode,
} from '@/lib/address-validation';
const editAdminSchema = z
  .object({
    firstName: z.string().min(1, 'First name is required'),
    lastName: z.string().min(1, 'Last name is required'),
    email: z
      .string()
      .min(1, 'Email is required')
      .email('Invalid email address'),
    phoneNumber: z
      .string()
      .min(1, 'Phone number is required')
      .regex(/^\d+$/, 'Phone number must be numeric'),
    countryCode: z.string().min(1, 'Country code is required'),
    address: z.string().min(1, 'Address is required'),
    city: z.string().min(1, 'City is required'),
    state: z.string().min(1, 'State is required'),
    postalCode: z.string().min(1, 'Postal code is required'),
    country: z.string().min(1, 'Country is required'),
    countryIso: z.string(),
    location: z.string(),
    latitude: z.number(),
    longitude: z.number(),
    locationMode: z.enum(['map', 'manual']),
    companyName: z.string().min(1, 'Company name is required'),
    gstNumber: z.string().min(1, 'GST number is required'),
    bankAccountNumber: z
      .string()
      .min(1, 'Bank account number is required'),
    profileImage: z.string(),
    invoiceLogo: z.string(),
  })
  .superRefine((data, ctx) => {
    const phoneResult = validatePhone(
      data.phoneNumber,
      data.countryCode,
    );
    if (!phoneResult.valid && phoneResult.error) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: phoneResult.error,
        path: ['phoneNumber'],
      });
    }

    const iso =
      data.countryIso ||
      getCountryIsoFromPhoneCode(data.countryCode) ||
      '';
    if (iso && data.country) {
      const addrResult = validateAddress(
        iso,
        data.state,
        data.city,
        data.postalCode,
      );
      if (!addrResult.valid && addrResult.error && addrResult.path) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: addrResult.error,
          path: [addrResult.path as any],
        });
      }
    }
  });

type EditAdminFormData = z.infer<typeof editAdminSchema>;

const steps = [
  {
    id: 1,
    title: 'Basic Info',
    description: 'Admin contact details',
    icon: null,
  },
  {
    id: 2,
    title: 'Location',
    description: 'Address information',
    icon: null,
  },
  {
    id: 3,
    title: 'Company Details',
    description: 'Business information',
    icon: null,
  },
  {
    id: 4,
    title: 'Review',
    description: 'Verify details',
    icon: null,
  },
];

export default function AdminEditPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const location = useLocation();
  const passedAdmin = location.state?.admin as IAdmins | undefined;

  const [currentStep, setCurrentStep] = useState(1);
  const [updateAdmin, { isLoading: isUpdating }] =
    useUpdateAdminUserMutation();
  const [uploadDocument] = useUploadDocumentMutation();
  const formRef = useRef<HTMLFormElement>(null);

  const { data, isLoading: isLoadingAdmin } =
    useGetAdminUserByIdQuery(id!, {
      skip: !!passedAdmin,
    });
  const admin = passedAdmin ?? data;

  const {
    register,
    handleSubmit,
    trigger,
    watch,
    setValue,
    formState: { errors },
  } = useForm<EditAdminFormData>({
    mode: 'onTouched',
    resolver: zodResolver(editAdminSchema),
    defaultValues: admin
      ? {
          firstName: admin.firstName,
          lastName: admin.lastName,
          email: admin.email,
          phoneNumber: admin.phoneNumber,
          countryCode: admin.countryCode,
          address: admin.address,
          city: admin.city,
          state: admin.state,
          postalCode: admin.postalCode,
          country: admin.country,
          countryIso: (admin as any).countryIso || '',
          location: admin.location?.coordinates
            ? `${admin.location.coordinates[1]}, ${admin.location.coordinates[0]}`
            : '',
          latitude: admin.location?.coordinates?.[1] || 0,
          longitude: admin.location?.coordinates?.[0] || 0,
          locationMode:
            admin.location?.coordinates?.[0] &&
            admin.location?.coordinates?.[1]
              ? 'map'
              : 'manual',
          companyName: admin.companyName || '',
          gstNumber: admin.gstNumber || '',
          bankAccountNumber: admin.bankAccountNumber || '',
          profileImage: admin.profileImage || '',
          invoiceLogo: admin.invoiceLogo || '',
        }
      : undefined,
  });

  const formValues = watch();
  const [profileImageFile, setProfileImageFile] =
    useState<File | null>(null);
  const [invoiceLogoFile, setInvoiceLogoFile] = useState<File | null>(
    null,
  );
  const [profileImagePreview, setProfileImagePreview] =
    useState<string>('');
  const [invoiceLogoPreview, setInvoiceLogoPreview] =
    useState<string>('');
  const [profileImageMode, setProfileImageMode] = useState<
    'upload' | 'url'
  >('upload');
  const [invoiceLogoMode, setInvoiceLogoMode] = useState<
    'upload' | 'url'
  >('upload');

  const handleProfileImageChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        setProfileImageFile(file);
        const preview = URL.createObjectURL(file);
        setProfileImagePreview(preview);
        setValue('profileImage', preview);
      }
    },
    [setValue],
  );

  const handleInvoiceLogoChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        setInvoiceLogoFile(file);
        const preview = URL.createObjectURL(file);
        setInvoiceLogoPreview(preview);
        setValue('invoiceLogo', preview);
      }
    },
    [setValue],
  );

  const handleProfileImageUrlChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setValue('profileImage', e.target.value, { shouldDirty: true });
    },
    [setValue],
  );

  const handleInvoiceLogoUrlChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setValue('invoiceLogo', e.target.value, { shouldDirty: true });
    },
    [setValue],
  );

  useEffect(() => {
    return () => {
      if (profileImagePreview)
        URL.revokeObjectURL(profileImagePreview);
      if (invoiceLogoPreview) URL.revokeObjectURL(invoiceLogoPreview);
    };
  }, [profileImagePreview, invoiceLogoPreview]);

  const handleNext = async () => {
    let fieldsToValidate: (keyof EditAdminFormData)[] = [];

    if (currentStep === 1) {
      fieldsToValidate = [
        'firstName',
        'lastName',
        'email',
        'phoneNumber',
      ];
    }

    if (currentStep === 2) {
      fieldsToValidate = [
        'address',
        'city',
        'state',
        'postalCode',
        'country',
      ];
    }

    if (currentStep === 3) {
      fieldsToValidate = [
        'companyName',
        'gstNumber',
        'bankAccountNumber',
      ];
    }

    const isValid = await trigger(fieldsToValidate);

    if (isValid && currentStep < steps.length) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const onSubmit = async (data: EditAdminFormData) => {
    try {
      let profileImageUrl = data.profileImage;

      if (profileImageFile) {
        const fd = new FormData();
        fd.append('files', profileImageFile);
        const res = await uploadDocument(fd).unwrap();
        profileImageUrl = res.urls[0];
      }

      let invoiceLogoUrl = data.invoiceLogo;

      if (invoiceLogoFile) {
        const fd = new FormData();
        fd.append('files', invoiceLogoFile);
        const res = await uploadDocument(fd).unwrap();
        invoiceLogoUrl = res.urls[0];
      }

      await updateAdmin({
        id: id!,
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phoneNumber: data.phoneNumber,
        countryCode: data.countryCode,
        country: data.country,
        profileImage: profileImageUrl,
        invoiceLogo: invoiceLogoUrl,
        city: data.city,
        address: data.address,
        state: data.state,
        postalCode: data.postalCode,
        companyName: data.companyName,
        gstNumber: data.gstNumber,
        bankAccountNumber: data.bankAccountNumber,
        location: {
          type: 'Point',
          coordinates: [data.longitude, data.latitude],
        },
      }).unwrap();

      toast.success('Admin updated successfully');
      navigate(ROUTES.SUPER_ADMIN_ADMINS);
    } catch (error: any) {
      toast.error(getErrorMessage(error, 'Failed to update admin'));
    }
  };

  if (isLoadingAdmin) {
    return (
      <SuperAdminLayout>
        <Loader />
      </SuperAdminLayout>
    );
  }

  if (!admin) {
    return (
      <SuperAdminLayout>
        <div className="flex h-full items-center justify-center">
          <p className="text-muted-foreground">Admin not found</p>
        </div>
      </SuperAdminLayout>
    );
  }

  const renderStepContent = () => {
    if (currentStep === 3) {
      return (
        <div className="space-y-6">
          <h4 className="mb-4 text-sm font-medium uppercase tracking-wide text-muted-foreground">
            Company Details
          </h4>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <label className="text-sm font-medium text-foreground">
                  Profile Image
                </label>
                <div className="inline-flex rounded-lg border border-border bg-muted p-0.5">
                  <button
                    type="button"
                    onClick={() => {
                      setProfileImageMode('upload');
                      setProfileImageFile(null);
                      setProfileImagePreview('');
                    }}
                    className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
                      profileImageMode === 'upload'
                        ? 'bg-white text-foreground shadow-sm'
                        : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    <Upload className="h-3.5 w-3.5" />
                    Upload
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setProfileImageMode('url');
                      setProfileImageFile(null);
                      setProfileImagePreview('');
                    }}
                    className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
                      profileImageMode === 'url'
                        ? 'bg-white text-foreground shadow-sm'
                        : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    <Link2 className="h-3.5 w-3.5" />
                    URL
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <img
                  src={
                    profileImagePreview ||
                    formValues.profileImage ||
                    admin?.profileImage ||
                    defaultAvatar
                  }
                  alt="Profile"
                  className="h-16 w-16 shrink-0 rounded-full object-cover border"
                  onError={(e) => {
                    e.currentTarget.src = defaultAvatar;
                  }}
                />
                {profileImageMode === 'upload' ? (
                  <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-border bg-background text-sm text-foreground hover:bg-primary/10">
                    <Upload className="h-4 w-4" />
                    {profileImageFile ? 'Change' : 'Choose File'}
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleProfileImageChange}
                    />
                  </label>
                ) : (
                  <Input
                    placeholder="Paste image URL..."
                    value={formValues.profileImage || ''}
                    onChange={handleProfileImageUrlChange}
                    className="h-12 rounded-xl border-border bg-background flex-1"
                  />
                )}
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <label className="text-sm font-medium text-foreground">
                  Invoice Logo
                </label>
                <div className="inline-flex rounded-lg border border-border bg-muted p-0.5">
                  <button
                    type="button"
                    onClick={() => {
                      setInvoiceLogoMode('upload');
                      setInvoiceLogoFile(null);
                      setInvoiceLogoPreview('');
                    }}
                    className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
                      invoiceLogoMode === 'upload'
                        ? 'bg-white text-foreground shadow-sm'
                        : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    <Upload className="h-3.5 w-3.5" />
                    Upload
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setInvoiceLogoMode('url');
                      setInvoiceLogoFile(null);
                      setInvoiceLogoPreview('');
                    }}
                    className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
                      invoiceLogoMode === 'url'
                        ? 'bg-white text-foreground shadow-sm'
                        : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    <Link2 className="h-3.5 w-3.5" />
                    URL
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <img
                  src={
                    invoiceLogoPreview ||
                    formValues.invoiceLogo ||
                    admin?.invoiceLogo ||
                    defaultAvatar
                  }
                  alt="Invoice Logo"
                  className="h-16 w-16 shrink-0 rounded object-cover "
                  onError={(e) => {
                    e.currentTarget.src = defaultAvatar;
                  }}
                />
                {invoiceLogoMode === 'upload' ? (
                  <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-border bg-background text-sm text-foreground hover:bg-primary/10">
                    <Upload className="h-4 w-4" />
                    {invoiceLogoFile ? 'Change' : 'Choose File'}
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleInvoiceLogoChange}
                    />
                  </label>
                ) : (
                  <Input
                    placeholder="Paste image URL..."
                    value={formValues.invoiceLogo || ''}
                    onChange={handleInvoiceLogoUrlChange}
                    className="h-12 rounded-xl border-border bg-background flex-1"
                  />
                )}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                Company Name
                <span className="text-primary"> *</span>
              </label>
              <Input
                placeholder="Enter company name"
                {...register('companyName')}
                className="h-12 rounded-xl border-border bg-background"
              />
              {errors.companyName && (
                <p className="text-sm text-red-500">
                  {errors.companyName.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                GST Number
                <span className="text-primary"> *</span>
              </label>
              <Input
                placeholder="Enter GST number"
                {...register('gstNumber')}
                className="h-12 rounded-xl border-border bg-background"
              />
              {errors.gstNumber && (
                <p className="text-sm text-red-500">
                  {errors.gstNumber.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                Bank Account Number
                <span className="text-primary"> *</span>
              </label>
              <Input
                placeholder="Enter bank account number"
                {...register('bankAccountNumber')}
                className="h-12 rounded-xl border-border bg-background"
              />
              {errors.bankAccountNumber && (
                <p className="text-sm text-red-500">
                  {errors.bankAccountNumber.message}
                </p>
              )}
            </div>
          </div>
        </div>
      );
    }

    if (currentStep === steps.length) {
      const profileImg =
        profileImagePreview ||
        formValues.profileImage ||
        admin?.profileImage ||
        defaultAvatar;
      const invoiceImg =
        invoiceLogoPreview ||
        formValues.invoiceLogo ||
        admin?.invoiceLogo;

      return (
        <form ref={formRef} onSubmit={handleSubmit(onSubmit)}>
          <ReviewCard
            sections={[
              {
                icon: <User className="h-5 w-5 text-white" />,
                title: 'Admin Information',
                subtitle: 'Please verify the admin information below',

                image: profileImg
                  ? {
                      src: profileImg,
                      alt: `${formValues.firstName} ${formValues.lastName}`,
                    }
                  : undefined,
                fields: [
                  {
                    icon: <User className="h-3 w-3" />,
                    label: 'First Name',
                    value: formValues.firstName,
                  },
                  {
                    icon: <User className="h-3 w-3" />,
                    label: 'Last Name',
                    value: formValues.lastName,
                  },
                  {
                    icon: <Mail className="h-3 w-3" />,
                    label: 'Email',
                    value: formValues.email,
                  },
                  {
                    icon: <Phone className="h-3 w-3" />,
                    label: 'Phone Number',
                    value: `${formValues.countryCode} ${formValues.phoneNumber}`,
                  },
                  // {
                  //   icon: <User className="h-3 w-3" />,
                  //   label: 'Profile Image',
                  //   value: '',
                  //   imageUrl: profileImg,
                  // },
                  {
                    icon: <MapPin className="h-3 w-3" />,
                    label: 'Address',
                    value: formValues.address,
                  },
                  {
                    icon: <Building2 className="h-3 w-3" />,
                    label: 'City',
                    value: formValues.city,
                  },
                  {
                    icon: <MapIcon className="h-3 w-3" />,
                    label: 'State',
                    value: formValues.state,
                  },
                  {
                    icon: <Hash className="h-3 w-3" />,
                    label: 'Postal Code',
                    value: formValues.postalCode,
                  },
                  {
                    icon: <Globe className="h-3 w-3" />,
                    label: 'Country',
                    value: formValues.country,
                  },
                  ...(formValues.latitude != null &&
                  formValues.longitude != null
                    ? [
                        {
                          icon: <MapIcon className="h-3 w-3" />,
                          label: 'Latitude',
                          value: String(formValues.latitude),
                        },
                        {
                          icon: <MapIcon className="h-3 w-3" />,
                          label: 'Longitude',
                          value: String(formValues.longitude),
                        },
                      ]
                    : [
                        {
                          icon: <MapIcon className="h-3 w-3" />,
                          label: 'Coordinates',
                          value: 'Not provided',
                        },
                      ]),
                ],
              },
              ...(formValues.companyName
                ? [
                    {
                      icon: (
                        <Building2 className="h-5 w-5 text-white" />
                      ),
                      title: 'Company Details',

                      image: invoiceImg
                        ? { src: invoiceImg, alt: 'Invoice Logo' }
                        : undefined,
                      fields: [
                        {
                          icon: <Building2 className="h-3 w-3" />,
                          label: 'Company Name',
                          value: formValues.companyName,
                        },
                        {
                          icon: <Hash className="h-3 w-3" />,
                          label: 'GST Number',
                          value: formValues.gstNumber ?? '-',
                        },
                        {
                          icon: <Hash className="h-3 w-3" />,
                          label: 'Bank Account',
                          value: formValues.bankAccountNumber ?? '-',
                        },
                        // {
                        //   icon: <Building2 className="h-3 w-3" />,
                        //   label: 'Invoice Logo',
                        //   value: '',
                        //   imageUrl: invoiceImg,
                        // },
                      ],
                    },
                  ]
                : []),
            ]}
          />
        </form>
      );
    }

    return (
      <AdminFormStep
        step={currentStep}
        register={register}
        watch={watch}
        setValue={setValue}
        errors={errors}
        trigger={trigger}
      />
    );
  };

  return (
    <SuperAdminLayout>
      <div className="flex h-full flex-col">
        <div
          className="flex-1 w-full overflow-y-auto p-5 md:pl-10
"
        >
          <Button
            variant="ghost"
            onClick={() => navigate(ROUTES.SUPER_ADMIN_ADMINS)}
            className="mb-4 text-muted-foreground hover:text-primary hover:bg-primary/10"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Admins
          </Button>

          <Navbar
            title="Edit Admin"
            subtitle="Update administrator account details"
            showWelcome={false}
            superAccess
          />

          <AdminFormStepper
            steps={steps}
            currentStep={currentStep}
            onStepClick={setCurrentStep}
            onPrevious={handlePrevious}
            onNext={handleNext}
            onSubmit={handleSubmit(onSubmit)}
            isSubmitting={isUpdating}
            isLastStep={currentStep === steps.length}
            isFirstStep={currentStep === 1}
            submitLabel="Save Changes"
            allowStepNavigation
            formRef={formRef}
          >
            {renderStepContent()}
          </AdminFormStepper>
        </div>
      </div>
    </SuperAdminLayout>
  );
}
