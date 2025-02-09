"use client";

import "leaflet/dist/leaflet.css";
import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";

const L = typeof window !== "undefined" ? require("leaflet") : null;

interface RadarFrame {
  time: number;
  path: string;
}

const RadarMap: React.FC = () => {
  const mapRef = useRef<L.Map | null>(null);
  const radarLayerRef = useRef<L.TileLayer | null>(null);
  const [radarFrames, setRadarFrames] = useState<RadarFrame[] | null>(null);
  const [currentIndex, setCurrentIndex] = useState<number>(-6);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [clock, setClock] = useState<string>(new Date().toLocaleTimeString());
  const rainViewerHost = useRef<string | null>(null);

  useEffect(() => {
    if (typeof window === "undefined" || !L) return;

    if (!mapRef.current) {
      mapRef.current = L.map("map", {
        center: [63.0, 14.0],
        zoom: 5,
        maxBounds: [
          [54, 3],
          [71, 31],
        ],
        maxBoundsViscosity: 1.0,
      });

      L.tileLayer(
        "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png",
        {
          attribution: "&copy; OpenStreetMap contributors &copy; CARTO",
          maxZoom: 19,
        }
      ).addTo(mapRef.current);
    }
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const fetchRadarData = async () => {
      try {
        const response = await fetch(
          "https://api.rainviewer.com/public/weather-maps.json"
        );
        const data = await response.json();
        if (data?.radar) {
          let frames: RadarFrame[] = [
            ...(data.radar.past || []),
            ...(data.radar.nowcast || []),
          ];
          frames.sort((a, b) => a.time - b.time);
          setRadarFrames(frames);
          rainViewerHost.current = data.host;
        }
      } catch (error) {
        console.error("Failed to fetch radar data:", error);
      }
    };
    fetchRadarData();
  }, []);

  const findClosestFrame = (frames: RadarFrame[], targetTimestamp: number) => {
    return frames.reduce((prev, curr) =>
      Math.abs(curr.time - targetTimestamp) <
      Math.abs(prev.time - targetTimestamp)
        ? curr
        : prev
    );
  };

  const updateMapByIndex = (index: number) => {
    if (
      !radarFrames ||
      !rainViewerHost.current ||
      typeof window === "undefined"
    )
      return;
    let minutesOffset = index * 10;
    const targetTimestamp = Math.floor(
      (Date.now() + minutesOffset * 60000) / 1000
    );
    const frame = findClosestFrame(radarFrames, targetTimestamp);

    const tileUrl = `${rainViewerHost.current}${frame.path}/256/{z}/{x}/{y}/5/1_0.png`;

    if (radarLayerRef.current) {
      mapRef.current?.removeLayer(radarLayerRef.current);
    }
    radarLayerRef.current = L.tileLayer(tileUrl, {
      opacity: 0.7,
      attribution: "Radar data © RainViewer",
    }).addTo(mapRef.current!);
  };

  useEffect(() => {
    if (typeof window === "undefined") return;

    const interval = setInterval(() => {
      if (!isPaused) {
        setCurrentIndex((prevIndex) => (prevIndex >= 6 ? -6 : prevIndex + 1));
      }
    }, 500);
    return () => clearInterval(interval);
  }, [isPaused]);

  useEffect(() => {
    updateMapByIndex(currentIndex);
  }, [currentIndex, radarFrames]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const clockInterval = setInterval(() => {
      setClock(new Date().toLocaleTimeString());
    }, 500);
    return () => clearInterval(clockInterval);
  }, []);

  return (
    <>
      <div className="fixed top-2 right-2 bg-white p-2 rounded shadow-md z-50">
        <span>{clock}</span>
      </div>
      <div className="flex flex-col relative text-center bg-white text-black">
        <div id="map" className="w-full h-[600px] relative rounded-lg"></div>
        <p
          className="text-lg font-bold absolute top-4 right-4 z-[999]"
          id="timeLabel"
        >
          {currentIndex * 10 > 0
            ? "Om " + currentIndex * 10 + " min"
            : "För " + currentIndex * 10 * -1 + " min sedan"}
        </p>
        <div className="flex absolute bottom-6 h-fit inset-x-0 px-4 w-full z-[999] gap-x-4">
          <div className="flex justify-center w-full items-center bg-gray-200 rounded-lg px-4 gap-2">
            <input
              type="range"
              min="-6"
              max="6"
              value={currentIndex}
              step="1"
              onChange={(e) => setCurrentIndex(Number(e.target.value))}
              className="w-full"
            />
          </div>
          <button
            onClick={() => setIsPaused(!isPaused)}
            className="h-full px-4 py-2 bg-blue-500 text-white rounded-lg shadow hover:bg-blue-600"
          >
            {isPaused ? "Spela" : "Pausa"}
          </button>
        </div>
      </div>
    </>
  );
};

export default dynamic(() => Promise.resolve(RadarMap), { ssr: false });
