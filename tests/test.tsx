// react hook 与 闭包 经典的坑
import { useEffect, useState } from "react";
import { useMount } from "../src/utils";

/**
 * 在下面的组件中，无论点击button多少遍，当组件卸载时，以及setInterval每次被调用时
 * num被打印出来的值都是0
 * 这是因为在组件加载时useMount和useEffect函数就会得到num的引用，并且会一直保持
 *
 * 如何保证在useEffect里面的num的值始终保持最新？
 * 可以将num加到useEffect的依赖列表中，这样每当num的值发生变化时，useEffect都会重新定义一遍新的num
 * @constructor
 */
export const Test = () => {
  const [num, setNum] = useState(0);

  const add = () => setNum(num + 1);

  useMount(() => {
    setInterval(() => {
      console.log("num in setInterval: " + num); // num is always 0
    }, 1000);
  });

  useEffect(() => {
    return () => {
      console.log(num); // num is always 0
    };
  }, []);

  return (
    <div>
      <button onClick={add}>add num</button>
    </div>
  );
};

export const CorrectTest = () => {
  const [num, setNum] = useState(0);

  const add = () => setNum(num + 1);

  useEffect(() => {
    return () => {
      console.log("unmount: " + num);
    };
  }, [num]);

  return (
    <div>
      <button onClick={add}>add num</button>
    </div>
  );
};

/**
 * 在每一次执行effect / add函数时，都会建立一条新的message
 * message所引用了num的值也不一样
 * 虽然只有一个num，但是message记录下了不同时刻num的值
 * 所以最终unmount这个变量所引用的函数，也即是test函数的返回值（也是一个函数）
 * 这个unmount函数里面的message代表的是第一条message，那时num的值是 1
 */
const test = () => {
  let num = 0;

  const effect = () => {
    num += 1;
    const message = `num value in message:  ${num}`;

    return function unmount() {
      console.log(message);
    };
  };

  return effect;
};

// 执行test，返回effect函数
const add = test();
// 执行effect函数，返回引用了message1的unmount函数
const unmount = add();
// 在一次执行effect函数，返回引用了message2的unmount函数
add();
// message3
add();
add();
add();
unmount(); // 在这里会打印出 1
