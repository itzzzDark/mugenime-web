import { Button } from '@/components/ui/button';
import AnimesList from '@/components/admin/animes-list';
import Link from 'next/link';
import { Plus } from 'lucide-react';

export const metadata = {
  title: 'Manage Animes - Admin Dashboard',
  description: 'Create, read, update, delete anime entries',
};

export default function AnimesPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Animes</h1>
          <p className="text-muted-foreground mt-1">Manage all anime entries in the database</p>
        </div>
        <Link href="/admin/animes/create">
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Add Anime
          </Button>
        </Link>
      </div>

      <AnimesList />
    </div>
  );
}
