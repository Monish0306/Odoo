"use client";

import * as React from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

function Calendar({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  const days = Array.from({ length: 35 }, (_, index) => index + 1);

  return (
    <div className={cn('rounded-xl border border-slate-800 bg-slate-950 p-3', className)} {...props}>
      <div className="mb-3 grid grid-cols-7 gap-2 text-center text-xs uppercase tracking-wide text-slate-500">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
          <div key={day}>{day}</div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-2">
        {days.map((day) => (
          <Button
            key={day}
            variant="ghost"
            size="icon"
            className="h-9 w-9 rounded-lg border border-slate-800 bg-slate-900 text-slate-300 hover:bg-slate-800"
          >
            {day}
          </Button>
        ))}
      </div>
    </div>
  );
}

export { Calendar };
