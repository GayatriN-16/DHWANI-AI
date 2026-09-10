import { useState, useEffect } from 'react';
import { 
  Search, 
  Filter, 
  FileText,
  Trash2,
  ChevronRight,
  Info
} from 'lucide-react';

export default function IncidentHistory({ 
  incidents, 
  onDeleteIncident, 
  selectedIncidentFromDashboard,
  onClearSelectedIncident
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLevel, setSelectedLevel] = useState('ALL');
  const [selectedStatus, setSelectedStatus] = useState('ALL');
  const [selectedIncident, setSelectedIncident] = useState(null);

  // Sync selection if clicked from dashboard
  useEffect(() => {
    if (selectedIncidentFromDashboard) {
      setSelectedIncident(selectedIncidentFromDashboard);
      if (onClearSelectedIncident) {
        onClearSelectedIncident();
      }
    } else if (incidents.length > 0 && !selectedIncident) {
      setSelectedIncident(incidents[0]);
    }
  }, [selectedIncidentFromDashboard, incidents]);

  // Filters
  const filteredIncidents = incidents.filter(incident => {
    const matchesSearch = 
      incident.callerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      incident.callerNumber.includes(searchTerm) ||
      incident.threatType.toLowerCase().includes(searchTerm.toLowerCase()) ||
      incident.transcript.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesLevel = selectedLevel === 'ALL' || incident.threatLevel === selectedLevel;
    const matchesStatus = selectedStatus === 'ALL' || incident.status === selectedStatus;

    return matchesSearch && matchesLevel && matchesStatus;
  });

  const getThreatColor = (level) => {
    switch (level) {
      case 'CRITICAL': return 'bg-red-950/40 text-red-400 border-red-900/40';
      case 'HIGH': return 'bg-amber-950/40 text-amber-400 border-amber-900/40';
      case 'MEDIUM': return 'bg-sky-950/40 text-sky-400 border-sky-900/40';
      case 'LOW': return 'bg-emerald-950/40 text-emerald-400 border-emerald-900/40';
      default: return 'bg-slate-900 text-slate-400 border-slate-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Top filter bar */}
      <div className="p-5 bg-slate-900 border border-slate-800 rounded-2xl shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-xl font-bold text-white">Threat Incident Registry</h1>
          <p className="text-xs text-slate-400">Review historic threats, actions taken, and signal-fusion audits.</p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
            <input
              type="text"
              placeholder="Search history..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-4 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-red-500/50 w-full sm:w-[180px]"
            />
          </div>

          {/* Level Filter */}
          <div className="flex items-center gap-1.5 bg-slate-950 border border-slate-800 rounded-lg px-2 py-1.5">
            <Filter className="h-3.5 w-3.5 text-slate-500" />
            <select
              value={selectedLevel}
              onChange={(e) => setSelectedLevel(e.target.value)}
              className="bg-transparent text-xs text-white font-medium focus:outline-none pr-2 cursor-pointer"
            >
              <option value="ALL" className="bg-slate-900">All Levels</option>
              <option value="CRITICAL" className="bg-slate-900">Critical Only</option>
              <option value="HIGH" className="bg-slate-900">High Only</option>
              <option value="LOW" className="bg-slate-900">Low Only</option>
            </select>
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-1.5 bg-slate-950 border border-slate-800 rounded-lg px-2 py-1.5">
            <Filter className="h-3.5 w-3.5 text-slate-500" />
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="bg-transparent text-xs text-white font-medium focus:outline-none pr-2 cursor-pointer"
            >
              <option value="ALL" className="bg-slate-900">All Status</option>
              <option value="Blocked" className="bg-slate-900">Blocked</option>
              <option value="Warned" className="bg-slate-900">Warned</option>
              <option value="Allowed" className="bg-slate-900">Allowed</option>
            </select>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Incident Table list (2/3 width) */}
        <div className="lg:col-span-2 p-5 bg-slate-900/40 border border-slate-800/80 rounded-xl space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-400 uppercase tracking-wider">Call Analysis Log</h2>
            <span className="text-xs text-slate-500 font-mono">Found {filteredIncidents.length} threat logs</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300 border-collapse">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 font-medium">
                  <th className="py-2.5 px-3">Caller Identity</th>
                  <th className="py-2.5 px-3">Timestamp</th>
                  <th className="py-2.5 px-3">Threat Class</th>
                  <th className="py-2.5 px-3 text-center">Threat Rating</th>
                  <th className="py-2.5 px-3 text-right">Inspect</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filteredIncidents.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-slate-500 font-sans">
                      No matching incidents found in the defense log database.
                    </td>
                  </tr>
                ) : (
                  filteredIncidents.map((incident) => {
                    const isCurrent = selectedIncident?.id === incident.id;
                    return (
                      <tr 
                        key={incident.id} 
                        onClick={() => setSelectedIncident(incident)}
                        className={`hover:bg-slate-900/30 cursor-pointer transition-colors ${
                          isCurrent ? 'bg-slate-900/50 border-l-2 border-red-500' : ''
                        }`}
                      >
                        <td className="py-3 px-3">
                          <div className="font-semibold text-white">{incident.callerName}</div>
                          <div className="text-[10px] text-slate-500 font-mono">{incident.callerNumber}</div>
                        </td>
                        <td className="py-3 px-3 text-slate-400 text-[11px]">
                          {incident.timestamp}
                        </td>
                        <td className="py-3 px-3">
                          <span className={`inline-block px-1.5 py-0.5 rounded text-[10px] font-bold border ${getThreatColor(incident.threatLevel)}`}>
                            {incident.threatType}
                          </span>
                        </td>
                        <td className="py-3 px-3 text-center">
                          <span className={`font-bold text-sm ${
                            incident.riskScore >= 80 ? 'text-rose-500' :
                            incident.riskScore >= 55 ? 'text-amber-500' :
                            'text-emerald-400'
                          }`}>
                            {incident.riskScore}/100
                          </span>
                        </td>
                        <td className="py-3 px-3 text-right">
                          <ChevronRight className={`h-4 w-4 inline-block text-slate-500 transition-transform ${
                            isCurrent ? 'translate-x-1 text-red-400' : ''
                          }`} />
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Incident Details Pane (1/3 width) */}
        <div className="lg:col-span-1">
          {selectedIncident ? (
            <div className="p-6 bg-slate-900/60 border border-slate-800/80 rounded-xl space-y-6 flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex items-start justify-between border-b border-slate-800/80 pb-3">
                  <div className="space-y-1">
                    <span className="text-[9px] text-slate-500 font-mono font-bold tracking-widest block uppercase">
                      INCIDENT AUDIT PANE
                    </span>
                    <h3 className="text-sm font-bold text-white font-mono">{selectedIncident.id}</h3>
                  </div>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border ${getThreatColor(selectedIncident.threatLevel)}`}>
                    {selectedIncident.threatLevel}
                  </span>
                </div>

                {/* Main caller summary */}
                <div className="grid grid-cols-2 gap-3 text-xs bg-slate-950 border border-slate-800 p-3 rounded-lg">
                  <div>
                    <span className="text-slate-500 text-[10px] block">Caller Name</span>
                    <span className="text-white font-bold">{selectedIncident.callerName}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 text-[10px] block">Number / Origin</span>
                    <span className="text-white font-mono font-semibold">{selectedIncident.callerNumber}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 text-[10px] block">Timestamp</span>
                    <span className="text-white">{selectedIncident.timestamp}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 text-[10px] block">Call Duration</span>
                    <span className="text-white font-mono">{selectedIncident.duration}</span>
                  </div>
                </div>

                {/* Biometric results info */}
                <div className="space-y-2 pt-2">
                  <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Acoustic Diagnostics</h4>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="p-2.5 bg-slate-950/60 border border-slate-800/60 rounded text-center">
                      <span className="text-slate-500 text-[9px] block">AI Synthetics probability</span>
                      <span className="text-rose-500 font-black text-sm mt-0.5 block">{selectedIncident.aiVoiceProb}%</span>
                    </div>
                    <div className="p-2.5 bg-slate-950/60 border border-slate-800/60 rounded text-center">
                      <span className="text-slate-500 text-[9px] block">Biometric voice match</span>
                      <span className="text-sky-400 font-black text-sm mt-0.5 block">{selectedIncident.speakerMatch}%</span>
                    </div>
                  </div>
                </div>

                {/* Transcript snippet */}
                <div className="space-y-1.5 pt-2">
                  <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                    <FileText className="h-3 w-3 text-emerald-400" />
                    Speech Transcript Log
                  </h4>
                  <p className="p-3 bg-slate-950 border border-slate-800 text-[11px] font-mono leading-relaxed text-slate-300 rounded-lg max-h-32 overflow-y-auto">
                    "{selectedIncident.transcript}"
                  </p>
                </div>

                {/* Combined action summary */}
                <div className="space-y-1.5 pt-2">
                  <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Automated Resolution status</h4>
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold tracking-wide ${
                      selectedIncident.status === 'Blocked' ? 'bg-red-950/40 text-red-400 border border-red-900/30' :
                      selectedIncident.status === 'Warned' ? 'bg-amber-950/40 text-amber-400 border border-amber-900/30' :
                      'bg-emerald-950/40 text-emerald-400 border border-emerald-900/30'
                    }`}>
                      {selectedIncident.status}
                    </span>
                    <span className="text-[11px] text-slate-400">Threat Rating: <strong className="text-white">{selectedIncident.riskScore}/100</strong></span>
                  </div>
                </div>

                {/* System defense notes */}
                <div className="space-y-1 border-t border-slate-800/60 pt-3">
                  <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Defense System Notes</h4>
                  <p className="text-[11px] text-slate-400 leading-relaxed italic">
                    {selectedIncident.notes}
                  </p>
                </div>
              </div>

              {onDeleteIncident && (
                <button
                  id={`btn-delete-${selectedIncident.id}`}
                  onClick={() => {
                    onDeleteIncident(selectedIncident.id);
                    setSelectedIncident(null);
                  }}
                  className="w-full mt-4 flex items-center justify-center gap-2 bg-rose-950/20 hover:bg-rose-950/50 text-rose-400 border border-rose-900/30 hover:border-rose-900/50 text-xs py-2 px-3 rounded-lg transition cursor-pointer"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  Erase audit record from local database
                </button>
              )}
            </div>
          ) : (
            <div className="p-8 bg-slate-900/30 border border-slate-800/80 rounded-xl text-center space-y-2">
              <Info className="h-8 w-8 text-slate-600 mx-auto" />
              <h3 className="font-bold text-slate-400 text-sm">No Incident Inspected</h3>
              <p className="text-xs text-slate-500">
                Select any incident row in the registry table to audit its deep signal and transcript records.
              </p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
