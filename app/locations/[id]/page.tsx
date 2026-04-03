import { notFound } from "next/navigation";
import { getStudyLocationById } from "@/lib/allLocations";
import { LocationDetail } from "./LocationDetail";

type PageProps = { params: Promise<{ id: string }> };

export default async function LocationPage({ params }: PageProps) {
  const { id } = await params;
  const location = await getStudyLocationById(id);
  if (!location) notFound();
  return <LocationDetail location={location} />;
}
