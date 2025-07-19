"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { TrendingUp, Activity, Code, BookOpen, FileText } from "lucide-react";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to dashboard after a brief moment to show landing
    const timer = setTimeout(() => {
      router.push("/dashboard");
    }, 2000);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white flex items-center justify-center">
      <div className="text-center max-w-4xl mx-auto px-6">
        {/* Logo and Brand */}
        <div className="mb-8">
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-4 rounded-2xl">
              <TrendingUp className="h-12 w-12 text-white" />
            </div>
            <div className="text-left">
              <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                BTMM System
              </h1>
              <p className="text-xl text-gray-300 font-medium">TradingView Script Manager</p>
            </div>
          </div>
          
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Complete Beat The Market Makers trading platform with Pine Script management, 
            comprehensive workbook, and professional templates
          </p>
        </div>

        {/* Feature Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <div className="bg-gray-800/50 p-6 rounded-xl border border-gray-700">
            <Activity className="h-8 w-8 text-blue-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Live Dashboard</h3>
            <p className="text-gray-400 text-sm">Real-time system overview and performance metrics</p>
          </div>
          
          <div className="bg-gray-800/50 p-6 rounded-xl border border-gray-700">
            <Code className="h-8 w-8 text-green-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Script Manager</h3>
            <p className="text-gray-400 text-sm">Monaco Editor for Pine Script development</p>
          </div>
          
          <div className="bg-gray-800/50 p-6 rounded-xl border border-gray-700">
            <BookOpen className="h-8 w-8 text-yellow-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">44-Chapter Workbook</h3>
            <p className="text-gray-400 text-sm">Complete BTMM methodology training</p>
          </div>
          
          <div className="bg-gray-800/50 p-6 rounded-xl border border-gray-700">
            <FileText className="h-8 w-8 text-purple-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Templates Library</h3>
            <p className="text-gray-400 text-sm">Pre-built BTMM Pine Script templates</p>
          </div>
        </div>

        {/* Loading Indicator */}
        <div className="flex items-center justify-center gap-3">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
          <span className="text-gray-400">Loading BTMM System...</span>
        </div>

        {/* Version Info */}
        <div className="mt-8 text-sm text-gray-500">
          Version 2.1.0 • Next.js 14 • TypeScript • TailwindCSS
        </div>
      </div>
    </div>
  );
}
