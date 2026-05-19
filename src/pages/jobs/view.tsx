import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  User,
  MapPin,
  CreditCard,
  Clock,
  RefreshCw,
} from 'lucide-react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ROUTES } from '@/constants';

interface JobData {
  jobId: string;
  assignedCustomer: {
    customerId: string;
    name: string;
    email: string;
    phone: string;
    address: string;
    postalCode: string;
    city: string;
    state: string;
    country: string;
    active: boolean;
    status: string;
    createdBy: string;
    createdAt: string;
    updatedAt: string;
    balance: number;
  };
  assignedEmployee: {
    employeeId: string;
    name: string;
    address: string;
    contact: {
      email: string;
      phone: string;
    };
    status: string;
  };
  jobAddress: {
    addressLine: string;
    postalCode: string;
    city: string;
    state: string;
    country: string;
    location: {
      lat: number;
      lng: number;
    };
  };
  jobType: string;
  frequency: {
    value: number;
    unit: string;
  };
  paymentType: string;
  notes: string;
  status: string;
  active: boolean;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

const mockJob: JobData = {
  jobId: 'JOB-001',
  assignedCustomer: {
    customerId: 'CUST-001',
    name: 'Babu',
    email: 'babu_kondepudi@yahoo.co.nz',
    phone: '0211470500',
    address: '383A Richardson Road Mount Roskill',
    postalCode: '',
    city: '',
    state: '',
    country: '',
    active: true,
    status: 'Active',
    createdBy: 'Aman',
    createdAt: '2026-05-12T12:58:00Z',
    updatedAt: '2026-05-12T12:58:00Z',
    balance: 0,
  },
  assignedEmployee: {
    employeeId: 'EMP-001',
    name: 'Sarah Miller',
    address: 'Auckland, New Zealand',
    contact: {
      email: 'sarah.m@clovant.com',
      phone: '+64-XX-XXX-XXXX',
    },
    status: 'Active',
  },
  jobAddress: {
    addressLine: '383A Richardson Road Mount Roskill',
    postalCode: '1041',
    city: 'Auckland',
    state: 'Auckland',
    country: 'New Zealand',
    location: {
      lat: -36.909,
      lng: 174.731,
    },
  },
  jobType: 'Recurring',
  frequency: {
    value: 2,
    unit: 'Week',
  },
  paymentType: 'Bank Transfer',
  notes: 'Customer requested weekend servicing only.',
  status: 'Pending',
  active: true,
  createdBy: 'Aman',
  createdAt: '2026-05-14T10:30:00Z',
  updatedAt: '2026-05-14T10:30:00Z',
};

export default function JobViewPage() {
  const { id: _id } = useParams();
  const navigate = useNavigate();

  const job = mockJob;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Pending':
        return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'In Progress':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'Completed':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'Cancelled':
        return 'bg-red-100 text-red-700 border-red-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getJobTypeColor = (jobType: string) => {
    return jobType === 'Recurring'
      ? 'bg-purple-100 text-purple-700 border-purple-200'
      : 'bg-[#edf8e7] text-[#16610E] border-[#c7e8b9]';
  };

