import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthGuard } from '@services';

import { ClassRosterComponent } from './viewcr.comp';

import { ClassService } from '@services/erp';

import { LazyLoadEvent, DataTableModule, AutoCompleteModule, FileUploadModule } from 'primeng/primeng';

export const routes = [
  {
    path: '', children: [
      {
        path: '', component: ClassRosterComponent, canActivate: [AuthGuard],
        data: { "module": "erp", "submodule": "tskal", "rights": "view", "urlname": "/class" }
      },
    ]
  },
];

@NgModule({
  declarations: [
    ClassRosterComponent
  ],

  imports: [
    CommonModule, FormsModule, RouterModule.forChild(routes), DataTableModule, AutoCompleteModule, FileUploadModule
  ],

  providers: [AuthGuard, ClassService]
})

export class ClassRosterModule {
  public static routes = routes;
}
