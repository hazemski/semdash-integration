import React from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { TopNav } from './TopNav';

export function Layout() {
  return (
    <div className="min-h-screen flex bg-gray-50 dark:bg-gray-900 overflow-hidden">
      {/* Hide desktop sidebar on mobile */}
      <div className="hidden sm:block">
        <Sidebar />
      </div>
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <TopNav />
        <main className="flex-1 overflow-auto relative w-full">
          <div className="p-8 max-w-[100rem] mx-auto w-full">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
