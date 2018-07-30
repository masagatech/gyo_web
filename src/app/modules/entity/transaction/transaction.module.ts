import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ERPTransactionComponent } from './transaction.comp';
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
                    { path: 'receiptbook', loadChildren: './receiptbook#ReceiptBookModule' },
                    { path: 'feesstructure', loadChildren: './feesstructure#FeesStructureModule' },
                    { path: 'feesexcemption', loadChildren: './feesexcemption#FeesExcemptionModule' },
                    { path: 'feescollection', loadChildren: './feescollection#FeesCollectionModule' },
                    
                    { path: 'assesment', loadChildren: './assesment#AssesmentModule' },
                    { path: 'assesmentresult', loadChildren: './assesmentresult#AssesmentResultModule' },
                    
                    { path: 'examgrade', loadChildren: './examgrade#ExamGradeModule' },
                    { path: 'exam', loadChildren: './exam#ExamModule' },
                    { path: 'examresult', loadChildren: './examresult#ExamResultModule' },
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

export class TransactionModule {

}
