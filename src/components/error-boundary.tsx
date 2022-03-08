// 当有错误发生时需要渲染的组件
import React from "react";

type FallbackRender = (props: { error: Error | null }) => React.ReactElement;

// React.Component包含两个参数，props 和 state
export class ErrorBoundary extends React.Component<
  React.PropsWithChildren<{ fallbackRender: FallbackRender }>,
  { error: Error | null }
> {
  state = { error: null };

  // 拥有此方法的组件会成为Error Boundary错误边界
  // 当子组件抛出异常时，此方法会被调用，返回值会被赋给state
  static getDerivedStateFromError(error: Error) {
    return { error };
  }

  // 有错误时渲染fallbackRender
  // 没有错误时正常渲染children
  render() {
    const { error } = this.state;
    const { fallbackRender, children } = this.props;
    if (error) {
      return fallbackRender({ error });
    }
    return children;
  }
}
