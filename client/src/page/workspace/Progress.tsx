import { Permissions } from "@/constant";
import withPermission from "@/hoc/with-permission";

const Progress = () => {
  return (
    <div className="w-full h-full flex-col space-y-8 pt-3">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Progress</h2>
          <p className="text-muted-foreground">
            Track workspace progress and completion trends here.
          </p>
        </div>
      </div>
    </div>
  );
};

const ProgressWithPermission = withPermission(
  Progress,
  Permissions.MANAGE_WORKSPACE_SETTINGS
);

export default ProgressWithPermission;
