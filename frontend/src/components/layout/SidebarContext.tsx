import { createContext, useContext, useState, ReactNode } from 'react';

interface SidebarContextValue {
  isOpen: boolean;
  toggle: () => void;
}

const SidebarContext = createContext<SidebarContextValue>({
  isOpen: true,
  toggle: () => {},
});

export function SidebarProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(true);
  return (
    <SidebarContext.Provider value={{ isOpen, toggle: () => setIsOpen((o) => !o) }}>
      {children}
    </SidebarContext.Provider>
  );
}

export const useSidebar = () => useContext(SidebarContext);
