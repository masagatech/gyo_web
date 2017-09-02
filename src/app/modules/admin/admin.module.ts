import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AdminComponent } from '../admin/admin.comp';
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
                    // Workspace
                    { path: 'workspace', loadChildren: './workspace#WorkspaceModule' },

                    // My Workspace
                    { path: 'myworkspace', loadChildren: './myworkspace#MyWorkspaceModule' },
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
