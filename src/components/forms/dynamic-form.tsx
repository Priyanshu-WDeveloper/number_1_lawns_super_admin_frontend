'use client';

import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import type { FormFieldConfig } from '@/types/forms';
import { FormField } from './form-field';

interface DynamicFormProps {
  fields: FormFieldConfig[];
  onSubmit: (data: Record<string, unknown>) => void;
  defaultValues?: Record<string, unknown>;
}

function buildZodSchema(fields: FormFieldConfig[]) {
  const shape: Record<string, z.ZodTypeAny> = {};

  fields.forEach((field) => {
    let fieldSchema: z.ZodTypeAny;

    switch (field.type) {
      case 'email':
        fieldSchema = z.string();
        break;
      case 'number':
        fieldSchema = z.coerce.number();
        break;
      case 'location':
        fieldSchema = z.object({
          latitude: z.string(),
          longitude: z.string(),
        });
        break;
      case 'file':
        fieldSchema = z.instanceof(File).nullable().optional();
        break;
      default:
        fieldSchema = z.string();
    }

    shape[field.name] = fieldSchema;
  });

  return z.object(shape);
}

export function DynamicForm({
  fields,
  onSubmit,
  defaultValues = {},
}: DynamicFormProps) {
  const schema = buildZodSchema(fields);

  const {
    handleSubmit,
    control,
    formState: { errors },
    watch,
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues,
  });

  const watchedValues = watch();

  const isFieldVisible = (field: FormFieldConfig): boolean => {
    if (!field.conditional) return true;

    const dependentValue = watchedValues[field.conditional.field];
    return dependentValue === field.conditional.value;
  };

  const onFormSubmit = (data: Record<string, unknown>) => {
    onSubmit(data);
  };

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-5">
      {fields.map((field) => {
        if (!isFieldVisible(field)) return null;

        return (
          <Controller
            key={field.name}
            name={field.name}
            control={control}
            render={({ field: controllerField }) => (
              <FormField
                field={field}
                value={controllerField.value}
                onChange={controllerField.onChange}
                error={
                  errors[field.name]?.message as string | undefined
                }
              />
            )}
          />
        );
      })}
      <div className="flex justify-end gap-3 pt-4 border-t">
        <Button type="button" variant="outline" className="rounded-xl">
          Cancel
        </Button>
        <Button type="submit" className="rounded-xl">
          Save Details
        </Button>
      </div>
    </form>
  );
}