import { useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { templatesApi, usersApi } from "@/api";

export function usePalmTemplatesViewModel() {
  const queryClient = useQueryClient();
  const { data: templatesRes, isLoading: isLoadingTemplates } = useQuery({
    queryKey: ["templates"],
    queryFn: () => templatesApi.getTemplates(),
  });

  const { data: usersRes } = useQuery({
    queryKey: ["users"],
    queryFn: () => usersApi.getUsers(),
  });

  const templatesList = useMemo(() => templatesRes?.data || [], [templatesRes?.data]);
  const usersMap = useMemo(() => new Map(usersRes?.data?.map(u => [u.id, u]) || []), [usersRes?.data]);

  const revokeMutation = useMutation({
    mutationFn: (args: { userId: string; templateId: string }) =>
      templatesApi.deleteTemplate(args.userId, args.templateId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["templates"] });
    },
  });

  const handleRevokeTemplate = (userId: string, templateId: string) => {
    if (window.confirm("Are you sure you want to revoke this palm template?")) {
      revokeMutation.mutate({ userId, templateId });
    }
  };

  return {
    templatesList,
    usersMap,
    isLoadingTemplates,
    handleRevokeTemplate,
    isRevoking: revokeMutation.isPending,
  };
}
