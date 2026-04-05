import { Button } from '@/components/ui/button';
import DownloadsList from '@/components/admin/downloads-list';
import Link from 'next/link';
import { Plus } from 'lucide-react';

export const metadata = {
  title: 'Manage Downloads - Admin Dashboard',
  description: 'Manage download links for episodes',
};

export default function DownloadsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Download Links</h1>
          <p className="text-muted-foreground mt-1">Manage download links and media quality options</p>
        </div>
        <Button asChild>
          <Link href="/admin/downloads/create">
            <Plus className="w-4 h-4 mr-2" />
            Add Link
          </Link>
        </Button>
      </div>

      <DownloadsList />
    </div>
  );
}
