import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedComponentModule } from '../../../_shared/sharedcomp.module';
import { AuthGuard } from '../../../_services/authguard-service';

import { ViewMOMComponent } from './view/viewmom.comp';
import { AddMOMComponent } from './aded/addmom.comp';

import { LazyLoadEvent, DataTableModule, DataListModule } from 'primeng/primeng';

export const routes = [
    {
        path: '', children: [
            { path: '', component: ViewMOMComponent, canActivateChid: [AuthGuard], data: { "module": "set", "submodule": "mom", "rights": "view", "urlname": "/masterofmaster" } },
            { path: 'add', component: AddMOMComponent, canActivateChid: [AuthGuard], data: { "module": "set", "submodule": "mom", "rights": "add", "urlname": "/add" } },
            { path: 'edit/:id', component: AddMOMComponent, canActivateChid: [AuthGuard], data: { "module": "set", "submodule": "mom", "rights": "edit", "urlname": "/edit" } },
        ]
    }
]

@NgModule({
  declarations: [
    ViewMOMComponent,
    AddMOMComponent
  ],

  imports: [
    CommonModule, FormsModule, SharedComponentModule, RouterModule.forChild(routes), DataTableModule, DataListModule
  ],

  providers: [AuthGuard]
})

export class MOMModule {
  public static routes = routes;
}
