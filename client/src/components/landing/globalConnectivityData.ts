export interface HubNode {
  id: string;
  name: string;
  coords: [number, number]; // [longitude, latitude]
  tier: 1 | 2; // 1 = major global hub, 2 = regional innovation hub
  pulseDelay?: number;
}

export interface HubConnection {
  fromId: string;
  toId: string;
  curvature?: number; // mid-point offset multiplier for SVG arc
  particleSpeed?: number; // duration in seconds (e.g., 3s - 7s)
}

export const HUB_NODES: HubNode[] = [
  // North America
  { id: "sf", name: "San Francisco", coords: [-122.4194, 37.7749], tier: 1, pulseDelay: 0 },
  { id: "sv", name: "Silicon Valley", coords: [-121.8863, 37.3382], tier: 1, pulseDelay: 0.5 },
  { id: "sea", name: "Seattle", coords: [-122.3321, 47.6062], tier: 2, pulseDelay: 1.2 },
  { id: "la", name: "Los Angeles", coords: [-118.2437, 34.0522], tier: 2, pulseDelay: 0.8 },
  { id: "austin", name: "Austin", coords: [-97.7431, 30.2672], tier: 2, pulseDelay: 1.5 },
  { id: "nyc", name: "New York", coords: [-74.006, 40.7128], tier: 1, pulseDelay: 0.3 },
  { id: "boston", name: "Boston", coords: [-71.0589, 42.3601], tier: 2, pulseDelay: 1.8 },
  { id: "toronto", name: "Toronto", coords: [-79.3832, 43.6532], tier: 1, pulseDelay: 2.1 },
  { id: "vancouver", name: "Vancouver", coords: [-123.1207, 49.2827], tier: 2, pulseDelay: 2.4 },
  { id: "mexico", name: "Mexico City", coords: [-99.1332, 19.4326], tier: 1, pulseDelay: 0.9 },

  // South America
  { id: "sao", name: "São Paulo", coords: [-46.6333, -23.5505], tier: 1, pulseDelay: 1.1 },
  { id: "ba", name: "Buenos Aires", coords: [-58.3816, -34.6037], tier: 1, pulseDelay: 2.3 },
  { id: "santiago", name: "Santiago", coords: [-70.6693, -33.4489], tier: 2, pulseDelay: 1.6 },
  { id: "bogota", name: "Bogota", coords: [-74.0721, 4.711], tier: 2, pulseDelay: 2.7 },

  // Europe
  { id: "london", name: "London", coords: [-0.1276, 51.5074], tier: 1, pulseDelay: 0.4 },
  { id: "paris", name: "Paris", coords: [2.3522, 48.8566], tier: 1, pulseDelay: 1.0 },
  { id: "berlin", name: "Berlin", coords: [13.405, 52.52], tier: 1, pulseDelay: 1.7 },
  { id: "amsterdam", name: "Amsterdam", coords: [4.9041, 52.3676], tier: 1, pulseDelay: 0.2 },
  { id: "zurich", name: "Zurich", coords: [8.5417, 47.3769], tier: 1, pulseDelay: 2.0 },
  { id: "stockholm", name: "Stockholm", coords: [18.0686, 59.3293], tier: 1, pulseDelay: 1.4 },
  { id: "dublin", name: "Dublin", coords: [-6.2603, 53.3498], tier: 2, pulseDelay: 2.6 },
  { id: "lisbon", name: "Lisbon", coords: [-9.1393, 38.7223], tier: 2, pulseDelay: 0.7 },
  { id: "barcelona", name: "Barcelona", coords: [2.1734, 41.3851], tier: 2, pulseDelay: 1.9 },
  { id: "copenhagen", name: "Copenhagen", coords: [12.5683, 55.6761], tier: 2, pulseDelay: 2.2 },
  { id: "helsinki", name: "Helsinki", coords: [24.9384, 60.1699], tier: 2, pulseDelay: 1.3 },
  { id: "warsaw", name: "Warsaw", coords: [21.0122, 52.2297], tier: 2, pulseDelay: 2.8 },

  // Middle East & Africa
  { id: "dubai", name: "Dubai", coords: [55.2708, 25.2048], tier: 1, pulseDelay: 0.6 },
  { id: "riyadh", name: "Riyadh", coords: [46.6753, 24.7136], tier: 1, pulseDelay: 1.5 },
  { id: "telaviv", name: "Tel Aviv", coords: [34.7818, 32.0853], tier: 1, pulseDelay: 2.2 },
  { id: "cairo", name: "Cairo", coords: [31.2357, 30.0444], tier: 2, pulseDelay: 1.1 },
  { id: "joburg", name: "Johannesburg", coords: [28.0473, -26.2041], tier: 1, pulseDelay: 2.5 },
  { id: "capetown", name: "Cape Town", coords: [18.4241, -33.9249], tier: 2, pulseDelay: 0.9 },
  { id: "nairobi", name: "Nairobi", coords: [36.8219, -1.2921], tier: 2, pulseDelay: 1.8 },
  { id: "lagos", name: "Lagos", coords: [3.3792, 6.5244], tier: 2, pulseDelay: 2.9 },

  // Asia-Pacific & South Asia
  { id: "mumbai", name: "Mumbai", coords: [72.8777, 19.076], tier: 1, pulseDelay: 0.5 },
  { id: "bengaluru", name: "Bengaluru", coords: [77.5946, 12.9716], tier: 1, pulseDelay: 0.1 },
  { id: "hyderabad", name: "Hyderabad", coords: [78.4867, 17.385], tier: 1, pulseDelay: 1.4 },
  { id: "delhi", name: "Delhi", coords: [77.1025, 28.7041], tier: 1, pulseDelay: 2.0 },
  { id: "singapore", name: "Singapore", coords: [103.8198, 1.3521], tier: 1, pulseDelay: 0.8 },
  { id: "hongkong", name: "Hong Kong", coords: [114.1694, 22.3193], tier: 1, pulseDelay: 1.6 },
  { id: "shanghai", name: "Shanghai", coords: [121.4737, 31.2304], tier: 1, pulseDelay: 0.3 },
  { id: "shenzhen", name: "Shenzhen", coords: [114.0579, 22.5431], tier: 1, pulseDelay: 2.3 },
  { id: "tokyo", name: "Tokyo", coords: [139.6917, 35.6895], tier: 1, pulseDelay: 1.0 },
  { id: "seoul", name: "Seoul", coords: [126.978, 37.5665], tier: 1, pulseDelay: 1.7 },
  { id: "taipei", name: "Taipei", coords: [121.5654, 25.033], tier: 2, pulseDelay: 2.4 },
  { id: "jakarta", name: "Jakarta", coords: [106.8456, -6.2088], tier: 2, pulseDelay: 1.2 },
  { id: "manila", name: "Manila", coords: [120.9842, 14.5995], tier: 2, pulseDelay: 2.7 },
  { id: "sydney", name: "Sydney", coords: [151.2093, -33.8688], tier: 1, pulseDelay: 0.4 },
  { id: "melbourne", name: "Melbourne", coords: [144.9631, -37.8136], tier: 1, pulseDelay: 2.1 },
  { id: "auckland", name: "Auckland", coords: [174.7633, -36.8485], tier: 2, pulseDelay: 1.9 },
];

