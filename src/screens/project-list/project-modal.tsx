import { Button, Drawer, Form, Input, Spin } from "antd";
import { useProjectModal, useProjectsQueryKey } from "./util";
import { UserSelect } from "../../components/user-select";
import { useAddProject, useEditProject } from "../../utils/project";
import { useForm } from "antd/es/form/Form";
import { useEffect } from "react";
import { ErrorBox } from "../../components/lib";
import styled from "@emotion/styled";

export const ProjectModal = () => {
  const { projectModalOpen, close, editingProject, isLoading } =
    useProjectModal();
  const useMutateProject = editingProject ? useEditProject : useAddProject;

  const {
    mutateAsync,
    error,
    isLoading: mutateLoading,
  } = useMutateProject(useProjectsQueryKey());
  const [form] = useForm();
  const onFinish = (values: any) => {
    mutateAsync({ ...editingProject, ...values }).then(() => {
      form.resetFields();
      close();
    });
  };
  const closeModal = () => {
    form.resetFields();
    close();
  };

  const title = editingProject ? "Editing Project" : "Creating Project";

  useEffect(() => {
    form.setFieldsValue(editingProject);
  }, [editingProject, form]);

  return (
    <Drawer
      forceRender={true}
      width={"100%"}
      visible={projectModalOpen}
      onClose={closeModal}
    >
      <Container>
        {isLoading ? (
          <Spin size={"large"} />
        ) : (
          <>
            <h1>{title}</h1>
            <ErrorBox error={error} />
            <Form
              form={form}
              layout={"vertical"}
              style={{ width: "40rem" }}
              onFinish={onFinish}
            >
              <Form.Item
                label={"Name"}
                name={"name"}
                rules={[
                  { required: true, message: "Please enter project name" },
                ]}
              >
                <Input placeholder={"Please enter project name"} />
              </Form.Item>
              <Form.Item
                label={"Department"}
                name={"organization"}
                rules={[
                  { required: true, message: "Please enter department name" },
                ]}
              >
                <Input placeholder={"Please enter department name"} />
              </Form.Item>
              <Form.Item label={"Manager"} name={"personId"}>
                <UserSelect defaultOptionName={"Manager"} />
              </Form.Item>
              <Form.Item style={{ textAlign: "right" }}>
                <Button
                  loading={mutateLoading}
                  type={"primary"}
                  htmlType={"submit"}
                >
                  Submit
                </Button>
              </Form.Item>
            </Form>
          </>
        )}
      </Container>
    </Drawer>
  );
};

const Container = styled.div`
  height: 80vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;
