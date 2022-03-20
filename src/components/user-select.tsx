import { useUsers } from "../utils/user";
import { IdSelect } from "./id-select";

/**
 * returns a Select component with all users
 * @param props
 * @constructor
 */
export const UserSelect = (props: React.ComponentProps<typeof IdSelect>) => {
  const { data: users } = useUsers();
  return <IdSelect options={users || []} {...props} />;
};
