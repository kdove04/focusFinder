import { readCustomLocations } from "./customLocations";
import { studyLocations, type StudyLocation } from "./locations";

export async function getAllStudyLocations(): Promise<StudyLocation[]> {
  const custom = await readCustomLocations();
  return [...studyLocations, ...custom];
}

export async function getStudyLocationById(id: string): Promise<StudyLocation | undefined> {
  const all = await getAllStudyLocations();
  return all.find((l) => l.id === id);
}
