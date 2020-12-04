import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';

import {SinglePerspectiveQueryComponent} from './schedule-page/single-perspective-query/single-perspective-query.component';
import {ScheduleStatisComponent} from './schedule-page/statis/schedule-statis.component';
import {IntegratedQueryComponent} from './schedule-page/integrated-query/integrated-query.component';

const routes: Routes = [
  {path: 'query', component: SinglePerspectiveQueryComponent},
  {path: 'cl/:class-idc', component: SinglePerspectiveQueryComponent},
  {path: 'tc/:teacher-idc', component: SinglePerspectiveQueryComponent},
  {path: 'cr/:classroom-id', component: SinglePerspectiveQueryComponent},
  {path: 'query-i', component: IntegratedQueryComponent},
  {path: 'statis', component: ScheduleStatisComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    // enableTracing: true,
    // useHash: true
  })],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
