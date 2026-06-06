import { useNavigate } from 'react-router-dom';
import { SuperAdminLayout } from '@/components/layout/super-layout';
import { ROUTES } from '@/constants';
import ProfileContent from '@/components/profile/profile-content';
import { useSelector } from 'react-redux';
import { type RootState } from '@/store';

export default function SuperAdminProfilePage() {
  const navigate = useNavigate();
  const admin = useSelector((state: RootState) => state.auth.user);

  if (!admin) {
    return (
      <SuperAdminLayout>
        <div className="flex h-full items-center justify-center">
          <p className="text-lg text-[#6b7280]">Failed to load profile</p>
        </div>
      </SuperAdminLayout>
    );
  }

  return (
    <SuperAdminLayout>
      <div className="flex h-full flex-col">
        <div className="flex-1 w-full overflow-y-auto">
          <ProfileContent admin={admin} onBack={() => navigate(ROUTES.SUPER_ADMIN_DASHBOARD)} />
        </div>
      </div>
    </SuperAdminLayout>
  );
}
