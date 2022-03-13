import { useLocation } from "react-router";
import { useProject } from "../../utils/project";

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

export const useTasksSearchParams = () => ({ projectId: useProjectIdInUrl() });

export const useTasksQueryKey = () => ["tasks", useTasksSearchParams()];
