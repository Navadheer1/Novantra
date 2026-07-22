"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { useReducedMotion } from '@/lib/design-system';

const stories = [
  { company: 'Synapse AI', result: 'Raised $3.2M Series A', duration: 'Closed in 12 days' },
  { company: 'Payload Security', result: 'Raised $1.8M Seed', duration: 'Matched with Sequoia' },
];

export default function SuccessStories() {
  const prefersReduced = useReducedMotion();

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-extrabold text-center text-gray-900 mb-8">Success Highlights</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {stories.map((story, key) => {
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
                className="p-6 rounded-2xl bg-gray-50 border border-gray-100 shadow-xs"
                {...motionProps}
              >
                <h3 className="text-xl font-bold text-gray-900">{story.company}</h3>
                <span className="text-sm font-semibold text-emerald-600 block mt-1">{story.result}</span>
                <span className="text-xs text-gray-500 block mt-2">{story.duration}</span>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
