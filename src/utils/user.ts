import { useAsync } from "./use-async";
import { useHttp } from "./http";
import { useMount } from "./index";
import { User } from "../types/user";

export const useUsers = () => {
  const client = useHttp();
  const { run, ...result } = useAsync<User[]>(); // User数组是传入的data属性

  useMount(() => {
    run(client("users"));
  });

  return result;
};
