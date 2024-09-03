import moment from 'moment';

const getDisplayTime = (date: Date, space: boolean = true): string => {
  var str = '';
  var fromNow = moment(date).fromNow(true);

  var index = 0;
  for (index = 0; index < fromNow.length; index++) if (fromNow.charAt(index) == ' ') break;

  var first = fromNow.substring(0, index);
  var second = fromNow.substring(index);
  if (first) {
    if (first == 'a') str += '1';
    else if (first == 'an') str += '1';
    else str += first;
  }
  if (space) str += ' ';
  if (second) {
    if (second.includes('second')) str += 'S';
    else if (second.includes('minute')) str += 'Min';
    else if (second.includes('hour')) str += 'H';
    else if (second.includes('day')) str += 'D';
    else if (second.includes('week')) str += 'W';
    else if (second.includes('month')) str += 'M';
    else if (second.includes('year')) str += 'Y';
  }
  return str;
};

export default getDisplayTime;
