import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { BarChart3, Settings, Phone, MessageSquare, Users, Smartphone, Monitor, ArrowLeft } from 'lucide-react';

export function AdminDashboard({ onClose }: { onClose: () => void }) {
  const [stats, setStats] = useState<any>(null);
  const [config, setConfig] = useState({
    phoneNumber: '',
    message: '',
    floatingEnabled: true
  });
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetch('/api/admin/whatsapp/stats')
      .then(res => res.json())
      .then(data => {
        setStats(data.trackingData);
        setConfig(data.config);
      });
  }, []);

  const handleSave = async () => {
    setIsSaving(true);
    await fetch('/api/admin/whatsapp/config', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(config)
    });
    setIsSaving(false);
  };

  if (!stats) return <div className="min-h-screen flex items-center justify-center bg-surface">Loading...</div>;

  const totalClicks = stats.length;
  const mobileClicks = stats.filter((s: any) => s.device === 'mobile').length;
  const desktopClicks = stats.filter((s: any) => s.device === 'desktop').length;

  const sourceCounts = stats.reduce((acc: any, curr: any) => {
    acc[curr.source] = (acc[curr.source] || 0) + 1;
    return acc;
  }, {});

  return (
    <div className="min-h-screen bg-surface-low p-8 font-sans">
      <div className="max-w-6xl mx-auto">
        <button 
          onClick={onClose}
          className="flex items-center gap-2 text-navy/60 hover:text-navy mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Website
        </button>

        <div className="flex items-center justify-between mb-12">
          <div>
            <h1 className="text-3xl font-display font-bold text-navy tracking-tight">WhatsApp Analytics</h1>
            <p className="text-navy/60 mt-2">Track conversions and manage your communication engine.</p>
          </div>
          <div className="flex items-center gap-3 bg-white px-4 py-2 rounded-full shadow-sm border border-navy/5">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-whatsapp opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-whatsapp"></span>
            </span>
            <span className="text-sm font-medium text-navy">System Active</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Analytics Overview */}
          <div className="lg:col-span-2 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-navy/5">
                <div className="flex items-center gap-3 text-navy/60 mb-4">
                  <BarChart3 className="w-5 h-5 text-gold" />
                  <span className="font-medium">Total Clicks</span>
                </div>
                <div className="text-4xl font-display font-bold text-navy">{totalClicks}</div>
              </div>
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-navy/5">
                <div className="flex items-center gap-3 text-navy/60 mb-4">
                  <Smartphone className="w-5 h-5 text-navy" />
                  <span className="font-medium">Mobile</span>
                </div>
                <div className="text-4xl font-display font-bold text-navy">{mobileClicks}</div>
              </div>
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-navy/5">
                <div className="flex items-center gap-3 text-navy/60 mb-4">
                  <Monitor className="w-5 h-5 text-navy" />
                  <span className="font-medium">Desktop</span>
                </div>
                <div className="text-4xl font-display font-bold text-navy">{desktopClicks}</div>
              </div>
            </div>

            <div className="bg-white p-8 rounded-3xl shadow-sm border border-navy/5">
              <h3 className="text-xl font-display font-bold text-navy mb-6">Click Sources</h3>
              <div className="space-y-4">
                {Object.entries(sourceCounts).map(([source, count]: [string, any]) => (
                  <div key={source} className="flex items-center justify-between p-4 bg-surface rounded-xl">
                    <span className="font-medium text-navy capitalize">{source.replace('_', ' ')}</span>
                    <div className="flex items-center gap-4">
                      <div className="w-48 h-2 bg-navy/5 rounded-full overflow-hidden">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${(count / totalClicks) * 100}%` }}
                          className="h-full bg-gold"
                        />
                      </div>
                      <span className="font-bold text-navy w-8 text-right">{count}</span>
                    </div>
                  </div>
                ))}
                {Object.keys(sourceCounts).length === 0 && (
                  <div className="text-center py-8 text-navy/40">No clicks recorded yet.</div>
                )}
              </div>
            </div>
          </div>

          {/* Configuration */}
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-navy/5 h-fit">
            <div className="flex items-center gap-3 mb-8">
              <Settings className="w-6 h-6 text-navy" />
              <h3 className="text-xl font-display font-bold text-navy">Configuration</h3>
            </div>

            <div className="space-y-6">
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-navy mb-2">
                  <Phone className="w-4 h-4 text-navy/60" /> WhatsApp Number
                </label>
                <input 
                  type="text" 
                  value={config.phoneNumber}
                  onChange={e => setConfig({...config, phoneNumber: e.target.value})}
                  className="w-full bg-surface border border-navy/10 rounded-xl px-4 py-3 text-navy focus:outline-none focus:border-gold transition-colors"
                />
              </div>

              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-navy mb-2">
                  <MessageSquare className="w-4 h-4 text-navy/60" /> Pre-filled Message
                </label>
                <textarea 
                  value={config.message}
                  onChange={e => setConfig({...config, message: e.target.value})}
                  rows={4}
                  className="w-full bg-surface border border-navy/10 rounded-xl px-4 py-3 text-navy focus:outline-none focus:border-gold transition-colors resize-none"
                />
              </div>

              <div className="flex items-center justify-between p-4 bg-surface rounded-xl">
                <span className="font-medium text-navy">Enable Floating Button</span>
                <button 
                  onClick={() => setConfig({...config, floatingEnabled: !config.floatingEnabled})}
                  className={`w-12 h-6 rounded-full transition-colors relative ${config.floatingEnabled ? 'bg-whatsapp' : 'bg-navy/20'}`}
                >
                  <motion.div 
                    animate={{ x: config.floatingEnabled ? 24 : 2 }}
                    className="w-5 h-5 bg-white rounded-full absolute top-0.5 shadow-sm"
                  />
                </button>
              </div>

              <button 
                onClick={handleSave}
                disabled={isSaving}
                className="w-full bg-navy text-white font-bold py-4 rounded-xl hover:bg-navy/90 transition-colors disabled:opacity-50"
              >
                {isSaving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
