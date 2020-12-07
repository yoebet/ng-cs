import {
  AfterViewInit, Component, ElementRef, Input,
  OnChanges, SimpleChanges, ViewChild
} from '@angular/core';

import * as moment from 'moment';
import * as echarts from 'echarts';

import {StatisCalendarChart} from '../../common/statis-calendar-chart';
import {FlatSchedulesStatis} from '../../model-table-data/flat-schedules-statis';

@Component({
  selector: 'app-term-statis-chart',
  templateUrl: './term-statis-chart.component.html',
  styleUrls: ['./term-statis-chart.component.css']
})
export class TermStatisChartComponent extends StatisCalendarChart implements AfterViewInit, OnChanges {
  @ViewChild('chart') chartDiv: ElementRef;

  @Input() termStatis: FlatSchedulesStatis;
  @Input() showTitle;

  showMonthLabel = true;
  // const cellRows = Math.ceil((startDate.day() - 1 + data.length) / 7);
  // this.chartHeight = this.calendarTop + cellRows * this.cellSize + this.chartPaddingBottom;
  chartHeight = 50 + this.cellSize + Math.ceil((7 - 1 + 160) / 7) * this.cellSize + this.chartPaddingBottom; // 1830


  inputDataReady(): boolean {
    const ts = this.termStatis;
    if (!ts) {
      return false;
    }
    const term = ts.context.term;
    return term && term.weeks && term.weeks.length > 0;
  }

  get scheduleDatasource(): FlatSchedulesStatis {
    return this.termStatis;
  }

  getCalendarRange(): string | string[] {
    const weeks = this.termStatis.context.term.weeks;
    return [weeks[0].firstDay, weeks[weeks.length - 1].lastDay];
  }

  getStartEndDates(): moment.Moment[] {
    const [start, end] = this.getCalendarRange();
    return [moment(start), moment(end).add(1, 'day')];
  }

  resetChart(): void {
    if (this.myChart) {
      this.myChart.dispose();
    }
    const holder: HTMLDivElement = this.chartDiv.nativeElement as HTMLDivElement;
    this.myChart = echarts.init(holder);
  }

  ngAfterViewInit(): void {
    this.viewInitialized = true;
    this.refreshChart();
  }

  ngOnChanges(changes: SimpleChanges) {
    this.refreshChart();
  }

}