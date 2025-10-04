'use client';

import { motion } from 'framer-motion';
import { Sparkles, ArrowRight } from 'lucide-react';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import Image from 'next/image';

interface Alternative {
  name: string;
  brand?: string;
  imageUrl?: string;
  halalCertified?: boolean;
}

interface AlternativesCardProps {
  alternatives: Alternative[];
}

export function AlternativesCard({ alternatives }: AlternativesCardProps) {
  if (alternatives.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <Card className="overflow-hidden">
        <div className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 p-6 border-b">
          <h2 className="text-2xl font-bold flex items-center gap-3">
            <Sparkles className="h-6 w-6 text-green-500" />
            Halal Alternatives
          </h2>
          <p className="text-muted-foreground mt-1">
            Recommended certified Halal options
          </p>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {alternatives.slice(0, 6).map((alt, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.1 }}
              >
                <Card className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer group">
                  <div className="relative h-32 bg-gradient-to-br from-green-500/5 to-emerald-500/5">
                    {alt.imageUrl ? (
                      <Image
                        src={alt.imageUrl}
                        alt={alt.name}
                        fill
                        className="object-contain p-2 group-hover:scale-110 transition-transform"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full">
                        <Sparkles className="h-12 w-12 text-green-500/30" />
                      </div>
                    )}
                    {alt.halalCertified && (
                      <Badge className="absolute top-2 right-2 bg-green-500">
                        ✓ Certified
                      </Badge>
                    )}
                  </div>

                  <div className="p-4">
                    <h3 className="font-semibold line-clamp-1">{alt.name}</h3>
                    {alt.brand && (
                      <p className="text-sm text-muted-foreground mt-1">
                        {alt.brand}
                      </p>
                    )}

                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-full mt-3 group/btn"
                    >
                      View Details
                      <ArrowRight className="h-4 w-4 ml-2 group-hover/btn:translate-x-1 transition-transform" />
                    </Button>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
