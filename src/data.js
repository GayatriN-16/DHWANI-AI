export const SCENARIOS = [
  {
    id: 'scen_genuine',
    name: 'Scenario 1 — Genuine Call',
    label: 'Genuine Call',
    description: 'An authenticated and trusted family contact calling to chat about a casual, daily event.',
    transcript: 'Hey beta, I just wanted to check if you reached your office safely. The weather forecast says it might rain heavily this evening, so remember to carry your umbrella when coming back. Give me a call when you are free. Love you, take care!',
    aiVoiceProb: 3,
    speakerMatch: 98,
    detectedIntent: 'Normal / Casual Conversation',
    threatLevel: 'LOW',
    riskScore: 3,
    recommendedAction: 'Allow',
    explanation: 'Biometric voiceprint verification confirms speaker is mother with 98% identity confidence. AI-cloning synthetics confidence is extremely low (3%). No malicious patterns, URLs, financial demands, or artificial urgency flags found.',
    duration: '0:18',
    callerName: 'Mom (Verified Contact)',
    callerNumber: '+91 94440 XXXXX',
    category: 'Trusted Contact',
    riskHistory: [
      { time: '0s', risk: 5 },
      { time: '4s', risk: 4 },
      { time: '8s', risk: 3 },
      { time: '12s', risk: 3 }
    ],
    riskFactors: {
      voiceAuthenticity: 'CLEARED',
      speakerMismatch: 'CLEARED',
      fraudIntent: 'CLEARED',
      urgency: 'LOW',
      transactionRisk: 'LOW',
      contextAnomaly: 'LOW'
    }
  },
  {
    id: 'scen_ceo_clone',
    name: 'Scenario 2 — AI-Cloned CEO',
    label: 'AI-Cloned CEO',
    description: 'A synthetic voice imitating the Chief Executive Officer instructing an immediate confidential business transfer.',
    transcript: 'This is the CEO. We are closing an extremely time-sensitive acquisition deal right now. I need you to initiate a wire transfer of ₹45 lakh to our vendor immediately. Do not discuss this with anyone else as it is highly confidential and subject to a strict NDA. Send the confirmation receipt to my private email.',
    aiVoiceProb: 94,
    speakerMatch: 15,
    detectedIntent: 'Financial Request Detected',
    threatLevel: 'CRITICAL',
    riskScore: 98,
    recommendedAction: 'Secondary Verification Required',
    explanation: 'AI voice deepfake detected with 94% confidence. Phase phase-shift and pitch-modulation irregularities match generative neural vocoders. Speaker verification failed against the CEO\'s master voiceprint. Language model identified corporate social engineering triggers.',
    duration: '0:28',
    callerName: 'CEO (Spoofed Clone)',
    callerNumber: '+91 99002 XXXXX',
    category: 'AI Voice Cloning',
    riskHistory: [
      { time: '0s', risk: 15 },
      { time: '5s', risk: 30 },
      { time: '10s', risk: 65 },
      { time: '15s', risk: 85 },
      { time: '20s', risk: 93 },
      { time: '25s', risk: 98 }
    ],
    riskFactors: {
      voiceAuthenticity: 'HIGH RISK',
      speakerMismatch: 'HIGH RISK',
      fraudIntent: 'DETECTED',
      urgency: 'HIGH',
      transactionRisk: 'HIGH',
      contextAnomaly: 'HIGH'
    }
  },
  {
    id: 'scen_human_impersonator',
    name: 'Scenario 3 — Human Impersonator',
    label: 'Human Impersonator',
    description: 'A real human social engineer claiming to be from the electricity board, demanding payment to stop immediate power cut.',
    transcript: 'Hello, this is the State Electricity Board. Your domestic power supply is scheduled for immediate disconnection in 30 minutes due to long-pending dues. To avoid this, call our helpline or click the official secure link we just sent via SMS to pay ₹4,500 now. Your file reference number is EB-9042.',
    aiVoiceProb: 5,
    speakerMatch: 12,
    detectedIntent: 'Fraud Intent: Detected',
    threatLevel: 'HIGH',
    riskScore: 85,
    recommendedAction: 'Verify Identity',
    explanation: 'Acoustic analysis shows real human caller (low AI voice probability), but caller ID verification indicates mismatch against registered contact database. Fraud intent is flagged due to immediate disconnection threats and external link demands.',
    duration: '0:25',
    callerName: 'Electricity Officer (Impersonator)',
    callerNumber: '+91 81033 XXXXX',
    category: 'Vishing Impersonation',
    riskHistory: [
      { time: '0s', risk: 5 },
      { time: '5s', risk: 20 },
      { time: '10s', risk: 45 },
      { time: '15s', risk: 65 },
      { time: '20s', risk: 78 },
      { time: '25s', risk: 85 }
    ],
    riskFactors: {
      voiceAuthenticity: 'CLEARED',
      speakerMismatch: 'HIGH RISK',
      fraudIntent: 'DETECTED',
      urgency: 'HIGH',
      transactionRisk: 'HIGH',
      contextAnomaly: 'HIGH'
    }
  }
];

