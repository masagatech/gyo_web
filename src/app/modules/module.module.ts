import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ModuleComponent } from '../modules/module.comp';
import { AuthGuard } from '@services';
import { SharedComponentModule } from '@services';

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
                    // Admin
                    { path: 'admin', loadChildren: './admin#AdminModule' },

                    // Workspace
                    { path: 'workspace', loadChildren: './workspace#WorkspaceModule' },

                    // Entity
                    { path: '', loadChildren: './entity#EntityModule' },

                    // Reports
                    { path: 'reports', loadChildren: './reports#ReportsModule' },

                    // Setting
                    { path: 'settings', loadChildren: './settings#SettingsModule' },
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
        ModuleComponent
    ],
    providers: [AuthGuard]
})

export class ModuleModule {

}
