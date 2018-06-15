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

                    { path: 'passenger', loadChildren: '../erp/passenger#PassengerReportsModule' },
                    { path: 'passenger/birthday', loadChildren: '../erp/passengerbirthday#PassengerBirthdayReportsModule' },
                    { path: 'passenger/attendance', loadChildren: '../erp/attendance#AttendanceReportsModule' },
                    { path: 'passenger/leave', loadChildren: '../erp/leave#ERPLeaveReportsModule' },
                    { path: 'passenger/holiday', loadChildren: '../erp/holiday#HolidayReportsModule' },
                    { path: 'passenger/left', loadChildren: '../erp/passengerleft#PassengerLeftReportsModule' },

                    // Class
                    { path: 'class', loadChildren: './class#ClassReportsModule' },
                    { path: 'books', loadChildren: './books#BooksReportsModule' },
                    { path: 'chapter', loadChildren: './chapter#ChapterReportsModule' },
                    { path: 'activity', loadChildren: './activity#ActivityReportsModule' },
                    { path: 'gallery', loadChildren: './gallery#GalleryReportsModule' },
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

export class MasterReportsModule {

}