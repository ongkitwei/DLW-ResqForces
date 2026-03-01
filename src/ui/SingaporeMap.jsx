"use client";

import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-cluster";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { GrAed } from "react-icons/gr";
import Image from "next/image";

const REGIONS = {
  WEST: { center: [1.3404, 103.709], zoom: 14 },
  EAST: { center: [1.3573, 103.9452], zoom: 14 },
  NORTH: { center: [1.4467, 103.7855], zoom: 14 },
  SOUTH: { center: [1.2847, 103.8513], zoom: 14 },
  ALL: { center: [1.3521, 103.8198], zoom: 12 },
};

// 1. Blue Dot for individual markers
const blueAedIcon =
  typeof window !== "undefined"
    ? L.divIcon({
        html: `<div style="background-color: #3b82f6; width: 12px; height: 12px; border-radius: 50%; border: 2px solid white; box-shadow: 0 0 5px rgba(0,0,0,0.3);"></div>`,
        className: "custom-blue-dot",
        iconSize: [12, 12],
        iconAnchor: [6, 6],
      })
    : null;

const createCustomClusterIcon = (cluster) => {
  const count = cluster.getChildCount();
  let size = 40;
  if (count > 50) size = 50;
  if (count > 100) size = 60;

  return L.divIcon({
    html: `<span>${count}</span>`,
    className: "custom-marker-cluster",
    iconSize: L.point(size, size, true),
  });
};

export default function SingaporeMap() {
  const [aedLocations, setAedLocations] = useState([]);
  const [map, setMap] = useState(null); // Reference to the map instance
  const center = [1.3521, 103.8198];

  useEffect(() => {
    const loadLocalData = async () => {
      try {
        const res = await fetch("/aed.json");
        const json = await res.json();
        if (json.features) setAedLocations(json.features);
      } catch (err) {
        console.error("Error loading /public/aed.json", err);
      }
    };
    loadLocalData();
  }, []);

  const goToRegion = (regionKey) => {
    if (map) {
      const { center, zoom } = REGIONS[regionKey];
      map.flyTo(center, zoom, {
        animate: true,
        duration: 1.5, // Seconds for the transition
      });
    }
  };

  return (
    <div className="flex flex-col items-center w-full">
      <style>{`
        .custom-marker-cluster {
          background: #2563eb;
          color: white;
          border-radius: 50%;
          border: 3px solid white;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: bold;
          font-size: 14px;
          box-shadow: 0 4px 12px rgba(37, 99, 235, 0.4);
        }
        .custom-marker-cluster:hover {
          transform: scale(1.1);
          background: #1d4ed8;
        }
        /* Custom styling for the Google Maps button */
        .gmaps-button {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          background-color: #ffffff;
          color: #374151;
          border: 1px solid #d1d5db;
          padding: 6px 10px;
          border-radius: 6px;
          text-decoration: none !important;
          font-weight: 600;
          font-size: 11px;
          margin-top: 10px;
          transition: all 0.2s;
        }
        .gmaps-button:hover {
          background-color: #f3f4f6;
          border-color: #9ca3af;
        }
      `}</style>

      <div className="w-full max-w-5xl mb-6">
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
          AED Distribution Zones
        </h1>
        <p className="text-slate-500">
          Click a station to get navigation instructions.
        </p>
      </div>

      <div className="h-[70vh] w-full max-w-5xl rounded-xl overflow-hidden shadow-2xl border-4 border-white">
        <MapContainer
          center={center}
          zoom={12}
          className="h-full w-full"
          ref={setMap}
        >
          <TileLayer
            attribution="&copy; OpenStreetMap"
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          <MarkerClusterGroup
            chunkedLoading
            iconCreateFunction={createCustomClusterIcon}
            maxClusterRadius={50}
            showCoverageOnHover={false}
          >
            {aedLocations.map((feature, idx) => {
              const info = feature.properties;
              const lat = parseFloat(info.LATITUDE);
              const lng = parseFloat(info.LONGITUDE);

              if (!lat || !lng) return null;

              // Construct the Google Maps URL
              const gMapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;

              return (
                <Marker
                  key={info.OBJECTID || idx}
                  position={[lat, lng]}
                  icon={blueAedIcon}
                >
                  <Popup>
                    <div className="p-1 min-w-[200px]">
                      <h3 className="font-bold text-blue-600 border-b pb-1 mb-1 text-xs">
                        💙 AED STATION
                      </h3>
                      <p className="text-sm font-bold text-slate-900">
                        {info.BUILDING_NAME}
                      </p>
                      <p className="text-[10px] text-slate-500 mt-1 leading-tight">
                        {info.AED_LOCATION_DESCRIPTION}
                      </p>

                      <div className="mt-2 pt-2 border-t flex justify-between text-[9px] font-bold text-slate-400">
                        <span>POSTAL: {info.POSTAL_CODE}</span>
                        <span>
                          LEVEL: {info.AED_LOCATION_FLOOR_LEVEL || "N/A"}
                        </span>
                      </div>

                      {/* GOOGLE MAPS REDIRECT BUTTON */}
                      <a
                        href={gMapsUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="gmaps-button"
                      >
                        <img
                          src="https://www.gstatic.com/images/branding/product/1x/maps_96dp.png"
                          alt="G"
                          width="14"
                        />
                        GET DIRECTIONS
                      </a>
                    </div>
                  </Popup>
                </Marker>
              );
            })}
          </MarkerClusterGroup>
        </MapContainer>
      </div>

      <div className="absolute top-80 left-6/7 -translate-x-1/2 z-[1000] flex flex-row items-center gap-x-3 backdrop-blur-md p-2 rounded-xl shadow-2xl border-1 border-slate-300 bg-white">
        <GrAed size={50} />
      </div>
      <div className="absolute bottom-32 left-1/2 -translate-x-1/2 z-[1000] flex flex-row items-center gap-x-3 bg-white/80 backdrop-blur-md p-2 rounded-full shadow-2xl border border-white/20">
        <button
          onClick={() => goToRegion("WEST")}
          className="flex items-center gap-x-2 bg-slate-800 hover:bg-slate-700 text-white px-6 py-2.5 rounded-full text-sm font-bold transition-all active:scale-95 shadow-md"
        >
          <span>←</span> West
        </button>

        <button
          onClick={() => goToRegion("EAST")}
          className="hover:cursor-pointer flex items-center gap-x-2 bg-slate-800 hover:bg-slate-700 text-white px-6 py-2.5 rounded-full text-sm font-bold transition-all active:scale-95 shadow-md"
        >
          East <span>→</span>
        </button>

        <button
          onClick={() => goToRegion("NORTH")}
          className="hover:cursor-pointer flex items-center gap-x-2 bg-slate-800 hover:bg-slate-700 text-white px-6 py-2.5 rounded-full text-sm font-bold transition-all active:scale-95 shadow-md"
        >
          <span>↑</span> North
        </button>

        <button
          onClick={() => goToRegion("SOUTH")}
          className="hover:cursor-pointer flex items-center gap-x-2 bg-slate-800 hover:bg-slate-700 text-white px-6 py-2.5 rounded-full text-sm font-bold transition-all active:scale-95 shadow-md"
        >
          <span>↓</span> South
        </button>

        {/* Reset Button (Ghost Style) */}
        <button
          onClick={() => goToRegion("ALL")}
          className="hover:cursor-pointer flex items-center gap-x-2 bg-white/50 border border-slate-200 hover:bg-slate-100 text-slate-600 px-6 py-2.5 rounded-full text-sm font-bold transition-all active:scale-95"
        >
          <span>↺</span> Reset
        </button>
      </div>
    </div>
  );
}
