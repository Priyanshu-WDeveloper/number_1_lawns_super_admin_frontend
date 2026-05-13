export type FieldType =
  | 'text'
  | 'email'
  | 'number'
  | 'textarea'
  | 'select'
  | 'date'
  | 'location'
  | 'file';

export interface FieldOption {
  label: string;
  value: string;
}

export interface ConditionalConfig {
  field: string;
  value: string;
}

export interface FormFieldConfig {
  name: string;
  label: string;
  type: FieldType;
  required?: boolean;
  placeholder?: string;
  options?: FieldOption[];
  conditional?: ConditionalConfig;
}