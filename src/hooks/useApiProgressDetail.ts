'use client';

import { useState } from 'react';

export const useApiProgressDetail = () => {
  const [isApiInProgress, setIsApiInProgress] = useState(false);

  return { isApiInProgress, setIsApiInProgress };
};
