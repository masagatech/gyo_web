import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AdminComponent } from '../admin/admin.comp';
import { AuthGuard } from '../_services/authguard-service';
import { SharedComponentModule } from '../_shared/sharedcomp.module';

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
                    { path: '', loadChildren: './workspace#WorkspaceModule' },
                    // { path: 'no-page', component: NoPageComponent },
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
        AdminComponent,
        // NoPageComponent,
    ],
    providers: [AuthGuard]
})

export class AdminModule {

}
