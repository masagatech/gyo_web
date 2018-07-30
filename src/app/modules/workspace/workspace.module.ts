import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { WorkspaceComponent } from './workspace.comp';
import { AuthGuard, SharedComponentModule } from '@services';

import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

export const routes = [
    {
        path: '',
        component: WorkspaceComponent,
        canActivate: [AuthGuard],
        children: [
            {
                path: '',
                children: [
                    { path: '', loadChildren: './dashboard#DashboardModule' },
                    { path: 'entity', loadChildren: './entity#EntityModule' },
                    { path: 'user', loadChildren: './users#UserModule' },
                    { path: 'content', loadChildren: './content#ContentModule' },
                    { path: 'contentdetails', loadChildren: './contentdetails#ContentDetailsModule' },
                    { path: 'contententitymap', loadChildren: './contententitymap#ContentEntityMapModule' },
                    { path: 'smspack', loadChildren: './smspack#SMSPackModule' },
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
        WorkspaceComponent
    ],
    providers: [AuthGuard]
})

export class WorkspaceModule {

}
