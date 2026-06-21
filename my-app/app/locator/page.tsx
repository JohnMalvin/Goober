'use client';

import AddressAutocomplete, { SelectedAddress } from '@/components/AddressAutoComplete';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LocatorPage() {
  const [selected, setSelected] = useState<SelectedAddress | null>(null);
  const router = useRouter();

  // ✅ ADDED ONLY THIS
  const handleConfirm = () => {
    if (!selected) return;

    localStorage.setItem(
      'dropoff_location',
      JSON.stringify({
        address: selected.address,
        lat: selected.lat,
        lng: selected.lng,
      })
    );

    localStorage.setItem('address', 
      JSON.stringify({
        mine: {
          lat: selected.lat,
          lng: selected.lng,
          address: selected.address,
        },
        driver: null
      }
    ));

    router.push('/order');
  };

  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center px-4">

      <div className="w-full max-w-md">

        {/* HEADER */}
        <div className="mb-6 text-center">
          <div className="text-xs tracking-[0.3em] uppercase text-gray-400 font-bold mb-2">
            Delivery Setup
          </div>

          <h1 className="text-3xl font-black text-gray-900 leading-tight">
            Where should we
            <span className="text-green-500"> drop it off?</span>
          </h1>

          <p className="text-xs text-gray-500 mt-2">
            Enter your delivery address and we’ll handle the rest.
          </p>
        </div>

        {/* CARD */}
        <div className="bg-white border border-gray-200 rounded-3xl p-6 shadow-lg relative overflow-hidden">

          {/* subtle glow accents */}
          <div className="absolute -top-20 -left-20 w-40 h-40 bg-green-100 blur-3xl rounded-full" />
          <div className="absolute -bottom-20 -right-20 w-40 h-40 bg-blue-100 blur-3xl rounded-full" />

          {/* selected */}
          <main style={{ maxWidth: 480, margin: '0 auto', padding: 24 }}>

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
      
              </div>
            )}
          </main>

          {/* CTA */}
          <div className="mt-6 flex gap-3">


            <button
              onClick={handleConfirm}   // ✅ ONLY CHANGE HERE
              disabled={!selected}
              className={`flex-1 py-3 rounded-2xl font-black text-sm transition
                ${selected
                  ? 'bg-black text-white hover:bg-green-500'
                  : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                }
              `}
            >
              Confirm Drop-off
            </button>
          </div>
        </div>

        {/* footer */}
        <p className="text-center text-xs text-gray-400 mt-6">
          Fast routing • Live driver matching • Instant delivery updates
        </p>

      </div>
    </main>
  );
}