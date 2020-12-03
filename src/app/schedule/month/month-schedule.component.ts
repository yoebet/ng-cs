import {Component, Input} from '@angular/core';

import {MonthSchedule} from '../../model2/month-schedule';

@Component({
  selector: 'app-month-schedule',
  templateUrl: './month-schedule.component.html',
  styleUrls: ['./month-schedule.component.css']
})
export class MonthScheduleComponent {

  @Input() monthSchedule: MonthSchedule;
  @Input() showTitle;

}
