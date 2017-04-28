import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ModuleComponent } from '../modules/module.comp';

import { SurveyEntriesModule } from './surveyentries';
import { OwnerModule } from './owner';
import { DriverModule } from './driver';
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
            { path: 'school', loadChildren: './school#SchoolModule' },
            { path: 'holiday', loadChildren: './holiday#HolidayModule' },
            { path: 'batch', loadChildren: './batch#BatchModule' },
            { path: 'owner', loadChildren: './owner#OwnerModule' },
            { path: 'driver', loadChildren: './driver#DriverModule' },
            { path: 'student', loadChildren: './student#StudentModule' },
            { path: 'user', loadChildren: './users#UserModule' },
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
