'use client';

import { useDeviceType } from '@/hooks/useDeviceType';
import { UsersList } from '../userList';

const MessageComponent = () => {
  const { isMobile } = useDeviceType();

  if (!isMobile) return null;

  return <UsersList />;
};

export default MessageComponent;
