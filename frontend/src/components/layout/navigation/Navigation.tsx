import React from "react";
import { Outlet } from "react-router-dom";
import { HelpCircle } from "lucide-react";
import { Sidebar } from "./Sidebar";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
  SheetTrigger,
} from "@/components/ui/sheet";

const Navigation: React.FC = () => {
  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <main className="pl-64 min-h-screen">
        {/* Help Button - Fixed position */}
        <div className="fixed bottom-4 right-4 z-10">
          <Sheet>
            <SheetTrigger asChild>
              <Button 
                size="icon" 
                className="rounded-full h-12 w-12 shadow-lg bg-primary hover:bg-primary/90"
              >
                <HelpCircle className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent className="w-[400px] sm:w-[540px] overflow-y-auto">
              <SheetHeader>
                <SheetTitle className="text-2xl">AlphaBrain Guide</SheetTitle>
              </SheetHeader>
              
              <div className="py-6 space-y-6">
                <p className="text-sm">
                  This is a simplified version of AlphaBrain focusing on core CRUD operations.
                </p>
                <p className="text-sm">
                  Use the navigation sidebar to access:
                </p>
                <ul className="list-disc pl-6 text-sm space-y-2">
                  <li><strong>Dashboard</strong> - View your study summary</li>
                  <li><strong>Learning Sessions</strong> - Create and manage study sessions</li>
                  <li><strong>Topics</strong> - Manage your study topics</li>
                </ul>
              </div>
              
              <SheetFooter>
                <SheetClose asChild>
                  <Button className="w-full">Close Guide</Button>
                </SheetClose>
              </SheetFooter>
            </SheetContent>
          </Sheet>
        </div>
        
        <Outlet />
      </main>
    </div>
  );
};

export default Navigation;