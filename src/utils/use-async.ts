import { useState } from "react";
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

// 用户也可以传入一个状态
export const useAsync = <D>(
  initialState?: State<D>,
  initialConfig?: typeof defaultConfig
) => {
  // 用户传入的state状态的优先级高于默认的状态，所以将用户传入参数放在最后
  const [state, setState] = useState<State<D>>({
    ...defaultInitialState,
    ...initialState,
  });

  const mountedRef = useMountedRef();

  // useState直接传入函数的含义是：惰性初始化，所以要用useState保存函数不能直接传入函数
  const [retry, setRetry] = useState(() => () => {});

  const config = { ...defaultConfig, ...initialConfig };

  // 当请求已经结束时
  const setData = (data: D) =>
    setState({
      data,
      stat: "success",
      error: null,
    });

  // 当请求结束并且返回错误时
  const setError = (error: Error) => {
    setState({
      error,
      stat: "error",
      data: null,
    });
  };

  // run用来触发异步请求
  const run = (
    promise: Promise<D>,
    runConfig?: { retry: () => Promise<D> }
  ) => {
    if (!promise || !promise.then) {
      throw new Error("请传入Promise类型数据");
    }

    setRetry(() => () => {
      if (runConfig?.retry) {
        run(runConfig?.retry(), runConfig);
      }
    });

    // 将状态改成loading
    setState({ ...state, stat: "loading" });

    return promise
      .then((data) => {
        if (mountedRef.current) setData(data);
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
  };

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
