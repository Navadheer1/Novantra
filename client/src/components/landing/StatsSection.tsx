"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { useReducedMotion, easeInOutTransition } from '@/lib/design-system';

const stats = [
  { label: 'Capital Raised', value: '$140M+' },
  { label: 'Active Founders', value: '2,480+' },
  { label: 'VC Partners', value: '350+' },
  { label: 'Avg Term Sheet Time', value: '14 Days' },
];

export default function StatsSection() {
  const isReduced = useReducedMotion();

  return (
    <section className="py-12 bg-slate-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {stats.map((stat, idx) => (
            <motion.div
              key={idx}
              initial={isReduced ? { opacity: 1 } : { opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={isReduced ? { duration: 0 } : easeInOutTransition(0.5)}
              className="p-4"
            >
              <span className="text-3xl font-extrabold text-blue-400 block">{stat.value}</span>
              <span className="text-xs text-slate-400 mt-1 block font-medium">{stat.label}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
