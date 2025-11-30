import React, { useState, useEffect, useCallback } from 'react';
import { SimCard, SmsConfig } from './types';
import { SimCardItem } from './components/SimCardItem';
import { SimModal } from './components/SimModal';
import { AiAssistant } from './components/AiAssistant';
import { SettingsModal } from './components/SettingsModal';
import { sendKeepAliveSms } from './services/smsService';
import { StorageService } from './services/storageService';
import { calculateDaysRemaining } from './utils/dateUtils';
import { EXPIRY_DAYS, AUTO_SEND_BUFFER_DAYS } from './constants';
import { Plus, Bot, LayoutGrid, Info, Settings, Server, CheckCircle2 } from 'lucide-react';

function App() {
  const [simCards, setSimCards] = useState<SimCard[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAiOpen, setIsAiOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [editingSim, setEditingSim] = useState<SimCard | null>(null);
  
  const [smsConfig, setSmsConfig] = useState<SmsConfig>({
    accountSid: '',
    authToken: '',
    fromNumber: '',
    autoSendEnabled: false
  });

  // Loading state for SMS sending
  const [isSendingSms, setIsSendingSms] = useState<string | null>(null);
  const [schedulerStatus, setSchedulerStatus] = useState<'idle' | 'checking' | 'active'>('idle');

  // Load data from "Database"
  useEffect(() => {
    const sims = StorageService.getSims();
    setSimCards(sims);
    const config = StorageService.getConfig();
    setSmsConfig(config);
  }, []);

  // Save to "Database" whenever state changes
  useEffect(() => {
    StorageService.saveSims(simCards);
  }, [simCards]);

  useEffect(() => {
    StorageService.saveConfig(smsConfig);
  }, [smsConfig]);

  const handleAddSim = (simData: Omit<SimCard, 'id'>) => {
    const newSim: SimCard = {
      ...simData,
      id: crypto.randomUUID()
    };
    setSimCards(prev => [...prev, newSim]);
  };

  const handleUpdateSim = (simData: SimCard) => {
    setSimCards(prev => prev.map(s => s.id === simData.id ? simData : s));
  };

  const handleDeleteSim = (id: string) => {
    setSimCards(prev => prev.filter(s => s.id !== id));
  };

  const handleUpdateUsage = (id: string) => {
    const now = new Date().toISOString();
    setSimCards(prev => prev.map(s => s.id === id ? { ...s, lastUsageDate: now } : s));
  };

  const openAddModal = () => {
    setEditingSim(null);
    setIsModalOpen(true);
  };

  const openEditModal = (sim: SimCard) => {
    setEditingSim(sim);
    setIsModalOpen(true);
  };

  const handleSendSms = async (sim: SimCard) => {
    if (!smsConfig.accountSid || !smsConfig.authToken) {
      setIsSettingsOpen(true);
      return;
    }

    setIsSendingSms(sim.id);
    const result = await sendKeepAliveSms(sim.phoneNumber, smsConfig);
    setIsSendingSms(null);
    
    if (result.success) {
      handleUpdateUsage(sim.id); 
      // Show simple notification logic here or console
      console.log("Success:", result.message);
    } else {
      alert(result.message);
    }
  };

  /**
   * SCHEDULER LOGIC ("The Backend Task")
   * This runs automatically to check for due dates.
   */
  const checkScheduledTasks = useCallback(async () => {
    if (!smsConfig.autoSendEnabled || !smsConfig.accountSid) {
      setSchedulerStatus('idle');
      return;
    }

    setSchedulerStatus('checking');
    
    // Check all sims
    for (const sim of simCards) {
      const daysRemaining = calculateDaysRemaining(sim.lastUsageDate);
      
      // If within the auto-send window (e.g. 3 days before expiry)
      if (daysRemaining <= AUTO_SEND_BUFFER_DAYS && daysRemaining > 0) {
        // Trigger SMS
        setSchedulerStatus('active');
        await handleSendSms(sim);
      }
    }
    
    // Reset status after a delay
    setTimeout(() => setSchedulerStatus('idle'), 2000);
  }, [simCards, smsConfig]);

  // Run scheduler on mount and every minute
  useEffect(() => {
    checkScheduledTasks();
    const interval = setInterval(checkScheduledTasks, 60000);
    return () => clearInterval(interval);
  }, [checkScheduledTasks]);


  return (
    <div className="min-h-screen bg-brand-dark text-gray-200 selection:bg-brand-accent selection:text-brand-dark">
      
      {/* Header */}
      <header className="sticky top-0 z-30 bg-brand-dark/80 backdrop-blur-md border-b border-white/5">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-brand-accent p-1.5 rounded-lg">
               <LayoutGrid className="text-brand-dark" size={24} />
            </div>
            <h1 className="text-xl font-bold tracking-tight text-white">SIM Keeper</h1>
          </div>
          
          <div className="flex items-center gap-3">
            {/* Scheduler Status Indicator */}
            {smsConfig.autoSendEnabled && (
               <div className="hidden md:flex items-center gap-2 px-3 py-1 bg-white/5 rounded-full border border-white/5">
                  <div className={`w-2 h-2 rounded-full ${schedulerStatus === 'active' ? 'bg-green-500 animate-pulse' : 'bg-brand-accent'}`} />
                  <span className="text-xs text-gray-400 font-mono">
                    {schedulerStatus === 'active' ? 'TASK RUNNING' : 'LISTENING'}
                  </span>
               </div>
            )}

            <button 
              onClick={() => setIsSettingsOpen(true)}
              className="p-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-full transition-colors relative"
              title="Settings"
            >
              <Settings size={22} />
              {!smsConfig.accountSid && (
                <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full" />
              )}
            </button>
            <button 
              onClick={() => setIsAiOpen(true)}
              className="p-2 text-gray-400 hover:text-brand-accent hover:bg-brand-accent/10 rounded-full transition-colors"
              title="Ask AI Assistant"
            >
              <Bot size={24} />
            </button>
            <button 
              onClick={openAddModal}
              className="flex items-center gap-2 bg-brand-accent hover:bg-cyan-400 text-brand-dark font-bold px-4 py-2 rounded-full transition-all hover:scale-105 active:scale-95 shadow-lg shadow-brand-accent/20"
            >
              <Plus size={18} />
              <span className="hidden sm:inline">Add SIM</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        
        {simCards.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center border-2 border-dashed border-white/5 rounded-3xl bg-white/[0.02]">
            <div className="bg-white/5 p-4 rounded-full mb-4">
              <LayoutGrid size={48} className="text-brand-muted" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">No SIM cards tracked yet</h2>
            <p className="text-gray-400 max-w-md mb-8">
              Add your giffgaff or other carrier SIMs. 
              The system will track dates and send keep-alive messages automatically.
            </p>
            <button 
              onClick={openAddModal}
              className="bg-brand-accent text-brand-dark font-bold px-6 py-3 rounded-xl hover:bg-cyan-400 transition-colors"
            >
              Add your first SIM
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {simCards.map(sim => (
              <div key={sim.id} className="relative">
                 {isSendingSms === sim.id && (
                   <div className="absolute inset-0 z-20 bg-black/60 backdrop-blur-sm rounded-xl flex items-center justify-center flex-col gap-3 transition-all">
                      <div className="bg-brand-card p-4 rounded-xl border border-brand-accent/20 shadow-xl flex flex-col items-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-brand-accent mb-2"></div>
                        <p className="text-sm font-bold text-white">Sending SMS...</p>
                        <p className="text-xs text-gray-400">Target: +447373000186</p>
                      </div>
                   </div>
                 )}
                <SimCardItem 
                  sim={sim} 
                  onEdit={openEditModal} 
                  onDelete={handleDeleteSim}
                  onUpdateUsage={handleUpdateUsage}
                  onSendSms={handleSendSms}
                />
              </div>
            ))}
          </div>
        )}
        
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6">
           <div className="p-6 bg-brand-card rounded-xl border border-white/5 flex gap-4 items-start">
             <Info className="text-brand-muted shrink-0 mt-1" size={24} />
             <div>
               <h3 className="text-lg font-semibold text-white mb-1">Keep-Alive Protocol</h3>
               <p className="text-gray-400 text-sm leading-relaxed">
                 To prevent deactivation, an SMS must be sent every 180 days. 
                 This system sends your SIM number (formatted as <code className="text-brand-accent bg-white/5 px-1 rounded">0044 79...</code>) 
                 to the designated server number.
               </p>
             </div>
           </div>

           <div className="p-6 bg-brand-card rounded-xl border border-white/5 flex gap-4 items-start">
             <Server className="text-brand-muted shrink-0 mt-1" size={24} />
             <div>
               <h3 className="text-lg font-semibold text-white mb-1">Backend Scheduler</h3>
               <p className="text-gray-400 text-sm leading-relaxed">
                 The internal scheduler checks for due tasks every minute. 
                 {smsConfig.autoSendEnabled 
                   ? <span className="text-green-400"> Auto-Send is active. Keep this tab open to ensure timely delivery.</span>
                   : <span className="text-yellow-500"> Auto-Send is disabled. You must click 'Send Keep-Alive' manually.</span>
                 }
               </p>
             </div>
           </div>
        </div>

      </main>

      {/* Modals */}
      <SimModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSave={editingSim ? handleUpdateSim : handleAddSim}
        editingSim={editingSim}
      />

      <SettingsModal 
        isOpen={isSettingsOpen} 
        onClose={() => setIsSettingsOpen(false)}
        config={smsConfig}
        onSave={setSmsConfig}
      />

      <AiAssistant 
        isOpen={isAiOpen} 
        onClose={() => setIsAiOpen(false)} 
      />
    </div>
  );
}

export default App;