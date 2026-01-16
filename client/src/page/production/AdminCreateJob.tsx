import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createJobMutationFn,
  getEmployeesQueryFn,
  getTaskTypesQueryFn,
} from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";

const steps = ["Job Info", "Scope", "Assign"];

const AdminCreateJob = () => {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({
    clientName: "",
    projectId: "",
    projectName: "",
    chapterScope: "",
    taskTypeCode: "",
    taskTypeLabel: "",
    adminNote: "",
    assignedToEmployeeId: "",
  });

  const queryClient = useQueryClient();
  const { data: taskTypeData } = useQuery({
    queryKey: ["task-types"],
    queryFn: getTaskTypesQueryFn,
  });
  const { data: employeesData } = useQuery({
    queryKey: ["employees"],
    queryFn: getEmployeesQueryFn,
  });

  const taskTypes = taskTypeData?.taskTypes || [];
  const employees = employeesData?.employees || [];

  const createMutation = useMutation({
    mutationFn: () => createJobMutationFn(form),
    onSuccess: () => {
      toast({ title: "Job assigned" });
      queryClient.invalidateQueries({ queryKey: ["review-jobs"] });
      setStep(0);
      setForm({
        clientName: "",
        projectId: "",
        projectName: "",
        chapterScope: "",
        taskTypeCode: "",
        taskTypeLabel: "",
        adminNote: "",
        assignedToEmployeeId: "",
      });
    },
    onError: () => toast({ title: "Unable to assign", variant: "destructive" }),
  });

  const selectedTask = useMemo(
    () => taskTypes.find((task: any) => task.code === form.taskTypeCode),
    [taskTypes, form.taskTypeCode]
  );

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold">Create & Assign Job</h2>
        <p className="text-sm text-slate-500">
          Step through the workflow to assign new production work.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Step {step + 1}: {steps[step]}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex gap-2">
            {steps.map((label, index) => (
              <div
                key={label}
                className={`flex-1 rounded-full h-2 ${
                  index <= step ? "bg-slate-900" : "bg-slate-200"
                }`}
              />
            ))}
          </div>

          {step === 0 && (
            <div className="grid gap-4 md:grid-cols-2">
              <Input
                placeholder="Client name"
                value={form.clientName}
                onChange={(event) =>
                  setForm((prev) => ({ ...prev, clientName: event.target.value }))
                }
              />
              <Input
                placeholder="Project ID"
                value={form.projectId}
                onChange={(event) =>
                  setForm((prev) => ({ ...prev, projectId: event.target.value }))
                }
              />
              <Input
                placeholder="Project name"
                value={form.projectName}
                onChange={(event) =>
                  setForm((prev) => ({ ...prev, projectName: event.target.value }))
                }
              />
            </div>
          )}

          {step === 1 && (
            <div className="space-y-4">
              <Input
                placeholder="Chapter scope (e.g., Chapters 1-3)"
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
                  <SelectValue placeholder="Select task type" />
                </SelectTrigger>
                <SelectContent>
                  {taskTypes.map((task: any) => (
                    <SelectItem key={task._id} value={task.code}>
                      {task.code} · {task.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {selectedTask && (
                <p className="text-xs text-slate-500">
                  Task selected: {selectedTask.label}
                </p>
              )}
              <Textarea
                placeholder="Admin note"
                value={form.adminNote}
                onChange={(event) =>
                  setForm((prev) => ({ ...prev, adminNote: event.target.value }))
                }
              />
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <Select
                value={form.assignedToEmployeeId}
                onValueChange={(value) =>
                  setForm((prev) => ({ ...prev, assignedToEmployeeId: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Assign to employee" />
                </SelectTrigger>
                <SelectContent>
                  {employees.map((employee: any) => (
                    <SelectItem key={employee._id} value={employee._id}>
                      {employee.fullName} · {employee.employeeId}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <div className="rounded-lg border border-slate-200 p-4 text-sm text-slate-600">
                <p>Client: {form.clientName || "-"}</p>
                <p>Project: {form.projectName || "-"}</p>
                <p>Scope: {form.chapterScope || "-"}</p>
                <p>Task: {form.taskTypeLabel || "-"}</p>
              </div>
            </div>
          )}

          <div className="flex justify-between">
            <Button
              variant="outline"
              onClick={() => setStep((prev) => Math.max(0, prev - 1))}
              disabled={step === 0}
            >
              Back
            </Button>
            {step < steps.length - 1 ? (
              <Button onClick={() => setStep((prev) => Math.min(steps.length - 1, prev + 1))}>
                Continue
              </Button>
            ) : (
              <Button onClick={() => createMutation.mutate()} disabled={createMutation.isPending}>
                Create Job
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminCreateJob;
