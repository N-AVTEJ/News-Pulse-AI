export interface Story {
  id: string;
  headline: string;
  summary: string;
  category: 'ai-tech' | 'business' | 'world';
  source: {
    name: string;
    reliability: string; // e.g. "98% HIGH" or "75% MEDIUM"
    tier: 'HIGH' | 'MEDIUM' | 'LOW';
  };
  publishedAt: string;
  importanceScore: number; // 0 - 100
  importanceLabel: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  confidenceScore: number; // 0 - 100
  corroboratingSources: number;
  verificationStatus: 'VERIFIED' | 'UNVERIFIED' | 'VERIFYING';
  whatHappened: string;
  whyItMatters: string;
  potentialImpact: string;
  keyFacts: string[];
  timeline: { time: string; event: string }[];
  relatedStories: string[]; // Story IDs
  isBreaking: boolean;
}

export interface Agent {
  id: string;
  name: string;
  role: string;
  status: 'RUNNING' | 'IDLE' | 'VERIFYING' | 'ANALYZING';
  currentTask: string;
  storiesProcessed: number;
  lastExecution: string;
  runtime: string;
}

export interface Source {
  id: string;
  name: string;
  category: string;
  status: 'ACTIVE' | 'OFFLINE' | 'SYNCING';
  reliability: string;
  reliabilityTier: 'HIGH' | 'MEDIUM' | 'LOW';
  storiesCollected: number;
  lastChecked: string;
}

export interface ActivityLog {
  id: string;
  timestamp: string;
  agentId: string;
  agentName: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
}

