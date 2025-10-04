import './globals.css';
import type { Metadata } from 'next';
import { Inter, Amiri } from 'next/font/google';
import { Toaster } from '@/components/ui/toaster';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const amiri = Amiri({ weight: ['400', '700'], subsets: ['arabic'], variable: '--font-arabic' });

export const metadata: Metadata = {
  metadataBase: new URL('https://halalscanner.app'),
  title: 'Halal Scanner – Check if Any Product is Halal, Haram, or Linked to Israel',
  description: 'Scan barcodes worldwide. Get instant Halal/Haram verdicts, ingredients, Quran & Hadith evidence, certifications, alternatives & boycott alerts using global data sources.',
  keywords: [
    'halal product scanner',
    'halal barcode app',
    'halal checker online',
    'haram food detection',
    'boycott Israel products',
    'halal alternatives',
    'halal food search',
    'Islamic product check',
    'Muslim product scanner',
    'halal ingredient checker',
    'quran hadith evidence',
    'halal certification'
  ],
  authors: [{ name: 'Halal Scanner Team' }],
  openGraph: {
    type: 'website',
    title: 'Halal Product Scanner - Instant Halal/Haram Verification',
    description: 'Scan any product globally and get instant Halal/Haram verdicts with Quranic evidence',
    siteName: 'Halal Scanner',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Halal Product Scanner',
    description: 'Instant Halal/Haram verification with Islamic evidence',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${amiri.variable}`}>
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#000000" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'WebApplication',
              name: 'Halal Product Scanner',
              applicationCategory: 'UtilityApplication',
              operatingSystem: 'Any',
              offers: {
                '@type': 'Offer',
                price: '0',
                priceCurrency: 'USD',
              },
              description: 'Scan products to check if they are Halal, Haram, or have boycott concerns',
              featureList: [
                'Barcode scanning',
                'Halal/Haram verification',
                'Quranic evidence',
                'Hadith references',
                'Boycott checking',
                'Alternative recommendations',
                'Multi-language support'
              ],
            }),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'FAQPage',
              mainEntity: [
                {
                  '@type': 'Question',
                  name: 'How do I check if a product is Halal?',
                  acceptedAnswer: {
                    '@type': 'Answer',
                    text: 'Scan the barcode using our app or enter the product name. We will analyze the ingredients and provide a Halal/Haram verdict with Quranic evidence.',
                  },
                },
                {
                  '@type': 'Question',
                  name: 'Does the scanner check for Israel-linked companies?',
                  acceptedAnswer: {
                    '@type': 'Answer',
                    text: 'Yes, our scanner cross-references multiple databases to identify potential ownership or business relationships with boycotted entities.',
                  },
                },
                {
                  '@type': 'Question',
                  name: 'Is the Halal scanner free to use?',
                  acceptedAnswer: {
                    '@type': 'Answer',
                    text: 'Yes, our Halal product scanner is completely free to use with unlimited scans.',
                  },
                },
              ],
            }),
          }}
        />
      </head>
      <body className={inter.className}>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
