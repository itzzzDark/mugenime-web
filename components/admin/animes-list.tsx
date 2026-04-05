'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Edit2, Trash2, Loader2 } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

interface Anime {
  id: string;
  title: string;
  slug: string;
  status: string;
  type: string;
  episodes_count: number;
  score: number;
  year: number;
  is_active: boolean;
  created_at: string;
}

export default function AnimesList() {
  const router = useRouter();
  const [animes, setAnimes] = useState<Anime[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    fetchAnimes();
  }, []);

  const fetchAnimes = async () => {
    try {
      const response = await fetch('/api/animes?includeInactive=true');
      if (!response.ok) throw new Error('Failed to fetch');
      const data = await response.json();
      setAnimes(data);
    } catch (error) {
      console.error('Error fetching animes:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;

    setDeleting(true);
    try {
      const response = await fetch(`/api/animes/${deleteId}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete');

      setAnimes(animes.filter(a => a.id !== deleteId));
      setDeleteId(null);
    } catch (error) {
      console.error('Error deleting anime:', error);
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <>
      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-center">Episodes</TableHead>
              <TableHead className="text-center">Score</TableHead>
              <TableHead>Year</TableHead>
              <TableHead>Active</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {animes.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                  No animes found. Create your first anime.
                </TableCell>
              </TableRow>
            ) : (
              animes.map((anime) => (
                <TableRow key={anime.id}>
                  <TableCell className="font-medium">
                    <Link href={`/admin/animes/${anime.id}`} className="hover:underline">
                      {anime.title}
                    </Link>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{anime.type}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={anime.status === 'ongoing' ? 'default' : 'secondary'}>
                      {anime.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-center">{anime.episodes_count}</TableCell>
                  <TableCell className="text-center">{anime.score}/10</TableCell>
                  <TableCell>{anime.year}</TableCell>
                  <TableCell>
                    <Badge variant={anime.is_active ? 'default' : 'destructive'}>
                      {anime.is_active ? 'Active' : 'Inactive'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right space-x-2">
                    <Link href={`/admin/animes/${anime.id}/edit`}>
                      <Button size="sm" variant="outline">
                        <Edit2 className="h-4 w-4" />
                      </Button>
                    </Link>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => setDeleteId(anime.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <AlertDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Anime</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this anime? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="flex gap-3 justify-end">
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} disabled={deleting}>
              {deleting ? 'Deleting...' : 'Delete'}
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
