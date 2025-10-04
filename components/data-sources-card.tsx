'use client';

import { motion } from 'framer-motion';
import { Database, CircleCheck as CheckCircle2, Circle as XCircle } from 'lucide-react';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { APIResult } from '@/lib/api-integrations';

interface DataSourcesCardProps {
  results: APIResult[];
  successCount: number;
}

export function DataSourcesCard({ results, successCount }: DataSourcesCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.5 }}
    >
      <Card className="overflow-hidden border-2 shadow-lg">
        <div className="bg-gradient-to-r from-sky-500/10 via-blue-500/10 to-cyan-500/10 p-6 border-b">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h2 className="text-2xl font-bold flex items-center gap-3">
                <motion.div
                  animate={{
                    rotate: [0, 360],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: 'linear',
                  }}
                >
                  <Database className="h-7 w-7 text-sky-600" />
                </motion.div>
                <span className="bg-gradient-to-r from-sky-600 to-blue-600 bg-clip-text text-transparent">
                  Data Collection Summary
                </span>
              </h2>
              <p className="text-muted-foreground mt-2 text-base">
                Information collected from <strong>{successCount}</strong> trusted global sources
              </p>
            </div>
            <Badge variant="secondary" className="text-xl px-6 py-3 font-bold bg-sky-600 hover:bg-sky-700 text-white">
              {successCount} Sources
            </Badge>
          </div>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
            {results.map((result, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.6 + idx * 0.03, type: 'spring' }}
                className={`flex items-center gap-3 p-4 rounded-xl border-2 transition-all duration-300 ${
                  result.success
                    ? 'bg-gradient-to-br from-emerald-50 to-green-50 dark:from-emerald-950/30 dark:to-green-950/30 border-emerald-300 dark:border-emerald-700 hover:shadow-lg hover:scale-105'
                    : 'bg-muted/30 border-muted hover:bg-muted/50'
                }`}
              >
                {result.success ? (
                  <CheckCircle2 className="h-6 w-6 text-emerald-600 flex-shrink-0" strokeWidth={2.5} />
                ) : (
                  <XCircle className="h-6 w-6 text-muted-foreground flex-shrink-0" />
                )}
                <div className="min-w-0 flex-1">
                  <p className={`font-semibold text-sm truncate ${result.success ? 'text-foreground' : 'text-muted-foreground'}`}>
                    {result.source}
                  </p>
                  {!result.success && result.error && (
                    <p className="text-xs text-muted-foreground truncate mt-0.5">
                      {result.error}
                    </p>
                  )}
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 }}
            className="mt-6 p-5 bg-gradient-to-r from-sky-50 to-blue-50 dark:from-sky-950/20 dark:to-blue-950/20 rounded-xl border-2 border-sky-200 dark:border-sky-800"
          >
            <p className="text-sm text-center leading-relaxed">
              <strong className="text-sky-700 dark:text-sky-400">Advanced Multi-Source Intelligence:</strong>{' '}
              <span className="text-muted-foreground">
                Our system aggregates information from trusted international databases, religious authorities,
                and product registries to provide you with the most comprehensive and accurate halal verification available.
              </span>
            </p>
          </motion.div>
        </div>
      </Card>
    </motion.div>
  );
}
