import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ModuleComponent } from '../modules/module.comp';

import { SurveyEntriesModule } from './surveyentries';


import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

export const routes = [
  { path: '', children: [
     { path: '', loadChildren: './surveyentries#SurveyEntriesModule'},
     { path: 'surveyentries', loadChildren: './surveyentries#SurveyEntriesModule'},
  ]},
];



@NgModule({
    imports: [RouterModule.forChild(routes),
        FormsModule,
        CommonModule,
    ],
    declarations: [
        ModuleComponent
    ]
})

export class ModuleModule {
    
}
