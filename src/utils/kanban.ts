import { useHttp } from "./http";
import { QueryKey, useMutation, useQuery } from "react-query";
import { Kanban } from "../types/kanban";
import { useAddConfig, useDeleteConfig } from "./use-optimistic-options";

/**
 * get all kanbans or by projectId
 * @param param
 */
export const useKanbans = (param?: Partial<Kanban>) => {
  const client = useHttp();

  return useQuery<Kanban[]>(["kanbans", param], () =>
    client("kanbans", { data: param })
  );
};

/**
 * create new kanban
 * @param queryKey
 */
export const useAddKanban = (queryKey: QueryKey) => {
  const client = useHttp();

  return useMutation(
    (params: Partial<Kanban>) =>
      client(`kanbans`, {
        method: "POST",
        data: params,
      }),
    useAddConfig(queryKey)
  );
};

/**
 * delete kanban by kanbanId
 * @param queryKey
 */
export const useDeleteKanban = (queryKey: QueryKey) => {
  const client = useHttp();

  return useMutation(
    ({ id }: { id: number }) =>
      client(`kanbans/${id}`, {
        method: "DELETE",
      }),
    useDeleteConfig(queryKey)
  );
};
