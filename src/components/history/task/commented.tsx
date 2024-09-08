import { TaskHistory } from '@/types';
import TaskHistoryWrapper from '@/wrappers/task_history';
import React from 'react';

interface Props {
  history: TaskHistory;
}

const Commented = ({ history }: Props) => {
  if (history.historyType === 5) {
    return (
      <TaskHistoryWrapper history={history}>
        <div className="w-fit text-center flex-center gap-1">commented on the task.</div>
      </TaskHistoryWrapper>
    );
  }
  return null;
};

export default Commented;
