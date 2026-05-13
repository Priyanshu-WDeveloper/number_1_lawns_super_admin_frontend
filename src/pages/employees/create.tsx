'use client';

import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AppLayout } from '@/components/layout/AppLayout';
import { DynamicForm } from '@/components/forms/dynamic-form';
import { employeeFields } from '@/config/employee-form';

export default function CreateEmployeePage() {
  const navigate = useNavigate();

  const handleSubmit = (data: Record<string, unknown>) => {
    console.log('Creating employee:', data);
    navigate('/employees');
  };

  const handleCancel = () => {
    navigate('/employees');
  };

  return (
    <AppLayout>
      <main className="flex-1 w-full overflow-y-auto px-4 pt-5 pb-5">
        <div className="max-w-3xl mx-auto">
          <div className="mb-6">
            <Button
              variant="ghost"
              onClick={handleCancel}
              className="gap-2 pl-0 hover:bg-transparent hover:text-primary"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Employees
            </Button>
          </div>

          <div className="bg-card rounded-xl border shadow-sm">
            <div className="px-6 py-5 border-b">
              <h2 className="text-xl font-semibold">Create New Employee</h2>
              <p className="text-sm text-muted-foreground mt-1">
                Add a new employee to the system
              </p>
            </div>
            <div className="p-6">
              <DynamicForm
                fields={employeeFields}
                onSubmit={handleSubmit}
              />
            </div>
          </div>
        </div>
      </main>
    </AppLayout>
  );
}