/**
 * 在真实环境中，如果使用了firebase或者auth0等第三方服务的话
 * 本文件就不需要开发了
 */
import { User } from "./screens/project-list/search-panel";

const apiUrl = process.env.REACT_APP_API_URL;

const localStorageKey = "__auth_provider_token__";

export const getToken = () => window.localStorage.getItem(localStorageKey);

export const handleUserResponse = ({ user }: { user: User }) => {
  window.localStorage.setItem(localStorageKey, user.token || "");
  return user;
};

/**
 * 当用户登陆或者注册时，把service worker后端传回来的token放到localStorage里面
 * More about fetch
 * fetch会返回一个Promise，里面包含一个Response
 * 我们可以使用then()去resolveResponse，返回特定的对象，现在我们返回的是User对象
 * @param data
 */
export const login = (data: { username: string; password: string }) => {
  return fetch(`${apiUrl}/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  }).then(async (response) => {
    if (response.ok) {
      return handleUserResponse(await response.json());
    } else {
      return Promise.reject(data);
    }
  });
};

export const register = (data: { username: string; password: string }) => {
  return fetch(`${apiUrl}/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  }).then(async (response) => {
    if (response.ok) {
      return handleUserResponse(await response.json());
    } else {
      return Promise.reject(data);
    }
  });
};

/**
 * 当用户登出时，remove存放在localStorage里面的用户token
 * 当使用async时，函数会返回一个Promise
 */
export const logout = async () => {
  window.localStorage.removeItem(localStorageKey);
};