  return (
    <AppLayout>
      <div className="flex h-full flex-col">
        <div className="flex-1 w-full overflow-y-auto p-10">
          <div className="mx-auto">
            {/* Back Button */}
            <Button
              variant="ghost"
              onClick={() => navigate(ROUTES.JOBS)}
              className="mb-4 text-[#777] hover:text-[#16610E] hover:bg-[#edf8e7]"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Jobs
            </Button>

            {/* Header Section */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-[#ececec] mb-6">
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-xl bg-[#16610E] text-white flex items-center justify-center">
                    <Clock className="h-6 w-6" />
                  </div>
                  <div>
                    <div className="flex items-center gap-3">
                      <h1 className="text-2xl font-bold text-[#151515]">
                        {job.jobId}
                      </h1>
                      <Badge
                        className={`border ${getJobTypeColor(job.jobType)}`}
                      >
                        {job.jobType}
                      </Badge>
                    </div>
                    <p className="text-[#777] text-sm mt-1">
                      Job Details
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Badge
                    className={`border ${getStatusColor(job.status)} px-3 py-1`}
                  >
                    {job.status}
                  </Badge>
                  <Badge
                    className={`border ${job.active ? 'bg-green-100 text-green-700 border-green-200' : 'bg-gray-100 text-gray-700 border-gray-200'}`}
                  >
                    {job.active ? 'Active' : 'Inactive'}
                  </Badge>
                </div>
              </div>
            </div>

            {/* Cards Grid */}
            <div className="grid gap-6 md:grid-cols-2">
              {/* Customer Details Card */}
              <div className="bg-white rounded-xl p-6 shadow-sm border border-[#ececec]">
                <div className="flex items-center gap-2 mb-4">
                  <div className="h-8 w-8 rounded-lg bg-[#edf8e7] flex items-center justify-center">
                    <User className="h-4 w-4 text-[#16610E]" />
                  </div>
                  <h3 className="text-lg font-semibold text-[#151515]">
                    Customer Details
                  </h3>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-[#777]">Name</span>
                    <span className="text-[#151515] font-medium">
                      {job.assignedCustomer.name}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-[#777]">Email</span>
                    <span className="text-[#151515] font-medium">
                      {job.assignedCustomer.email}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-[#777]">Phone</span>
                    <span className="text-[#151515] font-medium">
                      {job.assignedCustomer.phone}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-[#777]">
                      Status
                    </span>
                    <Badge
                      className={`${job.assignedCustomer.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'} text-xs`}
                    >
                      {job.assignedCustomer.status}
                    </Badge>
                  </div>
                </div>
              </div>

              {/* Assigned Employee Card */}
              <div className="bg-white rounded-xl p-6 shadow-sm border border-[#ececec]">
                <div className="flex items-center gap-2 mb-4">
                  <div className="h-8 w-8 rounded-lg bg-[#edf8e7] flex items-center justify-center">
                    <User className="h-4 w-4 text-[#16610E]" />
                  </div>
                  <h3 className="text-lg font-semibold text-[#151515]">
                    Assigned Employee
                  </h3>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-[#777]">
                      Employee
                    </span>
                    <span className="text-[#151515] font-medium">
                      {job.assignedEmployee.name}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-[#777]">
                      Employee ID
                    </span>
                    <span className="text-[#151515] font-medium">
                      {job.assignedEmployee.employeeId}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-[#777]">Email</span>
                    <span className="text-[#151515] font-medium">
                      {job.assignedEmployee.contact.email}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-[#777]">Phone</span>
                    <span className="text-[#151515] font-medium">
                      {job.assignedEmployee.contact.phone}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-[#777]">
                      Status
                    </span>
                    <Badge
                      className={`${job.assignedEmployee.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'} text-xs`}
                    >
                      {job.assignedEmployee.status}
                    </Badge>
                  </div>
                </div>
              </div>

              {/* Job Location Card */}
              <div className="bg-white rounded-xl p-6 shadow-sm border border-[#ececec] md:col-span-2">
                <div className="flex items-center gap-2 mb-4">
                  <div className="h-8 w-8 rounded-lg bg-[#edf8e7] flex items-center justify-center">
                    <MapPin className="h-4 w-4 text-[#16610E]" />
                  </div>
                  <h3 className="text-lg font-semibold text-[#151515]">
                    Job Location
                  </h3>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div className="col-span-2 md:col-span-3">
                    <p className="text-sm text-[#777]">Address</p>
                    <p className="text-[#151515] font-medium mt-1">
                      {job.jobAddress.addressLine}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-[#777]">City</p>
                    <p className="text-[#151515] font-medium">
                      {job.jobAddress.city}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-[#777]">State</p>
                    <p className="text-[#151515] font-medium">
                      {job.jobAddress.state}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-[#777]">Postal Code</p>
                    <p className="text-[#151515] font-medium">
                      {job.jobAddress.postalCode}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-[#777]">Country</p>
                    <p className="text-[#151515] font-medium">
                      {job.jobAddress.country}
                    </p>
                  </div>
                  <div className="col-span-2 md:col-span-3">
                    <p className="text-sm text-[#777]">Coordinates</p>
                    <p className="text-[#151515] font-medium mt-1">
                      {job.jobAddress.location.lat},{' '}
                      {job.jobAddress.location.lng}
                    </p>
                  </div>
                </div>

                {/* View on Google Maps Button */}
                <button
                  type="button"
                  onClick={() => {
                    const url = `https://www.google.com/maps?q=${job.jobAddress.location.lat},${job.jobAddress.location.lng}`;
                    window.open(url, '_blank');
                  }}
                  className="w-full mt-4 flex items-center justify-center gap-2 py-2.5 px-4 bg-[#edf8e7] hover:bg-[#dff0d4] border border-[#c7e8b9] rounded-xl text-[#16610E] font-medium transition-colors"
                >
                  <MapPin className="h-4 w-4" />
                  View on Google Maps
                </button>
              </div>

              {/* Schedule Card */}
              <div className="bg-white rounded-xl p-6 shadow-sm border border-[#ececec]">
                <div className="flex items-center gap-2 mb-4">
                  <div className="h-8 w-8 rounded-lg bg-[#edf8e7] flex items-center justify-center">
                    <RefreshCw className="h-4 w-4 text-[#16610E]" />
                  </div>
                  <h3 className="text-lg font-semibold text-[#151515]">
                    Schedule
                  </h3>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-[#777]">
                      Job Type
                    </span>
                    <Badge
                      className={`border ${getJobTypeColor(job.jobType)}`}
                    >
                      {job.jobType}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-[#777]">
                      Frequency
                    </span>
                    <div className="flex items-center gap-2">
                      <RefreshCw className="h-4 w-4 text-[#16610E]" />
                      <span className="text-[#151515] font-medium">
                        Every {job.frequency.value}{' '}
                        {job.frequency.unit}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Payment & Notes Card */}
              <div className="bg-white rounded-xl p-6 shadow-sm border border-[#ececec]">
                <div className="flex items-center gap-2 mb-4">
                  <div className="h-8 w-8 rounded-lg bg-[#edf8e7] flex items-center justify-center">
                    <CreditCard className="h-4 w-4 text-[#16610E]" />
                  </div>
                  <h3 className="text-lg font-semibold text-[#151515]">
                    Payment & Notes
                  </h3>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-[#777]">
                      Payment Type
                    </span>
                    <span className="text-[#151515] font-medium">
                      {job.paymentType}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm text-[#777]">Notes</p>
                    <p className="text-[#151515] font-medium mt-1">
                      {job.notes || '-'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Timestamps Card */}
              <div className="bg-white rounded-xl p-6 shadow-sm border border-[#ececec] md:col-span-2">
                <div className="flex items-center gap-2 mb-4">
                  <div className="h-8 w-8 rounded-lg bg-[#edf8e7] flex items-center justify-center">
                    <Clock className="h-4 w-4 text-[#16610E]" />
                  </div>
                  <h3 className="text-lg font-semibold text-[#151515]">
                    Timestamps
                  </h3>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div>
                    <p className="text-sm text-[#777]">Created By</p>
                    <p className="text-[#151515] font-medium mt-1">
                      {job.createdBy}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-[#777]">Created At</p>
                    <p className="text-[#151515] font-medium mt-1">
                      {formatDate(job.createdAt)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-[#777]">
                      Last Updated
                    </p>
                    <p className="text-[#151515] font-medium mt-1">
                      {formatDate(job.updatedAt)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
