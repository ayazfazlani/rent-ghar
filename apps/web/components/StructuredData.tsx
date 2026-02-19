'use client';

import Script from 'next/script';

const GA_MEASUREMENT_ID = 'G-GFGWSFNVDS';

/**
 * Component for injecting JSON-LD Structured Data for SEO
 */
export default function StructuredData() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://propertydealer.pk';

  const organizationData = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'PropertyDealer',
    url: siteUrl,
    logo: `${siteUrl}/logo.png`,
    description: "Pakistan's most trusted property portal since 2007.",
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'PK',
    },
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+92-XXX-XXXXXXX',
      contactType: 'customer service',
    },
  };

  const websiteData = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'PropertyDealer',
    url: siteUrl,
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${siteUrl}/properties?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationData) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteData) }}
      />

      {/* Google tag (gtag.js) */}
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${GA_MEASUREMENT_ID}');
        `}
      </Script>
    </>
  );
}
