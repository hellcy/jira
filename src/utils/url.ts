import { URLSearchParamsInit, useSearchParams } from "react-router-dom";
import { useMemo } from "react";
import { cleanObject } from "./index";

/**
 * 返回页面中url的参数值
 *
 * 什么是useMemo？
 * useMemo接受一个创造函数和一个依赖列表，只有当依赖列表中的依赖变化时
 * useMemo才会调用创造函数返回一个新的返回值（对象）
 *
 * 为什么要使用useMemo？
 * useUrlQueryParam函数每次都会创建一个新的对象
 * 这个新的对象param被传入 useDebounce 中，并放入了useEffect hook 的依赖列表中
 * 由于param并不是组件的状态，所以param会导致组件重新渲染，useUrlQueryParam再次创建新的 param
 * 最终导致 ProjectListScreen 组件被无限渲染
 *
 * 当使用useMemo之后，由于searchParams从第一次创建之后就没有改变，所以useUrlQueryParam也不会创建新的param对象
 * 无限渲染就不会发生
 *
 * 基本类型 - 可以放到依赖列表
 * 组件状态变量 - 可以放到依赖列表
 * 非组件状态的引用对象 - 尽量不要放到依赖列表
 */
export const useUrlQueryParam = <K extends string>(keys: K[]) => {
  const [searchParams, setSearchParam] = useSearchParams();

  return [
    useMemo(
      () =>
        keys.reduce((prev, key) => {
          return { ...prev, [key]: searchParams.get(key) || "" };
        }, {} as { [key in K]: string }),
      [searchParams]
    ),
    // 不直接使用setSearchParam的原因是我们希望从setParam中传入的参数只在searchParam中
    (params: Partial<{ [key in K]: unknown }>) => {
      // 1。 将searchParams变成一个可遍历的对象，这样就可以使用spread ... 操作符
      // 2。 使用params更新可能的值
      // 3。 使用cleanObject清除不需要的值
      // 4。 最后把新的params放在setSearchParam函数中返回
      const o = cleanObject({
        ...Object.fromEntries(searchParams),
        ...params,
      }) as URLSearchParamsInit;
      return setSearchParam(o);
    },
  ] as const;
};
