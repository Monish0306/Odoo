'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export function BookingTimeline() {
  return (
    <Card className="border-slate-800 bg-slate-900 shadow-none">
      <CardHeader className="border-b border-slate-800 p-5">
        <CardTitle className="text-base text-white">Upcoming bookings</CardTitle>
      </CardHeader>
      <CardContent className="p-5 text-sm text-slate-400">
        No bookings scheduled yet.
      </CardContent>
    </Card>
  );
}
