import { Navigate, Outlet, useLocation } from "react-router-dom";
import useProductionMe from "@/hooks/production/use-production-me";
import { Skeleton } from "@/components/ui/skeleton";

const ProductionProtectedRoute = () => {
  const location = useLocation();
  const { data, isLoading } = useProductionMe();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="space-y-4 w-80">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-6 w-3/4" />
          <Skeleton className="h-6 w-2/3" />
        </div>
      </div>
    );
  }

  if (!data?.employee) {
    return (
      <Navigate to="/production/login/employee" state={{ from: location }} replace />
    );
  }

  return <Outlet />;
};

export default ProductionProtectedRoute;
