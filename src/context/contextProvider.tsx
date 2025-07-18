'use client';

import { createContext, useState, ReactNode, useContext } from 'react';

type User = {
  name: string;
  email: string;
};

type ContextType = {
  user: User | null;
  setUser: (user: User | null) => void;
};

const Context = createContext<ContextType | undefined>(undefined);

export const ContextProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  return (
    <Context.Provider value={{ user, setUser }}>{children}</Context.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(Context);
  if (!context) {
    throw new Error('useAppContext must be used within a UserProvider');
  }
  return context;
};
