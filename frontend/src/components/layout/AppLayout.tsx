import React from 'react';
import { Sidebar } from './navigation/Sidebar';
import { SidebarProvider, useSidebar } from './SidebarContext';

interface AppLayoutProps {
  children: React.ReactNode;
}

function LayoutInner({ children }: AppLayoutProps) {
  const { isOpen } = useSidebar();

  return (
    <div className="flex min-h-screen bg-slate-950">
      <Sidebar />
      <main
        className={`flex-1 min-h-screen overflow-auto transition-all duration-300 ${
          isOpen ? 'ml-64' : 'ml-20'
        }`}
      >
        <div className="p-6">{children}</div>
      </main>
    </div>
  );
}

const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  return (
    <SidebarProvider>
      <LayoutInner>{children}</LayoutInner>
    </SidebarProvider>
  );
};

export default AppLayout;
