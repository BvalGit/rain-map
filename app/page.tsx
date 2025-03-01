"use client";

import RadarMap from "@/components/radar-map";
import {
  AlertTriangle,
  BarChart,
  Building,
  Clock,
  Cloud,
  CloudLightning,
  CloudRain,
  Droplets,
  Eye,
  HelpCircle,
  Info,
  Map,
  MapPin,
  Radar,
  Smartphone,
  Zap,
} from "lucide-react";
import { useEffect, useState } from "react";

declare global {
  interface Window {
    adsbygoogle: object[];
  }
}

const reflectivityLevels = [
  { level: "Lätt", color: "bg-green-500", range: "0,08-0,1 mm/timme" },
  { level: "Måttlig", color: "bg-green-300", range: "0,1-1,0 mm/timme" },
  { level: "Kraftig", color: "bg-teal-200", range: "1,0-2,5 mm/timme" },
  { level: "Intensiv", color: "bg-blue-300", range: "2,5-5,0 mm/timme" },
  { level: "Extrem", color: "bg-blue-600", range: "> 5,0 mm/timme" },
];

export default function Home() {
  const [adLoadAttempts, setAdLoadAttempts] = useState(0);

  const loadAdsWithRetry = () => {
    const maxRetries = 5;
    const retryInterval = 1000;

    const loadAds = () => {
      try {
        if (window.adsbygoogle) {
          (window.adsbygoogle = window.adsbygoogle || []).push({});
          console.log("Ads loaded");
        }
      } catch (err) {
        console.error("Adsbygoogle failed to load:", err);
      }
    };

    const retryAdLoading = () => {
      if (adLoadAttempts < maxRetries) {
        setTimeout(() => {
          loadAds();
          setAdLoadAttempts(adLoadAttempts + 1);
        }, retryInterval);
      } else {
        console.warn("Max retries for ad loading reached");
      }
    };

    loadAds();
    if (adLoadAttempts < maxRetries) {
      retryAdLoading();
    }
  };

  useEffect(() => {
    loadAdsWithRetry();
  }, []);

  // WebPage-schema för hela sidan
  const webPageSchema = {
    "@context": "https://schema.org/",
    "@type": "WebPage",
    "name": "Regnradar över Sverige och Världen",
    "description": "Se nederbörd live tillsammans med framtidsprognos via vår regnradar.",
    "image": "/regnradar.webp", // Ersätt med URL till en av dina tre bilder
    "publisher": {
      "@type": "Organization",
      "name": "Regnradar - Regnkarta.se",
      "logo": "/header.webp", // URL till din header-logo
    },
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Lägg till WebPage-schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageSchema) }}
      />
      <header className="bg-white shadow-sm">
        <link rel="icon" type="image/png" href="/favicon.webp" />
        <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
          <img className="w-48 sm:w-64 mx-auto" src="/header.webp" alt="Regnkarta.se Logo" />
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="mb-8">
          <RadarMap />

          <div className="flex w-full flex-col gap-y-3">
            <p className="text-center">Annons</p>
            <ins
              className="adsbygoogle"
              style={{ display: "block" }}
              data-ad-format="fluid"
              data-ad-layout-key="-fb+5w+4e-db+86"
              data-ad-client="ca-pub-5578135265480546"
              data-ad-slot="6935006294"
            ></ins>
          </div>

          <h1 className="text-3xl font-bold text-center text-gray-900 my-8">
            Regnradar - Följ nederbörden i realtid och prognosen framåt
          </h1>

          <div className="bg-white shadow-lg rounded-lg p-4">
            <h3 className="text-sm font-semibold mb-2 flex items-center gap-2">
              <Droplets className="h-4 w-4" />
              Regnintensitet
            </h3>
            <div className="grid grid-cols-5 gap-2">
              {reflectivityLevels.map((level) => (
                <div key={level.level} className="text-center">
                  <div className={`h-4 ${level.color} rounded`}></div>
                  <div className="text-xs mt-1">{level.level}</div>
                  <div className="text-xs text-gray-500">{level.range}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex w-full flex-col gap-y-3">
            <p className="text-center">Annons</p>
            <ins
              className="adsbygoogle"
              style={{ display: "block" }}
              data-ad-format="fluid"
              data-ad-layout-key="-fb+5w+4e-db+86"
              data-ad-client="ca-pub-5578135265480546"
              data-ad-slot="8393990831"
            ></ins>
          </div>

          <div className="space-y-12 mt-8">
            <section className="bg-white rounded-lg shadow-lg p-8">
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <Radar className="h-6 w-6 text-blue-600" />
                Regnradar - Så fungerar den
              </h2>
              <div className="prose max-w-none">
                <p className="text-gray-600 mb-6">
                  Regnradar är en avancerad teknologisk apparatur som spelar en
                  avgörande roll inom meteorologin genom att använda radarbilder
                  för att övervaka regn, dess intensitet och rörelsemönster...
                </p>

                <div className="grid md:grid-cols-3 gap-8 mt-8">
                  <div className="bg-blue-50 p-6 rounded-lg flex flex-col h-full">
                    <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                      <CloudRain className="h-5 w-5 text-blue-600" />
                      Dopplerteknik och regnradar
                    </h3>
                    <p className="text-sm text-gray-600 pb-2">
                      Dopplertekniken är en central komponent i regnradarsystem...
                    </p>
                    <img className="rounded-lg mt-auto pt-1" src="/regnradar.webp" alt="Regnradar" />
                  </div>

                  <div className="bg-blue-50 p-6 rounded-lg flex flex-col h-full">
                    <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                      <Radar className="h-5 w-5 text-blue-600" />
                      Regnradarstationer i Norden
                    </h3>
                    <p className="text-sm text-gray-600">
                      Norden har ett välutvecklat nätverk av regnradarstationer...
                    </p>
                    <img className="rounded-lg mt-auto pt-1" src="/regnradarstation.webp" alt="Regnradarstation" />
                  </div>

                  <div className="bg-blue-50 p-6 rounded-lg flex flex-col h-full">
                    <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                      <Info className="h-5 w-5 text-blue-600" />
                      Räckvidd och täckning
                    </h3>
                    <p className="text-sm text-gray-600">
                      En regnradarstation har en räckvidd på cirka 24 mil...
                    </p>
                    <img className="rounded-lg mt-auto pt-1" src="/regnradar-i-sverige.webp" alt="Regnradar i Sverige" />
                  </div>
                </div>
              </div>
            </section>

            {/* Resterande sektioner förkortas för läsbarhet */}
            <section className="bg-white rounded-lg shadow-lg p-8">
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <AlertTriangle className="h-6 w-6 text-yellow-600" />
                Faktorer som kan störa regnradarns bild
              </h2>
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-lg font-semibold mb-3">Atmosfäriska störningar</h3>
                  <p className="text-gray-600">Olika atmosfäriska förhållanden kan påverka...</p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-3">Tekniska problem och begränsningar</h3>
                  <p className="text-gray-600">En regnradarstation kan tillfälligt vara ur drift...</p>
                </div>
              </div>
            </section>

            <section className="bg-white rounded-lg shadow-lg p-8">
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <Info className="h-6 w-6 text-blue-600" />
                Så kan du använda vår regnradar
              </h2>
              <div className="grid md:grid-cols-3 gap-8">
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold">Kolla in aktuell nederbörd</h3>
                  <p className="text-gray-600">Få en översikt över var det regnar just nu...</p>
                </div>
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold">Planera dina aktiviteter</h3>
                  <p className="text-gray-600">Undvik regnskurar och planera dina utomhusaktiviteter...</p>
                </div>
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold">Följ väderförändringar</h3>
                  <p className="text-gray-600">Var förberedd på väderförändringar...</p>
                </div>
              </div>
            </section>

            <section className="bg-white shadow-lg rounded-lg p-8">
              <h2 className="text-3xl font-bold mb-8 flex items-center gap-2">
                <HelpCircle className="h-8 w-8 text-blue-600" />
                FAQ – Vanliga frågor om regnradar och regn
              </h2>
              <div className="grid md:grid-cols-2 gap-8">
                {/* FAQ-innehållet förkortas här */}
              </div>
            </section>
          </div>

          <div className="flex w-full flex-col gap-y-3">
            <p className="text-center">Annons</p>
            <ins
              className="adsbygoogle"
              style={{ display: "block" }}
              data-ad-format="fluid"
              data-ad-layout-key="-fb+5w+4e-db+86"
              data-ad-client="ca-pub-5578135265480546"
              data-ad-slot="6404691128"
            ></ins>
          </div>

          <div className="bg-blue-50 p-4 rounded-lg">
            <p className="text-sm text-blue-800">
              Radaranimationen visar nederbördsintensitet över Norden...
            </p>
          </div>

          <div className="flex w-full flex-col gap-y-3">
            <p className="text-center">Annons</p>
            <ins
              className="adsbygoogle"
              style={{ display: "block" }}
              data-ad-format="fluid"
              data-ad-layout-key="-fb+5w+4e-db+86"
              data-ad-client="ca-pub-5578135265480546"
              data-ad-slot="1145992566"
            ></ins>
          </div>

          <div className="bg-white shadow-lg rounded-lg overflow-hidden">
            <div className="p-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Hur det fungerar</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="flex flex-col items-center text-center">
                  <div className="bg-blue-100 p-4 rounded-full mb-4">
                    <MapPin className="h-8 w-8 text-blue-600" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">Välj plats</h3>
                  <p className="text-gray-600">Välj din plats eller låt appen upptäcka den...</p>
                </div>
                <div className="flex flex-col items-center text-center">
                  <div className="bg-blue-100 p-4 rounded-full mb-4">
                    <Cloud className="h-8 w-8 text-blue-600" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">Kolla prognosen</h3>
                  <p className="text-gray-600">Se regnprognosen för ditt valda område...</p>
                </div>
                <div className="flex flex-col items-center text-center">
                  <div className="bg-blue-100 p-4 rounded-full mb-4">
                    <Droplets className="h-8 w-8 text-blue-600" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">Håll dig informerad</h3>
                  <p className="text-gray-600">Få realtidsuppdateringar om regnmönster...</p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex w-full flex-col gap-y-3">
            <p className="text-center">Annons</p>
            <ins
              className="adsbygoogle"
              style={{ display: "block" }}
              data-ad-format="fluid"
              data-ad-layout-key="-fb+5w+4e-db+86"
              data-ad-client="ca-pub-5578135265480546"
              data-ad-slot="4810609678"
            ></ins>
          </div>

          <div className="mt-12 bg-blue-50 rounded-lg p-6 flex items-start">
            <Info className="h-6 w-6 text-blue-600 mr-4 flex-shrink-0 mt-1" />
            <p className="text-blue-800">
              Våra avancerade algoritmer ger noggranna regnprognoser...
            </p>
          </div>

          <div className="flex w-full flex-col gap-y-3">
            <p className="text-center">Annons</p>
            <ins
              className="adsbygoogle"
              style={{ display: "block" }}
              data-ad-format="fluid"
              data-ad-layout-key="-fb+5w+4e-db+86"
              data-ad-client="ca-pub-5578135265480546"
              data-ad-slot="6935006294"
            ></ins>
          </div>
        </div>
      </main>
    </div>
  );
}