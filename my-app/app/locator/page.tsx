'use client';

import AddressAutocomplete, { SelectedAddress } from '@/components/AddressAutoComplete';
import { useState } from 'react';


export default function LocatorPage() {
  const [selected, setSelected] = useState<SelectedAddress | null>(null);

  return (
    <main style={{ maxWidth: 480, margin: '0 auto', padding: 24 }}>
      <h1 style={{ fontSize: 20, fontWeight: 600, marginBottom: 16 }}>Find a location</h1>

      <AddressAutocomplete
        onSelect={setSelected}
        placeholder="Search for an address..."
        // countryRestrictions={['au']} // uncomment to limit to Australia
      />

      {selected && (
        <div
          style={{
            marginTop: 16,
            padding: 16,
            border: '1px solid #e2e2e2',
            borderRadius: 8,
            fontSize: 14,
          }}
        >
          <p style={{ fontWeight: 500, margin: 0 }}>{selected.address}</p>
          <p style={{ color: '#666', margin: '4px 0 0' }}>
            {selected.lat.toFixed(6)}, {selected.lng.toFixed(6)}
          </p>
        </div>
      )}
    </main>
  );
}