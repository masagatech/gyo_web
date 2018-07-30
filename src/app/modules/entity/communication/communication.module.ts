import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommunicationComponent } from './communication.comp';
import { AuthGuard } from '@services';

import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

export const routes = [
    {
        path: '',
        component: CommunicationComponent,
        canActivate: [AuthGuard],
        children: [
            {
                path: '',
                children: [
                    { path: 'notification', loadChildren: './notification#NotificationModule' },
                    { path: 'announcement', loadChildren: './announcement#AnnouncementModule' },
                    { path: 'homework', loadChildren: './assignment#AssignmentModule' },
                    { path: 'teacherremark', loadChildren: './teacherremark#TeacherRemarkModule' },

                    { path: 'noticeboard/:psngrtype', loadChildren: './noticeboard#NoticeboardModule' },
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
        CommunicationComponent
    ],
    providers: [AuthGuard]
})

export class CommunicationModule {

}
