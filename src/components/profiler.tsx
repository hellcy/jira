import React from "react";
import { ProfilerOnRenderCallback, ProfilerProps } from "react";

type Props = {
  metadata?: any;
  phases?: ("mount" | "update")[];
} & Omit<ProfilerProps, "onRender">;

let queue: unknown[] = [];

const sendProfileQueue = () => {
  if (!queue.length) {
    return;
  }

  const queueToSend = [...queue];
  queue = [];
  console.log(queueToSend);
};

setInterval(sendProfileQueue, 5000);

/**
 * reportProfile 每次在组件被render的时候都会被调用
 * 调用的时候会往queue里面push当前组件的信息
 * queue每5秒钟会将所有queue中的信息打印到console中并清空queue (在这里模拟将信息汇报给服务器,打印到日志中)
 * @param metadata
 * @param phases
 * @param props
 * @constructor
 */
export const Profiler = ({ metadata, phases, ...props }: Props) => {
  const reportProfile: ProfilerOnRenderCallback = (
    id,
    phase,
    actualDuration,
    baseDuration,
    startTime,
    commitTime,
    interactions
  ) => {
    if (!phases || phases.includes(phase)) {
      queue.push({
        id,
        phase,
        actualDuration,
        baseDuration,
        startTime,
        commitTime,
        interactions,
        metadata,
      });
    }
  };

  return <React.Profiler onRender={reportProfile} {...props} />;
};
