import { AuthContext } from './AuthContext'
import { useSession, signOut } from "../lib/auth-client";

export const AuthProvider = ({ children }) => {
  const { data: session, isPending, error, refetch } = useSession();
  
  const user = session?.user ?? null;
  const isLoggedIn = !!user;

  const logout = async () => {
    await signOut();
    refetch();
  }

  const value = {
    user,
    isLoggedIn,
    isPending,
    session,
    error,
    logout,
    refetch
  };

  return (
    <AuthContext.Provider value={value}> 
      {children} 
    </AuthContext.Provider>
  );
};

