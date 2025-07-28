'use client';

import { clearLocalStorage, getLocalStorage } from '@/utils/localStorage';
import { LOCAL_STORAGE_KEY } from '@/constants/localStorage';
import { useEffect, useState } from 'react';
import Style from './header.module.css';
import { useDeviceType } from '@/hooks/useDeviceType';
import { usePathname, useRouter } from 'next/navigation';
import { ROUTE_URLS } from '@/constants/routeUrls';
import { toast } from 'react-toastify';
import { postApi } from '@/utils/restApi';

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

  const handleLogout = async () => {
    try {
      const response = await postApi('/auth/logout');
      console.log('response', response);

      if (response.status === 200) {
        clearLocalStorage();
        setUser(null);
        router.push(LOGIN);
        toast.success('Logout successful');
      }
    } catch (error) {
      toast.error('Logout failed. Please try again.');
    }
  };
  const displayHeader = () => {
    if (isMobile && !isUserListPage) {
      return (
        <button
          className={`${Style['logout-btn']}`}
          onClick={() => router.push(MESSAGES)}
        >
          Back
        </button>
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
        <button className={`${Style['logout-btn']}`} onClick={handleLogout}>
          Logout
        </button>
      </>
    );
  };

  if (!user) return null;

  return (
    <header className={`${Style['header']} ${Style['header-shadow']}`}>
      {displayHeader()}
    </header>
  );
};
