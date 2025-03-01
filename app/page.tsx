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

// Declare adsbygoogle on the global Window interface
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

  // Function to load ads and retry if not loaded
  const loadAdsWithRetry = () => {
    const maxRetries = 5;
    const retryInterval = 1000; // 1 second delay

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

    // First attempt
    loadAds();

    // Retry if necessary
    if (adLoadAttempts < maxRetries) {
      retryAdLoading();
    }
  };

  // Trigger ad loading after listings have loaded
  useEffect(() => {
    loadAdsWithRetry();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
      <link rel="icon" type="image/png" href="/favicon.webp" />
        <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
          <img className="w-64" src="/header.webp"></img>
        </div>
      </header>

      {/* <div className="flex w-full flex-col gap-y-3">
        <p className="text-center">Annons</p>
        <ins
          className="adsbygoogle"
          style={{ display: "block" }}
          data-ad-format="fluid"
          data-ad-layout-key="-fb+5w+4e-db+86"
          data-ad-client="ca-pub-5578135265480546"
          data-ad-slot="4810609678"
        ></ins>
      </div> */}

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {/* Radar Map */}
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

          {/* Reflectivity Legend */}
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

          {/* Information Sections */}
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
                  för att övervaka regn, dess intensitet och rörelsemönster.
                  Genom att analysera data från en regnradar kan meteorologer
                  förutse var och när regn kommer att falla, vilket är särskilt
                  viktigt för väderprognoser, varningar vid kraftigt regn och
                  planering inom olika verksamheter. Med en regnradar kan du i
                  realtid följa regnets utveckling, se nederbördsområdens
                  utbredning och få en bild av hur vädret förändras över tid.
                </p>

                <div className="grid md:grid-cols-3 gap-8 mt-8">
  <div className="bg-blue-50 p-6 rounded-lg flex flex-col h-full">
    <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
      <CloudRain className="h-5 w-5 text-blue-600" />
      Dopplerteknik och regnradar
    </h3>
    <p className="text-sm text-gray-600 pb-2">
      Dopplertekniken är en central komponent i regnradarsystem, vilket möjliggör noggrann övervakning av regn och dess rörelse. Genom att analysera förändringar i radarvågornas frekvens kan regnradarn inte bara upptäcka nederbörd utan även ge värdefull information om vindmönster och regnets intensitet.
    </p>
    <img className="rounded-lg mt-auto pt-1" src="/regnradar.webp" alt="Regnradar" />
  </div>

  <div className="bg-blue-50 p-6 rounded-lg flex flex-col h-full">
    <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
      <Radar className="h-5 w-5 text-blue-600" />
      Regnradarstationer i Norden
    </h3>
    <p className="text-sm text-gray-600">
      Norden har ett välutvecklat nätverk av regnradarstationer som täcker Sverige, Norge och Finland. Dessa radarstationer arbetar tillsammans för att ge en heltäckande bild av regn och nederbörd i realtid, vilket förbättrar väderprognoser och varningar för kraftigt regn.
    </p>
    <img className="rounded-lg mt-auto pt-1" src="/regnradarstation.webp" alt="Regnradarstation" />
  </div>

  <div className="bg-blue-50 p-6 rounded-lg flex flex-col h-full">
    <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
      <Info className="h-5 w-5 text-blue-600" />
      Räckvidd och täckning
    </h3>
    <p className="text-sm text-gray-600">
      En regnradarstation har en räckvidd på cirka 24 mil och kan effektivt detektera regn och nederbörd inom detta område. Genom att kombinera data från flera radarstationer skapas en mer detaljerad och exakt bild av regnvädret, vilket hjälper både meteorologer och allmänheten att följa regnets utveckling.
    </p>
    <img className="rounded-lg mt-auto pt-1" src="/regnradar-i-sverige.webp" alt="Regnradar i Sverige" />
  </div>
</div>
              </div>
            </section>

            <section className="bg-white rounded-lg shadow-lg p-8">
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <AlertTriangle className="h-6 w-6 text-yellow-600" />
                Faktorer som kan störa regnradarns bild
              </h2>
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-lg font-semibold mb-3">
                    Atmosfäriska störningar
                  </h3>
                  <p className="text-gray-600">
                    Olika atmosfäriska förhållanden kan påverka regnradarns
                    noggrannhet och förmåga att ge en tydlig bild av regn och
                    nederbörd. Starka vindar, temperaturinversioner och kraftiga
                    åskoväder kan orsaka störningar i radarsignalen. I vissa
                    fall kan även fukt i luften reflektera radarsignaler på ett
                    sätt som gör att regnradarn registrerar falska ekon, vilket
                    kan påverka prognosens tillförlitlighet.
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-3">
                    Tekniska problem och begränsningar
                  </h3>
                  <p className="text-gray-600">
                    En regnradarstation kan tillfälligt vara ur drift på grund
                    av tekniska problem, underhåll eller extrema
                    väderförhållanden. Dessutom kan berg, höga byggnader eller
                    andra hinder blockera radarsignaler och skapa skuggområden
                    där regnradarn har svårt att detektera nederbörd. För att
                    minimera dessa begränsningar används flera
                    regnradarstationer tillsammans för att skapa en mer
                    heltäckande och exakt bild av regnvädret.
                  </p>
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
                  <h3 className="text-lg font-semibold">
                    Kolla in aktuell nederbörd
                  </h3>
                  <p className="text-gray-600">
                    Få en översikt över var det regnar just nu i realtid.
                  </p>
                </div>
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold">
                    Planera dina aktiviteter
                  </h3>
                  <p className="text-gray-600">
                    Undvik regnskurar och planera dina utomhusaktiviteter.
                  </p>
                </div>
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold">
                    Följ väderförändringar
                  </h3>
                  <p className="text-gray-600">
                    Var förberedd på väderförändringar och anpassa dina planer.
                  </p>
                </div>
              </div>
            </section>

            {/* FAQ Section */}
            <section className="bg-white shadow-lg rounded-lg p-8">
              <h2 className="text-3xl font-bold mb-8 flex items-center gap-2">
                <HelpCircle className="h-8 w-8 text-blue-600" />
                FAQ – Vanliga frågor om regnradar och regn
              </h2>
              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
                      <Radar className="h-5 w-5 text-blue-600" />
                      1. Vad är en regnradar?
                    </h3>
                    <p className="text-gray-600">
                      En regnradar är ett meteorologiskt verktyg som används för
                      att övervaka regn och nederbörd i realtid.
                    </p>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
                      <Zap className="h-5 w-5 text-blue-600" />
                      2. Hur fungerar en regnradar?
                    </h3>
                    <p className="text-gray-600">
                      Regnradarn sänder ut radiosignaler som reflekteras av
                      regndroppar, vilket gör det möjligt att mäta regnets
                      intensitet, rörelse och utbredning.
                    </p>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
                      <BarChart className="h-5 w-5 text-blue-600" />
                      3. Hur noggrann är en regnradar?
                    </h3>
                    <p className="text-gray-600">
                      Regnradar är mycket exakt för att detektera regn men kan
                      påverkas av atmosfäriska störningar och fysiska hinder som
                      berg och höga byggnader.
                    </p>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
                      <Clock className="h-5 w-5 text-blue-600" />
                      4. Kan en regnradar förutse regn?
                    </h3>
                    <p className="text-gray-600">
                      Ja, genom att analysera nederbördens rörelse kan
                      regnradarn ge en korttidsprognos för var regn väntas falla
                      inom de närmaste timmarna.
                    </p>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
                      <Eye className="h-5 w-5 text-blue-600" />
                      5. Hur långt kan en regnradar se?
                    </h3>
                    <p className="text-gray-600">
                      En regnradarstation har en räckvidd på cirka 24 mil och
                      kan upptäcka regn inom detta område.
                    </p>
                  </div>
                </div>
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
                      <CloudLightning className="h-5 w-5 text-blue-600" />
                      6. Kan en regnradar skilja mellan lätt och kraftigt regn?
                    </h3>
                    <p className="text-gray-600">
                      Ja, regnradarn kan mäta regndropparnas storlek och
                      intensitet, vilket gör det möjligt att skilja mellan
                      duggregn, normalt regn och skyfall.
                    </p>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
                      <AlertTriangle className="h-5 w-5 text-blue-600" />
                      7. Vad kan störa en regnradars bild av regn?
                    </h3>
                    <p className="text-gray-600">
                      Atmosfäriska störningar, tekniska problem och hinder som
                      berg kan påverka regnradarns förmåga att ge en exakt bild
                      av nederbörden.
                    </p>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
                      <Map className="h-5 w-5 text-blue-600" />
                      8. Finns det regnradar i Sverige?
                    </h3>
                    <p className="text-gray-600">
                      Ja, Sverige har ett omfattande nätverk av
                      regnradarstationer som övervakar regn och nederbörd i hela
                      landet.
                    </p>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
                      <Smartphone className="h-5 w-5 text-blue-600" />
                      9. Kan jag följa regnradar i realtid?
                    </h3>
                    <p className="text-gray-600">
                      Ja, det finns flera webbplatser och appar där du kan se
                      regnradarbilder i realtid och följa regnets rörelse.
                    </p>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
                      <Building className="h-5 w-5 text-blue-600" />
                      10. Används regnradar för mer än att bara följa regn?
                    </h3>
                    <p className="text-gray-600">
                      Ja, regnradar används även för att övervaka snö, hagel och
                      andra typer av nederbörd samt för att förbättra
                      väderprognoser.
                    </p>
                  </div>
                </div>
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
              Radaranimationen visar nederbördsintensitet över Norden. Bilden
              uppdateras automatiskt var 5:e minut. Starkare färger indikerar
              kraftigare nederbörd.
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
        </div>

        {/* How it works section */}
        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          <div className="p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
              Hur det fungerar
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="flex flex-col items-center text-center">
                <div className="bg-blue-100 p-4 rounded-full mb-4">
                  <MapPin className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Välj plats</h3>
                <p className="text-gray-600">
                  Välj din plats eller låt appen upptäcka den automatiskt.
                </p>
              </div>
              <div className="flex flex-col items-center text-center">
                <div className="bg-blue-100 p-4 rounded-full mb-4">
                  <Cloud className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Kolla prognosen</h3>
                <p className="text-gray-600">
                  Se regnprognosen för ditt valda område.
                </p>
              </div>
              <div className="flex flex-col items-center text-center">
                <div className="bg-blue-100 p-4 rounded-full mb-4">
                  <Droplets className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold mb-2">
                  Håll dig informerad
                </h3>
                <p className="text-gray-600">
                  Få realtidsuppdateringar om regnmönster och intensitet.
                </p>
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

        {/* Additional Info */}
        <div className="mt-12 bg-blue-50 rounded-lg p-6 flex items-start">
          <Info className="h-6 w-6 text-blue-600 mr-4 flex-shrink-0 mt-1" />
          <p className="text-blue-800">
            Våra avancerade algoritmer ger noggranna regnprognoser som hjälper
            dig planera din dag effektivt. Oavsett om du planerar ett
            utomhusevenemang eller bara vill veta om du behöver ett paraply, har
            Regnkarta dig täckt!
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
      </main>
    </div>
  );
}
