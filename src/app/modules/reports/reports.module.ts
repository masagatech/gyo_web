import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthGuard, SharedComponentModule } from '@services';

import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { ReportsComponent } from '../reports/reports.comp';

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
                    
                    { path: 'workspace', loadChildren: './workspace#WorkspaceReportsModule' },
                    { path: 'master', loadChildren: './master#MasterReportsModule' },
                    { path: 'transaction', loadChildren: './transaction#TransactionReportsModule' },
                    { path: 'transport', loadChildren: './transport#TransportReportsModule' },

                    { path: 'log', loadChildren: './log#LogReportsModule' },
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
