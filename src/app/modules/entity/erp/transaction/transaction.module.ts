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
                    { path: 'feescollection', loadChildren: './feescollection#FeesCollectionModule' },
                    { path: 'assignment', loadChildren: './assignment#AssignmentModule' },
                    { path: 'assesment', loadChildren: './assesment#AssesmentModule' },
                    { path: 'assesmentresult', loadChildren: './assesmentresult#AssesmentResultModule' },
                    { path: 'exam', loadChildren: './exam#ExamModule' },
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
