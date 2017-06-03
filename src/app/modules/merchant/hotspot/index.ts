import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { AddHotspotComponent } from './aded/addhtsp.comp';
import { ViewHotspotComponent } from './view/viewhtsp.comp';

import { HotspotService } from '@services/merchant';

import { LazyLoadEvent, DataTableModule } from 'primeng/primeng';

export const routes = [
  {
    path: '', children: [
      { path: '', component: ViewHotspotComponent },
      { path: 'add', component: AddHotspotComponent },
      { path: 'edit/:id', component: AddHotspotComponent }
    ]
  },
];

@NgModule({
  declarations: [
    AddHotspotComponent,
    ViewHotspotComponent
  ],

  imports: [
    CommonModule, FormsModule, RouterModule.forChild(routes), DataTableModule
  ],

  providers: [HotspotService]
})

export class HotspotModule {
  public static routes = routes;
}