export const HUB_CONNECTIONS: HubConnection[] = [
  // Transatlantic & Americas
  { fromId: "sf", toId: "london", curvature: -0.25, particleSpeed: 5.5 },
  { fromId: "sf", toId: "nyc", curvature: -0.15, particleSpeed: 4.2 },
  { fromId: "sf", toId: "tokyo", curvature: -0.3, particleSpeed: 6.0 },
  { fromId: "nyc", toId: "london", curvature: -0.2, particleSpeed: 4.8 },
  { fromId: "nyc", toId: "toronto", curvature: 0.1, particleSpeed: 3.5 },
  { fromId: "nyc", toId: "sao", curvature: 0.15, particleSpeed: 5.2 },
  { fromId: "mexico", toId: "sao", curvature: -0.15, particleSpeed: 4.6 },
  { fromId: "sao", toId: "ba", curvature: 0.1, particleSpeed: 3.2 },
  { fromId: "austin", toId: "mexico", curvature: -0.1, particleSpeed: 3.8 },
  { fromId: "sea", toId: "vancouver", curvature: -0.08, particleSpeed: 3.0 },

  // Europe & Middle East
  { fromId: "london", toId: "paris", curvature: 0.08, particleSpeed: 3.0 },
  { fromId: "london", toId: "berlin", curvature: -0.12, particleSpeed: 3.6 },
  { fromId: "london", toId: "dubai", curvature: -0.2, particleSpeed: 5.0 },
  { fromId: "paris", toId: "zurich", curvature: 0.1, particleSpeed: 3.2 },
  { fromId: "berlin", toId: "amsterdam", curvature: -0.08, particleSpeed: 3.0 },
  { fromId: "stockholm", toId: "berlin", curvature: -0.1, particleSpeed: 3.4 },
  { fromId: "dublin", toId: "london", curvature: -0.1, particleSpeed: 3.0 },
  { fromId: "lisbon", toId: "london", curvature: 0.12, particleSpeed: 4.0 },
  { fromId: "dubai", toId: "riyadh", curvature: 0.08, particleSpeed: 3.2 },
  { fromId: "telaviv", toId: "dubai", curvature: -0.1, particleSpeed: 3.5 },
  { fromId: "cairo", toId: "dubai", curvature: 0.1, particleSpeed: 3.8 },

  // Middle East → South Asia & Africa
  { fromId: "dubai", toId: "bengaluru", curvature: -0.2, particleSpeed: 4.5 },
  { fromId: "dubai", toId: "mumbai", curvature: -0.15, particleSpeed: 4.2 },
  { fromId: "joburg", toId: "dubai", curvature: 0.25, particleSpeed: 5.8 },
  { fromId: "lagos", toId: "london", curvature: 0.2, particleSpeed: 5.4 },
  { fromId: "nairobi", toId: "dubai", curvature: 0.15, particleSpeed: 4.4 },

  // South Asia → Southeast Asia & East Asia
  { fromId: "bengaluru", toId: "singapore", curvature: -0.18, particleSpeed: 4.4 },
  { fromId: "mumbai", toId: "delhi", curvature: -0.1, particleSpeed: 3.2 },
  { fromId: "bengaluru", toId: "hyderabad", curvature: 0.08, particleSpeed: 2.8 },
  { fromId: "delhi", toId: "bengaluru", curvature: 0.12, particleSpeed: 3.5 },
  { fromId: "singapore", toId: "hongkong", curvature: -0.12, particleSpeed: 3.8 },
  { fromId: "singapore", toId: "tokyo", curvature: -0.22, particleSpeed: 5.2 },
  { fromId: "singapore", toId: "sydney", curvature: 0.25, particleSpeed: 5.6 },
  { fromId: "hongkong", toId: "shanghai", curvature: -0.1, particleSpeed: 3.2 },
  { fromId: "shanghai", toId: "shenzhen", curvature: 0.08, particleSpeed: 3.0 },
  { fromId: "tokyo", toId: "seoul", curvature: -0.1, particleSpeed: 3.0 },
  { fromId: "seoul", toId: "shanghai", curvature: -0.1, particleSpeed: 3.3 },

  // Transpacific & Oceania
  { fromId: "sydney", toId: "melbourne", curvature: 0.08, particleSpeed: 3.0 },
  { fromId: "sydney", toId: "auckland", curvature: 0.1, particleSpeed: 3.6 },
  { fromId: "tokyo", toId: "sf", curvature: -0.28, particleSpeed: 6.2 },
  { fromId: "berlin", toId: "singapore", curvature: -0.3, particleSpeed: 6.5 },
];
