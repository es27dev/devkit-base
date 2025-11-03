import { createContext, useContext, useState, ReactNode } from "react";

interface ProductFeatureContextType {
  selectedKey: string;
  setSelectedKey: (key: string) => void;
}

const ProductFeatureContext = createContext<ProductFeatureContextType | null>(null);

interface ProductFeatureProviderProps {
  children: ReactNode;
}

export function ProductFeatureProvider({ children }: ProductFeatureProviderProps) {
  const [selectedKey, setSelectedKey] = useState("facility-management");

  return (
    <ProductFeatureContext.Provider value={{ selectedKey, setSelectedKey }}>
      {children}
    </ProductFeatureContext.Provider>
  );
}

export function useProductFeature() {
  const context = useContext(ProductFeatureContext);
  if (!context) {
    throw new Error("useProductFeature must be used within ProductFeatureProvider");
  }
  return context;
}
