import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthGuard, SharedComponentModule } from '@services';

import { MonthlyClassTimeTableReportsComponent } from './monthly/rptmonclstmt.comp';
import { WeeklyClassTimeTableReportsComponent } from './weekly/rptwkclstmt.comp';
import { PeriodClassTimeTableReportsComponent } from './period/rptprdclstmt.comp';

import { ClassTimeTableService } from '@services/erp';

import { LazyLoadEvent, DataTableModule, AutoCompleteModule } from 'primeng/primeng';

export const routes = [
  {
    path: '', children: [
      {
        path: 'monthly', component: MonthlyClassTimeTableReportsComponent, canActivate: [AuthGuard],
        data: { "module": "rpt", "submodule": "rptmonclstmt", "rights": "view", "urlname": "/monthly" }
      },
      {
        path: 'weekly', component: WeeklyClassTimeTableReportsComponent, canActivate: [AuthGuard],
        data: { "module": "rpt", "submodule": "rptwkclstmt", "rights": "view", "urlname": "/weekly" }
      },
      {
        path: 'period', component: PeriodClassTimeTableReportsComponent, canActivate: [AuthGuard],
        data: { "module": "rpt", "submodule": "rptprdclstmt", "rights": "view", "urlname": "/period" }
      }
    ]
  },
];

@NgModule({
  declarations: [
    MonthlyClassTimeTableReportsComponent,
    WeeklyClassTimeTableReportsComponent,
    PeriodClassTimeTableReportsComponent
  ],

  imports: [
    CommonModule, FormsModule, SharedComponentModule, RouterModule.forChild(routes), DataTableModule, AutoCompleteModule
  ],

  providers: [AuthGuard, ClassTimeTableService]
})

export class ClassTimeTableReportsModule {
  public static routes = routes;
}
