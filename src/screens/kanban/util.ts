import { useLocation } from "react-router";
import { useProject } from "../../utils/project";
import { useUrlQueryParam } from "../../utils/url";
import { useMemo } from "react";

export const useProjectIdInUrl = () => {
  const { pathname } = useLocation();

  // get project id from url
  const id = pathname.match(/projects\/(\d+)/)?.[1];
  return Number(id);
};

// get project information by id
export const useProjectInUrl = () => useProject(useProjectIdInUrl());

export const useKanbanSearchParams = () => ({ projectId: useProjectIdInUrl() });

export const useKanbansQueryKey = () => ["kanbans", useKanbanSearchParams()];

/**
 * get search params from URL
 * return params as an object
 */
export const useTasksSearchParams = () => {
  // read params from URL
  const [param, setParam] = useUrlQueryParam([
    "name",
    "typeId",
    "processorId",
    "tagId",
  ]);
  const projectId = useProjectIdInUrl();
  // 如果组件重新渲染,useMemo将从缓存中提取变量值,而不会重复计算处理数据
  // 通过保持变量的相同对象引用,useMemo可以有效地避免不必要的渲染
  return useMemo(
    () => ({
      projectId,
      typeId: Number(param.typeId) || undefined,
      processorId: Number(param.processorId) || undefined,
      tagId: Number(param.tagId) || undefined,
      name: param.name,
    }),
    [projectId, param]
  );
};

export const useTasksQueryKey = () => ["tasks", useTasksSearchParams()];
