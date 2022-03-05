import { ProjectListScreen } from "./screens/project-list";
import { useAuth } from "./context/auth-context";
import styled from "@emotion/styled";

/**
 * grid 和 flex 各自的应用场景
 * 1。 要考虑，是一维布局还是二维布局
 * 一般来说，一维布局用flex，二维布局用grid
 * 2。是从内容出发还是从布局出发？
 * 从内容出发：你先有一组内容（一般数量不固定），然后希望他们均匀的分布在容器中，由内容自己的大小决定占据的空间
 * 从布局出发：先规划网格（数量一般比较固定），然后再把元素往里面填充
 * 从内容出发一般使用flex
 * 从布局出发一般使用grid
 * @constructor
 */

export const AuthenticatedApp = () => {
  const { logout } = useAuth();
  return (
    <Container>
      <Header>
        <HeaderLeft>
          <h3>Logo</h3>
          <h3>项目</h3>
          <h3>用户</h3>
        </HeaderLeft>
        <HeaderRight>
          <button onClick={logout}>登出</button>
        </HeaderRight>
      </Header>
      <Main>
        <ProjectListScreen />
      </Main>
    </Container>
  );
};

/**
 * 首先，display: grid 表明这是一个grid容器，其子元素布局符合grid规则。
 * 其次，grid-template-rows: 6rem 1fr 6rem 表明grid容器中的布局，
 * 这里表示里面有3行，第1行, 第3行高度为 6rem ， 第2行高度为 1 fraction， 布局中所有行的fraction平均分配剩余空间
 * 因为这里我们只有1个fraction，所以第二行会占用所有的剩余空间
 *
 * grid-template-columns 同理
 *
 * grid-template-area 规定了grid子元素的布局
 */
const Container = styled.div`
  grid-template-rows: 6rem 1fr;
  height: 100vh;
`;

// grid-area 用来给grid子元素起名字
const Header = styled.header`
  grid-area: header;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

const HeaderLeft = styled.div`
  display: flex;
  align-items: center;
`;
const HeaderRight = styled.div``;

const Main = styled.main``;
