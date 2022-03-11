import { SearchPanel } from "./search-panel";
import { List } from "./list";
import { useDebounce, useDocumentTitle } from "../../utils";
import styled from "@emotion/styled";
import { Button, Typography } from "antd";
import { useProjects } from "../../utils/project";
import { useUsers } from "../../utils/user";
import { useProjectsSearchParams } from "./util";

export const ProjectListScreen = () => {
  useDocumentTitle("项目列表", false);

  const [param, setParam] = useProjectsSearchParams();
  // 自定义hook的目的是重用代码逻辑，useProject 和 useUsers 里面都使用了 useAsync 和 useHttp 的逻辑
  const {
    isLoading,
    error,
    data: list,
    retry,
  } = useProjects(useDebounce(param, 1000));
  const { data: users } = useUsers();

  return (
    <Container>
      <h1>项目列表</h1>
      <Button onClick={retry}>Retry</Button>
      <SearchPanel users={users || []} param={param} setParam={setParam} />
      {error ? (
        <Typography.Text type={"danger"}>{error.message}</Typography.Text>
      ) : null}
      <List
        refresh={retry}
        loading={isLoading}
        users={users || []}
        dataSource={list || []}
      />
    </Container>
  );
};

ProjectListScreen.whyDidYouRender = false;

const Container = styled.div`
  padding: 3.2rem;
`;
