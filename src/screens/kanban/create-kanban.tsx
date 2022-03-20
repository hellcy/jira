import { useState } from "react";
import { useKanbansQueryKey, useProjectIdInUrl } from "./util";
import { useAddKanban } from "../../utils/kanban";
import { Input } from "antd";
import { Container } from "./kanban-column";

export const CreateKanban = () => {
  const [name, setName] = useState("");
  const projectId = useProjectIdInUrl();
  const { mutateAsync: addKanban } = useAddKanban(useKanbansQueryKey());

  const submit = async () => {
    await addKanban({ name, projectId });
    // reset Kanban name
    setName("");
  };

  return (
    <Container>
      <Input
        size={"large"}
        placeholder={"New Kanban Name"}
        onPressEnter={submit}
        value={name}
        onChange={(event) => setName(event.target.value)}
      />
    </Container>
  );
};
