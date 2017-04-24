import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { DataTableModule } from 'primeng/primeng'

import { SurveyEntriesComp } from './surveyentries.comp';
import { SurveyDetailsComp } from './surveydetails/surveydetails.comp';

import { DriverInfoService } from '../../_services/driverinfo/driverinfo-service'

export const routes = [
  {
    path: '', children: [
      { path: '', component: SurveyEntriesComp },
      { path: 'details/:id', component: SurveyDetailsComp }
    ]
  },
];

@NgModule({
  declarations: [
    SurveyEntriesComp,
    SurveyDetailsComp
  ],

  imports: [
    CommonModule,
    FormsModule,
    RouterModule.forChild(routes),
    DataTableModule
  ],

  providers: [DriverInfoService]
})

export class SurveyEntriesModule {
  public static routes = routes;
}
