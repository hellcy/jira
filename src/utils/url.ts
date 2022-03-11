import { useSearchParams } from "react-router-dom";
import { useMemo } from "react";

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
    setSearchParam,
  ] as const;
};
