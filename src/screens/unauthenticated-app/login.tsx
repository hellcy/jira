import { useAuth } from "../../context/auth-context";
import { Form, Input } from "antd";
import { LongButton } from "./index";

export const LoginScreen = () => {
  const { login } = useAuth();

  // HTMLFormElement extends Element
  // JavaScript是面向接口编程，而不是面向对象编程
  // 意思就是当一个对象的内部属性符合一个类型时，他就可以被当做这个类型使用，他完全可以是另外一个不用的类型
  const handleSubmit = (values: { username: string; password: string }) => {
    login(values);
  };
  return (
    <Form onFinish={handleSubmit}>
      <Form.Item
        name={"username"}
        rules={[{ required: true, message: "请输入用户名" }]}
      >
        <Input placeholder={"用户名"} type="text" id={"username"} />
      </Form.Item>
      <Form.Item
        name={"password"}
        rules={[{ required: true, message: "请输入密码" }]}
      >
        <Input placeholder={"密码"} type="password" id={"password"} />
      </Form.Item>
      <Form.Item>
        <LongButton htmlType={"submit"} type={"primary"}>
          登陆
        </LongButton>
      </Form.Item>
    </Form>
  );
};
