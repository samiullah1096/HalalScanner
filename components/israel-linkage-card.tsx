'use client';

import { motion } from 'framer-motion';
import { TriangleAlert as AlertTriangle, Shield, Info } from 'lucide-react';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Alert, AlertDescription } from './ui/alert';

interface IsraelLinkageCardProps {
  hasLinkage: boolean;
  details?: string;
}

export function IsraelLinkageCard({ hasLinkage, details }: IsraelLinkageCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
    >
      <Card className={`overflow-hidden ${hasLinkage ? 'border-2 border-yellow-500' : ''}`}>
        <div className={`p-6 border-b ${
          hasLinkage
            ? 'bg-gradient-to-r from-yellow-500/10 to-orange-500/10'
            : 'bg-gradient-to-r from-green-500/10 to-emerald-500/10'
        }`}>
          <h2 className="text-2xl font-bold flex items-center gap-3">
            {hasLinkage ? (
              <AlertTriangle className="h-6 w-6 text-yellow-500" />
            ) : (
              <Shield className="h-6 w-6 text-green-500" />
            )}
            Boycott Check
          </h2>
        </div>

        <div className="p-6">
          {hasLinkage ? (
            <Alert className="border-yellow-500 bg-yellow-500/10">
              <AlertTriangle className="h-5 w-5 text-yellow-500" />
              <AlertDescription className="text-base">
                <p className="font-semibold mb-2">⚠️ Potential Link Detected</p>
                <p>
                  This product or brand may have connections to entities you wish to boycott.
                  We recommend considering alternative options.
                </p>
                {details && (
                  <p className="text-sm mt-3 text-muted-foreground">{details}</p>
                )}
              </AlertDescription>
            </Alert>
          ) : (
            <Alert className="border-green-500 bg-green-500/10">
              <Shield className="h-5 w-5 text-green-500" />
              <AlertDescription className="text-base">
                <p className="font-semibold mb-2">✓ No Links Found</p>
                <p>
                  No concerning connections detected based on available data sources.
                </p>
              </AlertDescription>
            </Alert>
          )}

          <div className="mt-6 p-4 bg-muted/50 rounded-lg">
            <div className="flex items-start gap-3">
              <Info className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
              <div className="text-sm text-muted-foreground">
                <p className="font-medium text-foreground mb-1">About This Check</p>
                <p>
                  We cross-reference multiple global databases to identify potential
                  ownership, manufacturing, or business relationships. This information
                  helps you make informed choices aligned with your values.
                </p>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
