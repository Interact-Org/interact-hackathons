import { TaskHistory } from '@/types';
import TaskHistoryWrapper from '@/wrappers/task_history';
import React from 'react';

interface Props {
  history: TaskHistory;
}

const Created = ({ history }: Props) => {
  switch (history.historyType) {
    case -1: // User created this Task
      return (
        <TaskHistoryWrapper history={history}>
          <div className="w-fit text-center flex-center gap-1">created this Task! 🎉</div>
        </TaskHistoryWrapper>
      );
    case 2: // User created subtask
      return (
        <TaskHistoryWrapper history={history}>
          <div className="w-fit text-center flex-center gap-1">
            created a subtask <b>{history.subTask.title}</b>.
          </div>
        </TaskHistoryWrapper>
      );
    case 12: // User created PR
      return (
        <TaskHistoryWrapper history={history}>
          <div className="w-fit text-center flex-center gap-1">created a Pull Request.</div>
        </TaskHistoryWrapper>
      );
    case 16: // User reopened PR
      return (
        <TaskHistoryWrapper history={history}>
          <div className="w-fit text-center flex-center gap-1">reopened the Pull Request.</div>
        </TaskHistoryWrapper>
      );
    default:
      return null;
  }
};

export default Created;
