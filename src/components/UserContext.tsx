import React, { createContext, useState, useContext, ReactNode } from 'react';
import { JwtPayload } from 'jwt-decode';

interface UserContextType {
  user: UserPayload | null;
  setUser: React.Dispatch<React.SetStateAction<UserPayload | null>>;
}

interface UserPayload extends JwtPayload {
  username?: string;
  email?: string;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserPayload | null>(null);
  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};