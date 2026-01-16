import API from "./axios-client";
import { AllMembersInWorkspaceResponseType, AllProjectPayloadType, AllProjectResponseType, AllTaskPayloadType, AllTaskResponseType, AllWorkspaceResponseType, AnalyticsResponseType, ChangeWorkspaceMemberRoleType, CreateProjectPayloadType, CreateTaskPayloadType, CreateWorkspaceResponseType, CreateWorkspaceType, CurrentUserResponseType, EditProjectPayloadType, EditTaskPayloadType, EditWorkspaceType, LoginResponseType, loginType, ProjectByIdPayloadType, ProjectResponseType, registerType, WorkspaceByIdResponseType } from "@/types/api.type";

export const loginMutationFn = async (
  data: loginType
): Promise<LoginResponseType> => {
  const response = await API.post("/auth/login", data);
  return response.data;
};


export const registerMutationFn = async (data: registerType) =>
  await API.post("/auth/register", data);

export const logoutMutationFn = async () => await API.post("/auth/logout");

export const getCurrentUserQueryFn =
  async (): Promise<CurrentUserResponseType> => {
    const response = await API.get(`/user/current`);
    return response.data;
  };

// ******** Production Workflow ********
export const previewEmployeeMutationFn = async (data: { employeeId: string }) => {
  const response = await API.post("/auth/preview", data);
  return response.data;
};

export const previewEmployeeByRoleMutationFn = async (
  role: "ADMIN" | "EMPLOYEE",
  data: { employeeId: string }
) => {
  const route = role === "ADMIN" ? "/auth/preview/admin" : "/auth/preview/employee";
  const response = await API.post(route, data);
  return response.data;
};

export const loginEmployeeMutationFn = async (data: {
  employeeId: string;
  password: string;
}) => {
  const response = await API.post("/auth/login", data);
  return response.data;
};

export const loginEmployeeByRoleMutationFn = async (
  role: "ADMIN" | "EMPLOYEE",
  data: { employeeId: string; password: string }
) => {
  const route = role === "ADMIN" ? "/auth/login/admin" : "/auth/login/employee";
  const response = await API.post(route, data);
  return response.data;
};

export const logoutEmployeeMutationFn = async () => {
  const response = await API.post("/auth/logout");
  return response.data;
};

export const getEmployeeMeQueryFn = async () => {
  const response = await API.get("/auth/me");
  return response.data;
};

export const getTaskTypesQueryFn = async () => {
  const response = await API.get("/task-types");
  return response.data;
};

export const createJobMutationFn = async (data: Record<string, unknown>) => {
  const response = await API.post("/jobs", data);
  return response.data;
};

export const getJobsQueryFn = async (params?: Record<string, string>) => {
  const response = await API.get("/jobs", { params });
  return response.data;
};

export const updateJobMutationFn = async (jobId: string, data: Record<string, unknown>) => {
  const response = await API.patch(`/jobs/${jobId}`, data);
  return response.data;
};

export const getEmployeeJobsQueryFn = async (params?: Record<string, string>) => {
  const response = await API.get("/employee/jobs", { params });
  return response.data;
};

export const getJobDetailQueryFn = async (jobId: string) => {
  const response = await API.get(`/jobs/${jobId}`);
  return response.data;
};

export const submitJobMutationFn = async (jobId: string) => {
  const response = await API.post(`/jobs/${jobId}/submit`);
  return response.data;
};

export const approveJobMutationFn = async (jobId: string) => {
  const response = await API.post(`/jobs/${jobId}/review/approve`);
  return response.data;
};

export const requestChangesJobMutationFn = async (jobId: string, message: string) => {
  const response = await API.post(`/jobs/${jobId}/review/changes-requested`, { message });
  return response.data;
};

export const startTimerMutationFn = async (jobId: string) => {
  const response = await API.post(`/jobs/${jobId}/timer/start`);
  return response.data;
};

export const stopTimerMutationFn = async (
  jobId: string,
  data: { pageCountDone?: number; remarks?: string }
) => {
  const response = await API.post(`/jobs/${jobId}/timer/stop`, data);
  return response.data;
};

export const getActiveTimerQueryFn = async () => {
  const response = await API.get(`/timers/active`);
  return response.data;
};

export const getNotificationsQueryFn = async () => {
  const response = await API.get(`/notifications`);
  return response.data;
};

export const sendPresenceHeartbeatMutationFn = async () => {
  const response = await API.post(`/presence/heartbeat`);
  return response.data;
};

export const markNotificationReadMutationFn = async (id: string) => {
  const response = await API.post(`/notifications/${id}/read`);
  return response.data;
};

export const markAllNotificationsReadMutationFn = async () => {
  const response = await API.post(`/notifications/read-all`);
  return response.data;
};

export const getEmployeesQueryFn = async () => {
  const response = await API.get(`/employees`);
  return response.data;
};

export const getEmployeeInsightsQueryFn = async (employeeId: string) => {
  const response = await API.get(`/employees/${employeeId}/insights`);
  return response.data;
};

export const getSummaryReportQueryFn = async () => {
  const response = await API.get(`/reports/summary`);
  return response.data;
};

//********* WORKSPACE ****************
//************* */

export const createWorkspaceMutationFn = async (
  data: CreateWorkspaceType
): Promise<CreateWorkspaceResponseType> => {
  const response = await API.post(`/workspace/create/new`, data);
  return response.data;
};
export const editWorkspaceMutationFn = async ({
  workspaceId,
  data,
}: EditWorkspaceType) => {
  const response = await API.put(`/workspace/update/${workspaceId}`, data);
  return response.data;
};