// ----------------------------------------------------
// Mock Stories Data (Clearly marked as Demo/Mock)
// ----------------------------------------------------
export const mockStories: Story[] = [
  {
    id: "story-1",
    headline: "[DEMO] Global Cloud Provider BGP Route Leak Disrupts International Traffic",
    summary: "A major BGP route leak has misdirected global web traffic through a regional ISP in Western Europe, causing latency spikes and packet loss for key financial terminals, communication networks, and cloud services worldwide.",
    category: "world",
    source: {
      name: "BGP Watch Dog",
      reliability: "98% High",
      tier: "HIGH"
    },
    publishedAt: "10 mins ago",
    importanceScore: 94,
    importanceLabel: "CRITICAL",
    confidenceScore: 98,
    corroboratingSources: 14,
    verificationStatus: "VERIFIED",
    whatHappened: "At approximately 12:45 UTC, a regional ISP accidentally advertised routes claiming to be the optimal path for thousands of major IP blocks. This resulted in traffic being blackholed or severely throttled.",
    whyItMatters: "Border Gateway Protocol (BGP) is the routing backbone of the internet. Leaks of this magnitude compromise critical business apps, showing systemic vulnerability in current routing trust mechanisms.",
    potentialImpact: "Global commerce slowdown, temporary loss of trading terminal feeds, and high priority communications failures across transatlantic corridors.",
    keyFacts: [
      "Over 12,000 global IP prefixes misrouted.",
      "Primary impact centered on Europe and Eastern US seaboard.",
      "ISP router misconfiguration identified as the root cause.",
      "Traffic redirected to regional node with only 10Gbps throughput capability."
    ],
    timeline: [
      { time: "12:45 UTC", event: "BGP leak initiates from AS-94021." },
      { time: "12:52 UTC", event: "Autonomous monitoring triggers first anomaly alert." },
      { time: "13:00 UTC", event: "Tier 1 transit providers begin filtering leaked routes." },
      { time: "13:10 UTC", event: "Traffic flows return to 90% normal levels." }
    ],
    relatedStories: ["story-3", "story-8"],
    isBreaking: true
  },
  {
    id: "story-2",
    headline: "[DEMO] Breakthrough in Silicon Spin Qubits Achieves 99.9% Quantum Gate Fidelity",
    summary: "Researchers have achieved a critical milestone in semiconductor-based quantum computers, demonstrating single-spin and two-spin qubit gate operations with error rates below the fault-tolerant threshold.",
    category: "ai-tech",
    source: {
      name: "Quantum Nano-Journal",
      reliability: "95% High",
      tier: "HIGH"
    },
    publishedAt: "32 mins ago",
    importanceScore: 88,
    importanceLabel: "HIGH",
    confidenceScore: 94,
    corroboratingSources: 6,
    verificationStatus: "VERIFIED",
    whatHappened: "A collaborative lab effort fabricated a silicon-based quantum device achieving a gate fidelity of 99.9%. This bypasses the theoretical limits previously causing high qubit coherence decay.",
    whyItMatters: "99.9% fidelity is widely regarded as the entry gate for quantum error correction. Reaching this milestone using traditional silicon manufacturing implies we can leverage existing chip fabs.",
    potentialImpact: "Accelerates timeline for commercially viable quantum decryptors and chemical simulation platforms by 3-5 years.",
    keyFacts: [
      "Fidelity level of 99.9% measured on 2-qubit operations.",
      "Uses isotopically purified silicon-28 substrate.",
      "Fabrication relies on existing extreme ultraviolet (EUV) lithography tools.",
      "Coherence time extended to over 2.5 seconds at 100mK temperatures."
    ],
    timeline: [
      { time: "Monday", event: "Paper submission to Nature Nanotechnology." },
      { time: "Tuesday", event: "Independent review panel logs replication success." },
      { time: "Today", event: "Full public presentation of research findings." }
    ],
    relatedStories: ["story-4"],
    isBreaking: false
  },
  {
    id: "story-3",
    headline: "[DEMO] Central Banks Shift Rates as AI Automation Boosts Output Metrics by 4%",
    summary: "A joint report from international monetary authorities notes an unexpected 4% jump in services sector productivity, prompting a hawkish shift in interest rate projections to combat potential demand-driven inflation.",
    category: "business",
    source: {
      name: "Apex Finance Daily",
      reliability: "96% High",
      tier: "HIGH"
    },
    publishedAt: "1 hour ago",
    importanceScore: 78,
    importanceLabel: "HIGH",
    confidenceScore: 89,
    corroboratingSources: 8,
    verificationStatus: "VERIFIED",
    whatHappened: "Widespread deployment of automated agents in customer support, code development, and legal analysis has generated a structural surge in service sector output with lower labor cost structures.",
    whyItMatters: "Traditional economic models did not anticipate such rapid velocity of productivity gains. This complicates central bank tasks of balancing unemployment rates against price stability.",
    potentialImpact: "Interest rates are projected to remain higher for longer as policy makers assess the neutral rate under a high-productivity regime.",
    keyFacts: [
      "Service sector productivity index rose 4.1% annualized.",
      "Labor demand in administrative tasks fell by 18%.",
      "Corporate margins in financial services increased by 350 basis points.",
      "Core inflation targets temporarily adjusted upward."
    ],
    timeline: [
      { time: "08:00 UTC", event: "Joint monetary report released." },
      { time: "08:30 UTC", event: "Equity index futures react with 1.2% dip." },
      { time: "09:15 UTC", event: "Federal reserve governor hints at potential rate freeze." }
    ],
    relatedStories: ["story-1", "story-6"],
    isBreaking: false
  },
  {
    id: "story-4",
    headline: "[DEMO] Open Source Coalition Releases 'Lumina-70B' with Advanced Reasoning Kernel",
    summary: "An open-source AI group has unveiled Lumina-70B, a model utilizing a novel 'System 2' planning loop that matches proprietary frontier models on competitive math and programming benchmarks.",
    category: "ai-tech",
    source: {
      name: "GitHub Open Intel",
      reliability: "92% High",
      tier: "HIGH"
    },
    publishedAt: "2 hours ago",
    importanceScore: 82,
    importanceLabel: "HIGH",
    confidenceScore: 91,
    corroboratingSources: 9,
    verificationStatus: "VERIFIED",
    whatHappened: "A distributed compute collective trained and open-sourced a 70-billion parameter model. It features an integrated reasoning trace that executes code sandboxes during inference to verify its own logic.",
    whyItMatters: "This narrows the gap between commercial close-sourced frontier providers and open-source models, shifting the developer ecosystem towards local, self-hosted deployments.",
    potentialImpact: "Drastic cost reduction for enterprises building complex agent networks. Reduction of subscription revenue for API providers.",
    keyFacts: [
      "Achieved 91.2% on SWE-bench Verified.",
      "Includes weights, training dataset recipes, and evaluation scripts.",
      "Trained using a decentralized cluster of 4,000 consumer GPUs.",
      "Runs locally on unified memory desktop workstations."
    ],
    timeline: [
      { time: "Yesterday", event: "Model weights uploaded to Hugging Face." },
      { time: "02:00 UTC", event: "GitHub repository reaches 10k stars." },
      { time: "04:30 UTC", event: "Independent evaluation logs verify benchmark numbers." }
    ],
    relatedStories: ["story-2", "story-8"],
    isBreaking: false
  },
  {
    id: "story-5",
    headline: "[DEMO] Global Maritime Hub Implements AI Dispatch System to Reduce Port Gridlocks",
    summary: "The world's largest container shipping terminal reports a 14% drop in average anchorage wait times following the deployment of a real-time predictive vessel dispatch system.",
    category: "business",
    source: {
      name: "Global Maritime News",
      reliability: "90% High",
      tier: "HIGH"
    },
    publishedAt: "3 hours ago",
    importanceScore: 71,
    importanceLabel: "HIGH",
    confidenceScore: 87,
    corroboratingSources: 4,
    verificationStatus: "VERIFIED",
    whatHappened: "Deploying deep reinforcement learning algorithms to coordinate tugboats, pilots, and berth spaces dynamically rather than using static shift tables.",
    whyItMatters: "Port congestion is a major source of carbon emissions and supply chain inflation. This proves minor scheduling optimizations can yield macro-level logistical efficiencies.",
    potentialImpact: "Lower fuel consumption for shipping lines, shorter lead times for retail goods, and reduced carbon footprint for regional ports.",
    keyFacts: [
      "Average anchorage time reduced from 34 hours to 29 hours.",
      "Tugboat utilization efficiency improved by 22%.",
      "System accounts for real-time wave heights, tides, and weather data."
    ],
    timeline: [
      { time: "June 1", event: "Pilot system deployed at Berth 4." },
      { time: "July 15", event: "System expanded port-wide." },
      { time: "Today", event: "First quarter operational audit results published." }
    ],
    relatedStories: ["story-3"],
    isBreaking: false
  },
  {
    id: "story-6",
    headline: "[DEMO] Critical Cobalt Fissure Discovered in Pacific Basin Sparking Mining Rights Debate",
    summary: "Undersea mapping drones have discovered a massive geothermal cobalt fissure in international waters, initiating a geopolitical race to claim exploratory and mining rights among oceanic powers.",
    category: "world",
    source: {
      name: "Oceanic Resource Map",
      reliability: "89% High",
      tier: "HIGH"
    },
    publishedAt: "4 hours ago",
    importanceScore: 75,
    importanceLabel: "HIGH",
    confidenceScore: 85,
    corroboratingSources: 7,
    verificationStatus: "VERIFIED",
    whatHappened: "An exploration vessel charted a 400-mile long rift rich in pure cobalt nodules. The location is in international waters, outside standard exclusive economic zones (EEZ).",
    whyItMatters: "Cobalt is key for energy storage and batteries. With land-based supply chains highly consolidated, this discovery opens a new frontier for mineral security and environmental concern.",
    potentialImpact: "Strained maritime relations, heavy debates in the International Seabed Authority, and fluctuations in raw material pricing.",
    keyFacts: [
      "Estimated 8.2 million metric tons of cobalt in high purity state.",
      "Located at a depth of 4,100 meters.",
      "Environmental groups warn of catastrophic deep-sea biodiversity loss."
    ],
    timeline: [
      { time: "06:00 UTC", event: "Exploration report submitted to the UN." },
      { time: "07:00 UTC", event: "Three maritime nations request emergency consultations." },
      { time: "09:30 UTC", event: "Cobalt spot price drops 3.2% in early trading." }
    ],
    relatedStories: ["story-3"],
    isBreaking: false
  },
  {
    id: "story-7",
    headline: "[DEMO] Leading Semiconductor Fab Announces High-Yield Solid State Battery Production",
    summary: "A major electronics manufacturer has successfully modified its microchip printing lines to output thin-film solid state batteries, claiming energy density increases of up to 80% over lithium-ion.",
    category: "business",
    source: {
      name: "Silicon Fab Intelligence",
      reliability: "85% Medium",
      tier: "MEDIUM"
    },
    publishedAt: "5 hours ago",
    importanceScore: 68,
    importanceLabel: "MEDIUM",
    confidenceScore: 74,
    corroboratingSources: 3,
    verificationStatus: "VERIFYING",
    whatHappened: "A surprise press release claims successful application of silicon lithography techniques to deposit solid state electrolyte layers with zero micro-fractures during cooling.",
    whyItMatters: "Solid state batteries have been held back by high manufacturing error rates. Using chip fabs could allow the industry to bypass expensive new factory builds.",
    potentialImpact: "EV range extension, smaller consumer electronics devices, and shift in battery manufacturing supply chains from raw chemical processors to advanced silicon fabs.",
    keyFacts: [
      "Claims energy density of 480 Wh/kg.",
      "Yield rate currently sits at 65% (below commercial standards, but improving).",
      "Requires high vacuum manufacturing chambers."
    ],
    timeline: [
      { time: "04:00 UTC", event: "Press release issued." },
      { time: "05:30 UTC", event: "Independent battery testing labs request samples." }
    ],
    relatedStories: ["story-2", "story-9"],
    isBreaking: false
  },
  {
    id: "story-8",
    headline: "[DEMO] Consensus Framework Proposed for Distributed AI Agent Safety Standards",
    summary: "A coalition of twenty security groups has drafted a regulatory framework aimed at governing autonomous agents capable of direct financial transactions and API interactions.",
    category: "ai-tech",
    source: {
      name: "SafeNet Foundation",
      reliability: "91% High",
      tier: "HIGH"
    },
    publishedAt: "6 hours ago",
    importanceScore: 58,
    importanceLabel: "MEDIUM",
    confidenceScore: 82,
    corroboratingSources: 5,
    verificationStatus: "VERIFIED",
    whatHappened: "Draft safety rules propose mandatory sandboxing, real-time fiscal caps, and automated kill-switches for multi-agent systems operating in public environments.",
    whyItMatters: "As agents gain agency to execute money transfers and edit web systems, unstructured bugs could trigger flash loops or financial losses.",
    potentialImpact: "Standardized audit procedures for enterprise software, mandatory registrations for agents with high fiscal capacity.",
    keyFacts: [
      "Proposes limit of $500 per transaction without human-in-the-loop signoff.",
      "Mandates cryptographic signatures for agent-initiated web requests."
    ],
    timeline: [
      { time: "Yesterday", event: "Framework outline uploaded to open registry." },
      { time: "Today", event: "Five top tech firms issue letters of support." }
    ],
    relatedStories: ["story-4"],
    isBreaking: false
  },
  {
    id: "story-9",
    headline: "[DEMO] Neuromorphic Edge Coprocessor Enters Commercial Sampling Stage",
    summary: "An startup focusing on spike-based neural processing has shipped its first edge hardware samples, designed to run local sensor processing at less than 10 milliwatts of power.",
    category: "ai-tech",
    source: {
      name: "Hardware Edge Wire",
      reliability: "80% Medium",
      tier: "MEDIUM"
    },
    publishedAt: "8 hours ago",
    importanceScore: 42,
    importanceLabel: "LOW",
    confidenceScore: 78,
    corroboratingSources: 2,
    verificationStatus: "VERIFYING",
    whatHappened: "Shipment of test chips that process visual and audio streams using spiking neural networks, replicating brain-like efficiency on cheap silicon.",
    whyItMatters: "Edge AI is heavily constrained by battery life in IoT devices. A 10mW chip could enable years of continuous local anomaly detection.",
    potentialImpact: "Smart security cams running 100% offline, wearable health monitors with long-term battery lifespans.",
    keyFacts: [
      "Power consumption measured at 8.4mW under continuous full load.",
      "Compatible with PyTorch model structures via converter utility."
    ],
    timeline: [
      { time: "01:00 UTC", event: "Startup ships developer dev-kits to alpha partners." }
    ],
    relatedStories: ["story-7"],
    isBreaking: false
  }
];

