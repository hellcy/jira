import { useUrlQueryParam } from "../../utils/url";
import { useMemo } from "react";

export const useProjectsSearchParams = () => {
  const [param, setParam] = useUrlQueryParam(["name", "personId"]);

  // 从浏览器中来的所有参数类型都是string，我们需要把personId穿换成number
  return [
    useMemo(
      () => ({
        ...param,
        personId: Number(param.personId) || undefined,
      }),
      [param]
    ),
    setParam,
  ] as const;
};
