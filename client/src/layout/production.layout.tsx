import { Outlet, NavLink } from "react-router-dom";
import { ReactNode, useEffect } from "react";
import useProductionMe from "@/hooks/production/use-production-me";
import { Button } from "@/components/ui/button";
import { getNotificationsQueryFn, logoutEmployeeMutationFn, sendPresenceHeartbeatMutationFn } from "@/lib/api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "@/hooks/use-toast";

const NavItem = ({ to, children }: { to: string; children: ReactNode }) => (
  <NavLink
    to={to}
    className={({ isActive }) =>
      `px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
        isActive
          ? "bg-slate-900 text-white"
          : "text-slate-600 hover:bg-slate-100"
      }`
    }
  >
    {children}
  </NavLink>
);

const ProductionLayout = () => {
  const { data } = useProductionMe();
  const employee = data?.employee;
  const queryClient = useQueryClient();
  const { mutateAsync, isPending } = useMutation({
    mutationFn: logoutEmployeeMutationFn,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["production-me"] });
    },
  });

  const { data: notificationData } = useQuery({
    queryKey: ["notifications"],
    queryFn: getNotificationsQueryFn,
    refetchInterval: 15000,
  });

  const heartbeatMutation = useMutation({
    mutationFn: sendPresenceHeartbeatMutationFn,
  });

  useEffect(() => {
    const interval = setInterval(() => {
      heartbeatMutation.mutate();
    }, 15000);
    return () => clearInterval(interval);
  }, [heartbeatMutation]);

  const handleLogout = async () => {
    try {
      await mutateAsync();
      toast({ title: "Signed out" });
    } catch {
      toast({ title: "Unable to sign out", variant: "destructive" });
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <header className="border-b bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
              TeamSync Production Workflow
            </p>
            <h1 className="text-lg font-semibold">Publishing Operations</h1>
          </div>
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-600">
              {notificationData?.notifications?.filter((item: any) => !item.isRead).length || 0} new
            </div>
            <div className="text-right">
              <p className="text-sm font-medium">{employee?.fullName}</p>
              <p className="text-xs text-slate-500">
                {employee?.employeeId} · {employee?.role}
              </p>
            </div>
            <Button variant="outline" size="sm" onClick={handleLogout} disabled={isPending}>
              Sign out
            </Button>
          </div>
        </div>
      </header>

      <div className="mx-auto flex max-w-6xl gap-6 px-6 py-6">
        <aside className="w-56 space-y-2">
          {employee?.role === "ADMIN" ? (
            <>
              <NavItem to="/production/admin">Dashboard</NavItem>
              <NavItem to="/production/admin/create-job">Create & Assign</NavItem>
              <NavItem to="/production/admin/review">Review Inbox</NavItem>
              <NavItem to="/production/admin/employees">Employees</NavItem>
              <NavItem to="/production/admin/jobs">Jobs Management</NavItem>
            </>
          ) : (
            <>
              <NavItem to="/production/employee">My Work Queue</NavItem>
              <NavItem to="/production/employee/completed">Completed Work</NavItem>
            </>
          )}
        </aside>
        <main className="flex-1">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default ProductionLayout;
