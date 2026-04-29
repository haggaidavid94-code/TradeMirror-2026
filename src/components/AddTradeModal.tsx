import React, { useState, useRef } from 'react';
import { 
  X, 
  Upload, 
  Camera, 
  ArrowRight, 
  ArrowLeft, 
  Check, 
  Loader2, 
  DollarSign, 
  Tag, 
  Calendar as CalendarIcon,
  Brain,
  Target,
  AlertCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { GoogleGenAI, Type } from "@google/genai";
import { useRisk } from '../context/RiskContext';
import { useTrades } from '../context/TradeContext';
import { useToast } from '../context/ToastContext';

interface AddTradeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type Step = 'entry' | 'psychology' | 'review';

export const AddTradeModal = ({ isOpen, onClose }: AddTradeModalProps) => {
  const { maxRiskPerTrade } = useRisk();
  const { addTrade } = useTrades();
  const [step, setStep] = useState<Step | 'success'>('entry');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mistakes, setMistakes] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form State
  const [formData, setFormData] = useState({
    ticker: '',
    price: '',
    side: 'Long',
    date: new Date().toISOString().split('T')[0],
    setup: 'Bull Flag',
    confidence: 'High',
    psychology: '',
    notes: '',
    pnl: ''
  });

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsProcessing(true);
    setError(null);

    try {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64Data = (reader.result as string).split(',')[1];
        await performOCR(base64Data, file.type);
      };
      reader.readAsDataURL(file);
    } catch (err) {
      setError('Failed to process image. Please enter manually.');
      setIsProcessing(false);
    }
  };

  const performOCR = async (base64Data: string, mimeType: string) => {
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      
      const prompt = "Extract the stock/crypto ticker symbol and the entry price from this trading screenshot. Return only a JSON object with 'ticker' and 'price' keys.";
      
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: [
          {
            parts: [
              { inlineData: { data: base64Data, mimeType } },
              { text: prompt }
            ]
          }
        ],
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              ticker: { type: Type.STRING },
              price: { type: Type.STRING }
            },
            required: ["ticker", "price"]
          }
        }
      });

      const result = JSON.parse(response.text || '{}');
      if (result.ticker || result.price) {
        setFormData(prev => ({
          ...prev,
          ticker: result.ticker?.toUpperCase() || prev.ticker,
          price: result.price || prev.price
        }));
      }
    } catch (err) {
      console.error('OCR Error:', err);
      setError('AI extraction failed. Please enter details manually.');
    } finally {
      setIsProcessing(false);
    }
  };

  const { showToast } = useToast();

  const handleNext = () => {
    if (step === 'entry') setStep('psychology');
    else if (step === 'psychology') setStep('review');
  };

  const handleBack = () => {
    if (step === 'psychology') setStep('entry');
    else if (step === 'review') setStep('psychology');
  };

  const handleSubmit = async () => {
    // Detect mistakes
    const detectedMistakes = [];
    const pnlValue = parseFloat(formData.pnl);
    if (!isNaN(pnlValue) && pnlValue < 0 && Math.abs(pnlValue) > maxRiskPerTrade) {
      detectedMistakes.push('Oversized Position (Risk Violation)');
    }
    setMistakes(detectedMistakes);
    setIsProcessing(true);

    try {
        await addTrade({
            asset: formData.ticker,
            date: formData.date,
            type: formData.side,
            size: "100 shares", // Placeholder or from form if added
            tags: [formData.confidence, formData.setup],
            entry: `$${formData.price}`,
            exit: "$0.00", // Placeholder or from form if added
            duration: "N/A",
            risk: 100, // Placeholder
            pnl: pnlValue || 0,
            color: formData.side === 'Long' ? 'bg-emerald-500' : 'bg-rose-500',
            assetClass: 'Equities',
            strategy: formData.setup,
            timeframe: 'Intraday'
        });
        
        setStep('success');
        showToast('Trade logged successfully!', 'success');
        
        setTimeout(() => {
          onClose();
          // Reset state after closing
          setTimeout(() => {
            setStep('entry');
            setMistakes([]);
            setFormData({
              ticker: '',
              price: '',
              side: 'Long',
              date: new Date().toISOString().split('T')[0],
              setup: 'Bull Flag',
              confidence: 'High',
              psychology: '',
              notes: '',
              pnl: ''
            });
          }, 300);
        }, 2000);
    } catch (e) {
        showToast('Failed to log trade', 'error');
    } finally {
        setIsProcessing(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
        {/* Backdrop */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-slate-950/60 backdrop-blur-md"
        />

        {/* Modal Content */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-2xl border border-white/20 dark:border-slate-800 overflow-hidden"
        >
          {/* Header */}
          <div className="p-8 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-black text-slate-800 dark:text-white tracking-tight">Power Entry</h2>
              {step !== 'success' && <p className="text-sm text-slate-500 font-medium">Step {step === 'entry' ? '1' : step === 'psychology' ? '2' : '3'} of 3</p>}
            </div>
            <button 
              onClick={onClose}
              className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors text-slate-400"
            >
              <X size={24} />
            </button>
          </div>

          {/* Progress Bar */}
          <div className="h-1.5 bg-slate-100 dark:bg-slate-800 flex">
            <motion.div 
              className="h-full bg-sky-500"
              animate={{ width: step === 'entry' ? '33.33%' : step === 'psychology' ? '66.66%' : '100%' }}
            />
          </div>

          <div className="p-8 max-h-[70vh] overflow-y-auto custom-scrollbar">
            {step === 'success' && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="py-12 flex flex-col items-center justify-center text-center"
              >
                <div className="w-24 h-24 rounded-full bg-emerald-100 dark:bg-emerald-500/10 flex items-center justify-center text-emerald-500 mb-6 relative">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                  >
                    <Check size={48} strokeWidth={3} />
                  </motion.div>
                  {/* Success Particles Simulation */}
                  {[...Array(8)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="absolute w-2 h-2 rounded-full bg-emerald-400"
                      initial={{ scale: 0, x: 0, y: 0 }}
                      animate={{ 
                        scale: [0, 1, 0],
                        x: Math.cos(i * 45 * Math.PI / 180) * 60,
                        y: Math.sin(i * 45 * Math.PI / 180) * 60
                      }}
                      transition={{ delay: 0.3, duration: 0.8, ease: "easeOut" }}
                    />
                  ))}
                </div>
                <h3 className="text-2xl font-black text-slate-800 dark:text-white mb-2">Trade Logged!</h3>
                <p className="text-slate-500 font-medium">Your journal has been updated successfully.</p>
              </motion.div>
            )}

            {step === 'entry' && (
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-8"
              >
                {/* OCR Dropzone */}
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className={`relative group cursor-pointer border-2 border-dashed rounded-3xl p-8 transition-all flex flex-col items-center justify-center gap-4 ${
                    isProcessing 
                      ? 'border-sky-500 bg-sky-50/50 dark:bg-sky-500/5' 
                      : 'border-slate-200 dark:border-slate-700 hover:border-sky-500/50 hover:bg-slate-50 dark:hover:bg-slate-800/50'
                  }`}
                >
                  <input 
                    type="file" 
                    ref={fileInputRef} 
                    onChange={handleFileUpload} 
                    className="hidden" 
                    accept="image/*"
                  />
                  
                  {isProcessing ? (
                    <>
                      <Loader2 size={40} className="text-sky-500 animate-spin" />
                      <div className="text-center">
                        <p className="text-sm font-bold text-slate-800 dark:text-white">Gemini is analyzing...</p>
                        <p className="text-xs text-slate-500">Extracting ticker and price data</p>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="w-16 h-16 rounded-2xl bg-sky-100 dark:bg-sky-500/10 flex items-center justify-center text-sky-500 group-hover:scale-110 transition-transform">
                        <Camera size={32} />
                      </div>
                      <div className="text-center">
                        <p className="text-sm font-bold text-slate-800 dark:text-white">Drop Screenshot or Click</p>
                        <p className="text-xs text-slate-500">AI will automatically extract ticker and price</p>
                      </div>
                    </>
                  )}
                </div>

                {error && (
                  <div className="flex items-center gap-2 p-4 bg-rose-50 dark:bg-rose-500/10 text-rose-500 rounded-2xl border border-rose-100 dark:border-rose-500/20 text-xs font-bold">
                    <AlertCircle size={16} />
                    {error}
                  </div>
                )}

                {/* Manual Form */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Ticker Symbol</label>
                    <div className="relative">
                      <Tag className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                      <input 
                        type="text" 
                        value={formData.ticker}
                        onChange={(e) => setFormData({...formData, ticker: e.target.value.toUpperCase()})}
                        placeholder="e.g. NVDA"
                        className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl py-4 pl-12 pr-4 focus:ring-2 focus:ring-sky-500 transition-all font-bold text-slate-800 dark:text-white"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Entry Price</label>
                    <div className="relative">
                      <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                      <input 
                        type="text" 
                        value={formData.price}
                        onChange={(e) => setFormData({...formData, price: e.target.value})}
                        placeholder="0.00"
                        className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl py-4 pl-12 pr-4 focus:ring-2 focus:ring-sky-500 transition-all font-bold text-slate-800 dark:text-white"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Side</label>
                    <div className="flex gap-2 p-1 bg-slate-50 dark:bg-slate-800 rounded-2xl">
                      {['Long', 'Short'].map((s) => (
                        <button
                          key={s}
                          onClick={() => setFormData({...formData, side: s})}
                          className={`flex-1 py-3 rounded-xl text-xs font-bold transition-all ${
                            formData.side === s 
                              ? 'bg-white dark:bg-slate-700 text-sky-500 shadow-sm' 
                              : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
                          }`}
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Date</label>
                    <div className="relative">
                      <CalendarIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                      <input 
                        type="date" 
                        value={formData.date}
                        onChange={(e) => setFormData({...formData, date: e.target.value})}
                        className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl py-4 pl-12 pr-4 focus:ring-2 focus:ring-sky-500 transition-all font-bold text-slate-800 dark:text-white"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">P&L ($)</label>
                    <div className="relative">
                      <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                      <input 
                        type="text" 
                        value={formData.pnl}
                        onChange={(e) => setFormData({...formData, pnl: e.target.value})}
                        placeholder="e.g. -600"
                        className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl py-4 pl-12 pr-4 focus:ring-2 focus:ring-sky-500 transition-all font-bold text-slate-800 dark:text-white"
                      />
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {step === 'psychology' && (
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-8"
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Setup Type</label>
                    <div className="relative">
                      <Target className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                      <select 
                        value={formData.setup}
                        onChange={(e) => setFormData({...formData, setup: e.target.value})}
                        className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl py-4 pl-12 pr-4 focus:ring-2 focus:ring-sky-500 transition-all font-bold text-slate-800 dark:text-white appearance-none"
                      >
                        <option>Bull Flag</option>
                        <option>VWAP Bounce</option>
                        <option>ORB Breakout</option>
                        <option>Mean Reversion</option>
                        <option>Other</option>
                      </select>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Confidence</label>
                    <div className="flex gap-2 p-1 bg-slate-50 dark:bg-slate-800 rounded-2xl">
                      {['Low', 'Med', 'High'].map((c) => (
                        <button
                          key={c}
                          onClick={() => setFormData({...formData, confidence: c})}
                          className={`flex-1 py-3 rounded-xl text-xs font-bold transition-all ${
                            formData.confidence === c 
                              ? 'bg-white dark:bg-slate-700 text-sky-500 shadow-sm' 
                              : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
                          }`}
                        >
                          {c}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Psychology State</label>
                  <div className="relative">
                    <Brain className="absolute left-4 top-6 text-slate-400" size={18} />
                    <textarea 
                      value={formData.psychology}
                      onChange={(e) => setFormData({...formData, psychology: e.target.value})}
                      placeholder="How were you feeling during entry? (e.g. Calm, FOMO, Anxious)"
                      rows={3}
                      className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl py-4 pl-12 pr-4 focus:ring-2 focus:ring-sky-500 transition-all font-bold text-slate-800 dark:text-white resize-none"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Trade Notes</label>
                  <textarea 
                    value={formData.notes}
                    onChange={(e) => setFormData({...formData, notes: e.target.value})}
                    placeholder="Additional context about the trade..."
                    rows={4}
                    className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl p-4 focus:ring-2 focus:ring-sky-500 transition-all font-bold text-slate-800 dark:text-white resize-none"
                  />
                </div>
              </motion.div>
            )}

            {step === 'review' && (
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-8"
              >
                {mistakes.length > 0 && (
                  <div className="p-6 bg-rose-50 dark:bg-rose-500/10 rounded-2xl border border-rose-100 dark:border-rose-500/20 space-y-3">
                    <div className="flex items-center gap-2 text-rose-500">
                      <AlertCircle size={18} />
                      <span className="text-xs font-black uppercase tracking-widest">Mistakes Detected</span>
                    </div>
                    <ul className="space-y-1.5">
                      {mistakes.map((m, i) => (
                        <li key={i} className="text-xs font-bold text-rose-600 dark:text-rose-400 flex items-center gap-2">
                          <div className="w-1 h-1 rounded-full bg-rose-400" />
                          {m}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="p-8 bg-slate-50 dark:bg-slate-800/50 rounded-[2rem] border border-slate-100 dark:border-slate-800">
                  <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-4">
                      <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-2xl font-black text-white ${formData.side === 'Long' ? 'bg-emerald-500' : 'bg-rose-500'}`}>
                        {formData.ticker.substring(0, 2)}
                      </div>
                      <div>
                        <h3 className="text-2xl font-black text-slate-800 dark:text-white">{formData.ticker}</h3>
                        <p className={`text-xs font-bold uppercase tracking-widest ${formData.side === 'Long' ? 'text-emerald-500' : 'text-rose-500'}`}>{formData.side} Position</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Entry Price</p>
                      <p className="text-2xl font-black text-slate-800 dark:text-white font-mono">${formData.price}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-8 pt-8 border-t border-slate-200 dark:border-slate-700">
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Setup</p>
                      <p className="text-sm font-bold text-slate-700 dark:text-slate-200">{formData.setup}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Confidence</p>
                      <p className="text-sm font-bold text-slate-700 dark:text-slate-200">{formData.confidence}</p>
                    </div>
                    <div className="col-span-2">
                      <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Psychology</p>
                      <p className="text-sm font-bold text-slate-700 dark:text-slate-200 italic">"{formData.psychology || 'No notes added'}"</p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-4 bg-sky-50 dark:bg-sky-500/10 text-sky-600 dark:text-sky-400 rounded-2xl text-xs font-bold">
                  <Check size={18} />
                  Ready to log this trade to your journal.
                </div>
              </motion.div>
            )}
          </div>

          {/* Footer Actions */}
          {step !== 'success' && (
            <div className="p-8 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <button
                onClick={step === 'entry' ? onClose : handleBack}
                className="flex items-center gap-2 px-6 py-3 rounded-2xl text-sm font-bold text-slate-500 hover:text-slate-800 dark:hover:text-white transition-colors"
              >
                <ArrowLeft size={18} />
                {step === 'entry' ? 'Cancel' : 'Back'}
              </button>

              <button
                onClick={step === 'review' ? handleSubmit : handleNext}
                disabled={step === 'entry' && (!formData.ticker || !formData.price)}
                className="flex items-center gap-2 px-8 py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-2xl text-sm font-black shadow-xl shadow-slate-900/20 dark:shadow-white/10 hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:hover:scale-100"
              >
                {step === 'review' ? 'Confirm & Log Trade' : 'Next Step'}
                {step !== 'review' && <ArrowRight size={18} />}
                {step === 'review' && <Check size={18} />}
              </button>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
