import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ModuleComponent } from '../modules/module.comp';
import { AuthGuard } from '../_services/authguard-service';
import { SharedComponentModule } from '../_shared/sharedcomp.module';
import { NoPageComponent } from '../no-page';

import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

export const routes = [
    {
        path: '',
        component: ModuleComponent,
        canActivate: [AuthGuard],
        children: [
            {
                path: '',
                children: [
                    { path: '', loadChildren: './dashboard#DashboardModule' },

                    // Schedule
                    { path: '', loadChildren: './schedule#ScheduleModule' },

                    // Survey Entries
                    { path: 'surveyentries', loadChildren: './surveyentries#SurveyEntriesModule' },

                    // Masters
                    { path: 'master', loadChildren: './master#MasterModule' },

                    // Reports
                    { path: 'reports', loadChildren: './reports#ReportsModule' },

                    // Setting
                    { path: 'settings', loadChildren: './settings#SettingsModule' },

                    // Marketing
                    { path: 'marketing', loadChildren: './marketing#MarketingModule' },

                    { path: 'no-page', component: NoPageComponent },
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
        ModuleComponent,
        // NoContentComponent,
        NoPageComponent,
    ],
    providers: [AuthGuard]
})

export class ModuleModule {

}
