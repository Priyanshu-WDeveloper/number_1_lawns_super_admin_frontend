import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Mail,
  Phone,
  MapPin,
  User,
  FileText,
  File,
  Image,
  Eye,
} from 'lucide-react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { useEmployeeStore } from '@/store/employeeStore';
import type { EmployeeDocument, Employee } from '@/store/employeeStore';
import { ROUTES } from '@/constants';

const getFileIcon = (type: string) => {
  if (type.startsWith('image/')) {
    return <Image className="h-5 w-5 text-blue-500" />;
  }
  if (type === 'application/pdf') {
    return <FileText className="h-5 w-5 text-red-500" />;
  }
  return <File className="h-5 w-5 text-gray-500" />;
};

const formatFileSize = (bytes: number) => {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
};

const mockEmployeeData: Employee = {
  id: 'EMP-001',
  employeeId: 'EMP-001',
  name: 'Sarah Miller',
  email: 'sarah.m@clovant.com',
  phone: '+64-21-123-4567',
  address: 'Auckland, New Zealand',
  contact: {
    email: 'sarah.m@clovant.com',
    phone: '+64-21-123-4567',
  },
  status: 'Active',
  documents: [
    {
      id: 'doc-1',
      name: 'resume.pdf',
      type: 'application/pdf',
      size: 245000,
      url: '#',
    },
    {
      id: 'doc-2',
      name: 'profile-photo.jpg',
      type: 'image/jpeg',
      size: 125000,
      url: '#',
    },
    {
      id: 'doc-3',
      name: 'contract.pdf',
      type: 'application/pdf',
      size: 180000,
      url: '#',
    },
  ],
};

