import type { StudyLocation } from "./locations";

/** Main campus — approximate center from OpenStreetMap university extent */
export const JSU_CAMPUS_CENTER: [number, number] = [32.2966, -90.2073];

/**
 * Approximate building coordinates for map markers (WGS84).
 * Aligned with JSU directory names; refine with survey GIS if needed.
 */
const BUILDING_COORDINATES: Record<string, [number, number]> = {
  "H.T. Sampson Library": [32.299, -90.2045],
  "John A. Peoples Science Building": [32.2978, -90.2065],
  "Just Hall of Science": [32.2975, -90.2058],
  "Dollye M.E. Robinson Building": [32.2982, -90.2068],
  "Joseph H. Jackson Building (School of Education)": [32.2972, -90.2055],
  "College of Business": [32.2985, -90.2038],
  "School of Engineering": [32.297, -90.2062],
  CSET: [32.2968, -90.207],
  "JSU Student Center/Welcome Center": [32.2988, -90.2055],
  "Heritage Dining Hall": [32.2992, -90.205],
  "F.D. Hall Center of Music": [32.2975, -90.2042],
  "W.D. Blackburn Language Arts": [32.2965, -90.205],
  "B.F. Roberts Hall": [32.2962, -90.206],
  "Ayer Hall": [32.2958, -90.2055],
  "J.Y. Woodard Building": [32.2968, -90.2045],
  "Council of Federated Organizations (COFO) Building": [32.2955, -90.2065],
  "J.L. Reddix Building": [32.2978, -90.204],
  "Jones-Sampson Hall": [32.298, -90.2072],
  "Rose E. McCoy Auditorium": [32.2972, -90.2078],
  "International Programs": [32.2985, -90.206],
  "Alexander Residence Hall": [32.2995, -90.2025],
  "John W. Dixon Residence Hall": [32.299, -90.2032],
  "E.T. Stewart Residence Hall": [32.2993, -90.2035],
  "Campbell College Residence Suites (North & South)": [32.2996, -90.203],
  "Plant Science Building / Garden House": [32.296, -90.2085],
  "JSU Downtown / 101 Capitol Centre": [32.2989, -90.1845],
};

function hashBuilding(building: string): number {
  let h = 0;
  for (let i = 0; i < building.length; i++) {
    h = (Math.imul(31, h) + building.charCodeAt(i)) | 0;
  }
  return Math.abs(h);
}

/** Stable offset near main campus for unknown / student-added buildings */
export function coordinatesForBuilding(building: string): { lat: number; lng: number } {
  const fixed = BUILDING_COORDINATES[building];
  if (fixed) {
    const [lat, lng] = fixed;
    return { lat, lng };
  }
  const h = hashBuilding(building);
  const angle = ((h % 360) * Math.PI) / 180;
  const r = 0.0004 + (h % 80) / 400_000;
  return {
    lat: JSU_CAMPUS_CENTER[0] + r * Math.cos(angle),
    lng: JSU_CAMPUS_CENTER[1] + r * Math.sin(angle),
  };
}

export type MapBuildingGroup = {
  building: string;
  lat: number;
  lng: number;
  locations: StudyLocation[];
};

export function groupLocationsForMap(locations: StudyLocation[]): MapBuildingGroup[] {
  const byBuilding = new Map<string, StudyLocation[]>();
  for (const loc of locations) {
    const list = byBuilding.get(loc.building) ?? [];
    list.push(loc);
    byBuilding.set(loc.building, list);
  }
  return [...byBuilding.entries()].map(([building, locs]) => {
    const { lat, lng } = coordinatesForBuilding(building);
    return {
      building,
      lat,
      lng,
      locations: [...locs].sort((a, b) => a.name.localeCompare(b.name)),
    };
  });
}
