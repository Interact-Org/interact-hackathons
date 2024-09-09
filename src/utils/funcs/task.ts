import { SubTask, Task } from '@/types';
import moment from 'moment';

const getCompletionPercentage = (task: Task) => {
  var percentage = 0;
  if (task.isCompleted) percentage = 100;
  else if (task.subTasks) {
    if (task.subTasks.length == 0) percentage = 0;
    else {
      var completedSubtasks = 0;
      task.subTasks.forEach(subtask => {
        if (subtask.isCompleted) completedSubtasks++;
      });
      percentage = (completedSubtasks / task.subTasks.length) * 100;
    }
  }
  return parseFloat(percentage.toFixed(2));
};

const danger = '#fbbebe';
const warn = '#fbf9be';
const success = '#bffbbe';

export const getTaskPriorityColor = (task: Task | SubTask) => (task.priority == 'high' ? danger : task.priority == 'medium' ? warn : success);

export const getTaskDeadlineColor = (task: Task | SubTask) =>
  moment(task.deadline).isBefore(moment()) ? danger : moment(task.deadline).subtract(1, 'day').isBefore(moment()) ? warn : success;

export const getTaskDifficultyColor = (task: Task | SubTask) =>
  task.difficulty == 'expert' ? danger : task.difficulty == 'proficient' ? warn : success;

export const getTaskStatusColor = (task: Task) => (task.isCompleted ? success : getCompletionPercentage(task) > 0 ? warn : danger);

export const getSubtaskColor = (subtask: SubTask) => (subtask.isCompleted ? success : danger);

export const getPRStatusColor = (task: Task) => {
  switch (task.prStatus) {
    case -1:
      return '#478eeb86';
    case 0:
    case 1:
      return warn;
    case 2:
      return danger;
    case 3:
      return success;
  }
};

export default getCompletionPercentage;
