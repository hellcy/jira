import { useEffect, useState } from "react";

export const isTruthy = (value: unknown) => (value === 0 ? false : !value);

// 在一个函数里，改变传入的对象本身是不好的
export const cleanObject = (object: object) => {
  const result = { ...object };
  Object.keys(result).forEach((key) => {
    // @ts-ignore
    const value = result[key];
    if (isTruthy(value)) {
      // @ts-ignore
      delete result[key];
    }
  });
  return result;
};

/**
 * custom hook命名必须含有use，否则eslint就不会认为它是一个hook
 * hook只允许在两个地方存在
 * 1. 另外一个hook里
 * 2. component里
 * @param callback
 */
export const useMount = (callback: () => void) => {
  useEffect(() => {
    callback();
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
 * @param value
 * @param delay
 * @returns {unknown}
 */
export const useDebounce = (value: unknown, delay?: number) => {
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
