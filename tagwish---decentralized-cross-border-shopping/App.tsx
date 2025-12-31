
import React, { useState, useEffect } from 'react';
import { User, UserRole, Wish, WishStatus, ChatMessage } from './types';
import Header from './components/Header';
import WishCard from './components/WishCard';
import MakeWishModal from './components/MakeWishModal';
import ChatModal from './components/ChatModal';
import { verifyProductAuthenticity } from './services/geminiService';

const MOCK_WISHES: Wish[] = [
  {
    id: '1',
    itemName: 'Blue Bottle Coffee - Spring Blend',
    description: 'Limited edition whole beans from Shinjuku. White bag with pink accents.',
    estimatedPrice: 28,
    reward: 12,
    location: 'Shinjuku, Tokyo',
    image: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?auto=format&fit=crop&q=80&w=800',
    status: WishStatus.PENDING,
    buyerId: 'u1',
    createdAt: new Date().toISOString(),
    tag: 'TOKYO',
    chat: []
  },
  {
    id: '2',
    itemName: 'Goyard Saint Louis GM Navy',
    description: 'Authentic Navy Blue tote. Must include store receipt from Paris flagship.',
    estimatedPrice: 1950,
    reward: 180,
    location: 'Paris, France',
    image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&q=80&w=800',
    status: WishStatus.PENDING,
    buyerId: 'u2',
    createdAt: new Date().toISOString(),
    tag: 'PARIS',
    chat: []
  },
  {
    id: '3',
    itemName: 'Nintendo NY Exclusive Switch Case',
    description: 'Skyline design case only available at Rockefeller Center Nintendo Store.',
    estimatedPrice: 35,
    reward: 15,
    location: 'Rockefeller Center, NYC',
    image: 'https://images.unsplash.com/photo-1592155931584-901ac15763e3?auto=format&fit=crop&q=80&w=800',
    status: WishStatus.PENDING,
    buyerId: 'u3',
    createdAt: new Date().toISOString(),
    tag: 'NYC',
    chat: []
  },
  {
    id: '4',
    itemName: 'Aesop Resurrection Hand Wash',
    description: '500ml pump bottle. Looking for the Australian market version.',
    estimatedPrice: 40,
    reward: 10,
    location: 'Melbourne, Australia',
    image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&q=80&w=800',
    status: WishStatus.PENDING,
    buyerId: 'u4',
    createdAt: new Date().toISOString(),
    tag: 'MELBOURNE',
    chat: []
  }
];

