import { useQuery } from "@tanstack/react-query";
import { getEmployeeMeQueryFn } from "@/lib/api";

const useProductionMe = () => {
  return useQuery({
    queryKey: ["production-me"],
    queryFn: getEmployeeMeQueryFn,
    retry: false,
  });
};

export default useProductionMe;
