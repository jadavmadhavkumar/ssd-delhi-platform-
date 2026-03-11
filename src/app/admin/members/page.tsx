"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { CheckCircle, XCircle, User, Mail, Phone } from "lucide-react";
import { toast } from "sonner";

export default function AdminMembersPage() {
  const pendingMembers = useQuery(api.users?.listUsers as any, { 
    membershipStatus: "pending",
    limit: 100 
  });
  const approvedMembers = useQuery(api.users?.listUsers as any, { 
    membershipStatus: "approved",
    limit: 50 
  });
  const updateMembershipStatus = useMutation(api.users?.updateMembershipStatus as any);

  const handleApprove = async (userId: string) => {
    try {
      await updateMembershipStatus({
        userId,
        status: "approved",
      });
      toast.success("Member approved!");
    } catch (error) {
      toast.error("Failed to approve member");
    }
  };

  const handleReject = async (userId: string) => {
    if (!confirm("Are you sure you want to reject this membership application?")) return;
    try {
      await updateMembershipStatus({
        userId,
        status: "inactive",
      });
      toast.success("Application rejected");
    } catch (error) {
      toast.error("Failed to reject application");
    }
  };

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="py-12 md:py-20 bg-gradient-to-br from-primary/10 via-background to-secondary/10 border-b">
        <div className="container px-4 md:px-6">
          <div className="space-y-2">
            <h1 className="text-4xl font-bold">Members Management</h1>
            <p className="text-muted-foreground">
              Review and approve membership applications
            </p>
          </div>
        </div>
      </section>

      {/* Members Content */}
      <section className="py-12 md:py-16">
        <div className="container px-4 md:px-6">
          <div className="grid gap-6">
            {/* Pending Applications */}
            <Card>
              <CardHeader>
                <CardTitle>Pending Applications ({pendingMembers?.length || 0})</CardTitle>
                <CardDescription>
                  Review and approve new membership applications
                </CardDescription>
              </CardHeader>
              <CardContent>
                {!pendingMembers || pendingMembers.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <User className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No pending applications</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Name</TableHead>
                          <TableHead>Email</TableHead>
                          <TableHead>Phone</TableHead>
                          <TableHead>Location</TableHead>
                          <TableHead>Applied</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {pendingMembers.map((member: any) => (
                          <TableRow key={member._id}>
                            <TableCell>
                              <div className="font-medium">{member.name}</div>
                              <div className="text-xs text-muted-foreground capitalize">
                                {member.role}
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <Mail className="h-4 w-4 text-muted-foreground" />
                                {member.email}
                              </div>
                            </TableCell>
                            <TableCell>
                              {member.phone ? (
                                <div className="flex items-center gap-2">
                                  <Phone className="h-4 w-4 text-muted-foreground" />
                                  {member.phone}
                                </div>
                              ) : (
                                <span className="text-muted-foreground">-</span>
                              )}
                            </TableCell>
                            <TableCell>
                              {member.city}, {member.state}
                            </TableCell>
                            <TableCell>
                              {member.memberSince
                                ? new Date(member.memberSince).toLocaleDateString()
                                : "-"}
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end gap-2">
                                <Button
                                  size="sm"
                                  onClick={() => handleApprove(member._id)}
                                >
                                  <CheckCircle className="h-4 w-4 mr-1" />
                                  Approve
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleReject(member._id)}
                                >
                                  <XCircle className="h-4 w-4 mr-1" />
                                  Reject
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Recently Approved Members */}
            <Card>
              <CardHeader>
                <CardTitle>Recently Approved Members ({approvedMembers?.length || 0})</CardTitle>
                <CardDescription>
                  Members who have been approved
                </CardDescription>
              </CardHeader>
              <CardContent>
                {!approvedMembers || approvedMembers.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <p>No approved members yet</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Name</TableHead>
                          <TableHead>Membership No.</TableHead>
                          <TableHead>Email</TableHead>
                          <TableHead>Location</TableHead>
                          <TableHead>Member Since</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {approvedMembers.slice(0, 10).map((member: any) => (
                          <TableRow key={member._id}>
                            <TableCell>
                              <div className="font-medium">{member.name}</div>
                            </TableCell>
                            <TableCell>
                              <Badge variant="secondary">{member.membershipNumber}</Badge>
                            </TableCell>
                            <TableCell>{member.email}</TableCell>
                            <TableCell>
                              {member.city}, {member.state}
                            </TableCell>
                            <TableCell>
                              {member.memberSince
                                ? new Date(member.memberSince).toLocaleDateString("en-IN", {
                                    year: "numeric",
                                    month: "short",
                                    day: "numeric",
                                  })
                                : "-"}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}
