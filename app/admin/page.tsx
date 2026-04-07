'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

interface Stats {
  totalAnimes: number;
  totalEpisodes: number;
  totalUsers: number;
  totalGenres: number;
  totalViews: number;
}

interface Anime {
  id: string;
  title: string;
  created_at: string;
}

interface Analytics {
  anime_id: string;
  views: number;
  animes?: { title: string };
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [recentAnimes, setRecentAnimes] = useState<Anime[]>([]);
  const [popularAnimes, setPopularAnimes] = useState<Analytics[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/stats');
      if (response.ok) {
        const data = await response.json();
        setStats(data.stats);
        setRecentAnimes(data.recentAnimes);
        setPopularAnimes(data.popularAnimes);
      }
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  const chartData = popularAnimes.map(item => ({
    name: (item.animes as any)?.title || 'Unknown',
    views: item.views,
  }));

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">Welcome to the admin panel. Here&apos;s an overview of your platform.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <StatCard label="Total Animes" value={stats?.totalAnimes || 0} />
        <StatCard label="Total Episodes" value={stats?.totalEpisodes || 0} />
        <StatCard label="Total Users" value={stats?.totalUsers || 0} />
        <StatCard label="Total Genres" value={stats?.totalGenres || 0} />
        <StatCard label="Total Views" value={stats?.totalViews || 0} />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Popular Animes Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Popular Animes</CardTitle>
            <CardDescription>Top animes by view count</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
                <YAxis />
                <Tooltip />
                <Bar dataKey="views" fill="#4f39f6" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Stats Overview */}
        <Card>
          <CardHeader>
            <CardTitle>Stats Overview</CardTitle>
            <CardDescription>Platform statistics</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-primary/5 rounded-lg">
                <span>Animes per Episode</span>
                <span className="font-bold">{stats?.totalEpisodes ? (stats.totalEpisodes / stats.totalAnimes).toFixed(1) : 0}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-secondary rounded-lg">
                <span>Avg Views per Anime</span>
                <span className="font-bold">{stats?.totalAnimes ? Math.round(stats.totalViews / stats.totalAnimes) : 0}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-primary/5 rounded-lg">
                <span>Active Genres</span>
                <span className="font-bold">{stats?.totalGenres || 0}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-secondary rounded-lg">
                <span>Registered Users</span>
                <span className="font-bold">{stats?.totalUsers || 0}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Animes */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Animes</CardTitle>
            <CardDescription>Latest anime additions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentAnimes.length > 0 ? (
                recentAnimes.map((anime) => (
                  <div key={anime.id} className="flex justify-between items-center p-3 bg-secondary rounded-lg">
                    <span className="text-sm">{anime.title}</span>
                    <span className="text-xs text-muted-foreground">
                      {new Date(anime.created_at).toLocaleDateString()}
                    </span>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">No recent animes</p>
              )}
              <Button asChild className="w-full mt-4">
                <Link href="/admin/animes">View All Animes</Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common admin tasks</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button asChild variant="outline" className="w-full justify-start">
              <Link href="/admin/animes">Add New Anime</Link>
            </Button>
            <Button asChild variant="outline" className="w-full justify-start">
              <Link href="/admin/episodes">Manage Episodes</Link>
            </Button>
            <Button asChild variant="outline" className="w-full justify-start">
              <Link href="/admin/users">Manage Users</Link>
            </Button>
            <Button asChild variant="outline" className="w-full justify-start">
              <Link href="/admin/analytics">View Analytics</Link>
            </Button>
            <Button asChild variant="outline" className="w-full justify-start">
              <Link href="/admin/audit-logs">Audit Logs</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{label}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value.toLocaleString()}</div>
      </CardContent>
    </Card>
  );
}
