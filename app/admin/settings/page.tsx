'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { AlertCircle, CheckCircle2 } from 'lucide-react';

export default function AdminSettings() {
  const [siteName, setSiteName] = useState('Mugenime');
  const [siteDescription, setSiteDescription] = useState('Free Anime Streaming Platform');
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [maxUploadSize, setMaxUploadSize] = useState('100');
  const [saved, setSaved] = useState(false);

  const handleSaveSettings = async () => {
    try {
      const response = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          siteName,
          siteDescription,
          maintenanceMode,
          maxUploadSize: parseInt(maxUploadSize),
        }),
      });

      if (response.ok) {
        setSaved(true);
        toast.success('Settings saved successfully');
        setTimeout(() => setSaved(false), 3000);
      } else {
        toast.error('Failed to save settings');
      }
    } catch (error) {
      toast.error('Error saving settings');
      console.error(error);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground">Configure your platform settings</p>
      </div>

      {/* General Settings */}
      <Card>
        <CardHeader>
          <CardTitle>General Settings</CardTitle>
          <CardDescription>Configure basic platform information</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium">Site Name</label>
            <Input
              value={siteName}
              onChange={(e) => setSiteName(e.target.value)}
              placeholder="Your site name"
            />
          </div>
          <div>
            <label className="text-sm font-medium">Site Description</label>
            <Input
              value={siteDescription}
              onChange={(e) => setSiteDescription(e.target.value)}
              placeholder="Brief description of your site"
            />
          </div>
          <div>
            <label className="text-sm font-medium">Max Upload Size (MB)</label>
            <Input
              type="number"
              value={maxUploadSize}
              onChange={(e) => setMaxUploadSize(e.target.value)}
              placeholder="100"
            />
          </div>
        </CardContent>
      </Card>

      {/* Maintenance Mode */}
      <Card>
        <CardHeader>
          <CardTitle>Maintenance Mode</CardTitle>
          <CardDescription>Put your site in maintenance mode</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-secondary rounded-lg">
            <div className="flex items-center gap-3">
              {maintenanceMode ? (
                <AlertCircle className="w-5 h-5 text-orange-500" />
              ) : (
                <CheckCircle2 className="w-5 h-5 text-green-500" />
              )}
              <div>
                <p className="font-medium">Maintenance Mode</p>
                <p className="text-sm text-muted-foreground">
                  {maintenanceMode ? 'Site is in maintenance mode' : 'Site is operational'}
                </p>
              </div>
            </div>
            <Button
              variant={maintenanceMode ? 'destructive' : 'outline'}
              onClick={() => setMaintenanceMode(!maintenanceMode)}
            >
              {maintenanceMode ? 'Disable' : 'Enable'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Admin Management */}
      <Card>
        <CardHeader>
          <CardTitle>Admin Management</CardTitle>
          <CardDescription>Manage admin users and roles</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground">
              To manage admin users, visit the <span className="font-medium">Users</span> section.
            </p>
            <Button asChild variant="outline">
              <a href="/admin/users">Go to Users Management</a>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* System Health */}
      <Card>
        <CardHeader>
          <CardTitle>System Health</CardTitle>
          <CardDescription>Platform status information</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex justify-between items-center p-3 bg-green-100 dark:bg-green-900 rounded-lg">
              <span>Database Connection</span>
              <span className="text-green-700 dark:text-green-200 font-medium">Healthy</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-green-100 dark:bg-green-900 rounded-lg">
              <span>API Status</span>
              <span className="text-green-700 dark:text-green-200 font-medium">Operational</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-green-100 dark:bg-green-900 rounded-lg">
              <span>Storage</span>
              <span className="text-green-700 dark:text-green-200 font-medium">Available</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Danger Zone */}
      <Card className="border-destructive">
        <CardHeader>
          <CardTitle className="text-destructive">Danger Zone</CardTitle>
          <CardDescription>Irreversible actions</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <Button variant="destructive" disabled className="w-full">
            Clear All Analytics
          </Button>
          <Button variant="destructive" disabled className="w-full">
            Reset Database
          </Button>
          <p className="text-xs text-muted-foreground">
            These actions are disabled for safety. Contact support to perform dangerous operations.
          </p>
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex items-center gap-4">
        <Button onClick={handleSaveSettings} className="px-8">
          {saved ? (
            <>
              <CheckCircle2 className="w-4 h-4 mr-2" />
              Saved
            </>
          ) : (
            'Save Settings'
          )}
        </Button>
      </div>
    </div>
  );
}
