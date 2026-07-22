"use client";

import React, { useMemo, useState, useEffect, useRef } from "react";
import { geoEqualEarth, geoPath } from "d3-geo";
import { feature } from "topojson-client";
import land110m from "world-atlas/land-110m.json";
import { HUB_NODES, HUB_CONNECTIONS, HubNode } from "./globalConnectivityData";
import styles from "./GlobalConnectivityBackground.module.css";

interface GlobalConnectivityBackgroundProps {
  className?: string;
}

export const GlobalConnectivityBackground: React.FC<GlobalConnectivityBackgroundProps> = ({
  className = "",
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 1200, height: 640 });

  // 1. ResizeObserver for responsive SVG rendering across Desktop, Tablet & Mobile
  useEffect(() => {
    if (!containerRef.current) return;

    const updateBounds = () => {
      if (containerRef.current) {
        const { clientWidth, clientHeight } = containerRef.current;
        setDimensions({
          width: Math.max(clientWidth, 320),
          height: Math.max(clientHeight, 240),
        });
      }
    };

    updateBounds();
    const observer = new ResizeObserver(updateBounds);
    observer.observe(containerRef.current);

    return () => {
      observer.disconnect();
    };
  }, []);

  // 2. Parse TopoJSON into GeoJSON landmass & compute D3 projection
  const { landPathD, projectedNodes, projectedArcs } = useMemo(() => {
    try {
      // Extract land geometry from official TopoJSON world-atlas dataset
      const landGeoJson = feature(
        land110m as any,
        (land110m as any).objects.land
      );

      // Fit map within container padding to ensure major continents are never cropped
      const padX = Math.max(dimensions.width * 0.06, 36);
      const padY = Math.max(dimensions.height * 0.08, 44);
      const projection = geoEqualEarth().fitExtent(
        [
          [padX, padY],
          [dimensions.width - padX, dimensions.height - padY],
        ],
        landGeoJson as any
      );

      const pathGenerator = geoPath().projection(projection);
      const landPathD = pathGenerator(landGeoJson as any) || "";

      // Map Hub Coordinates to SVG Pixel (x, y)
      const nodeMap = new Map<string, { node: HubNode; x: number; y: number }>();
      const projectedNodesList: { node: HubNode; x: number; y: number }[] = [];

      HUB_NODES.forEach((node) => {
        const coords = projection(node.coords);
        if (coords) {
          const item = { node, x: coords[0], y: coords[1] };
          nodeMap.set(node.id, item);
          projectedNodesList.push(item);
        }
      });

      // Construct Quadratic Curved Connection Arcs
      const projectedArcsList: {
        id: string;
        pathD: string;
        speed: number;
        delay: number;
      }[] = [];

      HUB_CONNECTIONS.forEach((conn, index) => {
        const source = nodeMap.get(conn.fromId);
        const target = nodeMap.get(conn.toId);

        if (source && target) {
          const x1 = source.x;
          const y1 = source.y;
          const x2 = target.x;
          const y2 = target.y;

          const dx = x2 - x1;
          const dy = y2 - y1;
          const dist = Math.hypot(dx, dy);

          if (dist > 5) {
            const mx = (x1 + x2) / 2;
            const my = (y1 + y2) / 2;

            // Perpendicular vector calculation for elegant elevation curve
            const nx = -dy / dist;
            const ny = dx / dist;
            const curvatureMultiplier = conn.curvature ?? -0.2;
            const elevation = dist * curvatureMultiplier;

            const cx = mx + nx * elevation;
            const cy = my + ny * elevation;

            const pathD = `M ${x1.toFixed(2)} ${y1.toFixed(2)} Q ${cx.toFixed(2)} ${cy.toFixed(2)} ${x2.toFixed(2)} ${y2.toFixed(2)}`;

            projectedArcsList.push({
              id: `${conn.fromId}->${conn.toId}-${index}`,
              pathD,
              speed: conn.particleSpeed || 5,
              delay: (index * 0.35) % 3,
            });
          }
        }
      });

      return {
        landPathD,
        projectedNodes: projectedNodesList,
        projectedArcs: projectedArcsList,
      };
    } catch (err) {
      console.error("Error generating D3 TopoJSON background paths:", err);
      return { landPathD: "", projectedNodes: [], projectedArcs: [] };
    }
  }, [dimensions.width, dimensions.height]);

  return (
    <div
      ref={containerRef}
      className={`${styles.container} ${className}`}
      aria-hidden="true"
      tabIndex={-1}
    >
      {/* Soft Ambient Glow Gradients */}
      <div className={styles.ambientGradient} />

      <svg
        className={styles.svgElement}
        viewBox={`0 0 ${dimensions.width} ${dimensions.height}`}
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          {/* Dotted Matrix Pattern for Land Fill */}
          <pattern
            id="landDotMatrixPattern"
            x="0"
            y="0"
            width="7"
            height="7"
            patternUnits="userSpaceOnUse"
          >
            <circle cx="3.5" cy="3.5" r="1.1" fill="#93C5FD" opacity="0.75" />
          </pattern>

          {/* Landmass Soft Outer Glow Filter */}
          <filter id="landGlowFilter" x="-10%" y="-10%" width="120%" height="120%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>

          {/* Connection Arc Stroke Gradient */}
          <linearGradient id="arcGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.6" />
            <stop offset="50%" stopColor="#60A5FA" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#2563EB" stopOpacity="0.5" />
          </linearGradient>
        </defs>

        {/* Layer 1: Landmass Outer Soft Glow */}
        {landPathD && (
          <path d={landPathD} className={styles.landGlowPath} />
        )}

        {/* Layer 2: Main TopoJSON Landmass with Dotted Matrix Pattern */}
        {landPathD && (
          <path d={landPathD} className={styles.landPath} />
        )}

        {/* Layer 3: Static Background Connection Line Guides */}
        <g>
          {projectedArcs.map((arc) => (
            <path
              key={`bg-arc-${arc.id}`}
              d={arc.pathD}
              className={styles.connectionArcBackground}
            />
          ))}
        </g>

        {/* Layer 4: Animated Dashed Network Arcs */}
        <g>
          {projectedArcs.map((arc) => (
            <path
              key={`arc-${arc.id}`}
              d={arc.pathD}
              className={styles.connectionArc}
            />
          ))}
        </g>

        {/* Layer 5: Traveling Light Particles Along Arcs (GPU Accelerated) */}
        <g>
          {projectedArcs.map((arc, idx) => (
            <g key={`particle-group-${arc.id}`}>
              {/* Particle Core */}
              <circle r="2.2" className={styles.particleHead}>
                <animateMotion
                  path={arc.pathD}
                  dur={`${arc.speed}s`}
                  repeatCount="indefinite"
                  begin={`${arc.delay}s`}
                />
              </circle>
              {/* Secondary Particle Echo */}
              <circle r="1.4" className={styles.particleTail}>
                <animateMotion
                  path={arc.pathD}
                  dur={`${arc.speed}s`}
                  repeatCount="indefinite"
                  begin={`${arc.delay + 0.15}s`}
                />
              </circle>
            </g>
          ))}
        </g>

        {/* Layer 6: Global Startup Hub Nodes */}
        <g>
          {projectedNodes.map(({ node, x, y }) => {
            const isTier1 = node.tier === 1;
            const coreRadius = isTier1 ? 3 : 2.2;

            return (
              <g
                key={`node-${node.id}`}
                transform={`translate(${x.toFixed(2)}, ${y.toFixed(2)})`}
              >
                {/* Outer Expanding Pulse Ring */}
                <circle
                  cx="0"
                  cy="0"
                  className={styles.nodeOuterPulse}
                  style={{ animationDelay: `${node.pulseDelay || 0}s` }}
                />

                {/* Inner Glowing Ring */}
                <circle
                  cx="0"
                  cy="0"
                  className={styles.nodeGlowRing}
                  style={{ animationDelay: `${(node.pulseDelay || 0) + 0.5}s` }}
                />

                {/* Solid Core Dot */}
                <circle
                  cx="0"
                  cy="0"
                  r={coreRadius}
                  className={isTier1 ? styles.nodeCoreTier1 : styles.nodeCoreTier2}
                />
              </g>
            );
          })}
        </g>
      </svg>
    </div>
  );
};

export default GlobalConnectivityBackground;
