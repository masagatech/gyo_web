import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ModuleComponent } from '../modules/module.comp';
import { AuthGuard } from '../_services/authguard-service';

import { HeaderComponent } from './usercontrol/header/header.comp'
import { LeftSideBarComponent } from './usercontrol/leftsidebar/leftsidebar.comp'
import { DashboardModule } from './dashboard';

import { StudentAttendanceReportsModule } from './reports/studentattendance';
import { DailyAttendanceReportsModule } from './reports/dailyattendance';
import { DriverAttendanceReportsModule } from './reports/driverattendance';
import { AttendentAttendanceReportsModule } from './reports/attendentattendance';

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
                    { path: 'studentattendance', loadChildren: './reports/studentattendance#StudentAttendanceReportsModule' },
                    { path: 'dailyattendance', loadChildren: './reports/dailyattendance#DailyAttendanceReportsModule' },
                    { path: 'driverattendance', loadChildren: './reports/driverattendance#DriverAttendanceReportsModule' },
                    { path: 'attendantattendance', loadChildren: './reports/attendentattendance#AttendentAttendanceReportsModule' },

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
        ModuleComponent,
        HeaderComponent,
        LeftSideBarComponent
    ],
    providers: [AuthGuard]
})

export class ModuleModule {

}
