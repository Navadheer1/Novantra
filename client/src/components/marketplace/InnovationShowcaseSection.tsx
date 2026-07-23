"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Cpu, ShieldCheck, Zap, Eye, ShoppingCart, Sparkles } from "lucide-react";

export interface HardwareInnovation {
  id: string;
  title: string;
  category: string;
  price: string;
  statusTag: "Patent Ready" | "Prototype Ready" | "Production Hardware";
  creator: string;
  image: string;
  specs: string[];
}

interface InnovationShowcaseSectionProps {
  onInspectInnovation: (item: HardwareInnovation) => void;
}

export default function InnovationShowcaseSection({ onInspectInnovation }: InnovationShowcaseSectionProps) {
  const innovations: HardwareInnovation[] = [
    {
      id: "hw-robot",
      title: "Noventra AI Autonomous Desktop Companion Robot",
      category: "Robotics & Hardware",
      price: "$299",
      statusTag: "Prototype Ready",
      creator: "Rohan Sharma (Hardware Lead)",
      image: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=400&h=250&fit=crop",
      specs: ["ESP32 Microcontroller", "OpenAI Voice API", "Custom 3D PCB CAD Files", "ROS 2 Ready"]
    },
    {
      id: "hw-dashcam",
      title: "Smart AI Edge DashCam with Computer Vision",
      category: "IoT & Electronics",
      price: "$189",
      statusTag: "Patent Ready",
      creator: "Aisha Khan",
      image: "https://images.unsplash.com/photo-1508614589041-895b88991e3e?w=400&h=250&fit=crop",
      specs: ["Raspberry Pi Compute Module 4", "TensorFlow Lite Edge AI", "Dual 4K Sony Sensor", "LTE Module"]
    },
    {
      id: "hw-drone",
      title: "Autonomous Agricultural Soil Monitoring Drone",
      category: "Drone & Robotics",
      price: "$499",
      statusTag: "Production Hardware",
      creator: "Apex Hardware Labs",
      image: "https://images.unsplash.com/photo-1527977966376-1c8408f9f108?w=400&h=250&fit=crop",
      specs: ["Carbon Fiber Frame", "Thermal & Multispectral Sensor", "ArduPilot Firmware", "45min Battery"]
    }
  ];

  return (
    <div className="mb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-black uppercase bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 px-2.5 py-0.5 rounded-full border border-emerald-500/20 flex items-center gap-1">
              <Cpu className="w-3.5 h-3.5 text-emerald-500" /> Physical Hardware & Robotics Showcase
            </span>
          </div>
          <h2 className="text-2xl font-black text-foreground tracking-tight">
            Hardware, IoT & Electronics Innovation Hub
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5 font-medium">
            Discover patent-ready hardware inventions, 3D CAD files, PCB schematics, and prototype robotics.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {innovations.map((item) => (
          <div key={item.id} className="bg-card border border-border/80 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-4">
            <div>
              <div className="h-44 w-full rounded-xl overflow-hidden mb-3 relative bg-muted">
                <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                <span className="absolute top-3 left-3 text-[10px] font-black uppercase bg-slate-950/80 text-white backdrop-blur-md px-2.5 py-1 rounded-md">
                  {item.statusTag}
                </span>
              </div>

              <h3 className="text-base font-black text-foreground">{item.title}</h3>
              <p className="text-xs font-semibold text-muted-foreground mt-1">Creator: <strong className="text-foreground">{item.creator}</strong></p>

              <div className="flex flex-wrap gap-1 mt-3">
                {item.specs.map((s, i) => (
                  <span key={i} className="text-[10px] font-bold bg-muted text-muted-foreground px-2 py-0.5 rounded border border-border/50">
                    {s}
                  </span>
                ))}
              </div>
            </div>

            <div className="pt-3 border-t border-border/60 flex items-center justify-between">
              <div>
                <span className="text-[9px] uppercase font-bold text-muted-foreground block">License Price</span>
                <strong className="text-lg font-black text-foreground">{item.price}</strong>
              </div>

              <Button
                size="sm"
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs"
                onClick={() => onInspectInnovation(item)}
              >
                <Eye className="w-3.5 h-3.5 mr-1" /> Inspect Hardware Specs
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
