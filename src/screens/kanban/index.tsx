import { useDocumentTitle } from "../../utils";
import { useKanbans } from "../../utils/kanban";
import { KanbanColumn } from "./kanban-column";
import { useKanbanSearchParams, useProjectInUrl } from "./util";
import styled from "@emotion/styled";
import { SearchPanel } from "./search-panel";

export const KanbanScreen = () => {
  useDocumentTitle("Kanban Screen");

  const { data: currentProject } = useProjectInUrl();
  const { data: kanbans } = useKanbans(useKanbanSearchParams());

  return (
    <div>
      <h1>{currentProject?.name} Kanban</h1>
      <SearchPanel />
      <ColumnsContainer>
        {kanbans?.map((kanban) => (
          <KanbanColumn kanban={kanban} key={kanban.id} />
        ))}
      </ColumnsContainer>
    </div>
  );
};

const ColumnsContainer = styled.div`
  display: flex;
  overflow: hidden;
  margin-right: 2rem;
`;
