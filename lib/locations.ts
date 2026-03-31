export type StudyLocation = {
  id: string;
  name: string;
  building: string;
  floor: string;
  description: string;
  amenities: string[];
  /** Typical capacity for occupancy ratio simulation */
  typicalCapacity: number;
  /** Base noise 0–100 (quieter = lower) */
  baselineNoise: number;
  /** Base busyness 0–100 */
  baselineBusyness: number;
};

export const studyLocations: StudyLocation[] = [
  {
    id: "alexander-north-2",
    name: "Alexander Hall — North Reading Area",
    building: "Alexander Hall",
    floor: "2",
    description:
      "Open seating near windows; popular between classes. Good for solo reading.",
    amenities: ["Wi‑Fi", "Outlets", "Natural light"],
    typicalCapacity: 40,
    baselineNoise: 38,
    baselineBusyness: 62,
  },
  {
    id: "h-t-sam-lobby",
    name: "H.T. Sampson Library — Main Floor",
    building: "H.T. Sampson Library",
    floor: "1",
    description:
      "Central hub with group tables and quiet zones. Check signage for silent study.",
    amenities: ["Wi‑Fi", "Printing", "Group tables", "Restrooms nearby"],
    typicalCapacity: 120,
    baselineNoise: 45,
    baselineBusyness: 78,
  },
  {
    id: "library-3-quiet",
    name: "H.T. Sampson Library — Quiet Study (3rd floor)",
    building: "H.T. Sampson Library",
    floor: "3",
    description: "Designated low-conversation floor. Best for exams and deep work.",
    amenities: ["Wi‑Fi", "Carrels", "Outlets"],
    typicalCapacity: 55,
    baselineNoise: 22,
    baselineBusyness: 48,
  },
  {
    id: "student-center-lounge",
    name: "Student Center — Commuter Lounge",
    building: "Student Center",
    floor: "1",
    description: "Comfortable seating; more ambient noise. Better for light review.",
    amenities: ["Wi‑Fi", "Vending", "Microwaves nearby"],
    typicalCapacity: 65,
    baselineNoise: 58,
    baselineBusyness: 71,
  },
  {
    id: "science-atrium",
    name: "Science & Engineering — Atrium Benches",
    building: "Science & Engineering Complex",
    floor: "1",
    description: "Bright atrium with foot traffic; short sessions work well.",
    amenities: ["Wi‑Fi", "Whiteboards nearby"],
    typicalCapacity: 30,
    baselineNoise: 52,
    baselineBusyness: 55,
  },
];

export function getLocationById(id: string): StudyLocation | undefined {
  return studyLocations.find((l) => l.id === id);
}
