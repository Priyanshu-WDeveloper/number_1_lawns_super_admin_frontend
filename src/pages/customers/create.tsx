import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import z from 'zod';
import {
  ArrowLeft,
  Users,
  Mail,
  MapPin,
  Building,
  Check,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AppLayout } from '@/components/layout/AppLayout';
import { Stepper } from '@/components/ui/stepper';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { LocationModeToggle } from '@/components/forms/location-mode-toggle';
import { MockMapPicker } from '@/components/forms/mock-map-picker';
import { ManualCoordinates } from '@/components/forms/manual-coordinates';
import { ROUTES } from '@/constants';

const customerSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().min(1, 'Email is required').email('Invalid email address'),
  phone: z.string().min(1, 'Phone is required').regex(/^\d+$/, 'Phone must be numeric'),
  location: z.string().optional(),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  locationMode: z.enum(['map', 'manual']),
  address: z.string().min(1, 'Address is required'),
  postalCode: z.string().regex(/^\d+$/, 'Postal code must be numeric').or(z.literal('')),
  city: z.string().optional(),
  state: z.string().optional(),
  country: z.string().optional(),
});

type FormData = z.infer<typeof customerSchema>;

const initialFormData: FormData = {
  name: '',
  email: '',
  phone: '',
  location: '',
  latitude: undefined,
  longitude: undefined,
  locationMode: 'map',
  address: '',
  postalCode: '',
  city: '',
  state: '',
  country: '',
};

const steps = [
  {
    id: 1,
    title: 'Contact Info',
    description: 'Basic contact details',
    icon: <Mail className="h-4 w-4" />,
  },
  {
    id: 2,
    title: 'Location',
    description: 'Address details',
    icon: <MapPin className="h-4 w-4" />,
  },
  {
    id: 3,
    title: 'Review',
    description: 'Extra information',
    icon: <Building className="h-4 w-4" />,
  },
];

