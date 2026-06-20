'use client';

import { useEffect, useRef, useState } from 'react';
import Script from 'next/script';

export type SelectedAddress = {
  address: string;
  lat: number;
  lng: number;
};

type Props = {
  onSelect: (place: SelectedAddress) => void;
  placeholder?: string;
  /** Restrict results to specific country codes, e.g. ['au'] */
  countryRestrictions?: string[];
};

// Minimal ambient typing so TS doesn't complain about the google global.
// Remove this if your project already has @types/google.maps configured
// with the new Places (New) PlaceAutocompleteElement types.


export default function AddressAutocomplete({
  onSelect,
  placeholder = 'Enter an address',
  countryRestrictions,
}: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const elementRef = useRef<any>(null);
  const [scriptLoaded, setScriptLoaded] = useState(false);

  useEffect(() => {
    // If the Maps script was already loaded elsewhere (e.g. another
    // instance of this component on the page), pick that up too.
    if (typeof window !== 'undefined' && window.google?.maps && !scriptLoaded) {
      setScriptLoaded(true);
    }
  }, [scriptLoaded]);

  useEffect(() => {
    if (!scriptLoaded || !containerRef.current || elementRef.current) return;

    let cancelled = false;

    (async () => {
      const { PlaceAutocompleteElement } = await window.google.maps.importLibrary('places');
      if (cancelled || !containerRef.current) return;

      const autocomplete = new PlaceAutocompleteElement(
        countryRestrictions ? { includedRegionCodes: countryRestrictions } : {}
      );
      autocomplete.placeholder = placeholder;
      containerRef.current.appendChild(autocomplete);
      elementRef.current = autocomplete;

      autocomplete.addEventListener('gmp-select', async (event: any) => {
        const place = event.placePrediction.toPlace();
        await place.fetchFields({ fields: ['formattedAddress', 'location'] });

        onSelect({
          address: place.formattedAddress ?? '',
          lat: place.location?.lat() ?? 0,
          lng: place.location?.lng() ?? 0,
        });
      });
    })();

    return () => {
      cancelled = true;
    };
  }, [scriptLoaded, placeholder, countryRestrictions, onSelect]);

  return (
    <>
      <Script
        src={`https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=places&v=weekly`}
        strategy="afterInteractive"
        onLoad={() => setScriptLoaded(true)}
      />
      <div ref={containerRef} style={{ width: '100%' }} />
    </>
  );
}