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
                    
                    // Master Of Master
                    { path: 'master', loadChildren: '../admin/masterofmaster#MOMModule' },
                    
                    // Library
                    { path: 'master', loadChildren: './library#LibraryModule' },
                    
                    // Transaction
                    { path: 'transaction', loadChildren: './transaction#TransactionModule' },
                    
                    // Communication
                    { path: 'communication', loadChildren: './communication#CommunicationModule' },
                    
                    // Transport
                    { path: 'transport', loadChildren: './transport#TransportModule' },
                    
                    // Trip Tracking
                    { path: 'triptracking', loadChildren: './triptracking#TripTrackingModule' },
                    
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
