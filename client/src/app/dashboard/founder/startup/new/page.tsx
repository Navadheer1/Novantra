"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";

export default function CreateStartup() {
  const { getToken } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    industry: "",
    stage: "",
    location: "",
    fundingNeeded: "",
    requiredRoles: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = await getToken();
      const rolesArray = formData.requiredRoles.split(',').map(r => r.trim()).filter(Boolean);

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/startups`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...formData,
          requiredRoles: rolesArray,
        }),
      });

      if (res.ok) {
        router.push("/dashboard/founder");
      } else {
        const error = await res.json();
        alert(error.error || "Failed to create startup");
      }
    } catch (err) {
      console.error(err);
      alert("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">Create Startup Profile</h1>
      <form onSubmit={handleSubmit} className="space-y-6 bg-card border border-border p-8 rounded-xl shadow-sm">
        <div>
          <label className="block text-sm font-medium mb-2">Startup Name</label>
          <input 
            type="text" 
            required 
            className="w-full p-3 border border-border rounded-lg bg-background focus:ring-2 focus:ring-primary outline-none"
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-2">Description</label>
          <textarea 
            required 
            rows={4}
            className="w-full p-3 border border-border rounded-lg bg-background focus:ring-2 focus:ring-primary outline-none"
            value={formData.description}
            onChange={(e) => setFormData({...formData, description: e.target.value})}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Industry</label>
            <input 
              type="text" 
              required 
              placeholder="e.g. AI, FinTech, HealthTech"
              className="w-full p-3 border border-border rounded-lg bg-background focus:ring-2 focus:ring-primary outline-none"
              value={formData.industry}
              onChange={(e) => setFormData({...formData, industry: e.target.value})}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Stage</label>
            <select 
              required 
              className="w-full p-3 border border-border rounded-lg bg-background focus:ring-2 focus:ring-primary outline-none"
              value={formData.stage}
              onChange={(e) => setFormData({...formData, stage: e.target.value})}
            >
              <option value="">Select Stage</option>
              <option value="Idea">Idea / Concept</option>
              <option value="Pre-Seed">Pre-Seed</option>
              <option value="Seed">Seed</option>
              <option value="Series A">Series A</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Location</label>
            <input 
              type="text" 
              required 
              placeholder="e.g. San Francisco, CA or Remote"
              className="w-full p-3 border border-border rounded-lg bg-background focus:ring-2 focus:ring-primary outline-none"
              value={formData.location}
              onChange={(e) => setFormData({...formData, location: e.target.value})}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Funding Needed ($)</label>
            <input 
              type="text" 
              placeholder="e.g. 500000"
              className="w-full p-3 border border-border rounded-lg bg-background focus:ring-2 focus:ring-primary outline-none"
              value={formData.fundingNeeded}
              onChange={(e) => setFormData({...formData, fundingNeeded: e.target.value})}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Required Roles (comma separated)</label>
          <input 
            type="text" 
            placeholder="e.g. CTO, Lead Designer, Fullstack Developer"
            className="w-full p-3 border border-border rounded-lg bg-background focus:ring-2 focus:ring-primary outline-none"
            value={formData.requiredRoles}
            onChange={(e) => setFormData({...formData, requiredRoles: e.target.value})}
          />
        </div>

        <Button type="submit" disabled={loading} className="w-full text-lg h-12">
          {loading ? "Creating..." : "Launch Startup Profile"}
        </Button>
      </form>
    </div>
  );
}
