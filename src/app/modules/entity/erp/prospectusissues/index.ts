import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthGuard } from '@services';

import { AddProspectusIssuesComponent } from './aded/addprspctissue.comp';
import { ViewProspectusIssuesComponent } from './view/viewprspctissue.comp';

import { ProspectusService } from '@services/erp';

import { LazyLoadEvent, DataTableModule, AutoCompleteModule, FileUploadModule } from 'primeng/primeng';

export const routes = [
  {
    path: '', children: [
      {
        path: '', component: ViewProspectusIssuesComponent, canActivate: [AuthGuard],
        data: { "module": "erp", "submodule": "ass", "rights": "view", "urlname": "/prospectusissues" }
      },
      {
        path: 'add', component: AddProspectusIssuesComponent, canActivate: [AuthGuard],
        data: { "module": "erp", "submodule": "ass", "rights": "add", "urlname": "/add" }
      },
      {
        path: 'edit/:id', component: AddProspectusIssuesComponent, canActivate: [AuthGuard],
        data: { "module": "erp", "submodule": "ass", "rights": "edit", "urlname": "/edit" }
      }
    ]
  },
];

@NgModule({
  declarations: [
    AddProspectusIssuesComponent,
    ViewProspectusIssuesComponent
  ],

  imports: [
    CommonModule, FormsModule, RouterModule.forChild(routes), DataTableModule, AutoCompleteModule, FileUploadModule
  ],

  providers: [AuthGuard, ProspectusService]
})

export class ProspectusIssuesModule {
  public static routes = routes;
}