// ----------------------------------------------------
// Mock Agents Data
// ----------------------------------------------------
export const mockAgents: Agent[] = [
  {
    id: "agent-1",
    name: "AI & Tech Scout",
    role: "Scans developer repos, preprint papers, and technology logs.",
    status: "RUNNING",
    currentTask: "Parsing latest quantum qubit papers on arXiv...",
    storiesProcessed: 1420,
    lastExecution: "2 mins ago",
    runtime: "24h 15m"
  },
  {
    id: "agent-2",
    name: "Business Scout",
    role: "Monitors financial filings, commodity feeds, and regulatory updates.",
    status: "IDLE",
    currentTask: "Waiting for SEC RSS feed refresh...",
    storiesProcessed: 894,
    lastExecution: "15 mins ago",
    runtime: "24h 15m"
  },
  {
    id: "agent-3",
    name: "World News Scout",
    role: "Filters international press wires and satellite alerts.",
    status: "RUNNING",
    currentTask: "Analyzing regional feed streams in European zones...",
    storiesProcessed: 2310,
    lastExecution: "1 min ago",
    runtime: "24h 15m"
  },
  {
    id: "agent-4",
    name: "Verification Agent",
    role: "Cross-references claims against secondary sources and network logs.",
    status: "VERIFYING",
    currentTask: "Corroborating oceanic cobalt reports with shipping records...",
    storiesProcessed: 488,
    lastExecution: "Just now",
    runtime: "24h 15m"
  },
  {
    id: "agent-5",
    name: "Ranking Agent",
    role: "Scores importance metrics based on global impact matrices.",
    status: "ANALYZING",
    currentTask: "Re-indexing priority weighting for BGP route leak...",
    storiesProcessed: 4562,
    lastExecution: "Just now",
    runtime: "24h 15m"
  },
  {
    id: "agent-6",
    name: "Analysis Agent",
    role: "Generates semantic structures, impacts, and timelines.",
    status: "ANALYZING",
    currentTask: "Structuring key facts for Quantum gate breakthroughs...",
    storiesProcessed: 3209,
    lastExecution: "1 min ago",
    runtime: "24h 15m"
  },
  {
    id: "agent-7",
    name: "Summary Agent",
    role: "Drafts concise summaries and executive abstracts.",
    status: "IDLE",
    currentTask: "Awaiting new verified content blocks...",
    storiesProcessed: 3180,
    lastExecution: "5 mins ago",
    runtime: "24h 15m"
  }
];

