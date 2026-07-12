import { Camera, Laptop, MapPin } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { BookingStatusBadge } from "./booking-status-badge";

type BookingCardProps = {
  title: string;
  resourceType: string;
  date: string;
  time: string;
  status: "Confirmed" | "Pending" | "Cancelled" | "Completed";
  icon: "room" | "camera" | "laptop";
};

const icons = {
  room: MapPin,
  camera: Camera,
  laptop: Laptop,
};

export function BookingCard({
  title,
  resourceType,
  date,
  time,
  status,
  icon,
}: BookingCardProps) {
  const Icon = icons[icon];

  return (
    <Card className="border-slate-800 bg-slate-900 shadow-none">
      <CardContent className="p-4">
        <div className="mb-3 flex items-start justify-between gap-3">
          <div className="flex min-w-0 gap-3">
            <div className="grid size-9 shrink-0 place-items-center rounded-lg bg-slate-800 text-teal-400">
              <Icon className="size-4" />
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-slate-100">{title}</p>
              <p className="mt-0.5 truncate text-xs text-slate-500">{resourceType}</p>
            </div>
          </div>
          <BookingStatusBadge status={status} />
        </div>

        <div className="border-t border-slate-800 pt-3 text-xs text-slate-400">
          <p>{date}</p>
          <p className="mt-1 font-medium text-slate-300">{time}</p>
        </div>
      </CardContent>
    </Card>
  );
}