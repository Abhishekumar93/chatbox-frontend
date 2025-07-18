'use client';

import { useEffect, useState } from 'react';
import ShimmerCard from '../shimmerCard';
import { getApi } from '@/utils/restApi';
import { UserDetail } from '@/interfaceAndTypes/user';
import { Card, CardBody } from 'react-bootstrap';
import Link from 'next/link';
import Style from './userList.module.css';
import { usePathname } from 'next/navigation';
import { ROUTE_URLS } from '@/constants/routeUrls';

export const UsersList = () => {
  const pathname = usePathname();

  const [users, setUsers] = useState<UserDetail[]>([]);
  const [isUsersListFetched, setIsUsersListFetched] = useState<boolean>(false);
  const [isApiFetchInProgress, setIsApiFetchInProgress] =
    useState<boolean>(false);

  useEffect(() => {
    setIsApiFetchInProgress(true);
  }, []);
  useEffect(() => {
    if (!isApiFetchInProgress) return;
    getUsersList();
  }, [isApiFetchInProgress]);

  const getUsersList = async () => {
    let data: UserDetail[] = [];

    try {
      const response = await getApi('/users/list');
      if (response?.data) {
        data = response?.data?.users;
      }
    } catch (error) {
      data = [];
    } finally {
      setUsers(data);
      setIsUsersListFetched(true);
      setIsApiFetchInProgress(false);
    }
  };

  if (!isUsersListFetched) {
    return (
      <div className="px-3">
        {Array.from({ length: 5 }).map((_, index) => (
          <ShimmerCard key={index} />
        ))}
      </div>
    );
  }

  const displayUsersList = () => {
    if (users.length === 0) {
      return (
        <div className="col-12 text-center">
          <h5>No users found</h5>
        </div>
      );
    }

    return users.map((user: UserDetail, idx: number) => {
      const doesPathNameIncludeId = pathname.split('/')[2];

      const isActive = doesPathNameIncludeId
        ? pathname.includes(btoa(user._id))
        : idx === 0;

      if (!doesPathNameIncludeId && idx === 0)
        location.href = `${ROUTE_URLS.MESSAGES}/${btoa(user._id)}`;

      return (
        <Link href={`${ROUTE_URLS.MESSAGES}/${btoa(user._id)}`} key={user._id}>
          <Card className="mb-4 bg-transparent border-0 w-100">
            <CardBody
              className={`user-data-text d-flex ${Style['user-nav']} ${isActive && Style['active-user-nav']}`}
            >
              <div style={{ width: '50px' }}>
                <div className="text-capitalize user-profile-text">
                  {user.username.charAt(0)}
                </div>
              </div>
              <div style={{ width: 'calc(100% - 50px)' }}>
                <Card.Title className="fs-6 mb-0 text-elipsis">
                  {user.name}
                </Card.Title>
                <Card.Text className="font-12 text-elipsis">{`@${user.username}`}</Card.Text>
                <Card.Text
                  className={`font-12 ${user.isOnline ? 'text-success' : 'text-secondary'} fst-italic fw-bold`}
                >
                  {user.isOnline ? 'Online' : 'Offline'}
                </Card.Text>
              </div>
            </CardBody>
          </Card>
        </Link>
      );
    });
  };

  return <div className="container px-3">{displayUsersList()}</div>;
};
