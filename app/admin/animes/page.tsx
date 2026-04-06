'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Loader2, Plus, Trash2, Edit2 } from 'lucide-react';
import { toast } from 'sonner';
import Link from 'next/link';

interface Anime {
  id: string;
  title: string;
  description: string;
  type: string;
  status: string;
  episode_count: number;
  studios: string;
  created_at: string;
}

export default function AnimeManagement() {
  const [animes, setAnimes] = useState<Anime[]>([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'TV',
    status: 'ongoing',
    episode_count: 0,
    studios: '',
  });

  useEffect(() => {
    fetchAnimes();
  }, []);

  const fetchAnimes = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/animes');
      if (response.ok) {
        const data = await response.json();
        setAnimes(data.animes);
      }
    } catch (error) {
      toast.error('Failed to fetch animes');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddAnime = async () => {
    try {
      const response = await fetch('/api/admin/animes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        toast.success('Anime added successfully');
        setFormData({
          title: '',
          description: '',
          type: 'TV',
          status: 'ongoing',
          episode_count: 0,
          studios: '',
        });
        setOpenDialog(false);
        fetchAnimes();
      } else {
        toast.error('Failed to add anime');
      }
    } catch (error) {
      toast.error('Error adding anime');
      console.error(error);
    }
  };

  const handleDeleteAnime = async (id: string) => {
    if (!confirm('Are you sure you want to delete this anime?')) return;

    try {
      const response = await fetch(`/api/admin/animes/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        toast.success('Anime deleted successfully');
        fetchAnimes();
      } else {
        toast.error('Failed to delete anime');
      }
    } catch (error) {
      toast.error('Error deleting anime');
      console.error(error);
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
          <h1 className="text-3xl font-bold">Anime Management</h1>
          <p className="text-muted-foreground">Create, edit, and manage anime entries</p>
        </div>
        <Dialog open={openDialog} onOpenChange={setOpenDialog}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Add Anime
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Add New Anime</DialogTitle>
              <DialogDescription>Create a new anime entry</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Title</label>
                <Input
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Anime title"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Description</label>
                <Input
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Short description"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Type</label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    className="w-full px-3 py-2 border border-border rounded-md bg-background"
                  >
                    <option>TV</option>
                    <option>Movie</option>
                    <option>OVA</option>
                    <option>Special</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium">Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full px-3 py-2 border border-border rounded-md bg-background"
                  >
                    <option>ongoing</option>
                    <option>completed</option>
                    <option>upcoming</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium">Episodes</label>
                <Input
                  type="number"
                  value={formData.episode_count}
                  onChange={(e) => setFormData({ ...formData, episode_count: parseInt(e.target.value) })}
                  placeholder="0"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Studios</label>
                <Input
                  value={formData.studios}
                  onChange={(e) => setFormData({ ...formData, studios: e.target.value })}
                  placeholder="Studio name"
                />
              </div>
              <Button onClick={handleAddAnime} className="w-full">
                Add Anime
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Table */}
      <Card>
        <CardHeader>
          <CardTitle>Anime List</CardTitle>
          <CardDescription>Showing {animes.length} animes</CardDescription>
        </CardHeader>
        <CardContent>
          {animes.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="px-4 py-2 text-left font-medium">Title</th>
                    <th className="px-4 py-2 text-left font-medium">Type</th>
                    <th className="px-4 py-2 text-left font-medium">Status</th>
                    <th className="px-4 py-2 text-left font-medium">Episodes</th>
                    <th className="px-4 py-2 text-left font-medium">Studio</th>
                    <th className="px-4 py-2 text-left font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {animes.map((anime) => (
                    <tr key={anime.id} className="border-b border-border hover:bg-secondary/50">
                      <td className="px-4 py-2">{anime.title}</td>
                      <td className="px-4 py-2">
                        <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">
                          {anime.type}
                        </span>
                      </td>
                      <td className="px-4 py-2">
                        <span className={`text-xs px-2 py-1 rounded ${
                          anime.status === 'ongoing' ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-200' :
                          anime.status === 'completed' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200' :
                          'bg-gray-100 text-gray-700 dark:bg-gray-900 dark:text-gray-200'
                        }`}>
                          {anime.status}
                        </span>
                      </td>
                      <td className="px-4 py-2">{anime.episode_count}</td>
                      <td className="px-4 py-2">{anime.studios || '-'}</td>
                      <td className="px-4 py-2">
                        <div className="flex gap-2">
                          <Button
                            asChild
                            variant="ghost"
                            size="sm"
                          >
                            <Link href={`/admin/animes/${anime.id}`}>
                              <Edit2 className="w-4 h-4" />
                            </Link>
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteAnime(anime.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-center text-muted-foreground py-8">No animes found</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
