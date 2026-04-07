'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  Tv,
  Film,
  Tag,
  Download,
  Users,
  BarChart3,
  LogOut,
} from 'lucide-react';

interface User {
  id: string;
  email: string;
  role: string;
}

export default function AdminSidebar({ user }: { user: User }) {
  const pathname = usePathname();

  const menuItems = [
    {
      icon: LayoutDashboard,
      label: 'Dashboard',
      href: '/admin',
    },
    {
      icon: Tv,
      label: 'Animes',
      href: '/admin/animes',
    },
    {
      icon: Film,
      label: 'Episodes',
      href: '/admin/episodes',
    },
    {
      icon: Tag,
      label: 'Genres',
      href: '/admin/genres',
    },
    {
      icon: Download,
      label: 'Downloads',
      href: '/admin/downloads',
    },
    ...(user.role === 'admin'
      ? [
          {
            icon: Users,
            label: 'Users',
            href: '/admin/users',
          },
          {
            icon: BarChart3,
            label: 'Analytics',
            href: '/admin/analytics',
          },
        ]
      : []),
  ];

  return (
    <div className="w-64 bg-card border-r border-border flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-border">
        <h1 className="text-2xl font-bold">MugeAnime</h1>
        <p className="text-xs text-muted-foreground mt-1">Admin Dashboard</p>
      </div>

      {/* Menu */}
      <nav className="flex-1 px-3 py-6 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/');

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 px-4 py-2 rounded-lg transition-colors',
                isActive
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:text-foreground hover:bg-accent'
              )}
            >
              <Icon className="w-5 h-5" />
              <span className="text-sm font-medium">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* User Info */}
      <div className="p-6 border-t border-border space-y-4">
        <div>
          <p className="text-xs text-muted-foreground">Logged in as</p>
          <p className="text-sm font-medium truncate">{user.email}</p>
          <p className="text-xs text-muted-foreground capitalize">{user.role}</p>
        </div>
        <form
          action={async () => {
            'use server';
            const { createClient } = await import('@/lib/supabase/server');
            const supabase = await createClient();
            await supabase.auth.signOut();
            // This will redirect after sign out
          }}
        >
          <button
            type="submit"
            className="w-full flex items-center gap-2 px-4 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-accent rounded-lg transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </form>
      </div>
    </div>
  );
}
