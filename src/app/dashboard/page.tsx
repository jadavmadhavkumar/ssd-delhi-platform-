"use client";

import { useQuery } from "convex/react";
import { api } from "@convex/_generated/api";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, User, CreditCard, Clock, CheckCircle, TrendingUp } from "lucide-react";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";

export default function DashboardPage() {
  const user = useQuery(api.users?.getCurrentUser as any);
  const myEvents = useQuery(api.events?.getUserRegistrations as any, { 
    userId: user?._id 
  });

  if (!user) {
    return (
      <div className="container py-12">
        <div className="space-y-4">
          <Skeleton className="h-12 w-64" />
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-32 w-full" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="py-12 md:py-20 bg-gradient-to-br from-primary/10 via-background to-secondary/10 border-b">
        <div className="container px-4 md:px-6">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <h1 className="text-4xl font-bold">Welcome, {user.name}!</h1>
              <p className="text-muted-foreground">Manage your SSD Delhi membership</p>
            </div>
            <div className="flex gap-2">
              <Link href="/dashboard/membership-card">
                <Button>
                  <CreditCard className="h-4 w-4 mr-2" />
                  Membership Card
                </Button>
              </Link>
              <Link href="/dashboard/profile">
                <Button variant="outline">
                  <User className="h-4 w-4 mr-2" />
                  Edit Profile
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Dashboard Content */}
      <section className="py-12 md:py-16">
        <div className="container px-4 md:px-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {/* Membership Status Card */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Membership Status</CardTitle>
                <CheckCircle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold capitalize">{user.membershipStatus}</div>
                {user.membershipNumber && (
                  <p className="text-xs text-muted-foreground mt-1">
                    {user.membershipNumber}
                  </p>
                )}
                {user.memberSince && (
                  <p className="text-xs text-muted-foreground">
                    Since {new Date(user.memberSince).toLocaleDateString("en-IN")}
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Events Registered */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Events Registered</CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {myEvents?.length || 0}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Upcoming events
                </p>
              </CardContent>
            </Card>

            {/* Role */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Your Role</CardTitle>
                <User className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold capitalize">{user.role}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  {user.role === "volunteer" ? "Active member" : user.role}
                </p>
              </CardContent>
            </Card>

            {/* Language Preference */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Language</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {user.preferredLanguage === "en" ? "English" : "हिंदी"}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Preferred language
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <div className="mt-8">
            <h2 className="text-2xl font-bold mb-4">Quick Actions</h2>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <Link href="/events">
                <Card className="hover:shadow-md transition-shadow cursor-pointer">
                  <CardHeader>
                    <Calendar className="h-8 w-8 text-primary mb-2" />
                    <CardTitle>Browse Events</CardTitle>
                    <CardDescription>
                      View and register for upcoming SSD events
                    </CardDescription>
                  </CardHeader>
                </Card>
              </Link>

              <Link href="/articles">
                <Card className="hover:shadow-md transition-shadow cursor-pointer">
                  <CardHeader>
                    <Clock className="h-8 w-8 text-primary mb-2" />
                    <CardTitle>Read Articles</CardTitle>
                    <CardDescription>
                      Explore SSD history and ideology
                    </CardDescription>
                  </CardHeader>
                </Card>
              </Link>

              {user.membershipStatus === "approved" && (
                <Link href="/dashboard/membership-card">
                  <Card className="hover:shadow-md transition-shadow cursor-pointer">
                    <CardHeader>
                      <CreditCard className="h-8 w-8 text-primary mb-2" />
                      <CardTitle>Download Card</CardTitle>
                      <CardDescription>
                        Get your digital membership card
                      </CardDescription>
                    </CardHeader>
                  </Card>
                </Link>
              )}
            </div>
          </div>

          {/* Recent Activity / My Events */}
          <div className="mt-8">
            <h2 className="text-2xl font-bold mb-4">My Events</h2>
            {!myEvents || myEvents.length === 0 ? (
              <Card>
                <CardContent className="py-8 text-center text-muted-foreground">
                  <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>You haven&apos;t registered for any events yet</p>
                  <Link href="/events">
                    <Button variant="link" className="mt-2">
                      Browse Events
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4 md:grid-cols-2">
                {myEvents.map((event: any) => (
                  <Card key={event._id}>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <Badge variant={event.status === "upcoming" ? "default" : "outline"}>
                          {event.status}
                        </Badge>
                        {event.registration?.attended && (
                          <Badge variant="secondary">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Attended
                          </Badge>
                        )}
                      </div>
                      <CardTitle className="text-lg">{event.title}</CardTitle>
                      <CardDescription>
                        {new Date(event.startDate).toLocaleDateString("en-IN", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                        {" • "}
                        {event.venue}, {event.city}
                      </CardDescription>
                    </CardHeader>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
