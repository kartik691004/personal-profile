import type { NavigationItem, Project, ExpertiseItem } from './types'

export const NAVIGATION_ITEMS: NavigationItem[] = [
  { id: 'projects', label: 'Projects', scrollRatio: 0.25 },
  { id: 'expertise', label: 'Expertise', scrollRatio: 0.5 },
  { id: 'about', label: 'About', scrollRatio: 0.95 },
  { id: 'contact', label: 'Contact', scrollRatio: 3.5 },
]

export const PROJECTS_DATA: Project[] = [
  {
    title: 'AI Startup Outreach Automation',
    category: 'Automation',
    description:
      'n8n + OpenAI pipeline that finds funded startups, enriches founder intelligence, and sends 10 personalised AI emails per day.',
    tags: ['n8n', 'OpenAI API', 'Python'],
  },
  {
    title: 'AI Marketing Video Generator',
    category: 'Generative Video',
    description:
      'A single prompt produces a complete marketing video up to 60s — script, visuals, and production via paid APIs.',
    tags: ['OpenAI API', 'n8n'],
  },
  {
    title: 'SLV Enterprises Real Estate Platform',
    category: 'Full-Stack',
    description:
      'Property listing website with a secure JWT admin dashboard — properties, reviews, and customer inquiries.',
    tags: ['React', 'Node.js', 'Express', 'MongoDB', 'Cloudinary'],
  },
  {
    title: 'Internship Opportunity Aggregation',
    category: 'Data Pipeline',
    description:
      'LLM pipeline turning unstructured LinkedIn posts into structured data from 50+ sources, published via Google Sheets and APIs.',
    tags: ['n8n', 'Web Scraping', 'LLMs'],
  },
  {
    title: 'Christ University Portal',
    category: 'Full-Stack',
    description:
      'Admission portal with Three.js particle animations, magnetic UI buttons, and a Node.js/Express + NeDB backend.',
    tags: ['Three.js', 'Node.js', 'Express', 'NeDB'],
  },
]

export const EXPERTISE_DATA: ExpertiseItem[] = [
  {
    title: 'AI & Automation',
    percentage: 95,
    description: 'n8n workflows, OpenAI APIs, LLM pipelines, Python automation.',
  },
  {
    title: 'Full-Stack Development',
    percentage: 90,
    description: 'React.js, Node.js, Express.js, MongoDB, TypeScript.',
  },
  {
    title: 'Data Pipelines',
    percentage: 88,
    description: 'Multi-format ingestion up to 2GB, normalisation, dashboards.',
  },
]

export const DRUM_LINES: { segments: { text: string; highlight: boolean }[] }[] = [
  { segments: [{ text: 'Welcome to the portfolio', highlight: false }, { text: 'of a builder', highlight: true }] },
  { segments: [{ text: 'a ', highlight: false }, { text: 'BCA student', highlight: true }, { text: ' turned ', highlight: false }, { text: 'AI automation', highlight: true }, { text: ' and ', highlight: false }, { text: 'full-stack developer', highlight: true }] },
  { segments: [{ text: 'currently working across ', highlight: false }, { text: '2 startups', highlight: true }, { text: ' in Bengaluru', highlight: false }] },
  { segments: [{ text: 'I build ', highlight: false }, { text: 'AI-powered tools', highlight: true }, { text: ' that span', highlight: false }] },
  { segments: [{ text: 'multi-format ', highlight: false }, { text: 'data processing', highlight: true }] },
  { segments: [{ text: 'automated ', highlight: false }, { text: 'outreach', highlight: true }, { text: ' and', highlight: false }] },
  { segments: [{ text: 'generative ', highlight: false }, { text: 'video production', highlight: true }] },
  { segments: [{ text: '— ', highlight: false }, { text: 'end to end', highlight: true }, { text: ' and ', highlight: false }, { text: 'production ready', highlight: true }] },
  { segments: [{ text: 'From ', highlight: false }, { text: 'FTB Hustle', highlight: true }, { text: ' to ', highlight: false }, { text: 'Zidio Development', highlight: true }] },
  { segments: [{ text: 'I have shipped ', highlight: false }, { text: 'real pipelines', highlight: true }] },
  { segments: [{ text: 'with ', highlight: false }, { text: 'FastAPI', highlight: true }, { text: ', ', highlight: false }, { text: 'n8n', highlight: true }, { text: ' and ', highlight: false }, { text: 'LLM workflows', highlight: true }] },
  { segments: [{ text: 'that save teams ', highlight: false }, { text: 'hours every day', highlight: true }] },
  { segments: [{ text: 'Full-stack platforms on ', highlight: false }, { text: 'React', highlight: true }, { text: ', ', highlight: false }, { text: 'Node.js', highlight: true }, { text: ', ', highlight: false }, { text: 'MongoDB', highlight: true }] },
  { segments: [{ text: 'with ', highlight: false }, { text: '5 certifications', highlight: true }, { text: ' — LLM fundamentals,', highlight: false }] },
  { segments: [{ text: 'agents, and ', highlight: false }, { text: 'responsible AI', highlight: true }] },
  { segments: [{ text: '', highlight: false }] },
  { segments: [{ text: 'This is not ', highlight: false }, { text: 'another template', highlight: true }] },
  { segments: [{ text: 'This is a ', highlight: false }, { text: 'highly selective environment', highlight: true }] },
  { segments: [{ text: 'engineered for ', highlight: false }, { text: 'hyper-productive creators', highlight: true }] },
  { segments: [{ text: 'and ', highlight: false }, { text: 'AI prompt architects', highlight: true }] },
  { segments: [{ text: 'who operate at the ', highlight: false }, { text: 'absolute limits', highlight: true }] },
  { segments: [{ text: 'of ', highlight: false }, { text: 'digital product creation', highlight: true }] },
  { segments: [{ text: 'My favourite work: ', highlight: false }, { text: 'automation', highlight: true }] },
  { segments: [{ text: 'that finds ', highlight: false }, { text: 'funded startups', highlight: true }, { text: ', writes', highlight: false }] },
  { segments: [{ text: 'personalised outreach', highlight: true }, { text: ' and generates', highlight: false }] },
  { segments: [{ text: 'full marketing videos', highlight: true }, { text: ' from ', highlight: false }, { text: 'one prompt', highlight: true }] },
  { segments: [{ text: 'Seeking an ', highlight: false }, { text: 'AI Product Developer', highlight: true }] },
  { segments: [{ text: 'or ', highlight: false }, { text: 'AI Automation Developer', highlight: true }, { text: ' role', highlight: false }] },
  { segments: [{ text: 'available', highlight: true }, { text: ' for opportunities and', highlight: false }] },
  { segments: [{ text: 'collaborations', highlight: true }, { text: ' starting today', highlight: false }] },
  { segments: [{ text: 'Let us build ', highlight: false }, { text: 'systems that scale', highlight: true }] },
  { segments: [{ text: 'Reach me: ', highlight: false }, { text: 'kartik@bcah.christuniversity.in', highlight: true }] },
  { segments: [{ text: 'or on ', highlight: false }, { text: 'LinkedIn', highlight: true }, { text: ' and ', highlight: false }, { text: 'GitHub', highlight: true }, { text: ' — kartik691004', highlight: false }] },
]