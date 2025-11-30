import React, { useState, useEffect } from 'react';
import { SmsConfig } from '../types';
import { X, Save, Lock, Smartphone, Zap } from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: SmsConfig;
  onSave: (config: SmsConfig) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose, config, onSave }) => {
  const [localConfig, setLocalConfig] = useState<SmsConfig>(config);

  useEffect(() => {
    setLocalConfig(config);
  }, [config, isOpen]);

  if (!isOpen) return null;

  const handleChange = (field: keyof SmsConfig, value: string | boolean) => {
    setLocalConfig(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(localConfig);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-brand-card w-full max-w-md rounded-2xl shadow-2xl border border-white/10 overflow-hidden">
        <div className="px-6 py-4 border-b border-white/5 flex justify-between items-center bg-white/5">
          <h2 className="text-xl font-semibold text-white flex items-center gap-2">
            System Settings
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3 text-xs text-blue-200 mb-4">
            <p className="font-semibold mb-1">Twilio Integration</p>
            <p>Configure your Twilio API credentials to enable the SMS sending service.</p>
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-300">Account SID</label>
            <input
              type="text"
              value={localConfig.accountSid}
              onChange={(e) => handleChange('accountSid', e.target.value)}
              placeholder="ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
              className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-brand-accent transition-all font-mono text-sm"
            />
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-300 flex items-center gap-2">
              Auth Token <Lock size={12} className="text-brand-muted" />
            </label>
            <input
              type="password"
              value={localConfig.authToken}
              onChange={(e) => handleChange('authToken', e.target.value)}
              placeholder="Your Twilio Auth Token"
              className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-brand-accent transition-all font-mono text-sm"
            />
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-300 flex items-center gap-2">
              From Number <Smartphone size={12} className="text-brand-muted" />
            </label>
            <input
              type="text"
              value={localConfig.fromNumber}
              onChange={(e) => handleChange('fromNumber', e.target.value)}
              placeholder="+1234567890"
              className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-brand-accent transition-all font-mono text-sm"
            />
          </div>

          <div className="pt-2 border-t border-white/10 mt-4">
             <div className="flex items-center justify-between py-2">
                <div className="flex flex-col">
                   <span className="text-sm font-medium text-white flex items-center gap-2">
                     <Zap size={14} className={localConfig.autoSendEnabled ? 'text-brand-accent' : 'text-gray-500'} />
                     Auto-Send Task
                   </span>
                   <span className="text-xs text-gray-400">Automatically trigger SMS when date matches.</span>
                </div>
                <button
                  type="button" 
                  onClick={() => handleChange('autoSendEnabled', !localConfig.autoSendEnabled)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${localConfig.autoSendEnabled ? 'bg-brand-accent' : 'bg-gray-700'}`}
                >
                  <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${localConfig.autoSendEnabled ? 'translate-x-6' : 'translate-x-1'}`} />
                </button>
             </div>
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
              className="flex-1 bg-brand-accent hover:bg-cyan-400 text-brand-dark font-bold py-2.5 rounded-lg transition-colors flex justify-center items-center gap-2"
            >
              <Save size={18} />
              Save Config
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};