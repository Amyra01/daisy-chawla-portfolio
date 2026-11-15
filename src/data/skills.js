export const skills = {
  frontend: [
    { name: 'React', level: 92, icon: '⚛️', builtWith: 'Built this 3D Motherboard Portfolio & interactive AI dashboards' },
    { name: 'TypeScript', level: 84, icon: '📘', builtWith: 'Type-safe frontend & full-stack component architectures' },
    { name: 'Tailwind', level: 90, icon: '🎨', builtWith: 'Responsive glassmorphic UIs & JusticeFlow AI interface' },
    { name: 'Next.js', level: 82, icon: '▲', builtWith: 'JusticeFlow AI platform with SSR and API routes' },
    { name: 'JavaScript', level: 90, icon: '⚡', builtWith: 'Interactive web apps, physics simulations & DOM tools' },
    { name: 'HTML5/CSS3', level: 94, icon: '🌐', builtWith: '3+ responsive production web apps at Acmegrade' },
  ],
  graphics3d: [
    { name: 'Three.js', level: 86, icon: '🧊', builtWith: 'Procedural 3D motherboard world, instanced props & lighting' },
    { name: 'WebGL', level: 80, icon: '🔮', builtWith: 'Hardware-accelerated 3D scenes, post-processing & particles' },
    { name: 'GLSL', level: 76, icon: '✨', builtWith: 'Custom animated scanlines, RGB waves & data pulse effects' },
  ],
  backend: [
    { name: 'Node.js', level: 86, icon: '🟢', builtWith: 'Scalable REST APIs, real-time services & webhook pipelines' },
    { name: 'Java', level: 86, icon: '☕', builtWith: 'OOP RESTful backend modules integrated with SQL at Digimantra' },
    { name: 'Python', level: 92, icon: '🐍', builtWith: 'AI/ML pipelines, FastAPI microservices & GSSoC AI agents' },
    { name: 'FastAPI', level: 84, icon: '🚀', builtWith: 'High-speed async inference endpoints for LLM & RAG workflows' },
    { name: 'PostgreSQL', level: 82, icon: '🐘', builtWith: 'Relational schemas, Supabase auth & vector storage' },
  ],
  aiAndML: [
    { name: 'AI/ML', level: 88, icon: '🧠', builtWith: 'Supervised & unsupervised ML pipelines at IIT Roorkee & Meander' },
    { name: 'LLMs & RAG', level: 90, icon: '🤖', builtWith: 'JusticeFlow AI legal timeline generator & FIR auto-drafting' },
    { name: 'LangGraph', level: 84, icon: '🕸️', builtWith: 'Multi-step agentic workflows for GSSoC "Agents for India"' },
    { name: 'NLP', level: 85, icon: '💬', builtWith: 'Real-time trauma/distress detection from voice & text stories' },
  ],
  tools: [
    { name: 'Git', level: 92, icon: '🔀', builtWith: 'Open-source collaboration in GSSoC 2026 & 10-person team lead' },
    { name: 'Algorithms', level: 85, icon: '🧩', builtWith: 'NIT Delhi Code Slayer 2K25, Code for Bharat S2 & Zomatothon' },
    { name: 'C++', level: 82, icon: '⚙️', builtWith: 'Competitive programming, data structures & system fundamentals' },
    { name: 'Vercel / Cloud', level: 88, icon: '☁️', builtWith: 'Zero-downtime production deployments & CI/CD workflows' },
  ],
};

// The 12 heavy physics skill crates in RAM Alley (Part D2 & I2)
export const skillCratesList = [
  { name: 'React', icon: '⚛️', category: 'frontend', color: '#00ffcc' },
  { name: 'Three.js', icon: '🧊', category: 'graphics3d', color: '#a855f7' },
  { name: 'WebGL', icon: '🔮', category: 'graphics3d', color: '#ec4899' },
  { name: 'GLSL', icon: '✨', category: 'graphics3d', color: '#06b6d4' },
  { name: 'Node.js', icon: '🟢', category: 'backend', color: '#00ff88' },
  { name: 'Python', icon: '🐍', category: 'aiAndML', color: '#f59e0b' },
  { name: 'Java', icon: '☕', category: 'backend', color: '#ef4444' },
  { name: 'TypeScript', icon: '📘', category: 'frontend', color: '#38bdf8' },
  { name: 'Tailwind', icon: '🎨', category: 'frontend', color: '#06b6d4' },
  { name: 'Git', icon: '🔀', category: 'tools', color: '#f97316' },
  { name: 'Algorithms', icon: '🧩', category: 'tools', color: '#a855f7' },
  { name: 'AI/ML', icon: '🧠', category: 'aiAndML', color: '#ec4899' },
];

export const skillBlocks = skillCratesList.map((s) => s.name);

export const skillCategories = [
  { name: 'Frontend', key: 'frontend', color: '#00ffcc' },
  { name: '3D and Graphics', key: 'graphics3d', color: '#a855f7' },
  { name: 'Backend', key: 'backend', color: '#06b6d4' },
  { name: 'AI/ML', key: 'aiAndML', color: '#f59e0b' },
  { name: 'Tools', key: 'tools', color: '#ef4444' },
];