export default function CreateCustomerPage() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  
  const {
    register,
    handleSubmit,
    trigger,
    watch,
    setValue,
    formState: { errors },
  } = useForm<FormData>({
    mode: 'onChange',
    resolver: zodResolver(customerSchema),
    defaultValues: initialFormData,
  });

  const formValues = watch();

  const handleNext = async () => {
    let fieldsToValidate: (keyof FormData)[] = [];
    
    if (currentStep === 1) {
      fieldsToValidate = ['name', 'email', 'phone'];
    } else if (currentStep === 2) {
      fieldsToValidate = ['location'];
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

  const onSubmit = (data: FormData) => {
    const payload = {
      ...data,
      location: data.latitude && data.longitude
        ? { type: 'Point' as const, coordinates: [data.longitude, data.latitude] }
        : data.location,
    };
    console.log('Creating customer:', payload);
    navigate(ROUTES.CUSTOMERS);
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            {/* Contact & Identity Section */}
            <div>
              <h4 className="text-sm font-medium text-[#777] mb-4 uppercase tracking-wide">
                Contact & Identity
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-[#151515]">
                    Full Name{' '}
                    <span className="text-[#16610E]">*</span>
                  </label>
                  <Input
                    placeholder="Enter full name"
                    {...register('name')}
                    className="h-12 border-[#e5e5e5] rounded-xl bg-[#fafaf8] focus:bg-white focus:border-[#16610E] focus:ring-[#16610E] transition-all"
                  />
                  {errors.name && (
                    <p className="text-sm text-red-500 mt-1">
                      {errors.name.message}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-[#151515]">
                    Email Address{' '}
                    <span className="text-[#16610E]">*</span>
                  </label>
                  <Input
                    type="email"
                    placeholder="Enter email address"
                    {...register('email')}
                    className="h-12 border-[#e5e5e5] rounded-xl bg-[#fafaf8] focus:bg-white focus:border-[#16610E] focus:ring-[#16610E] transition-all"
                  />
                  {errors.email && (
                    <p className="text-sm text-red-500 mt-1">
                      {errors.email.message}
                    </p>
                  )}
                </div>
                <div className="space-y-2 md:col-span-2">
                  <label className="text-sm font-medium text-[#151515]">
                    Phone Number{' '}
                    <span className="text-[#16610E]">*</span>
                  </label>
                  <Input
                    type="tel"
                    placeholder="Enter phone number"
                    value={formValues.phone || ''}
                    onChange={(e) => {
                      const numeric = e.target.value.replace(/\D/g, '');
                      setValue('phone', numeric, { shouldValidate: true });
                    }}
                    className="h-12 border-[#e5e5e5] rounded-xl bg-[#fafaf8] focus:bg-white focus:border-[#16610E] focus:ring-[#16610E] transition-all"
                  />
                  {errors.phone && (
                    <p className="text-sm text-red-500 mt-1">
                      {errors.phone.message}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div>
              <h4 className="text-sm font-medium text-[#777] mb-4 uppercase tracking-wide">
                Address Information
              </h4>
              <div className="space-y-5">
                <LocationModeToggle
                  value={formValues.locationMode || 'map'}
                  onChange={(mode) => setValue('locationMode', mode)}
                />

                {formValues.locationMode === 'map' ? (
                  <MockMapPicker
                    latitude={formValues.latitude || 0}
                    longitude={formValues.longitude || 0}
                    onPick={(lat, lng) => {
                      setValue('latitude', lat);
                      setValue('longitude', lng);
                    }}
                  />
                ) : (
                  <ManualCoordinates
                    latitude={formValues.latitude || 0}
                    longitude={formValues.longitude || 0}
                    onChange={(lat, lng) => {
                      setValue('latitude', lat);
                      setValue('longitude', lng);
                    }}
                  />
                )}

                <div className="space-y-2">
                  <label className="text-sm font-medium text-[#151515]">
                    Street Address{' '}
                    <span className="text-[#16610E]">*</span>
                  </label>
                  <Textarea
                    placeholder="Enter street address"
                    {...register('address')}
                    className="min-h-[80px] p-4 border-[#e5e5e5] rounded-xl bg-[#fafaf8] focus:bg-white focus:border-[#16610E] focus:ring-[#16610E] transition-all resize-none"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-[#151515]">
                      City
                    </label>
                    <Input
                      placeholder="Enter city"
                      {...register('city')}
                      className="h-12 border-[#e5e5e5] rounded-xl bg-[#fafaf8] focus:bg-white focus:border-[#16610E] focus:ring-[#16610E] transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-[#151515]">
                      State / Province
                    </label>
                    <Input
                      placeholder="Enter state"
                      {...register('state')}
                      className="h-12 border-[#e5e5e5] rounded-xl bg-[#fafaf8] focus:bg-white focus:border-[#16610E] focus:ring-[#16610E] transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-[#151515]">
                      Postal Code
                    </label>
                    <Input
                      placeholder="Enter postal code"
                      value={formValues.postalCode || ''}
                      onChange={(e) => {
                        const numeric = e.target.value.replace(/\D/g, '');
                        setValue('postalCode', numeric, { shouldValidate: true });
                      }}
                      className="h-12 border-[#e5e5e5] rounded-xl bg-[#fafaf8] focus:bg-white focus:border-[#16610E] focus:ring-[#16610E] transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-[#151515]">
                      Country
                    </label>
                    <Input
                      placeholder="Enter country"
                      {...register('country')}
                      className="h-12 border-[#e5e5e5] rounded-xl bg-[#fafaf8] focus:bg-white focus:border-[#16610E] focus:ring-[#16610E] transition-all"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            {/* Additional Details Section */}
            <div>
              <h4 className="text-sm font-medium text-[#777] mb-4 uppercase tracking-wide">
                Account Settings
              </h4>
              <div className="p-6 bg-[#fafaf8] rounded-xl border border-dashed border-[#e5e5e5]">
                <div className="text-center">
                  <div className="h-12 w-12 rounded-full bg-[#edf8e7] flex items-center justify-center mx-auto mb-4">
                    <Check className="h-6 w-6 text-[#16610E]" />
                  </div>
                  <h5 className="text-lg font-semibold text-[#151515] mb-2">
                    Review Your Information
                  </h5>
                  <p className="text-sm text-[#777] mb-4">
                    Please review all the details before creating the
                    customer
                  </p>

                  <div className="text-left bg-white rounded-lg p-4 text-sm space-y-2">
                    <p>
                      <span className="text-[#777]">Name:</span>{' '}
                      <span className="font-medium">
                        {formValues.name || '-'}
                      </span>
                    </p>
                    <p>
                      <span className="text-[#777]">Email:</span>{' '}
                      <span className="font-medium">
                        {formValues.email || '-'}
                      </span>
                    </p>
                    <p>
                      <span className="text-[#777]">Phone:</span>{' '}
                      <span className="font-medium">
                        {formValues.phone || '-'}
                      </span>
                    </p>
                    <p>
                      <span className="text-[#777]">Location:</span>{' '}
                      <span className="font-medium">
                        {formValues.location || formValues.address || '-'}
                      </span>
                    </p>
                    <p>
                      <span className="text-[#777]">City:</span>{' '}
                      <span className="font-medium">
                        {formValues.city || '-'}
                      </span>
                    </p>
                    <p>
                      <span className="text-[#777]">Country:</span>{' '}
                      <span className="font-medium">
                        {formValues.country || '-'}
                      </span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <AppLayout>
      <div className="flex-1 w-full overflow-y-auto p-10">
        <div className="mx-auto">
          {/* Back Button */}
          <Button
            variant="ghost"
            onClick={() => navigate(ROUTES.CUSTOMERS)}
            className="mb-6 text-[#777] hover:text-[#16610E] hover:bg-[#edf8e7] gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Customers
          </Button>

          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-[#151515]">
              Add New Customer
            </h1>
            <p className="text-[#777] mt-1">
              Create a new customer account with comprehensive details
            </p>
          </div>

          {/* Stepper */}
          <div className="mb-8 p-6 bg-white rounded-2xl border border-[#ececec] shadow-sm">
            <Stepper
              steps={steps}
              currentStep={currentStep}
              onStepClick={setCurrentStep}
            />
          </div>

          {/* Form Card */}
          <div className="bg-white rounded-2xl border border-[#ececec] shadow-sm overflow-hidden">
            {/* Card Header */}
            <div className="px-8 py-6 border-b border-[#ececec] bg-[#fafaf8]">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-xl bg-[#edf8e7] flex items-center justify-center">
                    <Users className="h-6 w-6 text-[#16610E]" />
                  </div>
                  <div>
                    <p className="text-sm text-[#777]">
                      Step {currentStep} of {steps.length}
                    </p>
                    <h3 className="text-xl font-semibold text-[#151515]">
                      {currentStep === 1 && 'Contact Information'}
                      {currentStep === 2 && 'Location Details'}
                      {currentStep === 3 && 'Review & Submit'}
                    </h3>
                  </div>
                </div>
              </div>
            </div>

            {/* Form Content */}
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="p-8">{renderStepContent()}</div>

              {/* Form Actions */}
              <div className="px-8 py-6 border-t border-[#ececec] bg-[#fafaf8] flex items-center justify-between">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handlePrevious}
                  disabled={currentStep === 1}
                  className="h-12 px-6 rounded-xl border-[#e5e5e5] text-[#777] hover:text-[#16610E] hover:border-[#16610E] hover:bg-[#edf8e7] transition-all disabled:opacity-50"
                >
                  Previous
                </Button>

                {currentStep < steps.length ? (
                  <Button
                    type="button"
                    onClick={handleNext}
                    className="h-12 px-8 rounded-xl bg-[#16610E] hover:bg-[#1a7a12] text-white font-medium shadow-md hover:shadow-lg transition-all"
                  >
                    Continue
                  </Button>
                ) : (
                  <Button
                    type="submit"
                    className="h-12 px-8 rounded-xl bg-[#16610E] hover:bg-[#1a7a12] text-white font-medium shadow-md hover:shadow-lg transition-all"
                  >
                    Create Customer
                  </Button>
                )}
              </div>
            </form>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
