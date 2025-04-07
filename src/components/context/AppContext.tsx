import React, {createContext, useContext, useState, ReactNode} from 'react';

interface AppContextType {}

const AppContext = createContext<AppContextType | undefined>(undefined);

interface AppProviderProps {
  children: ReactNode;
}

const AppProvider: React.FC<AppProviderProps> = ({children}) => {
  return <AppContext.Provider value={{}}>{children}</AppContext.Provider>;
};

const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};

export {AppProvider, useAppContext};
