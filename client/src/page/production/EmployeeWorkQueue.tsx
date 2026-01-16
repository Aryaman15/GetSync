import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import {
  getEmployeeJobsQueryFn,
  getActiveTimerQueryFn,
  startTimerMutationFn,
} from "@/lib/api";
import { Job, JobStatus } from "@/types/production";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { toast } from "@/hooks/use-toast";

const statusTabs: { value: JobStatus; label: string }[] = [
  { value: "ASSIGNED", label: "Assigned" },
  { value: "IN_PROGRESS", label: "In Progress" },
  { value: "UNDER_REVIEW", label: "Under Review" },
  { value: "CHANGES_REQUESTED", label: "Changes Requested" },
  { value: "COMPLETED", label: "Completed" },
];

const EmployeeWorkQueue = () => {
  const [status, setStatus] = useState<JobStatus>("ASSIGNED");
  const [keyword, setKeyword] = useState("");
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [sortKey, setSortKey] = useState<"client" | "project" | "updated">(
    "updated"
  );
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { data, isLoading } = useQuery({
    queryKey: ["employee-jobs", status, keyword],
    queryFn: () => getEmployeeJobsQueryFn({ status, keyword }),
  });

  const { data: activeTimerData } = useQuery({
    queryKey: ["active-timer"],
    queryFn: getActiveTimerQueryFn,
    refetchInterval: 15000,
  });

  const jobs = (data?.jobs as Job[]) || [];

  const filtered = useMemo(() => {
    const sorted = [...jobs];
    sorted.sort((a, b) => {
      if (sortKey === "client") {
        return a.clientName.localeCompare(b.clientName);
      }
      if (sortKey === "project") {
        return a.projectId.localeCompare(b.projectId);
      }
      return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
    });
    return sorted;
  }, [jobs, sortKey]);

  const quickClients = useMemo(
    () => Array.from(new Set(jobs.map((job) => job.clientName))).slice(0, 4),
    [jobs]
  );

  const quickTasks = useMemo(
    () => Array.from(new Set(jobs.map((job) => job.taskTypeCode))).slice(0, 4),
    [jobs]
  );

  const startMutation = useMutation({
    mutationFn: (jobId: string) => startTimerMutationFn(jobId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["active-timer"] });
      toast({ title: "Timer started" });
    },
    onError: (error: any) => {
      const message = error?.response?.data?.message || "Unable to start timer";
      toast({ title: message, variant: "destructive" });
    },
  });

  const handleStart = (jobId: string) => {
    if (activeTimerData?.timer) {
      toast({
        title: "Stop current timer first",
        description: "You already have an active job timer running.",
        variant: "destructive",
      });
      return;
    }
    startMutation.mutate(jobId, {
      onSuccess: () => navigate(`/production/employee/jobs/${jobId}`),
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold">My Work Queue</h2>
        <p className="text-sm text-slate-600">
          Focus on your assignments with live timers and status cues.
        </p>
      </div>
      <Card>
        <CardContent className="p-4 flex flex-wrap items-center gap-3">
          <Input
            placeholder="Search by client, project ID, or task code"
            value={keyword}
            onChange={(event) => setKeyword(event.target.value)}
            className="max-w-xs"
          />
          <Tabs value={status} onValueChange={(value) => setStatus(value as JobStatus)}>
            <TabsList>
              {statusTabs.map((tab) => (
                <TabsTrigger key={tab.value} value={tab.value}>
                  {tab.label}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
          <div className="flex items-center gap-2">
            <Badge
              onClick={() => setSortKey("client")}
              className={`cursor-pointer ${sortKey === "client" ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-600"}`}
            >
              Client Name
            </Badge>
            <Badge
              onClick={() => setSortKey("project")}
              className={`cursor-pointer ${sortKey === "project" ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-600"}`}
            >
              Project ID
            </Badge>
            <Badge
              onClick={() => setSortKey("updated")}
              className={`cursor-pointer ${sortKey === "updated" ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-600"}`}
            >
              Recently Updated
            </Badge>
          </div>
        </CardContent>
      </Card>
      <div className="flex flex-wrap gap-2 text-xs text-slate-500">
        {quickClients.map((client) => (
          <Badge
            key={client}
            variant="outline"
            className="cursor-pointer"
            onClick={() => setKeyword(client)}
          >
            {client}
          </Badge>
        ))}
        {quickTasks.map((task) => (
          <Badge
            key={task}
            variant="outline"
            className="cursor-pointer"
            onClick={() => setKeyword(task)}
          >
            {task}
          </Badge>
        ))}
      </div>

      {isLoading ? (
        <div className="grid gap-4 md:grid-cols-2">
          {[1, 2, 3].map((item) => (
            <Card key={item} className="animate-pulse h-36" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="p-8 text-center">
            <p className="text-sm text-slate-500">No jobs found for this view.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {filtered.map((job) => (
            <Card
              key={job._id}
              className="cursor-pointer hover:shadow-lg transition-shadow"
              onClick={() => setSelectedJob(job)}
            >
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center justify-between">
                  {job.clientName}
                  <Badge variant="outline">{job.status.replace(/_/g, " ")}</Badge>
                </CardTitle>
                <p className="text-xs text-slate-500">{job.projectId}</p>
              </CardHeader>
              <CardContent className="space-y-2">
                <div>
                  <p className="text-sm font-medium">{job.projectName}</p>
                  <p className="text-xs text-slate-500">{job.chapterScope}</p>
                </div>
                <div className="flex items-center justify-between text-xs text-slate-500">
                  <span>{job.taskTypeLabel}</span>
                  <span>{job.taskTypeCode}</span>
                </div>
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span>Total: {job.totalMinutes || 0} min</span>
                  <span>
                    Last activity:{" "}
                    {job.lastActivityAt
                      ? new Date(job.lastActivityAt).toLocaleDateString()
                      : "—"}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Sheet open={!!selectedJob} onOpenChange={() => setSelectedJob(null)}>
        <SheetContent side="right" className="w-full sm:max-w-lg">
          <SheetHeader>
            <SheetTitle>Job Summary</SheetTitle>
          </SheetHeader>
          {selectedJob && (
            <div className="mt-6 space-y-4">
              <div>
                <p className="text-xs uppercase text-slate-500">Client</p>
                <p className="font-medium">{selectedJob.clientName}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs uppercase text-slate-500">Project</p>
                  <p className="text-sm font-medium">{selectedJob.projectName}</p>
                  <p className="text-xs text-slate-500">{selectedJob.projectId}</p>
                </div>
                <div>
                  <p className="text-xs uppercase text-slate-500">Task</p>
                  <p className="text-sm font-medium">{selectedJob.taskTypeLabel}</p>
                  <p className="text-xs text-slate-500">{selectedJob.taskTypeCode}</p>
                </div>
              </div>
              <div>
                <p className="text-xs uppercase text-slate-500">Scope</p>
                <p className="text-sm">{selectedJob.chapterScope}</p>
              </div>
              {selectedJob.adminNote && (
                <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
                  <p className="text-xs uppercase text-slate-500">Admin Note</p>
                  <p className="text-sm">{selectedJob.adminNote}</p>
                </div>
              )}
              <Button
                className="w-full"
                onClick={() => handleStart(selectedJob._id)}
                disabled={startMutation.isPending || selectedJob.status === "COMPLETED"}
              >
                Start Work Session
              </Button>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default EmployeeWorkQueue;
