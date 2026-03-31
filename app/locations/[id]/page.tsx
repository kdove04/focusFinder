import { notFound } from "next/navigation";
import { getLocationById } from "@/lib/locations";
import { LocationDetail } from "./LocationDetail";

type PageProps = { params: Promise<{ id: string }> };

export default async function LocationPage({ params }: PageProps) {
  const { id } = await params;
  const location = getLocationById(id);
  if (!location) notFound();
  return <LocationDetail location={location} />;
}
