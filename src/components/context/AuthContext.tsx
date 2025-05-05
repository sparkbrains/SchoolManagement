import React, {
  createContext,
  useState,
  useContext,
  ReactNode,
  useEffect,
} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface AuthContextType {
  isLoggedIn: boolean;
  isLoading: boolean;
  toggleLoggedInStatus: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

const AuthProvider: React.FC<AuthProviderProps> = ({children}) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const toggleLoggedInStatus = () => {
    setIsLoggedIn(prevState => !prevState);
    // setIsLoggedIn(true);
  };

  useEffect(() => {
    const checkLoginStatus = async () => {
      const token = await AsyncStorage.getItem('userToken');
      // setIsLoggedIn(!!token);
      setIsLoggedIn(true);
      setIsLoading(false);
    };

    checkLoginStatus();
  }, []);

  return (
    <AuthContext.Provider value={{isLoggedIn, toggleLoggedInStatus, isLoading}}>
      {children}
    </AuthContext.Provider>
  );
};

const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export {AuthProvider, useAuth};
