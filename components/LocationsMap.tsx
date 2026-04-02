"use client";

import { MapContainer, TileLayer } from "react-leaflet";

/** Approximate main JSU campus center (OpenStreetMap scale) */
const CAMPUS_CENTER: [number, number] = [32.2966, -90.2073];

export function LocationsMap() {
  return (
    <MapContainer
      center={CAMPUS_CENTER}
      zoom={15}
      className="z-0 h-[min(420px,55vh)] w-full rounded-2xl border border-jsu-navy/15 shadow-sm"
      scrollWheelZoom
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
    </MapContainer>
  );
}
