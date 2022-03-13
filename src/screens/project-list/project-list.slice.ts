import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "../../store";

interface State {
  projectModalOpen: boolean;
}

const initialState: State = {
  projectModalOpen: false,
};

/**
 * slice是reducer的一个切片
 * 此文件是用来管理project list相关的状态的切片
 *
 * 潜在的疑问
 * 在reducer中我们直接更改了state的值，但是react和redux处理状态的方式是比较引用
 * 我们并没有创建一个新的state，也就是说state的引用地址并没有改变
 * 那么redux会不会re-render组件呢？ 答案是会的， 为什么？
 *
 * 因为 redux toolkit 用到了一个 Immer 的第三方库，他会替我们创造state的复制
 * 这样允许我们在原数据上进行更改，而不会造成不重新渲染的问题
 */
export const projectListSlice = createSlice({
  name: "projectListSlice",
  initialState,
  reducers: {
    openProjectModal(state) {
      state.projectModalOpen = true;
    },
    closeProjectModal(state) {
      state.projectModalOpen = false;
    },
  },
});

// list of actions to change the state
export const projectListActions = projectListSlice.actions;

export const selectProjectModalOpen = (state: RootState) =>
  state.projectList.projectModalOpen;
