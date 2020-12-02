import {Moment} from 'moment';

import * as echarts from 'echarts';
import {EChartOption} from 'echarts';
import Format = echarts.EChartOption.Tooltip.Format;

import {ScheduleContext} from '../model2/schedule-context';
import {DaySchedule} from '../model2/day-schedule';
import {DateDim} from '../model/date-dim';
import {DATE_FORMAT} from '../config';

export abstract class ScheduleCalendarChart {

  context: ScheduleContext;

  cellSize = 70;
  chartPaddingBottom = 30;

  chartWidth = this.cellSize * 9;
  chartHeight = 500;
  title: string;

  myChart: echarts.ECharts;

  get calendarTop(): number {
    return (this.title ? 50 : 0) + this.cellSize;
  }

  abstract getDaySchedulesWithLessons(): DaySchedule[];

  abstract getCalendarRange(): string | string[];

  abstract getStartAndEndDates(): Moment[];

  abstract inputDataReady(): boolean;

  abstract setTitle(): void;

  refreshChart(): void {

    if (!this.inputDataReady() || !this.myChart) {
      return;
    }

    this.setTitle();

    const [startDate, endDatePlus1Moment] = this.getStartAndEndDates();

    const daySchedules: DaySchedule[] = this.getDaySchedulesWithLessons();

    const dateMap: Map<string, DaySchedule> = new Map<string, DaySchedule>();

    for (const daySchedule of daySchedules) {
      const dateDim: DateDim = daySchedule.dateDim;
      dateMap.set(dateDim.date, daySchedule);
    }

    const data: DaySchedule[] = [];

    let maxLessonSpansCount = 0;

    const dateMoment = startDate.clone();
    while (dateMoment.isBefore(endDatePlus1Moment, 'day')) {
      const ds = dateMoment.format(DATE_FORMAT);
      let daySchedule = dateMap.get(ds);
      if (daySchedule) {
        if (daySchedule.lessonSpansCount > maxLessonSpansCount) {
          maxLessonSpansCount = daySchedule.lessonSpansCount;
        }
      } else {
        const dateDim = DateDim.fromMoment(dateMoment);
        daySchedule = DaySchedule.emptySchedule(dateDim);
      }
      data.push(daySchedule);
      dateMoment.add(1, 'day');
    }

    const visualMapMax = maxLessonSpansCount > 4 ? maxLessonSpansCount : 4;

    // const cellRows = Math.ceil((startDate.day() - 1 + data.length) / 7);
    // this.chartHeight = this.calendarTop + cellRows * this.cellSize + this.chartPaddingBottom;

    const heatmapData: any[] = data.map(d => {
      return {value: [d.dateDim.date, d.lessonSpansCount], daySchedule: d};
    });
    const scatterData: any[] = heatmapData;

    const component = this;

    const option1: EChartOption = {
      color: null,
      title: this.title ? {
        text: this.title,
        top: 10,
        left: 'center'
      } : null,
      tooltip: {
        formatter(params: Format) {
          const daySchedule = params.data.daySchedule as DaySchedule;
          // console.log(daySchedule);
          return DaySchedule.lessonsHtml(daySchedule, component.context);
        }
      },

      visualMap: [{
        show: false,
        min: 0,
        max: visualMapMax,
        calculable: true,
        seriesIndex: [2],
        orient: 'horizontal',
        left: 'center',
        bottom: 20,
        inRange: {
          color: ['#e0ffff', '#006edd'],
          opacity: 0.3
        },
        controller: {
          inRange: {
            opacity: 0.5
          }
        }
      }],

      calendar: [{
        left: 'center',
        top: this.calendarTop,
        cellSize: [this.cellSize, this.cellSize],
        yearLabel: {show: false},
        orient: 'vertical',
        dayLabel: {
          firstDay: 1,
          nameMap: 'cn'
        },
        monthLabel: {
          show: false
        },
        range: this.getCalendarRange()
      }],

      series: [
        {
          type: 'scatter',
          coordinateSystem: 'calendar',
          symbolSize: 0.1,
          label: {
            show: true,
            formatter(params) {
              const daySchedule = params.data.daySchedule as DaySchedule;
              return daySchedule.dateDim.dayOfMonth + '\n\n\n\n';
            },
            color: '#000'
          },
          data: scatterData
        },
        {
          type: 'scatter',
          coordinateSystem: 'calendar',
          symbolSize: 0.1,
          label: {
            show: true,
            formatter(params) {
              const daySchedule = params.data.daySchedule as DaySchedule;
              const lc = daySchedule.lessonSpansCount;
              if (lc === 0) {
                return '';
              }
              return '\n\n\n' + lc + '\n';
            },
            fontSize: 14,
            fontWeight: 700,
            color: '#a00'
          },
          data: scatterData
        },
        {
          name: '节数',
          type: 'heatmap',
          coordinateSystem: 'calendar',
          data: heatmapData
        }
      ]
    };

    this.myChart.setOption(option1);
  }

}