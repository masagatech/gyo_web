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
                    // Passenger
                    
                    // { path: 'teacherleave', loadChildren: './teacherleave#TeacherLeaveReportsModule' },

                    { path: 'classtimeTable', loadChildren: './classtimetable#ClassTimeTableReportsModule' },
                    
                    { path: ':psngrtype', loadChildren: './passenger#PassengerReportsModule' },
                    { path: ':psngrtype/birthday', loadChildren: './passengerbirthday#PassengerBirthdayReportsModule' },

                    { path: ':psngrtype/leave', loadChildren: './leave#ERPLeaveReportsModule' },
                    { path: ':psngrtype/attendance', loadChildren: './attendance#AttendanceReportsModule' },
                    { path: ':psngrtype/timetable', loadChildren: './timetable#TimetableModule' },
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

export class ERPReportsModule {

}