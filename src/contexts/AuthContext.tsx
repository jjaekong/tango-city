import { createContext, useContext, useEffect, useRef, useState } from "react";
import { useLoading } from "./LoadingContext.tsx";
import { onAuthStateChanged } from "firebase/auth"; // Adjust the import based on your Firebase setup
import { auth } from "../firebase.tsx"; // Adjust the import based on your Firebase setup
import { ReactNode } from "react";

interface AuthContextType {
  user: any; // Replace 'any' with a specific type if known
  setUser: (user: any) => void; // Replace 'any' with a specific type if known
}

const AuthContext = createContext<AuthContextType | null>({
  user: null,
  setUser: () => {},
});
export default AuthContext;

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<any | null>(null); // Default user state
  const isMounted = useRef<boolean | null>(false);
  const { setLoading } = useLoading(); // Assuming you have a LoadingContext
  useEffect(() => {
    isMounted.current = true;
    setLoading(true); // Set loading to true when the component mounts
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (isMounted.current) return;
      if (user) {
        setUser(user);
      } else {
        setUser(null);
      }
    });
    return () => {
      isMounted.current = false;
      unsubscribe(); // Cleanup subscription on unmount
      setLoading(false);
    };
  }, []); // Add any side effects here

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
