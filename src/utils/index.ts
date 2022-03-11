import { useEffect, useRef, useState } from "react";

export const isTruthy = (value: unknown) => (value === 0 ? false : !value);

export const isVoid = (value: unknown) =>
  value === undefined || value === null || value === "";

// 在一个函数里，改变传入的对象本身是不好的
// {[key: string] : unknown} 帮助我们规定传入的参数必须是键值对的形式
export const cleanObject = (object: { [key: string]: unknown }) => {
  const result = { ...object };
  Object.keys(result).forEach((key) => {
    const value = result[key];
    if (isVoid(value)) {
      delete result[key];
    }
  });
  return result;
};

/**
 * 当useEffect的依赖列表为空时，表示他会在component加载时被调用一次
 * 相当于componentDidMount
 * 这个函数会经常被用到，所以我们可以使用一个useMount custom hook来包装useEffect
 * useMount传入一个函数，具体实现在调用useMount是决定
 *
 * custom hook命名必须含有use，否则eslint就不会认为它是一个hook
 * hook只允许在两个地方存在
 * 1. 另外一个hook里
 * 2. component里
 * @param callback
 */
export const useMount = (callback: () => void) => {
  useEffect(() => {
    callback();
    // TODO 依赖项里加上callback会造成无限循环，这个和useCallback和useMemo有关系
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
};

/**
 * Debounce 原理讲解
 * timeout虽然是在函数内定义，但是由return函数返回，
 * 所以他的生命周期没有结束，他的值被存在内存里，这在JavaScript里被称作closure（闭包）
 *
 * 三次log()函数同步执行，
 * 当第一次函数执行时，timeout是undefined，所以在调用setTimeout时它被第一次赋值
 * 当第二次log()函数执行时，timeout有值，所以他被清除，并重新赋值
 * 当第三次log()函数执行时，timeout有值，同理，他被重新赋值
 *
 * 这种debounce函数非常适合在用户频繁返回结果时使用
 * 1. 在搜索框中输入内容
 * 2. 调整窗口大小
 * 3. 拖动鼠标
 * 我们可以不断重置 timeout的值，直到用户停止发送请求，然后一次性返回最终的结果
 */
// const debounce = (func, delay) => {
//   let timeout;
//   return (...param) => {
//     if (timeout) {
//       clearTimeout(timeout);
//     }
//     timeout = setTimeout(function () {
//       func(...param);
//     }, delay);
//   };
// };
//
// const log = debounce(() => console.log("call"), 5000);
// log();
// log();
// log();

/**
 * useDebounce改变了value的更新频率
 * 不管value更新的多么频繁，useDebounce都会在更新结束后一次性返回最后的值
 * update: 使用泛型来规范类型
 * @param value
 * @param delay
 * @returns {unknown}
 */
export const useDebounce = <V>(value: V, delay?: number) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    // 每次在value变化以后，设置一个新的定时器
    const timeout = setTimeout(() => setDebouncedValue(value), delay);
    // 当useEffect再次被调用时，上一次useEffect会执行return的函数
    // 所以我们在这里清除上一次定义的计时器，这样每次value变化时，都会重置计时器
    return () => clearTimeout(timeout);
  }, [value, delay]);

  return debouncedValue;
};

export const useArray = <T>(initialArray: T[]) => {
  const [value, setValue] = useState(initialArray);
  return {
    value,
    add: (item: T) => setValue([...value, item]),
    clear: () => setValue([]),
    removeIndex: (index: number) => {
      const copy = [...value];
      copy.splice(index, 1);
      setValue(copy);
    },
  };
};

export const useDocumentTitle = (
  title: string,
  keepOnUnmount: boolean = true // 当切换页面时是否保留document.title
) => {
  // useRef可以让变量在整个hook方法的生命周期内保持不变
  const oldTitle = useRef(document.title).current;
  useEffect(() => {
    document.title = title;
  }, [title]);

  // 此useEffect的依赖列表为空，所以只会在useDocumentTitle被调用时执行一次
  // 第一次调用的返回函数则会在第二次被调用开始之前执行
  // 如果不指定依赖，oldTitle就不会
  // 这样就可以保留上一次的title
  useEffect(() => {
    return () => {
      if (!keepOnUnmount) {
        console.log(oldTitle);
        document.title = oldTitle;
      }
    };
  }, [keepOnUnmount, oldTitle]);
};

export const resetRoute = () => (window.location.href = window.location.origin);
