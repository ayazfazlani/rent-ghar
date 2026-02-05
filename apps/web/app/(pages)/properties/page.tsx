'use client'
/**
 * Main Properties Page - Uses query parameters
 * 
 * This page reads query parameters from the URL and passes them to
 * the shared PropertiesListing component.
 * 
 * Example URLs:
 * - /properties
 * - /properties?purpose=rent
 * - /properties?purpose=rent&city=karachi
 * - /properties?purpose=rent&city=karachi&type=house
 */

import { useSearchParams } from 'next/navigation';
import PropertiesListing from '@/components/PropertiesListing';
import { Suspense } from 'react';

function PropertiesContent() {
  const searchParams = useSearchParams();

  // Extract query parameters
  const purpose = (searchParams.get('purpose') as 'rent' | 'buy' | 'all') || 'all';
  const city = searchParams.get('city') || '';
  const type = searchParams.get('type') || 'all';

  return (
    <PropertiesListing
      purpose={purpose}
      city={city}
      type={type}
      useCleanUrls={false}
    />
  );
}

export default function PropertiesPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    }>
      <PropertiesContent />
    </Suspense>
  );
}
