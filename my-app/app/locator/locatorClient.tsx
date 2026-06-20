"use client";

import AddressAutocomplete from "@/components/PlaceAutocomplete";

export default function LocatorClient() {
  return (
    <div style={{ padding: 40 }}>
      <h1>Address Finder</h1>

      <AddressAutocomplete
        onSelect={(address, place) => {
          console.log("ADDRESS:", address);
          console.log("LAT:", place.geometry?.location?.lat());
          console.log("LNG:", place.geometry?.location?.lng());
        }}
      />
    </div>
  );
}