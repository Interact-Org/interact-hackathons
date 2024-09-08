import { TaskHistory } from '@/types';
import TaskHistoryWrapper from '@/wrappers/task_history';
import React from 'react';

interface Props {
  history: TaskHistory;
}

const Edited = ({ history }: Props) => {
  if (history.historyType === 1) {
    return (
      <TaskHistoryWrapper history={history}>
        <div className="w-fit text-center flex-center gap-1">edited Task Details.</div>
      </TaskHistoryWrapper>
    );
  }
  return null;
};

export default Edited;
