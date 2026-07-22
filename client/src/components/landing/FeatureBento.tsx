"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Zap, Globe, Users, BarChart2, Shield, Lightbulb } from 'lucide-react';
import { useReducedMotion } from '@/lib/design-system';

interface FeatureItem {
  title: string;
  description: string;
  Icon: React.ComponentType<React.ComponentProps<'svg'>>;
}

const features: FeatureItem[] = [
  {
    title: 'Instant Pitch Rooms',
    description: 'AI‑powered live pitch rooms that connect founders with investors in seconds.',
    Icon: Zap,
  },
  {
    title: 'Global Marketplace',
    description: 'Showcase your startup to a worldwide audience of VCs and talent.',
    Icon: Globe,
  },
  {
    title: 'Community Collaboration',
    description: 'Work with mentors, advisors, and peers on shared workspaces.',
    Icon: Users,
  },
  {
    title: 'Real‑time Analytics',
    description: 'Live dashboards track traction, funding progress and growth metrics.',
    Icon: BarChart2,
  },
  {
    title: 'Enterprise‑grade Security',
    description: 'End‑to‑end encryption and role‑based access control.',
    Icon: Shield,
  },
  {
    title: 'Intelligent Insights',
    description: 'AI suggestions help you optimize pitch decks and product roadmaps.',
    Icon: Lightbulb,
  },
];

const FeatureCard: React.FC<{ feature: FeatureItem }> = ({ feature }) => {
  const { title, description, Icon } = feature;
  const prefersReduced = useReducedMotion();

  const motionProps = prefersReduced
    ? {}
    : {
        initial: { opacity: 0, y: 20 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true, amount: 0.2 },
        transition: { duration: 0.5, ease: 'easeOut' as const },
      };

  return (
    <motion.div
      className="rounded-xl bg-white/90 p-6 shadow-sm hover:-translate-y-1 hover:shadow-lg transition-all duration-200"
      {...motionProps}
    >
      <Icon className="h-8 w-8 text-primary-600 mb-4" aria-hidden="true" />
      <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-sm text-gray-600 leading-snug">{description}</p>
    </motion.div>
  );
};

export default function FeatureBento() {
  return (
    <section className="py-16 bg-gray-50/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-extrabold text-center text-gray-900 mb-12">
          Everything You Need to Scale Your Venture
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, idx) => (
            <FeatureCard key={idx} feature={feature} />
          ))}
        </div>
      </div>
    </section>
  );
}
