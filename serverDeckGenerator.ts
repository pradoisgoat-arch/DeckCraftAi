// Resilient Presentation Engine
// Generates high-fidelity, topic-tailored, multi-slide decks with rich content and speaker notes

export interface SlideColumn {
  id: string;
  title: string;
  tag?: string;
  items: string[];
}

export interface MetricItem {
  id: string;
  value: string;
  label: string;
  change?: string;
  description?: string;
}

export interface DiagramStep {
  id: string;
  title: string;
  desc: string;
  badge?: string;
}

export interface SlideContent {
  headline?: string;
  subhead?: string;
  bullets?: string[];
  bodyParagraphs?: string[];
  columns?: SlideColumn[];
  metrics?: MetricItem[];
  quote?: {
    text: string;
    author: string;
    role?: string;
  };
  diagram?: {
    type: 'process' | 'timeline' | 'pyramid' | 'comparison' | 'grid';
    title: string;
    steps: DiagramStep[];
  };
  comparison?: {
    leftTitle: string;
    leftItems: string[];
    rightTitle: string;
    rightItems: string[];
  };
  calloutBox?: {
    title: string;
    text: string;
    variant: 'info' | 'warning' | 'success' | 'highlight';
  };
}

export interface GeneratedSlide {
  id: string;
  title: string;
  subtitle: string;
  layout: string;
  speakerNotes: string;
  content: SlideContent;
}

export interface GeneratedDeckResponse {
  title: string;
  subtitle: string;
  author: string;
  slides: GeneratedSlide[];
  generatedWith: 'ai' | 'resilient-engine';
}

function cleanTopic(raw: string): string {
  let cleaned = raw.trim();
  cleaned = cleaned.replace(/^(create|generate|make|build|design)?\s*(a|an|the)?\s*(presentation|pitch deck|deck|slides|slide deck)?\s*(about|on|for)?\s*/i, '');
  cleaned = cleaned.trim();
  if (!cleaned) cleaned = 'Strategic Executive Briefing';
  // Capitalize first letter
  return cleaned.charAt(0).toUpperCase() + cleaned.slice(1);
}

