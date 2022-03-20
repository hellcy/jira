import { useProjectInUrl } from "../kanban/util";
import { useDeleteEpic, useEpics } from "../../utils/epic";
import { useEpicSearchParams, useEpicsQueryKey } from "./util";
import { Row, ScreenContainer } from "../../components/lib";
import { Button, List, Modal } from "antd";
import dayjs from "dayjs";
import { useTasks } from "../../utils/task";
import { Link } from "react-router-dom";
import { CreateEpic } from "./create-epic";
import { useState } from "react";
import { Epic } from "../../types/epic";

export const EpicScreen = () => {
  const { data: currentProject } = useProjectInUrl();
  const { data: epics } = useEpics(useEpicSearchParams());
  const { data: tasks } = useTasks({ projectId: currentProject?.id });
  const { mutate: deleteEpic } = useDeleteEpic(useEpicsQueryKey());

  const [epicCreateOpen, setEpicCreateOpen] = useState(false);

  const confirmDeleteEpic = (epic: Epic) => {
    Modal.confirm({
      title: `Are you sure to delete epic：${epic.name}`,
      content: "Click to confirm",
      okText: "Confirm",
      onOk() {
        deleteEpic({ id: epic.id });
      },
    });
  };

  return (
    <ScreenContainer>
      <Row between={true}>
        <h1>{currentProject?.name} epic</h1>
        <Button onClick={() => setEpicCreateOpen(true)} type={"link"}>
          Create epic
        </Button>
      </Row>
      <List
        style={{ overflow: "scroll" }}
        dataSource={epics}
        itemLayout={"vertical"}
        renderItem={(epic) => (
          <List.Item>
            <List.Item.Meta
              title={
                <Row between={true}>
                  <span>{epic.name}</span>
                  <Button type={"link"} onClick={() => confirmDeleteEpic(epic)}>
                    Delete
                  </Button>
                </Row>
              }
              description={
                <div>
                  <div>
                    Start time: {dayjs(epic.start).format("YYYY-MM-DD")}
                  </div>
                  <div>End time: {dayjs(epic.end).format("YYYY-MM-DD")}</div>
                </div>
              }
            />
            <div>
              {tasks
                ?.filter((task) => task.epicId === epic.id)
                .map((task) => (
                  <Link
                    to={`/projects/${currentProject?.id}/kanban?editingTaskId=${task.id}`}
                    key={task.id}
                  >
                    {task.name}
                  </Link>
                ))}
            </div>
          </List.Item>
        )}
      />
      <CreateEpic
        onClose={() => setEpicCreateOpen(false)}
        visible={epicCreateOpen}
      />
    </ScreenContainer>
  );
};
