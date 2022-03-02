import { FormEvent } from "react";
import { useAuth } from "../../context/auth-context";

export const LoginScreen = () => {
  const { login, user, register } = useAuth();

  // HTMLFormElement extends Element
  // JavaScript是面向接口编程，而不是面向对象编程
  // 意思就是当一个对象的内部属性符合一个类型时，他就可以被当做这个类型使用，他完全可以是另外一个不用的类型
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const username = (event.currentTarget.elements[0] as HTMLInputElement)
      .value;
    const password = (event.currentTarget.elements[1] as HTMLInputElement)
      .value;
    login({ username, password });
  };
  return (
    <form onSubmit={handleSubmit}>
      {user ? (
        <div>
          登陆成功，用户名： {user.name}
          <br />
          token: {user.token}
        </div>
      ) : null}
      <div>
        <label htmlFor="username">用户名</label>
        <input type="text" id={"username"} />
      </div>
      <div>
        <label htmlFor="password">密码</label>
        <input type="password" id={"password"} />
      </div>
      <button type={"submit"}>注册</button>
    </form>
  );
};
