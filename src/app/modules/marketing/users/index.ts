import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { AddMarketUserComponent } from './aded/adduser.comp';
import { ViewMarketUserComponent } from './view/viewuser.comp';

import { UserService } from '@services/master';

import { LazyLoadEvent, DataTableModule, CheckboxModule, AutoCompleteModule } from 'primeng/primeng';

export const routes = [
  {
    path: '', children: [
      { path: '', component: ViewMarketUserComponent },
      { path: 'add', component: AddMarketUserComponent },
      { path: 'details/:id', component: AddMarketUserComponent },
      { path: 'edit/:id', component: AddMarketUserComponent }
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

  providers: [UserService]
})

export class MarketingUserModule {
  public static routes = routes;
}
