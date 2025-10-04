# Halal Product Scanner

A comprehensive SaaS web application that allows Muslims worldwide to scan products and receive instant Halal/Haram verdicts with Islamic evidence from the Quran and Hadith.

## Features

### Core Functionality
- **Barcode Scanning**: Real-time camera-based barcode scanning using ZXing library
- **Manual Search**: Search products by barcode number or product name
- **Instant Verdict**: Get immediate Halal/Haram/Makruh/Mustahab rulings
- **Islamic Evidence**: Automatic Quranic verses and Hadith references for each verdict
- **Ingredient Analysis**: Detailed breakdown of all ingredients with halal status
- **Boycott Detection**: Checks for connections to boycotted entities
- **Alternative Recommendations**: Suggests certified Halal alternatives
- **Country Information**: Shows manufacturing country details and statistics
- **Multi-language Support**: English, Arabic, and Urdu support

### Technical Features
- **20+ API Integrations**: Fetches data from multiple global databases
- **Real-time Data**: Live aggregation from trusted sources
- **Beautiful UI**: Modern, responsive design with stunning animations
- **SEO Optimized**: Full on-page SEO with structured data (Schema.org, JSON-LD)
- **AEO Ready**: Answer Engine Optimization for voice search
- **PWA Support**: Progressive Web App capabilities
- **Mobile First**: Fully responsive across all devices
- **Fast Performance**: Optimized for sub-1s load times
- **High Availability**: Built to handle high traffic

## Data Sources

The application integrates with 20+ free, no-key APIs:

### Product & Food APIs
1. OpenFoodFacts
2. FoodRepo
3. Open Product Data (OPD)
4. Opendatasoft Product Data

### Country & Geolocation
5. REST Countries
6. GeoNames
7. World Bank Open Data

### Company & Ownership
8. Wikidata SPARQL
9. Wikipedia REST API
10. DBpedia SPARQL

### Boycott Verification
11. Wikidata Israel Linkage Check
12. OpenSanctions

### Alternatives & Safety
13. OpenFoodFacts Category Search
14. USDA Foods Database
15. FDA Enforcement Reports
16. FAOSTAT (UN Agriculture)

### Islamic Evidence
17. Al Quran Cloud API
18. Quran API (QuranAPI Pages)
19. Fawaz Ahmed Hadith API
20. Gadingnst Hadith API

## Technology Stack

- **Frontend**: Next.js 15, React 18, TypeScript
- **Styling**: Tailwind CSS, ShadCN/UI components
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Barcode**: ZXing library
- **HTTP Client**: Axios
- **SEO**: Next.js Metadata API, JSON-LD structured data

## Getting Started

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build

```bash
npm run build
```

### Production

```bash
npm start
```

## Usage

1. **Scan**: Click the camera icon to open the barcode scanner
2. **Search**: Enter a barcode number or product name in the search bar
3. **Analyze**: Wait for the system to fetch data from 20+ sources
4. **Review**: Check the verdict, Islamic evidence, and alternatives
5. **Decide**: Make informed choices based on comprehensive information

## SEO & AEO

The application is fully optimized for search engines and answer engines:

- **Meta Tags**: Dynamic title, description, and keywords
- **Open Graph**: Social media sharing optimization
- **Schema.org**: Product, Organization, and FAQ structured data
- **JSON-LD**: Rich snippets for enhanced search results
- **Sitemap**: XML sitemap for search engine crawlers
- **Robots.txt**: Proper crawler directives
- **PWA**: Progressive Web App with manifest

### Target Keywords
- halal product scanner
- halal barcode app
- halal checker online
- haram food detection
- boycott Israel products
- halal alternatives
- Islamic product check
- Muslim product scanner

## Performance Optimization

- **Code Splitting**: Automatic code splitting by Next.js
- **Image Optimization**: Next.js Image component
- **Lazy Loading**: Components loaded on demand
- **Compression**: Gzip/Brotli compression enabled
- **Caching**: Aggressive caching strategies
- **CDN Ready**: Optimized for CDN distribution

## Security

- **No API Keys**: All APIs are free and keyless
- **Client-Side**: All processing happens in the browser
- **No Data Storage**: No personal data is collected or stored
- **HTTPS Only**: Secure connections enforced
- **XSS Protection**: React's built-in XSS protection
- **CSRF Protection**: Next.js security headers

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Deployment

The application is ready for deployment on:
- Vercel (recommended)
- Netlify
- AWS Amplify
- Any static hosting service

## License

This project is created for the Muslim community worldwide. Use it freely with attribution.

## Support

For issues, questions, or contributions, please create an issue on the repository.

## Disclaimer

This tool provides information based on available data sources and Islamic guidelines. Always verify with local Islamic authorities for final rulings on specific products.

---

Made with ❤️ for the Muslim community worldwide
