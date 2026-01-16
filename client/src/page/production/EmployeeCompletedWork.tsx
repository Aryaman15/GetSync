import { useQuery } from "@tanstack/react-query";
import { getEmployeeJobsQueryFn } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const EmployeeCompletedWork = () => {
  const { data, isLoading } = useQuery({
    queryKey: ["employee-jobs", "completed"],
    queryFn: () => getEmployeeJobsQueryFn({ status: "COMPLETED" }),
  });

  const jobs = data?.jobs || [];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold">Completed Work</h2>
        <p className="text-sm text-slate-500">
          A record of your approved and delivered assignments.
        </p>
      </div>
      {isLoading ? (
        <Card className="h-40 animate-pulse" />
      ) : jobs.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center text-sm text-slate-500">
            No completed jobs yet.
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {jobs.map((job: any) => (
            <Card key={job._id}>
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center justify-between">
                  {job.projectName}
                  <Badge variant="outline">Completed</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-slate-500 space-y-1">
                <p>{job.clientName}</p>
                <p>{job.chapterScope}</p>
                <p>{job.taskTypeLabel}</p>
                <p>Total time: {job.totalMinutes || 0} min</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default EmployeeCompletedWork;
