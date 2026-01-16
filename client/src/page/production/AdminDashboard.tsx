import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  approveJobMutationFn,
  getJobsQueryFn,
  getSummaryReportQueryFn,
  requestChangesJobMutationFn,
} from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";
import { Job } from "@/types/production";

const AdminDashboard = () => {
  const queryClient = useQueryClient();
  const { data: summaryData } = useQuery({
    queryKey: ["summary-report"],
    queryFn: getSummaryReportQueryFn,
  });

  const { data: reviewData } = useQuery({
    queryKey: ["review-jobs"],
    queryFn: () => getJobsQueryFn({ status: "UNDER_REVIEW" }),
  });

  const approveMutation = useMutation({
    mutationFn: (jobId: string) => approveJobMutationFn(jobId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["review-jobs"] });
      toast({ title: "Job approved" });
    },
  });

  const changesMutation = useMutation({
    mutationFn: ({ jobId, message }: { jobId: string; message: string }) =>
      requestChangesJobMutationFn(jobId, message),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["review-jobs"] });
      toast({ title: "Changes requested" });
    },
  });

  const jobs = (reviewData?.jobs || []) as Job[];
  const totals = summaryData?.totals || { totalMinutes: 0 };
  const jobsByStatus = summaryData?.jobsByStatus || {};
  const jobsByClient = summaryData?.jobsByClient || {};
  const hoursByEmployee = summaryData?.hoursByEmployee || [];

  const statusList = [
    { label: "Assigned", key: "ASSIGNED" },
    { label: "In Progress", key: "IN_PROGRESS" },
    { label: "Under Review", key: "UNDER_REVIEW" },
    { label: "Changes", key: "CHANGES_REQUESTED" },
    { label: "Completed", key: "COMPLETED" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold">Admin Dashboard</h2>
        <p className="text-sm text-slate-500">
          A live view of production throughput and review workload.
        </p>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Total Hours Logged</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-semibold">
              {(totals.totalMinutes / 60).toFixed(1)}h
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Under Review</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-semibold">{jobsByStatus.UNDER_REVIEW || 0}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Completed</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-semibold">{jobsByStatus.COMPLETED || 0}</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Jobs by Status</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {statusList.map((status) => {
            const value = jobsByStatus[status.key] || 0;
            const max = Math.max(...statusList.map((item) => jobsByStatus[item.key] || 0), 1);
            return (
              <div key={status.key}>
                <div className="flex justify-between text-xs text-slate-500">
                  <span>{status.label}</span>
                  <span>{value}</span>
                </div>
                <div className="h-2 rounded-full bg-slate-100">
                  <div
                    className="h-2 rounded-full bg-slate-900"
                    style={{ width: `${(value / max) * 100}%` }}
                  />
                </div>
              </div>
            );
          })}
        </CardContent>
      </Card>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Hours by Employee</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {hoursByEmployee.length === 0 ? (
              <p className="text-sm text-slate-500">No hours logged yet.</p>
            ) : (
              hoursByEmployee.map((entry: any) => (
                <div key={entry.employeeId} className="flex items-center justify-between text-sm">
                  <span>{entry.fullName}</span>
                  <span>{(entry.minutes / 60).toFixed(1)}h</span>
                </div>
              ))
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Jobs by Client</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {Object.keys(jobsByClient).length === 0 ? (
              <p className="text-sm text-slate-500">No client data yet.</p>
            ) : (
              Object.entries(jobsByClient).map(([client, count]) => (
                <div key={client} className="flex items-center justify-between text-sm">
                  <span>{client}</span>
                  <span>{count}</span>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Review Inbox</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {jobs.length === 0 ? (
            <p className="text-sm text-slate-500">No jobs awaiting review.</p>
          ) : (
            jobs.map((job) => (
              <div key={job._id} className="rounded-lg border border-slate-200 p-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{job.projectName}</p>
                    <p className="text-xs text-slate-500">{job.clientName}</p>
                  </div>
                  <Badge variant="outline">Under Review</Badge>
                </div>
                <div className="mt-3 flex gap-2">
                  <Button
                    size="sm"
                    onClick={() => approveMutation.mutate(job._id)}
                  >
                    Approve
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() =>
                      changesMutation.mutate({
                        jobId: job._id,
                        message: "Please address highlighted corrections.",
                      })
                    }
                  >
                    Request Changes
                  </Button>
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDashboard;
