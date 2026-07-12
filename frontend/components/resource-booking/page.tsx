import {
  Bell,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Clock3,
  LayoutDashboard,
  Package,
  Settings,
  Users,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CalendarPanel } from "@/components/resource-booking/calendar-panel";
import { BookingCard } from "@/components/resource-booking/booking-card";
import { BookingForm } from "@/components/resource-booking/booking-form";
import { BookingTimeline } from "@/components/resource-booking/booking-timeline";

const calendarDays = [
  { day: 1, muted: true },
  { day: 2, muted: true },
  { day: 3, muted: true },
  { day: 4, muted: true },
  { day: 5, muted: true },
  { day: 6, muted: true },
  { day: 7, muted: true },
  { day: 8, muted: true },
  { day: 9, muted: true },
  { day: 10, muted: true },
  { day: 11, muted: true },
  { day: 12, muted: true },
  { day: 13, muted: true },
  { day: 14, muted: true },
  { day: 15, muted: true },
  { day: 16, muted: true },
  { day: 17, muted: true },
  { day: 18, muted: true },
  { day: 19, muted: true },
  { day: 20, muted: true },
  { day: 21, muted: true },
  { day: 22, muted: true },
  { day: 23, muted: true },
  { day: 24, muted: true },
  { day: 25, muted: true },
  { day: 26, muted: true },
  { day: 27, muted: true },
  { day: 28, muted: true },
  { day: 29, muted: true },
  { day: 30, muted: true },
  { day: 1, muted: false, hasBooking: true },
  { day: 2, muted: false },
  { day: 3, muted: false, hasBooking: true },
  { day: 4, muted: false },
  { day: 5, muted: false },
  { day: 6, muted: false, hasBooking: true },
  { day: 7, muted: false },
  { day: 8, muted: false },
  { day: 9, muted: false },
  { day: 10, muted: false, hasBooking: true },
  { day: 11, muted: false },
];

const upcomingBookings = [
  {
    title: "Executive Conference Room",
    resourceType: "Meeting space · Floor 4",
    date: "Jul 03, 2026",
    time: "10:00 AM – 11:30 AM",
    status: "Confirmed" as const,
    icon: "room" as const,
  },
  {
    title: "Sony A7 IV Camera Kit",
    resourceType: "Photography equipment",
    date: "Jul 06, 2026",
    time: "09:00 AM – 05:00 PM",
    status: "Pending" as const,
    icon: "camera" as const,
  },
  {
    title: "MacBook Pro 16”",
    resourceType: "IT equipment · MBP-204",
    date: "Jul 10, 2026",
    time: "01:00 PM – 04:00 PM",
    status: "Confirmed" as const,
    icon: "laptop" as const,
  },
];

