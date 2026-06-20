"use client";

import { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import markerGuess from "../../public/file.svg";
import markerActual from "../../public/globe.svg";

const guessIcon = L.icon({
  iconUrl: markerGuess.src,
  iconSize: [40, 40],
  iconAnchor: [20, 40],
});

const actualIcon = L.icon({
  iconUrl: markerActual.src,
  iconSize: [40, 40],
  iconAnchor: [20, 40],
});

const LOCATIONS = [
  { lat: 51.5074, lng: -0.1278 }, // London
  { lat: 53.4808, lng: -2.2426 }, // Manchester
  { lat: 55.8642, lng: -4.2518 }, // Glasgow
  { lat: 52.4862, lng: -1.8904 }, // Birmingham
  { lat: 55.9533, lng: -3.1883 }, // Edinburgh
];

const START_LOCATION =
  LOCATIONS[Math.floor(Math.random() * LOCATIONS.length)];

declare global {
  interface Window {
    initGeoGuessr: () => void;
    google: typeof google;
  }
}

export default function GeoGuessrLite() {
  const streetViewRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<HTMLDivElement>(null);

  const mapInstance = useRef<L.Map | null>(null);
  const guessMarker = useRef<L.Marker | null>(null);
  const actualMarker = useRef<L.Marker | null>(null);

  const panoramaRef = useRef<google.maps.StreetViewPanorama | null>(null);
  const svServiceRef = useRef<google.maps.StreetViewService | null>(null);

  const [result, setResult] = useState<{
    distance: number;
    guessLat: number;
    guessLng: number;
  } | null>(null);

  function calculateDistance(
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ) {
    const R = 6371;

    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;

    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) ** 2;

    return R * (2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)));
  }

  const getValidStreetView = (
    location: { lat: number; lng: number },
    callback: (pos: google.maps.LatLng) => void
  ) => {
    if (!svServiceRef.current) return;

    svServiceRef.current.getPanorama(
      {
        location,
        radius: 5000,
        source: google.maps.StreetViewSource.OUTDOOR,
      },
      (data, status) => {
        if (status === "OK" && data?.location?.latLng) {
          callback(data.location.latLng);
        } else {
          const retry = {
            lat: location.lat + (Math.random() - 0.5) * 0.1,
            lng: location.lng + (Math.random() - 0.5) * 0.1,
          };

          getValidStreetView(retry, callback);
        }
      }
    );
  };

    const handleConfirm = () => {
    if (!mapInstance.current || !guessMarker.current) return;

    const guess = guessMarker.current.getLatLng();

    if (!actualMarker.current) {
        actualMarker.current = L.marker(
        [START_LOCATION.lat, START_LOCATION.lng],
        { icon: actualIcon }
        ).addTo(mapInstance.current);
    }

    const distance = calculateDistance(
        guess.lat,
        guess.lng,
        START_LOCATION.lat,
        START_LOCATION.lng
    );

    mapInstance.current.setView(
        [START_LOCATION.lat, START_LOCATION.lng],
        6
    );

    // 👇 delay popup
    setTimeout(() => {
        setResult({
        distance,
        guessLat: guess.lat,
        guessLng: guess.lng,
        });
    }, 2000); // change time here (ms)
    };

  useEffect(() => {
    const init = () => {
      if (!streetViewRef.current || !mapRef.current) return;

      svServiceRef.current = new google.maps.StreetViewService();

      panoramaRef.current =
        new google.maps.StreetViewPanorama(
          streetViewRef.current,
          {
            position: START_LOCATION,
            pov: {
              heading: Math.random() * 360,
              pitch: 0,
            },
            zoom: 1,
            disableDefaultUI: true,
          }
        );

      getValidStreetView(START_LOCATION, (pos) => {
        panoramaRef.current?.setPosition(pos);
      });

      mapInstance.current = L.map(mapRef.current).setView(
        [54.5, -3],
        5
      );

      L.tileLayer(
        "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
        {
          attribution: "© OpenStreetMap",
        }
      ).addTo(mapInstance.current);

      mapInstance.current.on("click", (e: L.LeafletMouseEvent) => {
        if (guessMarker.current) {
          mapInstance.current?.removeLayer(guessMarker.current);
        }

        guessMarker.current = L.marker(
          [e.latlng.lat, e.latlng.lng],
          { icon: guessIcon }
        ).addTo(mapInstance.current!);
      });
    };

    if (window.google?.maps) {
      init();
      return;
    }

    window.initGeoGuessr = init;

    const script = document.createElement("script");

    script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&callback=initGeoGuessr`;

    script.async = true;
    script.defer = true;

    document.head.appendChild(script);

    return () => {
      mapInstance.current?.remove();
    };
  }, []);

  return (
    <>
      <div className="flex flex-col lg:flex-row h-screen overflow-hidden bg-white">

        <div
          ref={streetViewRef}
          className="flex-1 min-h-[55vh] lg:min-h-0"
        />

        <div
          ref={mapRef}
          className="
            w-full
            h-[45vh]
            lg:h-full
            lg:w-[420px]
            border-t
            lg:border-t-0
            lg:border-l
            border-gray-200
          "
        />

        <button
          onClick={handleConfirm}
          className="
            fixed
            bottom-6
            left-1/2
            -translate-x-1/2
            z-[1000]
            px-8
            py-4
            rounded-2xl
            bg-green-500
            hover:bg-green-600
            active:scale-95
            transition
            text-white
            font-black
            shadow-xl
          "
        >
          Confirm Guess
        </button>
      </div>

      {result && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[2000]">
          <div className="bg-white rounded-3xl p-8 max-w-sm w-full mx-4 shadow-2xl">

            <div className="text-center">
              <div className="text-5xl mb-4">🎯</div>

              <h2 className="text-3xl font-black text-gray-900">
                Guess Complete
              </h2>

              <p className="mt-2 text-gray-500">
                Here's how you did.
              </p>

              <div className="mt-6 bg-gray-50 rounded-2xl p-5">
                <p className="text-xs uppercase tracking-wider text-gray-400">
                  Distance Away
                </p>

                <p className="text-5xl font-black text-green-600 mt-2">
                  {result.distance.toFixed(1)} km
                </p>
              </div>

              <div className="mt-5 text-sm text-gray-600">
                <p className="font-semibold mb-1">Your Guess</p>
                <p className="font-mono">
                  {result.guessLat.toFixed(4)}, {result.guessLng.toFixed(4)}
                </p>
              </div>

              <button
                onClick={() => setResult(null)}
                className="
                  mt-6
                  w-full
                  py-3
                  rounded-2xl
                  bg-green-500
                  hover:bg-green-600
                  text-white
                  font-black
                  transition
                "
              >
                Close
              </button>
            </div>

          </div>
        </div>
      )}
    </>
  );
}