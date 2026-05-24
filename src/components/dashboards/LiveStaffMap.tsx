import { useEffect, useState, useRef } from "react";
import { useAuth } from "@/lib/auth";
import { apiRequest } from "@/lib/api";
import { MapPinned, Navigation, RefreshCw, UserCheck, Clock } from "lucide-react";

export type LiveLocation = {
  id: number;
  latitude: number;
  longitude: number;
  updated_at: string;
  user: {
    id: number;
    name: string;
    email: string;
    role: string;
  };
};

type LiveStaffMapProps = {
  /** Auto-refresh interval in ms; default 30 000 (30 s) */
  pollIntervalMs?: number;
};

export const LiveStaffMap = ({ pollIntervalMs = 30_000 }: LiveStaffMapProps) => {
  const { token } = useAuth();
  const [locations, setLocations] = useState<LiveLocation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const polling = useRef(false);

  const fetchLocations = async () => {
    if (!token) return;
    try {
      const data = await apiRequest<LiveLocation[]>("/api/operations/live-locations", { token });
      setLocations(data || []);
      setError(null);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to load live locations";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  // Initial load
  useEffect(() => {
    polling.current = false; // reset on mount
    void fetchLocations();
  }, [token]);

  // Polling
  useEffect(() => {
    if (polling.current) return;
    polling.current = true;

    const interval = setInterval(() => {
      void fetchLocations();
    }, pollIntervalMs);

    return () => {
      polling.current = false;
      clearInterval(interval);
    };
  }, [pollIntervalMs, token]);

  const formatTime = (iso: string) => {
    try {
      const d = new Date(iso);
      return d.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });
    } catch {
      return "-";
    }
  };

  const handleRefresh = () => {
    setLoading(true);
    void fetchLocations();
  };

  if (loading && locations.length === 0) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-slate-300 border-t-blue-600" />
          <p className="text-sm text-slate-400">Loading live staff locations…</p>
        </div>
      </div>
    );
  }

  if (error && locations.length === 0) {
    return (
      <div className="rounded-2xl border border-red-100 bg-red-50 p-6 text-center">
        <p className="text-sm font-medium text-red-700">{error}</p>
        <button
          onClick={handleRefresh}
          className="mt-3 inline-flex items-center gap-1.5 rounded-lg border border-red-200 bg-white px-4 py-2 text-xs font-semibold text-red-600 transition hover:bg-red-50"
        >
          <RefreshCw className="h-3.5 w-3.5" />
          Retry
        </button>
      </div>
    );
  }

  if (locations.length === 0) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-6 text-center">
        <MapPinned className="mx-auto h-8 w-8 text-slate-300 mb-2" />
        <p className="text-sm font-medium text-slate-500">No staff currently checked in with live location</p>
        <p className="mt-1 text-xs text-slate-400">
          Locations appear here when staff mark attendance and remain checked in.
        </p>
        <button
          onClick={handleRefresh}
          className="mt-4 inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-600 transition hover:bg-slate-50"
        >
          <RefreshCw className="h-3.5 w-3.5" />
          Refresh now
        </button>
      </div>
    );
  }

  // Build a static OpenStreetMap embed URL centred on the average position
  const validLocations = locations.filter(l => l.latitude != null && l.longitude != null && !isNaN(Number(l.latitude)) && !isNaN(Number(l.longitude)));
  const avgLat = validLocations.length
    ? validLocations.reduce((s, l) => s + Number(l.latitude), 0) / validLocations.length
    : 0;
  const avgLng = validLocations.length
    ? validLocations.reduce((s, l) => s + Number(l.longitude), 0) / validLocations.length
    : 0;
  
  const mapQuery = validLocations
    .map((l) => `${Number(l.latitude).toFixed(6)},${Number(l.longitude).toFixed(6)}`)
    .join(";");
  const mapSrc = `https://www.openstreetmap.org/export/embed.html?bbox=${(avgLng - 0.02).toFixed(6)},${(avgLat - 0.02).toFixed(6)},${(avgLng + 0.02).toFixed(6)},${(avgLat + 0.02).toFixed(6)}&layer=mapnik&marker=${mapQuery.split(";").join("&marker=")}`;

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50">
            <MapPinned className="h-4 w-4 text-blue-600" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-800">
              Live Staff Locations
            </h4>
            <p className="text-xs text-slate-400">
              {locations.length} staff member{locations.length !== 1 ? "s" : ""} checked in now
            </p>
          </div>
        </div>
        <button
          onClick={handleRefresh}
          disabled={loading}
          className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-600 transition hover:bg-slate-50 disabled:opacity-50"
        >
          <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />
          Refresh
        </button>
      </div>

      {/* Map embed */}
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-slate-50 shadow-sm">
        <iframe
          title="Live Staff Map"
          src={mapSrc}
          width="100%"
          height="320"
          style={{ border: 0 }}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          className="block"
        />
      </div>

      {/* Staff list */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {locations.map((loc) => (
          <div
            key={loc.id}
            className="flex items-start gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition hover:border-blue-200 hover:shadow"
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald-50">
              <UserCheck className="h-5 w-5 text-emerald-600" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <p className="truncate text-sm font-bold text-slate-900">
                  {loc.user.name}
                </p>
                <span className="shrink-0 rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold uppercase text-emerald-700 border border-emerald-200">
                  Live
                </span>
              </div>
              <p className="truncate text-[10px] font-bold uppercase tracking-wider text-slate-400">
                {loc.user.role}
              </p>
              <div className="mt-2 flex items-center gap-3 text-[11px] text-slate-500">
                <span className="inline-flex items-center gap-1">
                  <Navigation className="h-3 w-3 text-blue-500" />
                  {Number(loc.latitude).toFixed(4)}, {Number(loc.longitude).toFixed(4)}
                </span>
                <span className="inline-flex items-center gap-1">
                  <Clock className="h-3 w-3 text-slate-400" />
                  {formatTime(loc.updated_at)}
                </span>
              </div>
              <a
                href={`https://www.google.com/maps?q=${Number(loc.latitude)},${Number(loc.longitude)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 inline-flex items-center gap-1 text-[11px] font-semibold text-blue-600 hover:text-blue-800 transition-colors"
              >
                <MapPinned className="h-3 w-3" />
                View on Google Maps
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};