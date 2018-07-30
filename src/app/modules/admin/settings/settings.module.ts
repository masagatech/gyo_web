import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AdminSettingsComponent } from './settings.comp';
import { AuthGuard, SharedComponentModule } from '@services';

import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

export const routes = [
    {
        path: '',
        component: AdminSettingsComponent,
        canActivate: [AuthGuard],
        children: [
            {
                path: '',
                children: [
                    { path: 'userworkspacemap', loadChildren: './userworkspacemap#UserWorkspaceMapModule' },
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
        AdminSettingsComponent
    ],
    providers: [AuthGuard]
})

export class AdminSettingsModule {

}
