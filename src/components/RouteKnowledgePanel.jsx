import React, { useMemo } from 'react';
import { ShieldAlert, Info, Clock, Route } from 'lucide-react';
import { fmtDur } from '../lib/simulation.js';

/**
 * RouteKnowledgePanel analyzes the active Google Maps route and displays
 * insights regarding hazards, estimated base times, distances, etc.
 * 
 * Props:
 *   legs: Array of google.maps.DirectionsLeg
 */
export default function RouteKnowledgePanel({ legs }) {
  const analysis = useMemo(() => {
    if (!legs || legs.length === 0) return null;

    let totalWarnings = 0;
    let hasTolls = false;
    let hasHighways = false;
    let totalDistVal = 0;
    let totalDurVal = 0;

    legs.forEach(leg => {
      totalDistVal += leg.distance.value;
      totalDurVal += leg.duration.value;
      
      leg.steps.forEach(step => {
        const text = step.instructions.toLowerCase();
        if (text.includes('toll')) hasTolls = true;
        if (text.includes('highway') || text.includes('motorway')) hasHighways = true;
        if (text.includes('roundabout') || text.includes('merge')) totalWarnings++;
      });
    });

    return {
      totalWarnings,
      hasTolls,
      hasHighways,
      distStr: (totalDistVal / 1000).toFixed(1) + ' km',
      durStr: fmtDur(totalDurVal)
    };
  }, [legs]);

  if (!analysis) return null;

  return (
    <div className="absolute right-3.5 bottom-7 z-20 pointer-events-none" style={{ width: 260 }}>
      {/* Route Knowledge Card */}
      <div className="bg-[rgba(6,6,20,0.85)] backdrop-blur-md border border-[#ce93d8]/30 rounded-xl px-4 py-3 shadow-[0_0_15px_rgba(206,147,216,0.1)] pointer-events-auto">
        <h4 className="text-[#ce93d8] text-[11px] uppercase tracking-widest font-bold mb-3 flex items-center gap-1.5">
          <Info size={14} /> Route Knowledge
        </h4>

        <div className="grid grid-cols-2 gap-y-2 mb-3">
          <div>
            <div className="text-[#78909c] text-[10px] uppercase mb-[2px] flex items-center gap-1">
              <Route size={10} /> Base Dist
            </div>
            <div className="text-[#a5d6a7] text-[13px] font-semibold">{analysis.distStr}</div>
          </div>
          <div>
            <div className="text-[#78909c] text-[10px] uppercase mb-[2px] flex items-center gap-1">
              <Clock size={10} /> Base ETA
            </div>
            <div className="text-[#ffe082] text-[13px] font-semibold">{analysis.durStr}</div>
          </div>
        </div>

        <div className="border-t border-white/10 pt-2.5">
          <div className="text-[#78909c] text-[10px] uppercase mb-1.5 tracking-wider">Features & Hazards</div>
          <div className="flex flex-col gap-1.5">
            {analysis.hasHighways && (
              <div className="text-[11px] text-[#90caf9] bg-[#90caf9]/10 px-2 py-1 rounded inline-block w-fit">
                🛣️ Highway / High-Speed Route
              </div>
            )}
            {analysis.hasTolls && (
              <div className="text-[11px] text-[#ef5350] bg-[#ef5350]/10 px-2 py-1 rounded w-fit flex items-center gap-1">
                💳 Toll Roads Present
              </div>
            )}
            <div className="text-[11px] text-[#ffb74d] bg-[#ffb74d]/10 px-2 py-1 rounded w-fit flex items-center gap-1">
              <ShieldAlert size={12} /> {analysis.totalWarnings} Complex Maneuvers
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
