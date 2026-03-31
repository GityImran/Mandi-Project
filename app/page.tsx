"use client";

import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from "recharts";
import { 
  Database, 
  MapPin, 
  Sprout, 
  TrendingUp, 
  History, 
  ArrowRight,
  RefreshCcw 
} from "lucide-react";

interface StatsData {
  overview: {
    total_records: number;
    distinct_crops: number;
    distinct_districts: number;
  };
  crop_stats: {
    crop: string;
    avg_price: number;
    searches: number;
  }[];
  recent_queries: {
    crop: string;
    district: string;
    price: number;
    timestamp: string;
  }[];
}

const COLORS = ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444', '#14b8a6', '#f43f5e', '#6366f1'];

export default function Dashboard() {
  const [stats, setStats] = useState<StatsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch("http://localhost:8000/api/stats");
      if (!res.ok) throw new Error("Failed to fetch stats");
      const data = await res.json();
      setStats(data);
    } catch (err: any) {
      setError(err.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  if (loading && !stats) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-zinc-950 text-white font-sans">
        <div className="animate-spin text-blue-500 mb-4">
          <RefreshCcw size={32} />
        </div>
        <p className="text-zinc-400">Loading Dashboard Data...</p>
      </div>
    );
  }

  if (error && !stats) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-zinc-950 text-white font-sans">
        <div className="bg-red-500/10 border border-red-500/50 text-red-400 p-6 rounded-xl max-w-md text-center">
          <p className="mb-4">Could not connect to the backend server.</p>
          <p className="text-sm opacity-80 mb-6">{error}</p>
          <button 
            onClick={fetchStats}
            className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-white rounded-lg transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#09090b] text-zinc-100 font-sans p-6 md:p-10 selection:bg-blue-500/30">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header */}
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-4xl font-bold tracking-tight text-white mb-2">
              Market Intelligence
            </h1>
            <p className="text-zinc-400 text-lg">
              Real-time analytics and insights for Mandi crop prices
            </p>
          </div>
          <button 
            onClick={fetchStats}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 rounded-lg text-sm text-zinc-300 transition-colors disabled:opacity-50"
          >
            <RefreshCcw size={16} className={loading ? "animate-spin" : ""} />
            Refresh Data
          </button>
        </header>

        {/* Top Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-zinc-900/50 border border-zinc-800/80 p-6 rounded-2xl flex items-center gap-5 relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="p-4 bg-blue-500/10 text-blue-400 rounded-xl">
              <Database size={28} />
            </div>
            <div>
              <p className="text-sm text-zinc-400 font-medium mb-1">Total Records</p>
              <h3 className="text-3xl font-bold text-white">
                {stats?.overview.total_records.toLocaleString() || 0}
              </h3>
            </div>
          </div>

          <div className="bg-zinc-900/50 border border-zinc-800/80 p-6 rounded-2xl flex items-center gap-5 relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="p-4 bg-emerald-500/10 text-emerald-400 rounded-xl">
              <Sprout size={28} />
            </div>
            <div>
              <p className="text-sm text-zinc-400 font-medium mb-1">Crops Tracked</p>
              <h3 className="text-3xl font-bold text-white">
                {stats?.overview.distinct_crops.toLocaleString() || 0}
              </h3>
            </div>
          </div>

          <div className="bg-zinc-900/50 border border-zinc-800/80 p-6 rounded-2xl flex items-center gap-5 relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="p-4 bg-purple-500/10 text-purple-400 rounded-xl">
              <MapPin size={28} />
            </div>
            <div>
              <p className="text-sm text-zinc-400 font-medium mb-1">Districts Covered</p>
              <h3 className="text-3xl font-bold text-white">
                {stats?.overview.distinct_districts.toLocaleString() || 0}
              </h3>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Chart Section */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-zinc-900/50 border border-zinc-800/80 p-6 rounded-2xl">
              <div className="flex items-center gap-2 mb-6 text-zinc-100">
                <TrendingUp size={20} className="text-blue-400" />
                <h2 className="text-xl font-semibold">Average Prices by Crop</h2>
              </div>
              <div className="h-[340px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={stats?.crop_stats || []} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#27272a" />
                    <XAxis 
                      dataKey="crop" 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fill: '#a1a1aa', fontSize: 13 }} 
                      dy={10}
                    />
                    <YAxis 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fill: '#a1a1aa', fontSize: 13 }}
                      tickFormatter={(val) => `₹${val}`}
                    />
                    <Tooltip
                      cursor={{ fill: '#27272a', opacity: 0.4 }}
                      contentStyle={{ backgroundColor: '#18181b', border: '1px solid #27272a', borderRadius: '12px' }}
                      itemStyle={{ color: '#e4e4e7' }}
                    />
                    <Bar 
                      dataKey="avg_price" 
                      fill="#3b82f6" 
                      radius={[6, 6, 0, 0]}
                      name="Average Price (₹)"
                      barSize={40}
                    >
                      {stats?.crop_stats.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-zinc-900/50 border border-zinc-800/80 p-6 rounded-2xl">
              <div className="flex items-center gap-2 mb-6 text-zinc-100">
                <Database size={20} className="text-emerald-400" />
                <h2 className="text-xl font-semibold">Most Searched Crops</h2>
              </div>
              <div className="h-[280px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={stats?.crop_stats || []}
                      cx="50%"
                      cy="50%"
                      innerRadius={80}
                      outerRadius={110}
                      paddingAngle={5}
                      dataKey="searches"
                      nameKey="crop"
                    >
                      {stats?.crop_stats.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#18181b', border: '1px solid #27272a', borderRadius: '12px' }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-zinc-900/50 border border-zinc-800/80 rounded-2xl h-full flex flex-col overflow-hidden">
              <div className="p-6 border-b border-zinc-800/80 flex items-center gap-2 bg-zinc-900/80">
                <History size={20} className="text-purple-400" />
                <h2 className="text-xl font-semibold text-zinc-100">Recent Queries</h2>
              </div>
              <div className="flex-1 overflow-auto p-4 space-y-3">
                {stats?.recent_queries?.length ? (
                  stats.recent_queries.map((query, i) => (
                    <div 
                      key={i} 
                      className="p-4 rounded-xl bg-zinc-800/30 border border-zinc-800/50 hover:bg-zinc-800/50 transition-colors"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <span className="font-semibold text-zinc-200">{query.crop}</span>
                        <span className="text-emerald-400 font-medium">₹{query.price}</span>
                      </div>
                      <div className="flex justify-between items-center text-sm text-zinc-500">
                        <span className="flex items-center gap-1">
                          <MapPin size={12} />
                          {query.district}
                        </span>
                        <span className="text-xs shrink-0">
                          {query.timestamp ? new Date(query.timestamp).toLocaleDateString(undefined, {
                            month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
                          }) : 'Just now'}
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-zinc-500 py-10">
                    <History size={32} className="mb-3 opacity-20" />
                    <p>No recent activity</p>
                  </div>
                )}
              </div>
              {stats?.recent_queries?.length ? (
                <div className="p-4 border-t border-zinc-800/80 text-center">
                  <a href="#" className="text-sm text-blue-400 hover:text-blue-300 inline-flex items-center gap-1">
                    View full history <ArrowRight size={14} />
                  </a>
                </div>
              ) : null}
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
}
