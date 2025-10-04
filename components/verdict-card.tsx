'use client';

import { motion } from 'framer-motion';
import { CircleCheck as CheckCircle2, Circle as XCircle, CircleAlert as AlertCircle, TriangleAlert as AlertTriangle, Info, BookOpen, ScrollText } from 'lucide-react';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { HalalVerdict } from '@/lib/halal-checker';
import { Separator } from './ui/separator';

interface VerdictCardProps {
  verdict: HalalVerdict;
}

export function VerdictCard({ verdict }: VerdictCardProps) {
  const getVerdictConfig = () => {
    switch (verdict.status) {
      case 'halal':
        return {
          icon: CheckCircle2,
          color: 'text-emerald-600 dark:text-emerald-400',
          bg: 'bg-gradient-to-br from-emerald-50 to-green-50 dark:from-emerald-950/30 dark:to-green-950/30',
          border: 'border-emerald-300 dark:border-emerald-700',
          ring: 'ring-emerald-500/20',
          label: 'HALAL ✓',
          description: 'Permissible to consume according to Islamic law'
        };
      case 'haram':
        return {
          icon: XCircle,
          color: 'text-red-600 dark:text-red-400',
          bg: 'bg-gradient-to-br from-red-50 to-rose-50 dark:from-red-950/30 dark:to-rose-950/30',
          border: 'border-red-300 dark:border-red-700',
          ring: 'ring-red-500/20',
          label: 'HARAM ✗',
          description: 'Prohibited by Islamic law - Do not consume'
        };
      case 'makruh':
        return {
          icon: AlertTriangle,
          color: 'text-orange-600 dark:text-orange-400',
          bg: 'bg-gradient-to-br from-orange-50 to-amber-50 dark:from-orange-950/30 dark:to-amber-950/30',
          border: 'border-orange-300 dark:border-orange-700',
          ring: 'ring-orange-500/20',
          label: 'MAKRUH ⚠',
          description: 'Discouraged but not strictly prohibited'
        };
      case 'mustahab':
        return {
          icon: Info,
          color: 'text-blue-600 dark:text-blue-400',
          bg: 'bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950/30 dark:to-cyan-950/30',
          border: 'border-blue-300 dark:border-blue-700',
          ring: 'ring-blue-500/20',
          label: 'MUSTAHAB',
          description: 'Recommended and praiseworthy'
        };
      default:
        return {
          icon: AlertCircle,
          color: 'text-yellow-600 dark:text-yellow-400',
          bg: 'bg-gradient-to-br from-yellow-50 to-amber-50 dark:from-yellow-950/30 dark:to-amber-950/30',
          border: 'border-yellow-300 dark:border-yellow-700',
          ring: 'ring-yellow-500/20',
          label: 'DOUBTFUL ?',
          description: 'Uncertain status - Consult Islamic authority'
        };
    }
  };

  const config = getVerdictConfig();
  const Icon = config.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.6, type: 'spring', bounce: 0.4 }}
    >
      <Card className={`relative overflow-hidden border-2 ${config.border} shadow-2xl`}>
        <div className={`absolute inset-0 ${config.bg}`} />

        <div className="relative p-8 md:p-10">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
            className="flex items-center justify-between mb-8"
          >
            <div className="flex items-center gap-5">
              <motion.div
                className={`p-5 rounded-2xl ${config.bg} ring-4 ${config.ring}`}
                animate={{
                  scale: [1, 1.05, 1],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  repeatType: 'reverse',
                }}
              >
                <Icon className={`h-14 w-14 ${config.color}`} strokeWidth={2.5} />
              </motion.div>
              <div>
                <motion.h2
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                  className={`text-5xl font-black ${config.color} tracking-tight`}
                >
                  {config.label}
                </motion.h2>
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="text-muted-foreground mt-2 text-base font-medium"
                >
                  {config.description}
                </motion.p>
              </div>
            </div>

            <Badge
              variant="outline"
              className={`text-xl px-6 py-3 font-bold ${config.color} border-2`}
            >
              {verdict.confidence}%
            </Badge>
          </motion.div>

          <Separator className="my-6" />

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="space-y-4"
          >
            <h3 className="font-bold text-xl flex items-center gap-2">
              <span className={config.color}>▸</span> Detailed Analysis
            </h3>
            <ul className="space-y-3">
              {verdict.reasons.map((reason, idx) => (
                <motion.li
                  key={idx}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 + idx * 0.1 }}
                  className="flex items-start gap-3 bg-background/60 p-4 rounded-xl border"
                >
                  <span className={`mt-0.5 ${config.color} text-xl`}>•</span>
                  <span className="text-base leading-relaxed">{reason}</span>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {verdict.quranEvidence && verdict.quranEvidence.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="mt-8 pt-8 border-t-2"
            >
              <h3 className="font-bold text-2xl mb-6 flex items-center gap-3">
                <BookOpen className="h-7 w-7 text-emerald-600" />
                <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                  Quranic Evidence
                </span>
              </h3>
              <div className="space-y-6">
                {verdict.quranEvidence.map((evidence, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.8 + idx * 0.1 }}
                    className="bg-gradient-to-br from-emerald-50/50 to-teal-50/50 dark:from-emerald-950/20 dark:to-teal-950/20 rounded-2xl p-6 border-2 border-emerald-200 dark:border-emerald-800 shadow-lg"
                  >
                    <Badge className="mb-4 bg-emerald-600 hover:bg-emerald-700 text-base px-4 py-1">
                      Surah {evidence.surah}:{evidence.ayah}
                    </Badge>
                    <div className="text-right text-2xl leading-loose mb-4 font-arabic text-emerald-900 dark:text-emerald-100">
                      {evidence.arabic}
                    </div>
                    <div className="text-base italic border-l-4 border-emerald-600 pl-5 py-2 bg-white/50 dark:bg-black/20 rounded">
                      {evidence.translation}
                    </div>
                    {evidence.relevance && (
                      <p className="text-sm text-muted-foreground mt-3 flex items-start gap-2">
                        <Info className="h-4 w-4 mt-0.5 flex-shrink-0" />
                        <span>{evidence.relevance}</span>
                      </p>
                    )}
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {verdict.hadithEvidence && verdict.hadithEvidence.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 }}
              className="mt-8 pt-8 border-t-2"
            >
              <h3 className="font-bold text-2xl mb-6 flex items-center gap-3">
                <ScrollText className="h-7 w-7 text-amber-600" />
                <span className="bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
                  Hadith References
                </span>
              </h3>
              <div className="space-y-6">
                {verdict.hadithEvidence.map((hadith, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 1.0 + idx * 0.1 }}
                    className="bg-gradient-to-br from-amber-50/50 to-orange-50/50 dark:from-amber-950/20 dark:to-orange-950/20 rounded-2xl p-6 border-2 border-amber-200 dark:border-amber-800 shadow-lg"
                  >
                    <Badge variant="secondary" className="mb-4 bg-amber-600 hover:bg-amber-700 text-white text-base px-4 py-1">
                      {hadith.book} #{hadith.number}
                    </Badge>
                    {hadith.chapter && (
                      <p className="text-xs text-muted-foreground mb-3 font-medium">
                        {hadith.chapter}
                      </p>
                    )}
                    <div className="text-base italic border-l-4 border-amber-600 pl-5 py-2 bg-white/50 dark:bg-black/20 rounded leading-relaxed">
                      {hadith.text}
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
            className="mt-8 p-5 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 rounded-xl border border-blue-200 dark:border-blue-800"
          >
            <p className="text-sm text-center text-muted-foreground leading-relaxed">
              <strong className="text-foreground">Important:</strong> This is an automated analysis tool. Always consult with your local Islamic
              authority or scholar for final religious rulings, especially for complex cases.
            </p>
          </motion.div>
        </div>
      </Card>
    </motion.div>
  );
}