// ----------------------------------------------------
// Mock Sources Data (Treat as Demo values)
// ----------------------------------------------------
export const mockSources: Source[] = [
  {
    id: "src-1",
    name: "BGP Watch Dog",
    category: "World Infrastructure",
    status: "ACTIVE",
    reliability: "98% High",
    reliabilityTier: "HIGH",
    storiesCollected: 125,
    lastChecked: "2 mins ago"
  },
  {
    id: "src-2",
    name: "Quantum Nano-Journal",
    category: "Academic / Tech",
    status: "ACTIVE",
    reliability: "95% High",
    reliabilityTier: "HIGH",
    storiesCollected: 52,
    lastChecked: "1 min ago"
  },
  {
    id: "src-3",
    name: "Apex Finance Daily",
    category: "Financial / Business",
    status: "ACTIVE",
    reliability: "96% High",
    reliabilityTier: "HIGH",
    storiesCollected: 310,
    lastChecked: "5 mins ago"
  },
  {
    id: "src-4",
    name: "GitHub Open Intel",
    category: "Developer / Open Source",
    status: "ACTIVE",
    reliability: "92% High",
    reliabilityTier: "HIGH",
    storiesCollected: 78,
    lastChecked: "3 mins ago"
  },
  {
    id: "src-5",
    name: "Global Maritime News",
    category: "Logistics / Business",
    status: "ACTIVE",
    reliability: "90% High",
    reliabilityTier: "HIGH",
    storiesCollected: 215,
    lastChecked: "12 mins ago"
  },
  {
    id: "src-6",
    name: "Oceanic Resource Map",
    category: "Scientific / World",
    status: "ACTIVE",
    reliability: "89% High",
    reliabilityTier: "HIGH",
    storiesCollected: 94,
    lastChecked: "4 mins ago"
  },
  {
    id: "src-7",
    name: "Silicon Fab Intelligence",
    category: "Hardware / Business",
    status: "ACTIVE",
    reliability: "85% Medium",
    reliabilityTier: "MEDIUM",
    storiesCollected: 45,
    lastChecked: "5 mins ago"
  },
  {
    id: "src-8",
    name: "SafeNet Foundation",
    category: "Policy / AI Tech",
    status: "ACTIVE",
    reliability: "91% High",
    reliabilityTier: "HIGH",
    storiesCollected: 32,
    lastChecked: "6 hours ago"
  },
  {
    id: "src-9",
    name: "Hardware Edge Wire",
    category: "Hardware / IoT",
    status: "SYNCING",
    reliability: "80% Medium",
    reliabilityTier: "MEDIUM",
    storiesCollected: 12,
    lastChecked: "Just now"
  },
  {
    id: "src-10",
    name: "Alternative Intel Wire",
    category: "Unverified Press",
    status: "OFFLINE",
    reliability: "72% Low",
    reliabilityTier: "LOW",
    storiesCollected: 3,
    lastChecked: "1 day ago"
  }
];

