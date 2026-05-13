import type { FormFieldConfig } from '@/types/forms';

export const employeeFields: FormFieldConfig[] = [
  {
    name: 'name',
    label: 'Name',
    type: 'text',
    required: true,
    placeholder: 'Enter employee name',
  },
  {
    name: 'email',
    label: 'Email',
    type: 'email',
    required: true,
    placeholder: 'Enter email address',
  },
  {
    name: 'phone',
    label: 'Phone',
    type: 'text',
    required: true,
    placeholder: 'Enter phone number',
  },
  {
    name: 'address',
    label: 'Address',
    type: 'textarea',
    required: true,
    placeholder: 'Enter full address',
  },
  {
    name: 'document',
    label: 'Upload Document',
    type: 'file',
  },
];