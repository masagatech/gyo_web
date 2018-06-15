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
                    { path: 'exam', loadChildren: './exam#ExamReportsModule' },
                    { path: 'examresult', loadChildren: './examresult#ExamResultReportsModule' },
                    
                    { path: 'assesment', loadChildren: './assesment#AssesmentReportsModule' },
                    { path: 'assesmentresult', loadChildren: './assesmentresult#AssesmentResultReportsModule' },
                    
                    { path: 'feescollection', loadChildren: './feescollection#FeesCollectionReportsModule' },
                    { path: 'studentfees', loadChildren: './studentfees#StudentFeesReportsModule' },
                    { path: 'dailyfees', loadChildren: './dailyfees#DailyFeesReportsModule' },
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

export class TransactionReportsModule {

}