// ----------------------------------------------------
// Mock Agent Activity Stream
// ----------------------------------------------------
export const mockActivityLogs: ActivityLog[] = [
  {
    id: "log-1",
    timestamp: "Just now",
    agentId: "agent-4",
    agentName: "Verification Agent",
    message: "Initiated BGP leak router traceroute corroboration across 6 global nodes.",
    type: "info"
  },
  {
    id: "log-2",
    timestamp: "Just now",
    agentId: "agent-5",
    agentName: "Ranking Agent",
    message: "Recalculated BGP leak story score. Increased importance from 89 to 94 (CRITICAL).",
    type: "warning"
  },
  {
    id: "log-3",
    timestamp: "1 min ago",
    agentId: "agent-6",
    agentName: "Analysis Agent",
    message: "Extracted timeline milestones for the Quantum Gate breakthrough.",
    type: "success"
  },
  {
    id: "log-4",
    timestamp: "2 mins ago",
    agentId: "agent-1",
    agentName: "AI & Tech Scout",
    message: "Detected new preprint regarding silicon spin qubit coherence extensions on arXiv.",
    type: "info"
  },
  {
    id: "log-5",
    timestamp: "3 mins ago",
    agentId: "agent-3",
    agentName: "World News Scout",
    message: "Pulled BGP router logs from Ripe NCC, triggering initial routing alert.",
    type: "info"
  },
  {
    id: "log-6",
    timestamp: "5 mins ago",
    agentId: "agent-7",
    agentName: "Summary Agent",
    message: "Successfully generated localized executive summaries for 3 tech news stories.",
    type: "success"
  },
  {
    id: "log-7",
    timestamp: "10 mins ago",
    agentId: "agent-4",
    agentName: "Verification Agent",
    message: "Flagged Cobalt Fissure discovery story as VERIFIED using Oceanic data archives.",
    type: "success"
  },
  {
    id: "log-8",
    timestamp: "15 mins ago",
    agentId: "agent-2",
    agentName: "Business Scout",
    message: "Finished scanning Federal Reserve productivity notes. Pushed content to Ranking queue.",
    type: "info"
  }
];
