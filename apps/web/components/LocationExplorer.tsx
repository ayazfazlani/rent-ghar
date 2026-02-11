'use client';

import { useState, useEffect, useMemo } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  MapPin,
  Home,
  Building2,
  ChevronDown,
  ChevronUp,
  SortAsc,
  SortDesc,
  Loader2,
  CalendarDays,
  Search,
  Bookmark
} from 'lucide-react';
import { propertyApi } from '@/lib/api';
import { cn } from '@/lib/utils';

interface LocationExplorerProps {
  city: string;
  purpose: 'rent' | 'buy' | 'all';
  currentAreaId?: string;
  onAreaSelect: (areaId: string) => void;
  onTypeSelect: (type: string) => void;
}

interface LocationStat {
  name: string;
  id: string;
  count: number;
}

interface StatsData {
  locations: LocationStat[];
  summary: Record<string, number>;
  listingTypes: Record<string, number>;
  total: number;
}

export default function LocationExplorer({
  city,
  purpose,
  currentAreaId,
  onAreaSelect,
  onTypeSelect
}: LocationExplorerProps) {
  const [stats, setStats] = useState<StatsData | null>(null);
  const [loading, setLoading] = useState(false);
  const [sortBy, setSortBy] = useState<'count' | 'name'>('count');
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    if (city) {
      fetchStats();
    }
  }, [city, purpose]);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const listingType = purpose === 'buy' ? 'sale' : (purpose === 'rent' ? 'rent' : undefined);
      const data = await propertyApi.getLocationStats(city, listingType);
      setStats(data);
    } catch (error) {
      console.error('Error fetching explorer stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const sortedLocations = useMemo(() => {
    if (!stats?.locations) return [];
    return [...stats.locations].sort((a, b) => {
      if (sortBy === 'count') return b.count - a.count;
      return a.name.localeCompare(b.name);
    });
  }, [stats, sortBy]);

  const displayedLocations = isExpanded ? sortedLocations : sortedLocations.slice(0, 15);

  if (!city) return null;

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-top-4 duration-500">
      {/* Header / Summary Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b pb-6">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
            {stats?.total.toLocaleString() || 0} Properties for {purpose === 'buy' ? 'Sale' : 'Rent'} in {city}
          </h2>
          <div className="flex flex-wrap gap-2 items-center text-sm text-muted-foreground">
            <Button variant="outline" size="sm" className="h-8 gap-2 rounded-full border-primary/20 hover:bg-primary/5">
              <Bookmark className="w-3.5 h-3.5" />
              Save Search
            </Button>
            <span className="hidden md:inline mx-2 text-muted-foreground/30">|</span>
            <div className="flex gap-4">
              <button
                onClick={() => onTypeSelect('all')}
                className="hover:text-primary transition-colors flex items-center gap-1.5"
              >
                <span className="font-medium text-foreground">All Homes</span>
                <span className="text-muted-foreground">({stats?.total || 0})</span>
              </button>
              {Object.entries(stats?.summary || {}).map(([type, count]) => (
                <button
                  key={type}
                  onClick={() => onTypeSelect(type)}
                  className="hover:text-primary transition-colors flex items-center gap-1.5"
                >
                  <span className="font-medium text-foreground">{type}s</span>
                  <span className="text-muted-foreground">({count})</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {purpose === 'buy' ? (
          <Button variant="link" className="text-primary p-0 h-auto font-medium">
            {city} Homes for Rent
          </Button>
        ) : (
          <Button variant="link" className="text-primary p-0 h-auto font-medium">
            {city} Homes for Sale
          </Button>
        )}
      </div>

      {/* Locations Section */}
      <Card className="p-6 border-none bg-secondary/30 shadow-none">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <MapPin className="w-5 h-5 text-primary" />
            Locations of Homes for {purpose === 'buy' ? 'Sale' : 'Rent'} in {city}
          </h3>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              className={cn("h-8 text-xs gap-1.5", sortBy === 'name' ? "bg-background shadow-sm" : "text-muted-foreground")}
              onClick={() => setSortBy('name')}
            >
              <SortAsc className="w-3.5 h-3.5" />
              Sort Alphabetically
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className={cn("h-8 text-xs gap-1.5", sortBy === 'count' ? "bg-background shadow-sm" : "text-muted-foreground")}
              onClick={() => setSortBy('count')}
            >
              <SortDesc className="w-3.5 h-3.5" />
              Sort by Count
            </Button>
          </div>
        </div>

        {loading ? (
          <div className="py-12 flex justify-center">
            <Loader2 className="w-8 h-8 animate-spin text-primary/50" />
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-y-3 gap-x-6">
            {displayedLocations.map((loc) => (
              <button
                key={loc.id}
                onClick={() => onAreaSelect(loc.id)}
                className={cn(
                  "text-sm text-left hover:text-primary transition-colors group flex items-baseline justify-between py-1",
                  currentAreaId === loc.id ? "text-primary font-semibold" : "text-foreground/80"
                )}
              >
                <span className="truncate pr-2 group-hover:underline">{loc.name}</span>
                <span className="text-[11px] text-muted-foreground font-normal bg-muted px-1.5 rounded-md min-w-[2.5rem] text-center">
                  {loc.count}
                </span>
              </button>
            ))}
          </div>
        )}

        {sortedLocations.length > 15 && (
          <div className="mt-8 pt-6 border-t flex justify-center">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
              className="rounded-full gap-2 px-6 h-10 border-primary/20 text-primary hover:bg-primary/5"
            >
              {isExpanded ? (
                <>Show Less <ChevronUp className="w-4 h-4" /></>
              ) : (
                <>Show All {sortedLocations.length} Locations <ChevronDown className="w-4 h-4" /></>
              )}
            </Button>
          </div>
        )}
      </Card>
    </div>
  );
}
