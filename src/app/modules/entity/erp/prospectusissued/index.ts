import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthGuard, SharedComponentModule } from '@services';

import { AddProspectusIssuedComponent } from './aded/addprspctissd.comp';
import { ViewProspectusIssuedComponent } from './view/viewprspctissd.comp';
import { PendingProspectusIssuedComponent } from './pending/pendprspctissd.comp';
import { ApprovalProspectusIssuedComponent } from './approval/apprprspctissd.comp';

import { ProspectusService } from '@services/erp';

import { LazyLoadEvent, DataTableModule, AutoCompleteModule, FileUploadModule } from 'primeng/primeng';

export const routes = [
  {
    path: '', children: [
      {
        path: '', component: ViewProspectusIssuedComponent, canActivate: [AuthGuard],
        data: { "module": "erp", "submodule": "prspctissd", "rights": "view", "urlname": "/prospectusissued" }
      },
      {
        path: 'add', component: AddProspectusIssuedComponent, canActivate: [AuthGuard],
        data: { "module": "erp", "submodule": "prspctissd", "rights": "add", "urlname": "/add" }
      },
      {
        path: 'edit/:id', component: AddProspectusIssuedComponent, canActivate: [AuthGuard],
        data: { "module": "erp", "submodule": "prspctissd", "rights": "edit", "urlname": "/edit" }
      },
      {
        path: 'approval', component: PendingProspectusIssuedComponent, canActivate: [AuthGuard],
        data: { "module": "erp", "submodule": "prspctappr", "rights": "add", "urlname": "/pending" }
      },
      {
        path: 'approval/:id', component: ApprovalProspectusIssuedComponent, canActivate: [AuthGuard],
        data: { "module": "erp", "submodule": "prspctappr", "rights": "add", "urlname": "/approval" }
      }
    ]
  },
];

@NgModule({
  declarations: [
    ViewProspectusIssuedComponent,
    AddProspectusIssuedComponent,
    PendingProspectusIssuedComponent,
    ApprovalProspectusIssuedComponent
  ],

  imports: [
    CommonModule, FormsModule, RouterModule.forChild(routes), SharedComponentModule,
    DataTableModule, AutoCompleteModule, FileUploadModule
  ],

  providers: [AuthGuard, ProspectusService]
})

export class ProspectusIssuedModule {
  public static routes = routes;
}
