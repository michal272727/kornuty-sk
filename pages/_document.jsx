import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html lang="sk">
      <Head>
        {/* Favicon */}
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />

        {/* Basic Meta Tags */}
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#FF6B9D" />
        <meta name="description" content="Vytvor si svoj vlastný kornút. Vyber si zo 100+ ingrediencií. Navrhni, namixuj, daruj." />
        <meta name="keywords" content="kornút, candy konfigurátor, online objednávka, sladkosti, korunky, miešanie ingrediencií" />
        <meta name="author" content="TerasKA s.r.o." />
        <meta name="robots" content="index, follow" />

        {/* Open Graph Tags */}
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="Kornuty.sk" />
        <meta property="og:title" content="Kornuty.sk - Vytvor si svoj vlastný kornút" />
        <meta property="og:description" content="Vytvor si svoj vlastný kornút. Vyber si zo 100+ ingrediencií. Navrhni, namixuj, daruj." />
        <meta property="og:url" content="https://new.kornuty.sk" />
        <meta property="og:image" content="https://new.kornuty.sk/og-image.jpg" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />

        {/* Twitter Tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Kornuty.sk - Vytvor si svoj vlastný kornút" />
        <meta name="twitter:description" content="Vytvor si svoj vlastný kornút. Vyber si zo 100+ ingrediencií. Navrhni, namixuj, daruj." />
        <meta name="twitter:image" content="https://new.kornuty.sk/og-image.jpg" />

        {/* Canonical URL */}
        <link rel="canonical" href="https://new.kornuty.sk" />

        {/* Structured Data (JSON-LD) */}
        <script type="application/ld+json" dangerouslySetInnerHTML={{__html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Organization",
          "name": "Kornuty.sk",
          "url": "https://new.kornuty.sk",
          "logo": "https://new.kornuty.sk/favicon.svg",
          "description": "Vytvor si svoj vlastný kornút. Vyber si zo 100+ ingrediencií.",
          "address": {
            "@type": "PostalAddress",
            "streetAddress": "Majerský rad 1527/77",
            "addressLocality": "Krupina",
            "postalCode": "963 01",
            "addressCountry": "SK"
          },
          "sameAs": []
        })}} />

        {/* Additional Structured Data for LocalBusiness */}
        <script type="application/ld+json" dangerouslySetInnerHTML={{__html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "LocalBusiness",
          "name": "TerasKA s.r.o.",
          "url": "https://new.kornuty.sk",
          "telephone": "[PHONE_NUMBER]",
          "email": "[EMAIL_ADDRESS]",
          "address": {
            "@type": "PostalAddress",
            "streetAddress": "Majerský rad 1527/77",
            "addressLocality": "Krupina",
            "postalCode": "963 01",
            "addressCountry": "SK"
          }
        })}} />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
