import { TaskHistory } from '@/types';
import TaskHistoryWrapper from '@/wrappers/task_history';
import React from 'react';

interface Props {
  history: TaskHistory;
}

const Deleted = ({ history }: Props) => {
  switch (history.historyType) {
    case 10: // User deleted task
      return (
        <TaskHistoryWrapper history={history}>
          <div className="w-fit text-center flex-center gap-1">
            deleted the task: <b>{history.deletedText}</b>.
          </div>
        </TaskHistoryWrapper>
      );
    case 11: // User deleted subtask
      return (
        <TaskHistoryWrapper history={history}>
          <div className="w-fit text-center flex-center gap-1">
            deleted the subtask: <b>{history.deletedText}</b>.
          </div>
        </TaskHistoryWrapper>
      );
    case 14: // User closed PR
      return (
        <TaskHistoryWrapper history={history}>
          <div className="w-fit text-center flex-center gap-1">closed the Pull Request.</div>
        </TaskHistoryWrapper>
      );
    default:
      return null;
  }
};

export default Deleted;
