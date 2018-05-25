import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthGuard, SharedComponentModule, CommonService } from '@services';

import { ViewSimComponent } from './view/viewsim.comp';
import { AddSimComponent } from './aded/addsim.comp';

import { InventoryService } from '@services/master';

import { AutoCompleteModule, FileUploadModule } from 'primeng/primeng';

export const routes = [
  {
    path: '', children: [
      {
        path: '', component: ViewSimComponent, canActivate: [AuthGuard],
        data: { "module": "pws", "submodule": "inv", "rights": "view", "urlname": "/sim" }
      },{
        path: 'add', component: AddSimComponent, canActivate: [AuthGuard],
        data: { "module": "pws", "submodule": "inv", "rights": "add", "urlname": "/add" }
      },{
        path: 'edit/:id', component: AddSimComponent, canActivate: [AuthGuard],
        data: { "module": "pws", "submodule": "inv", "rights": "edit", "urlname": "/edit" }
      },
    ]
  },
];

@NgModule({
  declarations: [
    ViewSimComponent,
    AddSimComponent
  ],

  imports: [
    CommonModule, FormsModule, RouterModule.forChild(routes), AutoCompleteModule, FileUploadModule, SharedComponentModule
  ],

  providers: [AuthGuard, InventoryService, CommonService]
})

export class SimModule {
  public static routes = routes;
}
