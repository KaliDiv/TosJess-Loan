import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { BarChart3, Settings, Phone, MessageSquare, Smartphone, Monitor, ArrowLeft, Download, Activity, Clock } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

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
        // Sort stats by timestamp descending
        const sortedStats = (data.trackingData || []).sort((a: any, b: any) => b.timestamp - a.timestamp);
        setStats(sortedStats);
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

  const exportToCSV = () => {
    if (!stats || stats.length === 0) return;
    const headers = ['Date', 'Time', 'Source', 'Device'];
    const csvContent = [
      headers.join(','),
      ...stats.map((s: any) => {
        const d = new Date(s.timestamp);
        return `${d.toLocaleDateString()},${d.toLocaleTimeString()},${s.source},${s.device}`;
      })
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `whatsapp_analytics_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (!stats) return <div className="min-h-screen flex items-center justify-center bg-surface">Loading Dashboard...</div>;

  const totalClicks = stats.length;
  const mobileClicks = stats.filter((s: any) => s.device === 'mobile').length;
  const desktopClicks = stats.filter((s: any) => s.device === 'desktop').length;

  const sourceCounts = stats.reduce((acc: any, curr: any) => {
    acc[curr.source] = (acc[curr.source] || 0) + 1;
    return acc;
  }, {});

  const chartData = Object.keys(sourceCounts).map(key => ({
    name: key.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase()),
    clicks: sourceCounts[key]
  })).sort((a, b) => b.clicks - a.clicks);

  return (
    <div className="min-h-screen bg-surface-low p-4 md:p-8 font-sans">
      <div className="max-w-7xl mx-auto">
        <button 
          onClick={onClose}
          className="flex items-center gap-2 text-navy/60 hover:text-navy mb-6 md:mb-8 transition-colors font-medium"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Website
        </button>

        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 md:mb-12 gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-display font-black text-navy tracking-tight">WhatsApp Analytics</h1>
            <p className="text-navy/60 mt-2 text-lg">Track conversions and manage your communication engine.</p>
          </div>
          <div className="flex items-center gap-4">
            <button 
              onClick={exportToCSV}
              className="flex items-center gap-2 bg-white text-navy px-4 py-2 rounded-full shadow-sm border border-navy/5 hover:bg-surface transition-colors font-medium text-sm"
            >
              <Download className="w-4 h-4" /> Export CSV
            </button>
            <div className="flex items-center gap-3 bg-white px-4 py-2 rounded-full shadow-sm border border-navy/5">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-whatsapp opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-whatsapp"></span>
              </span>
              <span className="text-sm font-medium text-navy">System Active</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
          {/* Analytics Overview */}
          <div className="lg:col-span-2 space-y-6 md:space-y-8">
            {/* KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6">
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-navy/5 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-gold/5 rounded-full blur-xl -mr-10 -mt-10"></div>
                <div className="flex items-center gap-3 text-navy/60 mb-4">
                  <BarChart3 className="w-5 h-5 text-gold" />
                  <span className="font-medium">Total Clicks</span>
                </div>
                <div className="text-4xl md:text-5xl font-display font-black text-navy">{totalClicks}</div>
              </div>
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-navy/5 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-navy/5 rounded-full blur-xl -mr-10 -mt-10"></div>
                <div className="flex items-center gap-3 text-navy/60 mb-4">
                  <Smartphone className="w-5 h-5 text-navy" />
                  <span className="font-medium">Mobile</span>
                </div>
                <div className="text-4xl md:text-5xl font-display font-black text-navy">{mobileClicks}</div>
              </div>
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-navy/5 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-navy/5 rounded-full blur-xl -mr-10 -mt-10"></div>
                <div className="flex items-center gap-3 text-navy/60 mb-4">
                  <Monitor className="w-5 h-5 text-navy" />
                  <span className="font-medium">Desktop</span>
                </div>
                <div className="text-4xl md:text-5xl font-display font-black text-navy">{desktopClicks}</div>
              </div>
            </div>

            {/* Charts & Tables Grid */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 md:gap-8">
              {/* Source Chart */}
              <div className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-navy/5">
                <div className="flex items-center gap-3 mb-6">
                  <Activity className="w-5 h-5 text-gold" />
                  <h3 className="text-xl font-display font-bold text-navy">Click Sources</h3>
                </div>
                {chartData.length > 0 ? (
                  <div className="h-64 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={chartData} layout="vertical" margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                        <XAxis type="number" hide />
                        <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fill: '#0B1C39', fontSize: 12, fontWeight: 500 }} width={100} />
                        <Tooltip 
                          cursor={{ fill: '#F2F4F6' }}
                          contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}
                        />
                        <Bar dataKey="clicks" radius={[0, 4, 4, 0]} barSize={24}>
                          {chartData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={index === 0 ? '#D4AF37' : '#0B1C39'} fillOpacity={index === 0 ? 1 : 0.8} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                ) : (
                  <div className="h-64 flex items-center justify-center text-navy/40 bg-surface rounded-xl border border-dashed border-navy/10">
                    No data available yet
                  </div>
                )}
              </div>

              {/* Recent Activity */}
              <div className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-navy/5 flex flex-col">
                <div className="flex items-center gap-3 mb-6">
                  <Clock className="w-5 h-5 text-navy" />
                  <h3 className="text-xl font-display font-bold text-navy">Recent Activity</h3>
                </div>
                <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar" style={{ maxHeight: '256px' }}>
                  {stats.length > 0 ? (
                    <div className="space-y-4">
                      {stats.slice(0, 10).map((stat: any, i: number) => (
                        <div key={i} className="flex items-center justify-between p-3 bg-surface rounded-xl border border-navy/5">
                          <div>
                            <p className="font-bold text-navy text-sm capitalize">{stat.source.replace('_', ' ')}</p>
                            <p className="text-xs text-navy/50 mt-0.5">
                              {new Date(stat.timestamp).toLocaleDateString()} at {new Date(stat.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                            </p>
                          </div>
                          <div className="bg-white p-2 rounded-lg shadow-sm">
                            {stat.device === 'mobile' ? <Smartphone className="w-4 h-4 text-navy/60" /> : <Monitor className="w-4 h-4 text-navy/60" />}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="h-full flex items-center justify-center text-navy/40 bg-surface rounded-xl border border-dashed border-navy/10">
                      No recent activity
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Configuration */}
          <div className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-navy/5 h-fit sticky top-8">
            <div className="flex items-center gap-3 mb-8">
              <Settings className="w-6 h-6 text-navy" />
              <h3 className="text-xl font-display font-bold text-navy">Configuration</h3>
            </div>

            <div className="space-y-6">
              <div>
                <label className="flex items-center gap-2 text-sm font-bold text-navy mb-2">
                  <Phone className="w-4 h-4 text-navy/60" /> WhatsApp Number
                </label>
                <input 
                  type="text" 
                  value={config.phoneNumber}
                  onChange={e => setConfig({...config, phoneNumber: e.target.value})}
                  className="w-full bg-surface border border-navy/10 rounded-xl px-4 py-3 text-navy focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold transition-all"
                  placeholder="+2348000000000"
                />
              </div>

              <div>
                <label className="flex items-center gap-2 text-sm font-bold text-navy mb-2">
                  <MessageSquare className="w-4 h-4 text-navy/60" /> Pre-filled Message
                </label>
                <textarea 
                  value={config.message}
                  onChange={e => setConfig({...config, message: e.target.value})}
                  rows={4}
                  className="w-full bg-surface border border-navy/10 rounded-xl px-4 py-3 text-navy focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold transition-all resize-none"
                  placeholder="Enter default message..."
                />
              </div>

              <div className="flex items-center justify-between p-4 bg-surface rounded-xl border border-navy/5">
                <span className="font-bold text-navy text-sm">Enable Floating Button</span>
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
                className="w-full bg-navy text-white font-bold py-4 rounded-xl hover:bg-navy/90 transition-all disabled:opacity-50 shadow-lg shadow-navy/10 active:scale-[0.98]"
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
