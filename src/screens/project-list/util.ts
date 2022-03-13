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

export const useProjectModal = () => {
  // 读取URL中的 projectCreate 参数
  const [{ projectCreate }, setProjectCreate] = useUrlQueryParam([
    "projectCreate",
  ]);

  const open = () => setProjectCreate({ projectCreate: true });
  const close = () => setProjectCreate({ projectCreate: undefined });

  // 返回tuple的好处： 调用者可以随意设定变量的名字，一个很好的例子就是const [someName, setSomeName] = useState()
  // return [projectCreate === "true", open, close] as const;

  // 返回对象的好处： 无需担心变量的顺序，只要名字正确即可
  return {
    projectModalOpen: projectCreate === "true",
    open,
    close,
  };
};