export default function ResourceBookingPage() {
  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      <div className="flex min-h-screen">
        <aside className="hidden w-64 shrink-0 border-r border-slate-800 bg-slate-950 px-4 py-6 lg:flex lg:flex-col">
          <div className="mb-10 flex items-center gap-3 px-2">
            <div className="grid size-9 place-items-center rounded-lg bg-teal-500 text-slate-950">
              <Package className="size-5" />
            </div>
            <div>
              <p className="text-sm font-semibold tracking-tight">AssetFlow</p>
              <p className="text-xs text-slate-500">Management System</p>
            </div>
          </div>

          <nav className="space-y-1">
            {[
              { label: "Dashboard", icon: LayoutDashboard },
              { label: "Assets", icon: Package },
              { label: "Allocations", icon: Users },
              { label: "Resource Booking", icon: CalendarDays, active: true },
            ].map(({ label, icon: Icon, active }) => (
              <a
                className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition ${
                  active
                    ? "bg-teal-500/15 text-teal-300"
                    : "text-slate-400 hover:bg-slate-900 hover:text-slate-100"
                }`}
                href="#"
                key={label}
              >
                <Icon className="size-4" />
                {label}
              </a>
            ))}
          </nav>

          <div className="mt-auto border-t border-slate-800 pt-4">
            <a
              className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-slate-400 hover:bg-slate-900 hover:text-slate-100"
              href="#"
            >
              <Settings className="size-4" />
              Settings
            </a>
          </div>
        </aside>

        <section className="min-w-0 flex-1 bg-slate-900/40">
          <header className="flex flex-col gap-5 border-b border-slate-800 px-5 py-5 sm:px-8 xl:flex-row xl:items-center xl:justify-between">
            <div>
              <p className="mb-1 text-xs font-medium uppercase tracking-[0.18em] text-teal-400">
                Operations
              </p>
              <h1 className="text-2xl font-semibold tracking-tight text-white">
                Resource Booking
              </h1>
              <p className="mt-1 text-sm text-slate-400">
                Schedule shared resources and manage active reservations.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <Button
                variant="outline"
                className="border-slate-700 bg-slate-900 text-slate-200 hover:bg-slate-800 hover:text-white"
              >
                <Bell className="mr-2 size-4" />
                Reminders
              </Button>
              <Button className="bg-teal-500 text-slate-950 hover:bg-teal-400">
                <CalendarDays className="mr-2 size-4" />
                New booking
              </Button>
            </div>
          </header>

          <div className="space-y-6 p-5 sm:p-8">
            <Card className="border-slate-800 bg-slate-900 shadow-none">
              <CardContent className="flex flex-col gap-4 p-4 md:flex-row md:items-center md:justify-between">
                <div className="flex flex-wrap items-center gap-2">
                  <Button
                    variant="outline"
                    className="border-slate-700 bg-slate-950 text-slate-300 hover:bg-slate-800 hover:text-white"
                  >
                    <CalendarDays className="mr-2 size-4" />
                    July 2026
                  </Button>
                  <Button
                    variant="outline"
                    className="border-slate-700 bg-slate-950 text-slate-300 hover:bg-slate-800 hover:text-white"
                  >
                    All resources
                  </Button>
                  <Button
                    variant="outline"
                    className="border-slate-700 bg-slate-950 text-slate-300 hover:bg-slate-800 hover:text-white"
                  >
                    All statuses
                  </Button>
                </div>

                <div className="flex items-center gap-1 text-sm text-slate-400">
                  <Button
                    size="icon"
                    variant="ghost"
                    className="size-8 text-slate-400 hover:bg-slate-800 hover:text-white"
                  >
                    <ChevronLeft className="size-4" />
                  </Button>
                  <span className="px-2 font-medium text-slate-200">Today</span>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="size-8 text-slate-400 hover:bg-slate-800 hover:text-white"
                  >
                    <ChevronRight className="size-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>

            <div className="grid gap-6 xl:grid-cols-12">
              <div className="space-y-6 xl:col-span-4">
                <BookingForm />

                <Card className="border-slate-800 bg-slate-900 shadow-none">
                  <CardContent className="p-5">
                    <div className="mb-4 flex items-center gap-2">
                      <Clock3 className="size-4 text-teal-400" />
                      <h2 className="font-semibold text-white">Selected booking</h2>
                    </div>

                    <dl className="space-y-3 text-sm">
                      <div className="flex justify-between gap-4">
                        <dt className="text-slate-500">Resource</dt>
                        <dd className="text-right font-medium text-slate-200">
                          Conference Room A
                        </dd>
                      </div>
                      <div className="flex justify-between gap-4">
                        <dt className="text-slate-500">Schedule</dt>
                        <dd className="text-right font-medium text-slate-200">
                          Jul 03 · 10:00–11:30 AM
                        </dd>
                      </div>
                      <div className="flex justify-between gap-4">
                        <dt className="text-slate-500">Booked by</dt>
                        <dd className="text-right font-medium text-slate-200">
                          Priya Sharma
                        </dd>
                      </div>
                    </dl>

                    <div className="mt-5 grid grid-cols-2 gap-2">
                      <Button
                        variant="outline"
                        className="border-slate-700 bg-transparent text-slate-200 hover:bg-slate-800 hover:text-white"
                      >
                        Reschedule
                      </Button>
                      <Button
                        variant="outline"
                        className="border-rose-500/30 bg-transparent text-rose-300 hover:bg-rose-500/10 hover:text-rose-200"
                      >
                        Cancel
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="xl:col-span-5">
                <CalendarPanel days={calendarDays} />
              </div>

              <div className="space-y-6 xl:col-span-3">
                <BookingTimeline />

                <div>
                  <div className="mb-3 flex items-center justify-between">
                    <h2 className="font-semibold text-white">Upcoming bookings</h2>
                    <Button
                      variant="link"
                      className="h-auto p-0 text-sm text-teal-400 hover:text-teal-300"
                    >
                      View all
                    </Button>
                  </div>

                  <div className="space-y-3">
                    {upcomingBookings.map((booking) => (
                      <BookingCard key={booking.title} {...booking} />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}