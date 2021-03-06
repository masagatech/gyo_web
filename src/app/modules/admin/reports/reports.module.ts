import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthGuard, SharedComponentModule } from '@services';

import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { AdminReportsComponent } from './reports.comp';

export const routes = [
    {
        path: '',
        component: AdminReportsComponent,
        canActivate: [AuthGuard],
        children: [
            {
                path: '',
                children: [
                    { path: 'transport', loadChildren: './transport#AdminTransportReportsModule' },
                    { path: 'transaction', loadChildren: './transaction#AdminTransactionReportsModule' },
                    { path: 'master', loadChildren: './master#AdminMasterReportsModule' },
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
        AdminReportsComponent
    ],
    providers: [AuthGuard]
})

export class AdminReportsModule {

}
