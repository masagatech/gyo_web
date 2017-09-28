import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ERPTransactionComponent } from '../transaction/transaction.comp';
import { AuthGuard } from '@services';

import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

export const routes = [
    {
        path: '',
        component: ERPTransactionComponent,
        canActivate: [AuthGuard],
        children: [
            {
                path: '',
                children: [
                    { path: 'classschedule', loadChildren: './classschedule#ClassScheduleModule' },
                    { path: 'classfees', loadChildren: './classfees#ClassFeesModule' },
                    { path: 'assignment', loadChildren: './assignment#AssignmentModule' },
                    { path: 'notification', loadChildren: './notification#NotificationModule' },
                    { path: 'announcement', loadChildren: './announcement#AnnouncementModule' },
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
        ERPTransactionComponent
    ],
    providers: [AuthGuard]
})

export class ERPTransactionModule {

}
