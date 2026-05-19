import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import z from 'zod';
import {
  ArrowLeft,
  Briefcase,
  Users,
  MapPin,
  Calendar,
  CreditCard,
  Check,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AppLayout } from '@/components/layout/AppLayout';
import { Stepper } from '@/components/ui/stepper';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { LocationModeToggle } from '@/components/forms/location-mode-toggle';
import { MockMapPicker } from '@/components/forms/mock-map-picker';
import { ManualCoordinates } from '@/components/forms/manual-coordinates';
import { ROUTES } from '@/constants';

const jobSchema = z.object({
  customer: z.string().min(1, 'Customer is required'),
  employee: z.string().min(1, 'Employee is required'),
  jobAddress: z.string(),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  locationMode: z.enum(['map', 'manual']),
  // address: z.string(),
  // city: z.string(),
  // state: z.string(),
  // postalCode: z
  //   .string()
  //   .regex(/^\d+$/, 'Postal code must be numeric')
  //   .or(z.literal('')),
  // country: z.string(),
  jobType: z.string().min(1, 'Job type is required'),
  jobDate: z.string().min(1, 'Job date is required'),
  frequencyValue: z.number().optional(),
  frequencyUnit: z.string().optional(),
  paymentType: z.string().min(1, 'Payment type is required'),
  notes: z.string().optional(),
});

type FormData = z.infer<typeof jobSchema>;

const initialFormData: FormData = {
  customer: '',
  employee: '',
  jobAddress: '',
  latitude: undefined,
  longitude: undefined,
  locationMode: 'map',
  // address: '',
  // city: '',
  // state: '',
  // country: '',
  jobType: '',
  frequencyValue: 1,
  frequencyUnit: 'week',
  paymentType: '',
  jobDate: '',
  notes: '',
};

const steps = [
  {
    id: 1,
    title: 'Assignment',
    description: 'Customer & Employee',
    icon: <Users className="h-4 w-4" />,
  },
  {
    id: 2,
    title: 'Location',
    description: 'Job address',
    icon: <MapPin className="h-4 w-4" />,
  },
  {
    id: 3,
    title: 'Schedule',
    description: 'Type & frequency',
    icon: <Calendar className="h-4 w-4" />,
  },
  {
    id: 4,
    title: 'Payment',
    description: 'Payment details',
    icon: <CreditCard className="h-4 w-4" />,
  },
];

