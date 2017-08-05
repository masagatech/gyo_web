import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthGuard } from '../../../_services/authguard-service';

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
                    { path: 'student', loadChildren: './passenger#PassengerAttendanceModule' },
                    { path: 'passenger', loadChildren: './passenger#PassengerAttendanceModule' },

                    { path: 'daily', loadChildren: './daily#DailyAttendanceModule' },
                    { path: 'driver', loadChildren: './driver#DriverAttendanceModule' },

                    { path: 'attendent', loadChildren: './attendent#AttendentAttendanceModule' },
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

export class AttendanceReportsModule {

}
