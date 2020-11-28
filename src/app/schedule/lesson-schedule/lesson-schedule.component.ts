import {Component, OnInit, Input} from '@angular/core';

import {Schedule} from '../../model/schedule';
import {Site} from '../../model/site';
import {Class} from '../../model/class';
import {Course} from '../../model/course';
import {Teacher} from '../../model/teacher';
import {Major} from '../../model/major';
import {Dept} from '../../model/dept';

@Component({
  selector: 'app-lesson-schedule',
  templateUrl: './lesson-schedule.component.html',
  styleUrls: ['./lesson-schedule.component.css']
})
export class LessonScheduleComponent implements OnInit {

  @Input() schedule: Schedule;

  constructor() {
  }

  ngOnInit(): void {
  }

}