const App: React.FC = () => {
  const [user, setUser] = useState<User>({
    id: 'alex_01',
    name: 'Alex Chen',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex',
    balance: 2450.50,
    role: UserRole.BUYER
  });

  const [wishes, setWishes] = useState<Wish[]>(MOCK_WISHES);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'explore' | 'my-wishes'>('explore');
  const [showMakeModal, setShowMakeModal] = useState(false);
  const [selectedWish, setSelectedWish] = useState<Wish | null>(null);
  const [activeChatWishId, setActiveChatWishId] = useState<string | null>(null);
  
  // Verification states
  const [verifying, setVerifying] = useState(false);
  const [verifyResult, setVerifyResult] = useState<any>(null);

  const handleToggleRole = (role: UserRole) => {
    setUser(prev => ({ ...prev, role }));
  };

  const handlePostWish = (wishData: any) => {
    const newWish: Wish = {
      id: Math.random().toString(36).substr(2, 9),
      ...wishData,
      status: WishStatus.PENDING,
      buyerId: user.id,
      createdAt: new Date().toISOString(),
      chat: []
    };
    setWishes([newWish, ...wishes]);
    setUser(prev => ({ ...prev, balance: prev.balance - (wishData.estimatedPrice + wishData.reward) }));
    setShowMakeModal(false);
  };

  const handleClaimWish = (wishId: string) => {
    setWishes(prev => prev.map(w => w.id === wishId ? { ...w, status: WishStatus.MATCHED, travelerId: user.id } : w));
    setActiveChatWishId(wishId);
  };

  const handleSendMessage = (wishId: string, text: string) => {
    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      senderId: user.id,
      text,
      timestamp: new Date().toISOString()
    };
    setWishes(prev => prev.map(w => w.id === wishId ? { ...w, chat: [...(w.chat || []), newMessage] } : w));
  };

  const handleVerificationUpload = async (wishId: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && selectedWish) {
      setVerifying(true);
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64 = (reader.result as string).split(',')[1];
        const result = await verifyProductAuthenticity(selectedWish.description, base64);
        setVerifyResult(result);
        setVerifying(false);
        
        if (result.isAuthentic) {
           setWishes(prev => prev.map(w => w.id === wishId ? { ...w, status: WishStatus.VERIFYING } : w));
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const filteredWishes = wishes
    .filter(w => activeTab === 'explore' ? w.buyerId !== user.id : w.buyerId === user.id)
    .filter(w => w.itemName.toLowerCase().includes(searchQuery.toLowerCase()) || w.location.toLowerCase().includes(searchQuery.toLowerCase()));

  const activeChatWish = wishes.find(w => w.id === activeChatWishId);

  return (
    <div className="min-h-screen bg-[#FDFDFF]">
      <Header user={user} onToggleRole={handleToggleRole} />

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Modern Search & Title */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tight">
              {activeTab === 'explore' ? 'Global Marketplace' : 'My Shopping Wishes'}
            </h1>
            <p className="text-slate-500 mt-2 font-medium">Connecting the world, one wish at a time.</p>
          </div>
          
          <div className="relative flex-1 max-w-md">
            <input
              type="text"
              placeholder="Search products or cities..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-6 py-4 bg-white border border-slate-100 rounded-3xl shadow-sm focus:ring-4 focus:ring-[#FF6B6B]/10 outline-none transition-all font-medium text-slate-700"
            />
            <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>

        {/* Categories / Tabs */}
        <div className="flex gap-4 mb-8 overflow-x-auto pb-2 custom-scrollbar">
          {['explore', 'my-wishes'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as any)}
              className={`px-8 py-3 rounded-2xl font-bold text-sm whitespace-nowrap transition-all ${
                activeTab === tab 
                  ? 'bg-slate-900 text-white shadow-xl shadow-slate-200' 
                  : 'bg-white text-slate-400 border border-slate-100 hover:border-slate-300'
              }`}
            >
              {tab === 'explore' ? '🌎 Browse World' : '🎁 My Wishlist'}
            </button>
          ))}
          <button 
            onClick={() => setShowMakeModal(true)}
            className="px-8 py-3 rounded-2xl font-bold text-sm whitespace-nowrap bg-[#FF6B6B] text-white shadow-xl shadow-red-100 hover:bg-[#ff5252] transition-all"
          >
            ✨ Create Wish
          </button>
        </div>

        {/* Wishes Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {filteredWishes.map(wish => (
            <WishCard key={wish.id} wish={wish} onClick={setSelectedWish} />
          ))}
          {filteredWishes.length === 0 && (
            <div className="col-span-full py-32 text-center">
              <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
                 <svg className="w-10 h-10 text-slate-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                 </svg>
              </div>
              <h2 className="text-xl font-bold text-slate-800">No results found</h2>
              <p className="text-slate-400 mt-2">Try a different search term or explore all regions.</p>
            </div>
          )}
        </div>
      </main>

      {/* Wish Detail & Action Modal */}
      {selectedWish && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md overflow-y-auto">
          <div className="bg-white rounded-[40px] w-full max-w-4xl shadow-2xl overflow-hidden flex flex-col md:flex-row animate-in zoom-in duration-300">
            <div className="md:w-1/2 h-80 md:h-auto relative">
              <img src={selectedWish.image} className="w-full h-full object-cover" alt="" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
              <div className="absolute bottom-8 left-8">
                 <span className="px-3 py-1 bg-[#FF6B6B] rounded-lg text-white font-bold text-xs shadow-lg uppercase tracking-widest">
                   {selectedWish.tag}
                 </span>
              </div>
            </div>

            <div className="md:w-1/2 p-12 flex flex-col">
              <div className="flex justify-between items-start mb-8">
                <h2 className="text-3xl font-black text-slate-900 leading-tight">{selectedWish.itemName}</h2>
                <button onClick={() => { setSelectedWish(null); setVerifyResult(null); }} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                  <svg className="w-6 h-6 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="space-y-8 flex-1">
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-2">Item Insight</label>
                  <p className="text-slate-600 leading-relaxed font-medium">{selectedWish.description}</p>
                </div>

                <div className="flex gap-4">
                  <div className="flex-1 p-5 bg-slate-50 rounded-3xl border border-slate-100">
                    <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Price</p>
                    <p className="text-xl font-black text-slate-900">${selectedWish.estimatedPrice}</p>
                  </div>
                  <div className="flex-1 p-5 bg-red-50 rounded-3xl border border-red-100">
                    <p className="text-[10px] font-bold text-red-400 uppercase mb-1">Reward</p>
                    <p className="text-xl font-black text-[#FF6B6B]">${selectedWish.reward}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 text-slate-500 font-bold text-sm">
                  <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    </svg>
                  </div>
                  <span>{selectedWish.location}</span>
                </div>

                {/* AI Verification Logic for Travelers */}
                {user.role === UserRole.TRAVELER && selectedWish.status === WishStatus.MATCHED && (
                  <div className="p-6 bg-emerald-50 rounded-3xl border border-emerald-100">
                    <h4 className="text-sm font-bold text-emerald-800 mb-3 flex items-center gap-2">
                       <span className="animate-pulse">✨</span> AI Product Verification
                    </h4>
                    <p className="text-xs text-emerald-700 mb-4 font-medium">Upload a photo of the item you purchased to verify with the buyer.</p>
                    <input 
                      type="file" 
                      id="verify-photo" 
                      className="hidden" 
                      onChange={(e) => handleVerificationUpload(selectedWish.id, e)}
                    />
                    <label 
                      htmlFor="verify-photo"
                      className="w-full py-4 bg-white text-emerald-600 border-2 border-dashed border-emerald-200 rounded-2xl flex items-center justify-center gap-2 cursor-pointer hover:bg-emerald-100 transition-colors font-bold text-sm"
                    >
                      {verifying ? 'Analyzing with Gemini...' : 'Upload Proof Photo'}
                    </label>
                  </div>
                )}

                {verifyResult && (
                  <div className="p-6 bg-white border-2 border-slate-100 rounded-3xl shadow-sm animate-in slide-in-from-bottom-2">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-xs font-bold text-slate-400 uppercase">Gemini Score</span>
                      <span className={`text-sm font-black ${verifyResult.matchScore > 80 ? 'text-emerald-500' : 'text-amber-500'}`}>
                        {verifyResult.matchScore}% Match
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 font-medium italic">"{verifyResult.reasoning}"</p>
                  </div>
                )}
              </div>

              <div className="mt-12 flex gap-4">
                {selectedWish.buyerId === user.id ? (
                  <button className="flex-1 py-5 bg-slate-900 text-white rounded-2xl font-bold shadow-xl shadow-slate-200 hover:bg-slate-800 transition-all active:scale-95">
                    Manage Escrow
                  </button>
                ) : (
                  <>
                    <button 
                      onClick={() => handleClaimWish(selectedWish.id)}
                      disabled={selectedWish.status !== WishStatus.PENDING}
                      className="flex-1 py-5 bg-[#FF6B6B] text-white rounded-2xl font-bold shadow-xl shadow-red-200 hover:bg-[#ff5252] disabled:bg-slate-200 transition-all active:scale-95"
                    >
                      {selectedWish.status === WishStatus.PENDING ? 'Claim Wish' : 'Claimed'}
                    </button>
                    <button 
                      onClick={() => { setActiveChatWishId(selectedWish.id); setSelectedWish(null); }}
                      className="w-20 py-5 bg-slate-100 text-slate-600 rounded-2xl font-bold flex items-center justify-center hover:bg-slate-200 transition-all"
                    >
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                      </svg>
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Post Wish Modal */}
      {showMakeModal && (
        <MakeWishModal 
          onClose={() => setShowMakeModal(false)} 
          onSubmit={handlePostWish} 
        />
      )}

      {/* Chat Sidebar/Modal */}
      {activeChatWishId && activeChatWish && (
        <ChatModal 
          wish={activeChatWish} 
          user={user} 
          onClose={() => setActiveChatWishId(null)} 
          onSendMessage={(text) => handleSendMessage(activeChatWishId, text)}
        />
      )}
    </div>
  );
};

export default App;
