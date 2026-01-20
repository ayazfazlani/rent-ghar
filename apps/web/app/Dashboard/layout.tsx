 "use client"

import { Home, Plus, User, List, Menu, X } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    {
      href: '/Dashboard/add-property',
      icon: Plus,
      label: 'Add Property'
    },
    {
      href: '/Dashboard/listed-properties',
      icon: List,
      label: 'Listed Properties'
    },
    {
      href: '/Dashboard/user-account',
      icon: User,
      label: 'User Account'
    }
  ];

  return (
    <div className="flex h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-3 bg-black text-white rounded-xl shadow-lg hover:bg-gray-800 transition-all duration-300 active:scale-95"
      >
        {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {/* Overlay for mobile */}
      {isMobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-30 transition-opacity duration-300"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed lg:static inset-y-0 left-0 z-40
        w-72 bg-gradient-to-b from-gray-900 to-black border-r border-gray-800 flex flex-col
        transform transition-transform duration-300 ease-out
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        {/* Logo/Header */}
        <div className="p-6 border-b border-gray-800">
          <div className="flex items-center gap-3 group">
            <div className="w-12 h-12 bg-gradient-to-br from-white to-gray-300 rounded-xl flex items-center justify-center transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6 shadow-lg">
              <Home className="w-7 h-7 text-gray-900" />
            </div>
            <h1 className="text-2xl font-bold text-white transition-all duration-300 group-hover:tracking-wide">Rent Ghar</h1>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 p-4">
          <ul className="space-y-3">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              
              return (
                <li key={item.href}>
                  <Link 
                    href={item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`
                      group/link relative overflow-hidden flex items-center gap-3 px-5 py-4 rounded-xl
                      transition-all duration-300 font-medium
                      ${isActive
                        ? 'bg-white text-gray-900 shadow-xl scale-105'
                        : 'text-gray-300 hover:text-white hover:bg-white/10 hover:scale-105 active:scale-95'
                      }
                    `}
                  >
                    {/* Lightning sweep effect */}
                    <div className={`
                      absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent
                      translate-x-[-200%] group-hover/link:translate-x-[200%] transition-transform duration-700
                      ${isActive ? 'hidden' : ''}
                    `}></div>
                    
                    <Icon className={`
                      w-5 h-5 transition-all duration-300 relative z-10
                      ${isActive ? 'scale-110' : 'group-hover/link:rotate-12 group-hover/link:scale-110'}
                    `} />
                    <span className="relative z-10">{item.label}</span>
                    
                    {/* Active indicator */}
                    {isActive && (
                      <div className="absolute right-3 w-2 h-2 bg-gray-900 rounded-full animate-pulse"></div>
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Footer/User Info */}
        <div className="p-4 border-t border-gray-800">
          <div className="px-5 py-3 bg-white/5 rounded-xl border border-gray-800 backdrop-blur-sm">
            <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">Dashboard</p>
            <p className="text-sm text-white font-semibold">Professional Mode</p>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-auto">
        {children}
      </div>
    </div>
  );
}