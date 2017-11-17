import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { EntityComponent } from '../entity/entity.comp';
import { AuthGuard, SharedComponentModule } from '@services';

import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

export const routes = [
    {
        path: '',
        component: EntityComponent,
        canActivate: [AuthGuard],
        children: [
            {
                path: '',
                children: [
                    // Dashboard
                    { path: '', loadChildren: './dashboard#DashboardModule' },

                    // ERP
                    { path: '', loadChildren: './erp#ERPModule' },
                    
                    // Entity
                    { path: 'master', loadChildren: './master#MasterModule' },

                    { path: 'master', loadChildren: '../admin/masterofmaster#MOMModule' },
                    
                    // Transaction
                    { path: 'transaction', loadChildren: './transaction#TransactionModule' },
                    
                    // Transport
                    { path: 'transport', loadChildren: './transport#TransportModule' },
                    
                    // Trip Tracking
                    { path: 'triptracking', loadChildren: './triptracking#TripTrackingModule' },
                    
                    // Trip Tracking V1
                    { path: 'triptrackingv1', loadChildren: './triptrackingv1#TripTrackingV1Module' },
                    
                    // Setting
                    { path: 'settings', loadChildren: './settings#SettingsModule' },

                    // Marketing
                    { path: 'marketing', loadChildren: './marketing#MarketingModule' },
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
        EntityComponent
    ],
    providers: [AuthGuard]
})

export class EntityModule {

}
