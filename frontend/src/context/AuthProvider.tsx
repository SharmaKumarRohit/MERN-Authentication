import {
  createContext,
  useContext,
  useState,
  type ReactNode,
  type Dispatch,
  type SetStateAction,
} from "react";

interface IAuthContext {
  user: User | null;
  setUser: Dispatch<SetStateAction<User | null>>;
}
type User = {
  success: boolean;
  message: string;
  accessToken: string;
  refreshToken: string;
  user: UserData;
};
type UserData = {
  _id: string;
  username: string;
  email: string;
  password: string;
  googleId: string;
  avatar: string;
  isVerified: boolean;
  isLoggedIn: boolean;
  token: string | null;
  otp: string | null;
  otpExpiry: Date | null;
  createdAt: Date;
  updatedAt: Date;
  __v: number;
};
type AuthProviderProps = {
  children: ReactNode;
};

const AuthContext = createContext<IAuthContext | null>(null);

function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): IAuthContext {
  const contextVal = useContext(AuthContext);
  if (!contextVal) {
    throw new Error("useAuth must be used inside component");
  }
  return contextVal;
}

export default AuthProvider;
