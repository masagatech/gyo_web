import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { AddSchoolComponent } from './aded/addschool.comp';
import { ViewSchoolComponent } from './view/viewschool.comp';

import { SchoolService } from '../../_services/school/school-service';

import { LazyLoadEvent, DataTableModule, CheckboxModule } from 'primeng/primeng';

export const routes = [
  {
    path: '', children: [
      { path: '', component: ViewSchoolComponent },
      { path: 'add', component: AddSchoolComponent },
      { path: 'details/:id', component: AddSchoolComponent },
      { path: 'edit/:id', component: AddSchoolComponent }
    ]
  },
];

@NgModule({
  declarations: [
    AddSchoolComponent,
    ViewSchoolComponent
  ],

  imports: [
    CommonModule, FormsModule, RouterModule.forChild(routes), DataTableModule, CheckboxModule
  ],

  providers: [SchoolService]
})

export class SchoolModule {
  public static routes = routes;
}
