import { useAuth } from "../../context/auth-context";
import { Button, Form, Input } from "antd";

export const RegisterScreen = () => {
  const { register } = useAuth();

  // HTMLFormElement extends Element
  // JavaScript是面向接口编程，而不是面向对象编程
  // 意思就是当一个对象的内部属性符合一个类型时，他就可以被当做这个类型使用，他完全可以是另外一个不用的类型
  const handleSubmit = (values: { username: string; password: string }) => {
    register(values);
  };
  return (
    <Form onFinish={handleSubmit}>
      <Form.Item
        name={"username"}
        rules={[{ required: true, message: "请输入用户名" }]}
      >
        <Input placeholder={"用户名"} type="text" id={"username"} />
      </Form.Item>
      <Form.Item>
        <Input placeholder={"密码"} type="password" id={"password"} />
      </Form.Item>
      <Form.Item>
        <Button htmlType={"submit"} type={"primary"}>
          注册
        </Button>
      </Form.Item>
    </Form>
  );
};
