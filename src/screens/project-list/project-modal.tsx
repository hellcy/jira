import { Button, Drawer } from "antd";

export const ProjectModal = (props: {
  projectModalOpen: boolean;
  onClose: () => void;
}) => {
  return (
    <Drawer
      width={"100%"}
      visible={props.projectModalOpen}
      onClose={props.onClose}
    >
      <h1>Project Model</h1>
      <Button onClick={props.onClose}>关闭</Button>
    </Drawer>
  );
};
