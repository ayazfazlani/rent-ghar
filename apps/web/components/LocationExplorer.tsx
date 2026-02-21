'use client';

import { useState, useEffect, useMemo } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  MapPin,
  SortAsc,
  SortDesc,
  Loader2,
  Bookmark,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { propertyApi } from '@/lib/api';
import { cn, toTitleCase } from '@/lib/utils';

interface LocationExplorerProps {
  city: string;
  purpose: 'rent' | 'buy' | 'all';
  currentAreaId?: string;
  onAreaSelect: (areaId: string, slug?: string) => void;
  onTypeSelect: (type: string) => void;
  onPurposeChange?: (purpose: 'rent' | 'buy') => void;
  currentType?: string;
}

interface LocationStat {
  name: string;
  id: string;
  count: number;
  slug?: string;
}

interface StatsData {
  locations: LocationStat[];
  summary: Record<string, number>;
  total: number;
}

export default function LocationExplorer({
  city,
  purpose,
  currentAreaId,
  onAreaSelect,
  onTypeSelect,
  onPurposeChange,
  currentType = 'all'
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

  const displayedLocations = isExpanded ? sortedLocations : sortedLocations.slice(0, 16);

  if (!city) return null;

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-top-4 duration-500">
      {/* Header / Summary Section */}
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 border-b pb-6">
        <div className="flex-1 min-w-0">
          <h2 className="text-xl md:text-3xl font-bold text-foreground mb-4 leading-tight capitalize">
            {stats?.total.toLocaleString() || 0} Properties for {
              purpose === 'all' ? 'Rent & Sale' : (purpose === 'buy' ? 'Sale' : 'Rent')
            } in {city}
          </h2>

          <div className="flex flex-wrap gap-2 items-center">
            <button
              onClick={() => onTypeSelect('all')}
              className={cn(
                "px-4 py-1.5 rounded-full text-xs font-semibold transition-all border flex items-center gap-2",
                currentType === 'all'
                  ? "bg-primary border-primary text-primary-foreground shadow-sm"
                  : "bg-background border-input hover:border-primary/50 text-muted-foreground hover:text-foreground"
              )}
            >
              Total
              <span className={cn(
                "text-[10px] opacity-70",
                currentType === 'all' ? "text-primary-foreground" : "text-muted-foreground"
              )}>({stats?.total || 0})</span>
            </button>

            {Object.entries(stats?.summary || {}).map(([type, count]) => (
              <button
                key={type}
                onClick={() => onTypeSelect(type)}
                className={cn(
                  "px-4 py-1.5 rounded-full text-xs font-semibold transition-all border flex items-center gap-2 capitalize",
                  currentType.toLowerCase() === type.toLowerCase()
                    ? "bg-primary border-primary text-primary-foreground shadow-sm"
                    : "bg-background border-input hover:border-primary/50 text-muted-foreground hover:text-foreground"
                )}
              >
                {type === 'other' ? 'Other' : (type === 'commercial' ? 'Comm.' : type)}{count !== 1 ? 's' : ''}
                <span className={cn(
                  "text-[10px] opacity-70",
                  currentType.toLowerCase() === type.toLowerCase() ? "text-primary-foreground" : "text-muted-foreground"
                )}>({count})</span>
              </button>
            ))}
          </div>
        </div>

        <div className="mt-2 md:mt-2 flex items-center gap-3">
          <Button variant="outline" size="sm" className="h-9 gap-2 rounded-full border-input hover:bg-secondary shrink-0">
            <Bookmark className="w-4 h-4" />
            Save Search
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="text-primary h-9 font-semibold text-sm hover:bg-primary/5 px-4 rounded-full"
            onClick={() => {
              if (purpose === 'all') onPurposeChange?.('rent');
              else onPurposeChange?.(purpose === 'buy' ? 'rent' : 'buy');
            }}
          >
            {city} for {purpose === 'all' ? 'Rent' : (purpose === 'buy' ? 'Rent' : 'Sale')}
          </Button>
        </div>
      </div>

      {/* Locations Section */}
      <Card className="p-4 md:p-6 border bg-secondary/10 shadow-none rounded-2xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
              <MapPin className="w-4 h-4 text-primary" />
            </div>
            <h3 className="text-base md:text-lg font-semibold leading-tight">
              Popular Locations
            </h3>
          </div>
          <div className="flex flex-wrap items-center gap-1 bg-background/50 p-1 rounded-lg border">
            <Button
              variant="ghost"
              size="sm"
              className={cn("h-7 text-[11px] gap-1 px-2 rounded-md", sortBy === 'name' ? "bg-background shadow-sm text-primary" : "text-muted-foreground hover:bg-background/80")}
              onClick={() => setSortBy('name')}
            >
              <SortAsc className="w-3 h-3" />
              Name
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className={cn("h-7 text-[11px] gap-1 px-2 rounded-md", sortBy === 'count' ? "bg-background shadow-sm text-primary" : "text-muted-foreground hover:bg-background/80")}
              onClick={() => setSortBy('count')}
            >
              <SortDesc className="w-3 h-3" />
              Count
            </Button>
          </div>
        </div>

        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center opacity-50">
            <Loader2 className="w-8 h-8 animate-spin text-primary mb-2" />
            <p className="text-sm">Loading locations...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {displayedLocations.map((loc) => (
              <button
                key={loc.id}
                onClick={() => onAreaSelect(loc.id, loc.slug)}
                className={cn(
                  "flex items-center justify-between p-3 rounded-xl transition-all border text-sm group",
                  currentAreaId === loc.id
                    ? "bg-primary/5 border-primary ring-1 ring-primary shadow-sm"
                    : "bg-background border-input hover:border-primary/40 text-foreground"
                )}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className={cn(
                    "w-2 h-2 rounded-full shrink-0 transition-colors",
                    currentAreaId === loc.id ? "bg-primary animate-pulse" : "bg-muted"
                  )} />
                  <span className={cn(
                    "font-medium truncate",
                    currentAreaId === loc.id ? "text-primary" : "text-foreground"
                  )}>{toTitleCase(loc.name)}</span>
                </div>
                <Badge
                  variant={currentAreaId === loc.id ? "default" : "outline"}
                  className={cn(
                    "shrink-0 text-[10px] h-5 px-1.5 transition-colors",
                    currentAreaId !== loc.id && "bg-muted/30 border-none text-muted-foreground"
                  )}
                >
                  {loc.count}
                </Badge>
              </button>
            ))}

            {!loading && sortedLocations.length === 0 && (
              <div className="col-span-full py-10 text-center text-muted-foreground text-sm italic">
                No popular locations found for this criteria
              </div>
            )}
          </div>
        )}

        {sortedLocations.length > 16 && (
          <div className="mt-8 pt-6 border-t border-primary/5 flex justify-center">
            <Button
              variant="ghost"
              size="sm"
              className="gap-2 text-xs font-semibold hover:bg-primary/5 hover:text-primary transition-all rounded-full px-6"
              onClick={() => setIsExpanded(!isExpanded)}
            >
              {isExpanded ? (
                <>
                  <ChevronUp className="w-3.5 h-3.5" />
                  Show Fewer
                </>
              ) : (
                <>
                  <ChevronDown className="w-3.5 h-3.5" />
                  Show all {sortedLocations.length} locations
                </>
              )}
            </Button>
          </div>
        )}
      </Card>
    </div>
  );
}
