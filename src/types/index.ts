// Customer types
export interface ICustomer {
  _id: string;

  firstName: string;
  lastName: string;
  fullName: string;

  email: string;

  status: 'active' | 'inactive' | 'expired';

  profileImage: string;

  countryCode: string;
  phoneNumber: string;
  role: number;

  city: string;
  address: string;
  state: string;
  postalCode: string;
  country: string;

  balance: number;

  parentAdmin: string;

  active: boolean;
  isDeleted: boolean;

  deletedAt: string | null;

  createdAt: string;
  updatedAt: string;

  location: {
    type: 'Point';

    coordinates: [number, number];
  };
}

// Employee types
export interface Employee {
  id: string;
  name: string;
  email: string;
  phone: string;
  position: string;
  status: 'Active' | 'Inactive';
}

// Job types
export interface Job {
  id: string;
  title: string;
  customer: string;
  employee: string;
  status: 'Pending' | 'In Progress' | 'Completed';
  date: string;
}

// Invoice types
export interface Invoice {
  id: string;
  customer: string;
  amount: number;
  status: 'Paid' | 'Pending' | 'Overdue';
  date: string;
}

// Admin User types (for Super Admin)
export interface AdminUser {
  id: number;
  name: string;
  email: string;
  role: string;
  status: 'Active' | 'Inactive';
  createdAt: string;
}

// Billing types (for Super Admin)
export interface BillingStat {
  label: string;
  value: string;
  change: string;
  icon: string;
  color: string;
  bgColor: string;
}

export interface InvoiceData {
  id: string;
  customer: string;
  amount: string;
  status: 'Paid' | 'Pending' | 'Overdue';
  date: string;
}
