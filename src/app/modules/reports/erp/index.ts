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
                    { path: 'leave', loadChildren: './leave#LeaveReportsModule' },
                    { path: 'classschedule', loadChildren: './classschedule#ClassScheduleReportsModule' },
                    { path: 'gallery', loadChildren: './gallery#GalleryReportsModule' },
                    { path: 'exam', loadChildren: './exam#ExamReportsModule' },
                    { path: 'notification', loadChildren: './notification#NotificationReportsModule' },
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