import { Rate } from "antd";

interface PinPros extends React.ComponentProps<typeof Rate> {
  checked: boolean;
  onCheckedChange?: (checked: boolean) => void;
}

/**
 * 用于标志项目是否被收藏的组件
 * @param props
 * @constructor
 */
export const Pin = (props: PinPros) => {
  const { checked, onCheckedChange, ...restProps } = props;
  return (
    <Rate
      count={1}
      value={checked ? 1 : 0}
      onChange={(num) => onCheckedChange?.(!!num)}
      {...restProps}
    />
  );
};
