import { createContext, useContext, useState, ReactNode } from 'react';
import type { PageAnchorConfig } from '@/shared/types/page-config';

interface PageAnchorContextValue {
  anchors: PageAnchorConfig[];
  activeAnchorId: string | null;
  setAnchors: (anchors: PageAnchorConfig[]) => void;
  setActiveAnchorId: (id: string | null) => void;
}

const PageAnchorContext = createContext<PageAnchorContextValue | undefined>(undefined);

export function PageAnchorProvider({ children }: { children: ReactNode }) {
  const [anchors, setAnchors] = useState<PageAnchorConfig[]>([]);
  const [activeAnchorId, setActiveAnchorId] = useState<string | null>(null);

  return (
    <PageAnchorContext.Provider value={{ anchors, activeAnchorId, setAnchors, setActiveAnchorId }}>
      {children}
    </PageAnchorContext.Provider>
  );
}

export function usePageAnchors() {
  const context = useContext(PageAnchorContext);
  if (context === undefined) {
    throw new Error('usePageAnchors must be used within PageAnchorProvider');
  }
  return context;
}
