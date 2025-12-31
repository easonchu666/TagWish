
import React from 'react';
import { Wish, WishStatus } from '../types';

interface WishCardProps {
  wish: Wish;
  onClick: (wish: Wish) => void;
}

const WishCard: React.FC<WishCardProps> = ({ wish, onClick }) => {
  const getStatusColor = (status: WishStatus) => {
    switch (status) {
      case WishStatus.PENDING: return 'bg-amber-100 text-amber-700';
      case WishStatus.MATCHED: return 'bg-blue-100 text-blue-700';
      case WishStatus.COMPLETED: return 'bg-emerald-100 text-emerald-700';
      default: return 'bg-slate-100 text-slate-700';
    }
  };

  return (
    <div
      onClick={() => onClick(wish)}
      className="group bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer border border-slate-100 hover:-translate-y-1 flex flex-col h-full"
    >
      <div className="relative h-56 overflow-hidden">
        <img
          src={wish.image}
          alt={wish.itemName}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
        />
        <div className="absolute top-4 left-4 flex gap-2">
          <span className="px-3 py-1 bg-white/90 backdrop-blur-sm rounded-lg text-[10px] font-bold text-slate-800 shadow-sm uppercase tracking-wider">
            {wish.tag}
          </span>
          <span className="px-3 py-1 bg-[#FF6B6B] rounded-lg text-[10px] font-bold text-white shadow-sm uppercase tracking-wider">
            ${wish.reward} Reward
          </span>
        </div>
      </div>

      <div className="p-5 flex-1 flex flex-col">
        <h3 className="text-lg font-bold text-slate-800 mb-2 line-clamp-1 group-hover:text-[#FF6B6B] transition-colors">
          {wish.itemName}
        </h3>
        <p className="text-slate-500 text-sm mb-4 line-clamp-2 flex-1 leading-relaxed">
          {wish.description}
        </p>

        <div className="flex items-center justify-between pt-4 border-t border-slate-50 mt-auto">
          <div className="flex items-center gap-2 text-slate-400">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span className="text-xs font-medium">{wish.location}</span>
          </div>
          <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-tight ${getStatusColor(wish.status)}`}>
            {wish.status}
          </span>
        </div>
      </div>
    </div>
  );
};

export default WishCard;
