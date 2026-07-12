import { CalendarClock, Info } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

export function BookingForm() {
  return (
    <Card className="border-slate-800 bg-slate-900 shadow-none">
      <CardHeader className="border-b border-slate-800 p-5">
        <CardTitle className="flex items-center gap-2 text-base text-white">
          <CalendarClock className="size-4 text-teal-400" />
          Create booking
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4 p-5">
        <div className="space-y-2">
          <Label className="text-slate-300">Resource</Label>
          <Select>
            <SelectTrigger className="border-slate-700 bg-slate-950 text-slate-200">
              <SelectValue placeholder="Choose a resource" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="conference-a">Conference Room A</SelectItem>
              <SelectItem value="camera-kit">Sony A7 IV Camera Kit</SelectItem>
              <SelectItem value="macbook-pro">MacBook Pro 16”</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-2">
            <Label className="text-slate-300">Date</Label>
            <Input
              type="date"
              defaultValue="2026-07-03"
              className="border-slate-700 bg-slate-950 text-slate-200 [color-scheme:dark]"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-slate-300">Duration</Label>
            <Select>
              <SelectTrigger className="border-slate-700 bg-slate-950 text-slate-200">
                <SelectValue placeholder="Select" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="30">30 minutes</SelectItem>
                <SelectItem value="60">1 hour</SelectItem>
                <SelectItem value="90">1.5 hours</SelectItem>
                <SelectItem value="day">Full day</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-2">
            <Label className="text-slate-300">Start time</Label>
            <Input
              type="time"
              defaultValue="10:00"
              className="border-slate-700 bg-slate-950 text-slate-200 [color-scheme:dark]"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-slate-300">End time</Label>
            <Input
              type="time"
              defaultValue="11:30"
              className="border-slate-700 bg-slate-950 text-slate-200 [color-scheme:dark]"
            />
          </div>
        </div>

        <div className="rounded-lg border border-teal-400/15 bg-teal-400/5 p-3">
          <div className="flex gap-2">
            <Info className="mt-0.5 size-4 shrink-0 text-teal-400" />
            <p className="text-xs leading-5 text-slate-400">
              Available for the selected time. A reminder will be sent 15 minutes
              before your booking.
            </p>
          </div>
        </div>

        <div className="space-y-2">
          <Label className="text-slate-300">Purpose</Label>
          <Textarea
            placeholder="Add a short reason for this booking"
            className="min-h-20 resize-none border-slate-700 bg-slate-950 text-slate-200 placeholder:text-slate-600"
          />
        </div>

        <Button className="w-full bg-teal-500 text-slate-950 hover:bg-teal-400">
          Confirm booking
        </Button>
      </CardContent>
    </Card>
  );
}