export const MOCK_INCIDENTS = [
  {
    id: 'INC-2026-001',
    callerName: 'CEO (Spoofed Clone)',
    callerNumber: '+91 99002 XXXXX',
    timestamp: '2026-09-10 10:15',
    duration: '0:28',
    transcript: 'This is the CEO. We are closing an extremely time-sensitive acquisition deal right now. I need you to initiate a wire transfer of ₹45 lakh to our vendor immediately...',
    threatLevel: 'CRITICAL',
    riskScore: 98,
    aiVoiceProb: 94,
    speakerMatch: 15,
    threatType: 'AI Voice Cloning',
    status: 'Blocked',
    notes: 'Blocked wire transfer. Advised secondary out-of-band verification.',
    riskFactors: {
      voiceAuthenticity: 'HIGH RISK',
      speakerMismatch: 'HIGH RISK',
      fraudIntent: 'DETECTED',
      urgency: 'HIGH',
      transactionRisk: 'HIGH',
      contextAnomaly: 'HIGH'
    }
  },
  {
    id: 'INC-2026-002',
    callerName: 'Electricity Officer (Impersonator)',
    callerNumber: '+91 81033 XXXXX',
    timestamp: '2026-09-09 14:12',
    duration: '0:25',
    transcript: 'Hello, this is the State Electricity Board. Your power supply is scheduled for immediate disconnection in 30 minutes due to long-pending dues...',
    threatLevel: 'HIGH',
    riskScore: 85,
    aiVoiceProb: 5,
    speakerMatch: 12,
    threatType: 'Vishing Impersonation',
    status: 'Warned',
    notes: 'In-call overlay warned user of high risk and spoofed identity. Action: Verify Identity initiated.',
    riskFactors: {
      voiceAuthenticity: 'CLEARED',
      speakerMismatch: 'HIGH RISK',
      fraudIntent: 'DETECTED',
      urgency: 'HIGH',
      transactionRisk: 'HIGH',
      contextAnomaly: 'HIGH'
    }
  },
  {
    id: 'INC-2026-003',
    callerName: 'Mom (Verified Contact)',
    callerNumber: '+91 94440 XXXXX',
    timestamp: '2026-09-09 09:30',
    duration: '0:18',
    transcript: 'Hey beta, I just wanted to check if you reached your office safely. The weather forecast says it might rain heavily...',
    threatLevel: 'LOW',
    riskScore: 3,
    aiVoiceProb: 3,
    speakerMatch: 98,
    threatType: 'Safe Call',
    status: 'Allowed',
    notes: 'Verified contact. Audio voiceprint matched registered biometric data.',
    riskFactors: {
      voiceAuthenticity: 'CLEARED',
      speakerMismatch: 'CLEARED',
      fraudIntent: 'CLEARED',
      urgency: 'LOW',
      transactionRisk: 'LOW',
      contextAnomaly: 'LOW'
    }
  }
];

export const THREAT_VECTORS = [
  {
    title: 'AI Voice Cloning & Synthetics',
    description: 'Generative AI models copy a target\'s vocal parameters using as little as 3 seconds of reference audio. DhwaniAI analyzes these patterns to verify voice authenticity.',
    indicators: [
      'Lack of natural micro-breaths or speech variance.',
      'Robotic, static-phase pitch profiles.',
      'Synthetic vocoder distortion signatures.'
    ],
    severity: 'CRITICAL'
  },
  {
    title: 'Acoustic Biometric Verification',
    description: 'Compares real-time caller vocals with registered master voiceprints from trusted contacts to calculate speaker match indexes.',
    indicators: [
      'Low speaker match percentage (<30%) for known contacts.',
      'Caller ID spoofing mismatches.',
      'Background acoustic filter anomalies.'
    ],
    severity: 'HIGH'
  },
  {
    title: 'Conversational Intent & NLP Analysis',
    description: 'Analyzes real-time transcript semantics for urgency, OTP demands, financial transfers, and social engineering coercion patterns.',
    indicators: [
      'Demands for immediate transfers or OTPs.',
      'High-pressure deadlines or isolation guidelines.',
      'Legal threats or impersonation jargon.'
    ],
    severity: 'CRITICAL'
  }
];
