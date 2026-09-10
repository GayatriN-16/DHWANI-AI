import { useState, useEffect, useRef } from 'react';
import { 
  Square, 
  Mic, 
  ShieldAlert, 
  ShieldCheck, 
  AlertOctagon, 
  Info, 
  Cpu, 
  Volume2, 
  Terminal, 
  RefreshCw,
  UserCheck,
  CheckCircle2,
  Lock,
  LockKeyhole,
  FileCheck,
  ArrowRightLeft
} from 'lucide-react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { SCENARIOS } from '../data';

export default function AnalyzeVoice({ onAnalyzeFinished, activeScenarioId }) {
  // Scenario Selection
  const [selectedScenario, setSelectedScenario] = useState(
    SCENARIOS.find(s => s.id === activeScenarioId) || SCENARIOS[0]
  );

  // Active status
  const [isRecording, setIsRecording] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  
  // Real-time ticker and simulated progression
  const [ticker, setTicker] = useState(0);
  const [streamedTranscript, setStreamedTranscript] = useState('');
  const [liveRiskHistory, setLiveRiskHistory] = useState([]);
  const [liveRiskScore, setLiveRiskScore] = useState(0);
  const [liveAiVoiceProb, setLiveAiVoiceProb] = useState(0);
  const [liveSpeakerMatch, setLiveSpeakerMatch] = useState(100);

  // Secondary Verification State
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationResult, setVerificationResult] = useState(null);
  const [showVerificationWizard, setShowVerificationWizard] = useState(false);

  const animationIntervalRef = useRef(null);

  // Sync if selected from outside/preset trigger
  useEffect(() => {
    if (activeScenarioId) {
      const found = SCENARIOS.find(s => s.id === activeScenarioId);
      if (found) {
        setSelectedScenario(found);
        resetSimulation(found);
      }
    }
  }, [activeScenarioId]);

  const resetSimulation = (scenario = selectedScenario) => {
    stopAllSimulation();
    setTicker(0);
    setStreamedTranscript('');
    setLiveRiskHistory([{ time: '0s', risk: 0 }]);
    setLiveRiskScore(0);
    setLiveAiVoiceProb(0);
    setLiveSpeakerMatch(100);
    setVerificationResult(null);
    setIsVerifying(false);
    setShowVerificationWizard(false);
  };

  const stopAllSimulation = () => {
    if (animationIntervalRef.current) {
      clearInterval(animationIntervalRef.current);
      animationIntervalRef.current = null;
    }
    setIsRecording(false);
    setIsPlaying(false);
    setIsAnalyzing(false);
  };

  useEffect(() => {
    return () => {
      if (animationIntervalRef.current) clearInterval(animationIntervalRef.current);
    };
  }, []);

  const startSimulation = () => {
    resetSimulation();
    setIsRecording(true);
    setIsAnalyzing(true);

    const fullText = selectedScenario.transcript;
    const words = fullText.split(' ');
    let currentWordIndex = 0;
    let tickCount = 0;

    animationIntervalRef.current = setInterval(() => {
      tickCount += 1;
      setTicker(tickCount);

      // Simulate streaming transcript word by word
      if (currentWordIndex < words.length) {
        const nextWords = words.slice(0, currentWordIndex + 2).join(' ');
        setStreamedTranscript(nextWords);
        currentWordIndex += 2;
      } else {
        setStreamedTranscript(fullText);
      }

      // Calculate dynamic risk score and stats updating over time
      const progression = tickCount / 12; // Complete over 12 ticks
      const cappedProgress = Math.min(progression, 1);

      // Interpolate stats
      const targetRisk = selectedScenario.riskScore;
      const targetAi = selectedScenario.aiVoiceProb;
      const targetMatch = selectedScenario.speakerMatch;

      const currentRisk = Math.round(targetRisk * cappedProgress);
      const currentAi = Math.round(targetAi * cappedProgress);
      const currentMatch = Math.round(100 - (100 - targetMatch) * cappedProgress);

      setLiveRiskScore(currentRisk);
      setLiveAiVoiceProb(currentAi);
      setLiveSpeakerMatch(currentMatch);

      // Add to Recharts data
      const timeStr = `${tickCount}s`;
      setLiveRiskHistory(prev => {
        if (prev.some(item => item.time === timeStr)) return prev;
        return [...prev, { time: timeStr, risk: currentRisk }];
      });

      // Complete simulation
      if (tickCount >= 12) {
        stopAllSimulation();
        setIsPlaying(false);
        // Dispatch result callback to parent so it appends to incident log list
        const simulatedIncident = {
          id: `INC-2026-0${Math.floor(Math.random() * 90) + 10}`,
          callerName: selectedScenario.callerName,
          callerNumber: selectedScenario.callerNumber,
          timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
          duration: selectedScenario.duration,
          transcript: selectedScenario.transcript,
          threatLevel: selectedScenario.threatLevel,
          riskScore: selectedScenario.riskScore,
          aiVoiceProb: selectedScenario.aiVoiceProb,
          speakerMatch: selectedScenario.speakerMatch,
          threatType: selectedScenario.category,
          status: selectedScenario.threatLevel === 'CRITICAL' ? 'Blocked' : 
                  selectedScenario.threatLevel === 'HIGH' ? 'Warned' : 'Allowed',
          notes: `Security analysis executed for preset "${selectedScenario.name}". Automated defensive rating evaluated correctly.`,
          riskFactors: selectedScenario.riskFactors
        };
        onAnalyzeFinished(simulatedIncident);
      }
    }, 1000);
  };

  const handleScenarioChange = (scenario) => {
    setSelectedScenario(scenario);
    resetSimulation(scenario);
  };

  // Perform out-of-band identity verification
  const triggerIdentityVerification = async () => {
    setIsVerifying(true);
    setVerificationResult(null);

    try {
      const response = await fetch('/api/verify-identity', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          code: 'OOB-V2',
          contactName: selectedScenario.callerName
        })
      });

      if (!response.ok) {
        throw new Error('Verification network issue');
      }

      const result = await response.json();
      setVerificationResult(result);
    } catch (error) {
      console.error('Error during identity verification:', error);
    } finally {
      setIsVerifying(false);
    }
  };

  // SVG waveform renderer with customized waves
  const renderWaveform = () => {
    const isWaveActive = isRecording || isAnalyzing;
    const waveColors = ['#f43f5e', '#ef4444', '#dc2626', '#3b82f6', '#475569'];

    return (
      <div className="relative h-28 bg-slate-950 border border-slate-900 rounded-xl overflow-hidden flex items-center justify-center p-2">
        {isWaveActive ? (
          <div className="absolute inset-0 flex items-center justify-center gap-1 px-4">
            {Array.from({ length: 48 }).map((_, i) => {
              const baseHeight = Math.max(12, Math.sin(i * 0.4) * 45 + Math.cos(i * 0.2) * 20);
              const duration = 0.6 + (i % 5) * 0.15;
              const delay = (i % 7) * 0.08;

              return (
                <div
                  key={i}
                  className="w-1 rounded-full"
                  style={{
                    height: `${baseHeight}%`,
                    backgroundColor: waveColors[i % waveColors.length],
                    animation: `soundWaveAnimation ${duration}s ease-in-out ${delay}s infinite alternate`,
                    transformOrigin: 'center'
                  }}
                />
              );
            })}
          </div>
        ) : (
          <div className="text-center space-y-2">
            <div className="flex justify-center gap-1 text-slate-800">
              {Array.from({ length: 24 }).map((_, i) => (
                <div key={i} className="w-1 h-6 bg-slate-900 rounded" />
              ))}
            </div>
            <p className="text-[10px] text-slate-600 font-mono tracking-wider uppercase">SPECTRUM SLEEPING (Awaiting feed signal)</p>
          </div>
        )}
        <div className="absolute top-2 left-3 bg-slate-950 border border-slate-900 rounded px-2 py-0.5 text-[9px] font-mono text-slate-400 flex items-center gap-1">
          <span className={`h-1.5 w-1.5 rounded-full ${isWaveActive ? 'bg-red-500 animate-ping' : 'bg-slate-500'}`} />
          {isWaveActive ? `STREAM ANALYSIS ACTIVE • 0:${ticker.toString().padStart(2, '0')}` : 'RECEIVER OFFLINE'}
        </div>
      </div>
    );
  };

  // Preset scenarios row
  const renderPresets = () => {
    return (
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold text-slate-400 uppercase tracking-widest font-mono flex items-center gap-1.5">
            <Cpu className="h-3.5 w-3.5 text-slate-400" />
            Adversarial Stream Simulations (Slide 6 Evaluation Targets)
          </label>
          <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wide">Select simulation target</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {SCENARIOS.map((s) => {
            const isActive = selectedScenario.id === s.id;
            const levelColor = 
              s.threatLevel === 'CRITICAL' ? 'border-red-900/40 text-red-400 bg-red-950/40 font-mono' :
              s.threatLevel === 'HIGH' ? 'border-amber-900/40 text-amber-400 bg-amber-950/40 font-mono' :
              'border-slate-800 text-emerald-400 bg-emerald-950/40 font-mono';

            return (
              <button
                key={s.id}
                id={`preset-${s.id}`}
                onClick={() => handleScenarioChange(s)}
                className={`flex flex-col p-4 text-left border rounded-xl transition cursor-pointer group relative overflow-hidden ${
                  isActive 
                    ? 'border-red-800 bg-slate-900 shadow-md shadow-red-950/20' 
                    : 'border-slate-800 hover:border-slate-700 bg-slate-950/20'
                }`}
              >
                {isActive && (
                  <div className="absolute top-0 right-0 h-1.5 w-16 bg-red-500" />
                )}
                <div className="flex items-center justify-between w-full mb-2">
                  <span className={`text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded border ${levelColor}`}>
                    {s.threatLevel}
                  </span>
                  <span className="text-[10px] font-mono text-slate-500 font-bold">{s.duration}</span>
                </div>
                <span className="text-sm font-bold text-white group-hover:text-red-400 transition-colors">
                  {s.label}
                </span>
                <span className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                  {s.description}
                </span>
                <span className="text-[10px] font-mono text-slate-500 mt-3 border-t border-slate-800/80 pt-2 w-full truncate">
                  Target: {s.callerName} ({s.callerNumber})
                </span>
              </button>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <style>{`
        @keyframes soundWaveAnimation {
          0% { transform: scaleY(0.2); }
          100% { transform: scaleY(1.4); }
        }
      `}</style>

      {/* Header and Controls */}
      <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl shadow-xl flex flex-col space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <h1 className="text-xl md:text-2xl font-black text-white font-mono uppercase tracking-wider">Live Signal Analysis Core</h1>
            <p className="text-xs text-slate-400">
              Run real-time diagnostics on live audio streams, uploaded calls, or preset simulations.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              id="btn-toggle-recording"
              onClick={() => {
                if (isRecording || isAnalyzing) {
                  stopAllSimulation();
                } else {
                  startSimulation();
                }
              }}
              className={`inline-flex items-center justify-center gap-2 font-mono font-bold uppercase tracking-wider py-2.5 px-5 rounded-xl transition text-xs cursor-pointer border ${
                isRecording 
                  ? 'bg-red-950 hover:bg-red-900 text-red-200 border-red-800/60 animate-pulse' 
                  : 'bg-slate-950 hover:bg-slate-900 text-emerald-400 border-emerald-900/40'
              }`}
            >
              {isRecording ? (
                <>
                  <Square className="h-4 w-4" />
                  Abort Stream
                </>
              ) : (
                <>
                  <Mic className="h-4 w-4" />
                  Initialize Analysis
                </>
              )}
            </button>

            <button
              onClick={() => resetSimulation()}
              disabled={isRecording}
              className="p-2.5 bg-slate-850 hover:bg-slate-850 text-slate-300 disabled:opacity-40 disabled:cursor-not-allowed border border-slate-800 rounded-xl transition text-xs cursor-pointer"
              title="Reset metrics"
            >
              <RefreshCw className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Preset Selection Selector Row */}
        {renderPresets()}

        {/* Dynamic Input Signal Feed Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2 space-y-3">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5 font-mono">
              <Volume2 className="h-3.5 w-3.5 text-blue-500 animate-pulse" />
              Live Acoustic Waveform & Spectrogram
            </label>
            {renderWaveform()}
          </div>

          {/* Caller Details Card */}
          <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl flex flex-col justify-between space-y-4">
            <div className="space-y-1.5">
              <span className="text-[9px] text-slate-500 font-bold uppercase tracking-wider font-mono">Acoustic Signal Origin</span>
              <h3 className="font-bold text-white text-sm">{selectedScenario.callerName}</h3>
              <p className="text-[11px] text-slate-400 font-mono">{selectedScenario.callerNumber}</p>
            </div>
            <div className="grid grid-cols-2 gap-2 text-[10px] border-t border-slate-800 pt-3 font-mono">
              <div>
                <span className="text-slate-500 block">Category</span>
                <span className="text-white font-semibold">{selectedScenario.category}</span>
              </div>
              <div>
                <span className="text-slate-500 block">Length</span>
                <span className="text-white font-semibold font-mono">{selectedScenario.duration}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Slide 5: The complete 6-stage Pipeline UI */}
      <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl shadow-xl space-y-6">
        <div className="border-b border-slate-800 pb-3">
          <h2 className="text-base font-bold text-white font-mono uppercase tracking-wider flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-emerald-400" />
            6-Stage Threat Detection Pipeline Flow
          </h2>
          <p className="text-xs text-slate-400">
            Real-time biometric, semantic, and contextual verification sequential protocol. (Ref: Slide 5 Execution Architecture).
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
          {/* Stage 1: AI Voice Detection */}
          <div className={`p-4 rounded-xl border flex flex-col justify-between space-y-3 transition-colors ${
            ticker > 0 || isAnalyzing ? 'bg-slate-950 border-red-500/20' : 'bg-slate-950/40 border-slate-800'
          }`}>
            <div className="space-y-1">
              <div className="text-[9px] font-mono text-rose-400 font-bold uppercase tracking-wider">STAGE 01</div>
              <h3 className="text-xs font-bold text-white">AI Voice Detection</h3>
            </div>
            <div className="space-y-1">
              <div className="text-[10px] text-slate-400">Synthetic Voice Probability</div>
              <div className="text-base font-bold text-white font-mono">
                {ticker > 0 || isAnalyzing ? `${liveAiVoiceProb}%` : 'Pending'}
              </div>
            </div>
          </div>

          {/* Stage 2: Speaker Verification */}
          <div className={`p-4 rounded-xl border flex flex-col justify-between space-y-3 transition-colors ${
            ticker > 0 || isAnalyzing ? 'bg-slate-950 border-blue-500/20' : 'bg-slate-950/40 border-slate-800'
          }`}>
            <div className="space-y-1">
              <div className="text-[9px] font-mono text-blue-400 font-bold uppercase tracking-wider">STAGE 02</div>
              <h3 className="text-xs font-bold text-white">Speaker Verification</h3>
            </div>
            <div className="space-y-1">
              <div className="text-[10px] text-slate-400">Claimed Identity vs Speaker Match</div>
              <div className="text-base font-bold text-white font-mono">
                {ticker > 0 || isAnalyzing ? `${liveSpeakerMatch}%` : 'Pending'}
              </div>
            </div>
          </div>

          {/* Stage 3: Speech to Text */}
          <div className={`p-4 rounded-xl border flex flex-col justify-between space-y-3 transition-colors ${
            ticker > 0 || isAnalyzing ? 'bg-slate-950 border-indigo-500/20' : 'bg-slate-950/40 border-slate-800'
          }`}>
            <div className="space-y-1">
              <div className="text-[9px] font-mono text-indigo-400 font-bold uppercase tracking-wider">STAGE 03</div>
              <h3 className="text-xs font-bold text-white">Speech-to-Text</h3>
            </div>
            <div className="space-y-1">
              <div className="text-[10px] text-slate-400">Conversation Transcript</div>
              <div className="text-[10px] text-emerald-400 font-mono truncate">
                {streamedTranscript ? 'Active Streaming' : 'Standby'}
              </div>
            </div>
          </div>

          {/* Stage 4: Intent & Context */}
          <div className={`p-4 rounded-xl border flex flex-col justify-between space-y-3 transition-colors ${
            ticker > 0 || isAnalyzing ? 'bg-slate-950 border-amber-500/20' : 'bg-slate-950/40 border-slate-800'
          }`}>
            <div className="space-y-1">
              <div className="text-[9px] font-mono text-amber-400 font-bold uppercase tracking-wider">STAGE 04</div>
              <h3 className="text-xs font-bold text-white">Intent & Context</h3>
            </div>
            <div className="space-y-1">
              <div className="text-[9px] text-slate-500 leading-tight font-mono">Financial Request / OTP / Urgency / Suspicious Intent</div>
              <div className="text-[10px] font-mono text-white truncate font-bold mt-1" title={selectedScenario.detectedIntent}>
                {ticker > 0 || isAnalyzing ? selectedScenario.detectedIntent : 'Pending'}
              </div>
            </div>
          </div>

          {/* Stage 5: Risk Fusion */}
          <div className={`p-4 rounded-xl border flex flex-col justify-between space-y-3 transition-colors ${
            ticker > 0 || isAnalyzing ? 'bg-slate-950 border-red-500/40' : 'bg-slate-950/40 border-slate-800'
          }`}>
            <div className="space-y-1">
              <div className="text-[9px] font-mono text-red-400 font-bold uppercase tracking-wider">STAGE 05</div>
              <h3 className="text-xs font-bold text-white">Risk Fusion</h3>
            </div>
            <div className="space-y-1">
              <div className="text-[10px] text-slate-400">Combined Risk Score: 0-100</div>
              <div className="text-base font-bold text-white font-mono">
                {ticker > 0 || isAnalyzing ? `${liveRiskScore}/100` : 'Pending'}
              </div>
            </div>
          </div>

          {/* Stage 6: Preventive Action */}
          <div className={`p-4 rounded-xl border flex flex-col justify-between space-y-3 transition-colors ${
            ticker > 0 || isAnalyzing ? 'bg-slate-950 border-purple-500/20' : 'bg-slate-950/40 border-slate-800'
          }`}>
            <div className="space-y-1">
              <div className="text-[9px] font-mono text-purple-400 font-bold uppercase tracking-wider">STAGE 06</div>
              <h3 className="text-xs font-bold text-white">Preventive Action</h3>
            </div>
            <div className="space-y-1">
              <div className="text-[9px] text-slate-500 leading-tight font-mono mb-1">Allow / Warn / Secondary Verification / Escalate</div>
              <div className={`text-[11px] font-black uppercase font-mono ${
                liveRiskScore >= 80 ? 'text-red-500 animate-pulse' :
                liveRiskScore >= 50 ? 'text-amber-500' :
                liveRiskScore > 0 ? 'text-emerald-400' : 'text-slate-500'
              }`}>
                {liveRiskScore >= 80 ? 'Secondary Verification / Escalate' :
                 liveRiskScore >= 50 ? 'Verify Identity / Warn' :
                 liveRiskScore > 0 ? 'Allow' : 'Awaiting'}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Primary Metrics, Real-time Readouts & Explainable AI (Slide 7) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Real-time transcription streaming */}
        <div className="lg:col-span-2 space-y-4">
          {/* Live Transcript Panel */}
          <div className="p-5 bg-slate-900/60 border border-slate-800/80 rounded-xl space-y-3 flex flex-col h-[200px]">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-1.5 font-mono">
                <Terminal className="h-4 w-4 text-emerald-400" />
                Live Speech-To-Text Transcriber (Stage 3)
              </h2>
              <span className="text-[10px] font-mono text-slate-500">
                {isRecording ? 'STREAMING ACTIVE' : 'BUFFER STANDBY'}
              </span>
            </div>

            <div className="flex-1 overflow-y-auto bg-slate-950 border border-slate-800/60 rounded-lg p-3 text-xs font-mono leading-relaxed text-slate-300">
              {streamedTranscript ? (
                <p className="text-white">
                  {streamedTranscript}
                  {isRecording && <span className="animate-pulse bg-emerald-500 text-transparent select-none inline-block w-2 h-4 ml-1">|</span>}
                </p>
              ) : (
                <span className="text-slate-600 italic">
                  Press "Initialize Analysis" above to begin feeding real-time audio...
                </span>
              )}
            </div>
          </div>

          {/* Dynamic Recharts Risk History */}
          <div className="p-5 bg-slate-900/60 border border-slate-800/80 rounded-xl space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
                Threat Risk Fusion Index (Stage 5)
              </h2>
              <span className="text-[10px] text-slate-500 font-mono">Live Multi-Model Score</span>
            </div>

            <div className="h-44 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart 
                  data={liveRiskHistory.length > 0 ? liveRiskHistory : selectedScenario.riskHistory} 
                  margin={{ top: 5, right: 10, left: -25, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="time" stroke="#64748b" fontSize={10} tickLine={false} />
                  <YAxis stroke="#64748b" fontSize={10} tickLine={false} domain={[0, 100]} />
                  <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', color: '#fff', fontSize: '11px' }} />
                  <Line 
                    type="monotone" 
                    dataKey="risk" 
                    stroke="#ef4444" 
                    strokeWidth={3} 
                    dot={{ r: 4, fill: '#ef4444', strokeWidth: 0 }}
                    activeDot={{ r: 6 }} 
                    name="Combined Threat Score"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Metric Dials & Overall Risk Gauge */}
        <div className="lg:col-span-1 space-y-4">
          <div className="p-5 bg-slate-900/60 border border-slate-800/80 rounded-xl space-y-6">
            <h2 className="text-sm font-bold text-white uppercase tracking-wider border-b border-slate-800 pb-2 font-mono">
              Acoustic Biometrics
            </h2>

            {/* AI Synthetics score */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-300 font-medium flex items-center gap-1">
                  <Cpu className="h-3.5 w-3.5 text-rose-500" />
                  AI Voice probability
                </span>
                <span className={`font-mono font-bold ${liveAiVoiceProb >= 70 ? 'text-rose-500' : 'text-emerald-400'}`}>
                  {liveAiVoiceProb}%
                </span>
              </div>
              <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden">
                <div 
                  className={`h-full transition-all duration-300 ${liveAiVoiceProb >= 70 ? 'bg-rose-500' : 'bg-emerald-400'}`}
                  style={{ width: `${liveAiVoiceProb}%` }}
                />
              </div>
              <p className="text-[10px] text-slate-500 leading-normal">
                Compares frequency harmonic variance against synthetic generative signatures.
              </p>
            </div>

            {/* Speaker match score */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-300 font-medium flex items-center gap-1">
                  <UserCheck className="h-3.5 w-3.5 text-blue-400" />
                  Speaker Match Verification
                </span>
                <span className="font-mono font-bold text-white">
                  {isAnalyzing || ticker > 0 ? `${liveSpeakerMatch}%` : 'N/A'}
                </span>
              </div>
              <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-blue-500 transition-all duration-300"
                  style={{ width: `${isAnalyzing || ticker > 0 ? liveSpeakerMatch : 0}%` }}
                />
              </div>
              <p className="text-[10px] text-slate-500 leading-normal">
                Verifies voice print against the target relative's saved master voice register.
              </p>
            </div>

            {/* Overall Risk Gauge */}
            <div className="pt-4 border-t border-slate-800/60 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest block font-mono">Threat Index</span>
                <span className={`text-3xl font-black ${
                  liveRiskScore >= 80 ? 'text-rose-500' :
                  liveRiskScore >= 50 ? 'text-amber-500' :
                  'text-emerald-400'
                }`}>
                  {liveRiskScore}/100
                </span>
              </div>
              <span className={`px-2 py-1 rounded text-xs font-black tracking-wide font-mono ${
                liveRiskScore >= 80 ? 'bg-rose-950/50 text-rose-400 border border-rose-900/40' :
                liveRiskScore >= 50 ? 'bg-amber-950/50 text-amber-400 border border-amber-900/40' :
                'bg-emerald-950/50 text-emerald-400 border border-emerald-900/40'
              }`}>
                {liveRiskScore >= 80 ? 'CRITICAL SCAM' :
                 liveRiskScore >= 50 ? 'SUSPICIOUS' :
                 liveRiskScore > 0 ? 'LOW RISK' : 'PENDING'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Slide 7: Explainable Risk Score Breakdown */}
      <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl shadow-xl space-y-4">
        <div className="border-b border-slate-800 pb-3">
          <h2 className="text-base font-bold text-white font-mono uppercase tracking-wider flex items-center gap-2">
            <Info className="h-5 w-5 text-red-400" />
            Explainable Risk Score Breakdown
          </h2>
          <p className="text-xs text-slate-400">
            A rigorous decomposition of the combined threat score across 6 distinct vector classes (Ref: Slide 7 Risk Analysis).
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {/* Voice Authenticity */}
          <div className="p-3 bg-slate-950 border border-slate-800 rounded-lg text-center">
            <div className="text-[9px] text-slate-500 font-bold uppercase tracking-wider font-mono">1. Voice Authenticity</div>
            <div className={`text-xs font-black mt-2 ${selectedScenario.riskFactors.voiceAuthenticity === 'HIGH RISK' ? 'text-rose-500' : 'text-emerald-400'}`}>
              {selectedScenario.riskFactors.voiceAuthenticity}
            </div>
          </div>

          {/* Speaker Mismatch */}
          <div className="p-3 bg-slate-950 border border-slate-800 rounded-lg text-center">
            <div className="text-[9px] text-slate-500 font-bold uppercase tracking-wider font-mono">2. Speaker Mismatch</div>
            <div className={`text-xs font-black mt-2 ${selectedScenario.riskFactors.speakerMismatch === 'HIGH RISK' ? 'text-rose-500' : 'text-emerald-400'}`}>
              {selectedScenario.riskFactors.speakerMismatch}
            </div>
          </div>

          {/* Fraud Intent */}
          <div className="p-3 bg-slate-950 border border-slate-800 rounded-lg text-center">
            <div className="text-[9px] text-slate-500 font-bold uppercase tracking-wider font-mono">3. Fraud Intent NLP</div>
            <div className={`text-xs font-black mt-2 ${selectedScenario.riskFactors.fraudIntent === 'DETECTED' ? 'text-rose-500' : 'text-emerald-400'}`}>
              {selectedScenario.riskFactors.fraudIntent}
            </div>
          </div>

          {/* Urgency */}
          <div className="p-3 bg-slate-950 border border-slate-800 rounded-lg text-center">
            <div className="text-[9px] text-slate-500 font-bold uppercase tracking-wider font-mono">4. Urgency Flag</div>
            <div className={`text-xs font-black mt-2 ${selectedScenario.riskFactors.urgency === 'HIGH' ? 'text-rose-500' : 'text-emerald-400'}`}>
              {selectedScenario.riskFactors.urgency === 'HIGH' ? 'HIGH DETECTED' : 'LOW'}
            </div>
          </div>

          {/* Transaction Risk */}
          <div className="p-3 bg-slate-950 border border-slate-800 rounded-lg text-center">
            <div className="text-[9px] text-slate-500 font-bold uppercase tracking-wider font-mono">5. Transaction Threat</div>
            <div className={`text-xs font-black mt-2 ${selectedScenario.riskFactors.transactionRisk === 'HIGH' ? 'text-rose-500' : 'text-emerald-400'}`}>
              {selectedScenario.riskFactors.transactionRisk === 'HIGH' ? 'CRITICAL REQUIREMENT' : 'LOW'}
            </div>
          </div>

          {/* Context Anomaly */}
          <div className="p-3 bg-slate-950 border border-slate-800 rounded-lg text-center">
            <div className="text-[9px] text-slate-500 font-bold uppercase tracking-wider font-mono">6. Context Anomaly</div>
            <div className={`text-xs font-black mt-2 ${selectedScenario.riskFactors.contextAnomaly === 'HIGH' ? 'text-rose-500' : 'text-emerald-400'}`}>
              {selectedScenario.riskFactors.contextAnomaly === 'HIGH' ? 'OUT-OF-BAND' : 'NORMAL'}
            </div>
          </div>
        </div>
      </div>

      {/* Slide 8: Interactive Countermeasures (Preventive Action) */}
      <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl shadow-xl space-y-6">
        <div className="border-b border-slate-800 pb-3 flex flex-col md:flex-row md:items-center justify-between gap-2">
          <div>
            <h2 className="text-base font-bold text-white font-mono uppercase tracking-wider flex items-center gap-2">
              <Lock className="h-5 w-5 text-red-500" />
              Active Preventive Actions & Handshakes
            </h2>
            <p className="text-xs text-slate-400">
              Interactive defense mitigates live attacks by forcing verified out-of-band protocols (Ref: Slide 8 Countermeasures).
            </p>
          </div>
          <span className="text-[10px] font-mono text-rose-400 font-bold uppercase bg-rose-950/40 border border-rose-900/40 px-2 py-1 rounded">
            Defensive Shield Layer Active
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Diagnostic Explainer */}
          <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-2 flex flex-col justify-between">
            <div className="space-y-2">
              <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider font-mono block">Automated Decision Consensus</span>
              <div className="text-sm font-bold text-white flex items-center gap-1.5 font-mono">
                {liveRiskScore >= 80 ? (
                  <>
                    <AlertOctagon className="h-4 w-4 text-red-500 animate-pulse" />
                    BLOCK WIRE TRANSACTION
                  </>
                ) : liveRiskScore >= 50 ? (
                  <>
                    <AlertOctagon className="h-4 w-4 text-amber-500" />
                    IN-CALL SECURITY WARNING
                  </>
                ) : (
                  <>
                    <ShieldCheck className="h-4 w-4 text-emerald-400" />
                    SAFE - STREAM CLEARED
                  </>
                )}
              </div>
              <p className="text-xs text-slate-400 leading-normal">
                {selectedScenario.explanation}
              </p>
            </div>
            <div className="border-t border-slate-900 pt-3 mt-3">
              <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider font-mono block">Automated Directive</span>
              <span className="text-xs text-slate-300 font-mono mt-1 block">
                {liveRiskScore >= 50 ? 'Telecom overlay block sent successfully.' : 'No overlay required.'}
              </span>
            </div>
          </div>

          {/* Secure Step & Recommended Action */}
          <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-4 flex flex-col justify-between">
            <div className="space-y-2">
              <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider font-mono block">Recommended Safe Protocol</span>
              <div className="text-xs font-semibold text-white leading-relaxed flex items-start gap-2">
                <FileCheck className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>{selectedScenario.recommendedAction}</span>
              </div>
              <p className="text-xs text-slate-400 leading-normal">
                DhwaniAI alerts the user during the voice call on their smartphone and displays real-time risk warnings to counter financial spoofing.
              </p>
            </div>

            <div className="p-3 bg-slate-900 border border-slate-800/80 rounded-lg">
              <span className="text-[9px] text-slate-500 uppercase font-mono block">Active Gateway Routing</span>
              <span className="text-xs font-bold text-sky-400 font-mono">GW-DHWANI-ROUTE-01</span>
            </div>
          </div>

          {/* Interactive Handshake (Slide 8 Interactive Component) */}
          <div className="p-4 bg-slate-950 border border-slate-850 rounded-xl space-y-4 flex flex-col justify-between">
            {liveRiskScore >= 50 ? (
              !showVerificationWizard ? (
                <div className="space-y-4 flex flex-col justify-between h-full">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-rose-500 bg-rose-950/20 border border-rose-900/30 p-2.5 rounded-lg animate-pulse font-mono text-[11px] font-black uppercase">
                      <ShieldAlert className="h-4 w-4" />
                      <span>🚨 Secondary Verification Required</span>
                    </div>
                    <p className="text-xs text-slate-400 leading-normal">
                      The security engine has flagged high-risk anomalies. To confirm caller identity, please perform an independent multi-channel out-of-band verification challenge.
                    </p>
                  </div>
                  <button
                    id="btn-verify-identity"
                    onClick={() => setShowVerificationWizard(true)}
                    className="w-full py-2.5 px-4 bg-red-950 hover:bg-red-900 text-red-400 hover:text-white border border-red-800 hover:border-red-700 rounded-lg font-mono font-bold text-xs uppercase tracking-wider transition flex items-center justify-center gap-1.5 cursor-pointer shadow-md"
                  >
                    <ArrowRightLeft className="h-3.5 w-3.5" />
                    Verify Identity
                  </button>
                </div>
              ) : (
                <div className="space-y-4 flex flex-col justify-between h-full">
                  <div className="space-y-3">
                    <div className="border-b border-slate-800 pb-2">
                      <span className="text-[11px] text-red-400 font-bold uppercase tracking-wider font-mono block">SECONDARY VERIFICATION</span>
                      <span className="text-[10px] text-slate-500 leading-normal block mt-0.5">Independent verification required before authorization.</span>
                    </div>
                    
                    <div className="space-y-1.5 text-xs font-mono font-semibold text-slate-300">
                      <div className="flex items-center gap-2 text-emerald-400">
                        <span>✓</span>
                        <span>Trusted Contact</span>
                      </div>
                      <div className="flex items-center gap-2 text-emerald-400">
                        <span>✓</span>
                        <span>Registered Device</span>
                      </div>
                      <div className="flex items-center gap-2 text-emerald-400">
                        <span>✓</span>
                        <span>Alternate Channel</span>
                      </div>
                    </div>

                    {verificationResult && (
                      <div className="p-2.5 bg-emerald-950/40 border border-emerald-900/50 rounded-lg space-y-1.5 font-mono text-[10px]">
                        <div className="flex items-center gap-1.5 text-[11px] text-emerald-400 font-bold">
                          <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                          VERIFICATION SUCCESSFUL
                        </div>
                        <div>Token: <span className="text-emerald-400 font-bold">{verificationResult.verificationToken}</span></div>
                        <div>Status: <span className="text-white font-bold">Authorized Device Verified</span></div>
                      </div>
                    )}
                  </div>

                  {!verificationResult && (
                    <button
                      id="btn-initiate-verification"
                      onClick={triggerIdentityVerification}
                      disabled={isVerifying}
                      className="w-full py-2.5 px-4 bg-slate-900 hover:bg-slate-850 text-white hover:text-red-400 border border-slate-800 rounded-lg font-mono font-bold text-xs uppercase tracking-wider transition flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      {isVerifying ? (
                        <>
                          <RefreshCw className="h-3.5 w-3.5 animate-spin text-red-500" />
                          Sending challenges...
                        </>
                      ) : (
                        <>
                          <LockKeyhole className="h-3.5 w-3.5 text-slate-400" />
                          [ Initiate Verification ]
                        </>
                      )}
                    </button>
                  )}
                </div>
              )
            ) : (
              <div className="space-y-4 flex flex-col justify-between h-full">
                <div className="space-y-2">
                  <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider font-mono block">Verification Status</span>
                  <p className="text-xs text-slate-400 leading-normal">
                    This stream is currently evaluated as Low Risk. No secondary verification challenge is required.
                  </p>
                </div>
                <button
                  disabled
                  className="w-full py-2.5 px-4 bg-slate-900 text-slate-600 border border-slate-850 rounded-lg font-mono font-bold text-xs uppercase tracking-wider cursor-not-allowed text-center"
                >
                  Verify Identity (Disabled)
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Forensic Signal Extraction Parameters */}
      <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
          <div className="space-y-0.5">
            <h2 className="text-base font-bold text-white font-mono uppercase tracking-wider flex items-center gap-2">
              <Cpu className="h-5 w-5 text-red-500" />
              Forensic XAI & Signal Extraction Laboratory
            </h2>
            <p className="text-xs text-slate-400">Deep mathematical analysis of acoustic micro-structures & explainable AI consensus pipeline.</p>
          </div>
          <span className="text-[10px] bg-slate-950 border border-slate-800 text-slate-400 px-2 py-1 rounded font-mono uppercase">
            Acoustic Feature Extraction Layer Active
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Explainable AI Grad-CAM Spectrogram Heatmap */}
          <div className="p-4 bg-slate-950 border border-slate-800/80 rounded-xl space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest font-mono">
                Grad-CAM Spectrogram Explainability (XAI)
              </span>
              <span className="h-2 w-2 rounded-full bg-red-500 animate-pulse" />
            </div>
            
            <p className="text-[10px] text-slate-400 leading-normal font-sans">
              Visualizing the convolutional feature maps. Highlights frequency bins containing synthetic vocoder phase artifacts:
            </p>

            <div className="grid grid-cols-8 gap-1.5 p-2.5 bg-slate-900 rounded-lg border border-slate-800">
              {Array.from({ length: 32 }).map((_, i) => {
                const isAnomalous = selectedScenario.riskScore > 50 && (i % 5 === 0 || i % 7 === 1);
                const isActive = ticker > 0 || isAnalyzing;
                return (
                  <div 
                    key={i}
                    className={`aspect-square rounded transition-all duration-300 flex items-center justify-center text-[8px] font-mono font-bold ${
                      isActive
                        ? isAnomalous 
                          ? 'bg-red-500/25 border border-red-500 text-red-400 animate-pulse'
                          : 'bg-emerald-500/10 border border-emerald-900/30 text-emerald-500/60'
                        : 'bg-slate-800/40 border border-slate-800 text-slate-600'
                    }`}
                    title={isAnomalous ? "Vocoder Phase-slip Flagged" : "Normal Human Wavelet"}
                  >
                    {isAnomalous ? "!!" : "ok"}
                  </div>
                );
              })}
            </div>
            <div className="flex items-center justify-between text-[9px] font-mono text-slate-500 pt-1">
              <span>0.1 Hz (Bass)</span>
              <span>24 kHz (Treble)</span>
            </div>
          </div>

          {/* Signal Feature Extraction Parameters */}
          <div className="p-4 bg-slate-950 border border-slate-800/80 rounded-xl space-y-4">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest font-mono block">
              Acoustic Feature Extraction parameters
            </span>

            <div className="space-y-3 text-xs font-mono">
              {/* Zero Crossing Rate */}
              <div className="flex justify-between items-center border-b border-slate-900 pb-2">
                <span className="text-slate-400">Zero Crossing Rate (ZCR):</span>
                <span className="text-white font-bold">
                  {ticker > 0 ? `${Math.round(2310 + Math.sin(ticker) * 140)} Hz` : "Awaiting..."}
                </span>
              </div>

              {/* Spectral Rolloff */}
              <div className="flex justify-between items-center border-b border-slate-900 pb-2">
                <span className="text-slate-400">Spectral Rolloff:</span>
                <span className="text-white font-bold">
                  {ticker > 0 ? `${Math.round(4120 + Math.cos(ticker) * 190)} Hz` : "Awaiting..."}
                </span>
              </div>

              {/* MFCC Entropy */}
              <div className="flex justify-between items-center border-b border-slate-900 pb-2">
                <span className="text-slate-400">MFCC Spectral Entropy:</span>
                <span className="text-white font-bold">
                  {ticker > 0 ? (1.35 + Math.sin(ticker) * 0.08).toFixed(2) : "Awaiting..."}
                </span>
              </div>

              {/* Vocal Jitter */}
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Vocal Breathing Jitter:</span>
                <span className={`font-bold ${selectedScenario.riskScore > 50 ? 'text-red-400' : 'text-emerald-400'}`}>
                  {ticker > 0 
                    ? selectedScenario.riskScore > 50 
                      ? '0.002% (Flat/AI)' 
                      : `${(0.14 + Math.sin(ticker) * 0.03).toFixed(3)}% (Human)`
                    : "Awaiting..."}
                </span>
              </div>
            </div>
          </div>

          {/* Consensus Machine Learning Pipeline */}
          <div className="p-4 bg-slate-950 border border-slate-800/80 rounded-xl space-y-3 flex flex-col justify-between">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest font-mono block">
              Multi-Model Consensus Pipeline
            </span>

            <div className="space-y-2.5">
              {/* Model 1: Wav2Vec2 */}
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-slate-400 flex items-center gap-1.5">
                  <span className={`h-1.5 w-1.5 rounded-full ${ticker > 0 ? 'bg-red-500' : 'bg-slate-600'}`} />
                  Wav2Vec2 Antispoofing
                </span>
                <span className="font-bold text-slate-200">
                  {ticker > 0 ? `${selectedScenario.aiVoiceProb}% conviction` : "Idle"}
                </span>
              </div>

              {/* Model 2: ResNet-50 CNN */}
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-slate-400 flex items-center gap-1.5">
                  <span className={`h-1.5 w-1.5 rounded-full ${ticker > 0 ? 'bg-amber-500' : 'bg-slate-600'}`} />
                  CNN Spectrogram Classifier
                </span>
                <span className="font-bold text-slate-200">
                  {ticker > 0 ? `${Math.round(selectedScenario.aiVoiceProb * 0.95)}% conviction` : "Idle"}
                </span>
              </div>

              {/* Model 3: BiLSTM Temporal model */}
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-slate-400 flex items-center gap-1.5">
                  <span className={`h-1.5 w-1.5 rounded-full ${ticker > 0 ? 'bg-indigo-500' : 'bg-slate-600'}`} />
                  BiLSTM Sequence Tracker
                </span>
                <span className="font-bold text-slate-200">
                  {ticker > 0 ? `${Math.round(selectedScenario.aiVoiceProb * 0.95)}% conviction` : "Idle"}
                </span>
              </div>
            </div>

            <div className="border-t border-slate-900 pt-2 text-[10px] text-slate-500 leading-normal">
              Consensus engine integrates structural spectrogram maps, wave sequential timers, and linguistic markers simultaneously to minimize false-positive rates.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
