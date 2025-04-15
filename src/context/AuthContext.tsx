import React, {createContext, useContext, useState, ReactNode} from 'react';

interface AuthContextType {
  userEmail: string | null;
  setUserEmail: (email: string | null) => void;
  userId: string | null;
  setUserId: (id: string | null) => void;
}

const AuthContext = createContext<AuthContextType>({
  userEmail: null,
  setUserEmail: () => {},
  userId: null,
  setUserId: () => {},
});

export function AuthProvider({children}: {children: ReactNode}) {
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);

  return (
    <AuthContext.Provider value={{userEmail, setUserEmail, userId, setUserId}}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
