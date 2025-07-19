"use client";

import { useState, useEffect } from "react";
import { 
  Activity, 
  TrendingUp, 
  Users, 
  Code, 
  BookOpen, 
  Star,
  AlertCircle,
  CheckCircle,
  Clock,
  Zap
} from "lucide-react";

interface SystemStats {
  totalScripts: number;
  activeScripts: number;
  totalChapters: number;
  completedChapters: number;
  totalTemplates: number;
  systemHealth: number;
  uptime: string;
  lastUpdate: Date;
}

const Dashboard = () => {
  const [stats, setStats] = useState<SystemStats>({
    totalScripts: 10,
    activeScripts: 9,
    totalChapters: 44,
    completedChapters: 8,
    totalTemplates: 25,
    systemHealth: 98,
    uptime: "99.9%",
    lastUpdate: new Date()
  });

  const [recentActivity] = useState([
    { id: 1, type: "script", action: "Updated BTMM_Master_Controller", time: "2 minutes ago", status: "success" },
    { id: 2, type: "chapter", action: "Completed EMA Food System", time: "1 hour ago", status: "success" },
    { id: 3, type: "template", action: "Downloaded Stop Hunt Detector", time: "3 hours ago", status: "info" },
    { id: 4, type: "system", action: "System health check passed", time: "6 hours ago", status: "success" },
    { id: 5, type: "script", action: "Created new BTMM indicator", time: "1 day ago", status: "success" }
  ]);

  const [marketData] = useState({
    signalAccuracy: 94.7,
    winRate: 78.3,
    profitFactor: 2.47,
    maxDrawdown: 8.2,
    totalReturn: 247.6,
    sharpeRatio: 1.89
  });

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setStats(prev => ({
        ...prev,
        systemHealth: Math.max(95, Math.min(100, prev.systemHealth + (Math.random() - 0.5) * 2)),
        lastUpdate: new Date()
      }));
    }, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, []);

  const getHealthColor = (health: number) => {
    if (health >= 95) return "text-green-400";
    if (health >= 85) return "text-yellow-400";
    return "text-red-400";
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "script": return <Code className="h-4 w-4" />;
      case "chapter": return <BookOpen className="h-4 w-4" />;
      case "template": return <Star className="h-4 w-4" />;
      case "system": return <Activity className="h-4 w-4" />;
      default: return <AlertCircle className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "success": return "text-green-400";
      case "warning": return "text-yellow-400";
      case "error": return "text-red-400";
      default: return "text-blue-400";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                BTMM Dashboard
              </h1>
              <p className="text-gray-300 text-lg">
                Comprehensive overview of your BTMM trading platform
              </p>
            </div>
            <div className="text-right">
              <div className={`text-2xl font-bold ${getHealthColor(stats.systemHealth)}`}>
                {stats.systemHealth.toFixed(1)}%
              </div>
              <div className="text-sm text-gray-400">System Health</div>
            </div>
          </div>
        </div>

        {/* Main Stats Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-gray-800/50 p-6 rounded-xl border border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Pine Scripts</h3>
              <Code className="h-6 w-6 text-blue-400" />
            </div>
            <div className="space-y-2">
              <div className="text-3xl font-bold text-blue-400">
                {stats.activeScripts}/{stats.totalScripts}
              </div>
              <div className="text-sm text-gray-400">Active Scripts</div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div 
                  className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${(stats.activeScripts / stats.totalScripts) * 100}%` }}
                />
              </div>
            </div>
          </div>

          <div className="bg-gray-800/50 p-6 rounded-xl border border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Workbook Progress</h3>
              <BookOpen className="h-6 w-6 text-green-400" />
            </div>
            <div className="space-y-2">
              <div className="text-3xl font-bold text-green-400">
                {stats.completedChapters}/{stats.totalChapters}
              </div>
              <div className="text-sm text-gray-400">Chapters Completed</div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div 
                  className="bg-green-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${(stats.completedChapters / stats.totalChapters) * 100}%` }}
                />
              </div>
            </div>
          </div>

          <div className="bg-gray-800/50 p-6 rounded-xl border border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Templates</h3>
              <Star className="h-6 w-6 text-yellow-400" />
            </div>
            <div className="space-y-2">
              <div className="text-3xl font-bold text-yellow-400">
                {stats.totalTemplates}
              </div>
              <div className="text-sm text-gray-400">Available Templates</div>
              <div className="text-xs text-green-400">
                +5 added this week
              </div>
            </div>
          </div>

          <div className="bg-gray-800/50 p-6 rounded-xl border border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">System Uptime</h3>
              <Zap className="h-6 w-6 text-purple-400" />
            </div>
            <div className="space-y-2">
              <div className="text-3xl font-bold text-purple-400">
                {stats.uptime}
              </div>
              <div className="text-sm text-gray-400">Last 30 Days</div>
              <div className="text-xs text-green-400">
                Excellent Performance
              </div>
            </div>
          </div>
        </div>

        {/* Trading Performance */}
        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          <div className="bg-gray-800/50 p-6 rounded-xl border border-gray-700">
            <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
              <TrendingUp className="h-6 w-6 text-green-400" />
              Trading Performance
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 bg-gray-700/50 rounded-lg">
                <div className="text-2xl font-bold text-green-400 mb-1">
                  {marketData.signalAccuracy}%
                </div>
                <div className="text-sm text-gray-400">Signal Accuracy</div>
              </div>
              <div className="text-center p-4 bg-gray-700/50 rounded-lg">
                <div className="text-2xl font-bold text-blue-400 mb-1">
                  {marketData.winRate}%
                </div>
                <div className="text-sm text-gray-400">Win Rate</div>
              </div>
              <div className="text-center p-4 bg-gray-700/50 rounded-lg">
                <div className="text-2xl font-bold text-purple-400 mb-1">
                  {marketData.profitFactor}
                </div>
                <div className="text-sm text-gray-400">Profit Factor</div>
              </div>
              <div className="text-center p-4 bg-gray-700/50 rounded-lg">
                <div className="text-2xl font-bold text-yellow-400 mb-1">
                  +{marketData.totalReturn}%
                </div>
                <div className="text-sm text-gray-400">Total Return</div>
              </div>
            </div>
          </div>

          <div className="bg-gray-800/50 p-6 rounded-xl border border-gray-700">
            <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
              <Activity className="h-6 w-6 text-blue-400" />
              Recent Activity
            </h3>
            <div className="space-y-4">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-center gap-3 p-3 bg-gray-700/30 rounded-lg">
                  <div className={`${getStatusColor(activity.status)}`}>
                    {getActivityIcon(activity.type)}
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-medium text-white">
                      {activity.action}
                    </div>
                    <div className="text-xs text-gray-400">
                      {activity.time}
                    </div>
                  </div>
                  <div className="text-xs text-gray-500 capitalize">
                    {activity.type}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* System Status */}
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="bg-gray-800/50 p-6 rounded-xl border border-gray-700">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-400" />
              System Status
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-300">Pine Scripts</span>
                <span className="text-sm text-green-400">✓ Operational</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-300">Script Manager</span>
                <span className="text-sm text-green-400">✓ Operational</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-300">Templates</span>
                <span className="text-sm text-green-400">✓ Operational</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-300">Workbook</span>
                <span className="text-sm text-green-400">✓ Operational</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-300">Database</span>
                <span className="text-sm text-green-400">✓ Connected</span>
              </div>
            </div>
          </div>

          <div className="bg-gray-800/50 p-6 rounded-xl border border-gray-700">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Users className="h-5 w-5 text-blue-400" />
              Quick Stats
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-300">Active Sessions</span>
                <span className="text-sm text-blue-400">1</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-300">Scripts Deployed</span>
                <span className="text-sm text-blue-400">{stats.activeScripts}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-300">Templates Used</span>
                <span className="text-sm text-blue-400">12</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-300">Alerts Generated</span>
                <span className="text-sm text-blue-400">247</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-300">Study Time</span>
                <span className="text-sm text-blue-400">23.5h</span>
              </div>
            </div>
          </div>

          <div className="bg-gray-800/50 p-6 rounded-xl border border-gray-700">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Clock className="h-5 w-5 text-purple-400" />
              System Info
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-300">Version</span>
                <span className="text-sm text-purple-400">v2.1.0</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-300">Platform</span>
                <span className="text-sm text-purple-400">Next.js 14</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-300">Last Update</span>
                <span className="text-sm text-purple-400">
                  {stats.lastUpdate.toLocaleTimeString()}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-300">Environment</span>
                <span className="text-sm text-purple-400">Production</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-300">Health Score</span>
                <span className={`text-sm font-medium ${getHealthColor(stats.systemHealth)}`}>
                  {stats.systemHealth.toFixed(1)}%
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;