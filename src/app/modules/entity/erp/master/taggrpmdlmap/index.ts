import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthGuard } from '@services';

import { AddTagGroupModuleMapComponent } from './aded/addtgm.comp';
import { ViewTagGroupModuleMapComponent } from './view/viewtgm.comp';

import { TagService } from '@services/erp';

import { LazyLoadEvent, DataTableModule, AutoCompleteModule, FileUploadModule } from 'primeng/primeng';

export const routes = [
  {
    path: '', children: [
      {
        path: '', component: ViewTagGroupModuleMapComponent, canActivate: [AuthGuard],
        data: { "module": "pentt", "submodule": "taggrpmdlmap", "rights": "view", "urlname": "/taggroupmodulemap" }
      },
      {
        path: 'add', component: AddTagGroupModuleMapComponent, canActivate: [AuthGuard],
        data: { "module": "pentt", "submodule": "taggrpmdlmap", "rights": "add", "urlname": "/add" }
      },
      {
        path: 'edit/:id', component: AddTagGroupModuleMapComponent, canActivate: [AuthGuard],
        data: { "module": "pentt", "submodule": "taggrpmdlmap", "rights": "edit", "urlname": "/edit" }
      }
    ]
  },
];

@NgModule({
  declarations: [
    AddTagGroupModuleMapComponent,
    ViewTagGroupModuleMapComponent
  ],

  imports: [
    CommonModule, FormsModule, RouterModule.forChild(routes), DataTableModule, AutoCompleteModule, FileUploadModule
  ],

  providers: [AuthGuard, TagService]
})

export class TagGroupModuleMapModule {
  public static routes = routes;
}
