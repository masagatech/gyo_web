import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthGuard, SharedComponentModule } from '@services';

import { MonthlyClassScheduleReportsComponent } from './monthly/rptmonclssch.comp';
import { WeeklyClassScheduleReportsComponent } from './weekly/rptwkclssch.comp';
import { PeriodClassScheduleReportsComponent } from './period/rptprdclssch.comp';

import { ClassScheduleService } from '@services/erp';

import { LazyLoadEvent, DataTableModule, AutoCompleteModule } from 'primeng/primeng';

export const routes = [
  {
    path: '', children: [
      {
        path: 'monthly', component: MonthlyClassScheduleReportsComponent, canActivate: [AuthGuard],
        data: { "module": "rpt", "submodule": "rptmonclssch", "rights": "view", "urlname": "/monthly" }
      },
      {
        path: 'weekly', component: WeeklyClassScheduleReportsComponent, canActivate: [AuthGuard],
        data: { "module": "rpt", "submodule": "rptwkclssch", "rights": "view", "urlname": "/weekly" }
      },
      {
        path: 'period', component: PeriodClassScheduleReportsComponent, canActivate: [AuthGuard],
        data: { "module": "rpt", "submodule": "rptprdclssch", "rights": "view", "urlname": "/period" }
      }
    ]
  },
];

@NgModule({
  declarations: [
    MonthlyClassScheduleReportsComponent,
    WeeklyClassScheduleReportsComponent,
    PeriodClassScheduleReportsComponent
  ],

  imports: [
    CommonModule, FormsModule, SharedComponentModule, RouterModule.forChild(routes), DataTableModule, AutoCompleteModule
  ],

  providers: [AuthGuard, ClassScheduleService]
})

export class ClassScheduleReportsModule {
  public static routes = routes;
}
