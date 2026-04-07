'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, ExternalLink, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface DownloadLink {
  id: string;
  episode_id: string;
  provider: string;
  quality: string;
  url: string;
}

interface StreamingLink {
  id: string;
  episode_id: string;
  server: string;
  embed_url: string;
  quality: string;
}

export default function LinksManagement() {
  const [downloadLinks, setDownloadLinks] = useState<DownloadLink[]>([]);
  const [streamingLinks, setStreamingLinks] = useState<StreamingLink[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLinks();
  }, []);

  const fetchLinks = async () => {
    try {
      setLoading(true);
      const { createClient } = await import('@/lib/supabase/client');
      const supabase = createClient();

      const [downloadRes, streamingRes] = await Promise.all([
        supabase.from('download_links').select('*'),
        supabase.from('streaming_links').select('*'),
      ]);

      if (downloadRes.error) throw downloadRes.error;
      if (streamingRes.error) throw streamingRes.error;

      setDownloadLinks(downloadRes.data || []);
      setStreamingLinks(streamingRes.data || []);
    } catch (error) {
      toast.error('Failed to fetch links');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteDownloadLink = async (id: string) => {
    if (!confirm('Delete this download link?')) return;
    try {
      const { createClient } = await import('@/lib/supabase/client');
      const supabase = createClient();

      const { error } = await supabase
        .from('download_links')
        .delete()
        .eq('id', id);

      if (error) throw error;
      toast.success('Link deleted');
      fetchLinks();
    } catch (error) {
      toast.error('Error deleting link');
    }
  };

  const handleDeleteStreamingLink = async (id: string) => {
    if (!confirm('Delete this streaming link?')) return;
    try {
      const { createClient } = await import('@/lib/supabase/client');
      const supabase = createClient();

      const { error } = await supabase
        .from('streaming_links')
        .delete()
        .eq('id', id);

      if (error) throw error;
      toast.success('Link deleted');
      fetchLinks();
    }
    } catch (error) {
      toast.error('Error deleting link');
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
      <div>
        <h1 className="text-3xl font-bold">Link Management</h1>
        <p className="text-muted-foreground">Manage download and streaming links</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Download Links</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{downloadLinks.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Streaming Links</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{streamingLinks.length}</div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="downloads" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="downloads">Download Links</TabsTrigger>
          <TabsTrigger value="streaming">Streaming Links</TabsTrigger>
        </TabsList>

        {/* Download Links */}
        <TabsContent value="downloads">
          <Card>
            <CardHeader>
              <CardTitle>Download Links</CardTitle>
              <CardDescription>Showing {downloadLinks.length} download links</CardDescription>
            </CardHeader>
            <CardContent>
              {downloadLinks.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="px-4 py-2 text-left font-medium">Provider</th>
                        <th className="px-4 py-2 text-left font-medium">Quality</th>
                        <th className="px-4 py-2 text-left font-medium">URL</th>
                        <th className="px-4 py-2 text-left font-medium">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {downloadLinks.map((link) => (
                        <tr key={link.id} className="border-b border-border hover:bg-secondary/50">
                          <td className="px-4 py-2">{link.provider}</td>
                          <td className="px-4 py-2">
                            <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">
                              {link.quality}
                            </span>
                          </td>
                          <td className="px-4 py-2 max-w-xs truncate text-xs">{link.url}</td>
                          <td className="px-4 py-2">
                            <div className="flex gap-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                asChild
                              >
                                <a href={link.url} target="_blank" rel="noopener noreferrer">
                                  <ExternalLink className="w-4 h-4" />
                                </a>
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDeleteDownloadLink(link.id)}
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
                <p className="text-center text-muted-foreground py-8">No download links found</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Streaming Links */}
        <TabsContent value="streaming">
          <Card>
            <CardHeader>
              <CardTitle>Streaming Links</CardTitle>
              <CardDescription>Showing {streamingLinks.length} streaming links</CardDescription>
            </CardHeader>
            <CardContent>
              {streamingLinks.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="px-4 py-2 text-left font-medium">Server</th>
                        <th className="px-4 py-2 text-left font-medium">Quality</th>
                        <th className="px-4 py-2 text-left font-medium">Embed URL</th>
                        <th className="px-4 py-2 text-left font-medium">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {streamingLinks.map((link) => (
                        <tr key={link.id} className="border-b border-border hover:bg-secondary/50">
                          <td className="px-4 py-2">{link.server}</td>
                          <td className="px-4 py-2">
                            <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">
                              {link.quality}
                            </span>
                          </td>
                          <td className="px-4 py-2 max-w-xs truncate text-xs">{link.embed_url}</td>
                          <td className="px-4 py-2">
                            <div className="flex gap-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                asChild
                              >
                                <a href={link.embed_url} target="_blank" rel="noopener noreferrer">
                                  <ExternalLink className="w-4 h-4" />
                                </a>
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDeleteStreamingLink(link.id)}
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
                <p className="text-center text-muted-foreground py-8">No streaming links found</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
