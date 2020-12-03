import {groupBy, flatten} from 'underscore';

import {Schedule} from '../model/schedule';
import {WeekSchedule} from './week-schedule';
import {MonthDim} from './month-dim';
import {DaySchedule} from './day-schedule';
import {ScheduleDatasource} from './schedule-datasource';

export class MonthSchedule extends ScheduleDatasource {

  monthDim: MonthDim;
  weekSchedules: WeekSchedule[];

  constructor(monthDim: MonthDim, schedules: Schedule[]) {
    super();

    this.monthDim = monthDim;
    const weeks = monthDim.weeks;

    const weekSchedules: WeekSchedule[] = [];

    const weekGroups = groupBy(schedules, 'weekno');
    for (const week of weeks) {
      const schedulesOfWeek: Schedule[] = weekGroups['' + week.weekno] || [];
      weekSchedules.push(new WeekSchedule(week, schedulesOfWeek));
    }

    this.weekSchedules = weekSchedules;
  }

  get daySchedules(): DaySchedule[] {
    if (!this.weekSchedules) {
      return null;
    }
    return flatten(this.weekSchedules.map(ws => ws.daySchedules));
  }

  get daySchedulesWithLessons(): DaySchedule[] {
    return this.daySchedules.filter(ds => ds.lessons.find(l => l));
  }
}
