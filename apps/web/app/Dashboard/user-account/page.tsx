 "use client"

import { User, Mail, Phone, Save, Trash2, TrendingUp, Eye, Home } from 'lucide-react';

export default function UserAccount() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-8">
      <div className="max-w-5xl mx-auto">
        
        {/* Header */}
        <div className="mb-6 md:mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">Account Settings</h1>
          <p className="text-gray-600 text-base md:text-lg">Manage your profile and preferences</p>
        </div>

        <div className="space-y-4 md:space-y-6">
          
          {/* Profile Section */}
          <div className="group bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden transition-all duration-500 hover:shadow-xl hover:border-gray-300">
            <div className="p-5 md:p-7">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-black rounded-xl flex items-center justify-center transition-transform duration-300 group-hover:scale-110">
                  <User className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-xl md:text-2xl font-bold text-gray-900">Profile Information</h2>
              </div>
              
              <div className="space-y-4 md:space-y-5">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2 uppercase tracking-wide">
                    Full Name
                  </label>
                  <div className="relative group/input">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 transition-colors duration-300 group-focus-within/input:text-gray-900" />
                    <input
                      type="text"
                      placeholder="Enter your name"
                      className="w-full pl-12 pr-4 py-3.5 border-2 border-gray-200 rounded-xl transition-all duration-300 focus:border-black focus:ring-0 focus:shadow-lg outline-none hover:border-gray-300"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2 uppercase tracking-wide">
                    Email Address
                  </label>
                  <div className="relative group/input">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 transition-colors duration-300 group-focus-within/input:text-gray-900" />
                    <input
                      type="email"
                      placeholder="Enter your email"
                      className="w-full pl-12 pr-4 py-3.5 border-2 border-gray-200 rounded-xl transition-all duration-300 focus:border-black focus:ring-0 focus:shadow-lg outline-none hover:border-gray-300"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2 uppercase tracking-wide">
                    Phone Number
                  </label>
                  <div className="relative group/input">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 transition-colors duration-300 group-focus-within/input:text-gray-900" />
                    <input
                      type="tel"
                      placeholder="Enter your phone number"
                      className="w-full pl-12 pr-4 py-3.5 border-2 border-gray-200 rounded-xl transition-all duration-300 focus:border-black focus:ring-0 focus:shadow-lg outline-none hover:border-gray-300"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Account Stats */}
          <div className="group bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden transition-all duration-500 hover:shadow-xl hover:border-gray-300">
            <div className="p-5 md:p-7">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-black rounded-xl flex items-center justify-center transition-transform duration-300 group-hover:scale-110">
                  <TrendingUp className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-xl md:text-2xl font-bold text-gray-900">Account Statistics</h2>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="group/stat relative overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100 p-5 md:p-6 rounded-xl border-2 border-gray-200 transition-all duration-300 hover:border-black hover:shadow-lg hover:-translate-y-1">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent translate-x-[-200%] group-hover/stat:translate-x-[200%] transition-transform duration-700"></div>
                  <div className="relative z-10">
                    <div className="flex items-center gap-2 mb-2">
                      <Home className="w-5 h-5 text-gray-600" />
                      <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Total Properties</p>
                    </div>
                    <p className="text-3xl md:text-4xl font-bold text-gray-900">0</p>
                  </div>
                </div>

                <div className="group/stat relative overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100 p-5 md:p-6 rounded-xl border-2 border-gray-200 transition-all duration-300 hover:border-black hover:shadow-lg hover:-translate-y-1">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent translate-x-[-200%] group-hover/stat:translate-x-[200%] transition-transform duration-700"></div>
                  <div className="relative z-10">
                    <div className="flex items-center gap-2 mb-2">
                      <TrendingUp className="w-5 h-5 text-gray-600" />
                      <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Active Listings</p>
                    </div>
                    <p className="text-3xl md:text-4xl font-bold text-gray-900">0</p>
                  </div>
                </div>

                <div className="group/stat relative overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100 p-5 md:p-6 rounded-xl border-2 border-gray-200 transition-all duration-300 hover:border-black hover:shadow-lg hover:-translate-y-1 sm:col-span-1 col-span-1">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent translate-x-[-200%] group-hover/stat:translate-x-[200%] transition-transform duration-700"></div>
                  <div className="relative z-10">
                    <div className="flex items-center gap-2 mb-2">
                      <Eye className="w-5 h-5 text-gray-600" />
                      <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Total Views</p>
                    </div>
                    <p className="text-3xl md:text-4xl font-bold text-gray-900">0</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 md:gap-4">
            <button className="flex-1 sm:flex-none relative group/btn overflow-hidden flex items-center justify-center gap-2 px-6 md:px-8 py-3.5 md:py-4 bg-black text-white rounded-xl transition-all duration-300 hover:bg-gray-800 active:scale-95 hover:shadow-xl font-semibold text-base md:text-lg">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-200%] group-hover/btn:translate-x-[200%] transition-transform duration-700"></div>
              <Save className="w-5 h-5 transition-transform duration-300 group-hover/btn:rotate-12 relative z-10" />
              <span className="relative z-10">Save Changes</span>
            </button>
            
            <button className="flex-1 sm:flex-none relative group/btn overflow-hidden flex items-center justify-center gap-2 px-6 md:px-8 py-3.5 md:py-4 bg-white text-gray-700 border-2 border-gray-300 rounded-xl transition-all duration-300 hover:border-red-500 hover:bg-red-50 hover:text-red-600 active:scale-95 hover:shadow-xl font-semibold text-base md:text-lg">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-red-100/40 to-transparent translate-x-[-200%] group-hover/btn:translate-x-[200%] transition-transform duration-700"></div>
              <Trash2 className="w-5 h-5 transition-transform duration-300 group-hover/btn:rotate-12 relative z-10" />
              <span className="relative z-10">Delete Account</span>
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}