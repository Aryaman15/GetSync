import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getJobsQueryFn,
  getEmployeesQueryFn,
  getTaskTypesQueryFn,
  updateJobMutationFn,
} from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import { Job } from "@/types/production";

const AdminJobsManagement = () => {
  const [keyword, setKeyword] = useState("");
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [form, setForm] = useState({
    chapterScope: "",
    taskTypeCode: "",
    taskTypeLabel: "",
    assignedToEmployeeId: "",
  });

  const queryClient = useQueryClient();
  const { data } = useQuery({
    queryKey: ["jobs", keyword],
    queryFn: () => getJobsQueryFn({ clientName: keyword }),
  });

  const { data: taskTypeData } = useQuery({
    queryKey: ["task-types"],
    queryFn: getTaskTypesQueryFn,
  });

  const { data: employeesData } = useQuery({
    queryKey: ["employees"],
    queryFn: getEmployeesQueryFn,
  });

  const jobs = (data?.jobs || []) as Job[];
  const taskTypes = taskTypeData?.taskTypes || [];
  const employees = employeesData?.employees || [];

  const updateMutation = useMutation({
    mutationFn: () => updateJobMutationFn(selectedJob?._id as string, form),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["jobs"] });
      setSelectedJob(null);
      toast({ title: "Job updated" });
    },
  });

  const handleOpen = (job: Job) => {
    setSelectedJob(job);
    setForm({
      chapterScope: job.chapterScope,
      taskTypeCode: job.taskTypeCode,
      taskTypeLabel: job.taskTypeLabel,
      assignedToEmployeeId:
        typeof job.assignedToEmployeeId === "string"
          ? job.assignedToEmployeeId
          : job.assignedToEmployeeId._id,
    });
  };

  const filtered = useMemo(() => jobs, [jobs]);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold">Jobs Management</h2>
        <p className="text-sm text-slate-500">
          Search and update job assignments without spreadsheet overhead.
        </p>
      </div>

      <Card>
        <CardContent className="p-4">
          <Input
            placeholder="Search by client name"
            value={keyword}
            onChange={(event) => setKeyword(event.target.value)}
          />
        </CardContent>
      </Card>

      {filtered.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center text-sm text-slate-500">
            No jobs match this filter.
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {filtered.map((job) => (
            <Card key={job._id} onClick={() => handleOpen(job)} className="cursor-pointer">
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center justify-between">
                  {job.projectName}
                  <Badge variant="outline">{job.status.replace(/_/g, " ")}</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-slate-500">
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
            <SheetTitle>Edit Job</SheetTitle>
          </SheetHeader>
          {selectedJob && (
            <div className="mt-6 space-y-4">
              <Input
                value={form.chapterScope}
                onChange={(event) =>
                  setForm((prev) => ({ ...prev, chapterScope: event.target.value }))
                }
              />
              <Select
                value={form.taskTypeCode}
                onValueChange={(value) =>
                  setForm((prev) => ({
                    ...prev,
                    taskTypeCode: value,
                    taskTypeLabel:
                      taskTypes.find((task: any) => task.code === value)?.label || "",
                  }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Task type" />
                </SelectTrigger>
                <SelectContent>
                  {taskTypes.map((task: any) => (
                    <SelectItem key={task._id} value={task.code}>
                      {task.code} · {task.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select
                value={form.assignedToEmployeeId}
                onValueChange={(value) =>
                  setForm((prev) => ({ ...prev, assignedToEmployeeId: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Reassign employee" />
                </SelectTrigger>
                <SelectContent>
                  {employees.map((employee: any) => (
                    <SelectItem key={employee._id} value={employee._id}>
                      {employee.fullName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button
                onClick={() => updateMutation.mutate()}
                disabled={selectedJob.status === "COMPLETED"}
              >
                Save changes
              </Button>
              {selectedJob.status === "COMPLETED" && (
                <p className="text-xs text-slate-500">
                  Completed jobs cannot be edited.
                </p>
              )}
            </div>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default AdminJobsManagement;
