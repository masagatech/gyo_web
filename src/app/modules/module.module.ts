import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ModuleComponent } from './module.comp';
import { AuthGuard, SharedComponentModule } from '@services';

import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { ReloadComponent } from './usercontrol/reload/reload.comp';

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

                    // Inventory
                    { path: 'inventory', loadChildren: './inventory#InventoryModule' },

                    // Entity
                    { path: '', loadChildren: './entity#EntityModule' },

                    // Reports
                    { path: 'reports', loadChildren: './reports#ReportsModule' },

                    // Reoload
                    { path: 'reload', component: ReloadComponent },
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
        ReloadComponent
    ],
    providers: [AuthGuard]
})

export class ModuleModule {

}
