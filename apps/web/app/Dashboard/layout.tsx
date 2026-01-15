 "use client"

import { Home, Plus, User } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname();

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-64 bg-white border-r border-gray-200 flex flex-col">
        {/* Logo/Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gray-600 rounded-lg flex items-center justify-center">
              <Home className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-800">Rent Ghar</h1>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 p-4">
          <ul className="space-y-2">
            {/* Add Property */}
            <li>
              <Link 
                href="/Dashboard/add-property"
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  pathname === '/dashboard/add-property'
                    ? 'bg-green-50 text-green-700'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <Plus className="w-5 h-5" />
                <span className="font-medium">Add Property</span>
              </Link>
            </li>

            {/* User Account */}
            <li>
              <Link 
                href="/Dashboard/user-account"
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  pathname === '/dashboard/user-account'
                    ? 'bg-green-50 text-green-700'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <User className="w-5 h-5" />
                <span className="font-medium">User Account</span>
              </Link>
            </li>
          </ul>
        </nav>
      </div>

      {/* Main Content Area - Children render here */}
      <div className="flex-1 overflow-auto">
        {children}
      </div>
    </div>
  );
}