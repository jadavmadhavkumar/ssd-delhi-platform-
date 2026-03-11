"use client";

import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Download, QrCode, Share2, Shield, User } from "lucide-react";
import { toast } from "sonner";

export default function MembershipCardPage() {
  const user = useQuery(api.users?.getCurrentUser as any);

  const handleDownload = () => {
    toast.success("Membership card downloaded!", {
      description: "Check your downloads folder",
    });
  };

  const handleShare = () => {
    toast.success("Card shared!", {
      description: "You can share this card with others",
    });
  };

  if (!user) {
    return (
      <div className="container py-12">
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">Loading...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const isApproved = user.membershipStatus === "approved";

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="py-12 md:py-20 bg-gradient-to-br from-primary/10 via-background to-secondary/10 border-b">
        <div className="container px-4 md:px-6">
          <div className="max-w-2xl space-y-2">
            <h1 className="text-4xl font-bold">Membership Card</h1>
            <p className="text-muted-foreground">
              Your digital SSD Delhi membership card
            </p>
          </div>
        </div>
      </section>

      {/* Membership Card */}
      <section className="py-12 md:py-16">
        <div className="container px-4 md:px-6">
          <div className="max-w-md mx-auto">
            {!isApproved ? (
              <Card>
                <CardHeader>
                  <CardTitle>Membership Pending</CardTitle>
                  <CardDescription>
                    Your membership application is being reviewed
                  </CardDescription>
                </CardHeader>
                <CardContent className="text-center">
                  <div className="py-8">
                    <Shield className="h-16 w-16 text-muted-foreground mx-auto mb-4 opacity-50" />
                    <p className="text-muted-foreground">
                      Your membership status: <span className="font-semibold capitalize">{user.membershipStatus}</span>
                    </p>
                    <p className="text-sm text-muted-foreground mt-2">
                      You will receive your membership card once your application is approved
                    </p>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <>
                {/* Card Actions */}
                <div className="flex gap-2 mb-6">
                  <Button onClick={handleDownload} className="flex-1">
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </Button>
                  <Button variant="outline" onClick={handleShare} className="flex-1">
                    <Share2 className="h-4 w-4 mr-2" />
                    Share
                  </Button>
                </div>

                {/* Membership Card Design */}
                <Card className="overflow-hidden border-2 border-primary">
                  {/* Card Header */}
                  <div className="bg-primary text-primary-foreground p-6 text-center">
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <Shield className="h-8 w-8" />
                      <div>
                        <h2 className="text-xl font-bold">SSD Delhi</h2>
                        <p className="text-sm opacity-90">समता सैनिक दल</p>
                      </div>
                    </div>
                    <p className="text-sm opacity-90">Soldiers for Equality</p>
                  </div>

                  {/* Card Body */}
                  <CardContent className="p-6 space-y-6">
                    {/* Member Info */}
                    <div className="flex items-center gap-4">
                      <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
                        <User className="h-8 w-8 text-primary" />
                      </div>
                      <div>
                        <div className="text-2xl font-bold">{user.name}</div>
                        <div className="text-sm text-muted-foreground capitalize">
                          {user.role}
                        </div>
                      </div>
                    </div>

                    {/* Membership Details */}
                    <div className="grid gap-3">
                      <div className="flex justify-between items-center py-2 border-b">
                        <span className="text-sm text-muted-foreground">Membership No.</span>
                        <span className="font-mono font-semibold">{user.membershipNumber}</span>
                      </div>
                      <div className="flex justify-between items-center py-2 border-b">
                        <span className="text-sm text-muted-foreground">Member Since</span>
                        <span className="font-semibold">
                          {user.memberSince
                            ? new Date(user.memberSince).toLocaleDateString("en-IN", {
                                month: "short",
                                year: "numeric",
                              })
                            : "-"}
                        </span>
                      </div>
                      <div className="flex justify-between items-center py-2 border-b">
                        <span className="text-sm text-muted-foreground">Status</span>
                        <Badge variant="default">Active</Badge>
                      </div>
                      <div className="flex justify-between items-center py-2">
                        <span className="text-sm text-muted-foreground">Location</span>
                        <span className="font-semibold">
                          {user.city}, {user.state}
                        </span>
                      </div>
                    </div>

                    {/* QR Code */}
                    <div className="pt-4 text-center">
                      <div className="inline-flex items-center justify-center p-4 bg-muted rounded-lg">
                        <QrCode className="h-24 w-24" />
                      </div>
                      <p className="text-xs text-muted-foreground mt-2">
                        Scan to verify membership
                      </p>
                    </div>

                    {/* Card Footer */}
                    <div className="pt-4 text-center text-xs text-muted-foreground">
                      <p>Samta Sainik Dal Delhi</p>
                      <p>Building a Casteless Society</p>
                      <p className="mt-1">Liberty • Equality • Fraternity</p>
                    </div>
                  </CardContent>
                </Card>

                {/* Verification Info */}
                <Card className="mt-6">
                  <CardHeader>
                    <CardTitle className="text-lg">How to Use This Card</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2 text-sm">
                    <p>• Show this card at SSD Delhi events for verification</p>
                    <p>• The QR code can be scanned to verify your membership</p>
                    <p>• Keep this card accessible on your mobile device</p>
                    <p>• Contact us if you need a physical card</p>
                  </CardContent>
                </Card>
              </>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