export const getWorkspaceByIdQueryFn = async (
  workspaceId: string
): Promise<WorkspaceByIdResponseType> => {
  const response = await API.get(`/workspace/${workspaceId}`);
  return response.data;
};

export const getAllWorkspacesUserIsMemberQueryFn =
  async (): Promise<AllWorkspaceResponseType> => {
    const response = await API.get(`/workspace/all`);
    return response.data;
  };


export const getWorkspaceAnalyticsQueryFn = async (
  workspaceId: string
): Promise<AnalyticsResponseType> => {
  const response = await API.get(`/workspace/analytics/${workspaceId}`);
  return response.data;
};

export const getMembersInWorkspaceQueryFn = async (
  workspaceId: string
): Promise<AllMembersInWorkspaceResponseType> => {
  const response = await API.get(`/workspace/members/${workspaceId}`);
  return response.data;
};

export const changeWorkspaceMemberRoleMutationFn = async ({
  workspaceId,
  data,
}: ChangeWorkspaceMemberRoleType) => {
  const response = await API.put(
    `/workspace/change/member/role/${workspaceId}`,
    data
  );
  return response.data;
};

export const deleteWorkspaceMutationFn = async (
  workspaceId: string
): Promise<{
  message: string;
  currentWorkspace: string;
}> => {
  const response = await API.delete(`/workspace/delete/${workspaceId}`);
  return response.data;
};

//*******MEMBER ****************

export const invitedUserJoinWorkspaceMutationFn = async (
  iniviteCode: string
): Promise<{
  message: string;
  workspaceId: string;
}> => {
  const response = await API.post(`/member/workspace/${iniviteCode}/join`);
  return response.data;
};
//********* */
//********* PROJECTS
export const createProjectMutationFn = async ({
  workspaceId,
  data,
}: CreateProjectPayloadType): Promise<ProjectResponseType> => {
  const response = await API.post(
    `/project/workspace/${workspaceId}/create`,
    data
  );
  return response.data;
};

export const editProjectMutationFn = async ({
  projectId,
  workspaceId,
  data,
}: EditProjectPayloadType): Promise<ProjectResponseType> => {
  const response = await API.put(
    `/project/${projectId}/workspace/${workspaceId}/update`,
    data
  );
  return response.data;
};

export const getProjectsInWorkspaceQueryFn = async ({
  workspaceId,
  pageSize = 10,
  pageNumber = 1,
}: AllProjectPayloadType): Promise<AllProjectResponseType> => {
  const response = await API.get(
    `/project/workspace/${workspaceId}/all?pageSize=${pageSize}&pageNumber=${pageNumber}`
  );
  return response.data;
};
export const getProjectByIdQueryFn = async ({
  workspaceId,
  projectId,
}: ProjectByIdPayloadType): Promise<ProjectResponseType> => {
  const response = await API.get(
    `/project/${projectId}/workspace/${workspaceId}`
  );
  return response.data;
};
export const getProjectAnalyticsQueryFn = async ({
  workspaceId,
  projectId,
}: ProjectByIdPayloadType): Promise<AnalyticsResponseType> => {
  const response = await API.get(
    `/project/${projectId}/workspace/${workspaceId}/analytics`
  );
  return response.data;
};


export const deleteProjectMutationFn = async ({
  workspaceId,
  projectId,
}: ProjectByIdPayloadType): Promise<{
  message: string;
}> => {
  const response = await API.delete(
    `/project/${projectId}/workspace/${workspaceId}/delete`
  );
  return response.data;
};

//*******TASKS ********************************
//************************* */

export const createTaskMutationFn = async ({
  workspaceId,
  projectId,
  data,
}: CreateTaskPayloadType) => {
  const response = await API.post(
    `/task/project/${projectId}/workspace/${workspaceId}/create`,
    data
  );
  return response.data;
};


export const editTaskMutationFn = async ({
  taskId,
  projectId,
  workspaceId,
  data,
}: EditTaskPayloadType): Promise<{message: string;}> => {
  const response = await API.put(
    `/task/${taskId}/project/${projectId}/workspace/${workspaceId}/update/`,
    data
  );
  return response.data;
};

export const getAllTasksQueryFn = async ({
  workspaceId,
  keyword,
  projectId,
  assignedTo,
  priority,
  status,
  dueDate,
  pageNumber,
  pageSize,
}: AllTaskPayloadType): Promise<AllTaskResponseType> => {
  const baseUrl = `/task/workspace/${workspaceId}/all`;

  const queryParams = new URLSearchParams();
  if (keyword) queryParams.append("keyword", keyword);
  if (projectId) queryParams.append("projectId", projectId);
  if (assignedTo) queryParams.append("assignedTo", assignedTo);
  if (priority) queryParams.append("priority", priority);
  if (status) queryParams.append("status", status);
  if (dueDate) queryParams.append("dueDate", dueDate);
  if (pageNumber) queryParams.append("pageNumber", pageNumber?.toString());
  if (pageSize) queryParams.append("pageSize", pageSize?.toString());

  const url = queryParams.toString() ? `${baseUrl}?${queryParams}` : baseUrl;
  const response = await API.get(url);
  return response.data;
};

export const deleteTaskMutationFn=async({
  workspaceId,
  taskId,
}:{
  workspaceId:string;
  taskId:string;
}):Promise<{
  message:string;
}>=>{
  const response=await API.delete(
    `task/${taskId}/workspace/${workspaceId}/delete`
  );
  return response.data;
}
