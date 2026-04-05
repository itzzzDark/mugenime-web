import { Button } from '@/components/ui/button';
import UsersList from '@/components/admin/users-list';
import Link from 'next/link';
import { Plus } from 'lucide-react';

export const metadata = {
  title: 'Manage Users - Admin Dashboard',
  description: 'Manage user accounts and permissions',
};

export default function UsersPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Users</h1>
          <p className="text-muted-foreground mt-1">Manage user accounts, roles, and permissions</p>
        </div>
        <Button asChild>
          <Link href="/admin/users/create">
            <Plus className="w-4 h-4 mr-2" />
            Add User
          </Link>
        </Button>
      </div>

      <UsersList />
    </div>
  );
}
