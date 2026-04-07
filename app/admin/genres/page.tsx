'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Loader2, Plus, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

interface Genre {
  id: string;
  name: string;
  created_at: string;
}

export default function GenreManagement() {
  const [genres, setGenres] = useState<Genre[]>([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [newGenre, setNewGenre] = useState('');

  useEffect(() => {
    fetchGenres();
  }, []);

  const fetchGenres = async () => {
    try {
      setLoading(true);
      const { createClient } = await import('@/lib/supabase/client');
      const supabase = createClient();

      const { data, error } = await supabase
        .from('genres')
        .select('id, name, created_at')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setGenres(data || []);
    } catch (error) {
      toast.error('Failed to fetch genres');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddGenre = async () => {
    if (!newGenre.trim()) return;
    try {
      const { createClient } = await import('@/lib/supabase/client');
      const supabase = createClient();

      const { error } = await supabase
        .from('genres')
        .insert([{ name: newGenre }]);

      if (error) throw error;
      toast.success('Genre added successfully');
      setNewGenre('');
      setOpenDialog(false);
      fetchGenres();
    } catch (error) {
      toast.error('Error adding genre');
      console.error(error);
    }
  };

  const handleDeleteGenre = async (id: string) => {
    if (!confirm('Delete this genre?')) return;
    try {
      const { createClient } = await import('@/lib/supabase/client');
      const supabase = createClient();

      const { error } = await supabase
        .from('genres')
        .delete()
        .eq('id', id);

      if (error) throw error;
      toast.success('Genre deleted successfully');
      fetchGenres();
    } catch (error) {
      toast.error('Error deleting genre');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Genre Management</h1>
          <p className="text-muted-foreground">Manage anime genres and categories</p>
        </div>
        <Dialog open={openDialog} onOpenChange={setOpenDialog}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Add Genre
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Genre</DialogTitle>
              <DialogDescription>Create a new anime genre</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <Input
                value={newGenre}
                onChange={(e) => setNewGenre(e.target.value)}
                placeholder="Genre name (e.g., Action, Drama, Comedy)"
                onKeyDown={(e) => e.key === 'Enter' && handleAddGenre()}
              />
              <Button onClick={handleAddGenre} className="w-full">
                Add Genre
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Genres Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {genres.map((genre) => (
          <Card key={genre.id}>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle>{genre.name}</CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDeleteGenre(genre.id)}
                  className="text-destructive hover:text-destructive"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground">
                Added {new Date(genre.created_at).toLocaleDateString()}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {genres.length === 0 && (
        <Card>
          <CardContent className="py-12">
            <p className="text-center text-muted-foreground">No genres found</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
