"use client";

import { useEffect } from "react";
import Link from "next/link";
import L from "leaflet";
import { CircleMarker, MapContainer, Popup, TileLayer, useMap } from "react-leaflet";
import type { StudyLocation } from "@/lib/locations";
import { groupLocationsForMap, JSU_CAMPUS_CENTER } from "@/lib/mapPins";

function FitMapToGroups({
  groups,
}: {
  groups: ReturnType<typeof groupLocationsForMap>;
}) {
  const map = useMap();
  useEffect(() => {
    if (groups.length === 0) return;
    const pts = groups.map((g) => L.latLng(g.lat, g.lng));
    if (pts.length === 1) {
      map.setView(pts[0], 16);
      return;
    }
    const b = L.latLngBounds(pts);
    map.fitBounds(b.pad(0.14));
  }, [map, groups]);
  return null;
}

type Props = {
  locations: StudyLocation[];
};

export function LocationsMap({ locations }: Props) {
  const groups = groupLocationsForMap(locations);

  return (
    <MapContainer
      center={JSU_CAMPUS_CENTER}
      zoom={15}
      className="z-0 h-[min(420px,55vh)] w-full rounded-2xl border border-jsu-navy/15 shadow-sm"
      scrollWheelZoom
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <FitMapToGroups groups={groups} />
      {groups.map((g) => (
        <CircleMarker
          key={g.building}
          center={[g.lat, g.lng]}
          radius={11}
          pathOptions={{
            color: "#002147",
            weight: 2,
            fillColor: "#c5a028",
            fillOpacity: 0.88,
          }}
        >
          <Popup>
            <div className="min-w-[200px] text-jsu-navy">
              <p className="m-0 font-semibold">{g.building}</p>
              <ul className="mt-2 max-h-48 list-none space-y-1.5 overflow-y-auto p-0 text-sm">
                {g.locations.map((loc) => (
                  <li key={loc.id}>
                    <Link
                      href={`/locations/${loc.id}`}
                      className="text-jsu-blue underline hover:no-underline"
                    >
                      {loc.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </Popup>
        </CircleMarker>
      ))}
    </MapContainer>
  );
}
