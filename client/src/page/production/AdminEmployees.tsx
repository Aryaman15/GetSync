import { useQuery } from "@tanstack/react-query";
import { getEmployeesQueryFn } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";

const isOnline = (lastSeenAt?: string | null) => {
  if (!lastSeenAt) return false;
  const diff = Date.now() - new Date(lastSeenAt).getTime();
  return diff < 5 * 60 * 1000;
};

const AdminEmployees = () => {
  const navigate = useNavigate();
  const { data, isLoading } = useQuery({
    queryKey: ["employees"],
    queryFn: getEmployeesQueryFn,
  });

  const employees = data?.employees || [];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold">Employees</h2>
        <p className="text-sm text-slate-500">
          View workforce status and drill into productivity insights.
        </p>
      </div>
      {isLoading ? (
        <Card className="h-40 animate-pulse" />
      ) : employees.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center text-sm text-slate-500">
            No employees found.
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {employees.map((employee: any) => (
            <Card
              key={employee._id}
              className="cursor-pointer"
              onClick={() => navigate(`/production/admin/employees/${employee._id}`)}
            >
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center justify-between">
                  {employee.fullName}
                  <Badge variant={isOnline(employee.lastSeenAt) ? "default" : "outline"}>
                    {isOnline(employee.lastSeenAt) ? "Online" : "Offline"}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-slate-500">
                <p>{employee.employeeId}</p>
                <p>{employee.phone}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminEmployees;
