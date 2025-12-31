
import React from 'react';
import { UserRole, User } from '../types';

interface HeaderProps {
  user: User;
  onToggleRole: (role: UserRole) => void;
}

const Header: React.FC<HeaderProps> = ({ user, onToggleRole }) => {
  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[#FF6B6B] rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-red-200">
            T
          </div>
          <span className="text-2xl font-bold tracking-tight text-slate-800">TAGWISH</span>
        </div>

        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-500">
          <a href="#" className="hover:text-slate-900 transition-colors">Marketplace</a>
          <a href="#" className="hover:text-slate-900 transition-colors">Verified Routes</a>
          <a href="#" className="hover:text-slate-900 transition-colors">Trust & Safety</a>
        </div>

        <div className="flex items-center gap-6">
          <div className="bg-slate-100 p-1 rounded-full flex items-center gap-1">
            <button
              onClick={() => onToggleRole(UserRole.BUYER)}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${
                user.role === UserRole.BUYER
                  ? 'bg-white text-slate-800 shadow-sm'
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              Buyer
            </button>
            <button
              onClick={() => onToggleRole(UserRole.TRAVELER)}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${
                user.role === UserRole.TRAVELER
                  ? 'bg-white text-slate-800 shadow-sm'
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              Traveler
            </button>
          </div>

          <div className="flex items-center gap-3 pl-4 border-l border-slate-200">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-bold text-slate-800">{user.name}</p>
              <p className="text-xs font-medium text-emerald-600">${user.balance.toFixed(2)}</p>
            </div>
            <img
              src={user.avatar}
              alt="Profile"
              className="w-10 h-10 rounded-full border-2 border-white shadow-md cursor-pointer hover:scale-105 transition-transform"
            />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
