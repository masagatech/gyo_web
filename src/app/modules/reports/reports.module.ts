import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthGuard, SharedComponentModule } from '@services';

import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { ReportsComponent } from './reports.comp';

export const routes = [
    {
        path: '',
        component: ReportsComponent,
        canActivate: [AuthGuard],
        children: [
            {
                path: '',
                children: [
                    { path: '', loadChildren: './erp#ERPReportsModule' },
                    
                    { path: 'master', loadChildren: './master#MasterReportsModule' },
                    { path: 'transaction', loadChildren: './transaction#TransactionReportsModule' },
                    { path: 'communication', loadChildren: './communication#CommunicationReportsModule' },
                    { path: 'transport', loadChildren: './transport#TransportReportsModule' },

                    // Log
                    { path: 'log', loadChildren: './log#LogReportsModule' },
                    { path: 'auditlog/:module', loadChildren: './auditlog#AuditLogModule' },

                    // Distance
                    { path: 'distance', loadChildren: './distance#DistanceReportsModule' },
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
        ReportsComponent
    ],
    providers: [AuthGuard]
})

export class ReportsModule {

}
