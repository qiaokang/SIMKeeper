import React, { useState } from 'react';
import { SimCard, ExpiryStatus } from '../types';
import { calculateDaysRemaining, getExpiryStatus, formatDate, getStatusColor, getProgressBarColor } from '../utils/dateUtils';
import { EXPIRY_DAYS } from '../constants';
import { MessageSquare, Calendar, Edit2, Trash2, Smartphone, Send, RefreshCcw, Radio } from 'lucide-react';

interface SimCardItemProps {
  sim: SimCard;
  onEdit: (sim: SimCard) => void;
  onDelete: (id: string) => void;
  onUpdateUsage: (id: string) => void;
  onSendSms: (sim: SimCard) => void;
}

export const SimCardItem: React.FC<SimCardItemProps> = ({ sim, onEdit, onDelete, onUpdateUsage, onSendSms }) => {
  const daysRemaining = calculateDaysRemaining(sim.lastUsageDate);
  const status = getExpiryStatus(daysRemaining);
  const progressPercent = Math.max(0, Math.min(100, (daysRemaining / EXPIRY_DAYS) * 100));
  
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = () => {
    if (isDeleting) {
      onDelete(sim.id);
    } else {
      setIsDeleting(true);
      setTimeout(() => setIsDeleting(false), 3000);
    }
  };

  return (
    <div className="bg-brand-card border border-white/5 rounded-xl p-5 shadow-lg hover:border-white/10 transition-all group relative overflow-hidden">
      {/* Status Bar Top */}
      <div className={`absolute top-0 left-0 w-full h-1 ${getProgressBarColor(status)} opacity-80`} />

      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg bg-white/5 text-white`}>
            <Smartphone size={24} />
          </div>
          <div>
            <h3 className="font-semibold text-lg text-white leading-tight">{sim.label}</h3>
            <p className="text-brand-muted text-sm font-mono tracking-wide">{sim.phoneNumber}</p>
          </div>
        </div>
        <div className={`px-3 py-1 rounded-full text-xs font-bold tracking-wider uppercase ${getStatusColor(status)}`}>
          {status === ExpiryStatus.SAFE ? 'Active' : status}
        </div>
      </div>

      {/* Progress Section */}
      <div className="mb-6">
        <div className="flex justify-between text-sm mb-2 text-gray-400">
          <span>Expires in</span>
          <span className={`font-mono font-bold ${daysRemaining < 30 ? 'text-brand-danger' : 'text-white'}`}>
            {daysRemaining} Days
          </span>
        </div>
        <div className="w-full bg-black/40 rounded-full h-2.5 overflow-hidden">
          <div 
            className={`h-2.5 rounded-full transition-all duration-1000 ease-out ${getProgressBarColor(status)}`} 
            style={{ width: `${progressPercent}%` }}
          />
        </div>
        <div className="flex justify-between text-xs mt-2 text-brand-muted">
          <span className="flex items-center gap-1">
             <Calendar size={12} /> Used: {formatDate(sim.lastUsageDate)}
          </span>
          <span>Target: {formatDate(new Date(new Date(sim.lastUsageDate).getTime() + EXPIRY_DAYS * 86400000).toISOString())}</span>
        </div>
      </div>

      {/* Actions */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <button 
          onClick={() => onSendSms(sim)}
          className="col-span-2 flex items-center justify-center gap-2 bg-brand-accent/10 hover:bg-brand-accent/20 text-brand-accent py-2.5 rounded-lg text-sm font-medium transition-colors border border-brand-accent/20 hover:border-brand-accent/50"
          title="Sends phone number to +447373000186"
        >
          <Radio size={16} />
          <span>Send Keep-Alive</span>
        </button>
        
        <button 
          onClick={() => onUpdateUsage(sim.id)}
          className="flex items-center justify-center gap-2 bg-white/5 hover:bg-emerald-500/20 text-emerald-400 py-2 rounded-lg text-xs font-medium transition-colors border border-white/5"
          title="Mark as used today"
        >
          <RefreshCcw size={14} />
          <span>Reset Timer</span>
        </button>

        <a 
          href={`sms:${sim.phoneNumber}`}
          className="flex items-center justify-center gap-2 bg-white/5 hover:bg-blue-500/20 text-blue-400 py-2 rounded-lg text-xs font-medium transition-colors border border-white/5"
        >
          <Send size={14} />
          <span>Manual SMS</span>
        </a>
      </div>

      {/* Footer Controls */}
      <div className="flex justify-end gap-2 pt-3 border-t border-white/5">
        <button onClick={() => onEdit(sim)} className="p-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-full transition-colors">
          <Edit2 size={16} />
        </button>
        <button 
          onClick={handleDelete} 
          className={`p-2 rounded-full transition-colors flex items-center gap-2 ${isDeleting ? 'bg-red-500/20 text-red-400 px-3' : 'text-gray-400 hover:text-red-400 hover:bg-white/5'}`}
        >
          <Trash2 size={16} />
          {isDeleting && <span className="text-xs font-bold">Confirm?</span>}
        </button>
      </div>
    </div>
  );
};