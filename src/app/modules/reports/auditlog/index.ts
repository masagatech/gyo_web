import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedComponentModule, AuthGuard } from '@services';
import { LogReportService } from '@services/reports';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { AuditLogComponent } from './auditlog.comp';

export const routes = [
  {
    path: '', children: [
      {
        path: '', component: AuditLogComponent, canActivate: [AuthGuard],
        data: { "module": "auditlog", "submodule": "rptal", "rights": "view", "urlname": "/auditlog" }
      }
    ]
  },
];

@NgModule({
  declarations: [
    AuditLogComponent
  ],

  imports: [
    CommonModule, FormsModule, SharedComponentModule, RouterModule.forChild(routes)
  ],

  providers: [AuthGuard, LogReportService]
})

export class AuditLogModule {
  public static routes = routes;
}
