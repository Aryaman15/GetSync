import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { getEmployeeInsightsQueryFn } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const AdminEmployeeInsights = () => {
  const { employeeId } = useParams();
  const { data, isLoading } = useQuery({
    queryKey: ["employee-insights", employeeId],
    queryFn: () => getEmployeeInsightsQueryFn(employeeId as string),
    enabled: !!employeeId,
  });

  if (isLoading) {
    return <Card className="h-40 animate-pulse" />;
  }

  const totals = data?.totals || {};
  const jobs = data?.jobs || [];
  const jobsByStatus = jobs.reduce((acc: Record<string, number>, job: any) => {
    acc[job.status] = (acc[job.status] || 0) + 1;
    return acc;
  }, {});

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold">Employee Insights</h2>
        <p className="text-sm text-slate-500">
          KPI snapshot and assignment breakdown.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Total Hours</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-semibold">
              {(totals.totalMinutes / 60 || 0).toFixed(1)}h
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Jobs Completed</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-semibold">{totals.jobsCompleted || 0}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Active Jobs</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-semibold">{totals.activeJobs || 0}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Under Review</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-semibold">{totals.underReview || 0}</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Hours by Session</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {(data?.entries || []).slice(0, 7).map((entry: any) => (
            <div key={entry._id} className="flex items-center justify-between text-sm">
              <span>{entry.date}</span>
              <span>{entry.durationMinutes} min</span>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Jobs by Status</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {Object.keys(jobsByStatus).length === 0 ? (
            <p className="text-sm text-slate-500">No job data yet.</p>
          ) : (
            Object.entries(jobsByStatus).map(([status, count]) => (
              <div key={status} className="flex items-center justify-between text-sm">
                <span>{status.replace(/_/g, " ")}</span>
                <span>{count}</span>
              </div>
            ))
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Assigned Jobs</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {jobs.map((job: any) => (
            <div key={job._id} className="rounded-lg border border-slate-200 p-3 text-sm">
              <p className="font-medium">{job.projectName}</p>
              <p className="text-slate-500">
                {job.clientName} · {job.status.replace(/_/g, " ")}
              </p>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminEmployeeInsights;
