import { QueryKey, useQueryClient } from "react-query";
import { Project } from "../types/project";

export const useConfig = (
  queryKey: QueryKey,
  callback: (target: any, old?: any[]) => any[]
) => {
  const queryClient = useQueryClient();
  return {
    onSuccess: () => queryClient.invalidateQueries(queryKey),
    async onMutate(target: any) {
      // 如果服务器请求失败，我们需要rollback本地乐观更新的值，所以需要previousItems
      const previousItems = queryClient.getQueryData(queryKey);

      // 乐观更新本地project的值
      queryClient.setQueryData(queryKey, (old?: any[]) => {
        return callback(target, old);
      });

      return { previousItems };
    },

    // rollback projects
    onError(error: any, newItem: any, context: any) {
      queryClient.setQueryData(
        queryKey,
        (context as { previousItems: Project[] }).previousItems
      );
    },
  };
};

export const useDeleteConfig = (queryKey: QueryKey) =>
  useConfig(
    queryKey,
    (target, old) => old?.filter((item) => item.id !== target.id) || []
  );

export const useEditConfig = (queryKey: QueryKey) =>
  useConfig(
    queryKey,
    (target, old) =>
      old?.map((item) =>
        item.id === target.id ? { ...item, ...target } : item
      ) || []
  );

export const useAddConfig = (queryKey: QueryKey) =>
  useConfig(queryKey, (target, old) => (old ? [...old, target] : []));
