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

                    { path: 'classtimetable', loadChildren: './classtimetable#ClassTimeTableReportsModule' },
                    
                    { path: 'erp/student/generalregister', loadChildren: './generalregister#GeneralRegisterReportsModule' },
                    { path: 'erp/student/prospectuswise', loadChildren: './prospectuswise#ProspectusWiseReportsModule' },
                    { path: 'erp/student/categorywise', loadChildren: './categorywise#CategoryWiseReportsModule' },
                    { path: 'erp/student/agewise', loadChildren: './agewise#AgeWiseReportsModule' },
                    
                    { path: 'erp/student/dashboard', loadChildren: './studentdashboard#StudentDashboardModule' },
                    
                    { path: 'erp/:psngrtype/profile', loadChildren: './passenger#PassengerReportsModule' },
                    { path: 'erp/:psngrtype/birthday', loadChildren: './passengerbirthday#PassengerBirthdayReportsModule' },
                    { path: 'erp/:psngrtype/left', loadChildren: './passengerleft#PassengerLeftReportsModule' },

                    { path: 'erp/teacher/leave', loadChildren: './teacherleave#TeacherLeaveReportsModule' },
                    
                    { path: 'erp/student/classwiseattendance', loadChildren: './classwiseattnd#ClassWiseAttednacneReportsModule' },
                    { path: 'erp/student/monthlypresence', loadChildren: './monthlypresence#MonthlyPresenceReportsModule' },

                    { path: 'erp/:psngrtype/attendance', loadChildren: './attendance#AttendanceReportsModule' },
                    { path: 'erp/:psngrtype/leave', loadChildren: './leave#ERPLeaveReportsModule' },
                    { path: 'erp/:psngrtype/holiday', loadChildren: './holiday#HolidayReportsModule' },
                    { path: 'erp/:psngrtype/timetable', loadChildren: './timetable#TimetableReportsModule' },
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