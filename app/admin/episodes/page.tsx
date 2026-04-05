import { Button } from '@/components/ui/button';
import EpisodesList from '@/components/admin/episodes-list';
import Link from 'next/link';
import { Plus } from 'lucide-react';

export const metadata = {
  title: 'Manage Episodes - Admin Dashboard',
  description: 'Create and manage anime episodes',
};

export default function EpisodesPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Episodes</h1>
          <p className="text-muted-foreground mt-1">Manage anime episodes and streaming links</p>
        </div>
        <Button asChild>
          <Link href="/admin/episodes/create">
            <Plus className="w-4 h-4 mr-2" />
            Add Episode
          </Link>
        </Button>
      </div>

      <EpisodesList />
    </div>
  );
}
