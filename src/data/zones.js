// Clean, intuitive 5-Zone Compass (+) Layout around the central CPU Hub
// Center = CPU (About)
// North (Straight ahead) = GPU Boulevard (Projects)
// East (Right) = RAM Alley (Skills)
// West (Left) = Expansion Bus (Experience)
// South (Behind) = Power Supply Hub (Resume & Contact)

export const ZONES = {
  CPU: {
    id: 'cpu',
    name: 'CPU Hub (About)',
    shortName: 'About',
    label: '⚡ About',
    position: [0, 0, 0],
    size: [22, 0.2, 22],
    color: '#00ff88',
    accent: '#00ffcc',
    description: 'Central Hub — About Daisy, Education & Leadership',
  },
  GPU: {
    id: 'gpu',
    name: 'GPU Boulevard (Projects)',
    shortName: 'Projects',
    label: '🚀 Projects',
    position: [0, 0, -44],
    size: [44, 0.2, 22],
    color: '#a855f7',
    accent: '#f472b6',
    description: 'Featured Projects & Live Demos (North ↑)',
  },
  RAM: {
    id: 'ram',
    name: 'RAM Alley (Skills)',
    shortName: 'Skills',
    label: '💻 Skills',
    position: [44, 0, 0],
    size: [24, 0.2, 28],
    color: '#06b6d4',
    accent: '#38bdf8',
    description: 'Core Skills, AI/ML & Tech Stack (East →)',
  },
  EXPANSION: {
    id: 'expansion',
    name: 'Expansion Bus (Experience)',
    shortName: 'Experience',
    label: '🏆 Experience',
    position: [-44, 0, 0],
    size: [24, 0.2, 36],
    color: '#f59e0b',
    accent: '#fbbf24',
    description: 'Internships, GSSoC & Google Ambassador (West ←)',
  },
  PSU: {
    id: 'psu',
    name: 'Power Hub (Resume & Contact)',
    shortName: 'Resume',
    label: '📄 Resume',
    position: [0, 0, 44],
    size: [34, 0.2, 22],
    color: '#ef4444',
    accent: '#f97316',
    description: 'Full Resume PDF, Certificates & Contact Links (South ↓)',
  },
};

// Spawn point for the rover (on CPU Hub, facing North toward Projects)
export const SPAWN_POSITION = [0, 2.5, 6];

// Clean, wide Compass Roads (4 straight spokes + 4 outer ring connectors)
export const ROADS = [
  // 4 Primary Compass Highways from CPU Hub
  { from: [0, 0, -11], to: [0, 0, -33], width: 6, color: '#a855f7', name: 'NORTH_PROJECTS' },
  { from: [11, 0, 0], to: [32, 0, 0], width: 6, color: '#06b6d4', name: 'EAST_SKILLS' },
  { from: [-11, 0, 0], to: [-32, 0, 0], width: 6, color: '#f59e0b', name: 'WEST_EXPERIENCE' },
  { from: [0, 0, 11], to: [0, 0, 33], width: 6, color: '#ef4444', name: 'SOUTH_RESUME' },

  // Clean Outer Ring Road connecting the 4 outer zones
  { from: [22, 0, -44], to: [44, 0, -14], width: 4.5, color: '#06b6d4', name: 'RING_NE' },
  { from: [-22, 0, -44], to: [-44, 0, -18], width: 4.5, color: '#a855f7', name: 'RING_NW' },
  { from: [44, 0, 14], to: [17, 0, 44], width: 4.5, color: '#ef4444', name: 'RING_SE' },
  { from: [-44, 0, 18], to: [-17, 0, 44], width: 4.5, color: '#f59e0b', name: 'RING_SW' },
];

// Subtle PCB floor traces (purely flat on the board, never cluttering the view)
export const CIRCUIT_TRACES = [
  { points: [[-8, -8], [-20, -20], [-20, -33]], color: '#d97706' },
  { points: [[8, -8], [20, -20], [20, -33]], color: '#fbbf24' },
  { points: [[8, 8], [22, 22], [32, 22]], color: '#d97706' },
  { points: [[-8, 8], [-22, 22], [-32, 22]], color: '#fbbf24' },
];
