"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { useReducedMotion } from '@/lib/design-system';

interface Item {
  title: string;
  category: string;
  stats: string;
}

const sampleItems: Item[] = [
  { title: 'Fintech AI Copilot', category: 'Fintech', stats: '$1.2M raised' },
  { title: 'HealthTech Platform', category: 'Health', stats: 'Seed stage' },
  { title: 'EdTech NextGen', category: 'Education', stats: '500k users' },
];

export default function MarketplacePreview() {
  const prefersReduced = useReducedMotion();

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-extrabold text-center text-gray-900 mb-8">
          Marketplace Spotlight
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {sampleItems.map((item, key) => {
            const motionProps = prefersReduced
              ? {}
              : {
                  initial: { opacity: 0, y: 15 },
                  whileInView: { opacity: 1, y: 0 },
                  viewport: { once: true, amount: 0.2 },
                  transition: { duration: 0.4, ease: 'easeOut' as const },
                };

            return (
              <motion.div
                key={key}
                className="p-6 rounded-lg border border-gray-100 bg-gray-50 shadow-xs hover:shadow-md transition-shadow"
                {...motionProps}
              >
                <span className="text-xs font-semibold uppercase tracking-wider text-primary-600">
                  {item.category}
                </span>
                <h3 className="mt-2 text-xl font-bold text-gray-900">{item.title}</h3>
                <p className="mt-1 text-sm text-gray-500">{item.stats}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
