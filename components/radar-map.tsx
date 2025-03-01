"use client";

import "leaflet/dist/leaflet.css";
import { MapPin, PauseIcon, PlayIcon } from "lucide-react";
import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";

const L = typeof window !== "undefined" ? require("leaflet") : null;

interface RadarFrame {
  time: number;
  path: string;
}

const RadarMap: React.FC = () => {
  const mapRef = useRef<L.Map | null>(null);
  const layersRef = useRef<L.TileLayer[]>([]);
  const markerRef = useRef<L.Marker | null>(null);
  const [radarFrames, setRadarFrames] = useState<RadarFrame[] | null>(null);
  // Vi fortsätter med currentIndex som tidsskillnad (i steg om 10 minuter)
  const [currentIndex, setCurrentIndex] = useState<number>(-12);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [clock, setClock] = useState<string>(new Date().toLocaleTimeString());
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const rainViewerHost = useRef<string | null>(null);
  const transitionTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  /** Initialize the map and layers */
  useEffect(() => {
    if (typeof window === "undefined" || !L) return;

    if (!mapRef.current) {
      mapRef.current = L.map("map", {
        center: [63.0, 14.0],
        zoom: 5,
        fadeAnimation: true,
        zoomAnimation: false,
      });

      L.tileLayer(
        "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png",
        {
          attribution: "© OpenStreetMap contributors © CARTO",
        }
      ).addTo(mapRef.current);

      layersRef.current = [
        L.tileLayer("", {
          opacity: 0,
          attribution: "Radar data © RainViewer",
          tileSize: 256,
          noWrap: true,
        }).addTo(mapRef.current),
        L.tileLayer("", {
          opacity: 0,
          attribution: "Radar data © RainViewer",
          tileSize: 256,
          noWrap: true,
        }).addTo(mapRef.current),
        L.tileLayer("", {
          opacity: 0,
          attribution: "Radar data © RainViewer",
          tileSize: 256,
          noWrap: true,
        }).addTo(mapRef.current),
      ];
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

  /** Preload next frame */
  const preloadImage = (url: string) => {
    const img = new Image();
    img.src = url;
  };

  /** Find closest radar frame to timestamp */
  const findClosestFrame = (frames: RadarFrame[], targetTimestamp: number) => {
    return frames.reduce((prev, curr) =>
      Math.abs(curr.time - targetTimestamp) <
      Math.abs(prev.time - targetTimestamp)
        ? curr
        : prev
    );
  };

  /** Update radar layer with ultra-smooth transition */
  const updateMapByIndex = (index: number) => {
    if (!radarFrames || !rainViewerHost.current || !mapRef.current) return;

    const minutesOffset = index * 10;
    const targetTimestamp = Math.floor(
      (Date.now() + minutesOffset * 60000) / 1000
    );
    const frame = findClosestFrame(radarFrames, targetTimestamp);
    const tileUrl = `${rainViewerHost.current}${frame.path}/256/{z}/{x}/{y}/5/1_0.png`;

    if (transitionTimeoutRef.current) {
      clearTimeout(transitionTimeoutRef.current);
    }

    const currentLayer = layersRef.current[0];
    const nextLayer = layersRef.current[1];
    const bufferLayer = layersRef.current[2];

    preloadImage(tileUrl);
    bufferLayer.setUrl(tileUrl);
    bufferLayer.setOpacity(0);

    requestAnimationFrame(() => {
      currentLayer.setOpacity(0);
      nextLayer.setOpacity(0.7);

      transitionTimeoutRef.current = setTimeout(() => {
        layersRef.current = [nextLayer, bufferLayer, currentLayer];
      }, 400);
    });
  };

  /** Animation logic */
  useEffect(() => {
    if (typeof window === "undefined") return;

    const interval = setInterval(() => {
      if (!isPaused) {
        setCurrentIndex((prevIndex) => (prevIndex >= 3 ? -12 : prevIndex + 1));
      }
    }, 600);

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

  /** Handle geolocation */
  const handleGetLocation = () => {
    if (!mapRef.current || typeof window === "undefined" || !L) return;

    setIsLoading(true);
    setError(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        console.log(`Latitud: ${latitude}, Longitud: ${longitude}`);

        if (markerRef.current) {
          mapRef.current.removeLayer(markerRef.current);
        }

        const customIcon = L.icon({
          iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
          iconRetinaUrl:
            "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
          shadowUrl:
            "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
          iconSize: [25, 41],
          iconAnchor: [12, 41],
          popupAnchor: [1, -34],
          shadowSize: [41, 41],
        });

        markerRef.current = L.marker([latitude, longitude], { icon: customIcon }).addTo(mapRef.current);
        mapRef.current.setView([latitude, longitude], 7); // Zoomar ut till nivå 7

        setIsLoading(false);
      },
      (err) => {
        setError("Kunde inte hämta din plats. Kontrollera platstjänster.");
        setIsLoading(false);
        console.error(err.message);
      }
    );
  };

  // Beräkna aktuell radarbild baserat på currentIndex
  const currentFrame =
    radarFrames && rainViewerHost.current
      ? findClosestFrame(
          radarFrames,
          Math.floor((Date.now() + currentIndex * 10 * 60000) / 1000)
        )
      : null;

  // Skapa schema baserat på den beräknade bilden
  const weatherForecastSchema = currentFrame
    ? {
        "@context": "https://schema.org/",
        "@type": "WeatherForecast",
        "name": "Regnradar för Sverige och världen",
        "url": "https://regnkarta.se/regnradar",
        "datePublished": new Date(currentFrame.time * 1000).toISOString(),
        "location": {
          "@type": "Place",
          "name": "Sweden",
        },
      }
    : null;

  return (
    <>
      <style jsx>{`
        .leaflet-tile {
          transition: opacity 0.4s ease-in-out;
          will-change: opacity;
        }
        .leaflet-container {
          background: #fff;
        }
      `}</style>
      {weatherForecastSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(weatherForecastSchema) }}
        />
      )}
      <div className="flex flex-col relative text-center bg-white text-black">
        <div id="map" className="w-full h-[600px] relative rounded-lg"></div>

        <div className="absolute bottom-24 sm:bottom-20 left-0 flex flex-row justify-between w-full z-[999] px-4">
          <p className="text-white px-4 py-2 rounded-lg flex items-center gap-x-2 justify-center bg-blue-500 w-[8.8rem]">
            {currentIndex * 10 > 0
              ? `Om ${currentIndex * 10} min`
              : `${-currentIndex * 10} min sedan`}
          </p>
          <button
            type="button"
            onClick={handleGetLocation}
            className="flex items-center gap-x-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
            disabled={isLoading}
          >
            {isLoading ? (
              <span>Laddar...</span>
            ) : (
              <>
                Din plats på kartan
                <MapPin className="h-5 w-5" />
              </>
            )}
          </button>
        </div>

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
            className="h-full min-w-[60px] sm:min-w-[80px] px-4 py-2 bg-blue-500 text-white rounded-lg shadow hover:bg-blue-600 flex items-center justify-center"
          >
            {isPaused ? (
              <PlayIcon className="h-6 w-6" />
            ) : (
              <PauseIcon className="h-6 w-6" />
            )}
          </button>
        </div>

        {error && (
          <p className="absolute bottom-32 left-4 text-red-500 bg-white p-2 rounded-lg z-[999]">
            {error}
          </p>
        )}
      </div>
    </>
  );
};

export default dynamic(() => Promise.resolve(RadarMap), { ssr: false });
