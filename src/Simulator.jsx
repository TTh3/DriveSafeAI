import React, { useEffect, useRef, useState, useCallback } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { House } from "lucide-react";

import HUD from "./components/HUD.jsx";
import Controls from "./components/Controls.jsx";
import ProgressBar from "./components/ProgressBar.jsx";
import Toast from "./components/Toast.jsx";
import RouteSetupPanel from "./components/RouteSetupPanel.jsx";
import DrivingFeedbackPanel from "./components/edu/DrivingFeedbackPanel.jsx";
import RouteKnowledgePanel from "./components/RouteKnowledgePanel.jsx";

import { initMap, fetchRoute, drawLegs } from "./lib/mapUtils.js";
import { buildTimeline } from "./lib/timeline.js";
import { createCarOverlay } from "./lib/carOverlay.js";
import { startSim, fmtDur } from "./lib/simulation.js";
import { getDrivingFeedback } from "./lib/avInference.js";

// card styles as inline className helper
const cardClass =
  "bg-[rgba(6,6,20,0.88)] backdrop-blur-md border border-white/10 rounded-xl px-4 py-3 text-white text-[13px] pointer-events-auto";



export default function Simulator() {
  const location = useLocation();
  const navigate = useNavigate();
  const mapDivRef   = useRef(null);
  const eduCanvasRef = useRef(null);
  const mapRef      = useRef(null);
  const overlayRef  = useRef(null);
  const cancelSimRef = useRef(null);
  const routeDataRef = useRef(null);

  // ── Core sim state ──
  const [legs, setLegs]         = useState(null);
  const [btnLabel, setBtnLabel] = useState("Loading…");
  const [btnDisabled, setBtnDisabled] = useState(true);
  const [live, setLive]         = useState(null);
  const [progress, setProgress] = useState(null);
  const [toastMsg, setToastMsg] = useState(null);
  const [setupKey, setSetupKey] = useState(0);
  
  // ── Setup State ──
  const [setupComplete, setSetupComplete] = useState(false);
  const [activeCountry, setActiveCountry] = useState(null);

  const [feedback, setFeedback]       = useState(null);
  const [isPaused, setIsPaused]       = useState(false);
  const [multiplier, setMultiplier]   = useState(1);

  // We need refs for dynamic getters in the simulation loop
  const isPausedRef = useRef(false);
  const multiplierRef = useRef(1);

  useEffect(() => {
    isPausedRef.current = isPaused;
  }, [isPaused]);

  useEffect(() => {
    multiplierRef.current = multiplier;
  }, [multiplier]);

  const toast = useCallback((msg) => setToastMsg(msg), []);


  // ── Map + route init ──
  useEffect(() => {
    if (!window.google) {
      toast("Google Maps failed to load.");
      return;
    }

    if (!mapRef.current && mapDivRef.current) {
        const map = initMap(mapDivRef.current);
        mapRef.current = map;
    }
  }, [toast]);

  const handleGenerateRoute = useCallback((originData, destData, countryObj) => {
    if (!mapRef.current) return;
    
    cancelSimRef.current?.();
    setLive(null);
    setLegs(null);
    setActiveCountry(countryObj);
    setBtnLabel("Calculating Route…");

    fetchRoute(
      mapRef.current,
      originData.placeId ? { placeId: originData.placeId } : originData.query,
      destData.placeId ? { placeId: destData.placeId } : destData.query,
      countryObj.code,
      (route, totalDist) => {
        drawLegs(mapRef.current, route);
        routeDataRef.current = buildTimeline(route, totalDist);
        overlayRef.current   = createCarOverlay(mapRef.current);
        setLegs(route.legs);
        
        // --- Save to Route History ---
        try {
          // Fallback to coordinates if address is somehow missing
          const leg = route.legs[0];
          const originName = leg.start_address || originData.query || "Unknown Origin";
          const destName = route.legs[route.legs.length - 1].end_address || destData.query || "Unknown Destination";
          
          const newHistoryItem = {
            id: Date.now().toString(),
            originQuery: originName,
            destQuery: destName,
            country: countryObj.code,
            timestamp: new Date().toISOString()
          };
          
          const existingHistory = JSON.parse(localStorage.getItem('routeHistory') || '[]');
          
          // Remove exact duplicates before pushing to front
          const deduplicated = existingHistory.filter(item => 
            !(item.originQuery === newHistoryItem.originQuery && item.destQuery === newHistoryItem.destQuery)
          );
          
          deduplicated.unshift(newHistoryItem);
          
          // Keep only the 5 most recent
          localStorage.setItem('routeHistory', JSON.stringify(deduplicated.slice(0, 5)));
        } catch (e) {
          console.error("Failed to save route history", e);
        }
        
        setBtnLabel("▶ Start Simulation");
        setBtnDisabled(false);
        setSetupComplete(true);
      },
      (status) => {
        toast("Directions error: " + status, 8000);
        setBtnLabel("Error — check console");
        console.error("Directions failed:", status);
      }
    );
  }, [toast]);

  // Auto-start sample routes if coming from Home Page Quick Start
  useEffect(() => {
    const state = location.state;
    if (state && state.sample && !setupComplete && mapRef.current) {
      // Small timeout to ensure the state isn't double-called on strict mode
      setTimeout(() => {
          handleGenerateRoute(
              { query: state.originQuery },
              { query: state.destQuery },
              { code: state.country }
          );
      }, 100);
      // Clear location state to prevent reload loops
      window.history.replaceState({}, document.title)
    }
  }, [location.state, setupComplete, handleGenerateRoute]);

  // ── Start / restart simulation ──
  const handleStart = useCallback(() => {
      if (!routeDataRef.current) { toast("Route not loaded yet"); return; }
      if (!overlayRef.current)   { toast("Overlay not ready");    return; }

      cancelSimRef.current?.();
      setBtnLabel("Simulating…");
      setBtnDisabled(true);
      setLive({});
      setProgress(0);
      setIsPaused(false);

      cancelSimRef.current = startSim({
        routeData: routeDataRef.current,
        overlayRef: overlayRef.current,
        map: mapRef.current,
        getMultiplier: () => multiplierRef.current,
        getPaused: () => isPausedRef.current,
        onFrame: (stats) => {
          setLive(stats);
          setProgress(stats.progress);
          // Map the current active step to an educational safety tip
          if (stats.instruction) {
            setFeedback(getDrivingFeedback(stats.instruction, activeCountry?.code || 'US'));
          } else {
            setFeedback(null);
          }
        },
        onDone: () => {
          setBtnLabel("✓ Arrived!");
          
          // Toast a welcome message with the destination address
          if (routeDataRef.current && routeDataRef.current.legs) {
            const finalLeg = routeDataRef.current.legs[routeDataRef.current.legs.length - 1];
            if (finalLeg && finalLeg.end_address) {
              // Extract just the core title name if possible, or use the whole address.
              const destName = finalLeg.end_address.split(',')[0];
              toast("Welcome to " + destName + "!");
            }
          }

          setTimeout(() => {
            setBtnLabel("▶ Restart");
            setBtnDisabled(false);
          }, 2500);
        },
      });
    },
    [toast, activeCountry],
  );

  const handleReset = useCallback(() => {
    cancelSimRef.current?.();
    setLive(null);
    setLegs(null);
    setFeedback(null);
    setBtnLabel("Loading…");
    setBtnDisabled(true);
    setSetupComplete(false);
    setActiveCountry(null);
    
    if (overlayRef.current && overlayRef.current.overlay) {
      overlayRef.current.overlay.setMap(null);
      overlayRef.current = null;
    }
    routeDataRef.current = null;
    
    // Crucial: Wipe the react-router location state so we don't infinitely auto-start
    // the sample routes again the moment `setupComplete` becomes false!
    if (location.state && location.state.sample) {
      navigate(".", { replace: true, state: {} });
    } else if (window.history.state && window.history.state.usr && window.history.state.usr.sample) {
      window.history.replaceState({}, document.title);
    }
    
    // Increment setupKey to forcefully unmount and wipe the `<RouteSetupPanel>` inputs empty
    setSetupKey(prev => prev + 1);
  }, [location.state, navigate]);


  return (
    <div className="relative w-screen h-screen overflow-hidden">
      {/* Full-screen map */}
      <div ref={mapDivRef} id="map" className="absolute inset-0" />


      {/* Back to Home */}
      <Link
        className="border absolute top-20 left-3 z-30 border-white/20 bg-[rgba(6,6,20)] text-white hover:bg-[rgba(6,6,20,0.8)] inline-flex items-center gap-1.5 whitespace-nowrap rounded-lg text-sm font-medium transition-colors duration-200 px-3 py-2"
        to="/"
      >
        <House size={15} /> Home
      </Link>
      {/* Origin/Destination Selection Modal */}
      {!setupComplete && (
        <RouteSetupPanel key={setupKey} onGenerateRoute={handleGenerateRoute} />
      )}

      {setupComplete && (
        <>
          <DrivingFeedbackPanel feedback={feedback} country={activeCountry} />
          <RouteKnowledgePanel legs={legs} />
          
          {/* ── Core HUD ── */}
          <HUD
            legs={legs}
            live={live}
            fmtDur={fmtDur}
            cardClass={cardClass}
            simActive={!!live}
            isPaused={isPaused}
            onTogglePause={() => setIsPaused(!isPaused)}
          />

          {/* Controls */}
          <Controls
            btnLabel={btnLabel}
            btnDisabled={btnDisabled}
            simActive={!!live}
            multiplier={multiplier}
            onStart={handleStart}
            onSetMultiplier={setMultiplier}
            onReset={handleReset}
          />

          {/* Progress bar */}
          <ProgressBar progress={progress} />
        </>
      )}

      {/* Toast */}
      <Toast message={toastMsg} />
    </div>
  );
}