export default function CreateJobPage() {
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
    resolver: zodResolver(jobSchema),
    defaultValues: initialFormData,
  });

  const formValues = watch();

  const handleNext = async () => {
    let fieldsToValidate: (keyof FormData)[] = [];

    if (currentStep === 1) {
      fieldsToValidate = ['customer', 'employee'];
    } else if (currentStep === 2) {
      fieldsToValidate = ['jobAddress'];
    } else if (currentStep === 3) {
      fieldsToValidate = ['jobType', 'jobDate'];
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
        : undefined,
    };
    console.log('Creating job:', payload);
    navigate(ROUTES.JOBS);
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            {/* Assignment Section */}
            <div>
              <h4 className="text-sm font-medium text-[#777] mb-4 uppercase tracking-wide">
                Job Assignment
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-[#151515]">
                    Select Customer{' '}
                    <span className="text-[#16610E]">*</span>
                  </label>
                  <Select
                    value={formValues.customer || ''}
                    onValueChange={(v) => setValue('customer', v)}
                  >
                    <SelectTrigger className="h-12 border-[#e5e5e5] rounded-xl bg-[#fafaf8] focus:bg-white focus:border-[#16610E]">
                      <SelectValue placeholder="Choose a customer" />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl">
                      <SelectItem value="cust-1">
                        Babu Kondepudi
                      </SelectItem>
                      <SelectItem value="cust-2">John Doe</SelectItem>
                      <SelectItem value="cust-3">
                        Jane Smith
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.customer && (
                    <p className="text-sm text-red-500 mt-1">
                      {errors.customer.message}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-[#151515]">
                    Select Employee{' '}
                    <span className="text-[#16610E]">*</span>
                  </label>
                  <Select
                    value={formValues.employee || ''}
                    onValueChange={(v) => setValue('employee', v)}
                  >
                    <SelectTrigger className="h-12 border-[#e5e5e5] rounded-xl bg-[#fafaf8] focus:bg-white focus:border-[#16610E]">
                      <SelectValue placeholder="Choose an employee" />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl">
                      <SelectItem value="emp-1">
                        Sarah Miller
                      </SelectItem>
                      <SelectItem value="emp-2">
                        Aman Sharma
                      </SelectItem>
                      <SelectItem value="emp-3">
                        John Smith
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.employee && (
                    <p className="text-sm text-red-500 mt-1">
                      {errors.employee.message}
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
                Job Location
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
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            {/* Schedule Section */}
            <div>
              <h4 className="text-sm font-medium text-[#777] mb-4 uppercase tracking-wide">
                Job Schedule
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-[#151515]">
                    Job Type <span className="text-[#16610E]">*</span>
                  </label>
                  <Select
                    value={formValues.jobType || ''}
                    onValueChange={(v) => setValue('jobType', v)}
                  >
                    <SelectTrigger className="h-12 border-[#e5e5e5] rounded-xl bg-[#fafaf8] focus:bg-white focus:border-[#16610E]">
                      <SelectValue placeholder="Select job type" />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl">
                      <SelectItem value="one-time">
                        One Time
                      </SelectItem>
                      <SelectItem value="recurring">
                        Recurring
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.jobType && (
                    <p className="text-sm text-red-500 mt-1">
                      {errors.jobType.message}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-[#151515]">
                    Job Date <span className="text-[#16610E]">*</span>
                  </label>
                  <Input
                    type="date"
                    {...register('jobDate')}
                    className="h-12 border-[#e5e5e5] rounded-xl bg-[#fafaf8] focus:bg-white focus:border-[#16610E] cursor-pointer"
                  />
                  {errors.jobDate && (
                    <p className="text-sm text-red-500 mt-1">
                      {errors.jobDate.message}
                    </p>
                  )}
                </div>

                {/* Show frequency fields only when recurring */}
                {formValues.jobType === 'recurring' && (
                  <>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-[#151515]">
                        Frequency Value
                      </label>
                      <Input
                        type="number"
                        min={1}
                        {...register('frequencyValue', {
                          valueAsNumber: true,
                        })}
                        className="h-12 border-[#e5e5e5] rounded-xl bg-[#fafaf8] focus:bg-white focus:border-[#16610E]"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-[#151515]">
                        Frequency Unit
                      </label>
                      <Select
                        value={formValues.frequencyUnit || ''}
                        onValueChange={(v) =>
                          setValue('frequencyUnit', v)
                        }
                      >
                        <SelectTrigger className="h-12 border-[#e5e5e5] rounded-xl bg-[#fafaf8] focus:bg-white focus:border-[#16610E]">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="rounded-xl">
                          <SelectItem value="day">Day</SelectItem>
                          <SelectItem value="week">Week</SelectItem>
                          <SelectItem value="month">Month</SelectItem>
                          <SelectItem value="year">Year</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            {/* Payment Section */}
            <div>
              <h4 className="text-sm font-medium text-[#777] mb-4 uppercase tracking-wide">
                Payment & Notes
              </h4>
              <div className="space-y-5">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-[#151515]">
                    Payment Type{' '}
                    <span className="text-[#16610E]">*</span>
                  </label>
                  <Select
                    value={formValues.paymentType || ''}
                    onValueChange={(v) => setValue('paymentType', v)}
                  >
                    <SelectTrigger className="h-12 border-[#e5e5e5] rounded-xl bg-[#fafaf8] focus:bg-white focus:border-[#16610E]">
                      <SelectValue placeholder="Select payment type" />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl">
                      <SelectItem value="bank-transfer">
                        Bank Transfer
                      </SelectItem>
                      <SelectItem value="cash">Cash</SelectItem>
                      <SelectItem value="drop-invoice">
                        Drop Invoice
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.paymentType && (
                    <p className="text-sm text-red-500 mt-1">
                      {errors.paymentType.message}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-[#151515]">
                    Notes
                  </label>
                  <Textarea
                    placeholder="Add any additional notes..."
                    {...register('notes')}
                    className="min-h-[100px] p-4 border-[#e5e5e5] rounded-xl bg-[#fafaf8] focus:bg-white focus:border-[#16610E] resize-none"
                  />
                </div>
              </div>
            </div>

            {/* Review Summary */}
            <div className="p-6 bg-[#fafaf8] rounded-xl border border-dashed border-[#e5e5e5]">
              <div className="text-center mb-4">
                <div className="h-12 w-12 rounded-full bg-[#edf8e7] flex items-center justify-center mx-auto mb-3">
                  <Check className="h-6 w-6 text-[#16610E]" />
                </div>
                <h5 className="text-lg font-semibold text-[#151515]">
                  Review Your Job Details
                </h5>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm bg-white rounded-lg p-4">
                <div>
                  <p className="text-[#777]">Customer</p>
                  <p className="font-medium">
                    {formValues.customer || '-'}
                  </p>
                </div>
                <div>
                  <p className="text-[#777]">Employee</p>
                  <p className="font-medium">
                    {formValues.employee || '-'}
                  </p>
                </div>
                <div>
                  <p className="text-[#777]">Job Type</p>
                  <p className="font-medium">
                    {formValues.jobType === 'recurring'
                      ? 'Recurring'
                      : 'One Time'}
                  </p>
                </div>
                <div>
                  <p className="text-[#777]">Payment</p>
                  <p className="font-medium">
                    {formValues.paymentType || '-'}
                  </p>
                </div>
                <div className="col-span-2">
                  <p className="text-[#777]">Address</p>
                  <p className="font-medium">
                    {formValues.jobAddress || '-'}
                  </p>
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
      <main className="flex-1 w-full overflow-y-auto px-4 pt-5 pb-5">
        <div className="max-w-4xl mx-auto">
          {/* Back Button */}
          <Button
            variant="ghost"
            onClick={() => navigate(ROUTES.JOBS)}
            className="mb-6 text-[#777] hover:text-[#16610E] hover:bg-[#edf8e7] gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Jobs
          </Button>

          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-[#151515]">
              Create New Job
            </h1>
            <p className="text-[#777] mt-1">
              Schedule a new job and assign customer & employee
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
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-xl bg-[#edf8e7] flex items-center justify-center">
                  <Briefcase className="h-6 w-6 text-[#16610E]" />
                </div>
                <div>
                  <p className="text-sm text-[#777]">
                    Step {currentStep} of {steps.length}
                  </p>
                  <h3 className="text-xl font-semibold text-[#151515]">
                    {currentStep === 1 && 'Job Assignment'}
                    {currentStep === 2 && 'Job Location'}
                    {currentStep === 3 && 'Schedule Details'}
                    {currentStep === 4 && 'Payment & Review'}
                  </h3>
                </div>
              </div>
            </div>

            <form onSubmit={handleSubmit(onSubmit)}>
              {/* Form Content */}
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
                    Create Job
                  </Button>
                )}
              </div>
            </form>
          </div>
        </div>
      </main>
    </AppLayout>
  );
}
