import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { FileText, Filter } from "lucide-react";
import { useBackend } from "../lib/useBackend";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

import { formatCurrency, formatDateTime, getStatusColor } from "../lib/format";

export default function ClaimsTracking() {
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const backend = useBackend();

  const { data, isLoading } = useQuery({
    queryKey: ["claims", statusFilter],
    queryFn: async () => {
      const filter = statusFilter === "all" ? undefined : statusFilter;
      return await backend.claims.listByUser({ status: filter });
    },
  });

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 py-12 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-4xl font-bold mb-2">Claims Tracking</h1>
              <p className="text-muted-foreground">Monitor your submitted claims</p>
            </div>

            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-muted-foreground" />
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Claims</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {isLoading ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Loading claims...</p>
            </div>
          ) : data && data.claims.length > 0 ? (
            <div className="grid gap-6">
              {data.claims.map((claim) => (
                <Card key={claim.id}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-xl">{claim.description}</CardTitle>
                        <CardDescription className="mt-1">
                          {claim.category} • Submitted {formatDateTime(claim.submittedAt)}
                        </CardDescription>
                      </div>
                      <Badge variant="outline" className={getStatusColor(claim.status)}>
                        {claim.status.toUpperCase()}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Claim Amount</p>
                        <p className="text-2xl font-bold text-[#00A859]">
                          {formatCurrency(claim.amount)}
                        </p>
                      </div>
                      {claim.processedAt && (
                        <div>
                          <p className="text-sm text-muted-foreground mb-1">Processed Date</p>
                          <p className="font-medium">{formatDateTime(claim.processedAt)}</p>
                        </div>
                      )}
                      {claim.rejectionReason && (
                        <div className="md:col-span-2">
                          <p className="text-sm text-muted-foreground mb-1">Rejection Reason</p>
                          <p className="text-red-500">{claim.rejectionReason}</p>
                        </div>
                      )}
                      {claim.receiptUrls.length > 0 && (
                        <div className="md:col-span-2">
                          <p className="text-sm text-muted-foreground mb-2">Attached Documents</p>
                          <div className="flex flex-wrap gap-2">
                            {claim.receiptUrls.map((url, index) => (
                              <a
                                key={index}
                                href={url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 px-3 py-2 border border-border rounded-lg hover:bg-accent transition-colors"
                              >
                                <FileText className="w-4 h-4 text-[#00A859]" />
                                <span className="text-sm">Document {index + 1}</span>
                              </a>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="text-center py-12">
                <FileText className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
                <h3 className="text-xl font-semibold mb-2">No Claims Found</h3>
                <p className="text-muted-foreground">
                  {statusFilter === "all"
                    ? "You haven't submitted any claims yet"
                    : `No ${statusFilter} claims found`}
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
