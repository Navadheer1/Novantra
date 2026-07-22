"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { useReducedMotion } from '@/lib/design-system';

const roles = [
  { name: 'Founders', desc: 'Raise capital, pitch live & build your executive team.' },
  { name: 'Investors', desc: 'Discover high-signal deals, thesis matches & pitch rooms.' },
  { name: 'Talent', desc: 'Join high-growth tech ventures with equity alignment.' },
];

export default function RoleSelector() {
  const prefersReduced = useReducedMotion();

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl font-extrabold text-gray-900 mb-10">Tailored For Ecosystem Leaders</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {roles.map((role, key) => {
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
                className="p-8 rounded-2xl bg-white shadow-sm border border-gray-100 text-left hover:shadow-md transition-shadow"
                {...motionProps}
              >
                <h3 className="text-xl font-bold text-gray-900 mb-2">{role.name}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{role.desc}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
