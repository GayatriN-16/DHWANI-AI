import { useState } from 'react';
import { 
  ShieldAlert, 
  PhoneCall, 
  TrendingUp, 
  Activity, 
  ArrowRight
} from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, BarChart, Bar, Cell } from 'recharts';

const callTrendData = [
  { day: 'Mon', total: 42, scam: 3 },
  { day: 'Tue', total: 55, scam: 5 },
  { day: 'Wed', total: 68, scam: 8 },
  { day: 'Thu', total: 49, scam: 4 },
  { day: 'Fri', total: 74, scam: 11 },
  { day: 'Sat', total: 85, scam: 15 },
  { day: 'Sun', total: 92, scam: 18 },
];

const threatTypeData = [
  { name: 'AI Voice Clones', value: 38, color: '#f43f5e' },
  { name: 'Vishing (Human)', value: 27, color: '#f59e0b' },
  { name: 'Bank Phishing', value: 20, color: '#3b82f6' },
  { name: 'Delivery Scams', value: 15, color: '#a855f7' },
];

export default function Dashboard({ incidents, onNavigate, onSelectIncident }) {
  const [searchTerm, setSearchTerm] = useState('');

  // Stats calculation
  const callsAnalyzed = incidents.length + 154; 
  const threatsDetected = incidents.filter(i => i.threatLevel === 'HIGH' || i.threatLevel === 'CRITICAL').length + 18;
  const highRiskCalls = incidents.filter(i => i.threatLevel === 'HIGH').length + 12;
  const criticalThreats = incidents.filter(i => i.threatLevel === 'CRITICAL').length + 6;

  const filteredIncidents = incidents.filter(incident => 
    incident.callerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    incident.callerNumber.includes(searchTerm) ||
    incident.threatType.toLowerCase().includes(searchTerm.toLowerCase())
  ).slice(0, 4);

  return (
    <div className="space-y-6">
      {/* Top Welcome / Action Panel */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 p-6 bg-slate-900 border border-slate-800 rounded-2xl shadow-xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="flex h-3 w-3 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
            </span>
            <span className="text-xs font-semibold uppercase tracking-wider text-emerald-400">Threat Engine Active</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-white">DhwaniAI Dashboard</h1>
          <p className="text-sm text-slate-400">
            SIH 2026 • AI-Powered Real-time Voice Impersonation Prevention and Vulnerability Evaluation.
          </p>
        </div>
        <button
          id="btn-goto-analyze"
          onClick={() => onNavigate('Analyze Voice')}
          className="inline-flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-850 text-red-400 border border-red-900/40 font-mono font-bold uppercase tracking-wider py-3.5 px-6 rounded-xl transition duration-200 cursor-pointer shadow-md text-xs whitespace-nowrap self-start md:self-auto"
        >
          <Activity className="h-4 w-4 animate-pulse text-red-500" />
          Analyze Live Call
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>

      {/* Grid Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Calls Analyzed */}
        <div className="p-5 bg-slate-900/60 border border-slate-800/80 rounded-xl flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">Calls Analyzed</p>
            <p className="text-3xl font-black text-white">{callsAnalyzed}</p>
            <div className="flex items-center gap-1 text-xs text-emerald-400 mt-1 font-mono">
              <TrendingUp className="h-3 w-3 inline" />
              <span>Real-time Streams</span>
            </div>
          </div>
          <div className="p-3 bg-slate-800/80 rounded-lg text-blue-400">
            <PhoneCall className="h-6 w-6" />
          </div>
        </div>

        {/* Threats Detected */}
        <div className="p-5 bg-slate-900/60 border border-slate-800/80 rounded-xl flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">Threats Detected</p>
            <p className="text-3xl font-black text-rose-500">{threatsDetected}</p>
            <div className="flex items-center gap-1 text-xs text-rose-400 mt-1 font-mono">
              <span className="h-1.5 w-1.5 rounded-full bg-rose-500 animate-pulse" />
              <span>Shield Active</span>
            </div>
          </div>
          <div className="p-3 bg-slate-800/80 rounded-lg text-rose-400">
            <ShieldAlert className="h-6 w-6 animate-pulse" />
          </div>
        </div>

        {/* High-Risk Calls */}
        <div className="p-5 bg-slate-900/60 border border-slate-800/80 rounded-xl flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">High-Risk Calls</p>
            <p className="text-3xl font-black text-amber-500">{highRiskCalls}</p>
            <div className="flex items-center gap-1 text-xs text-amber-400 mt-1 font-mono">
              <span>Biometrics Warning</span>
            </div>
          </div>
          <div className="p-3 bg-slate-800/80 rounded-lg text-amber-400">
            <ShieldAlert className="h-6 w-6" />
          </div>
        </div>

        {/* Critical Threats */}
        <div className="p-5 bg-slate-900/60 border border-slate-800/80 rounded-xl flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">Critical Threats</p>
            <p className="text-3xl font-black text-red-500">{criticalThreats}</p>
            <div className="flex items-center gap-1 text-xs text-red-400 mt-1 font-mono">
              <span>Automatic Termination</span>
            </div>
          </div>
          <div className="p-3 bg-slate-800/80 rounded-lg text-red-500">
            <ShieldAlert className="h-6 w-6" />
          </div>
        </div>
      </div>

      {/* Analytics Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Weekly Trend (2/3 width) */}
        <div className="lg:col-span-2 p-5 bg-slate-900/40 border border-slate-800/80 rounded-xl space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <h2 className="text-sm font-bold text-white uppercase tracking-wider">Weekly Stream Ingestion Volume</h2>
              <p className="text-[10px] text-slate-500">Real-time incoming calls compared against flagged synthetic attempts.</p>
            </div>
            <span className="text-[10px] bg-slate-950 border border-slate-800 text-slate-400 px-2 py-1 rounded font-mono uppercase">
              Sensor Node Ingestion
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={callTrendData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                <defs>
                  <linearGradient id="totalColor" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="scamColor" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#f43f5e" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="day" stroke="#64748b" fontSize={10} tickLine={false} />
                <YAxis stroke="#64748b" fontSize={10} tickLine={false} />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', color: '#fff', fontSize: '11px' }} />
                <Area type="monotone" dataKey="total" stroke="#3b82f6" strokeWidth={2} fillOpacity={1} fill="url(#totalColor)" name="Total Clean Streams" />
                <Area type="monotone" dataKey="scam" stroke="#f43f5e" strokeWidth={2} fillOpacity={1} fill="url(#scamColor)" name="Flagged Impersonations" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Threat Distribution (1/3 width) */}
        <div className="lg:col-span-1 p-5 bg-slate-900/40 border border-slate-800/80 rounded-xl space-y-4">
          <div className="space-y-0.5">
            <h2 className="text-sm font-bold text-white uppercase tracking-wider">Classification Profiles</h2>
            <p className="text-[10px] text-slate-500">Distribution ratio of flagged malicious tactics.</p>
          </div>

          <div className="h-44 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={threatTypeData} layout="vertical" margin={{ top: 0, right: 10, left: -10, bottom: 0 }}>
                <XAxis type="number" stroke="#64748b" fontSize={9} tickLine={false} hide />
                <YAxis dataKey="name" type="category" stroke="#94a3b8" fontSize={9} width={90} tickLine={false} />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', color: '#fff', fontSize: '10px' }} />
                <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={12}>
                  {threatTypeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="space-y-1.5 pt-2 border-t border-slate-800/60">
            {threatTypeData.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between text-[11px] text-slate-400 font-sans">
                <span className="flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: item.color }} />
                  {item.name}
                </span>
                <span className="font-mono text-white font-bold">{item.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Live Active Feed Block */}
      <div className="p-5 bg-slate-900/40 border border-slate-800/80 rounded-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
          <div className="space-y-0.5">
            <h2 className="text-sm font-bold text-white uppercase tracking-wider">Recent Threats</h2>
            <p className="text-[10px] text-slate-500 font-mono">Live dynamic ledger synced with DhwaniAI Database.</p>
          </div>
          <span className="text-[10px] bg-slate-950 border border-slate-800 text-slate-400 px-2.5 py-1 rounded font-mono uppercase tracking-widest">
            Ledger Output
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 font-medium">
                <th className="py-2 px-4">Caller / Phone</th>
                <th className="py-2 px-4">Category</th>
                <th className="py-2 px-4">Risk Level</th>
                <th className="py-2 px-4 text-center">Threat Rating</th>
                <th className="py-2 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50">
              {filteredIncidents.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-6 text-center text-slate-500">
                    No stream records verified. Ingest a live call to populate the ledger.
                  </td>
                </tr>
              ) : (
                filteredIncidents.map((incident, i) => (
                  <tr key={i} className="hover:bg-slate-900/20 transition-colors">
                    <td className="py-3 px-4">
                      <div className="font-bold text-slate-200">{incident.callerName}</div>
                      <div className="text-[10px] text-slate-500 font-mono">{incident.callerNumber}</div>
                    </td>
                    <td className="py-3 px-4 text-slate-400">{incident.threatType}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-0.5 rounded text-[9px] font-bold border ${
                        incident.threatLevel === 'CRITICAL' ? 'bg-red-950/40 text-red-400 border-red-900/40' :
                        incident.threatLevel === 'HIGH' ? 'bg-amber-950/40 text-amber-400 border-amber-900/40' :
                        'bg-emerald-950/40 text-emerald-400 border-emerald-900/40'
                      }`}>
                        {incident.threatLevel}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center font-bold text-sm font-mono text-slate-200">
                      {incident.riskScore}/100
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => {
                          onSelectIncident(incident);
                          onNavigate('Incident History');
                        }}
                        className="p-1 px-2.5 bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 hover:border-slate-600 rounded text-[10px] font-semibold tracking-wide transition cursor-pointer"
                      >
                        Inspect Details
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Dynamic Demo Output Disclaimer */}
      <div className="p-4 bg-slate-950/60 border border-slate-900 rounded-xl text-center text-[11px] font-mono text-slate-500 leading-normal">
        <span className="text-rose-500 font-bold uppercase mr-1">Demo Evaluation Mode:</span>
        All displayed risk scores, biometric levels, and synthetic flags are simulated real-time outputs generated to evaluate the pipeline structure under varying adversarial conditions.
      </div>

      {/* Problem Statement Details Footer Info Card */}
      <div className="p-5 bg-slate-900 border border-slate-800 rounded-xl grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
        <div className="flex gap-3 items-center md:col-span-2">
          <div className="p-2.5 bg-slate-950 border border-slate-800 rounded-lg text-red-500">
            <ShieldAlert className="h-6 w-6" />
          </div>
          <div>
            <h3 className="font-bold text-white text-sm font-mono uppercase tracking-wider">SIH Target: SIH26104 Defense Suite</h3>
            <p className="text-xs text-slate-400 mt-1 leading-relaxed">
              Real-time recognition of adversarial deepfake audio vectors and linguistic coercion protocols designed to mimic trusted personnel or execute malicious transfers.
            </p>
          </div>
        </div>
        <div className="flex gap-2 justify-end font-mono">
          <div className="p-3 bg-slate-900/80 border border-slate-800 rounded-lg flex flex-col items-center justify-center min-w-[100px]">
            <span className="text-[10px] text-slate-500 uppercase tracking-widest">NODE ID</span>
            <span className="text-xs font-bold text-emerald-400 mt-0.5">DHWANI-AI-01</span>
          </div>
          <div className="p-3 bg-slate-900/80 border border-slate-800 rounded-lg flex flex-col items-center justify-center min-w-[100px]">
            <span className="text-[10px] text-slate-500 uppercase tracking-widest">LATENCY</span>
            <span className="text-xs font-bold text-sky-400 mt-0.5">140ms</span>
          </div>
        </div>
      </div>
    </div>
  );
}
