import { useCallback, useReducer, useState } from "react";
import { useMountedRef } from "./index";

// error 和 data 为可选属性
interface State<D> {
  error: Error | null;
  data: D | null;
  // 表示异步操作的四种状态
  stat: "idle" | "loading" | "error" | "success";
}

// 默认的初始状态
const defaultInitialState: State<null> = {
  stat: "idle",
  data: null,
  error: null,
};

const defaultConfig = {
  throwOnError: false,
};

const useSafeDispatch = <T>(dispatch: (...args: T[]) => void) => {
  const mountedRef = useMountedRef();

  return useCallback(
    (...args: T[]) => (mountedRef.current ? dispatch(...args) : void 0),
    [dispatch, mountedRef]
  );
};

// 用户也可以传入一个状态
// useState适合用于单个状态
// useReducer适合用于多个相互之间影响的状态
export const useAsync = <D>(
  initialState?: State<D>,
  initialConfig?: typeof defaultConfig
) => {
  // 用户传入的state状态的优先级高于默认的状态，所以将用户传入参数放在最后
  const [state, dispatch] = useReducer(
    (state: State<D>, action: Partial<State<D>>) => ({ ...state, ...action }),
    {
      ...defaultInitialState,
      ...initialState,
    }
  );

  const safeDispatch = useSafeDispatch(dispatch);

  // useState直接传入函数的含义是：惰性初始化，所以要用useState保存函数不能直接传入函数
  const [retry, setRetry] = useState(() => () => {});

  const config = { ...defaultConfig, ...initialConfig };

  // 当请求已经结束时
  const setData = useCallback(
    (data: D) =>
      safeDispatch({
        data,
        stat: "success",
        error: null,
      }),
    [safeDispatch]
  );

  // 当请求结束并且返回错误时
  const setError = useCallback(
    (error: Error) => {
      safeDispatch({
        error,
        stat: "error",
        data: null,
      });
    },
    [safeDispatch]
  );

  // run用来触发异步请求
  // 当需要把非基本类型的变量放到依赖列表中时，就需要使用到 useCallback 或者 useMemo
  // Tips：当使用 hook 返回函数时，很大概率函数会被用在依赖列表中，这时候就需要把这些函数加入 useCallback 或者 useMemo
  const run = useCallback(
    (promise: Promise<D>, runConfig?: { retry: () => Promise<D> }) => {
      if (!promise || !promise.then) {
        throw new Error("请传入Promise类型数据");
      }

      setRetry(() => () => {
        if (runConfig?.retry) {
          run(runConfig?.retry(), runConfig);
        }
      });

      // 将状态改成loading
      //setState({ ...state, stat: "loading" });
      safeDispatch({ stat: "loading" });

      return promise
        .then((data) => {
          setData(data);
          return data;
        })
        .catch((error) => {
          setError(error);
          // 使用config来决定是抛出异常还是返回error属性
          // 一般在异步状态下返回Error， 在同步状态下抛出异常
          if (config.throwOnError) {
            console.log("run catches and throws error");
            return Promise.reject(error);
          }
          return error;
        });
    },
    [config.throwOnError, setData, setError, safeDispatch]
  );

  return {
    isIdle: state.stat === "idle",
    isLoading: state.stat === "loading",
    isError: state.stat === "error",
    isSuccess: state.stat === "success",
    run,
    setData,
    setError,
    retry,
    ...state,
  };
};
