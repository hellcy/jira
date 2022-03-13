import { Divider, List, Popover, Typography } from "antd";
import { useProjects } from "../utils/project";
import styled from "@emotion/styled";
import { useDispatch } from "react-redux";
import { ButtonNoPadding } from "./lib";
import { projectListActions } from "../screens/project-list/project-list.slice";

export const ProjectPopover = () => {
  const dispatch = useDispatch();
  const { data: projects } = useProjects();
  const pinnedProjects = projects?.filter((project) => project.pin);

  const content = (
    <ContentContainer>
      <Typography.Text type={"secondary"}>Pinned Project</Typography.Text>
      <List>
        {pinnedProjects?.map((project) => (
          <List.Item>
            <List.Item.Meta title={project.name} />
          </List.Item>
        ))}
      </List>
      <Divider />
      <ButtonNoPadding
        onClick={() => dispatch(projectListActions.openProjectModal())}
        type={"link"}
      >
        Create Project
      </ButtonNoPadding>
    </ContentContainer>
  );
  return (
    <Popover placement={"bottom"} content={content}>
      <span>Project</span>
    </Popover>
  );
};

const ContentContainer = styled.div`
  min-width: 30rem;
`;
