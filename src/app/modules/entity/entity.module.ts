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

                    // Trip Tracking
                    { path: 'triptracking', loadChildren: './triptracking#TripTrackingModule' },

                    // Entity
                    { path: 'master', loadChildren: './master#MasterModule' },

                    // Setting
                    { path: 'settings', loadChildren: './settings#SettingsModule' },

                    // Schedule
                    { path: 'schedule', loadChildren: './schedule#ScheduleModule' },

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
