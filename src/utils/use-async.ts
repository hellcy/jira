import { useState } from "react";

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

// 用户也可以传入一个状态
export const useAsync = <D>(initialState?: State<D>) => {
  // 用户传入的state状态的优先级高于默认的状态，所以将用户传入参数放在最后
  const [state, setState] = useState<State<D>>({
    ...defaultInitialState,
    ...initialState,
  });

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
  const run = (promise: Promise<D>) => {
    if (!promise || !promise.then) {
      throw new Error("请传入Promise类型数据");
    }

    // 将状态改成loading
    setState({ ...state, stat: "loading" });

    return promise
      .then((data) => {
        setData(data);
        return data;
      })
      .catch((error) => {
        setError(error);
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
    ...state,
  };
};
