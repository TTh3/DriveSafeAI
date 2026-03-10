import React, { useEffect, useRef, useState } from 'react';
import { Play, MapPin, Clock, Trash2 } from 'lucide-react';

export const COUNTRIES = [
  { code: 'AU', name: 'Australia', handbook: 'https://mylicence.sa.gov.au/my-car-licence/the-drivers-handbook' },
  { code: 'US', name: 'United States', handbook: 'https://www.dmv.ca.gov/portal/handbook/california-driver-handbook/' },
  { code: 'GB', name: 'United Kingdom', handbook: 'https://www.gov.uk/browse/driving/highway-code-and-safety' },
  { code: 'JP', name: 'Japan', handbook: 'https://english.jaf.or.jp/driving-in-japan/rules-of-the-road' },
  { code: 'DE', name: 'Germany', handbook: 'https://www.bmdv.bund.de/SharedDocs/EN/publications/road-traffic-regulations-stvo.html' }
];

export default function RouteSetupPanel({ onGenerateRoute }) {
  const [selectedCountry, setSelectedCountry] = useState(COUNTRIES[0].code);
  const [origin, setOrigin] = useState(null);
  const [destination, setDestination] = useState(null);
  const [history, setHistory] = useState([]);
  
  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem('routeHistory') || '[]');
      setHistory(stored);
    } catch (e) {
      console.error(e);
    }
  }, []);

  const handleHistoryClick = (item) => {
    const countryObj = COUNTRIES.find(c => c.code === item.country) || COUNTRIES[0];
    onGenerateRoute(
      { query: item.originQuery },
      { query: item.destQuery },
      countryObj
    );
  };

  const handleDeleteHistory = (e, id) => {
    e.stopPropagation();
    const updated = history.filter(item => item.id !== id);
    setHistory(updated);
    localStorage.setItem('routeHistory', JSON.stringify(updated));
  };
  
  const originInputRef = useRef(null);
  const destInputRef = useRef(null);
  const originAutocomplete = useRef(null);
  const destAutocomplete = useRef(null);

  // Initialize Autocomplete elements when Google Maps is ready
  useEffect(() => {
    if (!window.google || !originInputRef.current || !destInputRef.current) return;

    const options = {
      types: ['establishment', 'geocode'],
      componentRestrictions: { country: selectedCountry },
      fields: ['place_id', 'geometry', 'name', 'formatted_address']
    };

    if (!originAutocomplete.current) {
      originAutocomplete.current = new google.maps.places.Autocomplete(originInputRef.current, options);
      originAutocomplete.current.addListener('place_changed', () => {
        const place = originAutocomplete.current.getPlace();
        if (place.geometry) setOrigin(place);
      });
    } else {
      originAutocomplete.current.setComponentRestrictions({ country: selectedCountry });
    }

    if (!destAutocomplete.current) {
      destAutocomplete.current = new google.maps.places.Autocomplete(destInputRef.current, options);
      destAutocomplete.current.addListener('place_changed', () => {
        const place = destAutocomplete.current.getPlace();
        if (place.geometry) setDestination(place);
      });
    } else {
      destAutocomplete.current.setComponentRestrictions({ country: selectedCountry });
    }
    
    // Clear inputs when switching countries, since old places won't make sense
    setOrigin(null);
    setDestination(null);
    if(originInputRef.current) originInputRef.current.value = "";
    if(destInputRef.current) destInputRef.current.value = "";
    
  }, [selectedCountry]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!origin || !destination) return;
    
    const countryObj = COUNTRIES.find(c => c.code === selectedCountry);
    onGenerateRoute(
      { placeId: origin.place_id, location: origin.geometry.location },
      { placeId: destination.place_id, location: destination.geometry.location },
      countryObj
    );
  };

  return (
    <div className="absolute inset-0 z-40 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[rgba(10,10,25,0.95)] border border-[#64b5f6]/30 rounded-2xl shadow-[0_0_40px_rgba(100,181,246,0.15)] max-w-md w-full p-6 text-white">
        <div className="text-center mb-6">
          <div className="w-12 h-12 bg-[#64b5f6]/10 rounded-xl flex items-center justify-center mx-auto mb-3">
            <MapPin className="text-[#64b5f6] w-6 h-6" />
          </div>
          <h2 className="text-xl font-display font-bold text-foreground">Plan Your Route</h2>
          <p className="text-muted-foreground text-sm mt-1">Select a region and plot your autonomous journey.</p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          {/* Country Selection */}
          <div>
            <label className="block text-xs font-semibold text-[#90caf9] uppercase tracking-wider mb-1.5 ml-1">Region</label>
            <select 
              value={selectedCountry}
              onChange={(e) => setSelectedCountry(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-[#64b5f6]/50 transition-colors"
            >
              {COUNTRIES.map(c => (
                <option key={c.code} value={c.code} className="bg-[#1e1e2d] text-white">
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-4 relative">
            {/* Origin Input */}
            <div>
              <label className="block text-xs font-semibold text-[#a5d6a7] uppercase tracking-wider mb-1.5 ml-1">Starting Point</label>
              <input 
                ref={originInputRef}
                type="text"
                placeholder="Where to start?"
                className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-sm placeholder:text-white/30 focus:outline-none focus:border-[#a5d6a7]/50 transition-colors"
                required
              />
            </div>

            {/* Destination Input */}
            <div>
              <label className="block text-xs font-semibold text-[#ffb74d] uppercase tracking-wider mb-1.5 ml-1">Destination</label>
              <input 
                ref={destInputRef}
                type="text"
                placeholder="Where are we going?"
                className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-sm placeholder:text-white/30 focus:outline-none focus:border-[#ffb74d]/50 transition-colors"
                required
              />
            </div>
            
            {/* Connecting line visual */}
            <div className="absolute left-[-16px] top-6 bottom-6 w-[2px] bg-gradient-to-b from-[#a5d6a7] to-[#ffb74d] opacity-50 rounded-full hidden sm:block"></div>
          </div>

          <button 
            type="submit"
            disabled={!origin || !destination}
            className="mt-4 w-full bg-[#64b5f6] hover:bg-[#42a5f5] disabled:bg-white/10 disabled:text-white/40 text-[#0d1522] disabled:cursor-not-allowed font-bold py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors shadow-[0_0_20px_rgba(100,181,246,0.3)] disabled:shadow-none"
          >
            <Play size={18} fill="currentColor" className={!origin || !destination ? 'opacity-50' : ''} />
            Generate Route
          </button>
        </form>

        {history.length > 0 && (
          <div className="mt-7 pt-5 border-t border-white/10">
            <h3 className="text-xs font-semibold text-white/50 uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <Clock size={14} /> Recent Routes
            </h3>
            <div className="flex flex-col gap-2 max-h-[160px] overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent">
              {history.map(item => (
                <div key={item.id} className="relative group flex items-center">
                  <button
                    onClick={() => handleHistoryClick(item)}
                    className="w-full text-left bg-white/5 hover:bg-white/10 border border-white/5 hover:border-[#64b5f6]/30 rounded-lg p-3 pr-10 text-sm transition-colors flex items-center justify-between"
                  >
                    <div className="flex flex-col w-[85%]">
                      <span className="text-white/90 font-medium truncate text-[13px]">{item.originQuery}</span>
                      <span className="text-white/40 text-[11px] truncate uppercase tracking-wider mt-0.5">To {item.destQuery}</span>
                    </div>
                    <Play size={14} className="text-[#64b5f6] opacity-0 group-hover:opacity-100 transition-opacity" />
                  </button>
                  <button
                    type="button"
                    onClick={(e) => handleDeleteHistory(e, item.id)}
                    className="absolute right-2 p-2 text-white/30 hover:text-[#ef5350] hover:bg-[#ef5350]/10 rounded-md transition-all opacity-0 group-hover:opacity-100 z-10"
                    title="Delete Route"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
