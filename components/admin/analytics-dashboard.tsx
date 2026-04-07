'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function AnalyticsDashboard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Analytics Overview</CardTitle>
        <CardDescription>Viewer statistics and trends</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="text-sm text-muted-foreground">
          <p>Analytics visualization coming soon.</p>
          <p className="mt-2">Track views, user engagement, and popular content.</p>
        </div>
      </CardContent>
    </Card>
  );
}
