import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ERPComponent } from '../erp/erp.comp';
import { AuthGuard, SharedComponentModule } from '@services';

import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

export const routes = [
    {
        path: '',
        component: ERPComponent,
        canActivate: [AuthGuard],
        children: [
            {
                path: '',
                children: [
                    { path: 'employee', loadChildren: './employee#EmployeeModule' },
                    { path: 'class', loadChildren: './class#ClassModule' },
                    { path: 'books', loadChildren: './books#BooksModule' },
                    { path: 'activity', loadChildren: './activity#ActivityModule' },
                    { path: 'assignment', loadChildren: './assignment#AssignmentModule' },
                    { path: 'notification', loadChildren: './notification#NotificationModule' },
                    { path: 'announcement', loadChildren: './announcement#AnnouncementModule' },
                    
                    { path: 'holiday', loadChildren: '../reports/workspace/holiday#HolidayReportsModule' },
                    { path: 'leave', loadChildren: '../reports/passenger/passengerleave#PassengerLeaveModule' },
                    { path: 'attendance', loadChildren: '../reports/attendance/passenger#PassengerAttendanceModule' },
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
        ERPComponent
    ],
    providers: [AuthGuard]
})

export class ERPModule {

}