export function generateResilientDeck(
  topic: string,
  slideCount: number = 6,
  tone: string = 'Professional',
  audience: string = 'Executive Leadership',
  sourceNotes: string = ''
): GeneratedDeckResponse {
  const cleanTitle = cleanTopic(topic);
  const now = Date.now();
  const lower = topic.toLowerCase();

  // Determine domain context for intelligent tailoring
  const isAI = lower.includes('ai') || lower.includes('ml') || lower.includes('agent') || lower.includes('intelligence') || lower.includes('robot');
  const isFinance = lower.includes('fintech') || lower.includes('money') || lower.includes('invest') || lower.includes('quarter') || lower.includes('financial') || lower.includes('fund');
  const isHealth = lower.includes('health') || lower.includes('medic') || lower.includes('clinic') || lower.includes('bio') || lower.includes('patient');
  const isEnergy = lower.includes('energy') || lower.includes('solar') || lower.includes('climate') || lower.includes('carbon') || lower.includes('green') || lower.includes('esg');
  const isSecurity = lower.includes('cyber') || lower.includes('secur') || lower.includes('cloud') || lower.includes('zero trust');
  const isSaaS = lower.includes('saas') || lower.includes('software') || lower.includes('app') || lower.includes('platform') || lower.includes('api');

  // Subtitle generation based on tone
  let subtitle = `A comprehensive strategic presentation on ${cleanTitle}`;
  if (tone === 'Tech Startup' || tone === 'Pitch Deck') {
    subtitle = `Disrupting the market with high-velocity innovation and scalable execution`;
  } else if (tone === 'Executive') {
    subtitle = `Strategic imperatives, operational roadmap, and quantifiable outcomes for ${audience}`;
  } else if (tone === 'Creative') {
    subtitle = `Transformative thinking, visual storytelling, and bold future vision`;
  } else if (tone === 'Educational') {
    subtitle = `Core fundamentals, architecture, and practical implementation guide`;
  }

  // Domain-aware metrics
  let metricsData: MetricItem[] = [
    { id: 'm1', value: '4.8x', label: 'Productivity Lift', change: '+380%', description: 'Measured performance gain over legacy workflows' },
    { id: 'm2', value: '99.94%', label: 'Platform Reliability', change: '+12.4%', description: 'Enterprise-grade uptime and SLA assurance' },
    { id: 'm3', value: '$14.2M', label: 'Addressable Pipeline', change: '+215% YoY', description: 'Qualified forward revenue potential in target segments' },
  ];

  if (isAI) {
    metricsData = [
      { id: 'm1', value: '10x', label: 'Workflow Acceleration', change: '+900%', description: 'Reduction in manual synthesis and operational latency' },
      { id: 'm2', value: '98.7%', label: 'Model Accuracy', change: '+14.2%', description: 'Precision benchmark on standardized domain test suites' },
      { id: 'm3', value: '<25ms', label: 'Inference Latency', change: '-65%', description: 'Sub-second real-time streaming response window' },
    ];
  } else if (isFinance) {
    metricsData = [
      { id: 'm1', value: '$24.6M', label: 'Annual Run Rate', change: '+145% YoY', description: 'Compound recurring revenue trajectory across tiers' },
      { id: 'm2', value: '138%', label: 'Net Revenue Retention', change: '+18%', description: 'Strong organic account expansion and low churn' },
      { id: 'm3', value: '72%', label: 'Gross Margin', change: '+850 bps', description: 'High software leverage with automated settlement' },
    ];
  } else if (isHealth) {
    metricsData = [
      { id: 'm1', value: '99.2%', label: 'Diagnostic Precision', change: '+24%', description: 'Cross-validated clinical imaging sensitivity score' },
      { id: 'm2', value: '3.5x', label: 'Triage Speed', change: '+250%', description: 'Accelerated patient intake and critical care routing' },
      { id: 'm3', value: '45k+', label: 'Patients Impacted', change: '+320% MoM', description: 'Active clinical encounters across partner networks' },
    ];
  } else if (isEnergy) {
    metricsData = [
      { id: 'm1', value: '1.2 GW', label: 'Renewable Capacity', change: '+180%', description: 'Clean energy generation pipeline under management' },
      { id: 'm2', value: '-65%', label: 'Carbon Intensity', change: 'Net-Zero', description: 'Direct reduction in Scope 1 and Scope 2 emissions' },
      { id: 'm3', value: '$8.5M', label: 'Annual Utility Savings', change: '+42%', description: 'Demonstrated operational cost reduction for partners' },
    ];
  }

  // Domain-aware diagram steps
  let diagramSteps: DiagramStep[] = [
    { id: 's1', title: 'Data Ingestion & Discovery', desc: 'Unified capture of organizational inputs, structured data, and context.', badge: 'Stage 01' },
    { id: 's2', title: 'Intelligent Processing Core', desc: 'Rule evaluation, dynamic modeling, and predictive synthesis.', badge: 'Stage 02' },
    { id: 's3', title: 'Automated Orchestration', desc: 'Direct execution across integrated systems and collaborative workflows.', badge: 'Stage 03' },
    { id: 's4', title: 'Continuous Governance & KPIs', desc: 'Real-time telemetry, audit trails, and feedback-loop optimization.', badge: 'Stage 04' },
  ];

  if (isAI) {
    diagramSteps = [
      { id: 's1', title: 'Prompt & Context Embeddings', desc: 'Semantic indexing and vector retrieval of domain knowledge bases.', badge: 'Step 1' },
      { id: 's2', title: 'Multi-Agent Reasoning', desc: 'Autonomous decomposition of complex objectives into verifiable subtasks.', badge: 'Step 2' },
      { id: 's3', title: 'Tool Execution & Verification', desc: 'Safe invocation of external APIs, code compilers, and validation hooks.', badge: 'Step 3' },
      { id: 's4', title: 'Synthesized Output & Feedback', desc: 'Structured deliverables rendered in real-time with human-in-the-loop audit.', badge: 'Step 4' },
    ];
  }

  // Build the list of slide templates
  const slideTemplates: GeneratedSlide[] = [
    // Slide 1: Title Slide
    {
      id: `slide-${now}-1`,
      title: cleanTitle,
      subtitle: subtitle,
      layout: 'title-slide',
      speakerNotes: `Welcome everyone. Today I'm excited to present our strategic brief on ${cleanTitle}. Over the next few minutes, we will walk through the core market dynamics, our differentiated solution architecture, key metrics, and our execution roadmap designed specifically for ${audience}.`,
      content: {
        headline: cleanTitle,
        subhead: subtitle,
        calloutBox: {
          title: 'Executive Mission',
          text: `Delivering measurable transformation, defensible differentiation, and accelerated impact for ${audience}.`,
          variant: 'highlight',
        },
      },
    },

    // Slide 2: Problem vs Opportunity (split-2-col)
    {
      id: `slide-${now}-2`,
      title: 'Market Dynamics & The Core Challenge',
      subtitle: 'Understanding the friction points and why the status quo is unsustainable',
      layout: 'split-2-col',
      speakerNotes: `Let's examine why this problem matters right now. Organizations tackling ${cleanTitle} encounter fragmented toolchains, ballooning operational costs, and poor visibility. By shifting to an integrated approach, we convert these friction points into defensible market advantage.`,
      content: {
        headline: 'Why Existing Approaches Fail & Where the Real Value Lies',
        columns: [
          {
            id: 'col-1',
            title: 'The Status Quo Bottlenecks',
            tag: 'Challenges',
            items: [
              'Fragmented systems and siloed data leading to high latency',
              'Escalating operational friction and rising total cost of ownership',
              'Lack of real-time intelligence to support critical decision-making',
              'Manual, error-prone workflows that constrain organizational velocity',
            ],
          },
          {
            id: 'col-2',
            title: 'The Modern Strategic Opportunity',
            tag: 'Paradigm Shift',
            items: [
              'Centralized orchestration with automated real-time synthesis',
              'Seamless integration across modern APIs and enterprise stacks',
              'Significant reduction in cycle time and overhead cost',
              'Future-proof foundation that scales effortlessly with demand',
            ],
          },
        ],
      },
    },

    // Slide 3: Core Solution Pillars (grid-3-cards)
    {
      id: `slide-${now}-3`,
      title: 'Our Strategic Solution & Pillars',
      subtitle: 'A high-impact framework engineered for speed, reliability, and scale',
      layout: 'grid-3-cards',
      speakerNotes: `Here are our three core value pillars. First, intuitive modern experience that eliminates onboarding barriers. Second, deep intelligent automation that works reliably in background workflows. Third, enterprise-grade governance and security that leadership can depend on.`,
      content: {
        headline: 'Three Foundational Pillars That Power Superior Outcomes',
        columns: [
          {
            id: 'c1',
            title: '01. Purpose-Built Architecture',
            tag: 'Design',
            items: [
              'Engineered specifically around modern operational needs',
              'Modular, composable components that fit existing workflows',
              'Zero friction onboarding with instant time-to-value',
            ],
          },
          {
            id: 'c2',
            title: '02. Autonomous Intelligence',
            tag: 'Efficiency',
            items: [
              'Automated synthesis of complex multi-source data',
              'Proactive anomaly detection and actionable recommendations',
              'Adaptive learning that improves accuracy over time',
            ],
          },
        ],
      },
    },

    // Slide 4: Key Metrics (metrics-spotlight)
    {
      id: `slide-${now}-4`,
      title: 'Measurable Impact & Growth Metrics',
      subtitle: 'Quantifiable benchmarks demonstrating clear operational ROI',
      layout: 'metrics-spotlight',
      speakerNotes: `Numbers tell the true story. Looking at our target benchmarks, we see a dramatic improvement across productivity, system reliability, and overall forward pipeline. These metrics validate the strategic leverage we provide.`,
      content: {
        headline: 'Quantifiable Results Validated Across Industry Benchmarks',
        metrics: metricsData,
      },
    },

    // Slide 5: Architecture / Pipeline (diagram)
    {
      id: `slide-${now}-5`,
      title: 'Operational Workflow & Architecture',
      subtitle: 'End-to-end execution pipeline from raw input to strategic outcome',
      layout: 'diagram',
      speakerNotes: `This diagram illustrates the step-by-step pipeline. Notice how data flows smoothly from initial ingestion through intelligent processing, automated orchestration, and into continuous telemetry. Each phase is audited, governed, and optimized for maximum speed.`,
      content: {
        headline: 'A Streamlined 4-Stage Operational Pipeline',
        diagram: {
          type: 'process',
          title: 'System Execution Flow',
          steps: diagramSteps,
        },
      },
    },

    // Slide 6: Competitive Comparison (comparison)
    {
      id: `slide-${now}-6`,
      title: 'Competitive Differentiation',
      subtitle: 'How our methodology outperforms traditional legacy approaches',
      layout: 'comparison',
      speakerNotes: `When we contrast our strategy with traditional market alternatives, the divergence is clear. Traditional approaches require heavy custom maintenance, slow rollout cycles, and brittle interfaces. Our model provides day-one velocity, modern automation, and enterprise durability.`,
      content: {
        headline: 'Direct Comparison: Legacy Tools vs Modern Strategy',
        comparison: {
          leftTitle: 'Traditional / Legacy Alternatives',
          leftItems: [
            'Months-long deployment and complex configuration overhead',
            'Siloed architectures with opaque data and difficult governance',
            'Steep maintenance costs and fragile custom integrations',
            'Static reporting with no predictive or autonomous capabilities',
          ],
          rightTitle: 'Modern Innovation Standard',
          rightItems: [
            'Immediate deployment with unified cloud-native workflows',
            'Full transparency, real-time auditability, and role-based controls',
            'Predictable cost model with high capital efficiency',
            'Continuous adaptive improvements powered by modern intelligence',
          ],
        },
      },
    },

    // Slide 7: Strategic Conclusion & Next Steps (conclusion)
    {
      id: `slide-${now}-7`,
      title: 'Summary & Strategic Next Steps',
      subtitle: 'Actionable milestones to accelerate deployment and maximize value',
      layout: 'conclusion',
      speakerNotes: `To conclude: we have a clear, validated path forward. Our immediate next steps are to align stakeholders, initiate pilot rollout, validate initial KPI benchmarks, and scale across core business units. Thank you, and I look forward to your questions.`,
      content: {
        headline: 'Transforming Vision into Concrete Operational Execution',
        bullets: [
          'Phase 1: Finalize executive alignment and establish core baseline benchmarks',
          'Phase 2: Deploy initial pilot group and integrate primary data sources',
          'Phase 3: Validate ROI metrics, refine workflows, and gather direct user feedback',
          'Phase 4: Full organizational rollout with continuous monitoring and expansion',
        ],
        calloutBox: {
          title: 'Action Item for Stakeholders',
          text: `Authorize Phase 1 kickoff to unlock immediate productivity gains and secure early competitive advantage.`,
          variant: 'success',
        },
      },
    },

    // Slide 8: Customer Validation & Quote (quote)
    {
      id: `slide-${now}-8`,
      title: 'Industry Validation & Voice of Customer',
      subtitle: 'What enterprise partners and thought leaders are saying',
      layout: 'quote',
      speakerNotes: `Third-party validation reinforces market pull. Here is feedback from an executive partner who transitioned to this strategy, citing unprecedented time-savings and clarity across their team.`,
      content: {
        headline: 'Transformative Outcomes Backed by Enterprise Leaders',
        quote: {
          text: `Implementing this strategy transformed our execution speed completely. What previously took weeks of manual alignment is now accomplished in minutes with superior quality.`,
          author: 'Alex Montgomery',
          role: 'Chief Technology Officer & Venture Partner',
        },
      },
    },
  ];

  // Adjust to requested slideCount
  const targetCount = Math.max(3, Math.min(12, slideCount));
  let selectedSlides: GeneratedSlide[];

  if (targetCount <= slideTemplates.length) {
    // If fewer slides requested, prioritize essential narrative:
    // Slide 1 (title), Slide 2 (problem/col), Slide 3 (solution), Slide 4 (metrics), Slide 5 (diagram), Slide 7 (conclusion)
    if (targetCount === 3) {
      selectedSlides = [slideTemplates[0], slideTemplates[2], slideTemplates[6]];
    } else if (targetCount === 4) {
      selectedSlides = [slideTemplates[0], slideTemplates[1], slideTemplates[3], slideTemplates[6]];
    } else if (targetCount === 5) {
      selectedSlides = [slideTemplates[0], slideTemplates[1], slideTemplates[2], slideTemplates[3], slideTemplates[6]];
    } else if (targetCount === 6) {
      selectedSlides = [slideTemplates[0], slideTemplates[1], slideTemplates[2], slideTemplates[3], slideTemplates[4], slideTemplates[6]];
    } else {
      selectedSlides = slideTemplates.slice(0, targetCount);
    }
  } else {
    selectedSlides = [...slideTemplates];
    // If more than 8 slides requested, generate extra topical deep-dive slides
    for (let i = slideTemplates.length; i < targetCount; i++) {
      selectedSlides.push({
        id: `slide-${now}-${i + 1}`,
        title: `Strategic Focus Area 0${i - slideTemplates.length + 1}`,
        subtitle: `Deep dive into key operational considerations for ${cleanTitle}`,
        layout: 'title-body',
        speakerNotes: `In this deep-dive slide, we address specific operational levers that ensure sustainable execution and stakeholder confidence.`,
        content: {
          headline: `Optimizing Core Workflows and Governance`,
          bullets: [
            `Standardizing high-frequency tasks into repeatable operational playbooks`,
            `Enforcing rigorous security, compliance, and privacy safeguards`,
            `Empowering cross-functional teams with instant, self-serve capabilities`,
            `Tracking continuous feedback loops to drive ongoing performance gains`,
          ],
        },
      });
    }
  }

  // Re-index IDs cleanly
  const finalSlides = selectedSlides.map((s, idx) => ({
    ...s,
    id: `slide-${now}-${idx + 1}`,
  }));

  return {
    title: cleanTitle,
    subtitle: subtitle,
    author: 'DeckCraft Studio',
    slides: finalSlides,
    generatedWith: 'resilient-engine',
  };
}
