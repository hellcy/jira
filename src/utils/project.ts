import { useAsync } from "./use-async";
import { Project } from "../types/project";
import { useHttp } from "./http";
import { useEffect } from "react";
import { cleanObject } from "./index";

/**
 * 获取project list
 * @param param
 */
export const useProjects = (param?: Partial<Project>) => {
  const client = useHttp();
  const { run, ...result } = useAsync<Project[]>(); // Project数组是传入的data属性

  const fetchProjects = () =>
    client("projects", { data: cleanObject(param || {}) });

  useEffect(() => {
    run(fetchProjects(), { retry: fetchProjects });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [param]);

  return result;
};

/**
 * 更新project by id
 */
export const useEditProject = () => {
  const { run, ...asyncResult } = useAsync();
  const client = useHttp();
  const mutate = (params: Partial<Project>) => {
    return run(
      client(`projects/${params.id}`, {
        data: params,
        method: "PATCH",
      })
    );
  };
  return { mutate, ...asyncResult };
};

/**
 * 添加project
 */
export const useAddProject = () => {
  const { run, ...asyncResult } = useAsync();
  const client = useHttp();
  const mutate = (params: Partial<Project>) => {
    return run(
      client(`projects/${params.id}`, {
        data: params,
        method: "POST",
      })
    );
  };
  return { mutate, ...asyncResult };
};
