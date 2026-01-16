import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  approveJobMutationFn,
  getJobDetailQueryFn,
  getJobsQueryFn,
  requestChangesJobMutationFn,
} from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import { Job } from "@/types/production";

const AdminReviewInbox = () => {
  const queryClient = useQueryClient();
  const { data, isLoading } = useQuery({
    queryKey: ["review-inbox"],
    queryFn: () => getJobsQueryFn({ status: "UNDER_REVIEW" }),
  });
  const jobs = (data?.jobs || []) as Job[];

  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [changesOpen, setChangesOpen] = useState(false);
  const [message, setMessage] = useState("");

  const { data: jobDetail } = useQuery({
    queryKey: ["job-detail", selectedJob?._id],
    queryFn: () => getJobDetailQueryFn(selectedJob?._id as string),
    enabled: !!selectedJob?._id,
  });

  const approveMutation = useMutation({
    mutationFn: () => approveJobMutationFn(selectedJob?._id as string),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["review-inbox"] });
      setSelectedJob(null);
      toast({ title: "Job approved" });
    },
  });

  const changesMutation = useMutation({
    mutationFn: () => requestChangesJobMutationFn(selectedJob?._id as string, message),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["review-inbox"] });
      setSelectedJob(null);
      setChangesOpen(false);
      setMessage("");
      toast({ title: "Changes requested" });
    },
  });

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold">Review Inbox</h2>
        <p className="text-sm text-slate-500">
          Review submissions and provide actionable feedback.
        </p>
      </div>

      {isLoading ? (
        <Card className="h-40 animate-pulse" />
      ) : jobs.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center text-sm text-slate-500">
            No jobs awaiting review.
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {jobs.map((job) => (
            <Card key={job._id} onClick={() => setSelectedJob(job)} className="cursor-pointer">
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center justify-between">
                  {job.projectName}
                  <Badge variant="outline">Under Review</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-slate-500 space-y-1">
                <p>{job.clientName}</p>
                <p>{job.chapterScope}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Sheet open={!!selectedJob} onOpenChange={() => setSelectedJob(null)}>
        <SheetContent side="right" className="w-full sm:max-w-lg">
          <SheetHeader>
            <SheetTitle>Job Review</SheetTitle>
          </SheetHeader>
          <div className="mt-6 space-y-4">
            <div>
              <p className="text-xs uppercase text-slate-500">Client</p>
              <p className="font-medium">{selectedJob?.clientName}</p>
            </div>
            <div>
              <p className="text-xs uppercase text-slate-500">Project</p>
              <p className="text-sm font-medium">{selectedJob?.projectName}</p>
              <p className="text-xs text-slate-500">{selectedJob?.projectId}</p>
            </div>
            <div className="rounded-lg border border-slate-200 p-3">
              <p className="text-xs uppercase text-slate-500">Total Time</p>
              <p className="text-lg font-semibold">
                {(jobDetail?.totals?.totalMinutes || 0)} min
              </p>
            </div>
            <div>
              <p className="text-xs uppercase text-slate-500">Time Entries</p>
              <div className="space-y-2 mt-2">
                {(jobDetail?.timeEntries || []).map((entry: any) => (
                  <div key={entry._id} className="rounded-lg border border-slate-200 p-2 text-xs">
                    <div className="flex justify-between">
                      <span>{entry.date}</span>
                      <span>{entry.durationMinutes} min</span>
                    </div>
                    <p className="text-slate-500">{entry.remarks || "No remarks"}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex gap-2">
              <Button onClick={() => approveMutation.mutate()} disabled={approveMutation.isPending}>
                Approve
              </Button>
              <Button variant="outline" onClick={() => setChangesOpen(true)}>
                Request Changes
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>

      <Dialog open={changesOpen} onOpenChange={setChangesOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Request changes</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Textarea
              placeholder="Explain what needs to change"
              value={message}
              onChange={(event) => setMessage(event.target.value)}
            />
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setChangesOpen(false)}>
                Cancel
              </Button>
              <Button onClick={() => changesMutation.mutate()} disabled={changesMutation.isPending}>
                Send request
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminReviewInbox;
