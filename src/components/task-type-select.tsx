import { IdSelect } from "./id-select";
import { useTaskTypes } from "../utils/task-type";

/**
 * returns a Select component with all task types
 * @param props
 * @constructor
 */
export const TaskTypeSelect = (
  props: React.ComponentProps<typeof IdSelect>
) => {
  const { data: taskTypes } = useTaskTypes();
  return <IdSelect options={taskTypes || []} {...props} />;
};
