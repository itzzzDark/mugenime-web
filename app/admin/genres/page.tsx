import { Button } from '@/components/ui/button';
import GenresList from '@/components/admin/genres-list';
import Link from 'next/link';
import { Plus } from 'lucide-react';

export const metadata = {
  title: 'Manage Genres - Admin Dashboard',
  description: 'Create and manage anime genres',
};

export default function GenresPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Genres</h1>
          <p className="text-muted-foreground mt-1">Manage anime genres and categories</p>
        </div>
        <Button asChild>
          <Link href="/admin/genres/create">
            <Plus className="w-4 h-4 mr-2" />
            Add Genre
          </Link>
        </Button>
      </div>

      <GenresList />
    </div>
  );
}
