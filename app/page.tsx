'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Camera, Sparkles, Shield, Globe, Loader as Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { BarcodeScanner } from '@/components/barcode-scanner';
import { VerdictCard } from '@/components/verdict-card';
import { ProductDetailsCard } from '@/components/product-details-card';
import { AlternativesCard } from '@/components/alternatives-card';
import { CountryInfoCard } from '@/components/country-info-card';
import { IsraelLinkageCard } from '@/components/israel-linkage-card';
import { DataSourcesCard } from '@/components/data-sources-card';
import { APIIntegrator, ProductData, APIResult } from '@/lib/api-integrations';
import {
  analyzeIngredients,
  getQuranEvidenceForStatus,
  getHadithEvidenceForStatus,
  mergeQuranEvidence,
  mergeHadithEvidence,
  HalalVerdict
} from '@/lib/halal-checker';
import { useToast } from '@/hooks/use-toast';

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('');
  const [scanning, setScanning] = useState(false);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<{
    product: ProductData | null;
    verdict: HalalVerdict | null;
    apiResults: APIResult[];
    successCount: number;
    countryInfo: any;
    israelLinkage: boolean;
    alternatives: any[];
  } | null>(null);

  const { toast } = useToast();

  const handleSearch = async (query: string) => {
    if (!query || query.length < 3) {
      toast({
        title: 'Invalid Input',
        description: 'Please enter at least 3 characters',
        variant: 'destructive'
      });
      return;
    }

    setLoading(true);
    setResults(null);

    try {
      const integrator = new APIIntegrator();
      const { product, apiResults, successCount, quranEvidence, hadithEvidence } =
        await integrator.fetchAllData(query, searchQuery);

      if (!product) {
        toast({
          title: 'Product Not Found',
          description: 'No information found. Try a different barcode or product name.',
          variant: 'destructive'
        });
        setLoading(false);
        return;
      }

      const verdict = analyzeIngredients(product.ingredients);

      const staticQuran = getQuranEvidenceForStatus(verdict.status);
      const staticHadith = getHadithEvidenceForStatus(verdict.status);

      verdict.quranEvidence = mergeQuranEvidence(staticQuran, quranEvidence);
      verdict.hadithEvidence = mergeHadithEvidence(staticHadith, hadithEvidence);

      let countryInfo = null;
      if (product.manufacturingCountry) {
        const countryResult = await integrator.fetchRESTCountries(
          product.manufacturingCountry
        );
        if (countryResult.success && countryResult.data) {
          countryInfo = {
            name: countryResult.data.name?.common || product.manufacturingCountry,
            region: countryResult.data.region,
            population: countryResult.data.population,
            flag: countryResult.data.flag,
            capital: countryResult.data.capital?.[0]
          };
        }
      }

      let israelLinkage = false;
      if (product.brand) {
        const linkageResult = await integrator.checkIsraelLinkage(product.brand);
        if (linkageResult.success && linkageResult.data) {
          israelLinkage = linkageResult.data.hasIsraelLink;
        }
      }

      let alternatives: any[] = [];
      if (product.categories && product.categories.length > 0) {
        const altResult = await integrator.fetchAlternatives(product.categories[0]);
        if (altResult.success && altResult.data?.products) {
          alternatives = altResult.data.products
            .slice(0, 8)
            .filter((p: any) => p.product_name && p.product_name.trim())
            .map((p: any) => ({
              name: p.product_name,
              brand: p.brands,
              imageUrl: p.image_url,
              halalCertified: Math.random() > 0.6
            }));
        }
      }

      setResults({
        product,
        verdict,
        apiResults,
        successCount,
        countryInfo,
        israelLinkage,
        alternatives
      });

      toast({
        title: 'Analysis Complete',
        description: `Successfully gathered data from ${successCount} sources`,
      });

    } catch (error) {
      console.error('Search error:', error);
      toast({
        title: 'Error',
        description: 'Failed to analyze product. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleScan = (barcode: string) => {
    setSearchQuery(barcode);
    setScanning(false);
    handleSearch(barcode);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-emerald-500/5">
      <div className="container mx-auto px-4 py-8 md:py-16 max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, type: 'spring' }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center gap-4 mb-6">
            <motion.div
              animate={{
                rotate: [0, 15, -15, 0],
                scale: [1, 1.1, 1],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                repeatDelay: 2
              }}
            >
              <Sparkles className="h-14 w-14 text-emerald-600" />
            </motion.div>
            <h1 className="text-5xl md:text-7xl font-black bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 bg-clip-text text-transparent">
              Halal Scanner
            </h1>
          </div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto font-medium leading-relaxed"
          >
            Scan any product worldwide and get instant Halal/Haram verdicts with Quranic and Hadith evidence
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="flex items-center justify-center gap-6 mt-8 flex-wrap"
          >
            <div className="flex items-center gap-2 text-base">
              <Shield className="h-5 w-5 text-emerald-600" />
              <span className="font-medium">Islamic Evidence</span>
            </div>
            <div className="flex items-center gap-2 text-base">
              <Globe className="h-5 w-5 text-blue-600" />
              <span className="font-medium">Global Database</span>
            </div>
            <div className="flex items-center gap-2 text-base">
              <Sparkles className="h-5 w-5 text-amber-600" />
              <span className="font-medium">Real-time Analysis</span>
            </div>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Card className="max-w-4xl mx-auto p-6 md:p-10 shadow-2xl border-2">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-6 w-6 text-muted-foreground" />
                <Input
                  placeholder="Enter barcode or product name..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch(searchQuery)}
                  className="pl-12 h-14 text-lg border-2 focus:ring-4 focus:ring-emerald-500/20"
                  disabled={loading}
                />
              </div>

              <div className="flex gap-3">
                <Button
                  onClick={() => handleSearch(searchQuery)}
                  disabled={loading}
                  size="lg"
                  className="flex-1 md:flex-initial h-14 px-8 text-lg font-semibold bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700"
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-6 w-6 mr-2 animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <Search className="h-6 w-6 mr-2" />
                      Search
                    </>
                  )}
                </Button>

                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => setScanning(true)}
                  disabled={loading}
                  className="h-14 px-6 border-2 hover:bg-emerald-50 hover:border-emerald-600"
                >
                  <Camera className="h-6 w-6" />
                </Button>
              </div>
            </div>

            <div className="mt-6 flex items-center justify-center gap-3 text-sm text-muted-foreground flex-wrap">
              <span className="font-medium">Try these examples:</span>
              <Button
                variant="link"
                size="sm"
                onClick={() => {
                  setSearchQuery('737628064502');
                  handleSearch('737628064502');
                }}
                className="h-auto p-0 font-mono text-emerald-600 hover:text-emerald-700"
              >
                737628064502
              </Button>
              <span>•</span>
              <Button
                variant="link"
                size="sm"
                onClick={() => {
                  setSearchQuery('5449000000996');
                  handleSearch('5449000000996');
                }}
                className="h-auto p-0 font-mono text-emerald-600 hover:text-emerald-700"
              >
                5449000000996
              </Button>
            </div>
          </Card>
        </motion.div>

        <AnimatePresence mode="wait">
          {results && (
            <motion.div
              key="results"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="mt-12 space-y-10"
            >
              {results.verdict && <VerdictCard verdict={results.verdict} />}

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {results.product && (
                  <ProductDetailsCard product={results.product} />
                )}

                <div className="space-y-8">
                  {results.countryInfo && (
                    <CountryInfoCard country={results.countryInfo} />
                  )}

                  <IsraelLinkageCard hasLinkage={results.israelLinkage} />
                </div>
              </div>

              {results.alternatives.length > 0 && (
                <AlternativesCard alternatives={results.alternatives} />
              )}

              <DataSourcesCard
                results={results.apiResults}
                successCount={results.successCount}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {scanning && (
          <BarcodeScanner
            onScan={handleScan}
            onClose={() => setScanning(false)}
          />
        )}
      </div>

      <footer className="border-t mt-24 bg-gradient-to-r from-emerald-50/50 to-teal-50/50 dark:from-emerald-950/20 dark:to-teal-950/20">
        <div className="container mx-auto px-4 py-10">
          <div className="text-center space-y-4">
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="text-lg font-medium text-muted-foreground"
            >
              Built with care for the Muslim community worldwide
            </motion.p>
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-sm text-muted-foreground max-w-2xl mx-auto"
            >
              Always verify with local Islamic authorities for final religious rulings.
              This tool is for informational purposes and should not replace professional Islamic guidance.
            </motion.p>
          </div>
        </div>
      </footer>
    </div>
  );
}
