import { useAsync } from "utils/use-async";
import { act, renderHook } from "@testing-library/react-hooks";

const defaultState: ReturnType<typeof useAsync> = {
  stat: "idle",
  data: null,
  error: null,

  isIdle: true,
  isLoading: false,
  isError: false,
  isSuccess: false,

  run: expect.any(Function),
  setData: expect.any(Function),
  setError: expect.any(Function),
  retry: expect.any(Function),
};

const loadingState: ReturnType<typeof useAsync> = {
  ...defaultState,
  stat: "loading",
  isIdle: false,
  isLoading: true,
};

const successState: ReturnType<typeof useAsync> = {
  ...defaultState,
  stat: "success",
  isIdle: false,
  isSuccess: true,
};

test("useAsync 可以异步处理", async () => {
  // promise有三种状态,pending,resolve 和 error
  // 当下面的promise被创建时,它处于pending的状态
  let resolve: any, reject;
  const promise = new Promise((res, rej) => {
    resolve = res;
    reject = rej;
  });

  const { result } = renderHook(() => useAsync());

  expect(result.current).toEqual(defaultState);

  let p: Promise<any>;

  act(() => {
    p = result.current.run(promise);
  });

  expect(result.current).toEqual(loadingState);

  const resolvedValue = { mockedValue: "resolved" };

  // 现在这个promise在resolved的状态
  await act(async () => {
    resolve(resolvedValue);
    await p;
  });

  expect(result.current).toEqual({
    ...successState,
    data: resolvedValue,
  });
});
