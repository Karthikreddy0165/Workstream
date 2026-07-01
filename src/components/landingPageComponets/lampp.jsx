"use client";
import React from "react";
import LoginComponent from "../UserLogin";

export function LampDemo1() {
  return (
    <div className="min-h-screen w-screen bg-slate-950 flex">
      {/* Left side - Brand panel */}
      <div className="hidden lg:flex flex-1 flex-col justify-center items-center bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 relative overflow-hidden">
        {/* Subtle glow effect */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-blue-600/8 rounded-full blur-[120px]" />
        <div className="absolute top-1/3 left-1/3 w-[300px] h-[300px] bg-indigo-600/6 rounded-full blur-[100px]" />
        
        <div className="relative z-10 text-center px-12">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-2xl font-black text-white mx-auto mb-6 shadow-xl shadow-blue-500/20">
            W
          </div>
          <h1 className="text-4xl font-extrabold text-white tracking-tight mb-3">
            Workstream
          </h1>
          <p className="text-slate-400 text-sm leading-relaxed max-w-xs mx-auto mb-10">
            The modern project management platform built for teams that ship fast.
          </p>

          {/* Feature highlights */}
          <div className="space-y-3 text-left max-w-xs mx-auto mt-4">
            {[
              { text: "Sprint insights & real-time analytics" },
              { text: "Inline task discussions & comments" },
              { text: "One-click status transitions" },
              { text: "Team workload visibility" },
            ].map((feature, i) => (
              <div key={i} className="flex items-center gap-2 text-sm">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0" />
                <span className="text-slate-350">{feature.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right side - Login form */}
      <div className="flex-1 flex flex-col justify-center items-center px-6">
        {/* Mobile-only brand */}
        <div className="lg:hidden flex items-center gap-2 mb-8">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-sm font-black text-white">W</div>
          <span className="text-lg font-bold text-white">Workstream</span>
        </div>
        <LoginComponent />
      </div>
    </div>
  );
}
