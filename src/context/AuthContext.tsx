import React, {createContext, useContext, useState, ReactNode} from 'react';

interface AuthContextType {
  userEmail: string | null;
  setUserEmail: (email: string | null) => void;
}

const AuthContext = createContext<AuthContextType>({
  userEmail: null,
  setUserEmail: () => {},
});

export function AuthProvider({children}: {children: ReactNode}) {
  const [userEmail, setUserEmail] = useState<string | null>(null);

  return (
    <AuthContext.Provider value={{userEmail, setUserEmail}}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
