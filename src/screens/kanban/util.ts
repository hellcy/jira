import { useLocation } from "react-router";
import { useProject } from "../../utils/project";
import { useUrlQueryParam } from "../../utils/url";
import { useCallback, useMemo } from "react";
import { useTask } from "../../utils/task";
import { QueryKey, useMutation } from "react-query";
import { useHttp } from "../../utils/http";
import { useEditConfig } from "../../utils/use-optimistic-options";
import { Task } from "../../types/task";

/**
 * get projectId in URL
 */
export const useProjectIdInUrl = () => {
  const { pathname } = useLocation();

  // get project id from url
  const id = pathname.match(/projects\/(\d+)/)?.[1];
  return Number(id);
};

/**
 * get project using projectId in URL
 */
export const useProjectInUrl = () => useProject(useProjectIdInUrl());

/**
 * get kanban search params (projectId)
 */
export const useKanbanSearchParams = () => ({ projectId: useProjectIdInUrl() });

/**
 * get task search params from URL (name, typeId, processorId, tagId)
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

export const useKanbansQueryKey = () => ["kanbans", useKanbanSearchParams()];

export const useTasksQueryKey = () => ["tasks", useTasksSearchParams()];

/**
 * 1. get task information (taskId, taskData, isLoading)
 * 2. get methods for edit task modal (e.g. startEdit, close)
 */
export const useTasksModal = () => {
  const [{ editingTaskId }, setEditingTaskId] = useUrlQueryParam([
    "editingTaskId",
  ]);
  const { data: editingTask, isLoading } = useTask(Number(editingTaskId));

  // useCallback 因为我们要返回这些方法
  const startEdit = useCallback(
    (id: number) => {
      setEditingTaskId({ editingTaskId: id });
    },
    [setEditingTaskId]
  );

  const close = useCallback(() => {
    setEditingTaskId({ editingTaskId: "" });
  }, [setEditingTaskId]);

  return {
    editingTaskId,
    editingTask,
    startEdit,
    close,
    isLoading,
  };
};

/**
 * Edit task
 * @param queryKey
 */
export const useEditTask = (queryKey: QueryKey) => {
  const client = useHttp();

  return useMutation(
    (params: Partial<Task>) =>
      client(`tasks/${params.id}`, {
        method: "PATCH",
        data: params,
      }),
    useEditConfig(queryKey)
  );
};
