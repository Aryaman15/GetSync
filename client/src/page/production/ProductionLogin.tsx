import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { previewEmployeeMutationFn, loginEmployeeMutationFn } from "@/lib/api";
import { toast } from "@/hooks/use-toast";
import { EmployeeRole } from "@/types/production";

const ProductionLogin = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState<1 | 2>(1);
  const [employeeId, setEmployeeId] = useState("");
  const [password, setPassword] = useState("");
  const [preview, setPreview] = useState<{
    fullName: string;
    phone: string;
    role: EmployeeRole;
  } | null>(null);

  const previewMutation = useMutation({
    mutationFn: previewEmployeeMutationFn,
    onSuccess: (data) => {
      if (!data.exists) {
        toast({ title: "Employee not found", variant: "destructive" });
        return;
      }
      setPreview({
        fullName: data.fullName,
        phone: data.phone,
        role: data.role,
      });
      setStep(2);
    },
    onError: () => toast({ title: "Unable to preview", variant: "destructive" }),
  });

  const loginMutation = useMutation({
    mutationFn: loginEmployeeMutationFn,
    onSuccess: (data) => {
      toast({ title: "Welcome back", description: "Session started." });
      if (data.employee?.role === "ADMIN") {
        navigate("/production/admin");
      } else {
        navigate("/production/employee");
      }
    },
    onError: () =>
      toast({ title: "Invalid credentials", variant: "destructive" }),
  });

  const handlePreview = (event: React.FormEvent) => {
    event.preventDefault();
    previewMutation.mutate({ employeeId });
  };

  const handleLogin = (event: React.FormEvent) => {
    event.preventDefault();
    loginMutation.mutate({ employeeId, password });
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center px-4">
      <Card className="w-full max-w-md bg-slate-900 border-slate-800">
        <CardHeader>
          <CardTitle className="text-xl">Publishing Workflow Login</CardTitle>
          <p className="text-sm text-slate-400">
            Secure entry for production teams and admins.
          </p>
        </CardHeader>
        <CardContent>
          {step === 1 ? (
            <form onSubmit={handlePreview} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="employeeId">Employee ID</Label>
                <Input
                  id="employeeId"
                  value={employeeId}
                  onChange={(event) => setEmployeeId(event.target.value)}
                  placeholder="EMP-101"
                  className="bg-slate-950 border-slate-800"
                />
              </div>
              <Button
                type="submit"
                className="w-full"
                disabled={previewMutation.isPending}
              >
                Continue
              </Button>
            </form>
          ) : (
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="rounded-lg border border-slate-800 bg-slate-950 p-3">
                <p className="text-sm font-medium">{preview?.fullName}</p>
                <p className="text-xs text-slate-400">
                  {preview?.phone} · {preview?.role}
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="••••••••"
                  className="bg-slate-950 border-slate-800"
                />
              </div>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1"
                  onClick={() => setStep(1)}
                >
                  Back
                </Button>
                <Button
                  type="submit"
                  className="flex-1"
                  disabled={loginMutation.isPending}
                >
                  Sign in
                </Button>
              </div>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ProductionLogin;
