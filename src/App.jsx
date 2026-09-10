import { useState, useEffect } from 'react';
import { 
  ShieldAlert, 
  Activity, 
  Layers, 
  History, 
  Lock,
  Menu,
  X
} from 'lucide-react';
import Dashboard from './components/Dashboard';
import AnalyzeVoice from './components/AnalyzeVoice';
import ThreatAnalysis from './components/ThreatAnalysis';
import IncidentHistory from './components/IncidentHistory';

export default function App() {
  const [activeTab, setActiveTab] = useState('Dashboard');
  const [incidents, setIncidents] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Bridge between Dashboard and History
  const [selectedIncidentFromDashboard, setSelectedIncidentFromDashboard] = useState(null);
  
  // Bridge between Dashboard and Analyze (Pre-loaded Scenario)
  const [activeScenarioId, setActiveScenarioId] = useState('scen_ceo_clone');

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Fetch incidents from backend
  useEffect(() => {
    fetch("/api/incidents")
      .then(res => res.json())
      .then(data => {
        setIncidents(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to load incidents from backend", err);
        setLoading(false);
      });
  }, []);

  // Appends newly analyzed call outputs to backend database dynamically!
  const handleAnalyzeFinished = (newIncident) => {
    fetch("/api/incidents", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newIncident)
    })
      .then(res => res.json())
      .then(savedIncident => {
        setIncidents(prev => [savedIncident, ...prev]);
      })
      .catch(err => {
        console.error("Failed to save incident to backend", err);
        // Fallback to local append
        setIncidents(prev => [newIncident, ...prev]);
      });
  };

  const handleDeleteIncident = (id) => {
    fetch(`/api/incidents/${id}`, {
      method: "DELETE"
    })
      .then(() => {
        setIncidents(prev => prev.filter(inc => inc.id !== id));
      })
      .catch(err => {
        console.error("Failed to delete incident on backend", err);
        setIncidents(prev => prev.filter(inc => inc.id !== id));
      });
  };

  const handleNavigate = (tab) => {
    setActiveTab(tab);
    setMobileMenuOpen(false);
  };

  const handleSelectIncidentFromDashboard = (incident) => {
    setSelectedIncidentFromDashboard(incident);
  };

  const handleClearSelectedIncident = () => {
    setSelectedIncidentFromDashboard(null);
  };

  // Nav items helper
  const navItems = [
    { name: 'Dashboard', icon: Layers },
    { name: 'Analyze Voice', icon: Activity },
    { name: 'Threat Analysis', icon: ShieldAlert },
    { name: 'Incident History', icon: History }
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      
      {/* Top banner / Alert line (Slide 2: SIH 2026 Voice Security Platform) */}
      <div className="bg-slate-900 text-center py-2 px-4 border-b border-slate-800 text-[11px] font-semibold tracking-wider text-slate-300 flex items-center justify-center gap-2">
        <span className="bg-red-950 text-red-400 border border-red-900/40 font-extrabold px-1.5 py-0.5 rounded text-[9px] uppercase tracking-wider">TEAM DHWANI</span>
        SIH 2026 • AI-Powered Voice Impersonation Defense & Threat Detection Platform
      </div>

      {/* Main Header (Slide 1 & Slide 11: Consistent DhwaniAI Header) */}
      <header className="border-b border-slate-900 bg-slate-950/90 backdrop-blur-md sticky top-0 z-50 px-4 md:px-8 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-slate-900 border border-slate-800 rounded-xl shadow-md flex items-center justify-center text-red-500">
              <ShieldAlert className="h-6 w-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-black tracking-tight text-white font-mono">DhwaniAI</h1>
                <span className="px-1.5 py-0.5 bg-slate-900 text-slate-300 border border-slate-800 rounded text-[9px] font-bold font-mono">LIVE CORE</span>
              </div>
              <p className="text-[10px] uppercase tracking-wider font-mono text-slate-500">Real-Time Voice Impersonation Detection & Prevention</p>
            </div>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1.5">
            {navItems.map((item) => {
              const IconComponent = item.icon;
              const isActive = activeTab === item.name;
              return (
                <button
                  key={item.name}
                  id={`nav-tab-${item.name.replace(' ', '')}`}
                  onClick={() => handleNavigate(item.name)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg font-mono font-bold text-xs transition tracking-wider uppercase cursor-pointer border ${
                    isActive 
                      ? 'bg-slate-900 border-slate-700 text-red-400 font-black' 
                      : 'border-transparent text-slate-400 hover:text-white hover:bg-slate-900/40'
                  }`}
                >
                  <IconComponent className={`h-4 w-4 ${isActive ? 'text-red-400' : 'text-slate-500'}`} />
                  {item.name}
                </button>
              );
            })}
          </nav>

          {/* Mobile Nav Button */}
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-slate-400 hover:text-white hover:bg-slate-900 rounded-lg transition"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </header>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-slate-900 bg-slate-950/95 p-4 space-y-2">
          {navItems.map((item) => {
            const IconComponent = item.icon;
            const isActive = activeTab === item.name;
            return (
              <button
                key={item.name}
                onClick={() => handleNavigate(item.name)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm transition text-left cursor-pointer ${
                  isActive 
                    ? 'bg-slate-900 border border-slate-800 text-red-400' 
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <IconComponent className="h-5 w-5" />
                {item.name}
              </button>
            );
          })}
        </div>
      )}

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-8 space-y-6">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 space-y-4">
            <Activity className="h-10 w-10 text-red-500 animate-spin" />
            <p className="text-sm text-slate-400 font-mono uppercase tracking-widest">Synchronizing DhwaniAI Database...</p>
          </div>
        ) : (
          <>
            {/* Render Tab Components dynamically */}
            {activeTab === 'Dashboard' && (
              <Dashboard 
                incidents={incidents} 
                onNavigate={(tab) => {
                  if (tab === 'Analyze Voice') {
                    setActiveScenarioId('scen_ceo_clone'); // default to CEO clone
                  }
                  handleNavigate(tab);
                }} 
                onSelectIncident={handleSelectIncidentFromDashboard}
              />
            )}

            {activeTab === 'Analyze Voice' && (
              <AnalyzeVoice 
                onAnalyzeFinished={handleAnalyzeFinished}
                activeScenarioId={activeScenarioId}
              />
            )}

            {activeTab === 'Threat Analysis' && (
              <ThreatAnalysis />
            )}

            {activeTab === 'Incident History' && (
              <IncidentHistory 
                incidents={incidents}
                onDeleteIncident={handleDeleteIncident}
                selectedIncidentFromDashboard={selectedIncidentFromDashboard}
                onClearSelectedIncident={handleClearSelectedIncident}
              />
            )}
          </>
        )}
      </main>

      {/* Footer (Slide 11: Real-Time Voice Impersonation Detection & Prevention) */}
      <footer className="border-t border-slate-900 py-6 text-center text-xs text-slate-500 bg-slate-950/40 font-mono">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-400">DhwaniAI</span>
            <span>•</span>
            <span className="text-[11px] uppercase tracking-wider text-slate-500">Listen. Verify. Stay Safe.</span>
          </div>
          <p className="text-[11px] leading-relaxed max-w-lg">
            Real-Time Voice Impersonation Detection & Prevention • Voice + Identity + Intent + Context → Risk → Prevention
          </p>
          <div className="flex items-center gap-1 text-[11px] font-semibold text-slate-400">
            <Lock className="h-3 w-3 text-emerald-400" />
            Secure Session Active
          </div>
        </div>
      </footer>

    </div>
  );
}
