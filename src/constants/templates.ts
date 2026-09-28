import { PresentationDeck } from '../types/presentation';
import { THEMES } from './themes';

export const INITIAL_DECK: PresentationDeck = {
  id: 'deck-sample-ai-startup',
  title: 'AuraAI: Next-Gen Autonomous Agents',
  subtitle: 'Series A Investor Deck — Transforming Enterprise Workflows',
  author: 'Founding Team',
  aspectRatio: '16:9',
  theme: THEMES[0], // Midnight Tech
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  slides: [
    {
      id: 'slide-1',
      title: 'AuraAI: Autonomous Agent Platform',
      subtitle: 'Unlocking 10x Efficiency Across Enterprise Operations',
      layout: 'title-slide',
      content: {
        headline: 'AuraAI: Autonomous Agent Platform',
        subhead: 'Empowering global teams with reasoning-first AI agents that orchestrate complex multi-step workflows in real time.',
        calloutBox: {
          title: 'Series A Pitch Deck',
          text: 'Confidential — Prepared for Investors | Q3 2026',
          variant: 'info'
        }
      },
      speakerNotes: 'Welcome everyone. Today we are excited to share AuraAI, the platform built to solve enterprise context fragmentation with autonomous AI workflows.'
    },
    {
      id: 'slide-2',
      title: 'The Enterprise Problem',
      subtitle: 'Information Silos & Repetitive Manual Orchestration',
      layout: 'split-2-col',
      content: {
        columns: [
          {
            id: 'col-1',
            title: 'Current Reality',
            tag: 'Inefficient',
            items: [
              '72% of engineer time spent on repetitive glue tasks',
              'Siloed API data causes decision bottlenecks',
              'High human error rates in cross-system sync',
              '$420B wasted annually on legacy manual operations'
            ]
          },
          {
            id: 'col-2',
            title: 'AuraAI Solution',
            tag: 'Automated',
            items: [
              'Autonomous agents execute end-to-end task chains',
              'Unified context graph connects legacy APIs seamlessly',
              'Real-time self-healing workflows reduce error to <0.01%',
              'Instant 8x ROI achieved within 30 days of deployment'
            ]
          }
        ]
      },
      speakerNotes: 'Highlight the severe pain point: teams lose hours context-switching. Our solution brings instant autonomous execution.'
    },
    {
      id: 'slide-3',
      title: 'Traction & Key Performance Metrics',
      subtitle: 'Accelerating ARR Growth & Customer Retention',
      layout: 'metrics-spotlight',
      content: {
        headline: 'Exponential Enterprise Momentum',
        metrics: [
          {
            id: 'm1',
            value: '$4.2M',
            label: 'Annual Recurring Revenue',
            change: '+240% YoY',
            description: 'Driven by Fortune 500 expansions'
          },
          {
            id: 'm2',
            value: '142%',
            label: 'Net Revenue Retention',
            change: 'Industry Top Tier',
            description: 'Zero enterprise churn in last 12 months'
          },
          {
            id: 'm3',
            value: '18M+',
            label: 'Autonomous Actions Executed',
            change: 'Monthly Volume',
            description: 'Handling mission-critical workloads'
          }
        ]
      },
      speakerNotes: 'Walk through our metrics: $4.2M ARR with strong 142% NRR. Our retention proves deep product stickiness.'
    },
    {
      id: 'slide-4',
      title: 'System Architecture & Workflow Engine',
      subtitle: 'How AuraAI Processes Complex Multi-Step Tasks',
      layout: 'diagram',
      content: {
        diagram: {
          type: 'process',
          title: 'Autonomous Execution Pipeline',
          steps: [
            { id: 's1', title: '1. Intent Sensing', desc: 'Natural language input parsed into multi-step goal tree' },
            { id: 's2', title: '2. Context Retrieval', desc: 'Secure vector & relational database context fetching' },
            { id: 's3', title: '3. Agent Execution', desc: 'Parallel tool calls & self-correcting validation loops' },
            { id: 's4', title: '4. Verified Output', desc: 'Human-in-the-loop review & instant system action' }
          ]
        }
      },
      speakerNotes: 'This architectural breakdown shows how our 4-stage pipeline guarantees deterministic accuracy even with non-deterministic model outputs.'
    },
    {
      id: 'slide-5',
      title: 'What Enterprise Customers Say',
      subtitle: 'Validated by Global CTOs and VP Engineers',
      layout: 'quote',
      content: {
        quote: {
          text: 'AuraAI replaced three disparate automation tools and cut our deployment cycle from 3 weeks down to 15 minutes. It is the single most transformative platform in our tech stack.',
          author: 'Elena Rostova',
          role: 'Chief Technology Officer @ Global Cloud Corp'
        }
      },
      speakerNotes: 'Quote from CTO Elena Rostova demonstrating the velocity jump after switching to AuraAI.'
    },
    {
      id: 'slide-6',
      title: 'Join Us in Shaping the Future of Work',
      subtitle: 'Investment Summary & Immediate Milestones',
      layout: 'conclusion',
      content: {
        headline: 'Raising $12M Series A',
        bodyParagraphs: [
          'Capital allocation focused on scaling core AI research team, expanding Enterprise sales force in North America & Europe, and deepening integration ecosystem.',
          'Let us partner to build the definitive autonomous workflow layer for the modern world.'
        ],
        calloutBox: {
          title: 'Contact Information',
          text: 'founders@auraai.io | www.auraai.io | San Francisco, CA',
          variant: 'highlight'
        }
      },
      speakerNotes: 'Reiterate the ask: $12M Series A to capture market leadership. Open floor for Q&A.'
    }
  ]
};

