import { TaskHistory } from '@/types';
import TaskHistoryWrapper from '@/wrappers/task_history';
import React from 'react';

interface Props {
  history: TaskHistory;
}

const Completed = ({ history }: Props) => {
  if (history.historyType === 6) {
    return (
      <TaskHistoryWrapper history={history}>
        <div className="w-fit text-center flex-center gap-1">marked the task as completed.</div>
      </TaskHistoryWrapper>
    );
  }
  if (history.historyType === 7) {
    return (
      <TaskHistoryWrapper history={history}>
        <div className="w-fit text-center flex-center gap-1">
          marked the sub task: {history.subTask?.title} as completed.
        </div>
      </TaskHistoryWrapper>
    );
  }
  if (history.historyType === 13)
    // User requested review on PR
    return (
      <TaskHistoryWrapper history={history}>
        <div className="w-fit text-center flex-center gap-1">requested a review on the Pull Request.</div>
      </TaskHistoryWrapper>
    );
  if (history.historyType === 15)
    // User merged PR
    return (
      <TaskHistoryWrapper history={history}>
        <div className="w-fit text-center flex-center gap-1">merged the Pull Request.</div>
      </TaskHistoryWrapper>
    );
  return null;
};

export default Completed;
