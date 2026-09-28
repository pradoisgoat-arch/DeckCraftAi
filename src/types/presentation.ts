export type SlideLayoutType =
  | 'title-slide'
  | 'title-body'
  | 'split-2-col'
  | 'grid-3-cards'
  | 'grid-4-cards'
  | 'metrics-spotlight'
  | 'metrics-grid-4'
  | 'image-feature'
  | 'comparison'
  | 'timeline'
  | 'quote'
  | 'diagram'
  | 'team-bio'
  | 'pricing-table'
  | 'code-snippet'
  | 'faq-accordion'
  | 'quadrant-matrix'
  | 'callout-hero'
  | 'conclusion';

export interface ThemeConfig {
  id: string;
  name: string;
  category?: 'Dark Mode' | 'Light Mode' | 'Vibrant' | 'Corporate' | 'Minimal' | 'Cyber' | 'Warm & Organic' | 'Pastel & Modern';
  bgHex: string;
  cardBgHex: string;
  cardBorderHex: string;
  textHex: string;
  titleHex: string;
  accentHex: string;
  mutedHex: string;
  fontHead: 'display' | 'grotesk' | 'editorial' | 'sans' | 'outfit' | 'playfair' | 'montserrat' | 'inter' | 'garamond';
  fontBody: 'sans' | 'editorial' | 'mono' | 'inter' | 'outfit' | 'jetbrains' | 'garamond';
  isDark: boolean;
  borderRadius?: 'none' | 'sm' | 'md' | 'lg' | 'full';
  cardGlass?: boolean;
  bgGradient?: string;
  fontSizeScale?: 'compact' | 'normal' | 'large' | 'hero';
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
  actionType?: string;
  actionLabel?: string;
  payload?: any;
  actionApplied?: boolean;
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
  icon?: string;
}

export interface DiagramData {
  type: 'process' | 'timeline' | 'pyramid' | 'comparison' | 'grid';
  title?: string;
  steps: DiagramStep[];
}

export interface SlideColumn {
  id: string;
  title: string;
  tag?: string;
  items: string[];
}

export interface TimelineMilestone {
  date: string;
  title: string;
  desc: string;
  badge?: string;
}

export interface PricingTierItem {
  name: string;
  price: string;
  period: string;
  features: string[];
  highlight?: boolean;
  ctaText?: string;
}

export interface TeamMemberItem {
  name: string;
  role: string;
  bio?: string;
  avatarUrl?: string;
}

export interface FaqItem {
  question: string;
  answer: string;
}

export interface CodeSnippetData {
  language: string;
  code: string;
  filename?: string;
  notes?: string;
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
  image?: {
    url: string;
    prompt?: string;
    caption?: string;
    alt?: string;
  };
  diagram?: DiagramData;
  calloutBox?: {
    title: string;
    text: string;
    variant?: 'info' | 'warning' | 'success' | 'highlight';
  };
  timelineMilestones?: TimelineMilestone[];
  pricingTiers?: PricingTierItem[];
  teamMembers?: TeamMemberItem[];
  faqItems?: FaqItem[];
  codeSnippet?: CodeSnippetData;
}

export interface Slide {
  id: string;
  title: string;
  subtitle?: string;
  layout: SlideLayoutType;
  content: SlideContent;
  speakerNotes: string;
  bgOverrideHex?: string;
  accentOverrideHex?: string;
}

export interface PresentationDeck {
  id: string;
  title: string;
  subtitle: string;
  author: string;
  aspectRatio: '16:9' | '4:3';
  theme: ThemeConfig;
  slides: Slide[];
  createdAt: string;
  updatedAt: string;
}

export type AiTone = 'Professional' | 'Tech Startup' | 'Pitch Deck' | 'Educational' | 'Minimalist' | 'Executive' | 'Creative';

export interface DeckGenerationRequest {
  topic: string;
  slideCount?: number;
  tone?: AiTone;
  audience?: string;
  sourceNotes?: string;
  themeId?: string;
}