export const SAMPLE_DECKS: PresentationDeck[] = [
  INITIAL_DECK,
  {
    id: 'deck-product-roadmap',
    title: 'Q4 Product Roadmap & Vision',
    subtitle: 'Strategic Engineering Goals & Feature Releases',
    author: 'Product Management',
    aspectRatio: '16:9',
    theme: THEMES[1], // SaaS Indigo
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    slides: [
      {
        id: 'p-1',
        title: 'Q4 Product Roadmap & Strategic Vision',
        subtitle: 'Scaling Reliability, Speed & AI Intelligence',
        layout: 'title-slide',
        content: {
          headline: 'Q4 Strategic Engineering Vision',
          subhead: 'Focusing on enterprise scale, zero-latency collaboration, and native AI assist capabilities.',
        },
        speakerNotes: 'Welcome team. This deck outlines our priority initiatives for the upcoming quarter.'
      },
      {
        id: 'p-2',
        title: 'Three Core Strategic Pillars',
        subtitle: 'Focus Areas for Q4 Execution',
        layout: 'grid-3-cards',
        content: {
          columns: [
            {
              id: 'c1',
              title: '1. Speed & Latency',
              tag: 'Core Platform',
              items: [
                'Sub-50ms canvas rendering',
                'Optimized edge caching for assets',
                'Reduced bundle payload by 35%'
              ]
            },
            {
              id: 'c2',
              title: '2. Multi-User Sync',
              tag: 'Collaboration',
              items: [
                'Real-time multi-cursor editing',
                'Granular role permissions',
                'Version history & visual diffs'
              ]
            },
            {
              id: 'c3',
              title: '3. Generative Visuals',
              tag: 'AI Intelligence',
              items: [
                'Auto-diagram generation',
                'Smart layout suggestions',
                '1-click presentation polish'
              ]
            }
          ]
        },
        speakerNotes: 'These three pillars drive our entire engineering backlog for Q4.'
      },
      {
        id: 'p-3',
        title: 'Target Delivery Timeline',
        subtitle: 'Key Milestones Across October — December',
        layout: 'timeline',
        content: {
          diagram: {
            type: 'timeline',
            steps: [
              { id: 't1', title: 'Oct 15: Alpha Release', desc: 'Internal testing of real-time collaboration engine' },
              { id: 't2', title: 'Nov 01: Beta Pilot', desc: '20 VIP enterprise accounts test AI diagram generators' },
              { id: 't3', title: 'Dec 10: GA Launch', desc: 'Public rollout and global marketing launch' }
            ]
          }
        },
        speakerNotes: 'Highlight October 15 alpha checkpoint and December GA launch target.'
      }
    ]
  },
  {
    id: 'deck-cybersecurity-strategy',
    title: 'Zero Trust Cybersecurity & Defense Architecture',
    subtitle: 'Securing Hybrid Cloud Infrastructure & Identity Gateways',
    author: 'CISO & Security Engineering Team',
    aspectRatio: '16:9',
    theme: THEMES.find((t) => t.id === 'cyber-dark') || THEMES[0],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    slides: [
      {
        id: 'sec-1',
        title: 'Zero Trust Security Strategy',
        subtitle: 'Never Trust, Always Verify Across All Infrastructure Layers',
        layout: 'title-slide',
        content: {
          headline: 'Next-Gen Cybersecurity Protocol',
          subhead: 'Proactive micro-segmentation, continuous identity validation, and automated AI threat detection.',
          calloutBox: {
            title: 'Executive Security Briefing',
            text: 'Prepared for Board of Directors & IT Risk Committee | 2026',
            variant: 'warning'
          }
        },
        speakerNotes: 'Presenting our Zero Trust roadmap to mitigate modern supply chain and cloud security risks.'
      },
      {
        id: 'sec-2',
        title: 'Threat Landscape & Attack Surfaces',
        subtitle: 'Why Legacy Perimeter Firewalls Are No Longer Sufficient',
        layout: 'split-2-col',
        content: {
          columns: [
            {
              id: 'c1',
              title: 'Legacy Perimeter Weakness',
              tag: 'Vulnerable',
              items: [
                'Implicit trust once inside internal network',
                'Siloed log visibility across multi-cloud environments',
                'Slow manual incident triage (Avg 21 days to contain)',
                'High vulnerability to credential theft & phishing'
              ]
            },
            {
              id: 'c2',
              title: 'Zero Trust Guardrails',
              tag: 'Protected',
              items: [
                'Micro-segmentation isolates lateral breaches instantly',
                'Unified SIEM with ML anomaly detection',
                'Automated isolation playbook fires in < 3 seconds',
                'Passwordless FIDO2 MFA mandatory across 100% endpoints'
              ]
            }
          ]
        },
        speakerNotes: 'Compare legacy weak perimeters against Zero Trust micro-segmentation.'
      },
      {
        id: 'sec-3',
        title: 'Security Compliance & Incident Reduction',
        subtitle: 'Measuring Defense Velocity & Governance Standards',
        layout: 'metrics-spotlight',
        content: {
          headline: 'Enterprise Defense Metrics',
          metrics: [
            {
              id: 'm1',
              value: '99.99%',
              label: 'Identity Verification Success',
              change: 'Zero Trust MFA',
              description: 'Zero unauthorized access incidents in 12 months'
            },
            {
              id: 'm2',
              value: '< 2 sec',
              label: 'Automated Threat Containment',
              change: '98% faster',
              description: 'AI playbooks isolate suspicious nodes instantly'
            },
            {
              id: 'm3',
              value: 'SOC 2 + ISO',
              label: 'Global Compliance Certified',
              change: 'Audit Ready',
              description: 'Full adherence to HIPAA, GDPR, & FedRAMP'
            }
          ]
        },
        speakerNotes: 'Review our response time: from minutes to under 2 seconds.'
      }
    ]
  },
  {
    id: 'deck-ai-healthcare-pitch',
    title: 'MedVanguard AI: Precision Diagnostics',
    subtitle: 'Transforming Early Oncology Detection with Vision Models',
    author: 'Founding Clinical & AI Team',
    aspectRatio: '16:9',
    theme: THEMES.find((t) => t.id === 'editorial-serif') || THEMES[0],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    slides: [
      {
        id: 'med-1',
        title: 'MedVanguard AI: Precision Diagnostics',
        subtitle: 'Saving Lives Through Early AI Oncology Detection',
        layout: 'title-slide',
        content: {
          headline: 'Sub-Millimeter Cancer Detection Engine',
          subhead: 'Empowering radiologists with multi-modal vision models trained on 10M+ anonymized clinical scans.',
          calloutBox: {
            title: 'FDA Clearance Pending',
            text: 'Breakthrough Medical Device Designation | Series A Pitch',
            variant: 'highlight'
          }
        },
        speakerNotes: 'Introducing MedVanguard AI, bringing sub-millimeter precision to early cancer diagnosis.'
      },
      {
        id: 'med-2',
        title: 'Clinical Validation & Benchmark Results',
        subtitle: 'Outperforming Standard Mammography Diagnostic Rates',
        layout: 'metrics-spotlight',
        content: {
          headline: 'Superior Clinical Performance',
          metrics: [
            {
              id: 'm1',
              value: '99.4%',
              label: 'Diagnostic Accuracy Rate',
              change: '+14% vs Human Baseline',
              description: 'Validated across 45 double-blind hospital trials'
            },
            {
              id: 'm2',
              value: '3.5 Yrs',
              label: 'Earlier Stage Detection',
              change: 'Life Saving',
              description: 'Identifies micro-calcifications prior to symptoms'
            },
            {
              id: 'm3',
              value: '180,000+',
              label: 'Patient Scans Analyzed',
              change: 'Active Hospital Deployment',
              description: 'Partnered with Mayo Clinic & Johns Hopkins'
            }
          ]
        },
        speakerNotes: 'Highlight 99.4% accuracy rate and 3.5 years earlier detection capabilities.'
      }
    ]
  }
];
