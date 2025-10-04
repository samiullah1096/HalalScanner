'use client';

import { motion } from 'framer-motion';
import { MapPin, Users, Flag } from 'lucide-react';
import { Card } from './ui/card';
import { Badge } from './ui/badge';

interface CountryInfo {
  name: string;
  region?: string;
  population?: number;
  flag?: string;
  capital?: string;
}

interface CountryInfoCardProps {
  country: CountryInfo;
}

export function CountryInfoCard({ country }: CountryInfoCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
    >
      <Card className="overflow-hidden">
        <div className="bg-gradient-to-r from-blue-500/10 to-cyan-500/10 p-6 border-b">
          <h2 className="text-2xl font-bold flex items-center gap-3">
            <MapPin className="h-6 w-6 text-blue-500" />
            Country Information
          </h2>
        </div>

        <div className="p-6 space-y-4">
          <div className="flex items-center gap-4">
            {country.flag && (
              <div className="text-6xl">{country.flag}</div>
            )}
            <div>
              <h3 className="text-2xl font-bold">{country.name}</h3>
              {country.region && (
                <Badge variant="secondary" className="mt-2">
                  {country.region}
                </Badge>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
            {country.capital && (
              <div className="flex items-center gap-3 p-4 bg-muted/50 rounded-lg">
                <Flag className="h-5 w-5 text-blue-500" />
                <div>
                  <p className="text-xs text-muted-foreground">Capital</p>
                  <p className="font-semibold">{country.capital}</p>
                </div>
              </div>
            )}

            {country.population && (
              <div className="flex items-center gap-3 p-4 bg-muted/50 rounded-lg">
                <Users className="h-5 w-5 text-blue-500" />
                <div>
                  <p className="text-xs text-muted-foreground">Population</p>
                  <p className="font-semibold">
                    {country.population.toLocaleString()}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
