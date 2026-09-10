import { useState } from 'react';
import { 
  ShieldAlert, 
  CheckCircle2, 
  HelpCircle, 
  Cpu, 
  Zap, 
  Layers
} from 'lucide-react';
import { THREAT_VECTORS } from '../data';

export default function ThreatAnalysis() {
  const [activeVectorIndex, setActiveVectorIndex] = useState(0);
  const activeVector = THREAT_VECTORS[activeVectorIndex];

  return (
    <div className="space-y-6">
      {/* Overview Block with Core USP (Slide 9 compliance) */}
      <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl shadow-xl space-y-4">
        <div className="flex flex-col space-y-3">
          <div className="bg-red-950/40 border border-red-900/30 rounded-xl p-4 text-center space-y-2">
            <span className="text-[10px] text-red-400 font-bold uppercase tracking-widest font-mono">Core Innovation Statement (USP)</span>
            <p className="text-base md:text-lg font-extrabold text-white leading-normal italic">
              "DhwaniAI doesn't just detect a fake voice—it determines whether the interaction should be trusted."
            </p>
            <div className="flex flex-wrap items-center justify-center gap-1.5 text-xs text-slate-300 font-mono mt-2 bg-slate-950/80 px-4 py-2 rounded-lg border border-slate-900">
              <span className="text-red-400 font-bold">Voice</span>
              <span className="text-slate-600">+</span>
              <span className="text-blue-400 font-bold">Identity</span>
              <span className="text-slate-600">+</span>
              <span className="text-amber-400 font-bold">Intent</span>
              <span className="text-slate-600">+</span>
              <span className="text-purple-400 font-bold">Context</span>
              <span className="text-slate-400">→</span>
              <span className="bg-red-900/40 text-red-300 px-1.5 py-0.5 rounded font-black">Risk Score</span>
              <span className="text-slate-400">→</span>
              <span className="bg-emerald-950 text-emerald-400 px-1.5 py-0.5 border border-emerald-900/40 rounded font-black">Preventive Action</span>
            </div>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed pt-1">
            DhwaniAI utilizes an advanced multi-layered sensor fusion pipeline. By merging real-time acoustic biometrics, conversational NLP, and contextual parameters, the platform proactively preempts sophisticated generative AI-voice cloning scams and vishing attempts.
          </p>
        </div>
      </div>

      {/* Grid: Vector list on Left, Detailed breakdown on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left column: Vector list */}
        <div className="lg:col-span-1 space-y-3">
          <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
            Security Threat Dimensions
          </label>
          <div className="space-y-2">
            {THREAT_VECTORS.map((vector, idx) => {
              const isActive = activeVectorIndex === idx;
              return (
                <button
                  key={vector.title}
                  onClick={() => setActiveVectorIndex(idx)}
                  className={`w-full p-4 text-left border rounded-xl transition cursor-pointer flex justify-between items-start ${
                    isActive 
                      ? 'border-red-500/50 bg-slate-900/60 shadow-lg shadow-red-950/10' 
                      : 'border-slate-800 hover:border-slate-700 bg-slate-950/35'
                  }`}
                >
                  <div className="space-y-1">
                    <h3 className={`font-bold text-xs ${isActive ? 'text-white' : 'text-slate-300'}`}>
                      {vector.title}
                    </h3>
                    <p className="text-[10px] text-slate-400 line-clamp-1">
                      {vector.description}
                    </p>
                  </div>
                  <span className={`text-[8px] font-black tracking-wider uppercase px-1.5 py-0.5 rounded border ml-2 ${
                    vector.severity === 'CRITICAL' ? 'bg-red-950/40 text-red-400 border-red-900/40' :
                    vector.severity === 'HIGH' ? 'bg-amber-950/40 text-amber-400 border-amber-900/40' :
                    'bg-sky-950/40 text-sky-400 border-sky-900/40'
                  }`}>
                    {vector.severity}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Quick FAQ / Info block */}
          <div className="p-4 bg-slate-900/30 border border-slate-800/80 rounded-xl space-y-2">
            <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
              <HelpCircle className="h-4 w-4 text-slate-400" />
              What is Voice Cloning?
            </h4>
            <p className="text-[10px] text-slate-400 leading-relaxed">
              Using modern generative AI models like VALL-E, Bark, or custom vocoders, adversaries can copy any voice print from 
              mere seconds of scrap social media audio to fabricate arbitrary statements in real-time.
            </p>
          </div>
        </div>

        {/* Right column: Detailed breakdown */}
        <div className="lg:col-span-2 p-6 bg-slate-900/60 border border-slate-800/80 rounded-xl space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800/60 pb-4">
            <div className="space-y-1">
              <span className="text-[10px] text-slate-500 font-mono font-bold tracking-widest uppercase">DIMENSION DIAGNOSTIC</span>
              <h2 className="text-lg font-bold text-white">{activeVector.title}</h2>
            </div>
            <span className={`self-start sm:self-auto text-xs font-extrabold px-2.5 py-1 rounded border ${
              activeVector.severity === 'CRITICAL' ? 'bg-red-950/40 text-red-400 border-red-900/40' :
              activeVector.severity === 'HIGH' ? 'bg-amber-950/40 text-amber-400 border-amber-900/40' :
              'bg-sky-950/40 text-sky-400 border-sky-900/40'
            }`}>
              {activeVector.severity} ALERT RANK
            </span>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">How the Threat Operates</h3>
              <p className="text-xs text-slate-300 leading-relaxed font-sans">
                {activeVector.description}
              </p>
            </div>

            <div className="space-y-2 pt-2">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <ShieldAlert className="h-4 w-4 text-amber-500" />
                Detection Indicators & Forensic Signatures
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {activeVector.indicators.map((indicator, index) => (
                  <div key={index} className="p-3 bg-slate-950 border border-slate-800/60 rounded-lg flex items-start gap-2">
                    <span className="text-[10px] font-mono text-red-400 font-bold bg-red-950/30 px-1.5 py-0.5 rounded">
                      #{index + 1}
                    </span>
                    <p className="text-[11px] text-slate-300 leading-normal font-sans">
                      {indicator}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Model Architecture Technical Insights */}
            <div className="pt-4 border-t border-slate-800/60 space-y-3">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <Cpu className="h-4 w-4 text-blue-400" />
                Underlying AI/ML Guard Models
              </h3>
              <div className="p-4 bg-slate-950/80 border border-slate-800 rounded-xl space-y-3">
                <div className="flex items-start gap-3">
                  <div className="p-1.5 bg-blue-950/40 border border-blue-900/40 rounded text-blue-400 mt-0.5">
                    <Zap className="h-4 w-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white">Dynamic Neural Phase-Shift Analyzer</h4>
                    <p className="text-[10px] text-slate-400 leading-relaxed mt-0.5">
                      Monitors microsecond pitch cycles to identify the "phase-slip" characteristic of neural audio synthesis models, which is completely absent in organic human vocality.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-1.5 bg-purple-950/40 border border-purple-900/40 rounded text-purple-400 mt-0.5">
                    <Zap className="h-4 w-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white">Linguistic Coercion Transformers</h4>
                    <p className="text-[10px] text-slate-400 leading-relaxed mt-0.5">
                      Processes real-time NLP text vectors to identify structural semantic hallmarks of social engineering (scarcity, emergency coercion, isolation commands).
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Recommended Defensive Actions Section */}
            <div className="p-4 bg-emerald-950/15 border border-emerald-900/40 rounded-xl space-y-2">
              <h3 className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4" />
                Recommended Defensive Best Practice
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                If the detector flags any dimension of this category as high-risk, suspend active verbal transactions. Immediately terminate the call and initiate verification on a trusted, offline pre-saved physical communications channel (e.g., standard cellular fallback or in-person verification).
              </p>
            </div>

          </div>
        </div>

      </div>

      {/* Call Security Architecture Diagram */}
      <div className="p-6 bg-slate-900/40 border border-slate-800/80 rounded-xl space-y-4">
        <h2 className="text-sm font-bold text-white uppercase tracking-wider">
          Integrated Multi-Sensor Fusion Pipeline
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-3 text-center">
          
          <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-2">
            <div className="text-xs font-bold text-red-400">1. Raw Signal Capture</div>
            <p className="text-[10px] text-slate-500">
              Web Audio API ingests voice lines or live inputs, isolating audio stream parameters.
            </p>
          </div>

          <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-2">
            <div className="text-xs font-bold text-amber-400">2. Synthetics Biometrics</div>
            <p className="text-[10px] text-slate-500">
              Passes signals through neural vocoder filters evaluating vocal cloning probabilities.
            </p>
          </div>

          <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-2">
            <div className="text-xs font-bold text-blue-400">3. Real-Time STT</div>
            <p className="text-[10px] text-slate-500">
              Translates continuous audio waveforms into a normalized textual transcription log.
            </p>
          </div>

          <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-2">
            <div className="text-xs font-bold text-purple-400">4. Intent NLP Fusion</div>
            <p className="text-[10px] text-slate-500">
              Evaluates statements for high-pressure timelines, bank wire demands, or coercion.
            </p>
          </div>

          <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-2">
            <div className="text-xs font-bold text-emerald-400">5. Preventive Action</div>
            <p className="text-[10px] text-slate-500">
              Generates combined risk score (0-100) and triggers automated warnings or call blocks.
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}
