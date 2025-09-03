import { getCourses } from "@/services/getCourses";
import { useQuery } from "@tanstack/react-query";

export function useCourses() {
  return useQuery({
    queryKey: ["courses"],
    queryFn: getCourses,
    staleTime: 60_000,
  });
}
