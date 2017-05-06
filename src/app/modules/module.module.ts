import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ModuleComponent } from '../modules/module.comp';
import { AuthGuard } from '../_services/authguard-service';

import { DashboardModule } from './dashboard';
import { AttendanceReportsModule } from './reports/attendance';
import { DailyAttendanceReportsModule } from './reports/dailyattendance';
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
        path: '',
        component: ModuleComponent,
        canActivate: [AuthGuard],
        children: [
            {
                path: '',
                children: [
                    { path: '', loadChildren: './dashboard#DashboardModule' },

                    // Reports
                    { path: 'attendance', loadChildren: './reports/attendance#AttendanceReportsModule' },
                    { path: 'dailyattendance', loadChildren: './reports/dailyattendance#DailyAttendanceReportsModule' },

                    // Trip Tracking
                    { path: 'triptracking', loadChildren: './triptracking#TripTrackingModule' },
                    { path: 'surveyentries', loadChildren: './surveyentries#SurveyEntriesModule' },

                    // Masters
                    { path: 'school', loadChildren: './school#SchoolModule' },
                    { path: 'holiday', loadChildren: './holiday#HolidayModule' },
                    { path: 'batch', loadChildren: './batch#BatchModule' },
                    { path: 'owner', loadChildren: './owner#OwnerModule' },
                    { path: 'driver', loadChildren: './driver#DriverModule' },
                    { path: 'student', loadChildren: './student#StudentModule' },
                    { path: 'user', loadChildren: './users#UserModule' },

                    // setting
                    { path: 'setting', loadChildren: './userrights#UserRightsModule' },
                    { path: 'userrights', loadChildren: './userrights#UserRightsModule' },

                    // schedule
                    { path: 'createschedule', loadChildren: './createschedule#CreateScheduleModule' },
                    { path: 'changeschedule', loadChildren: './changeschedule#ChangeScheduleModule' },
                ]
            }
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
    ],
    providers: [AuthGuard]
})

export class ModuleModule {

}
