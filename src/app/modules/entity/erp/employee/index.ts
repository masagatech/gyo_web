import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthGuard, SharedComponentModule, CommonService } from '@services';

import { AddEmployeeComponent } from './aded/addemp.comp';
import { ViewEmployeeComponent } from './view/viewemp.comp';
import { ViewProfileComponent } from './profile/viewprofile.comp';

import { EmployeeService, ClassService } from '@services/master';

import { DataGridModule, PanelModule, TabViewModule, FileUploadModule } from 'primeng/primeng';

export const routes = [
  {
    path: '', children: [
      {
        path: '', component: ViewEmployeeComponent, canActivate: [AuthGuard],
        data: { "module": "erppsngr", "submodule": "psngrprof", "rights": "view", "urlname": "/employee" }
      },
      {
        path: 'profile/:id', component: ViewProfileComponent, canActivate: [AuthGuard],
        data: { "module": "erppsngr", "submodule": "psngrprof", "rights": "view", "urlname": "/employee" }
      },
      {
        path: 'add', component: AddEmployeeComponent, canActivate: [AuthGuard],
        data: { "module": "erppsngr", "submodule": "psngrprof", "rights": "add", "urlname": "/add" }
      },
      {
        path: 'edit/:id', component: AddEmployeeComponent, canActivate: [AuthGuard],
        data: { "module": "erppsngr", "submodule": "psngrprof", "rights": "edit", "urlname": "/edit" }
      }
    ]
  },
];

@NgModule({
  declarations: [
    AddEmployeeComponent,
    ViewEmployeeComponent,
    ViewProfileComponent
  ],

  imports: [
    CommonModule, FormsModule, SharedComponentModule, RouterModule.forChild(routes),
    DataGridModule, PanelModule, TabViewModule, FileUploadModule
  ],

  providers: [AuthGuard, CommonService, EmployeeService, ClassService]
})

export class EmployeeModule {
  public static routes = routes;
}
