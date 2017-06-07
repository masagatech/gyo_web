import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { AddCompanyComponent } from './aded/addcmp.comp';
import { ViewCompanyComponent } from './view/viewcmp.comp';

import { CompanyService } from '../../_services/company/cmp-service';

import { LazyLoadEvent, DataTableModule, CheckboxModule, AutoCompleteModule } from 'primeng/primeng';

export const routes = [
  {
    path: '', children: [
      { path: '', component: ViewCompanyComponent },
      { path: 'add', component: AddCompanyComponent },
      { path: 'details/:id', component: AddCompanyComponent },
      { path: 'edit/:id', component: AddCompanyComponent }
    ]
  },
];


@NgModule({
  declarations: [
    AddCompanyComponent,
    ViewCompanyComponent
  ],

  imports: [
    CommonModule, FormsModule, RouterModule.forChild(routes), DataTableModule, CheckboxModule, AutoCompleteModule
  ],

  providers: [CompanyService]
})

export class CompanyModule {
  public static routes = routes;
}
