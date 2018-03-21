import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthGuard } from '@services';

import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

export const routes = [
    {
        path: '',
        canActivate: [AuthGuard],
        children: [
            {
                path: '',
                children: [
                    // Master
                    
                    { path: 'route', loadChildren: './route#RouteReportsModule' },
                    { path: 'driver', loadChildren: './driver#DriverReportsModule' },
                    { path: 'vehicle', loadChildren: './vehicle#VehicleReportsModule' },
                    { path: 'batch', loadChildren: './batch#BatchReportsModule' },
                    { path: 'milege', loadChildren: './milege#MilegeReportsModule' },

                    // Attendance
                    
                    { path: 'studentattendance', loadChildren: './passengerattendance#PassengerAttendanceModule' },
                    { path: 'passengerattendance', loadChildren: './passengerattendance#PassengerAttendanceModule' },
                    { path: 'dailyattendance', loadChildren: './dailyattendance#DailyAttendanceModule' },
                    { path: 'driverattendance', loadChildren: './driverattendance#DriverAttendanceModule' },
                    { path: 'attendentattendance', loadChildren: './attendentattendance#AttendentAttendanceModule' },
                    
                    // Student

                    { path: 'studenttrips', loadChildren: './passengertrips#PassengerTripsReportsModule' },
                    { path: 'routewisestudent', loadChildren: './routewisepassenger#RouteWisePassengerModule' },
                    { path: 'directstudent', loadChildren: './directpassenger#DirectPassengerModule' },
                    { path: 'unschedulestudent', loadChildren: './unschedulepassenger#UnschedulePassengerModule' },
                    
                    // Passenger
                    
                    { path: 'passengertrips', loadChildren: './passengertrips#PassengerTripsReportsModule' },
                    { path: 'routewisepassenger', loadChildren: './routewisepassenger#RouteWisePassengerModule' },
                    { path: 'directpassenger', loadChildren: './directpassenger#DirectPassengerModule' },
                    { path: 'unschedulepassenger', loadChildren: './unschedulepassenger#UnschedulePassengerModule' },
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
    providers: [AuthGuard]
})

export class TransportReportsModule {

}