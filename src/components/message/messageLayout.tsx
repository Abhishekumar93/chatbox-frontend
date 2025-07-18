'use client';

import { UsersList } from '@/components/userList';
import { useDeviceType } from '@/hooks/useDeviceType';
import { usePathname } from 'next/navigation';
import WelcomePage from './welcome';
import { ROUTE_URLS } from '@/constants/routeUrls';

interface IMessageLayoutProps {
  children: React.ReactNode;
}

const MessageLayoutComponent = ({ children }: IMessageLayoutProps) => {
  const { isMobile } = useDeviceType();
  const pathname = usePathname();

  const isUserListPage = pathname === ROUTE_URLS.MESSAGES;

  return (
    <div className="d-flex" style={{ height: 'calc(100% - 4rem)' }}>
      {!isMobile && (
        <div
          className="pt-4 h-100 overflow-y-auto"
          style={{ width: '300px', borderRight: '1px solid #ccc' }}
        >
          <UsersList />
        </div>
      )}
      <div
        className={`pt-4 h-100 ${!isUserListPage && 'px-2'} ${isMobile && isUserListPage ? 'overflow-y-auto' : 'overflow-hidden'}`}
        style={{ width: isMobile ? '100%' : 'calc(100% - 300px)' }}
      >
        {!isMobile && isUserListPage ? <WelcomePage /> : children}
      </div>
    </div>
  );
};
export default MessageLayoutComponent;
