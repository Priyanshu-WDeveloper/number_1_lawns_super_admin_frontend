import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

import { SuperAdminLayout } from '@/components/layout/super-layout';
import { Button } from '@/components/ui/button';

export default function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <SuperAdminLayout>
      <div className="flex h-full items-center justify-center">
        <div className="text-center">
          <h1 className="text-6xl font-bold text-primary">404</h1>
          <p className="mt-4 text-xl text-muted-foreground">Page not found</p>
          <p className="mt-2 text-sm text-muted-foreground">
            The page you're looking for doesn't exist or has been moved.
          </p>
          <Button
            onClick={() => navigate(-1)}
            className="mt-6 h-10 gap-2 rounded-xl bg-green-600 text-white hover:bg-green-700"
          >
            <ArrowLeft className="h-4 w-4" />
            Go Back
          </Button>
        </div>
      </div>
    </SuperAdminLayout>
  );
}
