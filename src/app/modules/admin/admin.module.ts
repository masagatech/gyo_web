import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AdminComponent } from './admin.comp';
import { AuthGuard, SharedComponentModule } from '@services';

import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

export const routes = [
    {
        path: '',
        component: AdminComponent,
        canActivate: [AuthGuard],
        children: [
            {
                path: '',
                children: [
                    { path: 'nopage', loadChildren: './nopage#NoPageModule' },
                    
                    { path: 'location', loadChildren: './location#LocationModule' },

                    { path: 'qualification', loadChildren: './qualification#QualificationModule' },
                    
                    { path: '', loadChildren: './masterofmaster#MOMModule' },

                    // Workspace
                    { path: 'workspace', loadChildren: './workspace#WorkspaceModule' },

                    // My Workspace
                    { path: 'myworkspace', loadChildren: './myworkspace#MyWorkspaceModule' },

                    // My Profile
                    { path: 'myprofile', loadChildren: './myprofile#MyProfileModule' },

                    // Setting
                    { path: 'settings', loadChildren: './settings#AdminSettingsModule' },
                    
                    // Reports
                    { path: 'reports', loadChildren: './reports#AdminReportsModule' },
                    
                    // Trip Tracking V1
                    { path: 'triptrackingv1', loadChildren: './triptrackingv1#TripTrackingV1Module' },

                    // HelpDesk
                    { path: 'helpdesk', loadChildren: './helpdesk#HelpDeskModule' },
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
        AdminComponent
    ],
    providers: [AuthGuard]
})

export class AdminModule {

}
