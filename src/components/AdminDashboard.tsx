import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { BarChart3, Settings, Phone, MessageSquare, Smartphone, Monitor, ArrowLeft, Download, Activity, Clock, Trash2, TrendingUp, Zap } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, PieChart, Pie } from 'recharts';

export function AdminDashboard({ onClose }: { onClose: () => void }) {
  const [stats, setStats] = useState<any>(null);
  const [config, setConfig] = useState({
    phoneNumber: '',
    message: '',
    floatingEnabled: true
  });
  const [isSaving, setIsSaving] = useState(false);
  const [isClearing, setIsClearing] = useState(false);

  const fetchData = () => {
    fetch('/api/admin/whatsapp/stats')
      .then(res => res.json())
      .then(data => {
        const sortedStats = (data.trackingData || []).sort((a: any, b: any) => b.timestamp - a.timestamp);
        setStats(sortedStats);
        setConfig(data.config);
      });
  };

  useEffect(() => {
    fetchData();
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

  const handleClearLogs = async () => {
    if (!confirm('Are you sure you want to clear all tracking logs? This action cannot be undone.')) return;
    setIsClearing(true);
    await fetch('/api/admin/whatsapp/clear', { method: 'POST' });
    setStats([]);
    setIsClearing(false);
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

  // Peak Hour Analysis
  const hourCounts = stats.reduce((acc: any, curr: any) => {
    const hour = new Date(curr.timestamp).getHours();
    acc[hour] = (acc[hour] || 0) + 1;
    return acc;
  }, {});
  
  const peakHour = Object.entries(hourCounts).sort((a: any, b: any) => b[1] - a[1])[0];
  const peakHourLabel = peakHour ? `${peakHour[0]}:00` : 'N/A';

  const sourceCounts = stats.reduce((acc: any, curr: any) => {
    acc[curr.source] = (acc[curr.source] || 0) + 1;
    return acc;
  }, {});

  const chartData = Object.keys(sourceCounts).map(key => ({
    name: key.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase()),
    clicks: sourceCounts[key]
  })).sort((a, b) => b.clicks - a.clicks);

  const deviceData = [
    { name: 'Mobile', value: mobileClicks, color: '#D4AF37' },
    { name: 'Desktop', value: desktopClicks, color: '#0B1C39' }
  ].filter(d => d.value > 0);

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
            <h1 className="text-3xl md:text-4xl font-display font-black text-navy tracking-tight">WhatsApp Command Center</h1>
            <p className="text-navy/60 mt-2 text-lg">Real-time conversion intelligence and system control.</p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <button 
              onClick={exportToCSV}
              className="flex items-center gap-2 bg-white text-navy px-4 py-2.5 rounded-full shadow-sm border border-navy/5 hover:bg-surface transition-colors font-bold text-sm"
            >
              <Download className="w-4 h-4" /> Export CSV
            </button>
            <button 
              onClick={handleClearLogs}
              disabled={isClearing || totalClicks === 0}
              className="flex items-center gap-2 bg-white text-red-500 px-4 py-2.5 rounded-full shadow-sm border border-red-100 hover:bg-red-50 transition-colors font-bold text-sm disabled:opacity-50"
            >
              <Trash2 className="w-4 h-4" /> Clear Logs
            </button>
            <div className="flex items-center gap-3 bg-white px-4 py-2.5 rounded-full shadow-sm border border-navy/5">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-whatsapp opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-whatsapp"></span>
              </span>
              <span className="text-sm font-bold text-navy">System Active</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
          {/* Analytics Overview */}
          <div className="lg:col-span-2 space-y-6 md:space-y-8">
            {/* KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 md:gap-6">
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-navy/5 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-gold/5 rounded-full blur-xl -mr-10 -mt-10"></div>
                <div className="flex items-center gap-3 text-navy/60 mb-4">
                  <BarChart3 className="w-5 h-5 text-gold" />
                  <span className="font-bold text-xs uppercase tracking-widest">Total Clicks</span>
                </div>
                <div className="text-4xl font-display font-black text-navy">{totalClicks}</div>
              </div>
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-navy/5 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-navy/5 rounded-full blur-xl -mr-10 -mt-10"></div>
                <div className="flex items-center gap-3 text-navy/60 mb-4">
                  <Zap className="w-5 h-5 text-navy" />
                  <span className="font-bold text-xs uppercase tracking-widest">Peak Hour</span>
                </div>
                <div className="text-4xl font-display font-black text-navy">{peakHourLabel}</div>
              </div>
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-navy/5 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-navy/5 rounded-full blur-xl -mr-10 -mt-10"></div>
                <div className="flex items-center gap-3 text-navy/60 mb-4">
                  <Smartphone className="w-5 h-5 text-navy" />
                  <span className="font-bold text-xs uppercase tracking-widest">Mobile</span>
                </div>
                <div className="text-4xl font-display font-black text-navy">{mobileClicks}</div>
              </div>
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-navy/5 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-navy/5 rounded-full blur-xl -mr-10 -mt-10"></div>
                <div className="flex items-center gap-3 text-navy/60 mb-4">
                  <Monitor className="w-5 h-5 text-navy" />
                  <span className="font-bold text-xs uppercase tracking-widest">Desktop</span>
                </div>
                <div className="text-4xl font-display font-black text-navy">{desktopClicks}</div>
              </div>
            </div>

            {/* Charts & Tables Grid */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 md:gap-8">
              {/* Source Chart */}
              <div className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-navy/5">
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-3">
                    <Activity className="w-5 h-5 text-gold" />
                    <h3 className="text-xl font-display font-bold text-navy">Click Sources</h3>
                  </div>
                </div>
                {chartData.length > 0 ? (
                  <div className="h-64 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={chartData} layout="vertical" margin={{ top: 0, right: 20, left: 0, bottom: 0 }}>
                        <XAxis type="number" hide />
                        <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fill: '#0B1C39', fontSize: 12, fontWeight: 700 }} width={100} />
                        <Tooltip 
                          cursor={{ fill: '#F2F4F6' }}
                          contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 30px rgba(0,0,0,0.1)', padding: '12px' }}
                        />
                        <Bar dataKey="clicks" radius={[0, 8, 8, 0]} barSize={32}>
                          {chartData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={index === 0 ? '#D4AF37' : '#0B1C39'} fillOpacity={index === 0 ? 1 : 0.8} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                ) : (
                  <div className="h-64 flex items-center justify-center text-navy/40 bg-surface rounded-2xl border border-dashed border-navy/10">
                    No data available yet
                  </div>
                )}
              </div>

              {/* Device Distribution */}
              <div className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-navy/5">
                <div className="flex items-center gap-3 mb-8">
                  <TrendingUp className="w-5 h-5 text-navy" />
                  <h3 className="text-xl font-display font-bold text-navy">Device Distribution</h3>
                </div>
                {deviceData.length > 0 ? (
                  <div className="h-64 w-full flex items-center justify-center">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={deviceData}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={80}
                          paddingAngle={8}
                          dataKey="value"
                        >
                          {deviceData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip 
                          contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                    <div className="absolute flex flex-col items-center">
                      <span className="text-xs font-bold text-navy/40 uppercase">Mobile</span>
                      <span className="text-2xl font-display font-black text-navy">{Math.round((mobileClicks / totalClicks) * 100)}%</span>
                    </div>
                  </div>
                ) : (
                  <div className="h-64 flex items-center justify-center text-navy/40 bg-surface rounded-2xl border border-dashed border-navy/10">
                    No data available yet
                  </div>
                )}
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-navy/5">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                  <Clock className="w-5 h-5 text-navy" />
                  <h3 className="text-xl font-display font-bold text-navy">Live Activity Stream</h3>
                </div>
                <span className="text-xs font-bold text-navy/40 uppercase">Last 20 Events</span>
              </div>
              <div className="overflow-y-auto pr-2 custom-scrollbar" style={{ maxHeight: '400px' }}>
                {stats.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {stats.slice(0, 20).map((stat: any, i: number) => (
                      <motion.div 
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.05 }}
                        key={i} 
                        className="flex items-center justify-between p-4 bg-surface rounded-2xl border border-navy/5 hover:border-gold/30 transition-all group"
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm group-hover:bg-gold/5 transition-colors">
                            {stat.device === 'mobile' ? <Smartphone className="w-5 h-5 text-navy/60" /> : <Monitor className="w-5 h-5 text-navy/60" />}
                          </div>
                          <div>
                            <p className="font-bold text-navy text-sm capitalize">{stat.source.replace('_', ' ')}</p>
                            <p className="text-[10px] font-bold text-navy/40 uppercase mt-0.5">
                              {new Date(stat.timestamp).toLocaleDateString()} • {new Date(stat.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                            </p>
                          </div>
                        </div>
                        <div className="bg-whatsapp/10 text-whatsapp text-[10px] font-black px-2 py-1 rounded-md uppercase">
                          Click
                        </div>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="py-20 flex flex-col items-center justify-center text-navy/40 bg-surface rounded-2xl border border-dashed border-navy/10">
                    <Activity className="w-12 h-12 mb-4 opacity-20" />
                    <p className="font-bold">Waiting for incoming traffic...</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Configuration */}
          <div className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-navy/5 h-fit lg:sticky lg:top-8">
            <div className="flex items-center gap-3 mb-8">
              <Settings className="w-6 h-6 text-navy" />
              <h3 className="text-xl font-display font-bold text-navy">System Configuration</h3>
            </div>

            <div className="space-y-6">
              <div className="bg-surface p-6 rounded-2xl border border-navy/5">
                <label className="flex items-center gap-2 text-xs font-black text-navy/40 uppercase tracking-widest mb-4">
                  <Phone className="w-3 h-3" /> WhatsApp Number
                </label>
                <input 
                  type="text" 
                  value={config.phoneNumber}
                  onChange={e => setConfig({...config, phoneNumber: e.target.value})}
                  className="w-full bg-white border border-navy/10 rounded-xl px-4 py-3 text-navy font-bold focus:outline-none focus:border-gold focus:ring-2 focus:ring-gold/20 transition-all"
                  placeholder="+2348000000000"
                />
              </div>

              <div className="bg-surface p-6 rounded-2xl border border-navy/5">
                <label className="flex items-center gap-2 text-xs font-black text-navy/40 uppercase tracking-widest mb-4">
                  <MessageSquare className="w-3 h-3" /> Default Message
                </label>
                <textarea 
                  value={config.message}
                  onChange={e => setConfig({...config, message: e.target.value})}
                  rows={4}
                  className="w-full bg-white border border-navy/10 rounded-xl px-4 py-3 text-navy font-medium focus:outline-none focus:border-gold focus:ring-2 focus:ring-gold/20 transition-all resize-none"
                  placeholder="Enter default message..."
                />
              </div>

              <div className="flex items-center justify-between p-6 bg-surface rounded-2xl border border-navy/5">
                <div>
                  <span className="block font-bold text-navy text-sm">Floating Widget</span>
                  <span className="text-[10px] text-navy/40 font-bold uppercase">Toggle visibility</span>
                </div>
                <button 
                  onClick={() => setConfig({...config, floatingEnabled: !config.floatingEnabled})}
                  className={`w-14 h-7 rounded-full transition-all relative ${config.floatingEnabled ? 'bg-whatsapp shadow-lg shadow-whatsapp/20' : 'bg-navy/20'}`}
                >
                  <motion.div 
                    animate={{ x: config.floatingEnabled ? 30 : 4 }}
                    className="w-5 h-5 bg-white rounded-full absolute top-1 shadow-sm"
                  />
                </button>
              </div>

              <button 
                onClick={handleSave}
                disabled={isSaving}
                className="w-full bg-navy text-white font-black text-sm uppercase tracking-widest py-5 rounded-2xl hover:bg-navy/90 transition-all disabled:opacity-50 shadow-xl shadow-navy/20 active:scale-[0.98]"
              >
                {isSaving ? 'Updating System...' : 'Apply Changes'}
              </button>
            </div>
            
            <div className="mt-10 p-6 bg-gold/5 rounded-2xl border border-gold/10">
              <h4 className="text-xs font-black text-gold uppercase tracking-widest mb-2">Pro Tip</h4>
              <p className="text-xs text-navy/60 leading-relaxed">Pre-filled messages with specific context (like the loan calculator results) significantly increase conversion rates.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
