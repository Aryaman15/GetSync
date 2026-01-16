import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import {
  getActiveTimerQueryFn,
  getJobDetailQueryFn,
  startTimerMutationFn,
  stopTimerMutationFn,
  submitJobMutationFn,
} from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import { TimeEntry, ReviewHistory } from "@/types/production";

const EmployeeWorkScreen = () => {
  const { jobId } = useParams();
  const queryClient = useQueryClient();
  const [stopOpen, setStopOpen] = useState(false);
  const [pageCountDone, setPageCountDone] = useState<number | undefined>();
  const [remarks, setRemarks] = useState("");

  const { data, isLoading } = useQuery({
    queryKey: ["job-detail", jobId],
    queryFn: () => getJobDetailQueryFn(jobId as string),
    enabled: !!jobId,
  });

  const { data: activeTimerData } = useQuery({
    queryKey: ["active-timer"],
    queryFn: getActiveTimerQueryFn,
    refetchInterval: 10000,
  });

  const startMutation = useMutation({
    mutationFn: () => startTimerMutationFn(jobId as string),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["active-timer"] });
      toast({ title: "Timer started" });
    },
    onError: (error: any) => {
      toast({
        title: error?.response?.data?.message || "Unable to start timer",
        variant: "destructive",
      });
    },
  });

  const stopMutation = useMutation({
    mutationFn: () =>
      stopTimerMutationFn(jobId as string, { pageCountDone, remarks }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["job-detail", jobId] });
      queryClient.invalidateQueries({ queryKey: ["active-timer"] });
      setStopOpen(false);
      setPageCountDone(undefined);
      setRemarks("");
      toast({ title: "Session logged" });
    },
    onError: () =>
      toast({ title: "Unable to stop timer", variant: "destructive" }),
  });

  const submitMutation = useMutation({
    mutationFn: () => submitJobMutationFn(jobId as string),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["job-detail", jobId] });
      toast({ title: "Submitted for review" });
    },
    onError: () =>
      toast({ title: "Unable to submit", variant: "destructive" }),
  });

  const job = data?.job;
  const timeEntries = (data?.timeEntries || []) as TimeEntry[];
  const reviewHistory = (data?.reviewHistory || []) as ReviewHistory[];

  const totalMinutes = data?.totals?.totalMinutes || 0;
  const todayMinutes = useMemo(() => {
    const today = new Date().toISOString().slice(0, 10);
    return timeEntries
      .filter((entry) => entry.date === today)
      .reduce((sum, entry) => sum + entry.durationMinutes, 0);
  }, [timeEntries]);

  const isActiveTimer = activeTimerData?.timer?.jobId === job?._id;
  const hasOtherTimer =
    activeTimerData?.timer && activeTimerData?.timer?.jobId !== job?._id;

  if (isLoading) {
    return <Card className="h-64 animate-pulse" />;
  }

  if (!job) {
    return <p className="text-sm text-slate-500">Job not found.</p>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-2xl font-semibold">Work Screen</h2>
          <p className="text-sm text-slate-500">
            {job.clientName} · {job.projectName}
          </p>
        </div>
        <Badge variant="outline">{job.status.replace(/_/g, " ")}</Badge>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Timer</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-wrap gap-4">
              <div className="rounded-lg bg-slate-900 text-white px-6 py-4">
                <p className="text-xs uppercase text-slate-300">Today</p>
                <p className="text-2xl font-semibold">{todayMinutes} min</p>
              </div>
              <div className="rounded-lg border border-slate-200 px-6 py-4">
                <p className="text-xs uppercase text-slate-500">Total</p>
                <p className="text-2xl font-semibold">{totalMinutes} min</p>
              </div>
            </div>
            <div className="flex gap-3">
              <Button
                onClick={() => {
                  if (hasOtherTimer) {
                    toast({
                      title: "Stop current timer first",
                      description: "You already have an active timer running.",
                      variant: "destructive",
                    });
                    return;
                  }
                  startMutation.mutate();
                }}
                disabled={isActiveTimer || job.status === "COMPLETED"}
              >
                Start
              </Button>
              <Button
                variant="outline"
                onClick={() => setStopOpen(true)}
                disabled={!isActiveTimer}
              >
                Stop
              </Button>
              <Button
                variant="secondary"
                onClick={() => submitMutation.mutate()}
                disabled={!!activeTimerData?.timer || job.status === "COMPLETED"}
              >
                Submit for Review
              </Button>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Scope Snapshot</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <p className="font-medium">{job.chapterScope}</p>
            <p className="text-slate-500">Task: {job.taskTypeLabel}</p>
            <p className="text-slate-500">Project ID: {job.projectId}</p>
            {job.adminNote && (
              <div className="rounded-lg bg-slate-50 p-3 text-xs text-slate-600">
                {job.adminNote}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Session Timeline</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {timeEntries.length === 0 ? (
              <p className="text-sm text-slate-500">No sessions logged yet.</p>
            ) : (
              timeEntries.map((entry) => (
                <div key={entry._id} className="rounded-lg border border-slate-200 p-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium">{entry.date}</span>
                    <span className="text-slate-500">{entry.durationMinutes} min</span>
                  </div>
                  <p className="text-xs text-slate-500">{entry.remarks || "No remarks"}</p>
                </div>
              ))
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Review History</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {reviewHistory.length === 0 ? (
              <p className="text-sm text-slate-500">No review activity yet.</p>
            ) : (
              reviewHistory.map((history) => (
                <div key={history._id} className="rounded-lg border border-slate-200 p-3">
                  <p className="text-sm font-medium">
                    {history.action.replace(/_/g, " ")}
                  </p>
                  {history.message && (
                    <p className="text-xs text-slate-500">{history.message}</p>
                  )}
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>

      <Dialog open={stopOpen} onOpenChange={setStopOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Stop timer</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Pages done</label>
              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={() =>
                    setPageCountDone((prev) => Math.max(0, (prev || 0) - 1))
                  }
                >
                  -
                </Button>
                <Input
                  type="number"
                  value={pageCountDone ?? ""}
                  onChange={(event) =>
                    setPageCountDone(
                      event.target.value ? Number(event.target.value) : undefined
                    )
                  }
                />
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={() => setPageCountDone((prev) => (prev || 0) + 1)}
                >
                  +
                </Button>
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Remarks</label>
              <Textarea value={remarks} onChange={(event) => setRemarks(event.target.value)} />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setStopOpen(false)}>
                Cancel
              </Button>
              <Button onClick={() => stopMutation.mutate()} disabled={stopMutation.isPending}>
                Save session
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default EmployeeWorkScreen;
