import qs from "qs";
import * as auth from "auth-provider";
import { useAuth } from "../context/auth-context";

const apiUrl = process.env.REACT_APP_API_URL;

/**
 * token和data不存在于RequestInit中
 * 所以我们定义一个新的类型Config继承自RequestInit
 * Config类型带有token和data参数
 */
interface Config extends RequestInit {
  token?: string;
  data?: object;
}

// http函数的第二个参数Config是有默认值的，这样它就变成了一个可选参数
// 调用http函数时不必要传入第二个参数
export const http = async (
  endpoint: string,
  { data, token, headers, ...customConfig }: Config = {}
) => {
  // 虽然在这里method hard coded为GET
  // 但是我们的customConfig是最后一个参数，如果customConfig里面有method参数，可以覆盖之前的method的值
  const config = {
    method: "GET",
    headers: {
      Authorization: token ? `Bearer ${token}` : "",
      "Content-Type": data ? "application/json" : "",
    },
    ...customConfig,
  };

  // 当method为GET时，传入的data会放在URL里
  // 当method为POST时，传入的data会放在body里
  if (config.method.toUpperCase() === "GET") {
    endpoint += `?${qs.stringify(data)}`;
  } else {
    config.body = JSON.stringify(data || {});
  }

  // fetch API在服务器端返回状态不为2xx时并不会抛出异常，只会在断网时才会主动抛出异常
  // 所以我们需要在返回状态不为2xx时手动抛出异常 (Promise.reject)
  // axios 可 fetch 的表现形式不一样，axios会根据服务器返回的状态值选择是否抛出异常
  return window
    .fetch(`${apiUrl}/${endpoint}`, config)
    .then(async (response) => {
      if (response.status === 401) {
        await auth.logout();
        window.location.reload();
        return Promise.reject({ message: "请重新登陆" });
      }

      const data = await response.json();
      if (response.ok) {
        return data;
      } else {
        console.log("http throws promise");
        return Promise.reject(data);
      }
    });
};

/**
 * 从AuthProvider里获取user token
 * 并调用http方法
 * JS中的typeof 是在runtime时运行的
 * TS中的typeof 是在静态环境中运行的
 *
 * Parameters<T> 的作用是提取方法中的参数类型，并以一个tuple的形式返回
 */
export const useHttp = () => {
  const { user } = useAuth();
  // 讲解TypeScript Utility Types
  // 用范型给它传入一个其他类型，utility type对这个类型进行某种操作
  return (...[endpoint, config]: Parameters<typeof http>) =>
    http(endpoint, { ...config, token: user?.token });
};

// 类型别名在很多情况下可以和interface互换
// interface Person {
//   name: string
// }
// type Person = {name: string}
// const xiaoMing: Person = {name: 'name'}

// 类型别名， interface 在这种情况下无法替代type
// type FavoriteNumber = string | number
// let jackFavoriteNumber: FavoriteNumber = '6'

// interface也无法实现utility type
// 当你想要改变类型的属性，但是又不能直接更改类型定义时，可以使用Partial或者Omit utility type
// Partial 会把对象中的所有属性变成optional的
// Omit 会让你删除一个或者多个属性
// type Person = {
//   name: string,
//   age: number
// }
//
// const xiaoMing: Partial<Person> = {age: 15}
// const xiaoHong: Omit<Person, 'name' | 'age'> = {}
