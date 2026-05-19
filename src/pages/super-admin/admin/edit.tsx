import { useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import z from 'zod';
import toast from 'react-hot-toast';
import { SuperAdminLayout } from '@/components/layout/SuperAdminLayout';
import { Navbar } from '@/components/layout/Navbar';
import { ROUTES } from '@/constants';
import {
  useGetAdminUserByIdQuery,
  useUpdateAdminUserMutation,
} from '../../../API/api';
import { AdminFormStepper } from '../../../components/admin/admin-form-stepper';
import { AdminFormStep } from '../../../components/admin/admin-form-step';
import { AdminReviewCard } from '../../../components/admin/admin-review-card';
import Loader from '../../../components/loader';
import type { IAdmins } from '../../../types/admins.types';

const editAdminSchema = z.object({
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
  location: z.string(),
  latitude: z.number(),
  longitude: z.number(),
  locationMode: z.enum(['map', 'manual']),
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

  const { data, isLoading: isLoadingAdmin } =
    useGetAdminUserByIdQuery(id, {
      skip: !!passedAdmin,
    });
  const admin = passedAdmin ?? data?.admin;

  const {
    register,
    handleSubmit,
    trigger,
    watch,
    setValue,
    formState: { errors },
  } = useForm<EditAdminFormData>({
    mode: 'all',
    resolver: zodResolver(editAdminSchema),
    values: admin
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
          location: admin.location?.coordinates
            ? `${admin.location.coordinates[1]}, ${admin.location.coordinates[0]}`
            : '',
          latitude: admin.location?.coordinates?.[1] || 0,
          longitude: admin.location?.coordinates?.[0] || 0,
          locationMode: admin.location?.coordinates?.[0] && admin.location?.coordinates?.[1] ? 'map' : 'manual',
        }
      : undefined,
  });

  const formValues = watch();

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
      await updateAdmin({
        id,
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phoneNumber: data.phoneNumber,
        countryCode: data.countryCode,
        city: data.city,
        address: data.address,
        state: data.state,
        postalCode: data.postalCode,
        country: data.country,
        location: {
          type: 'Point',
          coordinates: [data.longitude, data.latitude],
        },
      }).unwrap();

      toast.success('Admin updated successfully');
      navigate(ROUTES.SUPER_ADMIN_ADMINS);
    } catch (error: any) {
      toast.error(error?.data?.message || 'Failed to update admin');
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
          <p className="text-[#777]">Admin not found</p>
        </div>
      </SuperAdminLayout>
    );
  }

  const renderStepContent = () => {
    if (currentStep === 3) {
      return (
        <form onSubmit={handleSubmit(onSubmit)}>
          <AdminReviewCard
            firstName={formValues.firstName}
            lastName={formValues.lastName}
            email={formValues.email}
            countryCode={formValues.countryCode}
            phoneNumber={formValues.phoneNumber}
            address={formValues.address}
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
      />
    );
  };

  return (
    <SuperAdminLayout>
      <div className="flex h-full flex-col">
        <div className="flex-1 w-full overflow-y-auto p-10">
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
        >
          {renderStepContent()}
        </AdminFormStepper>
      </div>
    </div>
    </SuperAdminLayout>
  );
}
