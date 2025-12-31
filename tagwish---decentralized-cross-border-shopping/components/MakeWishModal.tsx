
import React, { useState, useRef } from 'react';
import { analyzeProductImage, generatePriceGuidance } from '../services/geminiService';

interface MakeWishModalProps {
  onClose: () => void;
  onSubmit: (wishData: any) => void;
}

const MakeWishModal: React.FC<MakeWishModalProps> = ({ onClose, onSubmit }) => {
  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    itemName: '',
    description: '',
    estimatedPrice: 0,
    reward: 0,
    location: '',
    tag: ''
  });
  const [aiAdvice, setAiAdvice] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setLoading(true);
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64 = (reader.result as string).split(',')[1];
        setImage(reader.result as string);
        
        // AI Analysis
        const analysis = await analyzeProductImage(base64);
        if (analysis) {
          setFormData({
            itemName: analysis.itemName,
            description: analysis.description,
            estimatedPrice: analysis.estimatedPrice,
            reward: Math.ceil(analysis.estimatedPrice * 0.15), // Suggest 15% reward
            location: analysis.suggestedLocation,
            tag: analysis.tag
          });
        }
        setLoading(false);
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePriceChange = async (reward: number) => {
    setFormData(prev => ({ ...prev, reward }));
    if (formData.itemName && reward > 0) {
      const advice = await generatePriceGuidance(formData.itemName, reward);
      setAiAdvice(advice);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <div className="bg-white rounded-[32px] w-full max-w-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
        <div className="p-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-slate-800">Make a Wish</h2>
            <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
              <svg className="w-6 h-6 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="space-y-6 max-h-[70vh] overflow-y-auto pr-2 custom-scrollbar">
            {/* Image Upload Area */}
            <div 
              onClick={() => fileInputRef.current?.click()}
              className="relative group cursor-pointer border-2 border-dashed border-slate-200 rounded-3xl h-56 flex flex-col items-center justify-center transition-all hover:border-[#FF6B6B] hover:bg-red-50/30"
            >
              {image ? (
                <img src={image} className="absolute inset-0 w-full h-full object-cover rounded-[22px]" alt="Preview" />
              ) : (
                <div className="text-center">
                  <div className="w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-3 group-hover:bg-red-100 transition-colors">
                    <svg className="w-6 h-6 text-slate-400 group-hover:text-[#FF6B6B]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <p className="text-sm font-semibold text-slate-600">Tap to upload reference photo</p>
                  <p className="text-xs text-slate-400 mt-1">AI will help fill the details</p>
                </div>
              )}
              {loading && (
                <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex flex-col items-center justify-center rounded-[22px]">
                  <div className="w-8 h-8 border-4 border-[#FF6B6B] border-t-transparent rounded-full animate-spin mb-3"></div>
                  <p className="text-sm font-bold text-slate-800">AI Analysis in progress...</p>
                </div>
              )}
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleImageUpload} 
                className="hidden" 
                accept="image/*"
              />
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Item Name</label>
                <input
                  value={formData.itemName}
                  onChange={e => setFormData(f => ({ ...f, itemName: e.target.value }))}
                  placeholder="e.g. Goyard Bag from Paris"
                  className="w-full px-5 py-4 bg-slate-50 border-0 rounded-2xl focus:ring-2 focus:ring-[#FF6B6B]/20 transition-all text-slate-800 placeholder-slate-400"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Detailed Description</label>
                <textarea
                  value={formData.description}
                  onChange={e => setFormData(f => ({ ...f, description: e.target.value }))}
                  rows={3}
                  placeholder="Describe store location and specifics..."
                  className="w-full px-5 py-4 bg-slate-50 border-0 rounded-2xl focus:ring-2 focus:ring-[#FF6B6B]/20 transition-all text-slate-800 placeholder-slate-400 resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Est. Price ($)</label>
                  <input
                    type="number"
                    value={formData.estimatedPrice}
                    onChange={e => setFormData(f => ({ ...f, estimatedPrice: parseFloat(e.target.value) }))}
                    className="w-full px-5 py-4 bg-slate-50 border-0 rounded-2xl focus:ring-2 focus:ring-[#FF6B6B]/20 transition-all text-slate-800"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Traveler Reward ($)</label>
                  <input
                    type="number"
                    value={formData.reward}
                    onChange={e => handlePriceChange(parseFloat(e.target.value))}
                    className="w-full px-5 py-4 bg-slate-50 border-0 rounded-2xl focus:ring-2 focus:ring-[#FF6B6B]/20 transition-all text-slate-800"
                  />
                </div>
              </div>

              {aiAdvice && (
                <div className="p-4 bg-emerald-50 rounded-2xl flex gap-3 animate-in fade-in slide-in-from-top-2">
                  <div className="w-6 h-6 text-emerald-600">✨</div>
                  <p className="text-xs font-medium text-emerald-800 leading-relaxed">{aiAdvice}</p>
                </div>
              )}
            </div>
          </div>

          <button
            onClick={() => onSubmit({ ...formData, image })}
            disabled={!image || !formData.itemName}
            className="w-full mt-8 py-5 bg-[#FF6B6B] hover:bg-[#ff5252] disabled:bg-slate-200 disabled:cursor-not-allowed text-white font-bold rounded-2xl shadow-xl shadow-red-200 transition-all active:scale-95 flex items-center justify-center gap-2"
          >
            Post Wish (Escrow Required)
          </button>
        </div>
      </div>
    </div>
  );
};

export default MakeWishModal;
