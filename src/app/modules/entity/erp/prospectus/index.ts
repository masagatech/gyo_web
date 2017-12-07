import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthGuard, SharedComponentModule } from '@services';

import { AddProspectusComponent } from './aded/addprspct.comp';
import { ViewProspectusComponent } from './view/viewprspct.comp';

import { ProspectusService } from '@services/erp';

import { LazyLoadEvent, DataTableModule, AutoCompleteModule, FileUploadModule } from 'primeng/primeng';

export const routes = [
  {
    path: '', children: [
      {
        path: '', component: ViewProspectusComponent, canActivate: [AuthGuard],
        data: { "module": "erp", "submodule": "prospectus", "rights": "view", "urlname": "/prospectus" }
      },
      {
        path: 'add', component: AddProspectusComponent, canActivate: [AuthGuard],
        data: { "module": "erp", "submodule": "prospectus", "rights": "add", "urlname": "/add" }
      },
      {
        path: 'edit/:id', component: AddProspectusComponent, canActivate: [AuthGuard],
        data: { "module": "erp", "submodule": "prospectus", "rights": "edit", "urlname": "/edit" }
      }
    ]
  },
];

@NgModule({
  declarations: [
    AddProspectusComponent,
    ViewProspectusComponent
  ],

  imports: [
    CommonModule, FormsModule, RouterModule.forChild(routes), SharedComponentModule,
    DataTableModule, AutoCompleteModule, FileUploadModule
  ],

  providers: [AuthGuard, ProspectusService]
})

export class ProspectusModule {
  public static routes = routes;
}
