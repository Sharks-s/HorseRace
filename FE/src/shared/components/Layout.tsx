import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';

export function Layout() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center text-white font-bold">
              FA
            </div>
            <span className="text-xl font-bold text-gray-900 tracking-tight">Feature Architect</span>
          </div>
          
          <nav className="flex items-center gap-6">
            <NavLink 
              to="/learning" 
              className={({ isActive }) => 
                `text-sm font-medium transition-colors ${isActive ? 'text-blue-600' : 'text-gray-600 hover:text-blue-600'}`
              }
            >
              Học (Learning)
            </NavLink>
            <NavLink 
              to="/practice" 
              className={({ isActive }) => 
                `text-sm font-medium transition-colors ${isActive ? 'text-blue-600' : 'text-gray-600 hover:text-blue-600'}`
              }
            >
              Thực hành (Practice)
            </NavLink>
          </nav>
        </div>
      </header>

      <main className="flex-1">
        <Outlet />
      </main>

      <footer className="bg-white border-t border-gray-200 py-6 text-center text-gray-500 text-sm">
        <p>&copy; {new Date().getFullYear()} Feature Architect App. All rights reserved.</p>
      </footer>
    </div>
  );
}
