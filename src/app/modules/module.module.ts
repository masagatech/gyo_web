import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ModuleComponent } from '../modules/module.comp';

import { SurveyEntriesModule } from './surveyentries';
import { BatchModule } from './batch';
import { StudentModule } from './student';
import { CreateScheduleModule } from './createschedule';
import { ChangeScheduleModule } from './changeschedule';

import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

export const routes = [
    {
        path: '', children: [
            { path: '', loadChildren: './surveyentries#SurveyEntriesModule' },
            { path: 'surveyentries', loadChildren: './surveyentries#SurveyEntriesModule' },
            { path: 'batch', loadChildren: './batch#BatchModule' },
            { path: 'student', loadChildren: './student#StudentModule' },
            { path: 'createschedule', loadChildren: './createschedule#CreateScheduleModule' },
            { path: 'changeschedule', loadChildren: './changeschedule#ChangeScheduleModule' },
        ]
    },
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
