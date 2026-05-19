import { Bell } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import AccountDropdown from '@/components/account-dropdown';
import { ROUTES } from '@/constants';

interface NavbarProps {
  title: string;
  subtitle?: string;
  showWelcome?: boolean;
  superAccess?: boolean;
}

export function Navbar({
  title,
  subtitle = "Here's what's happening with your system today.",
  showWelcome: _showWelcome = true,
  superAccess = false,
}: NavbarProps) {
  const navigate = useNavigate();

  return (
    <div className="mb-1 flex items-start justify-between">
      <div>
        <h2 className="text-[22px] font-semibold text-[#151515]">
          {title}
        </h2>
        {subtitle && (
          <p className="mt-1 text-[13px] text-[#6b7280]">
            {subtitle}
          </p>
        )}
      </div>

      <div className="flex items-center gap-3">
        <button className="relative flex h-10 w-10 items-center justify-center rounded-full border border-[#e5e7eb] bg-white">
          <Bell
            className="h-4 w-4"
            onClick={() =>
              navigate(
                superAccess
                  ? ROUTES.SUPER_ADMIN_NOTIFICATIONS
                  : ROUTES.NOTIFICATIONS,
              )
            }
          />
          <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-green-600 text-[9px] text-white">
            3
          </span>
        </button>

        <AccountDropdown superAccess={superAccess} />
      </div>
    </div>
  );
}
