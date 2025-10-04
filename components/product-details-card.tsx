'use client';

import { motion } from 'framer-motion';
import { Package, Globe, Building2, Leaf } from 'lucide-react';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { ProductData } from '@/lib/api-integrations';
import Image from 'next/image';

interface ProductDetailsCardProps {
  product: ProductData;
}

export function ProductDetailsCard({ product }: ProductDetailsCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="overflow-hidden">
        <div className="relative h-64 bg-gradient-to-br from-primary/20 to-secondary/20">
          {product.imageUrl ? (
            <Image
              src={product.imageUrl}
              alt={product.name}
              fill
              className="object-contain p-4"
            />
          ) : (
            <div className="flex items-center justify-center h-full">
              <Package className="h-24 w-24 text-muted-foreground" />
            </div>
          )}
        </div>

        <div className="p-6 space-y-6">
          <div>
            <h2 className="text-3xl font-bold mb-2">{product.name}</h2>
            {product.brand && (
              <p className="text-muted-foreground flex items-center gap-2">
                <Building2 className="h-4 w-4" />
                {product.brand}
              </p>
            )}
            {product.barcode && (
              <p className="text-sm text-muted-foreground mt-1">
                Barcode: {product.barcode}
              </p>
            )}
          </div>

          {product.manufacturingCountry && (
            <div className="flex items-center gap-2">
              <Globe className="h-5 w-5 text-primary" />
              <span className="font-medium">Origin:</span>
              <Badge variant="secondary">{product.manufacturingCountry}</Badge>
            </div>
          )}

          {product.categories && product.categories.length > 0 && (
            <div>
              <h3 className="font-semibold mb-2 flex items-center gap-2">
                <Leaf className="h-5 w-5 text-primary" />
                Categories
              </h3>
              <div className="flex flex-wrap gap-2">
                {product.categories.slice(0, 5).map((category, idx) => (
                  <Badge key={idx} variant="outline">
                    {category}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {product.ingredients && product.ingredients.length > 0 && (
            <div>
              <h3 className="font-semibold mb-3">Ingredients</h3>
              <div className="bg-muted/50 rounded-lg p-4 max-h-48 overflow-y-auto">
                <ul className="space-y-2">
                  {product.ingredients.map((ingredient, idx) => (
                    <motion.li
                      key={idx}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      className="text-sm flex items-start gap-2"
                    >
                      <span className="text-primary mt-1">•</span>
                      <span>{ingredient}</span>
                    </motion.li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {product.nutriments && (
            <div>
              <h3 className="font-semibold mb-3">Nutritional Information</h3>
              <div className="grid grid-cols-2 gap-3">
                {Object.entries(product.nutriments)
                  .slice(0, 6)
                  .map(([key, value], idx) => (
                    <div key={idx} className="bg-muted/50 rounded-lg p-3">
                      <p className="text-xs text-muted-foreground capitalize">
                        {key.replace('_', ' ')}
                      </p>
                      <p className="font-semibold">{String(value)}</p>
                    </div>
                  ))}
              </div>
            </div>
          )}
        </div>
      </Card>
    </motion.div>
  );
}
