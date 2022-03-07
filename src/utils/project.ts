import { useAsync } from "./use-async";
import { Project } from "../types/project";
import { useHttp } from "./http";
import { useEffect } from "react";
import { cleanObject } from "./index";

export const useProjects = (param?: Partial<Project>) => {
  const client = useHttp();
  const { run, ...result } = useAsync<Project[]>(); // Project数组是传入的data属性

  useEffect(() => {
    run(client("projects", { data: cleanObject(param || {}) }));

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [param]);

  return result;
};
