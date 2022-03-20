import { useHttp } from "./http";
import { QueryKey, useMutation, useQuery } from "react-query";
import { Epic } from "../types/epic";
import { useAddConfig, useDeleteConfig } from "./use-optimistic-options";

/**
 * get all epics or by projectId
 * @param param
 */
export const useEpics = (param?: Partial<Epic>) => {
  const client = useHttp();

  return useQuery<Epic[]>(["epics", param], () =>
    client("epics", { data: param })
  );
};

/**
 * create new epic
 * @param queryKey
 */
export const useAddEpic = (queryKey: QueryKey) => {
  const client = useHttp();

  return useMutation(
    (params: Partial<Epic>) =>
      client(`epics`, {
        method: "POST",
        data: params,
      }),
    useAddConfig(queryKey)
  );
};

/**
 * delete epic by epicId
 * @param queryKey
 */
export const useDeleteEpic = (queryKey: QueryKey) => {
  const client = useHttp();

  return useMutation(
    ({ id }: { id: number }) =>
      client(`epics/${id}`, {
        method: "DELETE",
      }),
    useDeleteConfig(queryKey)
  );
};
