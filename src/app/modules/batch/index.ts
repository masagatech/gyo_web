import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { AddBatchComponent } from './aded/addbatch.comp';
import { ViewBatchComponent } from './view/viewbatch.comp';

import { BatchService } from '../../_services/batch/batch-service';

import { LazyLoadEvent, DataTableModule, CheckboxModule, AutoCompleteModule } from 'primeng/primeng';
import { DropzoneModule } from 'ngx-dropzone-wrapper';
import { DropzoneConfigInterface } from 'ngx-dropzone-wrapper';

export const routes = [
  {
    path: '', children: [
      { path: '', component: ViewBatchComponent },
      { path: 'add', component: AddBatchComponent },
      { path: 'details/:id', component: AddBatchComponent },
      { path: 'edit/:id', component: AddBatchComponent }
    ]
  },
];


@NgModule({
  declarations: [
    AddBatchComponent,
    ViewBatchComponent
  ],

  imports: [
    CommonModule, FormsModule, RouterModule.forChild(routes), DataTableModule, CheckboxModule, AutoCompleteModule,
     DropzoneModule.forRoot()
  ],

  providers: [BatchService]
})

export class BatchModule {
  public static routes = routes;
}
