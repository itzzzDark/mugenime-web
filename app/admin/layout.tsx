'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAdmin } from '@/lib/admin-context';
import { Button } from '@/components/ui/button';
import {
  BarChart3,
  BookOpen,
  FileText,
  Gauge,
  LogOut,
  Menu,
  Settings,
  Users,
  X,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface NavItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  requiredRole?: 'admin' | 'editor' | 'viewer';
}

const NAV_ITEMS: NavItem[] = [
  { name: 'Dashboard', href: '/admin', icon: Gauge, requiredRole: 'viewer' },
  { name: 'Animes', href: '/admin/animes', icon: BookOpen, requiredRole: 'editor' },
  { name: 'Episodes', href: '/admin/episodes', icon: FileText, requiredRole: 'editor' },
  { name: 'Genres', href: '/admin/genres', icon: FileText, requiredRole: 'editor' },
  { name: 'Links', href: '/admin/links', icon: BarChart3, requiredRole: 'editor' },
  { name: 'Users', href: '/admin/users', icon: Users, requiredRole: 'admin' },
  { name: 'Analytics', href: '/admin/analytics', icon: BarChart3, requiredRole: 'viewer' },
  { name: 'Audit Logs', href: '/admin/audit-logs', icon: FileText, requiredRole: 'admin' },
  { name: 'Settings', href: '/admin/settings', icon: Settings, requiredRole: 'admin' },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { isAdmin, loading, role } = useAdmin();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-muted-foreground">Loading admin panel...</p>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center space-y-4">
          <h1 className="text-2xl font-bold">Access Denied</h1>
          <p className="text-muted-foreground">You do not have permission to access the admin panel.</p>
          <Button asChild>
            <Link href="/">Go Home</Link>
          </Button>
        </div>
      </div>
    );
  }

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/');
    router.refresh();
  };

  const canAccess = (requiredRole?: string) => {
    if (!requiredRole) return true;
    if (role === 'admin') return true;
    if (role === 'editor' && requiredRole !== 'admin') return true;
    if (role === 'viewer' && (requiredRole === 'viewer')) return true;
    return false;
  };

  return (
    <div className="flex h-screen bg-background">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed md:relative w-64 h-screen bg-secondary border-r border-border flex flex-col z-50 md:z-0 transition-transform duration-300',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        )}
      >
        <div className="p-6 border-b border-border flex items-center justify-between">
          <h1 className="text-xl font-bold">Admin Panel</h1>
          <button
            onClick={() => setSidebarOpen(false)}
            className="md:hidden"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto p-4 space-y-2">
          {NAV_ITEMS.map((item) => {
            if (!canAccess(item.requiredRole)) return null;
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-background transition-colors"
              >
                <Icon className="w-5 h-5" />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-border space-y-2">
          <Button
            onClick={handleLogout}
            variant="ghost"
            className="w-full justify-start gap-3"
          >
            <LogOut className="w-5 h-5" />
            Sign Out
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <header className="bg-background border-b border-border px-6 py-4 flex items-center justify-between">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="md:hidden"
          >
            <Menu className="w-6 h-6" />
          </button>
          <h2 className="text-sm font-medium text-muted-foreground">Admin Dashboard</h2>
          <div className="flex items-center gap-2">
            <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">
              {role?.toUpperCase()}
            </span>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 overflow-auto">
          <div className="p-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
