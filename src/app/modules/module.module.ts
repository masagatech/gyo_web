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
                    { path: 'passengerattendance', loadChildren: './reports/passengerattendance#PassengerAttendanceReportsModule' },
                    { path: 'dailyattendance', loadChildren: './reports/dailyattendance#DailyAttendanceReportsModule' },
                    { path: 'driverattendance', loadChildren: './reports/driverattendance#DriverAttendanceReportsModule' },
                    { path: 'attendantattendance', loadChildren: './reports/attendentattendance#AttendentAttendanceReportsModule' },

                    // Trip Tracking
                    { path: 'triptracking', loadChildren: './triptracking#TripTrackingModule' },
                    { path: 'surveyentries', loadChildren: './surveyentries#SurveyEntriesModule' },

                    // Masters
                    { path: 'master', loadChildren: './master#MasterModule' },

                    { path: 'entity', loadChildren: './entity#EntityModule' },
                    { path: 'holiday', loadChildren: './holiday#HolidayModule' },
                    { path: 'batch', loadChildren: './batch#BatchModule' },
                    { path: 'owner', loadChildren: './owner#OwnerModule' },
                    { path: 'driver', loadChildren: './driver#DriverModule' },
                    { path: 'vehicle', loadChildren: './vehicle#VehicleModule' },
                    { path: 'passenger', loadChildren: './passenger#PassengerModule' },
                    { path: 'user', loadChildren: './users#UserModule' },

                    // Setting
                    { path: 'setting', loadChildren: './userrights#UserRightsModule' },
                    { path: 'userrights', loadChildren: './userrights#UserRightsModule' },

                    // Schedule
                    { path: 'createschedule', loadChildren: './createschedule#CreateScheduleModule' },
                    { path: 'changeschedule', loadChildren: './changeschedule#ChangeScheduleModule' },

                    // Merchant
                    { path: 'merchant', loadChildren: './merchant#MerchantModule' },
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
