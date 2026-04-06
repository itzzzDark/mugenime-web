'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Loader2, Plus, Trash2, Edit2 } from 'lucide-react';
import { toast } from 'sonner';

interface Episode {
  id: string;
  title: string;
  anime_id: string;
  episode_number: number;
  air_date: string;
  created_at: string;
}

export default function EpisodeManagement() {
  const [episodes, setEpisodes] = useState<Episode[]>([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    anime_id: '',
    episode_number: 0,
    air_date: '',
  });

  useEffect(() => {
    fetchEpisodes();
  }, []);

  const fetchEpisodes = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/episodes');
      if (response.ok) {
        const data = await response.json();
        setEpisodes(data.episodes);
      }
    } catch (error) {
      toast.error('Failed to fetch episodes');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddEpisode = async () => {
    try {
      const response = await fetch('/api/admin/episodes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        toast.success('Episode added successfully');
        setFormData({ title: '', anime_id: '', episode_number: 0, air_date: '' });
        setOpenDialog(false);
        fetchEpisodes();
      } else {
        toast.error('Failed to add episode');
      }
    } catch (error) {
      toast.error('Error adding episode');
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
          <h1 className="text-3xl font-bold">Episode Management</h1>
          <p className="text-muted-foreground">Manage anime episodes and air dates</p>
        </div>
        <Dialog open={openDialog} onOpenChange={setOpenDialog}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Add Episode
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Episode</DialogTitle>
              <DialogDescription>Create a new episode entry</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Title</label>
                <Input
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Episode title"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Anime ID</label>
                <Input
                  value={formData.anime_id}
                  onChange={(e) => setFormData({ ...formData, anime_id: e.target.value })}
                  placeholder="Anime ID (UUID)"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Episode Number</label>
                <Input
                  type="number"
                  value={formData.episode_number}
                  onChange={(e) => setFormData({ ...formData, episode_number: parseInt(e.target.value) })}
                  placeholder="1"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Air Date</label>
                <Input
                  type="date"
                  value={formData.air_date}
                  onChange={(e) => setFormData({ ...formData, air_date: e.target.value })}
                />
              </div>
              <Button onClick={handleAddEpisode} className="w-full">
                Add Episode
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Episodes Table */}
      <Card>
        <CardHeader>
          <CardTitle>Episodes List</CardTitle>
          <CardDescription>Showing {episodes.length} episodes</CardDescription>
        </CardHeader>
        <CardContent>
          {episodes.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="px-4 py-2 text-left font-medium">Title</th>
                    <th className="px-4 py-2 text-left font-medium">Episode #</th>
                    <th className="px-4 py-2 text-left font-medium">Air Date</th>
                    <th className="px-4 py-2 text-left font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {episodes.map((episode) => (
                    <tr key={episode.id} className="border-b border-border hover:bg-secondary/50">
                      <td className="px-4 py-2">{episode.title}</td>
                      <td className="px-4 py-2">{episode.episode_number}</td>
                      <td className="px-4 py-2">{new Date(episode.air_date).toLocaleDateString()}</td>
                      <td className="px-4 py-2">
                        <div className="flex gap-2">
                          <Button variant="ghost" size="sm">
                            <Edit2 className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
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
            <p className="text-center text-muted-foreground py-8">No episodes found</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
