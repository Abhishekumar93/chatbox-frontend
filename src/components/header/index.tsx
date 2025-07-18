'use client';

import { getLocalStorage } from '@/utils/localStorage';
import { LOCAL_STORAGE_KEY } from '@/constants/localStorage';
import { useEffect, useState } from 'react';
import Style from './header.module.css';
import { useDeviceType } from '@/hooks/useDeviceType';
import { usePathname, useRouter } from 'next/navigation';
import { ROUTE_URLS } from '@/constants/routeUrls';

const { MESSAGES, LOGIN, REGISTER } = ROUTE_URLS;

export const Header = () => {
  const { isMobile } = useDeviceType();
  const pathname = usePathname();
  const router = useRouter();

  const [user, setUser] = useState<any>(null);

  const isUserListPage = pathname === MESSAGES;

  useEffect(() => {
    const isAuthUrl = [LOGIN, REGISTER].includes(window.location.pathname);
    if (isAuthUrl) return;

    setUser(getLocalStorage(LOCAL_STORAGE_KEY.LOGGED_IN_USER_DATA));
  }, []);

  if (!user) return null;

  const displayHeader = () => {
    if (isMobile && !isUserListPage) {
      return (
        <>
          <button
            className={`${Style['logout-btn']}`}
            onClick={() => router.push(MESSAGES)}
          >
            Back
          </button>
        </>
      );
    }

    return (
      <>
        <div className="d-flex align-items-center">
          <div style={{ width: '30px' }}>
            <div className="text-capitalize user-profile-text">
              {user.username.charAt(0)}
            </div>
          </div>
          <p className="ps-3">{user.name}</p>
        </div>
        <button className={`${Style['logout-btn']}`}>Logout</button>
      </>
    );
  };
  return (
    <header className={`${Style['header']} ${Style['header-shadow']}`}>
      {displayHeader()}
    </header>
  );
};
