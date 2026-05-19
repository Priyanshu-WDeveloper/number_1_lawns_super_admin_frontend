import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { PhoneInput } from '@/components/forms/phone-input';
import { LocationModeToggle } from '@/components/forms/location-mode-toggle';
import { MockMapPicker } from '@/components/forms/mock-map-picker';
import { ManualCoordinates } from '@/components/forms/manual-coordinates';

interface AdminFormStepProps {
  step: number;
  register: any;
  watch: any;
  setValue: any;
  errors: Record<string, { message?: string }>;
}

export function AdminFormStep({
  step,
  register,
  watch,
  setValue,
  errors,
}: AdminFormStepProps) {
  const formValues = watch();

  if (step === 1) {
    return (
      <div className="space-y-6">
        <div>
          <h4 className="mb-4 text-sm font-medium uppercase tracking-wide text-[#777]">
            Basic Information
          </h4>
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-medium text-[#151515]">
                First Name
                <span className="text-[#16610E]"> *</span>
              </label>
              <Input
                placeholder="Enter first name"
                {...register('firstName')}
                className="h-12 rounded-xl border-[#e5e5e5] bg-[#fafaf8]"
              />
              {errors.firstName && (
                <p className="text-sm text-red-500">
                  {errors.firstName.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-[#151515]">
                Last Name
                <span className="text-[#16610E]"> *</span>
              </label>
              <Input
                placeholder="Enter last name"
                {...register('lastName')}
                className="h-12 rounded-xl border-[#e5e5e5] bg-[#fafaf8]"
              />
              {errors.lastName && (
                <p className="text-sm text-red-500">
                  {errors.lastName.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-[#151515]">
                Email Address
                <span className="text-[#16610E]"> *</span>
              </label>
              <Input
                type="email"
                placeholder="Enter email address"
                {...register('email')}
                className="h-12 rounded-xl border-[#e5e5e5] bg-[#fafaf8]"
              />
              {errors.email && (
                <p className="text-sm text-red-500">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-[#151515]">
                Phone Number
                <span className="text-[#16610E]"> *</span>
              </label>
              <PhoneInput
                value={formValues.phoneNumber}
                onChange={(val) =>
                  setValue('phoneNumber', val, {
                    shouldValidate: true,
                  })
                }
                countryCode={formValues.countryCode}
                onCountryCodeChange={(code) =>
                  setValue('countryCode', code, {
                    shouldValidate: true,
                  })
                }
                error={errors.phoneNumber?.message}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (step === 2) {
    const locationMode = watch('locationMode') || 'map';
    const latitude = watch('latitude') || 0;
    const longitude = watch('longitude') || 0;

    const handleModeChange = (mode: 'map' | 'manual') => {
      setValue('locationMode', mode);
    };

    const handleCoordinatePick = (lat: number, lng: number) => {
      setValue('latitude', lat, { shouldValidate: true });
      setValue('longitude', lng, { shouldValidate: true });
    };

    return (
      <div className="space-y-6">
        <div>
          <h4 className="mb-4 text-sm font-medium uppercase tracking-wide text-[#777]">
            Address Information
          </h4>
          <div className="space-y-5">
            <LocationModeToggle
              value={locationMode}
              onChange={handleModeChange}
            />

            {locationMode === 'map' ? (
              <MockMapPicker
                latitude={latitude}
                longitude={longitude}
                onPick={handleCoordinatePick}
              />
            ) : (
              <ManualCoordinates
                latitude={latitude}
                longitude={longitude}
                onChange={handleCoordinatePick}
              />
            )}

            <div className="space-y-2">
              <label className="text-sm font-medium text-[#151515]">
                Address
                <span className="text-[#16610E]"> *</span>
              </label>
              <Textarea
                placeholder="Enter address"
                {...register('address')}
                className="min-h-[80px] rounded-xl border-[#e5e5e5] bg-[#fafaf8] p-4"
              />
              {errors.address && (
                <p className="text-sm text-red-500">
                  {errors.address.message}
                </p>
              )}
            </div>

            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-medium text-[#151515]">
                  City
                </label>
                <Input
                  placeholder="Enter city"
                  {...register('city')}
                  className="h-12 rounded-xl border-[#e5e5e5] bg-[#fafaf8]"
                />
                {errors.city && (
                  <p className="text-sm text-red-500">
                    {errors.city.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-[#151515]">
                  State
                </label>
                <Input
                  placeholder="Enter state"
                  {...register('state')}
                  className="h-12 rounded-xl border-[#e5e5e5] bg-[#fafaf8]"
                />
                {errors.state && (
                  <p className="text-sm text-red-500">
                    {errors.state.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-[#151515]">
                  Postal Code
                </label>
                <Input
                  placeholder="Enter postal code"
                  {...register('postalCode')}
                  className="h-12 rounded-xl border-[#e5e5e5] bg-[#fafaf8]"
                />
                {errors.postalCode && (
                  <p className="text-sm text-red-500">
                    {errors.postalCode.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-[#151515]">
                  Country
                </label>
                <Input
                  placeholder="Enter country"
                  {...register('country')}
                  className="h-12 rounded-xl border-[#e5e5e5] bg-[#fafaf8]"
                />
                {errors.country && (
                  <p className="text-sm text-red-500">
                    {errors.country.message}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
