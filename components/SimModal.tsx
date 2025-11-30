import React, { useState, useEffect } from 'react';
import { SimCard } from '../types';
import { X, Calendar, Phone, Tag, Save } from 'lucide-react';

interface SimModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (sim: Omit<SimCard, 'id'> | SimCard) => void;
  editingSim?: SimCard | null;
}

export const SimModal: React.FC<SimModalProps> = ({ isOpen, onClose, onSave, editingSim }) => {
  const [label, setLabel] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [lastUsageDate, setLastUsageDate] = useState('');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (isOpen) {
      if (editingSim) {
        setLabel(editingSim.label);
        setPhoneNumber(editingSim.phoneNumber);
        setLastUsageDate(editingSim.lastUsageDate.split('T')[0]);
        setNotes(editingSim.notes || '');
      } else {
        setLabel('');
        setPhoneNumber('');
        setLastUsageDate(new Date().toISOString().split('T')[0]);
        setNotes('');
      }
    }
  }, [isOpen, editingSim]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const simData = {
      label,
      phoneNumber,
      lastUsageDate: new Date(lastUsageDate).toISOString(),
      notes,
      ...(editingSim && { id: editingSim.id })
    };
    onSave(simData as any);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-brand-card w-full max-w-md rounded-2xl shadow-2xl border border-white/10 overflow-hidden transform transition-all">
        <div className="px-6 py-4 border-b border-white/5 flex justify-between items-center bg-white/5">
          <h2 className="text-xl font-semibold text-white">
            {editingSim ? 'Edit SIM Card' : 'Add New SIM'}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-300 flex items-center gap-2">
              <Tag size={14} className="text-brand-accent" /> Label
            </label>
            <input
              type="text"
              required
              placeholder="e.g. My iPad SIM"
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-brand-accent focus:ring-1 focus:ring-brand-accent transition-all placeholder-gray-600"
            />
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-300 flex items-center gap-2">
              <Phone size={14} className="text-brand-accent" /> Phone Number
            </label>
            <input
              type="tel"
              required
              placeholder="e.g. +44 7700 900000"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-brand-accent focus:ring-1 focus:ring-brand-accent transition-all placeholder-gray-600"
            />
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-300 flex items-center gap-2">
              <Calendar size={14} className="text-brand-accent" /> Last Usage Date
            </label>
            <input
              type="date"
              required
              value={lastUsageDate}
              onChange={(e) => setLastUsageDate(e.target.value)}
              className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-brand-accent focus:ring-1 focus:ring-brand-accent transition-all [color-scheme:dark]"
            />
            <p className="text-xs text-brand-muted pl-1">The date you last made a call, sent text, or used data.</p>
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-300">Notes (Optional)</label>
            <textarea
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Any extra details..."
              className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-brand-accent focus:ring-1 focus:ring-brand-accent transition-all placeholder-gray-600 resize-none"
            />
          </div>

          <div className="pt-4 flex gap-3">
             <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2.5 rounded-lg border border-white/10 text-gray-300 font-medium hover:bg-white/5 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 bg-brand-accent hover:bg-cyan-400 text-brand-dark font-bold py-2.5 rounded-lg transition-colors shadow-lg shadow-brand-accent/20 flex justify-center items-center gap-2"
            >
              <Save size={18} />
              {editingSim ? 'Update SIM' : 'Save SIM'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};