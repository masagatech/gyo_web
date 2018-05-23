import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedComponentModule } from '@services';
import { AuthGuard } from '@services';

import { AuditLogReportsComponent } from './rptal.comp';
import { LogReportService } from '@services/reports';

export const routes = [
  {
    path: '', children: [
      {
        path: 'auditlog/:module', component: AuditLogReportsComponent, canActivate: [AuthGuard],
        data: { "module": "auditlog", "submodule": "rptal", "rights": "view", "urlname": "/auditlog" }
      }
    ]
  },
];

@NgModule({
  declarations: [
    AuditLogReportsComponent
  ],

  imports: [
    CommonModule, FormsModule, SharedComponentModule, RouterModule.forChild(routes)
  ],

  providers: [AuthGuard, LogReportService]
})

export class AuditLogModule {
  public static routes = routes;
}
