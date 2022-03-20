import { SearchPanel } from "./search-panel";
import { List } from "./list";
import { useDebounce, useDocumentTitle } from "../../utils";
import { useProjects } from "../../utils/project";
import { useUsers } from "../../utils/user";
import { useProjectModal, useProjectsSearchParams } from "./util";
import {
  ButtonNoPadding,
  ErrorBox,
  Row,
  ScreenContainer,
} from "../../components/lib";
import { Profiler } from "../../components/profiler";

export const ProjectListScreen = () => {
  useDocumentTitle("项目列表", false);

  const { open } = useProjectModal();
  const [param, setParam] = useProjectsSearchParams();
  // 自定义hook的目的是重用代码逻辑，useProject 和 useUsers 里面都使用了 useAsync 和 useHttp 的逻辑
  const {
    isLoading,
    error,
    data: list,
  } = useProjects(useDebounce(param, 1000));
  const { data: users } = useUsers();

  return (
    <Profiler id={"Project list"}>
      <ScreenContainer>
        <Row between={true}>
          <h1>项目列表</h1>
          <ButtonNoPadding onClick={() => open()} type={"link"}>
            Create Project
          </ButtonNoPadding>
        </Row>
        <SearchPanel users={users || []} param={param} setParam={setParam} />
        <ErrorBox error={error} />
        <List loading={isLoading} users={users || []} dataSource={list || []} />
      </ScreenContainer>
    </Profiler>
  );
};

ProjectListScreen.whyDidYouRender = false;