export default function EmployeeViewPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const getEmployee = useEmployeeStore((state) => state.getEmployee);

  const employeeFromStore = id ? getEmployee(id) : undefined;
  const employee = employeeFromStore || mockEmployeeData;

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n.charAt(0))
      .join('')
      .toUpperCase();
  };

  const openDocument = (doc: EmployeeDocument) => {
    if (doc.url && doc.url !== '#') {
      window.open(doc.url, '_blank');
    }
  };

  const displayDocuments = employee.documents || [];
  const displayContact = employee.contact || { email: employee.email || '-', phone: employee.phone || '-' };
  const displayEmployeeId = employee.employeeId || employee.id || '-';

  return (
    <AppLayout>
      <div className="flex h-full flex-col">
        <div className="flex-1 w-full overflow-y-auto p-10">
          <div className="mx-auto">
            <Button
              variant="ghost"
              onClick={() => navigate(ROUTES.EMPLOYEES)}
              className="mb-4 text-[#777] hover:text-[#16610E] hover:bg-[#edf8e7]"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Employees
            </Button>

            <div className="bg-white rounded-xl p-6 shadow-sm border border-[#ececec] mb-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <Avatar className="h-16 w-16 bg-[#16610E] text-white">
                    <AvatarFallback className="text-xl font-bold">
                      {getInitials(employee.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="flex items-center gap-3">
                      <h1 className="text-2xl font-bold text-[#151515]">
                        {employee.name}
                      </h1>
                      <Badge className="bg-[#16610E] text-white">
                        {displayEmployeeId}
                      </Badge>
                    </div>
                    <p className="text-[#777] text-sm mt-1">
                      Employee Details
                    </p>
                  </div>
                </div>
                <Badge
                  className={`${
                    employee.status === 'Active'
                      ? 'bg-green-100 text-green-700 border-green-200'
                      : 'bg-gray-100 text-gray-700 border-gray-200'
                  } border px-3 py-1`}
                >
                  {employee.status}
                </Badge>
              </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <div className="bg-white rounded-xl p-6 shadow-sm border border-[#ececec]">
                <div className="flex items-center gap-2 mb-4">
                  <div className="h-8 w-8 rounded-lg bg-[#edf8e7] flex items-center justify-center">
                    <User className="h-4 w-4 text-[#16610E]" />
                  </div>
                  <h3 className="text-lg font-semibold text-[#151515]">
                    Personal Details
                  </h3>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-[#f8f8f5] flex items-center justify-center">
                      <span className="text-xs font-semibold text-[#151515]">
                        ID
                      </span>
                    </div>
                    <div>
                      <p className="text-sm text-[#777]">Employee ID</p>
                      <p className="text-[#151515] font-medium">
                        {displayEmployeeId}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <User className="h-4 w-4 text-[#777]" />
                    <div>
                      <p className="text-sm text-[#777]">Full Name</p>
                      <p className="text-[#151515] font-medium">
                        {employee.name}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <MapPin className="h-4 w-4 text-[#777]" />
                    <div>
                      <p className="text-sm text-[#777]">Address</p>
                      <p className="text-[#151515] font-medium">
                        {employee.address || '-'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-sm border border-[#ececec]">
                <div className="flex items-center gap-2 mb-4">
                  <div className="h-8 w-8 rounded-lg bg-[#edf8e7] flex items-center justify-center">
                    <Mail className="h-4 w-4 text-[#16610E]" />
                  </div>
                  <h3 className="text-lg font-semibold text-[#151515]">
                    Contact Information
                  </h3>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Mail className="h-4 w-4 text-[#777]" />
                    <div>
                      <p className="text-sm text-[#777]">Email Address</p>
                      <p className="text-[#151515] font-medium">
                        {displayContact.email}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone className="h-4 w-4 text-[#777]" />
                    <div>
                      <p className="text-sm text-[#777]">Phone Number</p>
                      <p className="text-[#151515] font-medium">
                        {displayContact.phone}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-sm border border-[#ececec] md:col-span-2">
                <div className="flex items-center gap-2 mb-4">
                  <div className="h-8 w-8 rounded-lg bg-[#edf8e7] flex items-center justify-center">
                    <FileText className="h-4 w-4 text-[#16610E]" />
                  </div>
                  <h3 className="text-lg font-semibold text-[#151515]">
                    Documents ({displayDocuments.length})
                  </h3>
                </div>
                {displayDocuments.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {displayDocuments.map((doc) => (
                      <div
                        key={doc.id}
                        className="flex items-center gap-3 p-4 bg-[#fafaf8] rounded-lg border border-[#e5e5e5] hover:border-[#16610E] hover:shadow-sm transition-all cursor-pointer group"
                        onClick={() => openDocument(doc)}
                      >
                        <div className="h-10 w-10 rounded-lg bg-white flex items-center justify-center border border-[#e5e5e5]">
                          {getFileIcon(doc.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-[#151515] truncate">
                            {doc.name}
                          </p>
                          <p className="text-xs text-[#777]">
                            {formatFileSize(doc.size)}
                          </p>
                        </div>
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                          <Eye className="h-4 w-4 text-[#16610E]" />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-[#777] text-sm">No documents uploaded</p>
                )}
              </div>

              <div className="bg-white rounded-xl p-6 shadow-sm border border-[#ececec] md:col-span-2">
                <div className="flex items-center gap-2 mb-4">
                  <div className="h-8 w-8 rounded-lg bg-[#edf8e7] flex items-center justify-center">
                    <FileText className="h-4 w-4 text-[#16610E]" />
                  </div>
                  <h3 className="text-lg font-semibold text-[#151515]">
                    Employment Status
                  </h3>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                  <div>
                    <p className="text-sm text-[#777]">Current Status</p>
                    <Badge
                      className={`mt-2 ${
                        employee.status === 'Active'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-gray-100 text-gray-700'
                      }`}
                    >
                      {employee.status}
                    </Badge>
                  </div>
                  <div>
                    <p className="text-sm text-[#777]">Documents</p>
                    <div className="mt-2 flex items-center gap-2">
                      <FileText className="h-4 w-4 text-[#16610E]" />
                      <span className="text-[#151515] font-medium">
                        {displayDocuments.length}{' '}
                        {displayDocuments.length === 1 ? 'file' : 'files'}
                      </span>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-[#777]">Employee Type</p>
                    <p className="text-[#151515] font-medium mt-2">Full-time</p>
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