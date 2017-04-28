import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { AddStudentComponent } from './aded/addstudent.comp';
import { ViewStudentComponent } from './view/viewstudent.comp';

import { StudentService } from '../../_services/student/student-service';

import { LazyLoadEvent, DataTableModule, CheckboxModule, AutoCompleteModule } from 'primeng/primeng';
import { DropzoneModule } from 'ngx-dropzone-wrapper';
import { DropzoneConfigInterface } from 'ngx-dropzone-wrapper';

export const routes = [
  {
    path: '', children: [
      { path: '', component: ViewStudentComponent },
      { path: 'add', component: AddStudentComponent },
      { path: 'details/:id', component: AddStudentComponent },
      { path: 'edit/:id', component: AddStudentComponent }
    ]
  },
];


@NgModule({
  declarations: [
    AddStudentComponent,
    ViewStudentComponent
  ],

  imports: [
    CommonModule, FormsModule, RouterModule.forChild(routes), DataTableModule, CheckboxModule, AutoCompleteModule,
     DropzoneModule.forRoot()
  ],

  providers: [StudentService]
})

export class StudentModule {
  public static routes = routes;
}
