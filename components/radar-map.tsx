"use client";

import "leaflet/dist/leaflet.css";
import { MapPin } from "lucide-react";
import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";

const L = typeof window !== "undefined" ? require("leaflet") : null;

interface RadarFrame {
  time: number;
  path: string;
}

const RadarMap: React.FC = () => {
  const mapRef = useRef<L.Map | null>(null);
  const currentLayerRef = useRef<L.TileLayer | null>(null);
  const nextLayerRef = useRef<L.TileLayer | null>(null);
  const [radarFrames, setRadarFrames] = useState<RadarFrame[] | null>(null);
  const [currentIndex, setCurrentIndex] = useState<number>(-12);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [clock, setClock] = useState<string>(new Date().toLocaleTimeString());
  const rainViewerHost = useRef<string | null>(null);

  /** Initialize the map */
  useEffect(() => {
    if (typeof window === "undefined" || !L) return;

    if (!mapRef.current) {
      mapRef.current = L.map("map", {
        center: [63.0, 14.0],
        zoom: 5,
      });

      L.tileLayer(
        "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png",
        {
          attribution: "&copy; OpenStreetMap contributors &copy; CARTO",
        }
      ).addTo(mapRef.current);
    }
  }, []);

  /** Fetch radar frames */
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

  /** Find closest radar frame to timestamp */
  const findClosestFrame = (frames: RadarFrame[], targetTimestamp: number) => {
    return frames.reduce((prev, curr) =>
      Math.abs(curr.time - targetTimestamp) <
      Math.abs(prev.time - targetTimestamp)
        ? curr
        : prev
    );
  };

  /** Update radar layer with ultra-fast transition */
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

    // Create new layer with ultra-fast fade-in effect
    if (nextLayerRef.current) {
      nextLayerRef.current.setUrl(tileUrl);
      nextLayerRef.current.setOpacity(0.7);

      // Swap layers faster (200ms instead of 300ms)
      setTimeout(() => {
        if (currentLayerRef.current) {
          mapRef.current?.removeLayer(currentLayerRef.current);
        }
        currentLayerRef.current = nextLayerRef.current;
        nextLayerRef.current = null;
      }, 200);
    } else {
      nextLayerRef.current = L.tileLayer(tileUrl, {
        opacity: 0,
        attribution: "Radar data © RainViewer",
      }).addTo(mapRef.current!);

      setTimeout(() => {
        nextLayerRef.current?.setOpacity(0.7);
      }, 100);
    }
  };

  /** Animation logic (4x Speed - Ultra Fast) */
  useEffect(() => {
    if (typeof window === "undefined") return;

    const interval = setInterval(() => {
      if (!isPaused) {
        setCurrentIndex((prevIndex) => (prevIndex >= 3 ? -12 : prevIndex + 1));
      }
    }, 500); // 🚀 4x Speed (500ms instead of 1500ms)

    return () => clearInterval(interval);
  }, [isPaused]);

  /** Update radar frame */
  useEffect(() => {
    updateMapByIndex(currentIndex);
  }, [currentIndex, radarFrames]);

  /** Update clock */
  useEffect(() => {
    if (typeof window === "undefined") return;

    const clockInterval = setInterval(() => {
      setClock(new Date().toLocaleTimeString());
    }, 1000);

    return () => clearInterval(clockInterval);
  }, []);

  return (
    <>
      <div className="fixed top-2 right-2 bg-white p-2 rounded shadow-md z-50">
        <span>{clock}</span>
      </div>
      <div className="flex flex-col relative text-center bg-white text-black">
        <div id="map" className="w-full h-[600px] relative rounded-lg"></div>
        <button
          type="button"
          onClick={() =>
            navigator.geolocation.getCurrentPosition((position) => {
              console.log(position.coords.latitude, position.coords.longitude);
            })
          }
          className="z-[999] flex items-center gap-x-2 bg-blue-500 right-4 bottom-32 sm:bottom-20 absolute text-white px-4 py-2 rounded-lg"
        >
          Se din plats på kartan
          <MapPin />
        </button>
        <p className="text-lg font-bold absolute top-4 right-4 z-[999]">
          {currentIndex * 10 > 0
            ? `Om ${currentIndex * 10} min`
            : `För ${-currentIndex * 10} min sedan`}
        </p>
        <div className="flex absolute bottom-14 sm:bottom-6 h-fit inset-x-0 px-4 w-full z-[999] gap-x-4">
          <div className="flex justify-center w-full items-center bg-gray-200 rounded-lg px-4 gap-2">
            <input
              type="range"
              min="-12"
              max="3"
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
