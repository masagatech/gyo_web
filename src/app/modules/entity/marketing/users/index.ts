import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthGuard } from '@services';

import { AddMarketUserComponent } from './aded/adduser.comp';
import { ViewMarketUserComponent } from './view/viewuser.comp';

import { UserService } from '@services/master';

import { LazyLoadEvent, DataTableModule, CheckboxModule, AutoCompleteModule } from 'primeng/primeng';

export const routes = [
  {
    path: '', children: [
      { path: '', component: ViewMarketUserComponent, canActivate: [AuthGuard], data: { "module": "mrktn", "submodule": "mrktnusr", "rights": "view", "urlname": "/user" } },
      { path: 'add', component: AddMarketUserComponent, canActivate: [AuthGuard], data: { "module": "mrktn", "submodule": "mrktnusr", "rights": "add", "urlname": "/add" } },
      { path: 'details/:id', component: AddMarketUserComponent, canActivate: [AuthGuard], data: { "module": "mrktn", "submodule": "mrktnusr", "rights": "edit", "urlname": "/edit" } },
      { path: 'edit/:id', component: AddMarketUserComponent, canActivate: [AuthGuard], data: { "module": "mrktn", "submodule": "mrktnusr", "rights": "edit", "urlname": "/edit" } }
    ]
  },
];


@NgModule({
  declarations: [
    AddMarketUserComponent,
    ViewMarketUserComponent
  ],

  imports: [
    CommonModule, FormsModule, RouterModule.forChild(routes), DataTableModule, CheckboxModule, AutoCompleteModule
  ],

  providers: [AuthGuard, UserService]
})

export class MarketingUserModule {
  public static routes = routes;
}
