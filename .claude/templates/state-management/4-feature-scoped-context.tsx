// 4. Feature-scoped Context
// Use: 3+ components in feature, prop drilling avoidance

//###--------------------------------------------------------IMPORTS-----------------------------------------------------------------------##
//#region IMPORTS
import { createContext, useContext, useState, ReactNode } from "react";
//#endregion
//###--------------------------------------------------------IMPORTS-----------------------------------------------------------------------##

//###--------------------------------------------------------INTERFACE-----------------------------------------------------------------------##
//#region Interfaces
interface FeatureContextType {
  selectedKey: string;
  setSelectedKey: (key: string) => void;
}

interface FeatureProviderProps {
  children: ReactNode;
}
//#endregion
//###--------------------------------------------------------INTERFACE-----------------------------------------------------------------------##

const FeatureContext = createContext<FeatureContextType | null>(null);

export function FeatureProvider({ children }: FeatureProviderProps) {
  const [selectedKey, setSelectedKey] = useState("");

  return (
    <FeatureContext.Provider value={{ selectedKey, setSelectedKey }}>
      {children}
    </FeatureContext.Provider>
  );
}

export function useFeature() {
  const context = useContext(FeatureContext);
  if (!context) {
    throw new Error("useFeature must be used within FeatureProvider");
  }
  return context;
}
