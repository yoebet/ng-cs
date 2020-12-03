import {Component, Input} from '@angular/core';

import {TermSchedule} from '../../model2/term-schedule';

@Component({
  selector: 'app-term-schedule',
  templateUrl: './term-schedule.component.html',
  styleUrls: ['./term-schedule.component.css']
})
export class TermScheduleComponent {

  @Input() termSchedule: TermSchedule;
  @Input() showTitle;

}
