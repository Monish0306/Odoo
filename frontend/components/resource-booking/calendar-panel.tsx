'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar } from '@/components/ui/calendar';

type CalendarDay = {
  day: number;
  muted: boolean;
  hasBooking?: boolean;
};

type CalendarPanelProps = {
  days: CalendarDay[];
};

export function CalendarPanel({ days }: CalendarPanelProps) {
  return (
    <Card className="border-slate-800 bg-slate-900 shadow-none">
      <CardHeader className="border-b border-slate-800 p-5">
        <CardTitle className="text-base text-white">Schedule</CardTitle>
      </CardHeader>
      <CardContent className="p-5">
        <div className="grid grid-cols-7 gap-2">
          {days.map((day, index) => (
            <div
              key={`${day.day}-${index}`}
              className={`flex h-10 items-center justify-center rounded-md text-sm ${
                day.muted ? 'bg-slate-950 text-slate-500' : 'bg-slate-800 text-slate-100'
              } ${day.hasBooking ? 'ring-1 ring-teal-400' : ''}`}
            >
              {day.day}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
