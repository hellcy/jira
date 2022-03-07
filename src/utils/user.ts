import { User } from "../screens/project-list/search-panel";
import { useAsync } from "./use-async";
import { useHttp } from "./http";
import { useMount } from "./index";

export const useUsers = () => {
  const client = useHttp();
  const { run, ...result } = useAsync<User[]>(); // User数组是传入的data属性

  useMount(() => {
    run(client("users"));
  });

  return result;
};
