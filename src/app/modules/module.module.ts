import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ModuleComponent } from '../modules/module.comp';
import { AuthGuard } from '../_services/authguard-service';
import { SharedComponentModule } from '../_shared/sharedcomp.module';

import { DashboardModule } from './dashboard';

import { MarketingDashboardModule } from './marketing/dashboard';
import { ReportsModule } from './marketing/reports';

import { PassengerAttendanceReportsModule } from './reports/passengerattendance';
import { DailyAttendanceReportsModule } from './reports/dailyattendance';
import { DriverAttendanceReportsModule } from './reports/driverattendance';
import { AttendentAttendanceReportsModule } from './reports/attendentattendance';

import { SurveyEntriesModule } from './surveyentries';
import { OwnerModule } from './owner';
import { DriverModule } from './driver';
import { BatchModule } from './batch';
import { PassengerModule } from './passenger';
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
                    { path: 'marketing', loadChildren: './marketing/dashboard#MarketingDashboardModule' },
                    { path: 'reports', loadChildren: './marketing/reports#ReportsModule' },
                    { path: 'market_user', loadChildren: './marketing/users#MarketingUserModule' },

                    // Reports
                    { path: 'reports', loadChildren: './reports#ReportsModule' },

                    // Schedule
                    { path: '', loadChildren: './schedule#ScheduleModule' },

                    // Survey Entries
                    { path: 'surveyentries', loadChildren: './surveyentries#SurveyEntriesModule' },

                    // Masters
                    { path: 'master', loadChildren: './master#MasterModule' },

                    // Setting
                    { path: 'settings', loadChildren: './settings#SettingsModule' },
                ]
            }
        ]
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes),
        SharedComponentModule,
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
